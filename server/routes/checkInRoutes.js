const express = require('express');
const router = express.Router();
const CheckIn = require('../models/CheckIn');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const {
  calculateCookedScore,
  classifyArchetype,
  checkAndUnlockBadges,
  getLocalDateString
} = require('../utils/scoreEngine');

// @desc    Submit daily check-in (create or update)
// @route   POST /api/checkin
// @access  Private
router.post('/', protect, async (req, res) => {
  const { sleepHours, studyHours, screenTime, assignments, dsaSolved } = req.body;
  const todayStr = getLocalDateString(0);
  const yesterdayStr = getLocalDateString(1);

  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Calculate score & archetype
    const cookedScore = calculateCookedScore(
      Number(sleepHours),
      Number(studyHours),
      Number(screenTime),
      Number(assignments),
      Number(dsaSolved)
    );

    const archetype = classifyArchetype(
      Number(sleepHours),
      Number(studyHours),
      Number(screenTime),
      Number(assignments)
    );

    // Check if check-in already exists for today
    let checkIn = await CheckIn.findOne({ userId: req.user._id, date: todayStr });
    let isUpdate = false;

    if (checkIn) {
      isUpdate = true;
      checkIn.sleepHours = Number(sleepHours);
      checkIn.studyHours = Number(studyHours);
      checkIn.screenTime = Number(screenTime);
      checkIn.assignments = Number(assignments);
      checkIn.dsaSolved = Number(dsaSolved);
      checkIn.cookedScore = cookedScore;
      checkIn.archetype = archetype;
      await checkIn.save();
    } else {
      checkIn = await CheckIn.create({
        userId: req.user._id,
        date: todayStr,
        sleepHours: Number(sleepHours),
        studyHours: Number(studyHours),
        screenTime: Number(screenTime),
        assignments: Number(assignments),
        dsaSolved: Number(dsaSolved),
        cookedScore,
        archetype
      });

      // Update user streak
      if (user.streak.lastCheckInDate === yesterdayStr) {
        user.streak.count += 1;
      } else if (user.streak.lastCheckInDate !== todayStr) {
        user.streak.count = 1;
      }
      user.streak.lastCheckInDate = todayStr;
    }

    // Fetch last 7 check-ins to evaluate achievements
    const last7CheckIns = await CheckIn.find({ userId: req.user._id })
      .sort({ date: -1 })
      .limit(7);

    // Badge processing
    const newBadges = checkAndUnlockBadges(user, last7CheckIns);
    if (newBadges.length > 0) {
      user.achievements.push(...newBadges);
    }

    await user.save();

    res.status(isUpdate ? 200 : 201).json({
      success: true,
      message: isUpdate ? 'Check-in updated successfully' : 'Check-in recorded successfully',
      data: {
        checkIn,
        streak: user.streak,
        newBadges
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @desc    Get check-in history
// @route   GET /api/checkin/history
// @access  Private
router.get('/history', protect, async (req, res) => {
  try {
    const history = await CheckIn.find({ userId: req.user._id })
      .sort({ date: -1 })
      .limit(30); // Return up to 30 days of history

    res.json({
      success: true,
      data: history
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
