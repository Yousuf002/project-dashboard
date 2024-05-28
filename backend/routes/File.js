const express = require('express');
const router = express.Router();
const File = require('../models/File');
const FormDataModel = require('../models/Form');

// POST route to create a new file object
router.post('/create-file', async (req, res) => {
  try {
    // Check if the registration code already exists
    const existingFile = await File.findOne({ RegistrationCode: req.body.RegistrationCode });
    if (existingFile) {
      return res.status(400).json({ message: 'Registration code already exists' });
    }

    // Create a new file object using the request body
    const newFile = new File({
      ...req.body, // Set FormData to null
    });

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
  router.put('/update-file/:id', async (req, res) => {
    const { id } = req.params;

    try {
        // Find the file by its ID
        const file = await File.findById(id);
        if (!file) {
            return res.status(404).json({ message: 'File not found' });
        }

        // Ensure the form data exists and get its ObjectId
        const formData = await FormDataModel.findById(req.body.FormData);
        if (!formData) {
            return res.status(404).json({ message: 'Form data not found' });
        }

        // Add form data to the file
        file.FormData = formData._id;

        // Save the updated file object
        await file.save();

        // Send a success response
        res.status(200).json({ message: 'Form data added to file successfully', File: file });
    } catch (error) {
        // If there's an error, send a 500 status code along with the error message
        res.status(500).json({ message: 'Failed to add form data to file', error: error.message });
    }
});

router.delete('/delete-file/:fileId', async (req, res) => {
  try {
      const file = await File.findByIdAndDelete(req.params.fileId);
      if (!file) {
          console.log('file not found');
          return res.status(404).json({ error: 'file not found' });
      }
      console.log('file deleted successfully:', file);
      res.status(200).json(file);
  } catch (error) {
      console.error('Error deleting file:', error);
      res.status(500).json({ error: error.message });
  }
});

router.get('/count', async (req, res) => {
  try {
    const count = await File.countDocuments();
    res.status(200).json({ count });
  } catch (error) {
    console.error('Error fetching project count:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
  
    module.exports = router;
