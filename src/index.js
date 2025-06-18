import "./app/styles/index.scss";
import "../app/assets/css/new-test-scss.scss";

import bannerImage from "../app/assets/images/app-banner.jpg";

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
  }
});
