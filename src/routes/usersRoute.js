const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/auth');
const { uploadAvatar } = require('../config/cloudinary');

const {
  getMyProfile,
  updateMyProfile,
  getUserProfile,
  getUserProjects,
  switchRole,
  uploadAvatar: uploadAvatarController,
  deleteAvatar,
} = require('../controllers/userController');

/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Get current user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved
 *       401:
 *         description: Not authenticated
 */
router.get('/me', protect, getMyProfile);

/**
 * @swagger
 * /users/me:
 *   put:
 *     summary: Update current user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bio:
 *                 type: string
 *               website:
 *                 type: string
 *               github:
 *                 type: string
 *               linkedin:
 *                 type: string
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Profile updated
 */
router.put('/me', protect, updateMyProfile);

/**
 * @swagger
 * /users/me/roles:
 *   put:
 *     summary: Switch user role
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
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
 *                 enum: [developer, investor, recruiter]
 *     responses:
 *       200:
 *         description: Role updated
 */
router.put('/me/roles', protect, switchRole);

/**
 * @swagger
 * /users/me/avatar:
 *   post:
 *     summary: Upload profile avatar
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Avatar uploaded
 */
router.post('/me/avatar', protect, uploadAvatar.single('avatar'), uploadAvatarController);

/**
 * @swagger
 * /users/me/avatar:
 *   delete:
 *     summary: Delete profile avatar
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Avatar removed
 */
router.delete('/me/avatar', protect, deleteAvatar);

/**
 * @swagger
 * /users/{user_id}:
 *   get:
 *     summary: Get public user profile
 *     tags: [Users]
 *     parameters:
 *       - name: user_id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User profile retrieved
 *       404:
 *         description: User not found
 */
router.get('/:user_id', getUserProfile);

/**
 * @swagger
 * /users/{user_id}/projects:
 *   get:
 *     summary: Get user's projects
 *     tags: [Users]
 *     parameters:
 *       - name: user_id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of user projects
 */
router.get('/:user_id/projects', getUserProjects);

module.exports = router;