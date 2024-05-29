const express = require("express");
const bodyParser = require("body-parser");
//require formDatamodel
const FormDatamodel = require("../models/Form");
const multer = require('multer');
const path = require('path');
const File = require("../models/File");
const Joi = require('joi');
const router = express.Router();


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './files');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Define your route
router.post('/add-form-data/:fileId', upload.single('file'), async (req, res) => {
  try {
    const formData = req.body;
    const fileId = req.params.fileId;

    // Parse JSON strings into objects
    const parsedFormData = {
      plotSizes: JSON.parse(formData.plotSizes),
      personalInformation: JSON.parse(formData.personalInformation),
      nomineeInformation: JSON.parse(formData.nomineeInformation),
      modeOfPayment: JSON.parse(formData.modeOfPayment),
      signatures: JSON.parse(formData.signatures),
    };
   

    console.log(parsedFormData);

    // Process attached files
    const attachedFiles = {};
    if (req.file) {
      attachedFiles[req.file.fieldname] = req.file.path; // Adjust as per your form structure
    }

    parsedFormData.attachedFiles = attachedFiles;

    // Find the file document by fileId
    const file = await File.findById(fileId);
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Check if form data already exists for this file
    if (file.FormData) {
      return res.status(400).json({ message: 'Form data already exists for this file' });
    }
     //change file status to inProcess
     file.FileStatus = 'In Process';
    // Save form data to database
    const newFormData = new FormDatamodel(parsedFormData);
    const savedFormData = await newFormData.save();

    // Update file document with form data ID
    file.FormData = savedFormData._id;
    await file.save();

    // Respond with success message and saved form data
    res.status(201).json({ message: 'Form data saved successfully', formData: savedFormData });
  } catch (error) {
    console.error('Error saving form data:', error);
    res.status(500).json({ error: 'An error occurred while saving form data' });
  }
});

router.get("/get-form-data", async (req, res) => {
  try {
    // Fetch form data from your database or any other source
    // For example:
    const formData = await FormDatamodel.findOne({
      /* Add any conditions */
    });
    res.status(200).json(formData);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch form data", error: error.message });
  }
});
router.get("/get-form-d/:fileId", async (req, res) => {
  const { fileId } = req.params;

  try {
    // Find the file entry to get the form ID
    const file = await File.findById(fileId);

    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    // Find the form entry using the form ID from the file entry
    const form = await FormDatamodel.findById(file.FormData);

    if (!form) {
      return res.status(404).json({ error: "Form not found" });
    }

    // Return the form data
    return res.json(form);
  } catch (error) {
    console.error("Error fetching form data:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while fetching form data" });
  }
});

router.put('/edit-form-data/:fileId', async (req, res) => {
  const { fileId } = req.params;
  const formData = req.body;

  try {
    // Find the file by fileId
    const file = await File.findById(fileId).populate('FormData');
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Get the formData ID from the file
    const formDataId = file.FormData;
console.log(file.FormData);
    // Update the form data by its ID
    const updatedForm = await FormDatamodel.findByIdAndUpdate(formDataId, formData, { new: true });

    if (!updatedForm) {
      return res.status(404).json({ message: 'Form not found' });
    }

    res.json(updatedForm);
  } catch (error) {
    console.error('Error updating form data:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/count', async (req, res) => {
  try {
    const count = await FormDatamodel.countDocuments();
    res.status(200).json({ count });
  } catch (error) {
    console.error('Error fetching project count:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
//export router
module.exports = router;
