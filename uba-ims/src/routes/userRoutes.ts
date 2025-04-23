import express from "express";
import { getUsers, saveUsers, generateID } from "../db/dbHelper";
import { User } from '../interfaces/User';

const router = express.Router();


//Get all users
router.get('/', async (req, res) => {
    try {
        const users = await getUsers();
        res.json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Failed to fetch users" });
    }
});

export default router;