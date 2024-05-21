import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import Typography from "@mui/material/Typography";
import axios from "axios"; // You need to import axios
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import PIA from "./PIA.png";
import BG from "./bg2.jpg";
//import gtml2canvas
import html2canvas from "html2canvas";
//require cors
const cors = require("cors");

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
    paymentMethods: [],
    amount1: "",
    date1: "",
    amount2: "",
    date2: "",
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

    const formData = {
      plotSizes: plotSizes,
      personalInformation: personalInformation,
      nomineeInformation: nomineeInformation,
      modeOfPayment: modeOfPayment,
      signatures: signatures,
      attachedFiles: attachedFiles,
    };

    try {
      await axios.post(`${apiUrl}/form/add-form-data/${fileId}`, formData);
      //await axios.put(`${apiUrl}/files/update-file/${fileId}`, formData);
      //console.log("Form data added to file:", response.data);
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

  // Update the handleMediaUpload function to store the file data
  const handleMediaUpload = (e, fileType) => {
    const file = e.target.files[0];
    const filePathOrURL = URL.createObjectURL(file);

    // Check the fileType to update the state accordingly
    if (fileType === "passportPhoto") {
      setAttachedFiles((prevFiles) => ({
        ...prevFiles,
        passportImages: [...prevFiles.passportImages, filePathOrURL],
      }));
    } else if (fileType === "applicantCNIC") {
      // Corrected key name
      setAttachedFiles((prevFiles) => ({
        ...prevFiles,
        applicantCnic: filePathOrURL, // Corrected key name
      }));
    } else if (fileType === "nomineeCNIC") {
      // Corrected key name
      setAttachedFiles((prevFiles) => ({
        ...prevFiles,
        nomineeCnic: filePathOrURL, // Corrected key name
      }));
    }
  };
  //registrationFormContainer
  const formRef = useRef(null);
  const generatePDF = () => {
    const formElement = document.getElementById("registrationFormContainer");

    // Check if formElement exists
    if (!formElement) {
      console.error("Form element not found.");
      return;
    }

    const background = new Image();
    background.src = BG;
    background.crossOrigin = "anonymous";

    const logo = new Image();
    logo.src = PIA; // Adjust the path to your logo image
    logo.crossOrigin = "anonymous";
    const submitButtons = formElement.querySelectorAll(".submit-button");
    submitButtons.forEach((button) => {
      button.remove();
    });

    // Hide the document section
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
        const pdfWidth = 210; // Width of A4 paper in mm
        const pdfHeight = 297; // Height in mm

        const imgProps = pdf.getImageProperties(imgData);
        const imgHeight = (imgProps.height * pdfWidth - 30) / imgProps.width;
        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(background, "PNG", 0, 0, 210, 297); // Add background image on the first page
        pdf.addImage(logo, "PNG", 10, 0, 30, 30); // Adjust the coordinates and dimensions as needed

        pdf.addImage(imgData, "PNG", 18, 48, pdfWidth - 40, imgHeight - 35); // Adjust the Y coordinate (50) to position the form content below the logo

        heightLeft -= pdfHeight - 50;
        //declare totalPages
        let totalPages = 1;
        while (heightLeft > 0 && totalPages < 3) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, "PNG", 18, position, pdfWidth - 40, imgHeight);
          heightLeft -= pdfHeight;
          totalPages++;
        }

        // Draw signatures
        const signatureY = pdf.internal.pageSize.getHeight() - 40;
        const fontSize = 10; // Adjust the font size as needed

        pdf.setFontSize(fontSize);
        //change pdf text color
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

        //Show the document section again
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
              value={nomineeInformation.cnic}
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
              value={nomineeInformation.cnic}
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
              value={nomineeInformation.cnic}
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
              value={nomineeInformation.cnic}
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
              {["Cash", "Cheque", "Deposit", "Other"].map((method) => (
                <FormControlLabel
                  key={method}
                  control={
                    <Checkbox
                      name={method}
                      checked={modeOfPayment.paymentMethods.includes(method)}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setModeOfPayment((prev) => ({
                          ...prev,
                          paymentMethods: checked
                            ? [...prev.paymentMethods, method]
                            : prev.paymentMethods.filter((item) => item !== method),
                        }));
                      }}
                    />
                  }
                  label={method}
                />
              ))}
            </FormGroup>
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
          </Box>

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
};

export default RegistrationForm;
