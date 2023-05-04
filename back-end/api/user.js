const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  // Return a list of users
});

router.get('/:id', (req, res) => {
  const { id } = req.params;
  // Return the user with the given ID
});

router.post('/', (req, res) => {
  // Create a new user
});

router.put('/:id', (req, res) => {
  const { id } = req.params;
  // Update the user with the given ID
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;
  // Delete the user with the given ID
});

module.exports = router;
