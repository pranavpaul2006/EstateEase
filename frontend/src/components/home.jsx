import React from 'react';
import Hero from './hero';
import PropertyGrid from './property_grid';
import Footer from './footer';

function Home() {
  return (
    <div className="pt-20">
      <Hero />

      {/* <PropertyGrid /> */}
      <Footer/>
    </div>
  );
}

export default Home;