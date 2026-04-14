import Navigation from './components/Navigation';
import Hero from './components/Hero';
import Competitions from './components/Competitions';
import Career from './components/Career';
import Research from './components/Research';
import Footer from './components/Footer';

function App() {
  return (
    <div className="bg-[#080808] text-white min-h-screen">
      <Navigation />
      <Hero />
      <Competitions />
      <Career />
      <Research />
      <Footer />
    </div>
  );
}

export default App;
