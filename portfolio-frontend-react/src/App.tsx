import { useEffect, useState, useContext } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Certifications from './components/Certifications';
import Achievements from './components/Achievements';
import Contact from './components/Contact';
import Footer from './components/Footer';
import { useResource } from './hooks/useResource';
import { defaultProfile } from './data/defaults';
import { DataProvider, DataContext } from './context/DataContext';

function LoaderOverlay() {
  const { loading } = useContext(DataContext);
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (!loading) {
      setFadeOut(true);
      const timer = setTimeout(() => {
        setVisible(false);
      }, 400); // 400ms transition duration
      return () => clearTimeout(timer);
    }
  }, [loading]);

  if (!visible) return null;

  return (
    <div className={`page-loader ${fadeOut ? 'fade-out' : ''}`}>
      <div className="loader-spinner"></div>
      <div className="loader-text">Loading Portfolio</div>
    </div>
  );
}

export default function App() {
  return (
    <DataProvider>
      <LoaderOverlay />
      <MainApp />
    </DataProvider>
  );
}

function MainApp() {
  const profile = useResource('/profile', defaultProfile);

  useEffect(() => {
    const design = profile.design || 'lavender';
    if (design === 'lavender') {
      document.documentElement.removeAttribute('data-color');
    } else {
      document.documentElement.setAttribute('data-color', design);
    }
  }, [profile.design]);

  return (
    <>
      <div className="aurora">
        <div className="orb orb1"></div>
        <div className="orb orb2"></div>
        <div className="orb orb3"></div>
      </div>
      <div className="noise"></div>

      <Header />
      <Hero />
      <About />
      <Skills />
      <Experience />
      <Projects />
      <Certifications />
      <Achievements />
      <Contact />
      <Footer />
    </>
  );
}
