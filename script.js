let myTasks = [];

const listA = document.getElementById('taskList');
const progressBar = document.getElementById('progress');

function showTasks() {
  listA.innerHTML = '';

  myTasks.forEach((task, i) => {
    const item = document.createElement('li');
    item.classList.add(task.priority);
    if (task.done) item.classList.add('completed');

    const top = document.createElement('div');
    top.className = 'task-header';
    top.innerHTML = `<strong>${task.title}</strong> 
      <span>${task.due || 'No due date'} | ${task.cat || 'No category'}</span>`;

    const btnBox = document.createElement('div');
    btnBox.className = 'task-actions';

    btnBox.appendChild(makeBtn('Done', () => toggleDone(i)));
    btnBox.appendChild(makeBtn('Delete', () => deleteOne(i)));
    btnBox.appendChild(makeBtn('Edit', () => editOne(i)));

    top.appendChild(btnBox);
    item.appendChild(top);

    if (task.subs && task.subs.length > 0) {
      const subList = document.createElement('ul');
      subList.className = 'subtasks';
      task.subs.forEach(s => {
        const sub = document.createElement('li');
        sub.textContent = s;
        subList.appendChild(sub);
      });
      item.appendChild(subList);
    }

    listA.appendChild(item);
  });

  updateBar();
}

function addOne(e) {
  if (e) e.preventDefault();

  const name = getVal('taskInput');
  if (!name) return;

  const newTask = {
    title: name,
    priority: getVal('priority'),
    due: getVal('dueDate'),
    cat: getVal('category'),
    subs: getVal('subtasks').split(',').map(x => x.trim()).filter(Boolean),
    done: false
  };

  myTasks.push(newTask);
  clearForm();
  saveStuff();
  showTasks();
}

function toggleDone(i) {
  myTasks[i].done = !myTasks[i].done;
  saveStuff();
  showTasks();
}

function deleteOne(i) {
  myTasks.splice(i, 1);
  saveStuff();
  showTasks();
}

function editOne(i) {
  const updated = prompt('Edit the task title:', myTasks[i].title);
  if (updated) {
    myTasks[i].title = updated;
    saveStuff();
    showTasks();
  }
}

function clearForm() {
  setVal('taskInput', '');
  setVal('priority', 'low');
  setVal('dueDate', '');
  setVal('category', '');
  setVal('subtasks', '');
}

function saveStuff() {
  localStorage.setItem('myTasks', JSON.stringify(myTasks));
}

function loadStuff() {
  const data = localStorage.getItem('myTasks');
  if (data) myTasks = JSON.parse(data);
}

function updateBar() {
  const total = myTasks.length;
  const doneCount = myTasks.filter(t => t.done).length;
  progressBar.textContent = `Progress: ${doneCount} of ${total} tasks completed`;
}

function clearAll() {
  if (confirm('Delete everything?')) {
    myTasks = [];
    saveStuff();
    showTasks();
  }
}

function darkSwitch() {
  document.body.classList.toggle('dark-mode');
}

function makeBtn(label, action) {
  const btn = document.createElement('button');
  btn.textContent = label;
  btn.addEventListener('click', action);
  return btn;
}

function getVal(id) {
  return document.getElementById(id).value.trim();
}

function setVal(id, val) {
  document.getElementById(id).value = val;
}

window.onload = () => {
  loadStuff();
  showTasks();
  document.getElementById('addTaskButton').addEventListener('click', addOne);
  document.getElementById('clearAllBtn').addEventListener('click', clearAll);
};
