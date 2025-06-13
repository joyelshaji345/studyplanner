
const defaultGrades = [
  { "subject": "Mathematics", "grade": "O" },
  { "subject": "Physics", "grade": "F" },
  { "subject": "C programming", "grade": "A+" },
  { "subject": "Economics", "grade": "C" },
  { "subject": "Digital Logic", "grade": "B+" },
  { "subject": "Computer Hardware", "grade": "A" }
];

function loadGrades() {
  const saved = localStorage.getItem("gradesData");
  return saved ? JSON.parse(saved) : defaultGrades;
}

function saveGrades(data) {
  localStorage.setItem("gradesData", JSON.stringify(data));
}

let gradesData = loadGrades();

function renderGrades() {
  const container = document.getElementById("grades-container");
  container.innerHTML = "";

  gradesData.forEach((entry, index) => {
    const card = document.createElement("div");
    const grade = entry.grade.trim().toUpperCase();
    let color = "rgba(255, 62, 62, 0.59)";

    if (grade === "O" || grade === "A+" || grade === "A") color = "#8fff8f";     
    else if (grade === "B+" || grade === "B") color = "#fffb91";  
    else if (grade === "C" || grade === "D") color = "#ffd0a1";  
    else if (grade === "F") color = "#ff8b8b";                    

    card.style.backgroundColor = color;
    if (["C", "D", "F"].includes(grade)) {
      const warning = document.createElement("div");
      warning.textContent = "Needs Improvement";
      warning.className = "warning-text";
      card.appendChild(warning);
      card.style.border = "2px solid red";
      card.style.boxShadow = "0 0 10px red";
    } else if (["B+", "B"].includes(grade)) {
      const slight = document.createElement("div");
      slight.textContent = "Try littile more";
      slight.className = "slight-text";
      card.appendChild(slight);
      card.style.border = "2px dashed #d4bb00";
    }

    card.className = "grade-card";


    const subjectEl = document.createElement("div");
    subjectEl.className = "grade-subject";
    subjectEl.textContent = entry.subject;

    const gradeEl = document.createElement("div");
    gradeEl.className = "grade-value";
    gradeEl.textContent = `Grade: ${entry.grade}`;

    const actions = document.createElement("div");
    actions.className = "grade-actions";
    const editSubjectBtn = document.createElement("button");
    editSubjectBtn.className = "edit-subject-btn";
    editSubjectBtn.textContent = "Edit Subject";
    editSubjectBtn.addEventListener("click", () => {
      const newSubject = prompt("Edit Subject:", entry.subject);
      if (newSubject) {
        gradesData[index].subject = newSubject;
        saveGrades(gradesData);
        renderGrades();
      }
    });

    const editGradeBtn = document.createElement("button");
    editGradeBtn.className = "edit-grade-btn";
    editGradeBtn.textContent = "Edit Grade";
    editGradeBtn.addEventListener("click", () => {
      const newGrade = prompt("Edit Grade:", entry.grade);
      if (newGrade) {
        gradesData[index].grade = newGrade;
        saveGrades(gradesData);
        renderGrades();
      }
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", () => {
      if (confirm(`Delete ${entry.subject}?`)) {
        gradesData.splice(index, 1);
        saveGrades(gradesData);
        renderGrades();
      }
    });

    actions.appendChild(editSubjectBtn);
    actions.appendChild(editGradeBtn);
    actions.appendChild(deleteBtn);

    card.appendChild(subjectEl);
    card.appendChild(gradeEl);
    card.appendChild(actions);

    container.appendChild(card);
  });
  updateCGPA();
}
function updateCGPA() {
  const display = document.getElementById("cgpa-display");
  if (!gradesData.length) {
    display.textContent = "CGPA: 0.00";
    return;
  }

  const gradeToPoint = {
    "O": 10,
    "A+": 9,
    "A": 8,
    "B+": 7,
    "B": 6,
    "C": 5,
    "D": 4,
    "F": 0
  };

  let totalPoints = 0;
  let count = 0;

  gradesData.forEach(({ grade }) => {
    const point = gradeToPoint[grade.trim().toUpperCase()];
    if (typeof point === "number") {
      totalPoints += point;
      count++;
    }
  });

  const cgpa = count ? (totalPoints / count).toFixed(2) : "0.00";
  display.textContent = `CGPA: ${cgpa}`;
}


document.getElementById("addBtn").addEventListener("click", () => {
  const subject = document.getElementById("newSubject").value.trim();
  const grade = document.getElementById("newGrade").value.trim();
  if (subject && grade) {
    gradesData.push({ subject, grade });
    saveGrades(gradesData);
    document.getElementById("newSubject").value = "";
    document.getElementById("newGrade").value = "";
    renderGrades();
  }
});
document.getElementById("resetBtn").addEventListener("click", () => {
  const confirmReset = confirm("This will delete all subjects. Continue?");
  if (confirmReset) {
    gradesData = [];
    saveGrades(gradesData); 
    renderGrades();
  }
});
document.getElementById("restoreDefaultsBtn").addEventListener("click", () => {
  if (confirm("Restore default subjects? This will replace your current list.")) {
    gradesData = defaultGrades.map(e => ({ ...e }));
    saveGrades(gradesData);
    renderGrades();
  }
});

window.addEventListener("DOMContentLoaded", renderGrades);
