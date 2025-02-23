import React, { useState } from "react";
import "./MlModel.css"; // Import CSS file

const MlModel = () => {
  const [showContent, setShowContent] = useState(false);

  return (
    <div className="ml-model-wrapper">
      <button 
        className="toggle-btn"
        onClick={() => setShowContent(!showContent)}
      >
        ⬆
      </button>

      {showContent && (
        <div className="ml-model-container">
          <h2 className="ml-model-title">AI Food Recognition</h2>
          <p className="ml-model-description">
            Our AI-powered tool helps identify food items for efficient distribution. Upload an image and get instant results.
          </p>

          <div className="iframe-button-container">
            <p className="ml-model-description">
              Upload an image to our AI-powered food recognition tool to identify food items instantly and assist in efficient distribution.
            </p>
            <button 
              className="open-streamlit-btn"
              onClick={() => window.open("http://localhost:8501")}
            >
              Identify Food
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MlModel;
