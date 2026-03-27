import React from "react";
import Dmodel from "../components/ometh/Home/Dmodel";

export default function OmethExternalView() {
  return (
    <div className="App">
      <Dmodel 
        websiteUrl="https://your-website.com"
        websiteTitle="Your Website"
        showControls={true}
        autoRotate={false}
      />
    </div>
  );
}
