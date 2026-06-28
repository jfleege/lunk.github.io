const muscleGroups = [
  "chest",
  "abs",
  "shoulders",
  "biceps",
  "triceps",
  "forearms",
  "quads",
  "calves",
  "upper_back",
  "lats",
  "rear_delts",
  "glutes",
  "hamstrings"
];

const exerciseLibrary = {
  "Bench Press": {
    primary: ["chest"],
    secondary: ["triceps", "shoulders"]
  },
  "Incline Dumbbell Press": {
    primary: ["chest", "shoulders"],
    secondary: ["triceps"]
  },
  "Shoulder Press": {
    primary: ["shoulders"],
    secondary: ["triceps"]
  },
  "Lat Pulldown": {
    primary: ["lats"],
    secondary: ["biceps", "upper_back"]
  },
  "Barbell Row": {
    primary: ["upper_back", "lats"],
    secondary: ["biceps", "rear_delts"]
  },
  "Bicep Curl": {
    primary: ["biceps"],
    secondary: ["forearms"]
  },
  "Tricep Pushdown": {
    primary: ["triceps"],
    secondary: []
  },
  "Squat": {
    primary: ["quads", "glutes"],
    secondary: ["hamstrings", "abs", "calves"]
  },
  "Romanian Deadlift": {
    primary: ["hamstrings", "glutes"],
    secondary: ["upper_back"]
  },
  "Calf Raise": {
    primary: ["calves"],
    secondary: []
  },
  "Plank": {
    primary: ["abs"],
    secondary: ["shoulders"]
  }
};

const exerciseSelect = document.getElementById("exerciseSelect");
const setsInput = document.getElementById("setsInput");
const logButton = document.getElementById("logButton");
const clearButton = document.getElementById("clearButton");
const coveragePercent = document.getElementById("coveragePercent");
const mostWorked = document.getElementById("mostWorked");
const needsWork = document.getElementById("needsWork");
const historyList = document.getElementById("historyList");

let workouts = JSON.parse(localStorage.getItem("lunkWorkouts")) || [];

function saveWorkouts() {
  localStorage.setItem("lunkWorkouts", JSON.stringify(workouts));
}

function populateExerciseSelect() {
  Object.keys(exerciseLibrary).forEach(exerciseName => {
    const option = document.createElement("option");
    option.value = exerciseName;
    option.textContent = exerciseName;
    exerciseSelect.appendChild(option);
  });
}

function getStartOfWeek(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;

  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);

  return d;
}

function getThisWeeksWorkouts() {
  const start = getStartOfWeek(new Date());
  const end = new Date(start);
  end.setDate(start.getDate() + 7);

  return workouts.filter(workout => {
    const workoutDate = new Date(workout.date);
    return workoutDate >= start && workoutDate < end;
  });
}

function getMuscleScores(weeklyWorkouts) {
  const scores = {};

  muscleGroups.forEach(muscle => {
    scores[muscle] = 0;
  });

  weeklyWorkouts.forEach(workout => {
    workout.exercises.forEach(exercise => {
      const exerciseInfo = exerciseLibrary[exercise.name];

      if (!exerciseInfo) return;

      exerciseInfo.primary.forEach(muscle => {
        scores[muscle] += exercise.sets * 1;
      });

      exerciseInfo.secondary.forEach(muscle => {
        scores[muscle] += exercise.sets * 0.5;
      });
    });
  });

  return scores;
}

function getIntensityClass(score) {
  if (score >= 6) return "active-high";
  if (score >= 3) return "active-medium";
  if (score > 0) return "active-low";
  return "";
}

function updateBodyMap(scores) {
  document.querySelectorAll(".muscle").forEach(part => {
    part.classList.remove("active-low", "active-medium", "active-high");
  });

  Object.entries(scores).forEach(([muscle, score]) => {
    const intensityClass = getIntensityClass(score);

    if (!intensityClass) return;

    const mainPart = document.getElementById(muscle);

    if (mainPart) {
      mainPart.classList.add(intensityClass);
    }

    document.querySelectorAll(`.${muscle}-copy`).forEach(copy => {
      copy.classList.add(intensityClass);
    });
  });
}

function updateSummary(scores) {
  const trainedMuscles = Object.entries(scores).filter(([muscle, score]) => score > 0);
  const coverage = Math.round((trainedMuscles.length / muscleGroups.length) * 100);

  coveragePercent.textContent = `${coverage}%`;

  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);

  const topMuscles = sorted
    .filter(([muscle, score]) => score > 0)
    .slice(0, 3)
    .map(([muscle]) => formatMuscleName(muscle));

  const neglectedMuscles = sorted
    .filter(([muscle, score]) => score === 0)
    .slice(0, 3)
    .map(([muscle]) => formatMuscleName(muscle));

  mostWorked.textContent = topMuscles.length ? topMuscles.join(" • ") : "None yet";
  needsWork.textContent = neglectedMuscles.length ? neglectedMuscles.join(" • ") : "None yet";
}

function updateHistory(weeklyWorkouts) {
  historyList.innerHTML = "";

  if (weeklyWorkouts.length === 0) {
    historyList.innerHTML = "<p>No workouts logged this week.</p>";
    return;
  }

  weeklyWorkouts.forEach(workout => {
    workout.exercises.forEach(exercise => {
      const item = document.createElement("div");
      item.className = "history-item";

      item.innerHTML = `
        <strong>${exercise.name}</strong>
        <span>${exercise.sets} sets • ${formatDate(workout.date)}</span>
      `;

      historyList.appendChild(item);
    });
  });
}

function formatMuscleName(muscle) {
  return muscle
    .replace("_", " ")
    .replace(/\b\w/g, letter => letter.toUpperCase());
}

function formatDate(dateString) {
  const date = new Date(dateString);

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric"
  });
}

function render() {
  const weeklyWorkouts = getThisWeeksWorkouts();
  const scores = getMuscleScores(weeklyWorkouts);

  updateBodyMap(scores);
  updateSummary(scores);
  updateHistory(weeklyWorkouts);
}

function logExercise() {
  const exerciseName = exerciseSelect.value;
  const sets = Number(setsInput.value);

  if (!exerciseName || sets <= 0) return;

  const workout = {
    id: crypto.randomUUID(),
    date: new Date().toISOString(),
    exercises: [
      {
        name: exerciseName,
        sets: sets
      }
    ]
  };

  workouts.push(workout);
  saveWorkouts();
  render();
}

function clearThisWeek() {
  const start = getStartOfWeek(new Date());
  const end = new Date(start);
  end.setDate(start.getDate() + 7);

  workouts = workouts.filter(workout => {
    const workoutDate = new Date(workout.date);
    return workoutDate < start || workoutDate >= end;
  });

  saveWorkouts();
  render();
}

logButton.addEventListener("click", logExercise);
clearButton.addEventListener("click", clearThisWeek);

populateExerciseSelect();
render();