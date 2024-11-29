const form = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo");
const todoList = document.querySelector(".list-group");
const firstCardBody = document.querySelectorAll(".card-body")[0];
const secondCardBody = document.querySelectorAll(".card-body")[1];
const filter = document.querySelector("#filter");
const clearButton = document.querySelector("#clear-todos");

eventListeners();

function eventListeners() {
  form.addEventListener("submit", addTodo);
  document.addEventListener("DOMContentLoaded", loadAllTodosToUI);
  secondCardBody.addEventListener("click", deleteTodo);
  filter.addEventListener("keyup", filterTodos);
  clearButton.addEventListener("click", clearAllTodos);
}

function addTodo(e) {
  const newTodo = todoInput.value.trim();

  if (newTodo === "") {
    showAlert("danger", "Please enter a todo...");
  } else if (checkTodos(newTodo)) {
    showAlert("info", "Please enter a different value");
    todoInput.value = "";
  } else {
    addTodoToUI(newTodo);
    addTodoToStorage(newTodo);
    showAlert("success", "Todo was successfully entered...");
  }

  e.preventDefault();
}

function showAlert(type, message) {
  const alert = document.createElement("div");

  alert.className = `alert alert-${type}`;

  alert.textContent = message;

  firstCardBody.appendChild(alert);

  setTimeout(function () {
    alert.remove();
  }, 1000);
}

function addTodoToUI(newTodo) {
  const listItem = document.createElement("li");
  listItem.className = "list-group-item d-flex justify-content-between";

  const newTodoItem = newTodo[0].toUpperCase() + newTodo.slice(1);

  const link = document.createElement("a");
  link.href = "#";
  link.className = "delete-item";
  link.innerHTML = "<i class='fa fa-remove'></i>";

  listItem.appendChild(document.createTextNode(newTodoItem));

  listItem.appendChild(link);

  todoList.appendChild(listItem);

  todoInput.value = "";
}

function getTodosFromStorage() {
  let todos = JSON.parse(localStorage.getItem("todos")) || [];
  return todos;
}

function checkTodos(todo) {
  let todos = getTodosFromStorage();
  return todos.includes(todo);
}
function addTodoToStorage(newTodo) {
  let todos = getTodosFromStorage();

  todos.push(newTodo);

  localStorage.setItem("todos", JSON.stringify(todos));
}

function loadAllTodosToUI() {
  let todos = getTodosFromStorage();

  todos.forEach(function (todo) {
    addTodoToUI(todo);
  });
}

function deleteTodo(e) {
  if (e.target.className === "fa fa-remove") {
    e.target.parentElement.parentElement.remove();

    deleteTodoFromStorage(e.target.parentElement.parentElement.textContent);

    showAlert("primary", "Todo was successfully deleted...");
  }
}

function deleteTodoFromStorage(deleteFromStorage) {
  let todos = getTodosFromStorage();

  todos.forEach(function (todo, index) {
    if (todo === deleteFromStorage) {
      todos.splice(index, 1);
    }
  });
  localStorage.setItem("todos", JSON.stringify(todos));
}

function filterTodos(e) {
  const filterValue = e.target.value.toLowerCase();

  const listItems = document.querySelectorAll(".list-group-item");

  listItems.forEach(function (list) {
    const text = list.textContent.toLowerCase();

    if (text.indexOf(filterValue) === -1) {
      list.setAttribute("style", "display : none !important");
    } else {
      list.setAttribute("style", "display : block");
    }
  });
}

function clearAllTodos(e) {
  if (confirm("Are you sure you want to delete all?")) {
    while (todoList.firstElementChild !== null) {
      todoList.removeChild(todoList.firstElementChild);
    }
  }

  localStorage.removeItem("todos");
}
