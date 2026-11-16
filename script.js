"use strict";

const newTask = document.getElementById("input");
const addTask = document.getElementById("add-btn");
const taskList = document.getElementById("task-list");

const STORAGE_KEY = "todo-app-tasks";

let tasks = loadTasks();

function loadTasks() {
    try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
        return Array.isArray(saved) ? saved : [];
    } catch {
        return [];
    }
}

function saveTasks() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function createTask(text) {
    const cleanText = text.trim();

    if (!cleanText || cleanText.length > 200) {
        return false;
    }

    tasks.push({
        id: crypto.randomUUID(),
        text: cleanText,
        completed: false,
        createdAt: new Date().toISOString()
    });

    saveTasks();
    renderTasks();
    return true;
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    renderTasks();
}

function toggleTask(id) {
    tasks = tasks.map(task =>
        task.id === id
            ? { ...task, completed: !task.completed }
            : task
    );

    saveTasks();
    renderTasks();
}

function editTask(id) {
    const task = tasks.find(item => item.id === id);
    if (!task) return;

    const updated = prompt("Edit task:", task.text);
    if (updated === null || !updated.trim()) return;

    task.text = updated.trim().slice(0, 200);
    saveTasks();
    renderTasks();
}

function renderTasks() {
    taskList.replaceChildren();

    tasks.forEach(task => {
        const item = document.createElement("li");
        item.className = "task-item";

        if (task.completed) {
            item.classList.add("active");
        }

        const checkbox = document.createElement("button");
        checkbox.type = "button";
        checkbox.className = "btn-check";
        checkbox.textContent = task.completed ? "✓" : "○";
        checkbox.setAttribute(
            "aria-label",
            task.completed ? "Mark pending" : "Mark completed"
        );

        checkbox.addEventListener("click", () => toggleTask(task.id));

        const text = document.createElement("span");
        text.className = "text";
        text.textContent = task.text;

        const remove = document.createElement("button");
        remove.type = "button";
        remove.className = "btn-close";
        remove.textContent = "×";
        remove.setAttribute("aria-label", "Delete " + task.text);

        remove.addEventListener("click", () => deleteTask(task.id));

        const edit = document.createElement("button");
        edit.type = "button";
        edit.className = "btn-edit";
        edit.textContent = "Edit";
        edit.setAttribute("aria-label", "Edit " + task.text);
        edit.addEventListener("click", () => editTask(task.id));

        item.append(checkbox, text, edit, remove);
        taskList.appendChild(item);
    });
}

function addToList() {
    if (createTask(newTask.value)) {
        newTask.value = "";
        newTask.focus();
    }
}

addTask.addEventListener("click", addToList);

newTask.addEventListener("keydown", event => {
    if (event.key === "Enter") {
        addToList();
    }
});

renderTasks();
