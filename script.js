if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('sw.js').then(function(registration) {
      // Registration was successful
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }, function(err) {
      // registration failed :(
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}

let taskList = document.getElementById('task-list');
let taskInput = document.getElementById('task-input');
let addBtn = document.getElementById('add-btn');
let tasks = [];

// Load tasks from local storage
if (localStorage.getItem('tasks')) {
  tasks = JSON.parse(localStorage.getItem('tasks'));
  renderTasks();
}

// Add task to list
addBtn.addEventListener('click', function() {
  let task = taskInput.value;
  if (task) {
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
    taskInput.value = '';
  }
});

// Remove task from list
taskList.addEventListener('click', function(event) {
  if (event.target.tagName === 'LI') {
let taskIndex = Array.from(taskList.children).indexOf(event.target);
tasks.splice(taskIndex, 1);
localStorage.setItem('tasks', JSON.stringify(tasks));
renderTasks();
}
});

// Render tasks on screen
function renderTasks() {
taskList.innerHTML = '';
for (let i = 0; i < tasks.length; i++) {
let li = document.createElement('li');
li.appendChild(document.createTextNode(tasks[i]));
taskList.appendChild(li);
}
}

const cacheName = 'todo-list-v1';

self.addEventListener('install', function(event) {
event.waitUntil(
caches.open(cacheName).then(function(cache) {
return cache.addAll([
'/',
'/index.html',
'/manifest.json',
'/style.css',
'/script.js',
'/icon.png'
]);
})
);
});

self.addEventListener('fetch', function(event) {
event.respondWith(
caches.match(event.request).then(function(response) {
if (response) {
return response;
}
return fetch(event.request);
})
);
});