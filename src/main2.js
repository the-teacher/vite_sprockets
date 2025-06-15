import "./app/styles/main.css";

console.log("Welcome to Page 2 - Test Scripts!");

// Page 2 specific initialization
document.addEventListener("DOMContentLoaded", () => {
  const app2 = document.getElementById("app2");
  if (app2) {
    console.log("Page 2 initialized successfully");

    // Add some test functionality specific to page 2
    const testButton = document.createElement("button");
    testButton.textContent = "Run Test Script";
    testButton.style.margin = "20px";
    testButton.style.padding = "10px 20px";
    testButton.style.backgroundColor = "#007acc";
    testButton.style.color = "white";
    testButton.style.border = "none";
    testButton.style.borderRadius = "5px";
    testButton.style.cursor = "pointer";

    testButton.addEventListener("click", () => {
      runTestScript();
    });

    app2.appendChild(testButton);
  }
});

// Test script function for page 2
function runTestScript() {
  console.log("Running test script on Page 2...");
  alert("Test script executed successfully on Page 2!");
}

// You can add more page 2 specific functionality here
export { runTestScript };
