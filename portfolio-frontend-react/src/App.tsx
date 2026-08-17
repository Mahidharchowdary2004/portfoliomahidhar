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

  // Load Google Analytics dynamically if the Measurement ID is provided
  useEffect(() => {
    const gaId = import.meta.env.VITE_GA_MEASUREMENT_ID;
    if (gaId && gaId.trim() !== '') {
      if (document.querySelector(`script[src*="googletagmanager.com/gtag/js"]`)) return;

      const script1 = document.createElement('script');
      script1.async = true;
      script1.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
      document.head.appendChild(script1);

      const script2 = document.createElement('script');
      script2.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        window.gtag = gtag;
        gtag('js', new Date());
        gtag('config', '${gaId}', { page_path: window.location.pathname });
      `;
      document.head.appendChild(script2);
    }
  }, []);

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
