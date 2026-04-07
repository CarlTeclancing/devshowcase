const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/auth');

const {
  getReputationScore,
  endorseUser,
  getUserEndorsements,
  removeEndorsement,
  getBuildVerification,
  requestBuildVerification,
  getActivityHistory,
} = require('../controllers/reputationController');

// =====================================================
// Public routes
// =====================================================

/**
 * @swagger
 * /users/{user_id}/reputation:
 *   get:
 *     summary: Get user's reputation score breakdown
 *     tags: [Reputation]
 *     parameters:
 *       - name: user_id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Reputation score, endorsements, skill breakdown
 *       404:
 *         description: User not found
 */
router.get('/users/:user_id/reputation', getReputationScore);

/**
 * @swagger
 * /users/{user_id}/endorsements:
 *   get:
 *     summary: Get all endorsements for a user
 *     tags: [Reputation]
 *     parameters:
 *       - name: user_id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of endorsements received
 */
router.get('/users/:user_id/endorsements', getUserEndorsements);

/**
 * @swagger
 * /users/{user_id}/activity-history:
 *   get:
 *     summary: Get user's public activity timeline
 *     tags: [Reputation]
 *     parameters:
 *       - name: user_id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *       - name: page
 *         in: query
 *         schema:
 *           type: integer
 *           default: 1
 *       - name: limit
 *         in: query
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: Activity history with pagination
 */
router.get('/users/:user_id/activity-history', getActivityHistory);

/**
 * @swagger
 * /projects/{project_id}/verification:
 *   get:
 *     summary: Get build verification status for a project
 *     tags: [Reputation]
 *     parameters:
 *       - name: project_id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Verification status (pending, verified, rejected)
 *       404:
 *         description: Project not found
 */
router.get('/projects/:project_id/verification', getBuildVerification);

// =====================================================
// Protected routes
// =====================================================

/**
 * @swagger
 * /users/{user_id}/endorsements:
 *   post:
 *     summary: Endorse a user for a specific skill
 *     tags: [Reputation]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: user_id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - skill
 *             properties:
 *               skill:
 *                 type: string
 *               message:
 *                 type: string
 *     responses:
 *       201:
 *         description: Endorsement added successfully
 *       403:
 *         description: You cannot endorse yourself
 *       404:
 *         description: User not found
 *       409:
 *         description: You have already endorsed this user for this skill
 */
router.post('/users/:user_id/endorsements', protect, endorseUser);

/**
 * @swagger
 * /users/{user_id}/endorsements/{skill}:
 *   delete:
 *     summary: Remove an endorsement
 *     tags: [Reputation]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: user_id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *       - name: skill
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Endorsement removed
 *       404:
 *         description: Endorsement not found
 */
router.delete('/users/:user_id/endorsements/:skill', protect, removeEndorsement);

/**
 * @swagger
 * /projects/{project_id}/verify-build:
 *   post:
 *     summary: Request build verification for a project
 *     tags: [Reputation]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: project_id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Verification request submitted
 *       403:
 *         description: You do not own this project
 *       404:
 *         description: Project not found
 */
router.post('/projects/:project_id/verify-build', protect, requestBuildVerification);

module.exports = router;