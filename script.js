// Navbar Date and Time
function updateDateTime() {
    const now = new Date();
    const time = now.toLocaleTimeString();  // Get current time
    const date = now.toLocaleDateString();  // Get current date

    document.getElementById('currentTime').textContent = time; // Display time
    document.getElementById('currentDate').textContent = date; // Display date
}

setInterval(updateDateTime, 1000); // Update every second

updateDateTime(); // Initial call to display the time and date immediately on page load


// Calendar
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

const monthYear = document.getElementById("monthYear");
const calendarDays = document.getElementById("calendarDays");

const months = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
];

function renderCalendar(month, year) {
    const firstDay = new Date(year, month, 1).getDay(); // First day of the month
    const daysInMonth = new Date(year, month + 1, 0).getDate(); // Number of days in the month
    const today = new Date(); // Get today's date
    const todayDate = today.getDate();
    const todayMonth = today.getMonth();
    const todayYear = today.getFullYear();

    calendarDays.innerHTML = ""; // Clear previous days
    monthYear.innerHTML = `${months[month]} ${year}`; // Set the month and year

    // Add empty spans for the days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
        calendarDays.innerHTML += `<span></span>`;
    }

    // Add spans for each day of the month
    for (let i = 1; i <= daysInMonth; i++) {
        // Check if this day is today
        const isToday = (i === todayDate && month === todayMonth && year === todayYear);
        calendarDays.innerHTML += `<span class="${isToday ? 'today' : ''}">${i}</span>`;
    }
}

function prevMonth() {
    currentMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    currentYear = currentMonth === 11 ? currentYear - 1 : currentYear;
    renderCalendar(currentMonth, currentYear);
}

function nextMonth() {
    currentMonth = currentMonth === 11 ? 0 : currentMonth + 1;
    currentYear = currentMonth === 0 ? currentYear + 1 : currentYear;
    renderCalendar(currentMonth, currentYear);
}

renderCalendar(currentMonth, currentYear);

// Notes
function clearNotes() {
    document.getElementById('notesArea').value = '';
    localStorage.removeItem('savedNotes');
}

function saveNotes() {
    const notes = document.getElementById('notesArea').value;
    localStorage.setItem('savedNotes', notes);
    alert('Notes saved!');
}

document.getElementById('notesArea').value = localStorage.getItem('savedNotes');

// Work Timer

// Add an audio element for the alarm sound
const alarmSound = new Audio('alarm.mp3');
let alarmPlaying = false; // Track if the alarm is currently playing

// Function to play the alarm sound
function playAlarm() {
    if (!alarmPlaying) {
        alarmSound.play();
        alarmPlaying = true;
    }
}

// Function to stop the alarm sound
function stopAlarm() {
    alarmSound.pause();
    alarmSound.currentTime = 0; // Reset the audio to the beginning
    alarmPlaying = false;
}

// Work Timer
let workTime = 25 * 60;
let workTimerInterval;
let workTimerPaused = false;

function startWorkTimer() {
    if (workTimerPaused) {
        workTimerPaused = false;
        return; // Continue from where it left off
    }
    clearInterval(workTimerInterval);
    workTimerInterval = setInterval(() => {
        if (workTime > 0) {
            workTime--;
            document.getElementById('workTimer').textContent = formatTime(workTime);
        } else {
            clearInterval(workTimerInterval);
            playAlarm(); // Play the alarm sound when time is up
            alert('Work time is up! Click OK to stop the alarm.'); // Alert message
            stopAlarm(); // Stop the alarm sound when the user clicks OK
            resetWorkTimer(); // Reset the timer
        }
    }, 1000);
}

function pauseWorkTimer() {
    clearInterval(workTimerInterval);
    workTimerPaused = true;
}

function resetWorkTimer() {
    clearInterval(workTimerInterval);
    workTime = 25 * 60; // Reset to 25 minutes
    document.getElementById('workTimer').textContent = formatTime(workTime);
    workTimerPaused = false;
}

// Break Timer
let breakTime = 5 * 60;
let breakTimerInterval;
let breakTimerPaused = false;

function startBreakTimer() {
    if (breakTimerPaused) {
        breakTimerPaused = false;
        return; // Continue from where it left off
    }
    clearInterval(breakTimerInterval);
    breakTimerInterval = setInterval(() => {
        if (breakTime > 0) {
            breakTime--;
            document.getElementById('breakTimer').textContent = formatTime(breakTime);
        } else {
            clearInterval(breakTimerInterval);
            playAlarm(); // Play the alarm sound when time is up
            alert('Break time is up! Click OK to stop the alarm.'); // Alert message
            stopAlarm(); // Stop the alarm sound when the user clicks OK
            resetBreakTimer(); // Reset the timer
        }
    }, 1000);
}

function pauseBreakTimer() {
    clearInterval(breakTimerInterval);
    breakTimerPaused = true;
}

function resetBreakTimer() {
    clearInterval(breakTimerInterval);
    breakTime = 5 * 60; // Reset to 5 minutes
    document.getElementById('breakTimer').textContent = formatTime(breakTime);
    breakTimerPaused = false;
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}


// Checklist 1 Functionality
function addChecklist1Task() {
    const taskInput = document.getElementById('checklist1Input');
    const taskText = taskInput.value.trim();
    if (taskText !== '') {
        const li = document.createElement('li');
        li.innerHTML = `<input type="checkbox"> ${taskText} <button onclick="removeChecklist1Task(this)" class="delete-btn">x</button>`;
        document.getElementById('checklist1List').appendChild(li);
        taskInput.value = '';
        saveChecklist('checklist1List');
    }
}

function removeChecklist1Task(button) {
    button.parentElement.remove();
    saveChecklist('checklist1List');
}

// Checklist 2 Functionality
function addChecklist2Task() {
    const taskInput = document.getElementById('checklist2Input');
    const taskText = taskInput.value.trim();
    if (taskText !== '') {
        const li = document.createElement('li');
        li.innerHTML = `<input type="checkbox"> ${taskText} <button onclick="removeChecklist2Task(this)" class="delete-btn">x</button>`;
        document.getElementById('checklist2List').appendChild(li);
        taskInput.value = '';
        saveChecklist('checklist2List');
    }
}

function removeChecklist2Task(button) {
    button.parentElement.remove();
    saveChecklist('checklist2List');
}

// Save and Load Checklist
function saveChecklist(listId) {
    const tasks = Array.from(document.getElementById(listId).children)
                        .map(li => li.innerHTML);
    localStorage.setItem(listId, JSON.stringify(tasks));
}

function loadChecklist(listId) {
    const tasks = JSON.parse(localStorage.getItem(listId)) || [];
    tasks.forEach(taskHtml => {
        const li = document.createElement('li');
        li.innerHTML = taskHtml;
        document.getElementById(listId).appendChild(li);
    });
}

// Load all checklists
['checklist1List', 'checklist2List']
    .forEach(id => loadChecklist(id));

// To-Do List Functionality
function addTask() {
    const taskInput = document.getElementById('todoInput');
    const taskText = taskInput.value.trim();
    if (taskText !== '') {
        const li = document.createElement('li');
        li.innerHTML = `${taskText} <button onclick="removeTodoTask(this)" class="delete-btn">x</button>`;
        document.getElementById('todoList').appendChild(li);
        taskInput.value = '';
        saveTodoList();
    }
}

function removeTodoTask(button) {
    button.parentElement.remove();
    saveTodoList();
}

function saveTodoList() {
    const tasks = Array.from(document.getElementById('todoList').children)
                        .map(li => li.innerHTML);
    localStorage.setItem('todoList', JSON.stringify(tasks));
}

function loadTodoList() {
    const tasks = JSON.parse(localStorage.getItem('todoList')) || [];
    tasks.forEach(taskHtml => {
        const li = document.createElement('li');
        li.innerHTML = taskHtml;
        document.getElementById('todoList').appendChild(li);
    });
}

loadTodoList();

// Eisenhower Matrix Functionality
function addUrgentImportantTask() {
    const taskInput = document.getElementById('urgentImportantInput');
    const taskText = taskInput.value.trim();
    if (taskText !== '') {
        const li = document.createElement('li');
        li.innerHTML = `${taskText} <button onclick="removeUrgentImportantTask(this)" class="delete-btn">x</button>`;
        document.getElementById('urgentImportantList').appendChild(li);
        taskInput.value = '';
        saveEisenhowerMatrix('urgentImportantList');
    }
}

function removeUrgentImportantTask(button) {
    button.parentElement.remove();
    saveEisenhowerMatrix('urgentImportantList');
}

function addUrgentNotImportantTask() {
    const taskInput = document.getElementById('urgentNotImportantInput');
    const taskText = taskInput.value.trim();
    if (taskText !== '') {
        const li = document.createElement('li');
        li.innerHTML = `${taskText} <button onclick="removeUrgentNotImportantTask(this)" class="delete-btn">x</button>`;
        document.getElementById('urgentNotImportantList').appendChild(li);
        taskInput.value = '';
        saveEisenhowerMatrix('urgentNotImportantList');
    }
}

function removeUrgentNotImportantTask(button) {
    button.parentElement.remove();
    saveEisenhowerMatrix('urgentNotImportantList');
}

function addNotUrgentImportantTask() {
    const taskInput = document.getElementById('notUrgentImportantInput');
    const taskText = taskInput.value.trim();
    if (taskText !== '') {
        const li = document.createElement('li');
        li.innerHTML = `${taskText} <button onclick="removeNotUrgentImportantTask(this)" class="delete-btn">x</button>`;
        document.getElementById('notUrgentImportantList').appendChild(li);
        taskInput.value = '';
        saveEisenhowerMatrix('notUrgentImportantList');
    }
}

function removeNotUrgentImportantTask(button) {
    button.parentElement.remove();
    saveEisenhowerMatrix('notUrgentImportantList');
}

function addNotUrgentNotImportantTask() {
    const taskInput = document.getElementById('notUrgentNotImportantInput');
    const taskText = taskInput.value.trim();
    if (taskText !== '') {
        const li = document.createElement('li');
        li.innerHTML = `${taskText} <button onclick="removeNotUrgentNotImportantTask(this)" class="delete-btn">x</button>`;
        document.getElementById('notUrgentNotImportantList').appendChild(li);
        taskInput.value = '';
        saveEisenhowerMatrix('notUrgentNotImportantList');
    }
}

function removeNotUrgentNotImportantTask(button) {
    button.parentElement.remove();
    saveEisenhowerMatrix('notUrgentNotImportantList');
}

function saveEisenhowerMatrix(listId) {
    const tasks = Array.from(document.getElementById(listId).children)
                        .map(li => li.innerHTML);
    localStorage.setItem(listId, JSON.stringify(tasks));
}

function loadEisenhowerMatrix(listId) {
    const tasks = JSON.parse(localStorage.getItem(listId)) || [];
    tasks.forEach(taskHtml => {
        const li = document.createElement('li');
        li.innerHTML = taskHtml;
        document.getElementById(listId).appendChild(li);
    });
}

// Load all Eisenhower Matrix lists
['urgentImportantList', 'urgentNotImportantList', 'notUrgentImportantList', 'notUrgentNotImportantList']
    .forEach(id => loadEisenhowerMatrix(id));
