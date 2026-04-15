import { ThemeProvider } from './context/ThemeContext';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import Competitions from './components/Competitions';
import Career from './components/Career';
import Research from './components/Research';
import Projects from './components/Projects';
import Footer from './components/Footer';
import LoadingScreen from './components/LoadingScreen';
import CursorTracker from './components/CursorTracker';
import BackgroundEffect from './components/BackgroundEffect';
import ChatbotIcon from './components/ChatbotIcon';

function App() {
  return (
    <ThemeProvider>
      <LoadingScreen />
      <BackgroundEffect />
      <CursorTracker />
      <ChatbotIcon />
      <div
        className="min-h-screen transition-colors duration-300"
        style={{
          background: 'var(--bg-primary)',
          color: 'var(--text-primary)',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <Navigation />
        <Hero />
        <Career />
        <Research />
        <Competitions />
        <Projects />
        <Footer />
      </div>
    </ThemeProvider>
  );
}

export default App;