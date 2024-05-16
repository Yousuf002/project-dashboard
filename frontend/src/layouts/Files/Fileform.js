import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import axios from "axios"; // You need to import axios
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

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
        const response = await axios.get(`http://localhost:5000/files/get-file/${fileId}`);
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

  const renderBoxes = (boxes) => {
    const refs = useRef([]);

    const handleChange = (e, index) => {
      if (/^[0-9]$/.test(e.target.value)) {
        if (index < boxes.length - 1) {
          refs.current[index + 1].focus();
        }
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
  useEffect(() => {
    const fetchFormData = async () => {
      try {
        // Make a GET request to fetch the form data
        const response = await axios.get("http://localhost:5000/form/get-form-data");
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
      await axios.post("http://localhost:5000/form/add-form-data", formData);
      await axios.post(`http://localhost:5000/files/update-file/${fileId}`, formData1);
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

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Box sx={{ maxWidth: 800, mx: "auto", p: 6, boxShadow: 3, my: "20px" }}>
          <Typography variant="h4" gutterBottom>
            Registration Form
          </Typography>

          <Box sx={{ my: 2 }}>
            <Typography variant="h6">Personal Information</Typography>
            <TextField
              label="Name of Applicant"
              fullWidth
              margin="normal"
              value={personalInformation.name}
              required
              onChange={handleInputChange("personalInformation", "name")}
              InputProps={{
                sx: {
                  height: "50px", // Adjust the height as needed
                  "& .MuiOutlinedInput-root": {
                    "& input": {
                      height: "50px", // Adjust the height as needed
                    },
                  },
                },
              }}
            />
            <TextField
              label="S/o, D/o, Wi/o"
              fullWidth
              margin="normal"
              value={personalInformation.s_dw_w}
              required
              onChange={handleInputChange("personalInformation", "s_dw_w")}
              InputProps={{
                sx: {
                  height: "50px", // Adjust the height as needed
                  "& .MuiOutlinedInput-root": {
                    "& input": {
                      height: "50px", // Adjust the height as needed
                    },
                  },
                },
              }}
            />
            <Typography>CNIC</Typography>
            <Box sx={{ display: "flex", justifyContent: "center" }}>{renderBoxes(cnicBoxes)}</Box>
            <Typography>Passport</Typography>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              {renderBoxes(passportBoxes)}
            </Box>
            <TextField
              label="Current Mailing Address"
              fullWidth
              margin="normal"
              value={personalInformation.currentMailingAddress}
              required
              onChange={handleInputChange("personalInformation", "currentMailingAddress")}
              InputProps={{
                sx: {
                  height: "50px", // Adjust the height as needed
                  "& .MuiOutlinedInput-root": {
                    "& input": {
                      height: "50px", // Adjust the height as needed
                    },
                  },
                },
              }}
            />
            <TextField
              label="Permanent Mailing Address"
              fullWidth
              margin="normal"
              value={personalInformation.permanentMailingAddress}
              required
              onChange={handleInputChange("personalInformation", "permanentMailingAddress")}
              InputProps={{
                sx: {
                  height: "50px", // Adjust the height as needed
                  "& .MuiOutlinedInput-root": {
                    "& input": {
                      height: "50px", // Adjust the height as needed
                    },
                  },
                },
              }}
            />
            <TextField
              label="Mobile Number"
              fullWidth
              margin="normal"
              value={personalInformation.mobileNumber}
              required
              onChange={handleInputChange("personalInformation", "mobileNumber")}
              InputProps={{
                sx: {
                  height: "50px", // Adjust the height as needed
                  "& .MuiOutlinedInput-root": {
                    "& input": {
                      height: "50px", // Adjust the height as needed
                    },
                  },
                },
              }}
            />
            <TextField
              label="Office Number"
              fullWidth
              margin="normal"
              value={personalInformation.officeNumber}
              required
              onChange={handleInputChange("personalInformation", "officeNumber")}
              InputProps={{
                sx: {
                  height: "50px", // Adjust the height as needed
                  "& .MuiOutlinedInput-root": {
                    "& input": {
                      height: "50px", // Adjust the height as needed
                    },
                  },
                },
              }}
            />
            <TextField
              label="Email"
              fullWidth
              margin="normal"
              value={personalInformation.email}
              required
              onChange={handleInputChange("personalInformation", "email")}
              InputProps={{
                sx: {
                  height: "50px", // Adjust the height as needed
                  "& .MuiOutlinedInput-root": {
                    "& input": {
                      height: "50px", // Adjust the height as needed
                    },
                  },
                },
              }}
            />
          </Box>

          <Box sx={{ my: 2 }}>
            <Typography variant="h6">Nominee Information</Typography>
            <TextField
              label="Name of Nominee"
              fullWidth
              margin="normal"
              value={nomineeInformation.nomineeName}
              required
              onChange={handleInputChange("nomineeInformation", "nomineeName")}
              InputProps={{
                sx: {
                  height: "50px", // Adjust the height as needed
                  "& .MuiOutlinedInput-root": {
                    "& input": {
                      height: "50px", // Adjust the height as needed
                    },
                  },
                },
              }}
            />
            <TextField
              label="S/o, D/o, Wi/o"
              fullWidth
              margin="normal"
              value={nomineeInformation.nomineeS_dw_w}
              required
              onChange={handleInputChange("nomineeInformation", "nomineeS_dw_w")}
              InputProps={{
                sx: {
                  height: "50px", // Adjust the height as needed
                  "& .MuiOutlinedInput-root": {
                    "& input": {
                      height: "50px", // Adjust the height as needed
                    },
                  },
                },
              }}
            />
            <Typography>CNIC</Typography>
            <Box sx={{ display: "flex", justifyContent: "center" }}>{renderBoxes(cnicBoxes)}</Box>
            <Typography>Passport</Typography>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              {renderBoxes(passportBoxes)}
            </Box>
            <TextField
              label="Relation"
              fullWidth
              margin="normal"
              value={nomineeInformation.relation}
              required
              onChange={handleInputChange("nomineeInformation", "relation")}
              InputProps={{
                sx: {
                  height: "50px", // Adjust the height as needed
                  "& .MuiOutlinedInput-root": {
                    "& input": {
                      height: "50px", // Adjust the height as needed
                    },
                  },
                },
              }}
            />
            <TextField
              label="Contact Number"
              fullWidth
              margin="normal"
              value={nomineeInformation.contactNumber}
              required
              onChange={handleInputChange("nomineeInformation", "contactNumber")}
              InputProps={{
                sx: {
                  height: "50px", // Adjust the height as needed
                  "& .MuiOutlinedInput-root": {
                    "& input": {
                      height: "50px", // Adjust the height as needed
                    },
                  },
                },
              }}
            />
          </Box>

          <Box sx={{ my: 2 }}>
            <Typography variant="h6">Mode of Payment</Typography>
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
            <TextField
              label="Amount"
              fullWidth
              margin="normal"
              value={modeOfPayment.amount1}
              required
              onChange={handleInputChange("modeOfPayment", "amount1")}
              InputProps={{
                sx: {
                  height: "50px", // Adjust the height as needed
                  "& .MuiOutlinedInput-root": {
                    "& input": {
                      height: "50px", // Adjust the height as needed
                    },
                  },
                },
              }}
            />
            <TextField
              label="Date"
              type="date"
              fullWidth
              margin="normal"
              value={modeOfPayment.date1}
              required
              onChange={handleInputChange("modeOfPayment", "date1")}
              InputLabelProps={{ shrink: true }}
              InputProps={{
                sx: {
                  height: "50px", // Adjust the height as needed
                  "& .MuiOutlinedInput-root": {
                    "& input": {
                      height: "50px", // Adjust the height as needed
                    },
                  },
                },
              }}
            />
            <TextField
              label="Amount"
              fullWidth
              margin="normal"
              value={modeOfPayment.amount2}
              required
              onChange={handleInputChange("modeOfPayment", "amount2")}
              InputProps={{
                sx: {
                  height: "50px", // Adjust the height as needed
                  "& .MuiOutlinedInput-root": {
                    "& input": {
                      height: "50px", // Adjust the height as needed
                    },
                  },
                },
              }}
            />
            <TextField
              label="Date"
              type="date"
              fullWidth
              margin="normal"
              value={modeOfPayment.date2}
              required
              onChange={handleInputChange("modeOfPayment", "date2")}
              InputLabelProps={{ shrink: true }}
              InputProps={{
                sx: {
                  height: "50px", // Adjust the height as needed
                  "& .MuiOutlinedInput-root": {
                    "& input": {
                      height: "50px", // Adjust the height as needed
                    },
                  },
                },
              }}
            />
          </Box>

          <Box sx={{ my: 2 }}>
            <Typography variant="h5">Documents to be Attached</Typography>
            <ul style={{ fontSize: "16px" }}>
              <li>Document 1</li>
              <li>Document 2</li>
              <li>Document 3</li>
            </ul>
          </Box>

          <Box sx={{ my: 2 }}>
            <Typography variant="h6">Signatures</Typography>
            <TextField
              label="Manager"
              fullWidth
              margin="normal"
              value={signatures.manager}
              required
              onChange={handleInputChange("signatures", "manager")}
              InputProps={{
                sx: {
                  height: "50px", // Adjust the height as needed
                  "& .MuiOutlinedInput-root": {
                    "& input": {
                      height: "50px", // Adjust the height as needed
                    },
                  },
                },
              }}
            />
            <TextField
              label="Officer"
              fullWidth
              margin="normal"
              value={signatures.officer}
              required
              onChange={handleInputChange("signatures", "officer")}
              InputProps={{
                sx: {
                  height: "50px", // Adjust the height as needed
                  "& .MuiOutlinedInput-root": {
                    "& input": {
                      height: "50px", // Adjust the height as needed
                    },
                  },
                },
              }}
            />
            <TextField
              label="Applicant"
              fullWidth
              margin="normal"
              value={signatures.applicant}
              required
              onChange={handleInputChange("signatures", "applicant")}
              InputProps={{
                sx: {
                  height: "30px", // Adjust the height as needed
                  "& .MuiOutlinedInput-root": {
                    "& input": {
                      height: "60px", // Adjust the height as needed
                    },
                  },
                },
              }}
            />
          </Box>

          <button type="submit" className="submit-button">
            Submit
          </button>
        </Box>
      </form>
    </div>
  );
};

export default RegistrationForm;
