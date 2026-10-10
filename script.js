
const form = document.getElementById("jobForm");
const companyInput = document.getElementById("company");
const roleInput = document.getElementById("role");
const dateInput = document.getElementById("date");
const statusInput = document.getElementById("status");
const jobList = document.getElementById("jobList");
const searchInput = document.getElementById("search");
const filterInput = document.getElementById("filter");

let jobs = JSON.parse(
  localStorage.getItem("jobs") || "[]"
);

let editingId = null;

function saveJobs() {
  localStorage.setItem("jobs", JSON.stringify(jobs));
}

function updateStats() {
  document.getElementById("total").textContent =
    jobs.length;

  document.getElementById("interviews").textContent =
    jobs.filter(job => job.status === "Interview").length;

  document.getElementById("selected").textContent =
    jobs.filter(job => job.status === "Selected").length;
}

function renderJobs() {
  const query = searchInput.value.toLowerCase();
  const selectedStatus = filterInput.value;

  const filteredJobs = jobs.filter(job => {
    const matchesSearch =
      job.company.toLowerCase().includes(query) ||
      job.role.toLowerCase().includes(query);

    const matchesStatus =
      selectedStatus === "All" ||
      job.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  jobList.replaceChildren();

  if (filteredJobs.length === 0) {
    const message = document.createElement("p");
    message.className = "empty";
    message.textContent = "No applications found.";
    jobList.appendChild(message);
  }

  filteredJobs.forEach(job => {
    const card = document.createElement("article");
    card.className = "job";

    const details = document.createElement("div");

    const title = document.createElement("h3");
    title.textContent = job.company;

    const role = document.createElement("p");
    role.textContent = "Role: " + job.role;

    const date = document.createElement("p");
    date.textContent = "Date: " + job.date;

    const status = document.createElement("p");
    status.textContent = "Status: " + job.status;

    details.append(title, role, date, status);

    const actions = document.createElement("div");
    actions.className = "job-actions";

    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.addEventListener("click", () => {
      companyInput.value = job.company;
      roleInput.value = job.role;
      dateInput.value = job.date;
      statusInput.value = job.status;
      editingId = job.id;
      form.querySelector("button").textContent = "Update Application";
      form.scrollIntoView({ behavior: "smooth" });
    });

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.className = "delete";
    deleteButton.addEventListener("click", () => {
      jobs = jobs.filter(item => item.id !== job.id);
      saveJobs();
      renderJobs();
    });

    actions.append(editButton, deleteButton);
    card.append(details, actions);
    jobList.appendChild(card);
  });

  updateStats();
}

form.addEventListener("submit", event => {
  event.preventDefault();

  const company = companyInput.value.trim();
  const role = roleInput.value.trim();
  const date = dateInput.value;
  const status = statusInput.value;

  if (!company || !role || !date) return;

  if (editingId !== null) {
    jobs = jobs.map(job =>
      job.id === editingId
        ? { ...job, company, role, date, status }
        : job
    );
  } else {
    jobs.push({
      id: Date.now(),
      company,
      role,
      date,
      status
    });
  }

  editingId = null;
  form.reset();
  form.querySelector("button").textContent = "Add Application";

  saveJobs();
  renderJobs();
});

searchInput.addEventListener("input", renderJobs);
filterInput.addEventListener("change", renderJobs);

renderJobs();
