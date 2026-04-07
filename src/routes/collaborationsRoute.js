const express = require('express');
const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

const {
  getCollaborators,
  inviteCollaborator,
  requestToJoin,
  acceptInvitation,
  declineInvitation,
  updateCollaboratorRole,
  removeCollaborator,
  getUserInvites,
  getJoinRequests,
} = require('../controllers/collaborationController');

/**
 * @swagger
 * /collaborations/projects/{project_id}/collaborators:
 *   get:
 *     summary: Get project collaborators
 *     tags: [Collaboration]
 *     parameters:
 *       - name: project_id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of collaborators
 */
router.get('/projects/:project_id/collaborators', getCollaborators);

/**
 * @swagger
 * /collaborations/invites:
 *   get:
 *     summary: Get my pending invites
 *     tags: [Collaboration]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of invites
 */
router.get('/invites', protect, getUserInvites);

/**
 * @swagger
 * /collaborations/invites/{invite_id}/accept:
 *   put:
 *     summary: Accept invitation
 *     tags: [Collaboration]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: invite_id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Invitation accepted
 */
router.put('/invites/:invite_id/accept', protect, acceptInvitation);

/**
 * @swagger
 * /collaborations/invites/{invite_id}/decline:
 *   put:
 *     summary: Decline invitation
 *     tags: [Collaboration]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: invite_id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Invitation declined
 */
router.put('/invites/:invite_id/decline', protect, declineInvitation);

/**
 * @swagger
 * /collaborations/projects/{project_id}/collaborators/invite:
 *   post:
 *     summary: Invite collaborator
 *     tags: [Collaboration]
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
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               role:
 *                 type: string
 *                 enum: [admin, contributor, viewer]
 *                 default: contributor
 *     responses:
 *       201:
 *         description: Invitation sent
 */
router.post('/projects/:project_id/collaborators/invite', protect, authorize('developer'), inviteCollaborator);

/**
 * @swagger
 * /collaborations/projects/{project_id}/collaborators/request:
 *   post:
 *     summary: Request to join project
 *     tags: [Collaboration]
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
 *               message:
 *                 type: string
 *     responses:
 *       201:
 *         description: Request sent
 */
router.post('/projects/:project_id/collaborators/request', protect, requestToJoin);

/**
 * @swagger
 * /collaborations/projects/{project_id}/collaborators/{user_id}/role:
 *   put:
 *     summary: Update collaborator role
 *     tags: [Collaboration]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: project_id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
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
 *                 enum: [admin, contributor, viewer]
 *     responses:
 *       200:
 *         description: Role updated
 */
router.put('/projects/:project_id/collaborators/:user_id/role', protect, updateCollaboratorRole);

/**
 * @swagger
 * /collaborations/projects/{project_id}/collaborators/{user_id}:
 *   delete:
 *     summary: Remove collaborator
 *     tags: [Collaboration]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: project_id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *       - name: user_id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Collaborator removed
 */
router.delete('/projects/:project_id/collaborators/:user_id', protect, removeCollaborator);

/**
 * @swagger
 * /collaborations/projects/{project_id}/requests:
 *   get:
 *     summary: Get join requests for my project
 *     tags: [Collaboration]
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
 *         description: List of requests
 */
router.get('/projects/:project_id/requests', protect, getJoinRequests);

module.exports = router;