var express = require("express");
var router = express.Router();
const Garbage = require("../models/garbage");
require("dotenv").config();
const { checkJWT } = require("../middlewares/security");

/**
 * @swagger
 * components:
 *  schemas:
 *    Garbage:
 *      type: object
 *      required:
 *        - name
 *        - code
 *      properties:
 *        _id:
 *            type: string
 *            description: autogenerate by db
 *        name:
 *            type: string
 *            description: Name of garbage.
 *        code:
 *            type: string
 *            description: Code of garbage.
 *        state:
 *             type: string
 *             description: State of garbage must include ['Full','Empty','Typed']
 *      example:
 *        _id: 6217a4ab7c8a80e7e2737e11
 *        name: Green Garbage 010
 *        code: GG010
 *        state: Full
 */

/**
 * @swagger
 * /garbages:
 *    get:
 *      summary: Returns the list of all garbages.
 *      tags: [Garbages]
 *      responses:
 *        200:
 *          description: The list of the garbages.
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/Garbage'
 */
const getAllGarbages = async (req, res) => {
  try {
    const garbages = await Garbage.find().lean();
    return res.status(200).json(garbages);
  } catch (e) {
    console.log(e);
    return res.status(500).json(e);
  }
};
/**
 * @swagger
 * /garbages/{id}:
 *    get:
 *      summary: Get the garbage by id.
 *      tags: [Garbages]
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: string
 *          required: true
 *          description: the garbage id.
 *      responses:
 *        200:
 *          description: The garbage description by id.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Garbage'
 *        404:
 *          description: The garbage was not found.
 */
const getGarbage = ({ params }, res) => {
  try {
    const garbage = Garbage.find({ _id: params.id }).lean();
    if (!garbage) return res.status(404).send("404: not found");
    return res.status(200).json(garbage);
  } catch (e) {
    return res.status(500).json(e);
  }
};
/**
 * @swagger
 * /garbages/create:
 *    post:
 *      summary: Create a new garbage.
 *      tags: [Garbages]
 *      security:
 *        - bearerAuth: []
 *      requestBody:
 *        required: true
 *        content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Garbage'
 *      responses:
 *        200:
 *          description: The garbage was successfully created.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Garbage'
 *        500:
 *          description: Error server !
 *
 */
const createGarbage = async ({ body }, res) => {
  try {
    const newGarbage = new Garbage(body);
    await newGarbage.save();
    const garbage = await Garbage.findOne({ _id: newGarbage._id });
    return res.status(200).json({
      data: { message: "Created successfully !", data: garbage },
    });
  } catch (e) {
    return res.status(500).json(e);
  }
};
/**
 * @swagger
 * /garbages/update/{id}:
 *    patch:
 *      summary: Update a garbage by id.
 *      tags: [Garbages]
 *      security:
 *        - bearerAuth: []
 *      requestBody:
 *        required: true
 *        content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Garbage'
 *      responses:
 *        200:
 *          description: The garbage was successfully updated.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Garbage'
 *        500:
 *          description: Error server !
 *
 */
const updateGarbage = async ({ params, body }, res) => {
  try {
    await Garbage.updateOne({ _id: params.id }, body);

    res.status(200).json({ data: "Updated successfully !" });
  } catch (e) {
    return res.status(500).json(e);
  }
};
/**
 * @swagger
 * /garbages/delete/{id}:
 *    delete:
 *      summary: Remove the garbage by id.
 *      tags: [Garbages]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: string
 *          required: true
 *          description: the garbage id.
 *      responses:
 *        200:
 *          description: The garbage successfully deleted.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Garbage'
 */
const deleteGarbage = async ({ params }, res) => {
  try {
    await Garbage.deleteOne({ _id: params.id });
    res.status(200).json({ data: "The garbage successfully deleted" });
  } catch (e) {
    return res.status(500).json(e);
  }
};
router.get("/garbages", getAllGarbages);
router.get("/garbages/:id", getGarbage);
router.post("/garbages/create", checkJWT, createGarbage);
router.patch("/garbages/update/:id", checkJWT, updateGarbage);
router.delete("/garbages/delete/:id", checkJWT, deleteGarbage);

module.exports = router;
