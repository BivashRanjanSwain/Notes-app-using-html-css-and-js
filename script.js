// DOM elements
const modeToggle = document.getElementById('mode-toggle');
const loginSignup = document.getElementById('login-signup');
const notesApp = document.getElementById('notes-app');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const loginBtn = document.getElementById('login-btn');
const signupBtn = document.getElementById('signup-btn');
const logoutBtn = document.getElementById('logout-btn');
const userGreeting = document.getElementById('user-greeting');
const noteHeadingInput = document.getElementById('note-heading');
const noteTitleInput = document.getElementById('note-title');
const noteContentInput = document.getElementById('note-content');
const addNoteBtn = document.getElementById('add-note');
const notesList = document.getElementById('notes-list');

// App state
let currentUser = null;
let notes = [];
let users = [];
let editingNoteIndex = null;

// Helper functions
function saveToLocalStorage() {
    localStorage.setItem('notes', JSON.stringify(notes));
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
}

function loadFromLocalStorage() {
    const savedNotes = localStorage.getItem('notes');
    if (savedNotes) {
        notes = JSON.parse(savedNotes);
    }

    const savedUsers = localStorage.getItem('users');
    if (savedUsers) {
        users = JSON.parse(savedUsers);
    }

    const savedCurrentUser = localStorage.getItem('currentUser');
    if (savedCurrentUser) {
        currentUser = JSON.parse(savedCurrentUser);
        if (currentUser) {
            userGreeting.textContent = currentUser;
            loginSignup.style.display = 'none';
            notesApp.style.display = 'block';
            renderNotes();
        }
    }
}

function renderNotes() {
    notesList.innerHTML = '';
    notes.forEach((note, index) => {
        if (note.username === currentUser) {
            const noteElement = document.createElement('div');
            noteElement.className = 'note';
            noteElement.innerHTML = `
                <div class="note-header">
                    <strong>${note.heading}</strong>
                    <span class="note-date">${note.date}</span>
                </div>
                <div><strong>${note.title}</strong></div>
                <div>${note.content}</div>
                <div class="note-actions">
                    <button onclick="editNote(${index})">Edit</button>
                    <button onclick="deleteNote(${index})">Delete</button>
                </div>
            `;
            notesList.appendChild(noteElement);
        }
    });
}

function addNote() {
    const heading = noteHeadingInput.value.trim();
    const title = noteTitleInput.value.trim();
    const content = noteContentInput.value.trim();
    
    if (heading && title && content) {
        if (editingNoteIndex !== null) {
            // Update existing note
            notes[editingNoteIndex] = {
                heading,
                title,
                content,
                date: new Date().toLocaleString(),
                username: currentUser
            };
            editingNoteIndex = null;
            addNoteBtn.textContent = 'Add Note';
        } else {
            // Add new note
            notes.push({
                heading,
                title,
                content,
                date: new Date().toLocaleString(),
                username: currentUser
            });
        }
        
        saveToLocalStorage();
        renderNotes();
        noteHeadingInput.value = '';
        noteTitleInput.value = '';
        noteContentInput.value = '';
    }
}

function editNote(index) {
    const note = notes[index];
    noteHeadingInput.value = note.heading;
    noteTitleInput.value = note.title;
    noteContentInput.value = note.content;
    addNoteBtn.textContent = 'Update Note';
    editingNoteIndex = index;
}

function deleteNote(index) {
    notes.splice(index, 1);
    saveToLocalStorage();
    renderNotes();
}

function login(username, password) {
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        currentUser = username;
        userGreeting.textContent = username;
        loginSignup.style.display = 'none';
        notesApp.style.display = 'block';
        renderNotes();
    } else {
        alert('Invalid username or password');
    }
}

function signup(username, password) {
    if (users.some(u => u.username === username)) {
        alert('Username already exists');
    } else {
        users.push({ username, password });
        saveToLocalStorage();
        login(username, password);
    }
}

function logout() {
    currentUser = null;
    loginSignup.style.display = 'block';
    notesApp.style.display = 'none';
    saveToLocalStorage();
}

// Event listeners
modeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('dark-mode', document.body.classList.contains('dark-mode'));
    modeToggle.textContent = document.body.classList.contains('dark-mode') ? 'Toggle Light Mode' : 'Toggle Dark Mode';
});

loginBtn.addEventListener('click', (e) => {
    e.preventDefault();
    login(usernameInput.value, passwordInput.value);
});

signupBtn.addEventListener('click', (e) => {
    e.preventDefault();
    signup(usernameInput.value, passwordInput.value);
});

logoutBtn.addEventListener('click', logout);

addNoteBtn.addEventListener('click', addNote);

// Initialize app
loadFromLocalStorage();

// Apply saved dark mode preference
if (localStorage.getItem('dark-mode') === 'true') {
    document.body.classList.add('dark-mode');
    modeToggle.textContent = 'Toggle Light Mode';
}