import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import About from '../components/About';
import Experience from '../components/Experience';
import Services from '../components/Services';
import Projects from '../components/Projects';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import Skills from '../components/Skills';
import Certifications from '../components/Certifications';
import Achievements from '../components/Achievements';

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-900 transition-colors">
      <Header />
      <Hero />
      <About />
      <Skills />
      <Experience />
      <Certifications />
      <Services />
      <Achievements />
      <Projects />
      <Contact />
      <Footer />
    </div>
  );
};

export default Index;
