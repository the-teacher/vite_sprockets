import "./app/styles/index.scss";
import "../app/assets/css/new-test-scss.scss";

import bannerImage from "../app/assets/images/app-banner.jpg";

// React imports
import React from "react";
import { createRoot } from "react-dom/client";
import ImageGallery from "./app/components/ImageGallery.jsx";
import BackgroundImageCard from "./app/components/BackgroundImageCard.jsx";

console.log("Welcome to Vite Sprockets! 1");
console.log("Banner image URL:", bannerImage);

// Basic app initialization
document.addEventListener("DOMContentLoaded", () => {
  const app = document.getElementById("app");
  if (app) {
    console.log("App initialized successfully (1)");

    const importedImg = document.createElement("img");
    importedImg.src = bannerImage;
    importedImg.alt = "Imported Banner";
    importedImg.style.width = "200px";
    importedImg.style.height = "100px";
    importedImg.style.objectFit = "cover";

    const heading = document.createElement("h4");
    heading.textContent = "Imported via JS:";

    app.appendChild(heading);
    app.appendChild(importedImg);

    // Add React components container
    const reactContainer = document.createElement("div");
    reactContainer.id = "react-container";
    app.appendChild(reactContainer);

    // Mount React components
    const root = createRoot(reactContainer);
    root.render(
      React.createElement(React.Fragment, null, [
        React.createElement(ImageGallery, { key: "gallery" }),
        React.createElement(BackgroundImageCard, { key: "background-card" }),
      ])
    );
  }
});
