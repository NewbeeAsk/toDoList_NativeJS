// JavaScript source code
let toDoPointsList = [
    {
        "title": "Watch all JS videos",
        "description": "Must to  understand native js",
        "status": true,
        "dueDate": '30.01.2019',
    },
    {
        "title": "Perform tasks on js",
        "description": "fulfill all the conditions of the task",
        "status": false,
    },
    {
        "title": "Have dinner",
        "status": true,
    },
    {
        "title": "meet in zoom to view results",
        "description": "enter the zoom in advance",
        "status": true,
        "dueDate": '28.02.2022',
    },
];

function addToDoPoint(point) {
    let node = document.createElement("div");
        node.classList.add("toDoPoint");
        node.appendChild(document.createElement("div"));

    let title = node.appendChild(document.createElement("div"));
    title.classList.add("toDoPoint-title");
    title.appendChild(document.createTextNode(point.title));
    if (point.description != null) {
        let description = node.appendChild(document.createElement("div"));
        description.classList.add("toDoPoint-description");
        description.appendChild(document.createTextNode(point.description));
    }

    let checkbox = node.appendChild(document.createElement("div")).appendChild(document.createElement("input"));
    checkbox.setAttribute('type', 'checkbox');
    if (point.status) {
        checkbox.setAttribute("checked", point.status);
    } else {
        title.classList.add("toDoPoint-done");
    }

    if (point.dueDate != null) {
        let dueDate = node.appendChild(document.createElement("div"));
        dueDate.classList.add("toDoPoint-dueDate");
        dueDate.appendChild(document.createTextNode(point.dueDate));

        let date = point.dueDate.split(".");
        console.log(new Date(date[2], date[1], date[0]).getTime());
        console.log(Date.now());
        if (new Date(date[2], date[1], date[0]).getTime() > Date.now()) {            
            dueDate.classList.add("toDoPoint-stitched");
        }
    }
    
    return node;
};

function formToDoList() {
    for (let point of toDoPointsList) {
        document.getElementById("toDoList").appendChild(addToDoPoint(point));
    }    
};

formToDoList();