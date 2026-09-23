import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LanguageProvider } from './i18n/LanguageContext';
import { ThemeProvider } from './theme/ThemeContext';
import { Landing } from './components/Landing';
import { ResumePanel } from './components/ResumePanel';
import { ParticleBackground } from './components/ParticleBackground';
import { ChatWidget } from './chatbot/ChatWidget';

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
            <ChatWidget suppressIdle={view === 'landing'} />
          </div>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
