import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import Typography from "@mui/material/Typography";
import axios from "axios"; // You need to import axios
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import PIA from "./PIA.png";
import BG from "./bg2.jpg";
const cors = require("cors");
//import radio from react
const apiUrl = process.env.REACT_APP_API_URL;

const RegistrationForm = () => {
  const [formData1, setFormData1] = useState(null);

  let { fileId } = useParams();
  const [file, setFile] = useState(null);
  const cnicBoxes = Array(15).fill("");
  const passportBoxes = Array(8).fill("");
  const amountBoxes = Array(10).fill("");

  useEffect(() => {
    const fetchFile = async () => {
      try {
        const response = await axios.get(`${apiUrl}/files/get-file/${fileId}`);
        setFile(response.data);
      } catch (error) {
        console.error("Error fetching file:", error);
      }
    };
    fetchFile();
  }, [fileId]);

  const [plotSizes, setplotSizes] = useState([]);
  const [personalInformation, setPersonalInformation] = useState({
    name: "",
    s_dw_w: "",
    cnic: "",
    passport: "",
    currentMailingAddress: "",
    permanentMailingAddress: "",
    mobileNumber: "",
    officeNumber: "",
    email: "",
  });

  const [nomineeInformation, setNomineeInformation] = useState({
    nomineeName: "",
    nomineeS_dw_w: "",
    nomineeCnic: "",
    nomineePassport: "",
    relation: "",
    contactNumber: "",
  });

  const [modeOfPayment, setModeOfPayment] = useState({
    selectedMethod: "",
    paymentMethod: [],
    amount: "",
    chequeNumber: "",
    bankReceiptNumber: "",
  });

  const [signatures, setSignatures] = useState({
    manager: "",
    officer: "",
    applicant: "",
  });

  const [attachedFiles, setAttachedFiles] = useState({
    passportImages: [],
    applicantCnic: null,
    nomineeCnic: null,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    // Append each field of formData object
    formData.append("plotSizes", JSON.stringify(plotSizes));
    formData.append("personalInformation", JSON.stringify(personalInformation));
    formData.append("nomineeInformation", JSON.stringify(nomineeInformation));
    formData.append("modeOfPayment", JSON.stringify(modeOfPayment));
    formData.append("signatures", JSON.stringify(signatures));

    // Append each attached file
    attachedFiles.passportImages.forEach((file, index) => {
      formData.append(`passportImages[${index}]`, file);
    });
    if (attachedFiles.applicantCnic) {
      formData.append("applicantCnic", attachedFiles.applicantCnic);
    }
    if (attachedFiles.nomineeCnic) {
      formData.append("nomineeCnic", attachedFiles.nomineeCnic);
    }

    try {
      const response = await axios.post(`${apiUrl}/form/add-form-data/${fileId}`, formData);
      alert("Form submitted successfully!");
    } catch (error) {
      console.error("Error submitting form data:", error);
      alert("There was an error submitting the form. Please try again.");
    }
  };

  const handleInputChange = (category, fieldName) => (e) => {
    const { value } = e.target;
    switch (category) {
      case "plotSizes":
        setplotSizes((prevInfo) => ({ ...prevInfo, [fieldName]: value }));
        break;
      case "personalInformation":
        setPersonalInformation((prevInfo) => ({ ...prevInfo, [fieldName]: value }));
        break;
      case "nomineeInformation":
        setNomineeInformation((prevInfo) => ({ ...prevInfo, [fieldName]: value }));
        break;
      case "modeOfPayment":
        setModeOfPayment((prevPayment) => ({ ...prevPayment, [fieldName]: value }));
        break;
      case "signatures":
        setSignatures((prevSignatures) => ({ ...prevSignatures, [fieldName]: value }));
        break;
      default:
        break;
    }
  };

  const handleMediaUpload = (e, fileType) => {
    const file = e.target.files[0];
    const filePathOrURL = URL.createObjectURL(file);

    if (fileType === "passportPhoto") {
      setAttachedFiles((prevFiles) => ({
        ...prevFiles,
        passportImages: [...prevFiles.passportImages, filePathOrURL],
      }));
    } else if (fileType === "applicantCNIC") {
      setAttachedFiles((prevFiles) => ({
        ...prevFiles,
        applicantCnic: filePathOrURL,
      }));
    } else if (fileType === "nomineeCNIC") {
      setAttachedFiles((prevFiles) => ({
        ...prevFiles,
        nomineeCnic: filePathOrURL,
      }));
    }
  };
  const handlePaymentMethodChange = (event) => {
    const { name, checked } = event.target;
    setModeOfPayment((prevInfo) => {
      let updatedpaymentMethod = [...prevInfo.paymentMethod];
      if (checked) {
        updatedpaymentMethod.push(name);
      } else {
        updatedpaymentMethod = updatedpaymentMethod.filter((method) => method !== name);
      }
      return {
        ...prevInfo,
        paymentMethod: updatedpaymentMethod,
      };
    });
  };
  const formRef = useRef(null);
  const generatePDF = () => {
    const formElement = document.getElementById("registrationFormContainer");

    if (!formElement) {
      console.error("Form element not found.");
      return;
    }

    const background = new Image();
    background.src = BG;
    background.crossOrigin = "anonymous";

    const logo = new Image();
    logo.src = PIA;
    logo.crossOrigin = "anonymous";
    const submitButtons = formElement.querySelectorAll(".submit-button");
    submitButtons.forEach((button) => {
      button.remove();
    });

    const documentSection = formElement.querySelector(".documents");
    if (documentSection) {
      documentSection.style.display = "none";
    }

    Promise.all([
      new Promise((resolve) => {
        background.onload = resolve;
      }),
      new Promise((resolve) => {
        logo.onload = resolve;
      }),
    ]).then(() => {
      html2canvas(formElement).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const pdfWidth = 210;
        const pdfHeight = 297;

        const imgProps = pdf.getImageProperties(imgData);
        const imgHeight = (imgProps.height * pdfWidth - 30) / imgProps.width;
        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(background, "PNG", 0, 0, 210, 297);
        pdf.addImage(logo, "PNG", 10, 0, 30, 30);

        pdf.addImage(imgData, "PNG", 18, 48, pdfWidth - 40, imgHeight - 11);

        heightLeft -= pdfHeight - 50;
        let totalPages = 1;
        while (heightLeft > 0 && totalPages < 3) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, "PNG", 18, position, pdfWidth - 40, imgHeight);
          heightLeft -= pdfHeight;
          totalPages++;
        }

        const signatureY = pdf.internal.pageSize.getHeight() - 40;
        const fontSize = 10;

        pdf.setFontSize(fontSize);
        pdf.setTextColor(128, 128, 128);
        pdf.text(
          "Applicant's Signature: _______________     Manager's Signature: _______________     Officer's Signature: _______________",
          8,
          signatureY + 5
        );
        pdf.save("registration_form.pdf");
        submitButtons.forEach((button) => {
          formElement.appendChild(button);
        });

        if (documentSection) {
          documentSection.style.display = "block";
        }
      });
    });
  };

  return (
    <div className="">
      <Box
        sx={{
          maxWidth: 800,
          mx: "auto",
          boxShadow: 3,
          my: "20px",
        }}
        className="form-content"
      >
        <form
          id="registrationFormContainer"
          onSubmit={handleSubmit}
          ref={formRef}
          encType="multipart/form-data"
          style={{
            padding: "20px",
            backgroundColor: "transparent",
          }}
        >
          <Typography variant="h3" gutterBottom>
            Registration Form
          </Typography>
          <Typography variant="h5">Plot Size</Typography>
          <FormGroup row>
            {["3 Marla", "4 Marla", "5 Marla", "7 Marla", "10 Marla", "Other"].map((method) => (
              <FormControlLabel
                key={method}
                control={
                  <Checkbox
                    name={method}
                    checked={plotSizes.includes(method)}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setplotSizes((prevplotSizes) => {
                        if (checked) {
                          // Add the selected plot size to the array
                          return [...prevplotSizes, method];
                        } else {
                          // Remove the selected plot size from the array
                          return prevplotSizes.filter((size) => size !== method);
                        }
                      });
                    }}
                  />
                }
                label={method}
              />
            ))}
          </FormGroup>

          <Box sx={{ my: 2 }}>
            <Typography variant="h5">Personal Information</Typography>
            <label>Name of Applicant:</label>
            <input
              type="text"
              //placeholder="Name of Applicant"
              value={personalInformation.name}
              onChange={handleInputChange("personalInformation", "name")}
              style={{
                width: "100%",
                height: "43px",
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "5px",
                marginBottom: "10px",
              }}
            />
            <label>S/o, D/o, Wi/o</label>
            <input
              type="text"
              placeholder=""
              value={personalInformation.s_dw_w}
              onChange={handleInputChange("personalInformation", "s_dw_w")}
              style={{
                width: "100%",
                height: "43px",
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "5px",
                marginBottom: "10px",
              }}
            />
            <label>Cnic</label>
            <input
              type="tel"
              placeholder=""
              value={personalInformation.cnic}
              onChange={handleInputChange("personalInformation", "cnic")}
              style={{
                width: "100%",
                height: "43px",
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "5px",
                marginBottom: "10px",
              }}
            />
            <label>Passport</label>
            <input
              type="tel"
              placeholder=""
              value={personalInformation.passport}
              onChange={handleInputChange("personalInformation", "passport")}
              style={{
                width: "100%",
                height: "43px",
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "5px",
                marginBottom: "10px",
              }}
            />
            <label>Current Mailing Address</label>
            <input
              type="text"
              placeholder=""
              value={personalInformation.currentMailingAddress}
              onChange={handleInputChange("personalInformation", "currentMailingAddress")}
              style={{
                width: "100%",
                height: "43px",
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "5px",
                marginBottom: "10px",
              }}
            />
            <label>Permanent Mailing Address</label>
            <input
              type="text"
              placeholder=""
              value={personalInformation.permanentMailingAddress}
              onChange={handleInputChange("personalInformation", "permanentMailingAddress")}
              style={{
                width: "100%",
                height: "43px",
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "5px",
                marginBottom: "10px",
              }}
            />
            <label>Mobile Number</label>
            <input
              type="text"
              placeholder=""
              value={personalInformation.mobileNumber}
              onChange={handleInputChange("personalInformation", "mobileNumber")}
              style={{
                width: "100%",
                height: "43px",
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "5px",
                marginBottom: "10px",
              }}
            />
            <label>Office Number</label>
            <input
              type="text"
              placeholder="Office Number"
              value={personalInformation.officeNumber}
              onChange={handleInputChange("personalInformation", "officeNumber")}
              style={{
                width: "100%",
                height: "43px",
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "5px",
                marginBottom: "10px",
              }}
            />
            <label>Email</label>
            <input
              type="text"
              placeholder="Email"
              value={personalInformation.email}
              onChange={handleInputChange("personalInformation", "email")}
              style={{
                width: "100%",
                height: "43px",
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "5px",
                marginBottom: "10px",
              }}
            />
          </Box>

          <Box sx={{ my: 9 }}>
            <Typography variant="h5">Nominee Information</Typography>
            <label>Name of Nominee</label>
            <input
              type="text"
              placeholder=""
              value={nomineeInformation.nomineeName}
              onChange={handleInputChange("nomineeInformation", "nomineeName")}
              style={{
                width: "100%",
                height: "43px",
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "5px",
                marginBottom: "10px",
              }}
            />
            <label>S/o, D/o, Wi/o</label>
            <input
              type="text"
              placeholder=""
              value={nomineeInformation.nomineeS_dw_w}
              onChange={handleInputChange("nomineeInformation", "nomineeS_dw_w")}
              style={{
                width: "100%",
                height: "43px",
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "5px",
                marginBottom: "10px",
              }}
            />
            <label>Nominee Cnic</label>
            <input
              type="tel"
              placeholder=""
              value={nomineeInformation.nomineeCnic}
              onChange={handleInputChange("nomineeInformation", "nomineeCnic")}
              style={{
                width: "100%",
                height: "43px",
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "5px",
                marginBottom: "10px",
              }}
            />
            <label>Nominee Passport</label>
            <input
              type="tel"
              placeholder=""
              value={nomineeInformation.nomineePassport}
              onChange={handleInputChange("nomineeInformation", "nomineePassport")}
              style={{
                width: "100%",
                height: "43px",
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "5px",
                marginBottom: "10px",
              }}
            />
            <label>Relation</label>
            <input
              type="text"
              placeholder=""
              value={nomineeInformation.relation}
              onChange={handleInputChange("nomineeInformation", "relation")}
              style={{
                width: "100%",
                height: "43px",
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "5px",
                marginBottom: "10px",
              }}
            />
            <label>Contact Number</label>
            <input
              type="text"
              placeholder=""
              value={nomineeInformation.contactNumber}
              onChange={handleInputChange("nomineeInformation", "contactNumber")}
              style={{
                width: "100%",
                height: "43px",
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "5px",
                marginBottom: "10px",
              }}
            />
          </Box>

          <Box sx={{ my: 2 }}>
            <Typography variant="h5">Mode of Payment</Typography>
            <FormGroup row>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={modeOfPayment.paymentMethod.includes("cheque")}
                    onChange={(e) => handlePaymentMethodChange(e, "cheque")}
                    name="cheque"
                  />
                }
                label="Cheque"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={modeOfPayment.paymentMethod.includes("bank")}
                    onChange={(e) => handlePaymentMethodChange(e, "bank")}
                    name="bank"
                  />
                }
                label="Bank"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={modeOfPayment.paymentMethod.includes("cash")}
                    onChange={(e) => handlePaymentMethodChange(e, "cash")}
                    name="cash"
                  />
                }
                label="Cash"
              />
            </FormGroup>

            {modeOfPayment.paymentMethod.includes("cheque") && (
              <label>
                Cheque Number:
                <input
                  type="text"
                  value={modeOfPayment.chequeNumber}
                  onChange={handleInputChange("modeOfPayment", "chequeNumber")}
                />
              </label>
            )}
            {modeOfPayment.paymentMethod.includes("bank") && (
              <label>
                Bank Receipt Number:
                <input
                  type="text"
                  value={modeOfPayment.bankReceiptNumber}
                  onChange={handleInputChange("modeOfPayment", "bankReceiptNumber")}
                />
              </label>
            )}
          </Box>
          <div style={{ display: "flex", marginBottom: "20px" }}>
            <label>Amount</label>
            <input
              type="text"
              placeholder=""
              value={modeOfPayment.amount1}
              onChange={handleInputChange("modeOfPayment", "amount1")}
              style={{
                flex: "1",
                height: "43px",
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "5px",
                marginRight: "10px",
              }}
            />
            <label>Date</label>
            <input
              type="date"
              placeholder=""
              value={modeOfPayment.date1}
              onChange={handleInputChange("modeOfPayment", "date1")}
              style={{
                flex: "1",
                height: "43px",
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "5px",
              }}
            />
          </div>
          <div style={{ display: "flex" }}>
            <label>Amount</label>
            <input
              type="text"
              placeholder="Amount"
              value={modeOfPayment.amount2}
              onChange={handleInputChange("modeOfPayment", "amount2")}
              style={{
                flex: "1",
                height: "43px",
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "5px",
                marginRight: "10px",
              }}
            />
            <label>Date</label>
            <input
              type="date"
              placeholder="Date"
              value={modeOfPayment.date2}
              onChange={handleInputChange("modeOfPayment", "date2")}
              style={{
                flex: "1",
                height: "43px",
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "5px",
              }}
            />
          </div>
          <Box sx={{ my: 2 }} className="documents">
            <Typography variant="h5">Documents to be Attached</Typography>
            <ul style={{ fontSize: "14px" }}>
              <li>2 Passport Size Photograph</li>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleMediaUpload(e, "passportPhoto")}
                multiple // Enable multiple file selection
                style={{ marginBottom: "10px" }} // Add inline CSS here
              />
              <li>Copy of Applicant&apos;s CNIC</li>
              <input
                type="file"
                accept=".pdf,.doc,.docx,image/*"
                onChange={(e) => handleMediaUpload(e, "applicantCNIC")}
                style={{ marginBottom: "10px" }} // Add inline CSS here
              />
              <li>Copy of Nominee&apos;s CNIC</li>
              <input
                type="file"
                accept=".pdf,.doc,.docx,image/*"
                onChange={(e) => handleMediaUpload(e, "nomineeCNIC")}
                style={{ marginBottom: "10px" }} // Add inline CSS here
              />
            </ul>
          </Box>

          <button type="submit" className="submit-button">
            Submit
          </button>

          <button
            type="button"
            onClick={generatePDF}
            className="submit-button"
            style={{ marginLeft: "20px" }}
          >
            Generate PDF
          </button>
        </form>
      </Box>
    </div>
  );
  function handleCnicChange(e, index) {
    const { value } = e.target;
    if (/^\d*$/.test(value)) {
      const updatedCnic = personalInformation.cnic.split("");
      updatedCnic[index] = value;
      setPersonalInformation((prevInfo) => ({
        ...prevInfo,
        cnic: updatedCnic.join(""),
      }));
    }
  }

  function handlePassportChange(e, index) {
    const { value } = e.target;
    if (/^[a-zA-Z0-9]*$/.test(value)) {
      const updatedPassport = personalInformation.passport.split("");
      updatedPassport[index] = value;
      setPersonalInformation((prevInfo) => ({
        ...prevInfo,
        passport: updatedPassport.join(""),
      }));
    }
  }

  function handleNomineeCnicChange(e, index) {
    const { value } = e.target;
    if (/^\d*$/.test(value)) {
      const updatedNomineeCnic = nomineeInformation.nomineeCnic.split("");
      updatedNomineeCnic[index] = value;
      setNomineeInformation((prevInfo) => ({
        ...prevInfo,
        nomineeCnic: updatedNomineeCnic.join(""),
      }));
    }
  }

  function handleNomineePassportChange(e, index) {
    const { value } = e.target;
    if (/^[a-zA-Z0-9]*$/.test(value)) {
      const updatedNomineePassport = nomineeInformation.nomineePassport.split("");
      updatedNomineePassport[index] = value;
      setNomineeInformation((prevInfo) => ({
        ...prevInfo,
        nomineePassport: updatedNomineePassport.join(""),
      }));
    }
  }

  function handleAmountChange(e, index) {
    const { value } = e.target;
    if (/^\d*$/.test(value)) {
      const updatedAmount = modeOfPayment.amount.split("");
      updatedAmount[index] = value;
      setModeOfPayment((prevInfo) => ({
        ...prevInfo,
        amount: updatedAmount.join(""),
      }));
    }
  }
};

export default RegistrationForm;
