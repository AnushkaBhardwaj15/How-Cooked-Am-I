const express = require('express');
const router = express.Router();
const CheckIn = require('../models/CheckIn');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const {
  generateRoast,
  getRecoverySuggestions,
  calculateConsistencyScore
} = require('../utils/scoreEngine');

// @desc    Get dashboard metrics, trend data, dynamic roasts, suggestions
// @route   GET /api/dashboard/stats
// @access  Private
router.get('/stats', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Get all check-ins (required for consistency calculation and charts)
    const allCheckIns = await CheckIn.find({ userId: req.user._id }).sort({ date: -1 });

    let latestCheckIn = null;
    let roast = "No check-in today yet. Log your day to get roasted!";
    let suggestions = ["Complete your daily check-in to get recovery steps."];

    if (allCheckIns.length > 0) {
      latestCheckIn = allCheckIns[0]; // Sorted by date desc
      roast = generateRoast(latestCheckIn);
      suggestions = getRecoverySuggestions(latestCheckIn);
    }

    // Calculate consistency score based on last 7 days of logs
    const consistencyScore = calculateConsistencyScore(allCheckIns);

    // Get last 7 check-ins for charts, sorted in chronological order (ascending)
    const trendCheckIns = allCheckIns.slice(0, 7).reverse();

    // Map trends to a friendly display format
    const weeklyTrends = trendCheckIns.map(ci => {
      // Convert date string 'YYYY-MM-DD' to a short date label 'MM/DD'
      const parts = ci.date.split('-');
      const label = parts.length === 3 ? `${parts[1]}/${parts[2]}` : ci.date;
      return {
        label,
        cookedScore: ci.cookedScore,
        sleepHours: ci.sleepHours,
        studyHours: ci.studyHours,
        assignments: ci.assignments,
        dsaSolved: ci.dsaSolved
      };
    });

    res.json({
      success: true,
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          collegeName: user.collegeName,
          branch: user.branch,
          yearOfStudy: user.yearOfStudy,
          profileSetup: user.profileSetup,
          streak: user.streak,
          achievements: user.achievements
        },
        latestCheckIn,
        roast,
        suggestions,
        consistencyScore,
        weeklyTrends
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
