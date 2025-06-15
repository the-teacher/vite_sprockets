var p=Object.defineProperty;var k=(n,t,e)=>t in n?p(n,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):n[t]=e;var c=(n,t,e)=>k(n,typeof t!="symbol"?t+"":t,e);import"./main-B5qjSYml.js";const h=()=>Math.random().toString(36).substr(2,9),m=n=>new Intl.DateTimeFormat("en-US",{year:"numeric",month:"long",day:"numeric",hour:"2-digit",minute:"2-digit"}).format(n),l=(n,t)=>{let e;return function(...a){const i=()=>{clearTimeout(e),n(...a)};clearTimeout(e),e=setTimeout(i,t)}},d=[{id:"1",title:"Learn Vite",completed:!1},{id:"2",title:"Configure Build",completed:!0},{id:"3",title:"Write Tests",completed:!1}],o=n=>new Promise(t=>setTimeout(t,n));class r{static async getTasks(){return await o(500),[...d]}static async addTask(t){await o(300);const e={id:h(),title:t,completed:!1};return d.push(e),e}static async toggleTask(t){await o(200);const e=d.find(s=>s.id===t);if(e)return e.completed=!e.completed,{...e};throw new Error("Task not found")}}class T{constructor(t){this.container=document.getElementById(t),this.tasks=[],this.init()}async init(){this.renderLoading();try{this.tasks=await r.getTasks(),this.render()}catch(t){this.renderError(t)}}renderLoading(){this.container.innerHTML='<div class="loading">Loading tasks...</div>'}renderError(t){this.container.innerHTML=`<div class="error">Error: ${t.message}</div>`}render(){const t=`
      <div class="task-list">
        <div class="task-list__header">
          <h2>Task List</h2>
          <span>Last updated: ${m(new Date)}</span>
        </div>
        <ul>
          ${this.tasks.map(e=>`
            <li class="task-item ${e.completed?"completed":""}" data-id="${e.id}">
              <input type="checkbox" ${e.completed?"checked":""}>
              <span>${e.title}</span>
            </li>
          `).join("")}
        </ul>
      </div>
    `;this.container.innerHTML=t,this.attachEventListeners()}attachEventListeners(){this.container.querySelectorAll(".task-item").forEach(t=>{t.querySelector('input[type="checkbox"]').addEventListener("change",l(async()=>{const s=t.dataset.id;try{await r.toggleTask(s);const a=this.tasks.findIndex(i=>i.id===s);a!==-1&&(this.tasks[a].completed=!this.tasks[a].completed,t.classList.toggle("completed"))}catch(a){console.error("Failed to toggle task:",a)}},300))})}}class u{constructor(){c(this,"handleAddTask",l(async()=>{const t=this.newTaskInput.value.trim();if(t)try{await r.addTask(t),this.newTaskInput.value="",this.taskList.init()}catch(e){console.error("Failed to add task:",e)}},300));this.taskList=null,this.newTaskInput=null}init(){const t=document.createElement("div");t.id="task-list-container",document.getElementById("app").appendChild(t),this.createNewTaskInput(),this.taskList=new T("task-list-container")}createNewTaskInput(){const t=document.createElement("div");t.className="new-task-container",t.innerHTML=`
      <input type="text" id="new-task-input" placeholder="Add new task">
      <button id="add-task-btn">Add</button>
    `,document.getElementById("app").appendChild(t),this.newTaskInput=document.getElementById("new-task-input"),document.getElementById("add-task-btn").addEventListener("click",()=>this.handleAddTask()),this.newTaskInput.addEventListener("keypress",s=>{s.key==="Enter"&&this.handleAddTask()})}}document.addEventListener("DOMContentLoaded",()=>{new u().init()});console.log("Welcome to Vite Sprockets!");document.addEventListener("DOMContentLoaded",()=>{document.getElementById("app")&&console.log("App initialized successfully")});const g=new u;g.init();
