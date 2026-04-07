const express = require('express');
const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

const {
  requestVerification,
  getVerificationStatus,
  addBlockchainProof,
  getLicenseTemplates,
  applyLicense,
  getProjectLicense,
  generatePurchaseLicense,
  downloadLicense,
} = require('../controllers/licensingController');

// =====================================================
// Public routes
// =====================================================

/**
 * @swagger
 * /licensing/projects/{project_id}/ownership/status:
 *   get:
 *     summary: Get ownership verification status for a project
 *     tags: [Licensing]
 *     parameters:
 *       - name: project_id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Verification status (pending, verified, rejected, not_requested)
 */
router.get('/projects/:project_id/ownership/status', getVerificationStatus);

/**
 * @swagger
 * /licensing/projects/{project_id}/license/templates:
 *   get:
 *     summary: Get available license templates
 *     tags: [Licensing]
 *     parameters:
 *       - name: project_id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of license templates (MIT, GPL, Apache, Commercial)
 */
router.get('/projects/:project_id/license/templates', getLicenseTemplates);

/**
 * @swagger
 * /licensing/projects/{project_id}/license:
 *   get:
 *     summary: Get the license applied to a project
 *     tags: [Licensing]
 *     parameters:
 *       - name: project_id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: License details or message if no license applied
 */
router.get('/projects/:project_id/license', getProjectLicense);

// =====================================================
// Protected routes - Owner only
// =====================================================

/**
 * @swagger
 * /licensing/projects/{project_id}/ownership/verify:
 *   post:
 *     summary: Request ownership verification for a project
 *     tags: [Licensing]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: project_id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       201:
 *         description: Verification requested
 *       403:
 *         description: You do not own this project
 *       404:
 *         description: Project not found
 *       409:
 *         description: Verification already requested
 */
router.post('/projects/:project_id/ownership/verify', protect, authorize('developer'), requestVerification);

/**
 * @swagger
 * /licensing/projects/{project_id}/ownership/blockchain:
 *   post:
 *     summary: Add blockchain proof of ownership
 *     tags: [Licensing]
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
 *               - blockchain_hash
 *             properties:
 *               blockchain_hash:
 *                 type: string
 *     responses:
 *       200:
 *         description: Blockchain proof added
 *       403:
 *         description: You do not own this project
 *       404:
 *         description: Project not found
 */
router.post('/projects/:project_id/ownership/blockchain', protect, authorize('developer'), addBlockchainProof);

/**
 * @swagger
 * /licensing/projects/{project_id}/license/apply:
 *   post:
 *     summary: Apply a license to a project
 *     tags: [Licensing]
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
 *               - license_id
 *             properties:
 *               license_id:
 *                 type: integer
 *               custom_terms:
 *                 type: string
 *     responses:
 *       200:
 *         description: License applied
 *       403:
 *         description: You do not own this project
 *       404:
 *         description: Project or license template not found
 */
router.post('/projects/:project_id/license/apply', protect, authorize('developer'), applyLicense);

// =====================================================
// Protected routes - Marketplace related
// =====================================================

/**
 * @swagger
 * /licensing/marketplace/listings/{listing_id}/license:
 *   post:
 *     summary: Generate a license for a purchase
 *     tags: [Licensing]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: listing_id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: License key and content generated
 *       403:
 *         description: You do not own this listing
 *       404:
 *         description: Listing not found
 */
router.post('/marketplace/listings/:listing_id/license', protect, authorize('developer'), generatePurchaseLicense);

/**
 * @swagger
 * /licensing/marketplace/licenses/{license_id}:
 *   get:
 *     summary: Download a license file
 *     tags: [Licensing]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: license_id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: License file download
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *       403:
 *         description: You do not have access to this license
 *       404:
 *         description: License not found
 */
router.get('/marketplace/licenses/:license_id', protect, downloadLicense);

module.exports = router;