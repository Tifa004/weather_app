// Entry point CSS import
import "./styles.css";
import { format } from 'date-fns';

// ---------------- Storage Module ----------------
const storage = (function () {
  function saveProjects(projects) {
    localStorage.setItem('projects', JSON.stringify(projects));
  }

  function loadProjects() {
    const stored = localStorage.getItem('projects');
    if (!stored) return;

    const parsed = JSON.parse(stored);
    for (const name in parsed) {
      const project = parsed[name];
      createProject.create(name, project.description, project.list);
    }
  }

  function removeAll() {
    localStorage.clear();
  }

  return { saveProjects, loadProjects, removeAll };
})();

// ---------------- Project Factory ----------------
const createProject = (function () {
  let projects = {};

  function create(name, description = `What's this about?`, list = {}) {
    projects[name] = { description, list };
    storage.saveProjects(projects);
  }

  function updateKey(oldKey, newKey) {
    if (projects[oldKey] && !projects[newKey]) {
      projects[newKey] = projects[oldKey];
      delete projects[oldKey];
      storage.saveProjects(projects);
      return true;
    }
    return false;
  }

  function updateTodoKey(project, oldKey, newKey) {
    if (projects[project].list[oldKey] && !projects[project].list[newKey]) {
      projects[project].list[newKey] = projects[project].list[oldKey];
      delete projects[project].list[oldKey];
      storage.saveProjects(projects);
      return true;
    }
    return false;
  }

  function isValidDate(date) {
    return !isNaN(new Date(date).getTime());
  }

  function addTodo(project, name, dueDate, priority, notes) {
    if (projects[project].list[name]) return false;

    projects[project].list[name] = {
      dueDate: isValidDate(dueDate) ? format(new Date(dueDate), 'MMMM do, yyyy') : '',
      notes,
      priority,
      done: false
    };
    storage.saveProjects(projects);
    return true;
  }

  function updateProperty(project, propertyname, newInfo) {
    projects[project][propertyname] = newInfo;
    storage.saveProjects(projects);
  }

  function updateTodo(project, todo, propertyname, data) {
    projects[project].list[todo][propertyname] = data;
    storage.saveProjects(projects);
  }

  function deleteProject(project) {
    delete projects[project];
    if (Object.keys(projects).length === 0) {
      create('Default', `What's this about?`);
    }
    storage.saveProjects(projects);
  }

  function deleteTodo(project, todo) {
    delete projects[project].list[todo];
    storage.saveProjects(projects);
  }

  function getProjects() {
    return { ...projects };
  }

  return {
    create,
    updateKey,
    updateTodoKey,
    addTodo,
    updateProperty,
    deleteProject,
    deleteTodo,
    getProjects,
    updateTodo
  };
})();

// ---------------- DOM References ----------------
const projectList       = document.querySelector('.project-list');
const newProjectInput   = document.getElementById('new-project-input');
const addProjectBtn     = document.getElementById('add-project-btn');
const contentSection    = document.querySelector('.description');
const titleHeader       = document.querySelector('.title');
const todoTitleInput    = document.getElementById('todo_name');
const todoDateInput     = document.getElementById('date');
const todoPriorityInput = document.getElementById('priority');
const addTodoBtn        = document.getElementById('add_todo');

// ---------------- Load and Initialize ----------------
storage.loadProjects();

if (Object.keys(createProject.getProjects()).length === 0) {
  createProject.create('Default', 'What`s this about?');
}

if (todoDateInput) {
  todoDateInput.min = new Date().toISOString().split("T")[0];
}

// ---------------- Helpers ----------------
function makeDescEditable(descEl, key) {
  descEl.addEventListener('click', () => {
    // Create textarea and copy styles/sizing
    const textarea = document.createElement('textarea');
    textarea.value = descEl.textContent.trim();

    // Match styles to prevent layout shift
    const style = window.getComputedStyle(descEl);
    textarea.style.width = style.width;
    textarea.style.height = style.height;
    textarea.style.fontSize = style.fontSize;
    textarea.style.fontFamily = style.fontFamily;
    textarea.style.lineHeight = style.lineHeight;
    textarea.style.padding = style.padding;
    textarea.style.borderRadius = style.borderRadius;
    textarea.style.border = style.border;
    textarea.style.resize = 'none';
    textarea.style.boxSizing = 'border-box';

    // Replace descEl with textarea and focus
    descEl.replaceWith(textarea);
    textarea.focus();

    function saveAndRender() {
      const newDesc = textarea.value.trim() || `What's this about?`;

      // Replace textarea back with descEl
      descEl.textContent = newDesc;
      textarea.replaceWith(descEl);

      // Update storage/project description
      createProject.updateProperty(key, 'description', newDesc);
    }

    textarea.addEventListener('blur', saveAndRender);
    textarea.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        textarea.blur();
      }
    });
  });
}


function makeNoteEditable(noteEl, projectKey, todoKey) {
  noteEl.addEventListener('click', () => {
    const ta = document.createElement('textarea');
    ta.className = 'note-editor';
    ta.value = createProject.getProjects()[projectKey].list[todoKey].notes || '';
    noteEl.replaceWith(ta);
    ta.focus();

    let saved = false; // guard to prevent multiple saves

    const save = () => {
      if (saved) return;
      saved = true;

      const txt = ta.value.trim();
      createProject.updateTodo(projectKey, todoKey, 'notes', txt);
      ta.replaceWith(noteEl);
      noteEl.textContent = txt || 'Click to add notes…';
    };

    ta.addEventListener('blur', save);
    ta.addEventListener('keydown', e => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        save();
      }
    });
  });
}

function renderProjects() {
  const projects = createProject.getProjects();
  projectList.innerHTML = '';

  Object.keys(projects).forEach((key) => {
    const project = projects[key];

    const li = document.createElement('li');

    const btn = document.createElement('button');
    btn.className = 'project-name-btn';
    btn.innerHTML = `
      <span class="project-name-text">${key}</span>
      <svg class="edit-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1.003 1.003 0 0 0 0-1.42l-2.34-2.34a1.003 1.003 0 0 0-1.42 0l-1.83 1.83 3.75 3.75 1.84-1.82z"/>
      </svg>
      <svg class="delete-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
        <path d="M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z M15.5,4L14.5,3H9.5L8.5,4H5V6H19V4Z" />
      </svg>
    `;

    // Edit project name
    btn.querySelector('.edit-icon').addEventListener('click', (e) => {
      e.stopPropagation();
      const input = document.createElement('input');
      input.type = 'text';
      input.value = key;
      input.className = 'project-rename-input';
      li.innerHTML = '';
      li.appendChild(input);
      input.focus();

      const save = () => {
        const newKey = input.value.trim();
        if (!newKey || newKey === key) return renderProjects();
        createProject.updateKey(key, newKey);
        titleHeader.textContent = newKey;
        renderProjects();
      };

      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') save();
      });
      input.addEventListener('blur', save);
    });

    // Delete project
    btn.querySelector('.delete-icon').addEventListener('click', (e) => {
      e.stopPropagation();
      const wasActive = titleHeader.textContent === key;

      createProject.deleteProject(key);
      renderProjects();

      const projects = createProject.getProjects();
      const remainingKeys = Object.keys(projects);

      if (wasActive && remainingKeys.length > 0) {
        const nextKey = remainingKeys[0];
        titleHeader.textContent = nextKey;

        contentSection.innerHTML = `
          <h3>Description</h3>
          <p id="project-description" class="editable">${projects[nextKey].description}</p>
        `;
        const descEl = document.getElementById('project-description');
        makeDescEditable(descEl, nextKey);
        renderTodos(nextKey);
      } else {
        titleHeader.textContent = '';
        contentSection.innerHTML = '';
      }
    });

    // Select project on click
    btn.addEventListener('click', () => {
      titleHeader.textContent = key;
      localStorage.setItem('lastProject', key);

      contentSection.innerHTML = `
        <h3>Description</h3>
        <p id="project-description" class="editable">${project.description}</p>
      `;
      makeDescEditable(document.getElementById('project-description'), key);
      renderTodos(key);
    });

    li.appendChild(btn);
    projectList.appendChild(li);
  });
}

// ---------------- Render Todos ----------------
function renderTodos(projectKey) {
  const project = createProject.getProjects()[projectKey];
  let todoList = contentSection.querySelector('.todo-list');

  if (!todoList) {
    todoList = document.createElement('ul');
    todoList.className = 'todo-list';
    contentSection.appendChild(todoList);
  }

  todoList.innerHTML = '';

  for (const [title, todo] of Object.entries(project.list)) {
    const li = document.createElement('li');
    li.className = `todo-item priority-${todo.priority.toLowerCase()}`;

    li.innerHTML = `
      <div class="todo-line">
        <div class="todo-title-group">
          <span class="todo-title">${title}</span>
          <span class="todo-date small-date">${todo.dueDate}</span>
        </div>
      </div>
      <div class="todo-details hidden">
        <div class="expanded-date-wrapper">
          <p class="expanded-date"><strong>Due:</strong> <span class="due-text">${todo.dueDate}</span></p>
          <button class="date-edit-btn" title="Edit Due Date">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 22" width="16" height="16" fill="currentColor">
        <path d="M19 20H3V19H2V3H3V2H5V0H7V2H15V0H17V2H19V3H20V19H19V20M4 4V6H18V4H4M4 8V18H18V8H4M12 12H16V16H12V12Z"/>
      </svg>
    </button>
        </div>
        <label><strong>Priority:</strong> 
          <select class="priority-select">
            <option value="Low" ${todo.priority === 'Low' ? 'selected' : ''}>Low</option>
            <option value="Medium" ${todo.priority === 'Medium' ? 'selected' : ''}>Medium</option>
            <option value="High" ${todo.priority === 'High' ? 'selected' : ''}>High</option>
          </select>
        </label>
        <h3><strong>Notes</h3>
        <p class="todo-note editable">${todo.notes || 'Click to add notes…'}</p>
      </div>
    `;

    // Toggle show/hide
    li.querySelector('.todo-line').addEventListener('click', () => {
      li.querySelector('.todo-details').classList.toggle('hidden');
    });

    // Editable note
    makeNoteEditable(li.querySelector('.todo-note'), projectKey, title);

    // Priority change
    li.querySelector('.priority-select').addEventListener('change', (e) => {
      const newPriority = e.target.value;
      createProject.updateTodo(projectKey, title, 'priority', newPriority);
      li.className = `todo-item priority-${newPriority.toLowerCase()}`;
    });

    // Date edit
    li.querySelector('.date-edit-btn').addEventListener('click', () => {
      const input = document.createElement('input');
      input.type = 'date';
      input.className = 'date-inline-input';
      input.min = new Date().toISOString().split("T")[0];

      const wrapper = li.querySelector('.expanded-date-wrapper');
      wrapper.appendChild(input);
      input.focus();

      const save = () => {
        if (!input.value) {
          wrapper.removeChild(input);
          return;
        }

        const selectedDate = new Date(input.value);
        const now = new Date();
        now.setHours(0, 0, 0, 0);

        if (selectedDate < now) {
          alert("You can't set a due date in the past.");
          wrapper.removeChild(input);
          return;
        }

        const formatted = format(selectedDate, 'MMMM do, yyyy');
        createProject.updateTodo(projectKey, title, 'dueDate', formatted);
        li.querySelector('.todo-date').textContent = formatted;
        li.querySelector('.due-text').textContent = formatted;
        wrapper.removeChild(input);
      };

      input.addEventListener('change', save);
      input.addEventListener('blur', save);
    });

    todoList.appendChild(li);
  }
}

// ---------------- UI Events ----------------
addProjectBtn.addEventListener('click', () => {
  const name = newProjectInput.value.trim();
  if (!name) return;
  createProject.create(name);
  newProjectInput.value = '';
  renderProjects();
});

newProjectInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') addProjectBtn.click();
});

addTodoBtn.addEventListener('click', () => {
  const title = todoTitleInput.value.trim();
  const date  = todoDateInput.value;
  const prio  = todoPriorityInput.value;
  const key   = titleHeader.textContent;

  if (!title || !date || !prio || !key) return;

  if (createProject.addTodo(key, title, date, prio, '')) {
    todoTitleInput.value = '';
    todoDateInput.value = '';
    todoPriorityInput.value = '';
    renderTodos(key);
  }
});

// ---------------- Final Render ----------------
function renderProjectsAndSelectLast() {
  renderProjects();
  const last = localStorage.getItem('lastProject');
  const keys = Object.keys(createProject.getProjects());

  if (last && keys.includes(last)) {
    document.querySelectorAll('.project-name-btn').forEach(btn => {
      if (btn.textContent.includes(last)) btn.click();
    });
  } else if (keys.length > 0) {
    document.querySelector('.project-name-btn')?.click();
  }
}

renderProjectsAndSelectLast();
