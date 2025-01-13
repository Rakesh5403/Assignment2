const btn = document.getElementById("input-button");
let todos = JSON.parse(localStorage.getItem("todos")) || [];

btn.addEventListener("click", function (e) {          
  e.preventDefault(); 
  const task = document.getElementById("input-box").value.trim();
  const dec = document.getElementById("input-description").value.trim();
  const due_date = document.getElementById("due-date").value;
  const category = document.getElementById("category").value;

  if ([task, dec, due_date].includes("")) {
    alert("All fields are required");
    return;
  } else {
    const todo = {
      title: task,
      category: category,
      Description: dec,
      due_date: due_date,
      done: false,
      createdAt: new Date().getTime(),
    };
    // todos.push(todo);
    todos.unshift(todo);
    localStorage.setItem("todos", JSON.stringify(todos));
    DisplayTodos();

    document.getElementById("input-box").value = ''             
    document.getElementById("input-description").value = ''
    document.getElementById("due-date").value = '';
    document.getElementById("category").value = '';
  }
});


document.addEventListener('DOMContentLoaded', () => {
  DisplayTodos();
  updateTaskCounter(); 
});


function DisplayTodos() {
  const ul = document.getElementById('list-container');
  ul.innerHTML = ''; 

  todos.forEach((todo) => {
    const li = document.createElement("li");
    li.innerHTML = `
           <label style="color:black; text-decoration: ${todo.done ? 'line-through' : 'none'};">
            <input type="checkbox" data-id="${todo.createdAt}" class="todo-checkbox" ${todo.done ? 'checked' : ''}>
            <span style="color:black; font-size:1.2rem; font-weight:600; word-break:break-all; ">${todo.title}</span><br>
            
            <span style="color:gray; font-weight: 500">Category :- ${todo.category}</span><br>
             <span style="word-break:break-all; color:gray "> Task-Description :-${todo.Description}</span><br>
            <span style="color:gray"> Due-Date :- ${todo.due_date}</span>
          </label>
          <span class="edit-btn" data-id="${todo.createdAt}">Edit</span>
          <span class="delete-btn" data-id="${todo.createdAt}">Delete</span>
      `;
    ul.appendChild(li);
  });

  
  addEventListenertoAllButton();
  updateTaskCounter();
}


function updateTaskCounter() {
  const completed = todos.filter(todo => todo.done).length;
  const uncompleted = todos.length - completed;

  document.getElementById('completed-counter').textContent = completed;
  document.getElementById('uncompleted-counter').textContent = uncompleted;
}
function addEventListenertoAllButton() {
 
  const deleteButtons = document.querySelectorAll('.delete-btn');
  deleteButtons.forEach((btn) => {
    btn.addEventListener('click', function () {
      const id = this.getAttribute('data-id');
      todos = todos.filter((todo) => todo.createdAt !== parseInt(id, 10));
      localStorage.setItem('todos', JSON.stringify(todos));
      console.log(todos)
      DisplayTodos();
    });
  });

 
  const editButtons = document.querySelectorAll('.edit-btn');
  editButtons.forEach((btn) => {
    btn.addEventListener('click', function () {
      const id = this.getAttribute('data-id');
      let todo = todos.find((todo) => todo.createdAt === parseInt(id, 10));

      document.getElementById("input-box").value = todo.title;
      document.getElementById("input-description").value = todo.Description;
      document.getElementById("due-date").value = todo.due_date;
      document.getElementById("category").value = todo.category;
      todos = todos.filter((todo) => todo.createdAt !== parseInt(id, 10));
      localStorage.setItem('todos', JSON.stringify(todos));
      DisplayTodos();
    });
  });

 
  const checkButtons = document.querySelectorAll('.todo-checkbox');
  checkButtons.forEach((checkbox) => {
    checkbox.addEventListener('change', function () {
      const id = this.getAttribute('data-id');
      const todo = todos.find((todo) => todo.createdAt === parseInt(id, 10));
      todo.done = this.checked;

      
      const parentLabel = this.parentElement;
      parentLabel.style.textDecoration = this.checked ? 'line-through' : 'none';

      
      localStorage.setItem('todos', JSON.stringify(todos));

      
      updateTaskCounter();
    });
  });
}



// function updateTaskCounter() {
//   const completedCount = todos.filter((todo) => todo.done).length;
//   const uncompletedCount = todos.filter((todo) => !todo.done).length;
//   document.getElementById('completed-counter').textContent = completedCount;
//   document.getElementById('uncompleted-counter').textContent = uncompletedCount;
// }


const clear_btn = document.getElementById('clear-button');
console.log(clear_btn)
clear_btn.addEventListener('click',function(e){
  confirm("Are you sure...?")
  todos =[];
  DisplayTodos();
})

document.addEventListener('DOMContentLoaded', () => {
  DisplayTodos();
  updateTaskCounter();

  const todaydate = new Date().toISOString().split('T')[0]; 
  document.getElementById('due-date').setAttribute('min', todaydate);
});

// document.getElementsByClassName('editinput')[0].addEventListener('click', function (e) {
//   let input = document.createElement('input');
//   input.type = 'text';
//   input.value = this.innerHTML;
//   this.parentElement.replaceChild(input, this);
//   input.addEventListener('keydown', function (event) {
//       if (event.key === 'Enter') {
//           let id = input.previousElementSibling.getAttribute('data-id');
//           let todo = todos.find(todo => todo.createdAt == id);
//           console.log(todo)
//            todo.title = input.value
//           localStorage.setItem('todos', JSON.stringify(todos));
//           DisplayTodos();
//       }
//   });

//   input.focus();
 
// });
