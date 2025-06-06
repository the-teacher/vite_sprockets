import { TaskAPI } from "./api.js";
import { formatDate, debounce } from "./utils.js";

/**
 * Task list component
 */
export class TaskList {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.tasks = [];
    this.init();
  }

  /**
   * Initialize the component
   */
  async init() {
    this.renderLoading();
    try {
      this.tasks = await TaskAPI.getTasks();
      this.render();
    } catch (error) {
      this.renderError(error);
    }
  }

  /**
   * Render loading state
   */
  renderLoading() {
    this.container.innerHTML = '<div class="loading">Loading tasks...</div>';
  }

  /**
   * Render error state
   * @param {Error} error - Error object
   */
  renderError(error) {
    this.container.innerHTML = `<div class="error">Error: ${error.message}</div>`;
  }

  /**
   * Render tasks list
   */
  render() {
    const html = `
      <div class="task-list">
        <div class="task-list__header">
          <h2>Task List</h2>
          <span>Last updated: ${formatDate(new Date())}</span>
        </div>
        <ul>
          ${this.tasks
            .map(
              (task) => `
            <li class="task-item ${
              task.completed ? "completed" : ""
            }" data-id="${task.id}">
              <input type="checkbox" ${task.completed ? "checked" : ""}>
              <span>${task.title}</span>
            </li>
          `
            )
            .join("")}
        </ul>
      </div>
    `;
    this.container.innerHTML = html;
    this.attachEventListeners();
  }

  /**
   * Attach event listeners to tasks
   */
  attachEventListeners() {
    this.container.querySelectorAll(".task-item").forEach((item) => {
      const checkbox = item.querySelector('input[type="checkbox"]');
      checkbox.addEventListener(
        "change",
        debounce(async () => {
          const taskId = item.dataset.id;
          try {
            await TaskAPI.toggleTask(taskId);
            const taskIndex = this.tasks.findIndex((t) => t.id === taskId);
            if (taskIndex !== -1) {
              this.tasks[taskIndex].completed =
                !this.tasks[taskIndex].completed;
              item.classList.toggle("completed");
            }
          } catch (error) {
            console.error("Failed to toggle task:", error);
          }
        }, 300)
      );
    });
  }
}
