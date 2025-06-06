import { App } from "./app/javascripts/app.js";
import "./app/styles/main.css";

console.log("Welcome to Vite Sprockets!");

// Basic app initialization
document.addEventListener("DOMContentLoaded", () => {
  const app = document.getElementById("app");
  if (app) {
    console.log("App initialized successfully");
  }
});

// Initialize the application
const app = new App();
app.init();
