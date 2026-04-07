const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/auth');

const {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getPreferences,
  updatePreferences,
} = require('../controllers/notificationController');

// All notification routes require authentication
router.use(protect);

/**
 * @swagger
 * /notifications:
 *   get:
 *     summary: Get user's notifications
 *     tags: [Notifications]
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
 *       - name: unreadOnly
 *         in: query
 *         schema:
 *           type: boolean
 *           default: false
 *     responses:
 *       200:
 *         description: List of notifications with pagination
 */
router.get('/', getNotifications);

/**
 * @swagger
 * /notifications/read-all:
 *   put:
 *     summary: Mark all notifications as read
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All notifications marked as read
 */
router.put('/read-all', markAllAsRead);

/**
 * @swagger
 * /notifications/{notification_id}/read:
 *   put:
 *     summary: Mark a notification as read
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: notification_id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Notification marked as read
 *       404:
 *         description: Notification not found
 */
router.put('/:notification_id/read', markAsRead);

/**
 * @swagger
 * /notifications/{notification_id}:
 *   delete:
 *     summary: Delete a notification
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: notification_id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Notification deleted
 *       404:
 *         description: Notification not found
 */
router.delete('/:notification_id', deleteNotification);

/**
 * @swagger
 * /notifications/preferences:
 *   get:
 *     summary: Get user's notification preferences
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User's notification preferences
 */
router.get('/preferences', getPreferences);

/**
 * @swagger
 * /notifications/preferences:
 *   put:
 *     summary: Update notification preferences
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email_collaboration:
 *                 type: boolean
 *               email_funding:
 *                 type: boolean
 *               email_purchase:
 *                 type: boolean
 *               push_collaboration:
 *                 type: boolean
 *               push_funding:
 *                 type: boolean
 *               push_purchase:
 *                 type: boolean
 *               in_app_collaboration:
 *                 type: boolean
 *               in_app_funding:
 *                 type: boolean
 *               in_app_purchase:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Preferences updated
 */
router.put('/preferences', updatePreferences);

module.exports = router;