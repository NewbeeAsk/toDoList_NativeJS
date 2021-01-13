// JavaScript source code
let toDoPointsList = [];

function addToDoPoint(point) {
    let node = document.createElement("div");
    node.classList.add("toDoPoint");
    node.id = point.id;
    if (point.done) {
        node.classList.add("toDoPoint-done");
    }

    let title = node.appendChild(document.createElement("div"));
    title.classList.add("toDoPoint-title");
    title.appendChild(document.createTextNode(point.title));
    if (point.description != null) {
        let description = node.appendChild(document.createElement("div"));
        description.classList.add("toDoPoint-description");
        description.appendChild(document.createTextNode(point.description));
    }

    let checkbox = node.appendChild(document.createElement("div"));
    checkbox.classList.add("toDoPoint-checkbox");
    checkbox = checkbox.appendChild(document.createElement("input"));
    checkbox.setAttribute('type', 'checkbox');
    checkbox.onclick = function () {
        toDoPointsList.forEach(el => {
            if (el.id == this.parentNode.parentNode.id) {
                el.done = !el.done;
            }
        })
        let myNode = checkbox.parentNode.parentNode.parentNode;
        while (myNode.firstChild) {
            myNode.removeChild(myNode.firstChild);
        }
        formToDoList();
        updateDoneStatus(point);
    };

    if (point.done) {
        checkbox.setAttribute("checked", point.done);
        title.classList.add("toDoPoint_crossed-out");
    }

    if (point.dueDate != null) {
        let dueDate = node.appendChild(document.createElement("div"));
        dueDate.classList.add("toDoPoint-dueDate");
        dueDate.appendChild(document.createTextNode(point.dueDate.getDate().toString() + "." + point.dueDate.getMonth().toString() + "." + point.dueDate.getFullYear().toString()));

        if (point.dueDate.getTime() < Date.now()) {
            dueDate.classList.add("toDoPoint-stitched");
        }
    }

    let deleteButton = node.appendChild(document.createElement("button"));
    deleteButton.innerText = "Delete";
    deleteButton.classList.add("toDoPoint-deleteButton");
    deleteButton.onclick = function () {
        toDoPointsList.forEach(el => {
            if (el.id == this.parentNode.id) {
                toDoPointsList = toDoPointsList.filter(point => point.id != el.id);
            }
        });
        deleteTask(point);
        this.parentNode.parentNode.removeChild(this.parentNode);
    }

    return node;
};

function formToDoList() {
    for (let point of toDoPointsList) {
        appendTask(point);
    }
};

let hiden = false;

function hideUndoneTasks() {
    hiden = !hiden;
    if (hiden) {
        document.getElementById("hideUndoneToDoPoints").classList.add("active-button");
        document.getElementById("hideUndoneToDoPoints").textContent = "Show Undone";
    } else {
        document.getElementById("hideUndoneToDoPoints").classList.remove("active-button");
        document.getElementById("hideUndoneToDoPoints").textContent = "Hide Undone";
    }
    let taskDOM = document.getElementById("toDoList");
    taskDOM.setAttribute("class", hiden ? "hide-done" : "");
};

function addTaskForm() {
    let node = document.getElementById("addTaskForm");
    node.classList.add("addTaskForm");

    let titleInput = node.appendChild(document.createElement("input"));
    titleInput.name = "title";
    titleInput.setAttribute('name', 'title');
    titleInput.placeholder = "title...";
    titleInput.classList.add("inputForm");

    let descriptionInput = node.appendChild(document.createElement("input"));
    descriptionInput.name = "description";
    descriptionInput.placeholder = "description...";
    descriptionInput.classList.add("inputForm");

    let dueDateInput = node.appendChild(document.createElement("input"));
    dueDateInput.name = "dueDate";
    dueDateInput.setAttribute('type', 'date');
    dueDateInput.classList.add("dataPicker");

    let doneInput = node.appendChild(document.createElement("input"));
    doneInput.name = "done";
    doneInput.value = doneInput.checked;
    doneInput.setAttribute('type', 'checkbox');

    let addTaskButton = node.appendChild(document.createElement("button"));
    addTaskButton.setAttribute('type', 'subimt');
    addTaskButton.classList.add("addTaskButton");
    addTaskButton.textContent = "Add new task";

    /*    node.addEventListener('submit', (event) => {
            event.preventDefault();
            if (titleInput.value != "") {
                let dueDate;
                console.log(dueDateInput.value);
                if (dueDateInput.value != "") {
                    let date = dueDateInput.value.split("-");
                    dueDate = new Date(date[0], date[1], date[2]);
                } else {
                    dueDate = null;
                }
                toDoPointsList.push({
                    "title": titleInput.value,
                    "description": descriptionInput.value,
                    "dueDate": dueDate,
                    "done": doneInput.checked,
                });
            }
            while (document.getElementById("toDoList").firstChild) {
                document.getElementById("toDoList").removeChild(document.getElementById("toDoList").firstChild);
            }
            formToDoList();
            while (document.getElementById("addTaskForm").firstChild) {
                document.getElementById("addTaskForm").removeChild(document.getElementById("addTaskForm").firstChild);
            }
            addTaskForm();
            event.stopImmediatePropagation();
        });*/
}

let taskForm = document.forms['task'];

function appendTask(task) {
    return document.getElementById("toDoList").appendChild(addToDoPoint(task));
}

taskForm.addEventListener('submit', (event) => {
    event.preventDefault();
    let taskData = new FormData(taskForm);
    let task = Object.fromEntries(taskData.entries());
    if (task.done == null) {
        task.done = false;
    } else {
        task.done = true;
    }
    createTask(task)
        .then(appendTask)
        .then(toDoPointsList.push)
        .then(_ => taskForm.reset())
});

function mapJsonToTask(taskJson) {
    if (taskJson.dueDate != null) {
        let date = taskJson.dueDate.split("-");
        taskJson.dueDate = new Date(date[0], date[1], date[2]);
    }
    return taskJson;
}

function getTaskList(list = 1) {
    toDoPointsList = [];
    fetch(`http://localhost:8080/lists/${list}/tasks?all=true`)
        .then(responce => responce.json())
        .then((toDoPoints) => {
            toDoPointsList = toDoPoints.map(mapJsonToTask);
            formToDoList()
        });
}

function createTask(task, list = 1) {
    return fetch(`http://localhost:8080/lists/${list}/tasks`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(task)
    })
        .then(response => response.json())
        .then(mapJsonToTask);
}

function deleteTask(task, list = 1) {
    return fetch(`http://localhost:8080/lists/${list}/tasks/${task.id}`, {
        method: 'DELETE',
    })
        .then((response) => {
            if (response.status != 200) {
                window.alert("something went wrong! try again later.");
            }
        })
}

function updateDoneStatus(task, list = 1) {
    return fetch(`http://localhost:8080/lists/${list}/tasks/${task.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(task)
    })
        .then((response) => {
            if (response.status != 200) {
                window.alert("something went wrong! try again later.");
            }
        })
}

formToDoList();
addTaskForm();
getTaskList();

