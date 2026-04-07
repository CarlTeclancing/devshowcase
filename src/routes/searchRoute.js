const express = require('express');
const router = express.Router();

const { protect, optionalAuth } = require('../middleware/auth');

const {
  searchProjects,
  getFilterOptions,
  getTrendingProjects,
  getPersonalizedRecommendations,
  getCategories,
  getTrendingTags,
} = require('../controllers/searchController');

/**
 * @swagger
 * /search:
 *   get:
 *     summary: Search projects
 *     tags: [Search & Discovery]
 *     parameters:
 *       - name: q
 *         in: query
 *         schema:
 *           type: string
 *         description: Search query
 *       - name: technology
 *         in: query
 *         schema:
 *           type: string
 *         description: Filter by technology
 *       - name: industry
 *         in: query
 *         schema:
 *           type: string
 *         description: Filter by industry
 *       - name: status
 *         in: query
 *         schema:
 *           type: string
 *         description: Filter by status
 *       - name: minViews
 *         in: query
 *         schema:
 *           type: integer
 *       - name: maxViews
 *         in: query
 *         schema:
 *           type: integer
 *       - name: minFunding
 *         in: query
 *         schema:
 *           type: number
 *       - name: maxFunding
 *         in: query
 *         schema:
 *           type: number
 *       - name: sort
 *         in: query
 *         schema:
 *           type: string
 *           enum: [relevance, newest, most_viewed, most_funded]
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
 *         description: Search results with pagination
 */
router.get('/', optionalAuth, searchProjects);

/**
 * @swagger
 * /search/filters:
 *   get:
 *     summary: Get all available search filter options
 *     tags: [Search & Discovery]
 *     responses:
 *       200:
 *         description: Available technologies, industries, and statuses
 */
router.get('/filters', getFilterOptions);

/**
 * @swagger
 * /discovery/trending:
 *   get:
 *     summary: Get trending projects
 *     tags: [Search & Discovery]
 *     parameters:
 *       - name: limit
 *         in: query
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Trending projects based on views and likes
 */
router.get('/trending', getTrendingProjects);

/**
 * @swagger
 * /discovery/for-you:
 *   get:
 *     summary: Personalized project recommendations
 *     tags: [Search & Discovery]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: limit
 *         in: query
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Projects recommended based on user's skills and interests
 */
router.get('/for-you', protect, getPersonalizedRecommendations);

/**
 * @swagger
 * /discovery/categories:
 *   get:
 *     summary: Get all project categories and industries
 *     tags: [Search & Discovery]
 *     responses:
 *       200:
 *         description: Categories and industries with counts
 */
router.get('/categories', getCategories);

/**
 * @swagger
 * /discovery/tags/trending:
 *   get:
 *     summary: Get trending technology tags
 *     tags: [Search & Discovery]
 *     parameters:
 *       - name: limit
 *         in: query
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: Trending technology tags with usage counts
 */
router.get('/tags/trending', getTrendingTags);

module.exports = router;