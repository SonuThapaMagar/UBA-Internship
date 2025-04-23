import express, { Request, Response } from 'express';
import { getUsers, saveUsers, generateID } from "../db/dbHelper";
import { User } from '../interfaces/User';

const router: express.Router = express.Router();
//Create user
router.post('/', async (req: Request, res: Response): Promise<void> => {

    try {
        const users = await getUsers();
        const newUser: User = {
            id: generateID(),
            fname: req.body.fname,
            lname: req.body.lname,
        };
        users.push(newUser);
        await saveUsers(users);
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ error: "Failed to create user" });
    }
})

//Get all users
router.get('/', async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await getUsers();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch users" });
    }
});

// Get user by id
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await getUsers();
        const user = users.find(u => String(u.id) === String(req.params.id));

        res.json(user);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch user" });
    }
});

//Update user
router.put('/:id', async (req: Request, res: Response): Promise<void> => {
    try {
        const users: User[] = await getUsers();
        const userId = users.findIndex((user) => String(user.id) === String(req.params.id));
        if (userId === -1) {
            console.log("User not found with ID:", req.body.id);
            return;
        }

        const updatedUser = {
            ...users[userId],
            ...req.body,
            id: users[userId].id
        };

        users[userId] = updatedUser;
        await saveUsers(users);
        res.status(200).json({
            message: "User updated successfully",
            user: updatedUser
        });
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Failed to update users" });
    }
})

//delete user
router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
    try {
        const users: User[] = await getUsers();
        const userId = users.findIndex((u) => u.id.toString() === req.params.id.toString());

        if (userId === -1) {
            res.status(404).json({ error: "User with ID ${req.params.id} not found." });
        }

        const deletedUser = users.splice(userId, 1)[0];
        await saveUsers(users);
        res.status(200).json({
            message: `Successfully deleted user: ${deletedUser.fname} ${deletedUser.lname}`,
            user: deletedUser,
        });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ error: "Failed to delete user" });
    }
});

export default router;