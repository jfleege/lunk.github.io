const muscleGroups = [
  "upper_chest",
  "chest",
  "front_delts",
  "side_delts",
  "rear_delts",
  "biceps",
  "triceps",
  "forearms",
  "abs",
  "obliques",
  "traps",
  "rhomboids",
  "lats",
  "lower_back",
  "glutes",
  "quads",
  "hamstrings",
  "adductors",
  "calves"
];

const exerciseLibrary = {
  "Bench Press": {
    primary: ["chest"],
    secondary: ["front_delts", "triceps"]
  },
  "Incline Bench Press": {
    primary: ["upper_chest", "chest"],
    secondary: ["front_delts", "triceps"]
  },
  "Dumbbell Fly": {
    primary: ["chest"],
    secondary: ["front_delts"]
  },
  "Push-Up": {
    primary: ["chest"],
    secondary: ["front_delts", "triceps", "abs"]
  },
  "Shoulder Press": {
    primary: ["front_delts", "side_delts"],
    secondary: ["triceps", "upper_chest"]
  },
  "Lateral Raise": {
    primary: ["side_delts"],
    secondary: []
  },
  "Rear Delt Fly": {
    primary: ["rear_delts"],
    secondary: ["rhomboids", "traps"]
  },
  "Pull-Up": {
    primary: ["lats"],
    secondary: ["biceps", "rhomboids", "rear_delts"]
  },
  "Lat Pulldown": {
    primary: ["lats"],
    secondary: ["biceps", "rhomboids", "rear_delts"]
  },
  "Barbell Row": {
    primary: ["rhomboids", "lats"],
    secondary: ["biceps", "rear_delts", "traps"]
  },
  "Seated Cable Row": {
    primary: ["rhomboids", "lats"],
    secondary: ["biceps", "rear_delts"]
  },
  "Shrug": {
    primary: ["traps"],
    secondary: []
  },
  "Back Extension": {
    primary: ["lower_back"],
    secondary: ["glutes", "hamstrings"]
  },
  "Bicep Curl": {
    primary: ["biceps"],
    secondary: ["forearms"]
  },
  "Hammer Curl": {
    primary: ["biceps", "forearms"],
    secondary: []
  },
  "Tricep Pushdown": {
    primary: ["triceps"],
    secondary: []
  },
  "Skull Crusher": {
    primary: ["triceps"],
    secondary: []
  },
  "Wrist Curl": {
    primary: ["forearms"],
    secondary: []
  },
  "Plank": {
    primary: ["abs"],
    secondary: ["obliques", "front_delts"]
  },
  "Crunch": {
    primary: ["abs"],
    secondary: []
  },
  "Russian Twist": {
    primary: ["obliques"],
    secondary: ["abs"]
  },
  "Squat": {
    primary: ["quads", "glutes"],
    secondary: ["hamstrings", "adductors", "abs", "calves"]
  },
  "Leg Press": {
    primary: ["quads", "glutes"],
    secondary: ["hamstrings", "adductors"]
  },
  "Lunge": {
    primary: ["quads", "glutes"],
    secondary: ["hamstrings", "adductors", "calves"]
  },
  "Leg Extension": {
    primary: ["quads"],
    secondary: []
  },
  "Romanian Deadlift": {
    primary: ["hamstrings", "glutes"],
    secondary: ["lower_back", "traps"]
  },
  "Deadlift": {
    primary: ["hamstrings", "glutes", "lower_back"],
    secondary: ["traps", "lats", "forearms", "quads"]
  },
  "Leg Curl": {
    primary: ["hamstrings"],
    secondary: []
  },
  "Hip Thrust": {
    primary: ["glutes"],
    secondary: ["hamstrings"]
  },
  "Hip Adduction": {
    primary: ["adductors"],
    secondary: []
  },
  "Calf Raise": {
    primary: ["calves"],
    secondary: []
  }
};