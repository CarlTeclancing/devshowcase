const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/auth');

const {
  getViewAnalytics,
  getDemoInteractionAnalytics,
  getEngagementMetrics,
  getTimelineInsights,
  getUserAnalyticsSummary,
  exportAnalytics,
} = require('../controllers/analyticsController');

// All analytics routes require authentication
router.use(protect);

// =====================================================
// Project-level analytics (owner only)
// =====================================================

/**
 * @swagger
 * /analytics/projects/{project_id}/views:
 *   get:
 *     summary: Get view count analytics for a project
 *     tags: [Analytics]
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
 *         description: View count analytics (total views, average daily views)
 *       403:
 *         description: You do not own this project
 *       404:
 *         description: Project not found
 */
router.get('/projects/:project_id/views', getViewAnalytics);

/**
 * @swagger
 * /analytics/projects/{project_id}/demo-interactions:
 *   get:
 *     summary: Get demo interaction analytics for a project
 *     tags: [Analytics]
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
 *         description: Demo interaction metrics (clicks, session duration, completion rate)
 *       403:
 *         description: You do not own this project
 *       404:
 *         description: Project not found
 */
router.get('/projects/:project_id/demo-interactions', getDemoInteractionAnalytics);

/**
 * @swagger
 * /analytics/projects/{project_id}/engagement:
 *   get:
 *     summary: Get engagement metrics for a project
 *     tags: [Analytics]
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
 *         description: Engagement metrics (likes, collaborators, shares, comments, engagement score)
 *       403:
 *         description: You do not own this project
 *       404:
 *         description: Project not found
 */
router.get('/projects/:project_id/engagement', getEngagementMetrics);

/**
 * @swagger
 * /analytics/projects/{project_id}/timeline-insights:
 *   get:
 *     summary: Get build time analytics from milestones
 *     tags: [Analytics]
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
 *         description: Build time analytics (total hours, stage breakdown)
 *       403:
 *         description: You do not own this project
 *       404:
 *         description: Project not found
 */
router.get('/projects/:project_id/timeline-insights', getTimelineInsights);

// =====================================================
// User-level analytics
// =====================================================

/**
 * @swagger
 * /analytics/user/overview:
 *   get:
 *     summary: Get analytics summary across all user's projects
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User analytics summary (total projects, total views, total likes, average views)
 */
router.get('/user/overview', getUserAnalyticsSummary);

/**
 * @swagger
 * /analytics/export:
 *   get:
 *     summary: Export analytics report as CSV or PDF
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: format
 *         in: query
 *         schema:
 *           type: string
 *           enum: [csv, json]
 *           default: csv
 *     responses:
 *       200:
 *         description: Analytics report file download
 *         content:
 *           text/csv:
 *             schema:
 *               type: string
 *           application/json:
 *             schema:
 *               type: object
 */
router.get('/export', exportAnalytics);

module.exports = router;