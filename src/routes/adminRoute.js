const express = require('express');
const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

const {
  listUsers,
  suspendUser,
  changeUserRole,
  listAllProjects,
  featureProject,
  removeProject,
  getReports,
  resolveReport,
  getPlatformStats,
} = require('../controllers/adminController');

// All admin routes require authentication and admin role
router.use(protect, authorize('admin'));

/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: List all users
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
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
 *       - name: role
 *         in: query
 *         schema:
 *           type: string
 *           enum: [user, developer, investor, recruiter, admin]
 *       - name: search
 *         in: query
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of users with pagination
 */
router.get('/users', listUsers);

/**
 * @swagger
 * /admin/users/{user_id}/suspend:
 *   put:
 *     summary: Suspend a user account
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: user_id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User suspended successfully
 *       404:
 *         description: User not found
 */
router.put('/users/:user_id/suspend', suspendUser);

/**
 * @swagger
 * /admin/users/{user_id}/role:
 *   put:
 *     summary: Change a user's role
 *     tags: [Admin]
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
 *               - role
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [user, developer, investor, recruiter, admin]
 *     responses:
 *       200:
 *         description: User role updated
 *       404:
 *         description: User not found
 */
router.put('/users/:user_id/role', changeUserRole);

/**
 * @swagger
 * /admin/projects:
 *   get:
 *     summary: List all projects for moderation
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
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
 *         description: List of projects with pagination
 */
router.get('/projects', listAllProjects);

/**
 * @swagger
 * /admin/projects/{project_id}/feature:
 *   put:
 *     summary: Feature or unfeature a project on homepage
 *     tags: [Admin]
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
 *         description: Project featured/unfeatured
 *       404:
 *         description: Project not found
 */
router.put('/projects/:project_id/feature', featureProject);

/**
 * @swagger
 * /admin/projects/{project_id}:
 *   delete:
 *     summary: Remove an inappropriate project
 *     tags: [Admin]
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
 *         description: Project removed successfully
 *       404:
 *         description: Project not found
 */
router.delete('/projects/:project_id', removeProject);

/**
 * @swagger
 * /admin/reports:
 *   get:
 *     summary: Get all content reports
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of reports
 */
router.get('/reports', getReports);

/**
 * @swagger
 * /admin/reports/{report_id}/resolve:
 *   put:
 *     summary: Resolve a content report
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: report_id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Report resolved
 */
router.put('/reports/:report_id/resolve', resolveReport);

/**
 * @swagger
 * /admin/analytics/platform:
 *   get:
 *     summary: Get platform-wide analytics
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Platform statistics (total users, active users, total projects, total views)
 */
router.get('/analytics/platform', getPlatformStats);

module.exports = router;