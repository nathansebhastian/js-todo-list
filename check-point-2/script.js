const BASE_API_URL = 'http://localhost:3000/tasks';
const tableElement = document.querySelector('#tbody-tasks');

function getTasks(filter) {
  let parameter = '';
  if (filter === 'completed') {
    parameter = '?completed=true';
  } else if (filter === 'active') {
    parameter = '?completed=false';
  }

  const API_URL = BASE_API_URL + parameter;
  fetch(API_URL)
    .then(response => response.json())
    .then(tasks => {
      let tableRows = '';
      tasks.forEach(task => {
        const element = `<tr class=${
          task.completed ? 'table-success' : ''
        }><td><input class="form-check-input" type="checkbox" ${
          task.completed ? 'checked' : ''
        } onclick="toggleTask(event, ${task.id})"></td><td>${
          task.title
        }</td><td><button type="button" class="btn btn-link" onclick="editTask(${
          task.id
        })">Edit</button></td><td><button type="button" class="btn btn-link" onclick="deleteTask(${
          task.id
        })">Delete</button></td></tr>`;

        tableRows += element;

        tableElement.innerHTML = tableRows;
      });
    });
}

getTasks();

function addTask() {
  const taskTitle = document.querySelector('#task-title');
  const data = {
    title: taskTitle.value,
    completed: false,
  };
  fetch(BASE_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  }).then(response => {
    if (response.ok) {
      alert('Task added');
      getTasks();
      taskTitle.value = '';
    }
  });
}

function deleteTask(id) {
  const confirmation = confirm('Are you sure you want to delete the task?');
  if (confirmation) {
    fetch(BASE_API_URL + '/' + id, {
      method: 'DELETE',
    }).then(response => {
      if (response.ok) {
        alert('Task deleted');
        getTasks();
      }
    });
  }
}

function editTask(id) {
  const newTitle = prompt('Enter the new task title');
  if (newTitle) {
    const data = { title: newTitle };
    fetch(BASE_API_URL + '/' + id, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }).then(response => {
      if (response.ok) {
        alert('Task updated');
        getTasks();
      }
    });
  }
}

function toggleTask(event, id) {
  const checked = event.target.checked;
  const data = {
    completed: checked,
  };
  fetch(BASE_API_URL + '/' + id, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  }).then(response => {
    if (response.ok && checked) {
      alert('Hurray! You finished the task');
    }
    getTasks();
  });
}

function filterTasks(event) {
  const filterValue = event.target.value;
  if (filterValue === 'all') {
    getTasks();
  } else if (filterValue === 'completed') {
    getTasks('completed');
  } else {
    getTasks('active');
  }
}
