const express = require('express');
const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

const {
  getCollaboratorSuggestions,
  getInvestorSuggestions,
  getProjectRecommendations,
  getImprovementSuggestions,
  generateSummary,
  generatePitchDraft,
  generateDescription,
  findBySkillMatch,
} = require('../controllers/aiController');

// All AI routes require authentication
router.use(protect);

/**
 * @swagger
 * /ai/recommendations/collaborators/{project_id}:
 *   get:
 *     summary: Get AI-suggested collaborators for a project
 *     tags: [AI]
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
 *         description: List of suggested collaborators with match scores
 *       403:
 *         description: You do not own this project
 *       404:
 *         description: Project not found
 */
router.get('/recommendations/collaborators/:project_id', authorize('developer'), getCollaboratorSuggestions);

/**
 * @swagger
 * /ai/recommendations/investors/{project_id}:
 *   get:
 *     summary: Get AI-suggested investors for a project
 *     tags: [AI]
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
 *         description: List of suggested investors with match scores
 *       403:
 *         description: You do not own this project
 *       404:
 *         description: Project not found
 */
router.get('/recommendations/investors/:project_id', authorize('developer'), getInvestorSuggestions);

/**
 * @swagger
 * /ai/recommendations/projects:
 *   get:
 *     summary: Get AI-powered project recommendations for user
 *     tags: [AI]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of recommended projects based on user's skills and interests
 */
router.get('/recommendations/projects', getProjectRecommendations);

/**
 * @swagger
 * /ai/recommendations/improvements/{project_id}:
 *   get:
 *     summary: Get AI improvement suggestions for a project
 *     tags: [AI]
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
 *         description: List of improvement suggestions with priority levels
 *       403:
 *         description: You do not own this project
 *       404:
 *         description: Project not found
 */
router.get('/recommendations/improvements/:project_id', authorize('developer'), getImprovementSuggestions);

/**
 * @swagger
 * /ai/generate/summary/{project_id}:
 *   post:
 *     summary: Generate AI-powered project summary
 *     tags: [AI]
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
 *         description: AI-generated project summary
 *       403:
 *         description: You do not own this project
 *       404:
 *         description: Project not found
 */
router.post('/generate/summary/:project_id', authorize('developer'), generateSummary);

/**
 * @swagger
 * /ai/generate/pitch/{project_id}:
 *   post:
 *     summary: Generate AI-powered investor pitch draft
 *     tags: [AI]
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
 *         description: AI-generated pitch draft
 *       403:
 *         description: You do not own this project
 *       404:
 *         description: Project not found
 */
router.post('/generate/pitch/:project_id', authorize('developer'), generatePitchDraft);

/**
 * @swagger
 * /ai/generate/description:
 *   post:
 *     summary: Generate project description from keywords
 *     tags: [AI]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - keywords
 *             properties:
 *               keywords:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: AI-generated description
 *       400:
 *         description: Keywords are required
 */
router.post('/generate/description', generateDescription);

/**
 * @swagger
 * /ai/match/skills:
 *   get:
 *     summary: Find collaborators by skill match using AI matching
 *     tags: [AI]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: skill
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *       - name: limit
 *         in: query
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: List of users matching the skill
 *       400:
 *         description: Skill is required
 */
router.get('/match/skills', findBySkillMatch);

module.exports = router;