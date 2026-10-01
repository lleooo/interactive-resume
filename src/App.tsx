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

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <LanguageProvider>
          <ParticleBackground />
          <div className="relative z-10 min-h-screen text-slate-900 dark:text-white">
            <Landing
              active={view === 'landing'}
              onOpenResume={() => setView('resume')}
            />
            <ResumePanel
              open={view === 'resume'}
              onClose={() => setView('landing')}
            />
            <TopControls
              resumeOpen={view === 'resume'}
              onClose={() => setView('landing')}
            />
            <ChatWidget />
          </div>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
