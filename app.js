const STORAGE_KEY = "lunkWorkouts";

const exerciseSelect = document.getElementById("exerciseSelect");
const setsInput = document.getElementById("setsInput");
const logButton = document.getElementById("logButton");
const resetWeekButton = document.getElementById("resetWeekButton");

const coveragePercent = document.getElementById("coveragePercent");
const mostWorked = document.getElementById("mostWorked");
const needsWork = document.getElementById("needsWork");
const historyList = document.getElementById("historyList");
const muscleDetail = document.getElementById("muscleDetail");

let workouts = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

function saveWorkouts() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(workouts));
}

function populateExerciseSelect() {
  const exerciseNames = Object.keys(exerciseLibrary).sort();

  exerciseNames.forEach(exerciseName => {
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
    scores[muscle] = {
      points: 0,
      exercises: {}
    };
  });

  weeklyWorkouts.forEach(workout => {
    workout.exercises.forEach(exercise => {
      const exerciseInfo = exerciseLibrary[exercise.name];

      if (!exerciseInfo) return;

      exerciseInfo.primary.forEach(muscle => {
        addMusclePoints(scores, muscle, exercise.name, exercise.sets, 1);
      });

      exerciseInfo.secondary.forEach(muscle => {
        addMusclePoints(scores, muscle, exercise.name, exercise.sets, 0.5);
      });
    });
  });

  return scores;
}

function addMusclePoints(scores, muscle, exerciseName, sets, multiplier) {
  if (!scores[muscle]) return;

  const points = sets * multiplier;

  scores[muscle].points += points;

  if (!scores[muscle].exercises[exerciseName]) {
    scores[muscle].exercises[exerciseName] = 0;
  }

  scores[muscle].exercises[exerciseName] += points;
}

function getIntensityClass(points) {
  if (points >= 8) return "active-high";
  if (points >= 4) return "active-medium";
  if (points > 0) return "active-low";
  return "";
}

function updateBodyMap(scores) {
  document.querySelectorAll(".muscles path").forEach(path => {
    path.classList.remove("active-low", "active-medium", "active-high", "selected");
  });

  Object.entries(scores).forEach(([muscle, data]) => {
    const intensityClass = getIntensityClass(data.points);

    if (!intensityClass) return;

    document.querySelectorAll(`[data-muscle="${muscle}"]`).forEach(path => {
      path.classList.add(intensityClass);
    });
  });
}

function updateSummary(scores) {
  const trainedMuscles = Object.entries(scores).filter(([muscle, data]) => data.points > 0);
  const coverage = Math.round((trainedMuscles.length / muscleGroups.length) * 100);

  coveragePercent.textContent = `${coverage}%`;

  const sorted = Object.entries(scores).sort((a, b) => b[1].points - a[1].points);

  const topMuscles = sorted
    .filter(([muscle, data]) => data.points > 0)
    .slice(0, 3)
    .map(([muscle]) => formatMuscleName(muscle));

  const neglectedMuscles = sorted
    .filter(([muscle, data]) => data.points === 0)
    .slice(0, 3)
    .map(([muscle]) => formatMuscleName(muscle));

  mostWorked.textContent = topMuscles.length ? topMuscles.join(" • ") : "None yet";
  needsWork.textContent = neglectedMuscles.length ? neglectedMuscles.join(" • ") : "None yet";
}

function updateHistory(weeklyWorkouts) {
  historyList.innerHTML = "";

  if (weeklyWorkouts.length === 0) {
    historyList.innerHTML = `<p class="empty-state">No exercises logged this week.</p>`;
    return;
  }

  const flatExercises = [];

  weeklyWorkouts.forEach(workout => {
    workout.exercises.forEach(exercise => {
      flatExercises.push({
        name: exercise.name,
        sets: exercise.sets,
        date: workout.date
      });
    });
  });

  flatExercises
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .forEach(exercise => {
      const item = document.createElement("div");
      item.className = "history-item";

      item.innerHTML = `
        <strong>${exercise.name}</strong>
        <span>${exercise.sets} sets • ${formatDate(exercise.date)}</span>
      `;

      historyList.appendChild(item);
    });
}

function updateMuscleDetail(muscle, scores) {
  const data = scores[muscle];

  if (!data) return;

  const exerciseEntries = Object.entries(data.exercises)
    .sort((a, b) => b[1] - a[1]);

  const exerciseText = exerciseEntries.length
    ? exerciseEntries.map(([name, points]) => `${name} (${roundPoint(points)})`).join(" • ")
    : "No exercises hit this muscle this week.";

  muscleDetail.innerHTML = `
    <span>${formatMuscleName(muscle)}</span>
    <strong>${roundPoint(data.points)} set-points this week</strong>
    <span>${exerciseText}</span>
  `;
}

function setupMuscleTapEvents() {
  document.querySelectorAll(".muscles path").forEach(path => {
    path.addEventListener("click", () => {
      const muscle = path.dataset.muscle;
      const weeklyWorkouts = getThisWeeksWorkouts();
      const scores = getMuscleScores(weeklyWorkouts);

      document.querySelectorAll(".muscles path").forEach(p => {
        p.classList.remove("selected");
      });

      document.querySelectorAll(`[data-muscle="${muscle}"]`).forEach(p => {
        p.classList.add("selected");
      });

      updateMuscleDetail(muscle, scores);
    });
  });
}

function logExercise() {
  const exerciseName = exerciseSelect.value;
  const sets = Number(setsInput.value);

  if (!exerciseName || !exerciseLibrary[exerciseName]) {
    return;
  }

  if (!Number.isFinite(sets) || sets <= 0) {
    return;
  }

  const workout = {
    id: crypto.randomUUID(),
    date: new Date().toISOString(),
    exercises: [
      {
        name: exerciseName,
        sets
      }
    ]
  };

  workouts.push(workout);
  saveWorkouts();
  render();
}

function resetThisWeek() {
  const confirmed = confirm("Clear this week's logged exercises? Your older history will stay saved.");

  if (!confirmed) return;

  const start = getStartOfWeek(new Date());
  const end = new Date(start);

  end.setDate(start.getDate() + 7);

  workouts = workouts.filter(workout => {
    const workoutDate = new Date(workout.date);
    return workoutDate < start || workoutDate >= end;
  });

  saveWorkouts();

  muscleDetail.innerHTML = `
    <span>Tap a muscle</span>
    <strong>Select a highlighted area to see weekly set-points.</strong>
  `;

  render();
}

function formatMuscleName(muscle) {
  return muscle
    .replaceAll("_", " ")
    .replace(/\b\w/g, letter => letter.toUpperCase());
}

function formatDate(dateString) {
  const date = new Date(dateString);

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric"
  });
}

function roundPoint(value) {
  return Number.isInteger(value) ? value : value.toFixed(1);
}

function render() {
  const weeklyWorkouts = getThisWeeksWorkouts();
  const scores = getMuscleScores(weeklyWorkouts);

  updateBodyMap(scores);
  updateSummary(scores);
  updateHistory(weeklyWorkouts);
}

logButton.addEventListener("click", logExercise);
resetWeekButton.addEventListener("click", resetThisWeek);

populateExerciseSelect();
setupMuscleTapEvents();
render();