const todosList = document.querySelector(".main");
const addTodoButton = document.querySelector("#i");

const TODOS_KEY = "beginweb-todos-key";

addTodoButton?.addEventListener("click", (e) => {
  addTodo();
});

const backgroundSelectorEl = document.querySelector(".div-background");
const BG_IMG_KEY = "beginweb-bg-image";

// @ts-ignore
backgroundSelectorEl.addEventListener("click", (e) => {
  // @ts-ignore
  const backgroundImg = e.target.style.backgroundImage;
  document.body.style.backgroundImage = backgroundImg;
  localStorage.setItem(BG_IMG_KEY, backgroundImg);
});

function addTodo() {
  const newId = Date.now();
  const newTodos = [
    ...appState.todos,
    {
      id: newId,
      text: "untitled",
      completed: false,
    },
    // @ts-ignore
  ].sort((a, b) => a.completed - b.completed);
  updateTodos(newTodos);
  // const createdTodoEl = document.querySelector(`[data-todo-id = "${newId}"]`);
  // createdTodoEl.querySelector(".text").click();
  // const inputEl = createdTodoEl.querySelector("input.text");
  // inputEl.select();

  // le code de base est juste au dessus mais ne fonctionner pas parcequ'il ne laisser pas le temps au dom de se recharger.
  setTimeout(() => {
    const createdTodoEl = document.querySelector(`[data-todo-id="${newId}"]`);
    if (createdTodoEl) {
      const textEl = createdTodoEl.querySelector(".text");
      if (textEl) {
        textEl.click(); // Simuler le clic
        const inputEl = createdTodoEl.querySelector("input.text");
        if (inputEl) {
          inputEl.select(); // Sélectionner le texte
        }
      }
    }
  }, 10); // Petite pause pour laisser le DOM se mettre à jour
}

const appState = {
  todos: [
    {
      id: 1,
      text: "Add a task",
      completed: false,
    },
  ],
};

function updateTodos(newTodos) {
  appState.todos = newTodos;
  renderTodos();
  localStorage.setItem(TODOS_KEY, JSON.stringify(newTodos));
}

function renderTodos() {
  document.startViewTransition(() => {
    // @ts-ignore
    todosList.innerHTML = "";
    for (const todo of appState.todos) {
      const todoEl = createTodo(todo);
      // @ts-ignore
      todosList.appendChild(todoEl);

      // @ts-ignore
      lucide.createIcons();
    }
  });
}

function createTodo(todo) {
  const todoEl = document.createElement("div");

  todoEl.style["view-transition-name"] = `todo-${todo.id}`;

  todoEl.setAttribute("data-todo-id", todo.id);
  todoEl.classList.add("todo");
  if (todo.completed) {
    todoEl.classList.add("checked");
  }

  const checkbox = createCheckbox(todo);
  const text = createTextElement(todo);
  const trashButton = createDeleteButton(todo);
  todoEl.appendChild(checkbox);
  todoEl.appendChild(text);
  todoEl.appendChild(trashButton);

  return todoEl;
}

function createCheckbox(todo) {
  const todoCheckbox = document.createElement("div");
  const todoCheckboxCircle = document.createElement("div");
  const todoCheckboxInput = document.createElement("input");

  // Écouter le changement
  todoCheckboxInput.addEventListener("change", (e) => {
    const newTodos = appState.todos
      .map((t) => {
        if (t.id === todo.id) {
          return {
            ...t,
            completed: !t.completed,
          };
        }
        return t;
      })
      // @ts-ignore
      .sort((a, b) => a.completed - b.completed);

    updateTodos(newTodos);
  });

  todoCheckbox.classList.add("todo-checkbox");
  todoCheckboxCircle.classList.add("todo-checkbox-circle");
  todoCheckboxInput.type = "checkbox";
  todoCheckbox.appendChild(todoCheckboxCircle);
  todoCheckbox.appendChild(todoCheckboxInput);
  return todoCheckbox;
}

function createTextElement(todo) {
  const textEl = document.createElement("p");
  const inputEl = document.createElement("input");
  inputEl.value = todo.text;
  inputEl.style.display = "none";

  textEl.addEventListener("click", () => {
    textEl.style.display = "none";
    inputEl.style.display = "block";
    inputEl.focus();
  });

  function editTodo(value) {
    const newTodos = appState.todos.map((t) => {
      if (t.id === todo.id) {
        return {
          ...t,
          text: value,
        };
      }
      return t;
    });

    updateTodos(newTodos);
  }

  inputEl.addEventListener("blur", (e) => {
    // @ts-ignore
    const value = e.target.value;
    editTodo(value);
  });
  inputEl.addEventListener("keydown", (e) => {
    // @ts-ignore
    e.key === "Enter" && editTodo(e.target.value);
  });

  textEl.classList.add("text");
  inputEl.classList.add("text");
  textEl.textContent = todo.text;
  const container = document.createElement("div");
  container.classList.add("div-container");
  container.appendChild(textEl);
  container.appendChild(inputEl);

  return container;
}
function createDeleteButton(todo) {
  const buttonEl = document.createElement("button");
  const i = document.createElement("i");
  buttonEl.classList.add("trash");
  i.setAttribute("data-lucide", "trash");
  buttonEl.appendChild(i);

  buttonEl.addEventListener("click", () => {
    const newTodos = appState.todos.filter((t) => t.id !== todo.id);
    updateTodos(newTodos);
  });
  return buttonEl;
}

function initApp() {
  try {
    // @ts-ignore
    appState.todos = JSON.parse(localStorage.getItem(TODOS_KEY));
  } catch (e) {
    console.error("Catch");
  }

  renderTodos();
  // @ts-ignore
  document.body.style.backgroundImage = localStorage.getItem(BG_IMG_KEY);
}

document.addEventListener("DOMContentLoaded", () => {
  console.log("Add");
  initApp();
});
