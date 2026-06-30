/**
 * How Cooked Am I? - Core Scoring and Analytics Engine
 */

// Calculate Cooked Score (0 to 100)
const calculateCookedScore = (sleepHours, studyHours, screenTime, assignments, dsaSolved) => {
  let score = 0;

  // 1. Sleep Hours (Max 30 points)
  if (sleepHours >= 8) {
    score += 0;
  } else if (sleepHours >= 7) {
    score += 5;
  } else if (sleepHours >= 6) {
    score += 12;
  } else if (sleepHours >= 5) {
    score += 20;
  } else {
    score += 30; // sleep < 5
  }

  // 2. Study Hours (Max 20 points)
  if (studyHours >= 6) {
    score += 0;
  } else if (studyHours >= 4) {
    score += 5;
  } else if (studyHours >= 2) {
    score += 12;
  } else {
    score += 20; // study < 2
  }

  // 3. Screen Time (Max 20 points)
  if (screenTime <= 4) {
    score += 0;
  } else if (screenTime <= 7) {
    score += 5;
  } else if (screenTime <= 10) {
    score += 12;
  } else {
    score += 20; // screenTime > 10
  }

  // 4. Assignments Pending (Max 20 points)
  if (assignments === 0) {
    score += 0;
  } else if (assignments === 1) {
    score += 8;
  } else if (assignments === 2) {
    score += 15;
  } else {
    score += 20; // assignments >= 3
  }

  // 5. DSA Solved (Max 10 points)
  if (dsaSolved >= 2) {
    score += 0;
  } else if (dsaSolved === 1) {
    score += 5;
  } else {
    score += 10; // dsaSolved === 0
  }

  return Math.min(100, Math.max(0, Math.round(score)));
};

// Classify Student Archetype
const classifyArchetype = (sleepHours, studyHours, screenTime, assignments) => {
  if (sleepHours < 5 && screenTime >= 10 && assignments >= 2) {
    return 'The Chaos Goblin';
  }
  if (studyHours >= 6 && sleepHours < 6) {
    return 'The Grinder';
  }
  if (sleepHours < 6 && screenTime >= 8) {
    return 'The Night Owl';
  }
  return 'The Survivor';
};

// Generate dynamic roast based on metrics
const generateRoast = (checkIn) => {
  const { sleepHours, studyHours, screenTime, assignments, dsaSolved, cookedScore } = checkIn;

  // Perfect stats fallback
  if (cookedScore <= 20) {
    const perfectRoasts = [
      "Are you even a real student? Where's the panic? Where's the caffeine?",
      "Functional Human alert. Go write some bugs or skip a lecture to feel alive.",
      "Too clean. Your perfect metrics are making the rest of the server look bad."
    ];
    return perfectRoasts[Math.floor(Math.random() * perfectRoasts.length)];
  }

  const sleepInsults = [
    `You slept only ${sleepHours} hours. That's not a sleep schedule, that's a long blink.`,
    `Your sleep schedule is currently in critical condition. ${sleepHours} hours is basically time-traveling.`,
    `Sleep: ${sleepHours} hours. At this rate, your shadow is sleeping without you.`
  ];

  const screenInsults = [
    `Staring at your screen for ${screenTime} hours today. Your corneas are begging for mercy.`,
    `${screenTime} hours of screen time. Your phone is probably warmer than your coffee.`,
    `With ${screenTime} hours of screen time, you might want to look up what a tree looks like.`
  ];

  const assignmentInsults = [
    `You have ${assignments} pending assignments. The deadline isn't a date anymore, it's a creative suggestion.`,
    `Even your ${assignments} assignments have stopped believing in you.`,
    `At ${assignments} pending assignments, Canvas notification is just harassment.`
  ];

  const studyInsults = [
    `Studied for ${studyHours} hours. Your textbooks are collecting digital dust.`,
    `Only ${studyHours} hours of study? Procrastination level: Academic Legend.`,
    `With ${studyHours} hours of studying, the only thing you are graduating is your screen time.`
  ];

  const dsaInsults = [
    `Solved ${dsaSolved} DSA questions today. FAANG recruiters are removing you from their list.`,
    `${dsaSolved} DSA questions solved. Even the binary search tree is disappointed.`,
    `Solving ${dsaSolved} DSA problems today. Safe to say, the competitive programming world is resting easy.`
  ];

  // Pick the worst components
  const issues = [];
  if (sleepHours < 6) issues.push(sleepInsults[Math.floor(Math.random() * sleepInsults.length)]);
  if (screenTime >= 9) issues.push(screenInsults[Math.floor(Math.random() * screenInsults.length)]);
  if (assignments >= 2) issues.push(assignmentInsults[Math.floor(Math.random() * assignmentInsults.length)]);
  if (studyHours < 2) issues.push(studyInsults[Math.floor(Math.random() * studyInsults.length)]);
  if (dsaSolved === 0) issues.push(dsaInsults[Math.floor(Math.random() * dsaInsults.length)]);

  if (issues.length === 0) {
    return "You're doing okay, but you're still slightly cooked. Go study or sleep.";
  }

  // Shuffle issues and combine up to 2
  const shuffled = issues.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 2).join(' ');
};

// Generate recovery suggestions
const getRecoverySuggestions = (checkIn) => {
  const { sleepHours, studyHours, screenTime, assignments, dsaSolved } = checkIn;
  const suggestions = [];

  if (sleepHours < 7) {
    suggestions.push("Sleep at least 7.5 hours tonight to recharge your brain cells.");
  }
  if (screenTime > 7) {
    suggestions.push("Reduce screen time. Try a 1-hour digital detox before bed.");
  }
  if (assignments > 0) {
    suggestions.push(`Tackle at least one of your ${assignments} pending assignments today.`);
  }
  if (dsaSolved < 2) {
    suggestions.push("Solve at least 1-2 DSA questions tomorrow to keep your logic sharp.");
  }
  if (studyHours < 3) {
    suggestions.push("Commit to a focused 2-hour study session using Pomodoro.");
  }

  // Fallback if doing perfect
  if (suggestions.length === 0) {
    suggestions.push("You're fully functional! Do some reading or help a classmate.");
    suggestions.push("Maintain this streak! Go stretch and drink some water.");
  }

  return suggestions;
};

// Generate Date Helper: Returns date string in local timezone YYYY-MM-DD
const getLocalDateString = (offsetDays = 0) => {
  const date = new Date();
  date.setDate(date.getDate() - offsetDays);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

// Calculate 7-day consistency score
const calculateConsistencyScore = (checkIns) => {
  // Get last 7 calendar days
  const last7Days = [];
  for (let i = 0; i < 7; i++) {
    last7Days.push(getLocalDateString(i));
  }

  // Filter check-ins to only those in the last 7 calendar days
  const activeCheckIns = checkIns.filter(ci => last7Days.includes(ci.date));
  const N = activeCheckIns.length;

  if (N === 0) return 0;

  // Score habits met: Sleep >= 7, Study >= 2, ScreenTime <= 7
  let habitsMet = 0;
  activeCheckIns.forEach(ci => {
    if (ci.sleepHours >= 7) habitsMet++;
    if (ci.studyHours >= 2) habitsMet++;
    if (ci.screenTime <= 7) habitsMet++;
  });

  // Calculate consistency formula
  const frequencyScore = (N / 7) * 50; // Max 50
  const habitQualityScore = (habitsMet / (N * 3)) * 50; // Max 50

  return Math.round(frequencyScore + habitQualityScore);
};

// Check and Unlock Achievements
const checkAndUnlockBadges = (user, last7CheckIns) => {
  if (!last7CheckIns || last7CheckIns.length === 0) return [];

  const newBadges = [];
  const existingBadgeCodes = user.achievements.map(a => a.badge);
  const latest = last7CheckIns[0]; // Assumes sorted date desc (newest first)

  // 1. Night Owl: Sleep < 4 hours in latest check-in
  if (latest.sleepHours < 4 && !existingBadgeCodes.includes('NIGHT_OWL')) {
    newBadges.push({
      badge: 'NIGHT_OWL',
      title: 'Night Owl 🦉',
      description: 'Slept for less than 4 hours. Coffee is your water now.'
    });
  }

  // 2. Assignment Slayer: 0 pending assignments in latest check-in
  if (latest.assignments === 0 && !existingBadgeCodes.includes('ASSIGNMENT_SLAYER')) {
    newBadges.push({
      badge: 'ASSIGNMENT_SLAYER',
      title: 'Assignment Slayer ⚔️',
      description: 'Zero pending assignments. Look at you being all responsible.'
    });
  }

  // 3. DSA Warrior: Solve >= 1 DSA questions for 7 consecutive entries
  if (last7CheckIns.length >= 7) {
    const solvedStreak = last7CheckIns.every(ci => ci.dsaSolved >= 1);
    if (solvedStreak && !existingBadgeCodes.includes('DSA_WARRIOR')) {
      newBadges.push({
        badge: 'DSA_WARRIOR',
        title: 'DSA Warrior 🛡️',
        description: 'Solved DSA questions for 7 consecutive check-ins.'
      });
    }
  }

  // 4. Touch Grass Champion: screenTime <= 4 hours for 7 consecutive entries
  if (last7CheckIns.length >= 7) {
    const lowScreenStreak = last7CheckIns.every(ci => ci.screenTime <= 4);
    if (lowScreenStreak && !existingBadgeCodes.includes('TOUCH_GRASS')) {
      newBadges.push({
        badge: 'TOUCH_GRASS',
        title: 'Touch Grass Champion 🌳',
        description: 'Stared at screens for under 4 hours for 7 consecutive check-ins.'
      });
    }
  }

  return newBadges;
};

module.exports = {
  calculateCookedScore,
  classifyArchetype,
  generateRoast,
  getRecoverySuggestions,
  calculateConsistencyScore,
  checkAndUnlockBadges,
  getLocalDateString
};
