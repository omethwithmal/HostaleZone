import React from "react";

// Hostel website components
import NaveBar from "../components/ometh/NaveBar/NaveBar";
import Footer from "../components/ometh/Footer/Footer";
import HeroSection from "../components/ometh/Home/HeroSection";
import About from "../components/ometh/Home/About";
import Contact from "../components/ometh/Home/Contact";
import Rules from "../components/ometh/Home/Rules";
import Rooms from "../components/ometh/Home/Rooms";
import Dmodel from "../components/ometh/Home/Dmodel";

// Home Page Component
export default function OmethHome() {
  return (
    <>
      <NaveBar />
      <div id="HeroSection"><HeroSection /></div>
      <div id="Rooms"><Rooms /></div>
      <div id="About"><About /></div>
      <Dmodel /> {/* 3D model */}
      <div id="Contact"><Contact /></div>
      <div id="Rules"><Rules /></div>
      <Footer />
    </>
  );
}
