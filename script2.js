/* =================================
   DOM ELEMENTS
================================= */

const taskInput = document.getElementById("taskInput");
const priorityInput = document.getElementById("priorityInput");
const dateInput = document.getElementById("dateInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");

const searchInput = document.getElementById("searchInput");
const filterButtons = document.querySelectorAll(".filter-btn");

const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const pendingTasks = document.getElementById("pendingTasks");
const productivityRate = document.getElementById("productivityRate");

const progressCircle = document.getElementById("progressCircle");
const progressPercent = document.getElementById("progressPercent");

const clearCompleted = document.getElementById("clearCompleted");

const liveClock = document.getElementById("liveClock");
const currentDate = document.getElementById("currentDate");

const themeToggle = document.getElementById("themeToggle");
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

const toast = document.getElementById("toast");

const productivityTip =
    document.getElementById("productivityTip");

const footerYear =
    document.getElementById("footerYear");

const contactForm =
    document.getElementById("contactForm");

const heroProgress =
    document.getElementById("heroProgress");

const heroProgressBar =
    document.getElementById("heroProgressBar");


/* =================================
   TASK DATA
================================= */

let tasks =
    JSON.parse(
        localStorage.getItem("taskflowTasks")
    ) || [];

let currentFilter = "all";


/* =================================
   SAVE TASKS
================================= */

function saveTasks() {

    localStorage.setItem(
        "taskflowTasks",
        JSON.stringify(tasks)
    );

}


/* =================================
   TOAST MESSAGE
================================= */

function showToast(message, type = "success") {

    toast.textContent = message;

    toast.className =
        `toast show ${type}`;

    setTimeout(() => {

        toast.classList.remove("show");

    }, 3000);

}


/* =================================
   ADD TASK
================================= */

function addTask() {

    const text =
        taskInput.value.trim();

    const priority =
        priorityInput.value;

    const date =
        dateInput.value;

    if (!text) {

        showToast(
            "Please enter a task.",
            "error"
        );

        taskInput.focus();

        return;
    }


    const task = {

        id: Date.now(),

        text: text,

        priority: priority,

        date: date,

        completed: false,

        createdAt: new Date().toISOString()

    };


    tasks.unshift(task);

    saveTasks();

    taskInput.value = "";

    dateInput.value = "";

    priorityInput.value = "Medium";

    renderTasks();

    updateStatistics();

    showToast(
        "Task added successfully!"
    );

}


/* =================================
   DELETE TASK
================================= */

function deleteTask(id) {

    tasks =
        tasks.filter(
            task => task.id !== id
        );

    saveTasks();

    renderTasks();

    updateStatistics();

    showToast(
        "Task deleted."
    );

}


/* =================================
   TOGGLE TASK
================================= */

function toggleTask(id) {

    tasks =
        tasks.map(task => {

            if (task.id === id) {

                return {
                    ...task,
                    completed:
                        !task.completed
                };

            }

            return task;

        });


    saveTasks();

    renderTasks();

    updateStatistics();

}


/* =================================
   EDIT TASK
================================= */

function editTask(id) {

    const task =
        tasks.find(
            task => task.id === id
        );

    if (!task) return;


    const newText =
        prompt(
            "Edit your task:",
            task.text
        );


    if (
        newText !== null &&
        newText.trim() !== ""
    ) {

        task.text =
            newText.trim();

        saveTasks();

        renderTasks();

        showToast(
            "Task updated successfully!"
        );

    }

}


/* =================================
   CLEAR COMPLETED
================================= */

function clearCompletedTasks() {

    const completedCount =
        tasks.filter(
            task => task.completed
        ).length;


    if (completedCount === 0) {

        showToast(
            "No completed tasks to clear.",
            "error"
        );

        return;

    }


    const confirmed =
        confirm(
            `Delete ${completedCount} completed task(s)?`
        );


    if (!confirmed) return;


    tasks =
        tasks.filter(
            task => !task.completed
        );

    saveTasks();

    renderTasks();

    updateStatistics();

    showToast(
        "Completed tasks cleared."
    );

}


/* =================================
   FORMAT DATE
================================= */

function formatDate(dateString) {

    if (!dateString) {
        return "No deadline";
    }


    const date =
        new Date(
            dateString + "T00:00:00"
        );


    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

}


/* =================================
   CHECK OVERDUE
================================= */

function isOverdue(task) {

    if (
        !task.date ||
        task.completed
    ) {
        return false;
    }


    const today =
        new Date();

    today.setHours(
        0,
        0,
        0,
        0
    );


    const taskDate =
        new Date(
            task.date + "T00:00:00"
        );


    return taskDate < today;

}


/* =================================
   ESCAPE HTML
================================= */

function escapeHTML(str) {

    return String(str)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


/* =================================
   RENDER TASKS
================================= */

function renderTasks() {

    const searchTerm =
        searchInput.value
            .trim()
            .toLowerCase();


    let filteredTasks =
        tasks.filter(task => {

            const matchesSearch =
                task.text
                    .toLowerCase()
                    .includes(searchTerm);


            let matchesFilter = true;


            if (
                currentFilter ===
                "completed"
            ) {

                matchesFilter =
                    task.completed;

            }


            if (
                currentFilter ===
                "pending"
            ) {

                matchesFilter =
                    !task.completed;

            }


            if (
                currentFilter ===
                "high"
            ) {

                matchesFilter =
                    task.priority ===
                    "High";

            }


            return (
                matchesSearch &&
                matchesFilter
            );

        });


    taskList.innerHTML = "";


    if (
        filteredTasks.length === 0
    ) {

        taskList.innerHTML = `

            <div
                style="
                    text-align:center;
                    padding:40px 20px;
                    color:#94a3b8;
                "
            >

                <div
                    style="
                        font-size:40px;
                        margin-bottom:10px;
                    "
                >
                    📭
                </div>

                <strong>
                    No tasks found
                </strong>

                <p
                    style="
                        font-size:13px;
                        margin-top:5px;
                    "
                >
                    Add a new task or
                    change your filter.
                </p>

            </div>

        `;

        return;

    }


    filteredTasks.forEach(task => {

        const taskItem =
            document.createElement("div");


        taskItem.className =
            "task-item";


        const priorityClass =
            task.priority.toLowerCase();


        const overdueText =
            isOverdue(task)
                ? " • Overdue"
                : "";


        taskItem.innerHTML = `

            <div
                class="
                    task-check
                    ${task.completed ? "completed" : ""}
                "
                onclick="toggleTask(${task.id})"
            >
                ${task.completed ? "✓" : ""}
            </div>


            <div class="task-content">

                <div
                    class="
                        task-title
                        ${task.completed ? "completed" : ""}
                    "
                >
                    ${escapeHTML(task.text)}
                </div>


                <div class="task-meta">

                    <span
                        class="
                            priority-badge
                            priority-${priorityClass}
                        "
                    >
                        ${escapeHTML(task.priority)}
                    </span>

                    <span>
                        📅
                        ${formatDate(task.date)}
                        ${overdueText}
                    </span>

                </div>

            </div>


            <div class="task-actions">

                <button
                    class="task-action"
                    title="Edit Task"
                    onclick="editTask(${task.id})"
                >
                    ✏️
                </button>


                <button
                    class="task-action"
                    title="Delete Task"
                    onclick="deleteTask(${task.id})"
                >
                    🗑
                </button>

            </div>

        `;


        taskList.appendChild(taskItem);

    });

}


/* =================================
   UPDATE STATISTICS
================================= */

function updateStatistics() {

    const total =
        tasks.length;


    const completed =
        tasks.filter(
            task => task.completed
        ).length;


    const pending =
        total - completed;


    const progress =
        total === 0
            ? 0
            : Math.round(
                (completed / total) * 100
            );


    totalTasks.textContent =
        total;

    completedTasks.textContent =
        completed;

    pendingTasks.textContent =
        pending;

    productivityRate.textContent =
        `${progress}%`;


    progressPercent.textContent =
        `${progress}%`;


    const degrees =
        progress * 3.6;


    progressCircle.style.background =
        `conic-gradient(
            #6366f1 0deg,
            #6366f1 ${degrees}deg,
            #e2e8f0 ${degrees}deg
        )`;


    heroProgress.textContent =
        `${progress}%`;


    heroProgressBar.style.width =
        `${progress}%`;

}


/* =================================
   FILTER BUTTONS
================================= */

filterButtons.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            filterButtons.forEach(btn => {

                btn.classList.remove(
                    "active"
                );

            });


            button.classList.add(
                "active"
            );


            currentFilter =
                button.dataset.filter;


            renderTasks();

        }
    );

});


/* =================================
   SEARCH
================================= */

searchInput.addEventListener(
    "input",
    renderTasks
);


/* =================================
   ADD BUTTON
================================= */

addTaskBtn.addEventListener(
    "click",
    addTask
);


/* =================================
   ENTER KEY
================================= */

taskInput.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Enter"
        ) {

            addTask();

        }

    }
);


/* =================================
   CLEAR COMPLETED
================================= */

clearCompleted.addEventListener(
    "click",
    clearCompletedTasks
);


/* =================================
   LIVE CLOCK
================================= */

function updateClock() {

    const now =
        new Date();


    liveClock.textContent =
        now.toLocaleTimeString(
            "en-IN",
            {
                hour12: false
            }
        );


    currentDate.textContent =
        now.toLocaleDateString(
            "en-IN",
            {
                weekday: "short",
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );

}


updateClock();

setInterval(
    updateClock,
    1000
);


/* =================================
   PRODUCTIVITY TIPS
================================= */

const tips = [

    "Break large tasks into smaller, manageable steps.",

    "Focus on one important task at a time.",

    "Set realistic deadlines for your tasks.",

    "Complete high-priority tasks first.",

    "Take short breaks to maintain focus.",

    "Review your task list at the beginning of each day.",

    "Remove unnecessary tasks from your schedule."

];


let tipIndex = 0;


setInterval(() => {

    tipIndex =
        (tipIndex + 1) %
        tips.length;


    productivityTip.textContent =
        tips[tipIndex];

}, 5000);


/* =================================
   THEME TOGGLE
================================= */

const savedTheme =
    localStorage.getItem(
        "taskflowTheme"
    );


if (
    savedTheme === "dark"
) {

    document.body.classList.add(
        "dark-mode"
    );

    themeToggle.textContent =
        "☀️";

}


themeToggle.addEventListener(
    "click",
    () => {

        document.body.classList.toggle(
            "dark-mode"
        );


        const isDark =
            document.body.classList.contains(
                "dark-mode"
            );


        themeToggle.textContent =
            isDark
                ? "☀️"
                : "🌙";


        localStorage.setItem(
            "taskflowTheme",
            isDark
                ? "dark"
                : "light"
        );

    }
);


/* =================================
   MOBILE MENU
================================= */

menuToggle.addEventListener(
    "click",
    () => {

        navLinks.classList.toggle(
            "active"
        );

    }
);


document
    .querySelectorAll(".nav-links a")
    .forEach(link => {

        link.addEventListener(
            "click",
            () => {

                navLinks.classList.remove(
                    "active"
                );

            }
        );

    });


/* =================================
   CONTACT FORM
================================= */

contactForm.addEventListener(
    "submit",
    event => {

        event.preventDefault();


        const name =
            document
                .getElementById("name")
                .value
                .trim();


        const email =
            document
                .getElementById("email")
                .value
                .trim();


        const subject =
            document
                .getElementById("subject")
                .value
                .trim();


        const message =
            document
                .getElementById("message")
                .value
                .trim();


        if (
            !name ||
            !email ||
            !subject ||
            !message
        ) {

            showToast(
                "Please fill in all fields.",
                "error"
            );

            return;

        }


        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


        if (
            !emailPattern.test(email)
        ) {

            showToast(
                "Please enter a valid email address.",
                "error"
            );

            return;

        }


        showToast(
            `Thank you, ${name}! Your message has been sent successfully.`
        );


        contactForm.reset();

    }
);


/* =================================
   DATE MINIMUM
================================= */

const today =
    new Date()
        .toISOString()
        .split("T")[0];


dateInput.min =
    today;


/* =================================
   FOOTER YEAR
================================= */

footerYear.textContent =
    new Date().getFullYear();


/* =================================
   INITIAL LOAD
================================= */

renderTasks();

updateStatistics();
