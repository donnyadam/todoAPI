import express from "express";
import pool from "../db.js";
import { authenticateToken } from "../middleware/authorization.js";

const router = express.Router();

router.get("/", authenticateToken, async (req, res) => {
  try {
    const checklist = await pool.query("SELECT * FROM checklist");
    res.json({
      checklist: checklist.rows,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

router.post("/", authenticateToken, async (req, res) => {
  try {
    const newChecklist = await pool.query(
      "INSERT INTO checklist (checklist_title) VALUES ($1) RETURNING *",
      [req.body.name]
    );
    res.json({
      checklist: newChecklist.rows[0],
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

router.delete("/:checklistId", authenticateToken, async (req, res) => {
  try {
    await pool.query("DELETE from todos WHERE checklist_id = $1", [
      req.params.checklistId,
    ]);
    const checklist = await pool.query(
      "DELETE from checklist WHERE checklist_id = $1",
      [req.body.checklistId]
    );
    res.status(204).json({
      message: `checklistId ${req.body.checklistId} is deleted`,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

router.get("/:checklistId/item", authenticateToken, async (req, res) => {
  try {
    const checklist = await pool.query(
      "SELECT * FROM checklist JOIN todos ON todos.checklist_id = checklist.checklist_id WHERE checklist.checklist_id = $1",
      [req.params.checklistId]
    );
    res.json({
      checklist: checklist.rows,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

router.post("/:checklistId/item", authenticateToken, async (req, res) => {
  try {
    const newTodo = await pool.query(
      "INSERT INTO todos (checklist_id, todos_item, complete) VALUES ($1, $2, $3) RETURNING *",
      [req.params.checklistId, req.body.itemName, false]
    );
    res.json({
      todos: newTodo.rows[0],
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

router.get(
  "/:checklistId/item/:checklistItemId",
  authenticateToken,
  async (req, res) => {
    try {
      const checklist = await pool.query(
        "SELECT * FROM todos JOIN checklist ON checklist.checklist_id = todos.checklist_id WHERE todos.checklist_id = $1 AND todos.todos_id = $2",
        [req.params.checklistId, req.params.checklistItemId]
      );
      res.json({
        checklist: checklist.rows[0],
      });
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  }
);

router.put("/:checklistId/item/:checklistItemId", async (req, res) => {
  try {
    await pool.query(
      "UPDATE todos SET complete = $1 WHERE checklist_id = $2 AND todos_id = $3",
      [true, req.params.checklistId, req.params.checklistItemId]
    );
    res.json({
      message: `Status ChecklistItemId ${
        req.params.checklistItemId
      } is ${true}`,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

router.delete("/:checklistId/item/:checklistItemId", async (req, res) => {
  try {
    const todos = await pool.query("DELETE from todos WHERE todos_id = $1", [
      req.params.checklistItemId,
    ]);
    res.status(204).json({message: `ChecklistItemId ${req.params.checklistItemId} is deleted`});
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

router.put("/:checklistId/item/rename/:checklistItemId", async (req, res) => {
  try {
    await pool.query(
      "UPDATE todos SET todos_item = $1 WHERE checklist_id = $2 AND todos_id = $3",
      [req.body.itemName, req.params.checklistId, req.params.checklistItemId]
    );
    res.json({
      message: `Status ChecklistItemId ${req.params.checklistItemId} is updated`,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

export default router;
