const mongoose = require('mongoose');

const FormSchema = new mongoose.Schema({
  plotSizes: [String],
  personalInformation: {
    name: String,
    s_dw_w: String,
    cnic: String,
    passport: String,
    currentMailingAddress: String,
    permanentMailingAddress: String,
    mobileNumber: String,
    officeNumber: String,
    email: String,
  },
  nomineeInformation: {
    nomineeName: String,
    nomineeS_dw_w: String,
    nomineeCnic: String,
    nomineePassport: String,
    relation: String,
    contactNumber: String,
  },
  modeOfPayment: {
    paymentMethod: [String],  // Updated to be an array of strings
    amount: String,
    chequeNumber: String,
    bankReceiptNumber: String,
  },
  signatures: {
    manager: String,
    officer: String,
    applicant: String,
  },
  attachedFiles: {
    passportImages: [String],
    applicantCnic: String,
    nomineeCnic: String,
  },
}, { timestamps: true });

const formDatamodel = mongoose.model('Form', FormSchema);

module.exports = formDatamodel;