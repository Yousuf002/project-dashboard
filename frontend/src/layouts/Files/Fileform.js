import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import axios from "axios"; // You need to import axios
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

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

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        // Make a GET request to fetch the form data
        const response = await axios.get(`${apiUrl}/form/get-form-data`);
        setFormData1(response.data);
      } catch (error) {
        console.error("Error fetching form data:", error);
      }
    };

    fetchFormData();
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      personalInformation: personalInformation,
      nomineeInformation: nomineeInformation,
      modeOfPayment: modeOfPayment,
      signatures: signatures,
    };

    try {
      await axios.post(`${apiUrl}/form/add-form-data`, formData);
      await axios.post(`${apiUrl}/files/update-file/${fileId}`, formData1);
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
  const [attachedFiles, setAttachedFiles] = useState({
    passportPhoto: null,
    applicantCNIC: null,
    nomineeCNIC: null,
  });

  // Update the handleMediaUpload function to store the file data
  const handleMediaUpload = (e, fileType) => {
    const file = e.target.files[0];
    setAttachedFiles((prevFiles) => ({
      ...prevFiles,
      [fileType]: file,
    }));
  };
  const generatePDF = () => {
    const formElement = document.getElementById("registrationFormContainer");

    html2canvas(formElement, { scale: 5 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdfWidth = 212; // Width of A4 paper in mm
      const pdfHeight = (canvas.height * pdfWidth + 200) / canvas.width; // Height in mm

      const pdf = new jsPDF("p", "mm", "a4");

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("registration_form.pdf");
    });
  };

  const renderBoxes = (boxes, fieldName, category) => {
    const refs = useRef([]);

    const handleChange = (e, index) => {
      const value = e.target.value;
      if (/^[0-9]$/.test(value)) {
        if (index < boxes.length - 1) {
          refs.current[index + 1].focus();
        }
        handleInputChange(category, fieldName, value); // Pass category and fieldName to handleInputChange
      } else {
        e.target.value = "";
      }
    };

    const handleKeyDown = (e, index) => {
      if (e.key === "Backspace" && !e.target.value) {
        if (index > 0) {
          refs.current[index - 1].focus();
        }
      }
    };

    return boxes.map((_, index) => (
      <TextField
        key={index}
        inputProps={{
          maxLength: 1,
          style: { textAlign: "center", height: "30px" },
          inputMode: "numeric",
          pattern: "[0-9]*",
        }}
        variant="outlined"
        size="small"
        sx={{
          width: "30px",
          margin: "2px",
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "black",
              borderWidth: "2px",
            },
            "&:hover fieldset": {
              borderColor: "black",
              borderWidth: "2px",
            },
            "&.Mui-focused fieldset": {
              borderColor: "black",
              borderWidth: "2px",
            },
          },
        }}
        inputRef={(el) => (refs.current[index] = el)}
        onChange={(e) => handleChange(e, index)}
        onKeyDown={(e) => handleKeyDown(e, index)}
      />
    ));
  };
  return (
    <div className="registrationFormContainerDiv" id="registrationFormContainer">
      <Box sx={{ maxWidth: 800, mx: "auto", boxShadow: 3, my: "20px" }}>
        <form
          onSubmit={handleSubmit}
          style={{
            backgroundImage:
              'url("https://static.vecteezy.com/system/resources/thumbnails/020/525/157/small/abstract-background-design-background-texture-design-with-abstract-style-creative-illustration-for-advertising-posters-business-cards-flyers-websites-banners-covers-landings-pages-etc-vector.jpg")',
            backgroundSize: "contain",
            padding: "20px",
          }}
        >
          <img
            src="https://img.freepik.com/premium-vector/abstract-trendy-floral-background-vector_7087-1882.jpg"
            alt="Logo"
            style={{ position: "relative", top: 10, left: 10, width: 50, height: 50 }}
          />
          <Typography variant="h4" gutterBottom>
            Registration Form
          </Typography>

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
                height: "50px",
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
                height: "50px",
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
                height: "50px",
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
                height: "50px",
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
                height: "50px",
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
                height: "50px",
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
                height: "50px",
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
                height: "50px",
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
                height: "50px",
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "5px",
                marginBottom: "10px",
              }}
            />
          </Box>

          <Box sx={{ my: 2 }}>
            <Typography variant="h5">Nominee Information</Typography>
            <label>Name of Nominee</label>
            <input
              type="text"
              placeholder=""
              value={nomineeInformation.nomineeName}
              onChange={handleInputChange("nomineeInformation", "nomineeName")}
              style={{
                width: "100%",
                height: "50px",
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
                height: "50px",
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
                height: "50px",
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
                height: "50px",
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
                height: "50px",
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
                height: "50px",
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
                  height: "50px",
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
                  height: "50px",
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
                  height: "50px",
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
                  height: "50px",
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                }}
              />
            </div>
          </Box>

          <Box sx={{ my: 2 }}>
            <Typography variant="h5">Documents to be Attached</Typography>
            <ul style={{ fontSize: "16px" }}>
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

          <Box sx={{ my: 2 }}>
            <Typography variant="h6">Signatures</Typography>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <label>Manager</label>
                <input
                  type="text"
                  placeholder=""
                  value={signatures.manager}
                  onChange={handleInputChange("signatures", "manager")}
                  style={{
                    width: "100%",
                    height: "50px",
                    padding: "10px",
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                  }}
                />
              </Grid>
              <Grid item xs={4}>
                <label>Officer</label>
                <input
                  type="text"
                  placeholder=""
                  value={signatures.officer}
                  onChange={handleInputChange("signatures", "officer")}
                  style={{
                    width: "100%",
                    height: "50px",
                    padding: "10px",
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                  }}
                />
              </Grid>
              <Grid item xs={4}>
                <label>Applicant</label>
                <input
                  type="text"
                  placeholder=""
                  value={signatures.applicant}
                  onChange={handleInputChange("signatures", "applicant")}
                  style={{
                    width: "100%",
                    height: "50px",
                    padding: "10px",
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                  }}
                />
              </Grid>
            </Grid>
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
