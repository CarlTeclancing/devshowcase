const express = require('express');
const router = express.Router();

const { protect, authorize, optionalAuth } = require('../middleware/auth');
const { 
  uploadThumbnail, 
  uploadGallery, 
  uploadProjectAssets 
} = require('../config/cloudinary');

const {
  listProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  addTechnology,
  removeTechnology,
  addIndustry,
  updateVisibility,
  uploadThumbnail: uploadThumbnailController,
  uploadGallery: uploadGalleryController,
  removeGalleryImage,
  uploadProjectAssets: uploadProjectAssetsController,
  deleteProjectAsset,
  getProjectAssets,
} = require('../controllers/projectController');

/**
 * @swagger
 * /projects:
 *   get:
 *     summary: List all public projects
 *     tags: [Projects]
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
 *           default: 12
 *       - name: search
 *         in: query
 *         schema:
 *           type: string
 *       - name: technology
 *         in: query
 *         schema:
 *           type: string
 *       - name: industry
 *         in: query
 *         schema:
 *           type: string
 *       - name: status
 *         in: query
 *         schema:
 *           type: string
 *       - name: sort
 *         in: query
 *         schema:
 *           type: string
 *           enum: [created_at, view_count, like_count]
 *     responses:
 *       200:
 *         description: List of projects
 */
router.get('/', optionalAuth, listProjects);

/**
 * @swagger
 * /projects/{project_id}:
 *   get:
 *     summary: Get project by ID or slug
 *     tags: [Projects]
 *     parameters:
 *       - name: project_id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Project details
 *       404:
 *         description: Project not found
 */
router.get('/:project_id', optionalAuth, getProject);

/**
 * @swagger
 * /projects:
 *   post:
 *     summary: Create a new project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               full_description:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [idea, planning, development, testing, deployment]
 *               visibility:
 *                 type: string
 *                 enum: [public, private, unlisted]
 *               technologies:
 *                 type: array
 *                 items:
 *                   type: string
 *               industries:
 *                 type: array
 *                 items:
 *                   type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               problem_solved:
 *                 type: string
 *               repo_url:
 *                 type: string
 *               demo_url:
 *                 type: string
 *     responses:
 *       201:
 *         description: Project created
 */
router.post('/', protect, authorize('developer'), createProject);

/**
 * @swagger
 * /projects/{project_id}:
 *   put:
 *     summary: Update project
 *     tags: [Projects]
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
 *               full_description:
 *                 type: string
 *               problem_solved:
 *                 type: string
 *               repo_url:
 *                 type: string
 *               demo_url:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Project updated
 */
router.put('/:project_id', protect, updateProject);

/**
 * @swagger
 * /projects/{project_id}:
 *   delete:
 *     summary: Delete project
 *     tags: [Projects]
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
 *         description: Project deleted
 */
router.delete('/:project_id', protect, deleteProject);

/**
 * @swagger
 * /projects/{project_id}/technologies:
 *   post:
 *     summary: Add technology to project
 *     tags: [Projects]
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
 *               - technology
 *             properties:
 *               technology:
 *                 type: string
 *     responses:
 *       200:
 *         description: Technology added
 */
router.post('/:project_id/technologies', protect, addTechnology);

/**
 * @swagger
 * /projects/{project_id}/technologies/{tech}:
 *   delete:
 *     summary: Remove technology from project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: project_id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *       - name: tech
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Technology removed
 */
router.delete('/:project_id/technologies/:tech', protect, removeTechnology);

/**
 * @swagger
 * /projects/{project_id}/industries:
 *   post:
 *     summary: Add industry to project
 *     tags: [Projects]
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
 *               - industry
 *             properties:
 *               industry:
 *                 type: string
 *     responses:
 *       200:
 *         description: Industry added
 */
router.post('/:project_id/industries', protect, addIndustry);

/**
 * @swagger
 * /projects/{project_id}/visibility:
 *   put:
 *     summary: Update project visibility
 *     tags: [Projects]
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
 *               - visibility
 *             properties:
 *               visibility:
 *                 type: string
 *                 enum: [public, private, unlisted]
 *     responses:
 *       200:
 *         description: Visibility updated
 */
router.put('/:project_id/visibility', protect, updateVisibility);

/**
 * @swagger
 * /projects/{project_id}/thumbnail:
 *   post:
 *     summary: Upload project thumbnail
 *     tags: [Projects]
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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               thumbnail:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Thumbnail uploaded
 */
router.post('/:project_id/thumbnail', protect, uploadThumbnail.single('thumbnail'), uploadThumbnailController);

/**
 * @swagger
 * /projects/{project_id}/gallery:
 *   post:
 *     summary: Upload gallery images
 *     tags: [Projects]
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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Images uploaded
 */
router.post('/:project_id/gallery', protect, uploadGallery.array('images', 10), uploadGalleryController);

/**
 * @swagger
 * /projects/{project_id}/gallery/{image_id}:
 *   delete:
 *     summary: Remove gallery image
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: project_id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *       - name: image_id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Image removed
 */
router.delete('/:project_id/gallery/:image_id', protect, removeGalleryImage);

/**
 * @swagger
 * /projects/{project_id}/assets:
 *   get:
 *     summary: Get project assets
 *     tags: [Projects]
 *     parameters:
 *       - name: project_id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of assets
 */
router.get('/:project_id/assets', optionalAuth, getProjectAssets);

/**
 * @swagger
 * /projects/{project_id}/assets:
 *   post:
 *     summary: Upload project assets
 *     tags: [Projects]
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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               assets:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Assets uploaded
 */
router.post('/:project_id/assets', protect, uploadProjectAssets.array('assets', 20), uploadProjectAssetsController);

/**
 * @swagger
 * /projects/{project_id}/assets/{asset_id}:
 *   delete:
 *     summary: Delete project asset
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: project_id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *       - name: asset_id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Asset deleted
 */
router.delete('/:project_id/assets/:asset_id', protect, deleteProjectAsset);

module.exports = router;