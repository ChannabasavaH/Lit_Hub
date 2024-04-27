import express from 'express';
import User from '../models/userSchema.js';
import verifyToken from '../utils/middleware.js';

const router = express.Router();

//Route for signing up
router.post('/signup', async (req, res) => {
    try {
      let { displayName, email } = req.body;
      const newUser = new User({ displayName, email, });
      await newUser.save();
      res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Server error' });
    }
});

//Route for logging in
router.post('/login', verifyToken, async (req, res) => {
    try {
        res.status(200).json({ message: 'User authenticated' });
    } catch (error) {
        res.status(500).json({message: error});
    }
});
  
//Route for logging out
router.post('/logout', verifyToken, (req, res) => {
    try {
      res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
      console.error('Error logging out:', error);
      res.status(500).json({ error: 'Failed to logout' });
    }
})

export default router;