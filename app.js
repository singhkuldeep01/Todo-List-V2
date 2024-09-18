document.addEventListener("DOMContentLoaded", function(event){
    const todoInput = document.querySelector(".input");
    const addButton = document.querySelector(".add_todo");
    const ListUl = document.querySelector(".todo_list");
    const listContainer = document.querySelector(".list_container");
    const allbtn = document.querySelector(".all-btn");
    const pendingbtn = document.querySelector(".pend-btn");
    const completedbtn = document.querySelector(".completed-btn");

    
    addButton.addEventListener("click", function(event){
        let value = todoInput.value;
        value = value.trim();
        addTask(value, ListUl, true, false , null);
        todoInput.value = "";
    })
    document.addEventListener("keydown", function(event){
        let value = todoInput.value;
        value = value.trim();
        if(event.code == "Enter"){
            addTask(value, ListUl , true, false, null);
            todoInput.value = "";
        }
    })
    listContainer.addEventListener("click" , function(event){
        let todo = loadTodos();
        if(event.target.innerText == 'Delete'){
            let deleteTask = event.target.parentElement.parentElement;
            let idx = deleteTask.getAttribute("data-id");
            todo.todoList = todo.todoList.filter( td => td.id != idx)
            deleteTask.remove();
        }else if(event.target.innerText == 'Complete'){
            event.target.innerText = 'Reset';
            let parent = event.target.parentElement.parentElement;
            let idx = parent.getAttribute("data-id");
            for(td of todo.todoList){
                if(td.id == idx){
                    td.isCompleted = true;
                }
            }
            let firstChild = parent.firstElementChild;
            firstChild.classList.add('line-through');
        }else if(event.target.innerText == 'Reset'){
            event.target.innerText = 'Complete';
            let parent = event.target.parentElement.parentElement;
            let id = parent.getAttribute("data-id");
            let idx = parent.getAttribute("data-id");
            for(td of todo.todoList){
                if(td.id == idx){
                    td.isCompleted = false;
                }
            }
            let firstChild = parent.firstElementChild;
            firstChild.classList.remove('line-through');
        }else if(event.target.innerText == "Edit"){
            let parent = event.target.parentElement.parentElement;
            let firstChild = parent.firstElementChild;
            todoInput.value = firstChild.innerText;
            let deleteTask = event.target.parentElement.parentElement;
            let idx = deleteTask.getAttribute("data-id");
            todo.todoList = todo.todoList.filter( td => td.id != idx)
            deleteTask.remove();
        }
        localStorage.setItem("todos", JSON.stringify(todo));
    })
    pendingbtn.addEventListener("click", function(){
        showPending(ListUl);
    })
    allbtn.addEventListener("click", function(){
        showAll(ListUl);
    })
    completedbtn.addEventListener('click', function(){
        showCompleted(ListUl);
    })
    showAll(ListUl);
});

function loadTodos(){
    const todos = JSON.parse(localStorage.getItem("todos")) || {"todoList" : [], "counter" : 0};
    return todos;
}

function setTodos(value){
    const todos = loadTodos();
    let sz = todos.counter;
    todos.todoList.push({"text" : value, "isCompleted" : false , "id" : sz});
    todos.counter++;
    localStorage.setItem("todos", JSON.stringify(todos));
}

function showAll(ListUl){
    ListUl.innerText = "";
    let todo = loadTodos();
    if(todo.todoList.length == 0){
        todo.counter = 0;
        localStorage.setItem("todos", JSON.stringify(todo));
    }
    todo.todoList.forEach(element => {
        addTask(element.text, ListUl, false , true, element.id, element.isCompleted);
    });
}

function showPending(ListUl){
    ListUl.innerText = "";
    let todo = loadTodos();
    todo.todoList.forEach(element => {
        if(element.isCompleted == false)
        addTask(element.text, ListUl, false , true, element.id, element.isCompleted);
    });
}

function showCompleted(ListUl){
    ListUl.innerText = "";
    let todo = loadTodos();
    todo.todoList.forEach(element => {
        if(element.isCompleted == true)
        addTask(element.text, ListUl, false , true, element.id, element.isCompleted);
    });
}

function addTask(value , parent , setData = false, isIdGiven , id , isCompleted = false){
    if(value != ""){
        let newTask = document.createElement("li");
        let textDiv = document.createElement("div");

        let buttonDiv = document.createElement("div");
        buttonDiv.classList.add("function-button-container");


        let editbtn = document.createElement('button');
        editbtn.innerText = "Edit";
        editbtn.classList.add("function-btn");
        editbtn.classList.add("edit-btn");

        let deletebtn = document.createElement('button');
        deletebtn.innerText = "Delete";
        deletebtn.classList.add("function-btn");
        deletebtn.classList.add("delete-btn");

        let completebtn = document.createElement('button');
        completebtn.innerText = "Complete";
        completebtn.classList.add("function-btn");
        completebtn.classList.add("complete-btn");
        
        if(isCompleted){
            completebtn.innerText = "Reset";
            textDiv.classList.add("line-through");
        }

        buttonDiv.appendChild(editbtn);
        buttonDiv.appendChild(deletebtn);
        buttonDiv.appendChild(completebtn);

        textDiv.innerText = value;

        newTask.appendChild(textDiv);
        newTask.appendChild(buttonDiv);

        if(isIdGiven){
            newTask.setAttribute("data-id", id);
            parent.appendChild(newTask);
        }else{
            const todos = loadTodos();
            newTask.setAttribute("data-id", todos.counter);
            localStorage.setItem("todos", JSON.stringify(todos));
            parent.appendChild(newTask);
        }
        

        if(setData)
            setTodos(value);
    }else{
        alert("Invalid Task");
    }
}