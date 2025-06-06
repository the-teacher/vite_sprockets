import { TaskList } from "./components.js";
import { TaskAPI } from "./api.js";
import { debounce } from "./utils.js";

/**
 * Main application class
 */
export class App {
  constructor() {
    this.taskList = null;
    this.newTaskInput = null;
  }

  /**
   * Initialize the application
   */
  init() {
    // Create task list container
    const container = document.createElement("div");
    container.id = "task-list-container";
    document.getElementById("app").appendChild(container);

    // Create new task input
    this.createNewTaskInput();

    // Initialize task list
    this.taskList = new TaskList("task-list-container");
  }

  /**
   * Create input for new tasks
   */
  createNewTaskInput() {
    const inputContainer = document.createElement("div");
    inputContainer.className = "new-task-container";
    inputContainer.innerHTML = `
      <input type="text" id="new-task-input" placeholder="Add new task">
      <button id="add-task-btn">Add</button>
    `;
    document.getElementById("app").appendChild(inputContainer);

    this.newTaskInput = document.getElementById("new-task-input");
    const addButton = document.getElementById("add-task-btn");

    // Add task on button click
    addButton.addEventListener("click", () => this.handleAddTask());

    // Add task on Enter key
    this.newTaskInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        this.handleAddTask();
      }
    });
  }

  /**
   * Handle adding new task
   */
  handleAddTask = debounce(async () => {
    const title = this.newTaskInput.value.trim();
    if (!title) return;

    try {
      await TaskAPI.addTask(title);
      this.newTaskInput.value = "";
      // Reinitialize task list to show new task
      this.taskList.init();
    } catch (error) {
      console.error("Failed to add task:", error);
    }
  }, 300);
}

// Initialize app when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  const app = new App();
  app.init();
});
