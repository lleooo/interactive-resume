import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LanguageProvider } from './i18n/LanguageContext';
import { ThemeProvider } from './theme/ThemeContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Experience } from './components/Experience';
import { Projects } from './components/Projects';
import { Skills } from './components/Skills';
import { Contact } from './components/Contact';
import { ChatWidget } from './chatbot/ChatWidget';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <LanguageProvider>
          <div className="min-h-screen bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-white">
            <Header />
            <main className="mx-auto max-w-[794px] px-4 py-8 sm:px-6 sm:py-12">
              <div className="overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-slate-900/5 dark:bg-slate-900 dark:ring-white/10">
                <Hero />
                <Experience />
                <About />
                <Projects />
                <Skills />
                <Contact />
              </div>
            </main>
            <Footer />
            <ChatWidget />
          </div>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
