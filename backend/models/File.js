const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  RegistrationCode: {
    type: String,
    required: true,
    unique: true
  },
  SecurityCode: {
    type: String,
    required: true
  },
  PlotType: {
    type: String,
    enum: ['Residential', 'Commercial', 'Farmhouse'],
    required: true
  },
  PlotSize: {
    type: String,
    enum: ['5 Marla', '10 Marla', '1 Kanal'],
    required: true
  },
  Project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  }
});

const File = mongoose.model('FileObject', fileSchema);

module.exports = File;
