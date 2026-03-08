const taskInput = document.getElementById("taskInput");
const addTaskButton = document.getElementById("addTaskButton");
const taskList = document.getElementById("taskList");

const clearCompleted = document.getElementById("clearCompleted");
const clearAll = document.getElementById("clearAll");
const taskCounter = document.getElementById("taskCounter");

const allFilter = document.getElementById("allFilter");
const activeFilter = document.getElementById("activeFilter");
const completedFilter = document.getElementById("completedFilter");

let tasks = [];

let currentFilter = "all";

const savedTasks = localStorage.getItem("tasks");

if (savedTasks) {
    tasks = JSON.parse(savedTasks);

    renderTasks();
}

allFilter.addEventListener("click", () => {
    currentFilter = "all";

    renderTasks();
});

activeFilter.addEventListener("click", () => {
    currentFilter = "active";

    renderTasks();
});

completedFilter.addEventListener("click", () => {
    currentFilter = "completed";

    renderTasks();
});

addTaskButton.addEventListener("click", addTask);

taskInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        addTask();
    }
});

clearCompleted.addEventListener("click", () => {
    tasks = tasks.filter(task => !task.completed);

    saveTasks();
    renderTasks();
});

clearAll.addEventListener("click", () => {
    const confirmClear = confirm("Delete all tasks?");

    if (!confirmClear) return;

    tasks = [];

    saveTasks();
    renderTasks();
});

function addTask() {
    const text = taskInput.value.trim();

    if (!text) return;

    const task = {
        id: Date.now(),
        text: text,
        completed: false
    };

    tasks.push(task);

    saveTasks();
    renderTasks();

    taskInput.value = "";
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    
    saveTasks();
    renderTasks();
}

function toggleTask(id) {
    tasks = tasks.map(task => {
        if (task.id === id) {
            return {
                ...task,
                completed: !task.completed
            };
        }
        return task;
    });

    saveTasks();
    renderTasks();
}

function editTask(id) {
    const task = tasks.find(task => task.id === id);
    const newText = prompt("Edit task:", task.text);

    if (newText === null) return;

    const trimmed = newText.trim();

    if (!trimmed) return;

    task.text = trimmed;

    saveTasks();
    renderTasks();
}

function renderTasks() {
    taskList.innerHTML = "";

    const remaining = tasks.filter(task => !task.completed).length;
    taskCounter.textContent = `Tasks left: ${remaining}`;

    let filteredTasks = tasks;

    if (currentFilter === "active") {
        filteredTasks = tasks.filter(task => !task.completed);
    } else if (currentFilter === "completed") {
        filteredTasks = tasks.filter(task => task.completed);
    }

    filteredTasks.forEach(task => {
        const li = document.createElement("li");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;

        checkbox.addEventListener("change", () => toggleTask(task.id));

        const textSpan = document.createElement("span");
        textSpan.textContent = task.text;

        if (task.completed) {
            textSpan.classList.add("completed");
        }

        const editButton = document.createElement("button");
        editButton.textContent = "Edit";

        editButton.addEventListener("click", () => editTask(task.id));

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", () => deleteTask(task.id));

        li.appendChild(checkbox);
        li.appendChild(textSpan);
        li.appendChild(editButton);
        li.appendChild(deleteButton);

        taskList.appendChild(li);
    });
}

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}