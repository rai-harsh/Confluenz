import db from '../db/index.js'; // Replace with your DB connection file path
import { comparePasswords, generateToken } from '../utils/jwtUtils.js';

export async function login(req, res) {
    const { username, password } = req.body;
    console.log(req.body);

    try {
        // Find user by username
        const result = await db.query("SELECT * FROM users WHERE username = $1", [username]);
        if (result.rows.length === 0) {
            return res.status(401).json({ error: "Invalid username or password" });
        }

        const user = result.rows[0];

        // Compare entered password with stored hashed password
        const isMatch = await comparePasswords(password, user.password); // Compare with user's password in DB
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid username or password" });
        }

        // Generate JWT
        const token = generateToken({ userId: user.id, username: user.username });

        console.log("User authenticated, sending token:", token);

        // Set cookie and respond
        res.cookie('authToken', token, {
            httpOnly: true,
            sameSite: 'Lax',
            secure: process.env.NODE_ENV === 'production', // Only send cookie over HTTPS in production
        });

        res.send({ success: true });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}
