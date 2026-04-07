const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/auth');
const { uploadMilestoneMedia } = require('../config/cloudinary');

const {
  getTimeline,
  createStage,
  updateStage,
  deleteStage,
  getMilestones,
  createMilestone,
  updateMilestone,
  deleteMilestone,
  addTimeLog,
  uploadMilestoneMedia: uploadMilestoneMediaController,
  removeMilestoneMedia,
} = require('../controllers/timelineController');

/**
 * @swagger
 * /projects/{project_id}/timeline:
 *   get:
 *     summary: Get project timeline
 *     tags: [Timeline]
 *     parameters:
 *       - name: project_id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Timeline with stages and milestones
 */
router.get('/:project_id/timeline', getTimeline);

/**
 * @swagger
 * /projects/{project_id}/timeline/milestones:
 *   get:
 *     summary: Get all milestones
 *     tags: [Timeline]
 *     parameters:
 *       - name: project_id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of milestones
 */
router.get('/:project_id/timeline/milestones', getMilestones);

/**
 * @swagger
 * /projects/{project_id}/timeline/stages:
 *   post:
 *     summary: Create timeline stage
 *     tags: [Timeline]
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
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 enum: [idea, planning, development, testing, deployment]
 *               description:
 *                 type: string
 *               order_index:
 *                 type: integer
 *                 default: 0
 *     responses:
 *       201:
 *         description: Stage created
 */
router.post('/:project_id/timeline/stages', protect, createStage);

/**
 * @swagger
 * /projects/{project_id}/timeline/stages/{stage_id}:
 *   put:
 *     summary: Update stage
 *     tags: [Timeline]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: project_id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *       - name: stage_id
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
 *               description:
 *                 type: string
 *               order_index:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Stage updated
 */
router.put('/:project_id/timeline/stages/:stage_id', protect, updateStage);

/**
 * @swagger
 * /projects/{project_id}/timeline/stages/{stage_id}:
 *   delete:
 *     summary: Delete stage
 *     tags: [Timeline]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: project_id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *       - name: stage_id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Stage deleted
 */
router.delete('/:project_id/timeline/stages/:stage_id', protect, deleteStage);

/**
 * @swagger
 * /projects/{project_id}/timeline/stages/{stage_id}/milestones:
 *   post:
 *     summary: Create milestone
 *     tags: [Timeline]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: project_id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *       - name: stage_id
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
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               order_index:
 *                 type: integer
 *               completed_at:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Milestone created
 */
router.post('/:project_id/timeline/stages/:stage_id/milestones', protect, createMilestone);

/**
 * @swagger
 * /projects/{project_id}/timeline/milestones/{milestone_id}:
 *   put:
 *     summary: Update milestone
 *     tags: [Timeline]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: project_id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *       - name: milestone_id
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
 *               order_index:
 *                 type: integer
 *               completed_at:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Milestone updated
 */
router.put('/:project_id/timeline/milestones/:milestone_id', protect, updateMilestone);

/**
 * @swagger
 * /projects/{project_id}/timeline/milestones/{milestone_id}:
 *   delete:
 *     summary: Delete milestone
 *     tags: [Timeline]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: project_id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *       - name: milestone_id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Milestone deleted
 */
router.delete('/:project_id/timeline/milestones/:milestone_id', protect, deleteMilestone);

/**
 * @swagger
 * /projects/{project_id}/timeline/milestones/{milestone_id}/timelog:
 *   post:
 *     summary: Add time log
 *     tags: [Timeline]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: project_id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *       - name: milestone_id
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
 *               - hours
 *             properties:
 *               hours:
 *                 type: number
 *                 minimum: 0.1
 *               note:
 *                 type: string
 *     responses:
 *       201:
 *         description: Time logged
 */
router.post('/:project_id/timeline/milestones/:milestone_id/timelog', protect, addTimeLog);

/**
 * @swagger
 * /projects/{project_id}/timeline/milestones/{milestone_id}/media:
 *   post:
 *     summary: Upload milestone media
 *     tags: [Timeline]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: project_id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *       - name: milestone_id
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
 *               media:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Media uploaded
 */
router.post('/:project_id/timeline/milestones/:milestone_id/media', protect, uploadMilestoneMedia.single('media'), uploadMilestoneMediaController);

/**
 * @swagger
 * /projects/{project_id}/timeline/milestones/{milestone_id}/media/{media_id}:
 *   delete:
 *     summary: Delete milestone media
 *     tags: [Timeline]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: project_id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *       - name: milestone_id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *       - name: media_id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Media deleted
 */
router.delete('/:project_id/timeline/milestones/:milestone_id/media/:media_id', protect, removeMilestoneMedia);

module.exports = router;