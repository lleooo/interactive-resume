import { useCallback, useEffect, useRef, useState } from 'react';
import type { CharacterState } from './model/animationConfig';
import type { ChatMessage } from './types';

/**
 * - `hidden`: nothing 3D is mounted (mobile's resting state — a flat launcher icon instead)
 * - `idle`: the persistent Companion, docked in the corner, chat not open (desktop's resting state)
 * - `panel`: the mid-sized Chat Panel is open
 * - `immersive`: Immersive Mode — full-screen, reached only via an explicit "expand" from the panel
 */
export type Tier = 'hidden' | 'idle' | 'panel' | 'immersive';

const CHARS_PER_SECOND = 14; // rough reading/speaking pace, language-agnostic enough for a UI cue
const MIN_TALK_MS = 1500;
const MAX_TALK_MS = 6000;

// The current model has no one-shot wave clip to detect the end of, so
// greeting/farewell just hold for a fixed duration instead of waiting on an
// animation-finished event.
const GREETING_MS = 1000;
const FAREWELL_MS = 1000;

function talkDurationFor(text: string): number {
  const ms = (text.length / CHARS_PER_SECOND) * 1000;
  return Math.min(MAX_TALK_MS, Math.max(MIN_TALK_MS, ms));
}

export function useCharacterState(isPending: boolean, messages: ChatMessage[], isDesktop: boolean) {
  const [tier, setTier] = useState<Tier>(() => (isDesktop ? 'idle' : 'hidden'));
  const [characterState, setCharacterState] = useState<CharacterState>('idle');
  const talkTimer = useRef<number | undefined>(undefined);
  const greetingTimer = useRef<number | undefined>(undefined);
  const farewellTimer = useRef<number | undefined>(undefined);
  const lastMessageId = useRef<string | null>(null);

  const isChatOpen = tier === 'panel' || tier === 'immersive';

  const openPanel = useCallback(() => {
    window.clearTimeout(greetingTimer.current);
    window.clearTimeout(farewellTimer.current);
    setTier('panel');
    setCharacterState('greeting');
    greetingTimer.current = window.setTimeout(() => {
      setCharacterState((prev) => (prev === 'greeting' ? 'idle' : prev));
    }, GREETING_MS);
  }, []);

  const expand = useCallback(() => {
    setTier((prev) => (prev === 'panel' ? 'immersive' : prev));
  }, []);

  const collapse = useCallback(() => {
    setTier((prev) => (prev === 'immersive' ? 'panel' : prev));
  }, []);

  // Only offered from the panel tier (see ADR-0001: immersive must collapse
  // to the panel first) — tier stays on 'panel' while the farewell state
  // holds, then a timer drops it to idle/hidden.
  const requestClose = useCallback(() => {
    window.clearTimeout(greetingTimer.current);
    window.clearTimeout(farewellTimer.current);
    setCharacterState('farewell');
    farewellTimer.current = window.setTimeout(() => {
      setTier(isDesktop ? 'idle' : 'hidden');
    }, FAREWELL_MS);
  }, [isDesktop]);

  useEffect(
    () => () => {
      window.clearTimeout(greetingTimer.current);
      window.clearTimeout(farewellTimer.current);
    },
    [],
  );

  // Waiting on the API takes priority over idle/talking, but never interrupts
  // the greeting/farewell one-shot clips.
  useEffect(() => {
    if (!isChatOpen || !isPending) return;
    window.clearTimeout(talkTimer.current);
    setCharacterState((prev) => (prev === 'greeting' ? prev : 'thinking'));
  }, [isPending, isChatOpen]);

  // A freshly arrived bot reply plays the talking loop for roughly as long as
  // it would take to say it out loud, then settles back to idle.
  useEffect(() => {
    if (!isChatOpen || isPending) return;
    const last = messages[messages.length - 1];
    if (!last || last.sender !== 'bot' || last.id === lastMessageId.current) return;
    lastMessageId.current = last.id;

    setCharacterState((prev) => (prev === 'greeting' ? prev : 'talking'));
    window.clearTimeout(talkTimer.current);
    talkTimer.current = window.setTimeout(() => {
      setCharacterState((prev) => (prev === 'talking' ? 'idle' : prev));
    }, talkDurationFor(last.text));

    return () => window.clearTimeout(talkTimer.current);
  }, [messages, isPending, isChatOpen]);

  return {
    tier,
    characterState,
    isChatOpen,
    openPanel,
    expand,
    collapse,
    requestClose,
  };
}
