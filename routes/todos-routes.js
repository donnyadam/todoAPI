import express from "express";
import pool from "../db.js";

const router = express.Router();

router.post("/add", async (req, res) => {
    try {
      const newTodo = await pool.query(
        "INSERT INTO todos (checklist_id, todos_item, complete) VALUES ($1, $2, $3) RETURNING *",
        [req.body.checklistId, req.body.todo, false]);
        res.json({todos: newTodo.rows[0]});
    } catch (error) {
      res.status(500).json({
          error: error.message,
        });
    }
  });

router.get("/", async (req, res) => {
  try {
    const todos = await pool.query("SELECT * FROM todos");
    res.json({
      todos: todos.rows,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

router.post("/update", async (req, res) => {
    try {
      const todos = await pool.query("UPDATE todos SET todos_item = $1, complete = $2", [req.body.item, req.body.complete]);
      res.json({message: "data updated"});
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  });

router.delete("/delete", async (req, res) => {
    try {
        const todos = await pool.query('DELETE from todos WHERE todos_id = $1', [req.body.id]);
        res.status(204).json(todos.rows);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

export default router;
