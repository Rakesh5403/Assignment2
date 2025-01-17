
const btn = document.getElementById("input-button");
let todos = JSON.parse(localStorage.getItem("todos")) || [];

btn.addEventListener("click", function (e) {          
  e.preventDefault(); 
  const task = document.getElementById("input-box").value.trim();
  const dec = document.getElementById("input-description").value.trim();
  const due_date = document.getElementById("due-date").value;
  const category = document.getElementById("category").value;

  if ([task, dec, due_date].includes("")) {
    showPopup("All fields are required");
    return;
  } else {
    const tmId = new Date().getTime(); 

    const todo = {
      title: task,
      category: category,
      Description: dec,
      due_date: due_date,
      done: false,
      tmId: tmId, 
    };
    todos.unshift(todo); 
    localStorage.setItem("todos", JSON.stringify(todos));
    DisplayTodos();

    document.getElementById("input-box").value = '';             
    document.getElementById("input-description").value = '';
    document.getElementById("due-date").value = '';
    document.getElementById("category").value = '';
  }
});

function showPopup(message) {
  document.getElementById("popup-message").textContent = message;
  document.getElementById("popup").style.display = "block";
}


document.getElementById("popup-close").addEventListener("click", function () {
  document.getElementById("popup").style.display = "none";
});



document.addEventListener('DOMContentLoaded', () => {
  DisplayTodos();
  updateTaskCounter(); 
  const todaydate = new Date().toISOString().split('T')[0]; 
  document.getElementById('due-date').setAttribute('min', todaydate);
 
  document.getElementById('search-box').addEventListener('input', searchTasks);

  document.getElementById('sort').addEventListener('change', function() {
    sortTodos();
  });
});

function DisplayTodos() {
  const ul = document.getElementById('list-container');
  ul.innerHTML = ''; 

  todos.forEach((todo) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <label style="color:black; text-decoration: ${todo.done ? 'line-through' : 'none'};">
        <input type="checkbox" data-id="${todo.tmId}" class="todo-checkbox" ${todo.done ? 'checked' : ''}>
        <span style="color:black; font-size:1.5rem; font-weight:600; word-break:break-all; ">${todo.title}</span><br>
        <span style="color:gray; font-weight: 500">Category :- ${todo.category}</span><br>
        <span style="word-break:break-all; color:gray "> Task-Description :-${todo.Description}</span><br>
        <span style="color:gray"> Due-Date :- ${todo.due_date}</span>
      </label>
      <span class="edit-btn" data-id="${todo.tmId}">Edit</span>
      <span class="delete-btn" data-id="${todo.tmId}">Delete</span>
    `;
    ul.appendChild(li);
  });

  addEventListenertoAllButton();
  updateTaskCounter();
}

function searchTasks() {
  const searchQuery = document.getElementById('search-box').value.toLowerCase().trim();
  const filteredTodos = todos.filter(todo => 
    todo.title.toLowerCase().includes(searchQuery) || todo.Description.toLowerCase().includes(searchQuery)
  );


  const ul = document.getElementById('list-container');
  ul.innerHTML = ''; 

  filteredTodos.forEach((todo) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <label style="color:black; text-decoration: ${todo.done ? 'line-through' : 'none'};">
        <input type="checkbox" data-id="${todo.tmId}" class="todo-checkbox" ${todo.done ? 'checked' : ''}>
        <span style="color:black; font-size:1.5rem; font-weight:600; word-break:break-all; ">${todo.title}</span><br>
        <span style="color:gray; font-weight: 500">Category :- ${todo.category}</span><br>
        <span style="word-break:break-all; color:gray "> Task-Description :-${todo.Description}</span><br>
        <span style="color:gray"> Due-Date :- ${todo.due_date}</span>
      </label>
      <span class="edit-btn" data-id="${todo.tmId}">Edit</span>
      <span class="delete-btn" data-id="${todo.tmId}">Delete</span>
    `;
    ul.appendChild(li);
  });

  addEventListenertoAllButton();
}

function sortTodos() {
  const sortOption = document.getElementById('sort').value;

  switch(sortOption) {
    case 'A-Z':
      todos.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case 'Date':
      todos.sort((a, b) => new Date(a.due_date) - new Date(b.due_date)); 
      break;
    case 'present':
      
      return;
  }

  localStorage.setItem("todos", JSON.stringify(todos));
  DisplayTodos(); 
}

function updateTaskCounter() {
  const completedCount = todos.filter((todo) => todo.done).length;
  const uncompletedCount = todos.filter((todo) => !todo.done).length;
  document.getElementById('completed-counter').textContent = completedCount;
  document.getElementById('uncompleted-counter').textContent = uncompletedCount;
}

function addEventListenertoAllButton() {
  const deleteButtons = document.querySelectorAll('.delete-btn');
  deleteButtons.forEach((btn) => {
    btn.addEventListener('click', function () {
      const id = this.getAttribute('data-id');
      todos = todos.filter((todo) => todo.tmId !== parseInt(id, 10));
      localStorage.setItem('todos', JSON.stringify(todos));
      DisplayTodos();
    });
  });

  const editButtons = document.querySelectorAll('.edit-btn');
  editButtons.forEach((btn) => {
    btn.addEventListener('click', function () {
      const id = this.getAttribute('data-id');
      let todo = todos.find((todo) => todo.tmId === parseInt(id, 10));

      document.getElementById("input-box").value = todo.title;
      document.getElementById("input-description").value = todo.Description;
      document.getElementById("due-date").value = todo.due_date;
      document.getElementById("category").value = todo.category;
      todos = todos.filter((todo) => todo.tmId !== parseInt(id, 10));
      localStorage.setItem('todos', JSON.stringify(todos));
      DisplayTodos();
    });
  });

  const checkButtons = document.querySelectorAll('.todo-checkbox');
  checkButtons.forEach((checkbox) => {
    checkbox.addEventListener('change', function () {
      const id = this.getAttribute('data-id');
      const todo = todos.find((todo) => todo.tmId === parseInt(id, 10));
      todo.done = this.checked;

      const parentLabel = this.parentElement;
      parentLabel.style.textDecoration = this.checked ? 'line-through' : 'none';
      // parentLabel.parentElement.style.borderColor="green";
      localStorage.setItem('todos', JSON.stringify(todos));
      updateTaskCounter();
    });
  });
}

// const clear_btn = document.getElementById('clear-button');
// clear_btn.addEventListener('click', function (e) {
//   if(todos.length === 0){
//     alert("No any To-Do list");
//   } else {
//     if(confirm("Are you sure...?")) {
//       todos = [];
//       DisplayTodos();
//     }
//   }
// });


  const clear_btn = document.getElementById('clear-button');
  const confirmModal = document.getElementById('confirm-modal');
  const confirmYes = document.getElementById('confirm-yes');
  const confirmNo = document.getElementById('confirm-no');


  function openModal() {
    confirmModal.style.display = 'flex';
  }


  function closeModal() {
    confirmModal.style.display = 'none';
  }

  clear_btn.addEventListener('click', function (e) {
    if (todos.length === 0) {
      showPopup("No any To-Do list");
    } else {
      openModal(); 
    }
  });

  confirmYes.addEventListener('click', function () {
    todos = [];
    DisplayTodos();
    closeModal(); 
  });

  confirmNo.addEventListener('click', function () {
    closeModal(); 
  });







