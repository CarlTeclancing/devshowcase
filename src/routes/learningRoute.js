const express = require('express');
const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

const {
  createTutorial,
  getTutorial,
  getBuildReplay,
  forkProject,
  getUserForks,
} = require('../controllers/learningController');

// =====================================================
// Public routes
// =====================================================

/**
 * @swagger
 * /learning/projects/{project_id}/learning/tutorial:
 *   get:
 *     summary: Get tutorial version of a project
 *     tags: [Learning]
 *     parameters:
 *       - name: project_id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Tutorial with steps
 *       404:
 *         description: No tutorial found for this project
 */
router.get('/projects/:project_id/learning/tutorial', getTutorial);

/**
 * @swagger
 * /learning/projects/{project_id}/learning/replay:
 *   get:
 *     summary: Get step-by-step build replay
 *     tags: [Learning]
 *     parameters:
 *       - name: project_id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Build replay with stages and milestones
 *       404:
 *         description: Project not found
 */
router.get('/projects/:project_id/learning/replay', getBuildReplay);

// =====================================================
// Protected routes
// =====================================================

/**
 * @swagger
 * /learning/projects/{project_id}/learning/tutorial:
 *   post:
 *     summary: Convert a project into a tutorial
 *     tags: [Learning]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: project_id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               steps:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     step:
 *                       type: integer
 *                     title:
 *                       type: string
 *                     description:
 *                       type: string
 *     responses:
 *       201:
 *         description: Tutorial created successfully
 *       403:
 *         description: You do not own this project
 *       404:
 *         description: Project not found
 *       409:
 *         description: Tutorial already exists for this project
 */
router.post('/projects/:project_id/learning/tutorial', protect, authorize('developer'), createTutorial);

/**
 * @swagger
 * /learning/projects/{project_id}/learning/fork:
 *   post:
 *     summary: Fork a project for practice
 *     tags: [Learning]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: project_id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fork_name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Project forked successfully
 *       404:
 *         description: Project not found
 *       409:
 *         description: You have already forked this project
 */
router.post('/projects/:project_id/learning/fork', protect, forkProject);

/**
 * @swagger
 * /learning/my-forks:
 *   get:
 *     summary: Get user's forked projects
 *     tags: [Learning]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of forked projects
 */
router.get('/my-forks', protect, getUserForks);

module.exports = router;