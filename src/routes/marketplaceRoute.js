const express = require('express');
const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

const {
  setProjectPricing,
  getProjectPricing,
  updateProjectPricing,
  browseListings,
  getListing,
  purchaseListing,
  getUserPurchases,
  getSellerSales,
} = require('../controllers/marketplaceController');

// =====================================================
// Public routes
// =====================================================

/**
 * @swagger
 * /marketplace/listings:
 *   get:
 *     summary: Browse marketplace listings
 *     tags: [Marketplace]
 *     parameters:
 *       - name: price_type
 *         in: query
 *         schema:
 *           type: string
 *           enum: [fixed, subscription, license]
 *       - name: min_price
 *         in: query
 *         schema:
 *           type: number
 *       - name: max_price
 *         in: query
 *         schema:
 *           type: number
 *       - name: technology
 *         in: query
 *         schema:
 *           type: string
 *       - name: industry
 *         in: query
 *         schema:
 *           type: string
 *       - name: sort
 *         in: query
 *         schema:
 *           type: string
 *           enum: [newest, price_low, price_high, popular]
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
 *         description: List of marketplace listings with pagination
 */
router.get('/listings', browseListings);

/**
 * @swagger
 * /marketplace/listings/{listing_id}:
 *   get:
 *     summary: Get single listing
 *     tags: [Marketplace]
 *     parameters:
 *       - name: listing_id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Listing details
 *       404:
 *         description: Listing not found
 */
router.get('/listings/:listing_id', getListing);

// =====================================================
// Protected routes
// =====================================================

/**
 * @swagger
 * /marketplace/purchases:
 *   get:
 *     summary: Get user's purchase history
 *     tags: [Marketplace]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user purchases
 */
router.get('/purchases', protect, getUserPurchases);

/**
 * @swagger
 * /marketplace/sales:
 *   get:
 *     summary: Get seller's sales analytics
 *     tags: [Marketplace]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sales analytics for seller
 */
router.get('/sales', protect, authorize('developer'), getSellerSales);

/**
 * @swagger
 * /marketplace/listings/{listing_id}/purchase:
 *   post:
 *     summary: Purchase a listing
 *     tags: [Marketplace]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: listing_id
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
 *               transaction_id:
 *                 type: string
 *     responses:
 *       200:
 *         description: Purchase completed successfully
 *       400:
 *         description: Listing not available
 *       403:
 *         description: Cannot purchase own listing
 *       404:
 *         description: Listing not found
 */
router.post('/listings/:listing_id/purchase', protect, purchaseListing);

// =====================================================
// Project pricing routes (requires project ownership)
// =====================================================

/**
 * @swagger
 * /marketplace/projects/{project_id}/pricing:
 *   post:
 *     summary: Set pricing for a project
 *     tags: [Marketplace]
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
 *               - price
 *               - price_type
 *             properties:
 *               price:
 *                 type: number
 *                 minimum: 0
 *               price_type:
 *                 type: string
 *                 enum: [fixed, subscription, license]
 *               currency:
 *                 type: string
 *                 default: USD
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Pricing set successfully
 *       403:
 *         description: You do not own this project
 *       404:
 *         description: Project not found
 */
router.post('/projects/:project_id/pricing', protect, setProjectPricing);

/**
 * @swagger
 * /marketplace/projects/{project_id}/pricing:
 *   get:
 *     summary: Get project pricing
 *     tags: [Marketplace]
 *     parameters:
 *       - name: project_id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Project pricing information
 *       404:
 *         description: No pricing set for this project
 */
router.get('/projects/:project_id/pricing', protect, getProjectPricing);

/**
 * @swagger
 * /marketplace/projects/{project_id}/pricing:
 *   put:
 *     summary: Update project pricing
 *     tags: [Marketplace]
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
 *               price:
 *                 type: number
 *               price_type:
 *                 type: string
 *                 enum: [fixed, subscription, license]
 *               currency:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [active, inactive]
 *     responses:
 *       200:
 *         description: Pricing updated successfully
 *       403:
 *         description: You do not own this listing
 *       404:
 *         description: No pricing set for this project
 */
router.put('/projects/:project_id/pricing', protect, updateProjectPricing);

module.exports = router;