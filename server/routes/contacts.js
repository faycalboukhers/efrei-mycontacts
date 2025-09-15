import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { updateContact, deleteContact, getContacts, createContact } from "../controllers/contactController.js";


const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Contacts
 *   description: Gestion des contacts
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Contact:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - phone
 *       properties:
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         phone:
 *           type: string
 *       example:
 *         firstName: John
 *         lastName: Doe
 *         phone: "0601020304"
 */

/**
 * @swagger
 * /contacts:
 *   get:
 *     summary: Récupérer tous les contacts de l'utilisateur connecté
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des contacts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Contact'
 *       401:
 *         description: Token manquant ou invalide
 */
router.get("/", verifyToken, getContacts);

/**
 * @swagger
 * /contacts:
 *   post:
 *     summary: Créer un nouveau contact pour l'utilisateur connecté
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Contact'
 *     responses:
 *       201:
 *         description: Contact créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Contact'
 *       401:
 *         description: Token manquant ou invalide
 */
router.post("/", verifyToken, createContact);

/**
 * @swagger
 * /contacts/{id}:
 *   patch:
 *     summary: Mettre à jour un contact partiellement
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du contact à mettre à jour
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Contact'
 *     responses:
 *       200:
 *         description: Contact mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Contact'
 *       401:
 *         description: Token manquant ou invalide
 *       404:
 *         description: Contact non trouvé
 */
router.patch("/:id", verifyToken, updateContact);

/**
 * @swagger
 * /contacts/{id}:
 *   delete:
 *     summary: Supprimer un contact
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du contact à supprimer
 *     responses:
 *       200:
 *         description: Contact supprimé avec succès
 *       401:
 *         description: Token manquant ou invalide
 *       404:
 *         description: Contact non trouvé
 */
router.delete("/:id", verifyToken, deleteContact);

export default router;