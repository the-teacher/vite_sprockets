import { generateId } from "./utils.js";

/**
 * Mock data for tasks
 */
const mockTasks = [
  { id: "1", title: "Learn Vite", completed: false },
  { id: "2", title: "Configure Build", completed: true },
  { id: "3", title: "Write Tests", completed: false },
];

/**
 * Simulates API delay
 * @param {number} ms - Delay in milliseconds
 * @returns {Promise} Promise that resolves after delay
 */
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Mock API class for tasks management
 */
export class TaskAPI {
  /**
   * Get all tasks
   * @returns {Promise<Array>} Array of tasks
   */
  static async getTasks() {
    await delay(500);
    return [...mockTasks];
  }

  /**
   * Add new task
   * @param {string} title - Task title
   * @returns {Promise<Object>} Created task
   */
  static async addTask(title) {
    await delay(300);
    const newTask = {
      id: generateId(),
      title,
      completed: false,
    };
    mockTasks.push(newTask);
    return newTask;
  }

  /**
   * Toggle task completion status
   * @param {string} id - Task ID
   * @returns {Promise<Object>} Updated task
   */
  static async toggleTask(id) {
    await delay(200);
    const task = mockTasks.find((t) => t.id === id);
    if (task) {
      task.completed = !task.completed;
      return { ...task };
    }
    throw new Error("Task not found");
  }
}
