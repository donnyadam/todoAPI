import express from "express";
import pool from "../db.js";

const router = express.Router();

router.post("/add", async (req, res) => {
    try {
      const newChecklist = await pool.query(
        "INSERT INTO checklist (checklist_title) VALUES ($1)",
        [req.body.title]);
        res.json({checklist: newChecklist.rows[0]});
    } catch (error) {
      res.status(500).json({
          error: error.message,
        });
    }
  });

router.get("/", async (req, res) => {
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

router.get("/detail", async (req, res) => {
    try {
      const checklist = await pool.query("SELECT * FROM checklist JOIN todos ON todos.checklist_id = checklist.checklist_id");
      res.json({
        checklist: checklist,
      });
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  });

router.delete("/delete", async (req, res) => {
    try {
        const checklist = await pool.query('DELETE from checklist WHERE checklist_title = $1', [req.body.title]);
        res.status(204).json(checklist.rows);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

export default router;
