// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId")) || 1;

// Todo: create a function to generate a unique task id
function generateTaskId() {
  let uniqueId = Date.now();
  return uniqueId;
}

// Todo: create a function to create a task card
function createTaskCard(task) {
  const taskCard = $("<div>")
    .addClass("card project-card draggable my-3")
    .attr("data-task-id", task.id);
  const cardHeader = $("<div>").addClass("card-header").text(task.name);
  const cardBody = $("<div>").addClass("card-body");
  const cardDescription = $("<p>").addClass("card-text").text(task.description);
  const cardDeadline = $("<p>").addClass("card-text").text(task.deadline);
  const cardDeleteBtn = $("<button>")
    .addClass("btn btn-danger delete")
    .text("Delete")
    .attr("data-task-id", task.id);
  cardDeleteBtn.on("click", handleDeleteTask);

  if (task.deadline && task.status !== "done") {
    const now = dayjs();
    const deadline = dayjs(task.deadline, "DD/MM/YYYY");

    if (now.isSame(deadline, "day")) {
      taskCard.addClass("bg-warning text-white");
    } else if (now.isAfter(deadline)) {
      taskCard.addClass("bg-danger text-white");
      cardDeleteBtn.addClass("border-light");
    }
  }

  cardBody.append(cardDescription, cardDeadline, cardDeleteBtn);
  taskCard.append(cardHeader, cardBody);

  return taskCard;
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
  const tasks = taskList || [];

  const todoList = $("#todo-cards").empty();
  const inProgressList = $("#in-progress-cards").empty();
  const doneList = $("#done-cards").empty();

  for (const task of tasks) {
    const taskCard = createTaskCard(task);
    if (task.status === "to-do") {
      todoList.append(taskCard);
    } else if (task.status === "in-progress") {
      inProgressList.append(taskCard);
    } else if (task.status === "done") {
      doneList.append(taskCard);
    }
  }

  $(".draggable").draggable({
    opacity: 0.5,
    zIndex: 2,
    containment: ".swim-lanes",
    revert: "invalid",
  });
}

// Todo: create a function to handle adding a new task
function handleAddTask(event) {
  event.preventDefault();

  const task = $("#task").val().trim();
  const deadline = $("#deadline").val();
  const description = $("#description").val().trim();

  // Check if any of the fields is empty
  if (!task || !deadline || !description) {
    alert("Please fill out all fields.");
    return; // Stop function execution if any field is empty
  }

  const taskId = generateTaskId();

  const newTask = {
    name: task,
    deadline: deadline,
    description: description,
    id: taskId,
    status: "to-do",
  };

  let updateTasks = taskList;

  if (!updateTasks) {
    updateTasks = [];
  }

  updateTasks.push(newTask);

  localStorage.setItem("tasks", JSON.stringify(updateTasks));

  $("#task").val("");
  $("#deadline").val("");
  $("#description").val("");

  $("#formModal").modal("hide"); // Close modal after adding task

  renderTaskList();
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event) {
  const taskId = $(this).attr("data-task-id");
  const tasks = taskList;

  tasks.forEach((task) => {
    if (task.id == taskId) {
      tasks.splice(tasks.indexOf(task), 1);
    }
  });

  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTaskList();
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
  const taskId = ui.draggable.attr("data-task-id");
  const tasks = taskList;
  console.log(taskId);

  const newStatus = event.target.id;
  console.log(newStatus);

  for (let task of tasks) {
    if (task.id == taskId) {
      task.status = newStatus;
    }
  }

  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTaskList();
}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
  // render task list
  renderTaskList();

  // add event listeners
  $("#addTask").on("submit", handleAddTask);

  // delete
  $(".delete").on("click", handleDeleteTask);

  // make lanes droppable
  $(".lane").droppable({
    drop: handleDrop,
  });

  // add datepicker to form input
  $("#deadline").datepicker({
    changeMonth: true,
    changeYear: true,
  });
});
