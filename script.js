
kList = document.getElementById('taskList');

function addTask(event) {
  // Prevent default form submission behavior
  if (event) event.preventDefault();

  const title = document.getElementById('taskInput').value.trim();
  const priority = document.getElementById('priority').value;
  const dueDate = document.getElementById('dueDate').value;
  const category = document.getElementById('category').value.trim();
  const subtaskStr = document.getElementById('subtasks').value.trim();

  if (!title) return;

  const li = document.createElement('li');
  li.classList.add(priority);

  const header = document.createElement('div');
  header.className = 'task-header';
  header.innerHTML = `<strong>${title}</strong> <span>${dueDate || 'No due date'} | ${category || 'No category'}</span>`;

  const actions = document.createElement('div');
  actions.className = 'task-actions';

  const doneButton = document.createElement('button');
  doneButton.textContent = 'Done';
  doneButton.addEventListener('click', () => {
    li.classList.toggle('completed');
    saveTasks();
    updateProgress();
  });

  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Delete';
  deleteButton.addEventListener('click', () => {
    li.remove();
    saveTasks();
    updateProgress();
  });

  const editButton = document.createElement('button');
  editButton.textContent = 'Edit';
  editButton.addEventListener('click', () => {
    const newTitle = prompt("Edit task title:", title);
    if (newTitle) {
      li.querySelector('strong').textContent = newTitle;
      saveTasks();
    }
  });

  actions.appendChild(doneButton);
  actions.appendChild(deleteButton);
  actions.appendChild(editButton);
  header.appendChild(actions);
  li.appendChild(header);

  if (subtaskStr) {
    const subtaskList = document.createElement('ul');
    subtaskList.className = 'subtasks';
    subtaskStr.split(',').forEach(sub => {
      const subItem = document.createElement('li');
      subItem.textContent = sub.trim();
      subtaskList.appendChild(subItem);
    });
    li.appendChild(subtaskList);
  }

  taskList.appendChild(li);
  clearForm();
  saveTasks();
  updateProgress();
}

function clearForm() {
  document.getElementById('taskInput').value = '';
  document.getElementById('priority').value = 'low';
  document.getElementById('dueDate').value = '';
  document.getElementById('category').value = '';
  document.getElementById('subtasks').value = '';
}

function saveTasks() {
  localStorage.setItem('tasks', taskList.innerHTML);
}

function loadTasks() {
  const saved = localStorage.getItem('tasks');
  if (saved) taskList.innerHTML = saved;
  updateProgress();

}

function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
}

function updateProgress() {
  const total = taskList.children.length;
  const completed = [...taskList.children].filter(task => task.classList.contains('completed')).length;
  const progress = document.getElementById('progress');
  progress.textContent = `Progress: ${completed} of ${total} tasks completed`;
}

function clearAllTasks() {
  if (confirm("Are you sure you want to delete all tasks?")) {
    taskList.innerHTML = '';
    localStorage.removeItem('tasks');
    updateProgress();
  }
}

// Attach event listeners on load
window.onload = () => {
  loadTasks();

  // Change this ID to match your actual button or form element
  document.getElementById('addTaskBtn').addEventListener('click', addTask);
  document.getElementById('clearAllBtn').addEventListener('click', clearAllTasks);
};
