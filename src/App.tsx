import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LanguageProvider } from './shared/i18n/LanguageContext';
import { ThemeProvider } from './shared/theme/ThemeContext';
import { Landing } from './features/landing/Landing';
import { ResumePanel } from './features/resume/ResumePanel';
import { TopControls } from './shared/components/TopControls';
import { ParticleBackground } from './shared/components/ParticleBackground';
import { ChatWidget } from './features/chatbot/ChatWidget';

const queryClient = new QueryClient();

type View = 'landing' | 'resume';

function App() {
  const [view, setView] = useState<View>('landing');
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <LanguageProvider>
          <ParticleBackground paused={chatOpen} />
          <div className="relative z-10 min-h-screen text-slate-900 dark:text-white">
            {/* Unpositioned, so it doesn't create a stacking context: the fixed
                children keep layering against the chat as before. */}
            <div inert={chatOpen}>
              <Landing
                active={view === 'landing'}
                paused={chatOpen}
                onOpenResume={() => setView('resume')}
              />
              <ResumePanel
                open={view === 'resume'}
                // The chat closes itself on Escape; don't close the resume too.
                closeOnEscape={!chatOpen}
                onClose={() => setView('landing')}
              />
              <TopControls
                resumeOpen={view === 'resume'}
                onClose={() => setView('landing')}
              />
            </div>
            <ChatWidget isOpen={chatOpen} onOpenChange={setChatOpen} />
          </div>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
