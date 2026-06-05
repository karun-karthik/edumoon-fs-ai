let tasks = [];
const LOCAL_STORAGE_KEY = "taskList";

// Selectors
const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("tasksList");
const filterTasks = document.getElementById("filterTasks");
const searchTask = document.getElementById("searchTask");
const taskCount = document.getElementById("taskCount");
const clearCompleted = document.getElementById("clear-completed");
const taskTemplate = document.getElementById("taskTemplate");

const Task = {
    "create": function (text) {
        return {
            id: Date.now(), // unique number
            text: text,
            completed: false,
            createdAt: new Date()
        }
    }
}

function saveTasks() {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasks));
}

function addTask(text) {
    if (text.trim() === '') return;
    // create a new task

    const newTask = Task.create(text);
    tasks.push(newTask);

    saveTasks();
    renderTasks();
}

function loadTasks() {
    const savedTasks = localStorage.getItem(LOCAL_STORAGE_KEY) || [];
    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
    }
}

function filterTasksFn() {
    const filter = filterTasks.value
    const searchText = searchTask.value.toLowerCase();

    let filteredTasks = tasks;
    if (filter === 'completed') {
        filteredTasks = filteredTasks.filter(task => task.completed);
    } else if (filter === 'pending') {
        filteredTasks = filteredTasks.filter(task => !task.completed);
    }

    if (searchText) {
        filteredTasks = filteredTasks.filter(function(task) {
            return task.text.toLowerCase().includes(searchTask.value);
        })
    }

    return filteredTasks
}

function updateTaskCount() {
    const activeCount = tasks.filter(task => !task.completed).length
    taskCount.textContent = `${activeCount} task${activeCount != 1 ? 's': ''} remaining`;
}


function markTask(id) {
    tasks = tasks.map((task) => {
        if (task.id == id) {
            return { ...task, completed: !task.completed };
        }
        return task;
    });
    saveTasks();
    renderTasks();
}

function deleteTask(id) {
    tasks = tasks.filter(tasks => tasks.id != id)
    saveTasks()
    renderTasks()
}

function renderTasks() {
    const tasksToRender = filterTasksFn();
    tasksList.innerHTML = "";

    tasksToRender?.forEach(element => {
        const taskElement = taskTemplate.cloneNode(true);
        const taskItem = taskElement.querySelector(".task-item");
        const taskCheckbox = taskElement.querySelector(".task-checkbox");
        const taskText = taskElement.querySelector(".task-text");
        const taskDeleteButton = taskElement.querySelector(".delete-task");

        taskCheckbox.checked = element.completed;
        taskText.textContent = element.text;

        taskCheckbox.addEventListener('change', () => markTask(element.id));
        taskDeleteButton.addEventListener('click', () => deleteTask(element.id));

        taskList.appendChild(taskElement);
    });

    updateTaskCount();
}

addTaskBtn.addEventListener("click", function() {
    addTask(taskInput.value)
})

taskInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        addTask(taskInput.value)
    }
})

filterTasks.addEventListener('change', function() {
    renderTasks();
})

// searchTask.addEventListener('change', () => {
//     renderTasks();
// })

searchTask.addEventListener('change', renderTasks);

clearCompleted.addEventListener('click', () => {
    tasks = tasks.filter(task => !task.completed)
    saveTasks()
    renderTasks()
})

loadTasks();
renderTasks();