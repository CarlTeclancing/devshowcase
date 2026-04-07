const express = require('express');
const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

const {
  createFundingRequest,
  getFundingDetails,
  updateFundingRequest,
  makeInvestment,
  sponsorProject,
  getBackers,
  getUserInvestments,
  getPortfolioSummary,
  getFundingOpportunities,
} = require('../controllers/fundingController');

// =====================================================
// Public routes
// =====================================================

/**
 * @swagger
 * /funding/opportunities:
 *   get:
 *     summary: Browse all projects open for funding
 *     tags: [Funding]
 *     parameters:
 *       - name: min_goal
 *         in: query
 *         schema:
 *           type: number
 *       - name: max_goal
 *         in: query
 *         schema:
 *           type: number
 *       - name: industry
 *         in: query
 *         schema:
 *           type: string
 *       - name: technology
 *         in: query
 *         schema:
 *           type: string
 *       - name: sort
 *         in: query
 *         schema:
 *           type: string
 *           enum: [deadline_asc, goal_asc, goal_desc, percentage_asc]
 *       - name: page
 *         in: query
 *         schema:
 *           type: integer
 *           default: 1
 *       - name: limit
 *         in: query
 *         schema:
 *           type: integer
 *           default: 12
 *     responses:
 *       200:
 *         description: List of funding opportunities with pagination
 */
router.get('/funding/opportunities', getFundingOpportunities);

/**
 * @swagger
 * /projects/{project_id}/funding:
 *   get:
 *     summary: Get funding details for a project
 *     tags: [Funding]
 *     parameters:
 *       - name: project_id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Funding details including goal, current amount, percentage, backers
 *       404:
 *         description: No funding request found for this project
 */
router.get('/projects/:project_id/funding', getFundingDetails);

/**
 * @swagger
 * /projects/{project_id}/funding/backers:
 *   get:
 *     summary: Get list of backers for a project
 *     tags: [Funding]
 *     parameters:
 *       - name: project_id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of backers and investors
 */
router.get('/projects/:project_id/funding/backers', getBackers);

// =====================================================
// Protected routes - Investor only
// =====================================================

/**
 * @swagger
 * /investments:
 *   get:
 *     summary: Get user's investment history
 *     tags: [Funding]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's investments
 */
router.get('/investments', protect, authorize('investor'), getUserInvestments);

/**
 * @swagger
 * /investments/portfolio:
 *   get:
 *     summary: Get investment portfolio summary
 *     tags: [Funding]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Portfolio summary with total invested, returns, etc.
 */
router.get('/investments/portfolio', protect, authorize('investor'), getPortfolioSummary);

/**
 * @swagger
 * /funding-requests/{funding_request_id}/invest:
 *   post:
 *     summary: Make an investment in a project
 *     tags: [Funding]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: funding_request_id
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
 *               - amount
 *             properties:
 *               amount:
 *                 type: number
 *                 minimum: 1
 *               type:
 *                 type: string
 *                 enum: [investment, sponsorship, donation]
 *                 default: investment
 *               message:
 *                 type: string
 *               transaction_id:
 *                 type: string
 *     responses:
 *       200:
 *         description: Investment successful
 *       400:
 *         description: Amount exceeds remaining goal
 *       403:
 *         description: Cannot invest in your own project
 *       404:
 *         description: Funding request not found
 */
router.post('/funding-requests/:funding_request_id/invest', protect, authorize('investor'), makeInvestment);

/**
 * @swagger
 * /projects/{project_id}/sponsor:
 *   post:
 *     summary: Sponsor a project (one-time donation)
 *     tags: [Funding]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: project_id
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
 *               - amount
 *             properties:
 *               amount:
 *                 type: number
 *                 minimum: 1
 *               message:
 *                 type: string
 *               transaction_id:
 *                 type: string
 *     responses:
 *       200:
 *         description: Sponsorship successful
 *       403:
 *         description: Cannot sponsor your own project
 *       404:
 *         description: Project not found
 */
router.post('/projects/:project_id/sponsor', protect, sponsorProject);

// =====================================================
// Protected routes - Owner only
// =====================================================

/**
 * @swagger
 * /projects/{project_id}/funding:
 *   post:
 *     summary: Create a funding request for a project
 *     tags: [Funding]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: project_id
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
 *               - goal_amount
 *               - deadline
 *             properties:
 *               goal_amount:
 *                 type: number
 *                 minimum: 1
 *               deadline:
 *                 type: string
 *                 format: date-time
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Funding request created
 *       403:
 *         description: You do not own this project
 *       404:
 *         description: Project not found
 *       409:
 *         description: Funding request already exists for this project
 */
router.post('/projects/:project_id/funding', protect, authorize('developer'), createFundingRequest);

/**
 * @swagger
 * /projects/{project_id}/funding:
 *   put:
 *     summary: Update funding request
 *     tags: [Funding]
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
 *               goal_amount:
 *                 type: number
 *               deadline:
 *                 type: string
 *                 format: date-time
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [active, funded, expired, cancelled]
 *     responses:
 *       200:
 *         description: Funding request updated
 *       403:
 *         description: You do not own this funding request
 *       404:
 *         description: No funding request found for this project
 */
router.put('/projects/:project_id/funding', protect, authorize('developer'), updateFundingRequest);

module.exports = router;