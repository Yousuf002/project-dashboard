const express = require("express");
const bodyParser = require("body-parser");
//require formDatamodel
const formDatamodel = require("../models/Form");
const FormDataModel = require("../models/Form");
const File = require("../models/File");
const router = express.Router();

router.post("/add-form-data/:fileId", async (req, res) => {
  try {
    // Extract form data from the request body
    const formData = req.body;

    // Get file ID from the URL parameters
    const fileId = req.params.fileId;

    // Create a new document with the form data
    const newFormData = new FormDataModel(formData);

    // Save the new document to the database
    const savedFormData = await newFormData.save();

    // Find the file by its ID and update it with the form data ID
    const file = await File.findById(fileId);
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }
    file.FormData = savedFormData._id;

    // Save the updated file document
    await file.save();

    // Respond with success message and the saved form data
    res.status(201).json({ message: "Form data saved successfully", formData: savedFormData });
  } catch (error) {
    console.error("Error saving form data:", error);
    // Respond with error message
    res.status(500).json({ error: "An error occurred while saving form data" });
  }
});
router.get("/get-form-data", async (req, res) => {
  try {
    // Fetch form data from your database or any other source
    // For example:
    const formData = await formDatamodel.findOne({
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
    const form = await FormDataModel.findById(file.FormData);

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

router.put("/edit-form-data:", async (req, res) => {
  try {
    //get form id
    const formId = req.params.id;
    //get form data from request body
    const formData = req.body;
    //update form data
    const updatedFormData = await formDatamodel.findByIdAndUpdate(
      formId,
      formData,
      { new: true }
    );
    res.status(200).json(updatedFormData);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update form data", error: error.message });
  }
});
//export router
module.exports = router;
