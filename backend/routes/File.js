const express = require('express');
const router = express.Router();
const File = require('../models/File');

// POST route to create a new file object
router.post('/create-file', async (req, res) => {
    try {
      // Check if the registration code already exists
      const existingFile = await File.findOne({ RegistrationCode: req.body.RegistrationCode });
      if (existingFile) {
        return res.status(400).json({ message: 'Registration code already exists' });
      }
  
      // Create a new file object using the request body
      const newFile = new File(req.body);
      // Save the new file object to the database
      await newFile.save();
      // Send a success response
      res.status(201).json({ message: 'File object created successfully', File: newFile });
    } catch (error) {
      // If there's an error, send a 500 status code along with the error message
      res.status(500).json({ message: 'Failed to create file object', error: error.message });
    }
  });
router.get('/get-all-files', async (req, res) => {
    try {
        const files = await File.find().populate('Project', 'name');
        res.json(files);
    } catch (error) {
        console.error("Error fetching files:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
  // Route to get a file by ID
  router.get('/get-file/:id', async (req, res) => {
    try {
      const file = await File.findById(req.params.id);
      if (!file) {
        return res.status(404).json({ message: 'File not found' });
      }
      res.status(200).json(file);
    } catch (error) {
      res.status(500).json({ message: 'Failed to retrieve file', error: error.message });
    }
  });
  
  // Route to edit a file
// Route to edit a file
router.put('/edit-file/:id', async (req, res) => {
    try {
      // Check if the registration code already exists in another file
      const existingFile = await File.findOne({ RegistrationCode: req.body.RegistrationCode, _id: { $ne: req.params.id } });
      if (existingFile) {
        return res.status(400).json({ message: 'Registration code already exists in another file' });
      }
  
      // Proceed with updating the file
      const updatedFile = await File.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updatedFile) {
        return res.status(404).json({ message: 'File not found' });
      }
      res.status(200).json({ message: 'File updated successfully', file: updatedFile });
    } catch (error) {
      res.status(500).json({ message: 'Failed to update file', error: error.message });
    }
  });
  
  
  // Route to delete a file
  router.delete('/delete-file/:id', async (req, res) => {
    try {
      const deletedFile = await File.findByIdAndDelete(req.params.id);
      if (!deletedFile) {
        return res.status(404).json({ message: 'File not found' });
      }
      res.status(200).json({ message: 'File deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete file', error: error.message });
    }
  });
  
  module.exports = router;