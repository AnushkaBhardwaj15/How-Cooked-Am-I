const {
  calculateCookedScore,
  classifyArchetype,
  generateRoast,
  getRecoverySuggestions,
  calculateConsistencyScore,
  checkAndUnlockBadges
} = require('../utils/scoreEngine');

// 1. Test score calculations
console.log('--- Testing Cooked Score ---');
const testScores = [
  { sleep: 8, study: 6, screen: 3, assignments: 0, dsa: 2, expected: 0 },
  { sleep: 7, study: 4, screen: 6, assignments: 1, dsa: 1, expected: 5 + 5 + 5 + 8 + 5 }, // 28
  { sleep: 5, study: 1, screen: 12, assignments: 3, dsa: 0, expected: 20 + 20 + 20 + 20 + 10 } // 90 points (capped or calculated)
];

testScores.forEach((t, i) => {
  const score = calculateCookedScore(t.sleep, t.study, t.screen, t.assignments, t.dsa);
  console.log(`Test ${i + 1}: Score = ${score} (Expected close to ${t.expected})`);
});

// 2. Test archetype assignment
console.log('\n--- Testing Student Archetypes ---');
const archetypes = [
  { sleep: 4, study: 1, screen: 12, assignments: 3, expected: 'The Chaos Goblin' },
  { sleep: 5, study: 6, screen: 6, assignments: 1, expected: 'The Grinder' },
  { sleep: 5, study: 2, screen: 9, assignments: 0, expected: 'The Night Owl' },
  { sleep: 7, study: 4, screen: 5, assignments: 0, expected: 'The Survivor' }
];

archetypes.forEach((a, i) => {
  const arch = classifyArchetype(a.sleep, a.study, a.screen, a.assignments);
  console.log(`Test ${i + 1}: Archetype = ${arch} (Expected: ${a.expected})`);
});

// 3. Test dynamic roast generator
console.log('\n--- Testing Dynamic Roasts ---');
const sampleCheckIns = [
  { sleepHours: 3, studyHours: 1, screenTime: 12, assignments: 4, dsaSolved: 0, cookedScore: 90 },
  { sleepHours: 8, studyHours: 6, screenTime: 3, assignments: 0, dsaSolved: 2, cookedScore: 0 }
];

sampleCheckIns.forEach((ci, i) => {
  const roast = generateRoast(ci);
  console.log(`CheckIn ${i + 1} Roast:\n"${roast}"\n`);
});

// 4. Test recovery suggestions
console.log('--- Testing Recovery Suggestions ---');
sampleCheckIns.forEach((ci, i) => {
  const sug = getRecoverySuggestions(ci);
  console.log(`CheckIn ${i + 1} Suggestions:`, sug);
});

// 5. Test consistency score
console.log('\n--- Testing Consistency Score ---');
const yesterday = (offset) => {
  const d = new Date();
  d.setDate(d.getDate() - offset);
  return d.toISOString().split('T')[0];
};

const mockHistory = [
  { date: yesterday(0), sleepHours: 8, studyHours: 4, screenTime: 5 },
  { date: yesterday(1), sleepHours: 7, studyHours: 3, screenTime: 6 },
  { date: yesterday(2), sleepHours: 7, studyHours: 5, screenTime: 4 },
  { date: yesterday(3), sleepHours: 8, studyHours: 3, screenTime: 5 }
];

const consistency = calculateConsistencyScore(mockHistory);
console.log(`Calculated Consistency: ${consistency}/100 (4 check-ins in last 7 days + good habits)`);

// 6. Test achievements
console.log('\n--- Testing Achievements ---');
const mockUser = {
  achievements: []
};
const badCheckIns = [
  { sleepHours: 3, assignments: 0, dsaSolved: 2, screenTime: 8 }
];

const badges = checkAndUnlockBadges(mockUser, badCheckIns);
console.log('Unlocked Badges:', badges);
