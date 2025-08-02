# 📋 Todo List Project

A clean, simple, and interactive Todo List app built with **JavaScript**, **HTML**, and **CSS**. This app supports project management, inline editing, and local storage — all in a sleek, responsive interface.

---

## ✨ Features

### ✅ Core Functionality

- **Project-based organization**  
  Create, rename, and delete multiple projects, each with its own list of todos.

- **Todo management**
  - Add todos with:
    - Title
    - Due date
    - Priority (Low, Medium, High)
    - Notes
  - Edit priority, due date, and notes inline
  - Expand/collapse todo details
  - Delete specific todos

- **Persistent data**  
  All data is stored in **Local Storage**, so your projects and todos remain after refreshing or closing the tab.

---

## 🌟 Notable Features & Highlights

### 🗓️ Min Date on Date Input  
Due dates **cannot be set in the past** — the `<input type="date">` uses today as the minimum.

```js
todoDateInput.min = new Date().toISOString().split("T")[0];
```

### 📝 Editable Project Descriptions  
Clicking on a project description transforms it into an **inline textarea** that maintains the layout. Press `Enter` or unfocus to save changes.

- Maintains the same size and styling as the original element.
- Styled to look seamless.

### ✏️ Inline Project Renaming  
Projects can be renamed by clicking the pencil icon — editing is inline and keeps layout consistent (like a real app).

### 📌 Inline Todo Notes Editing  
Each todo item has an editable notes section:
- Click to edit
- Press `Enter` to save
- Uses a fallback placeholder ("Click to add notes…") if empty

### 🔧 Priority Styling  
Each todo's border color changes based on its priority level:
- Green for Low
- Orange for Medium
- Red for High

### 🧠 Clean Module Pattern  
JavaScript is organized using **Immediately Invoked Function Expressions (IIFEs)** to encapsulate state:
- `createProject`: handles all logic for creating, updating, and deleting projects/todos
- `storage`: saves and loads from localStorage

---


## 🚀 Getting Started

1. Clone or download this repo
2. Open `index.html` in a browser
3. Start adding projects and todos!

---

## 🧹 Suggestions for Improvement

This project is great as-is, but you could consider adding:

- Drag and drop todo reordering
- Mark todos as completed
- Due date filtering or sorting
- Light/dark theme toggle
- Backend support for persistence across devices

---

Made with ❤️ and clean modular JavaScript.
