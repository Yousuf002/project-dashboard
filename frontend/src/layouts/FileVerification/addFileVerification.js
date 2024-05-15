import Alert from "@mui/material/Alert";
import Card from "@mui/material/Card";
import Snackbar from "@mui/material/Snackbar";
import bgImage from "assets/images/bg-sign-in-basic.jpeg";
import axios from "axios";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import MDTypography from "components/MDTypography";
import BasicLayout from "layouts/authentication/components/BasicLayout";
import { useState } from "react";

function CreateFileVerification() {
  const [formData, setFormData] = useState({
    fileSecurityCode: "",
    fileRegistrationCode: "",
    mobileNumber: "",
    name: "",
  });

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // Default to "success" for verified status

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/file-verification/add-file-verification",
        formData
      );
      if (response && response.data && response.data.fileVerification) {
        const fileVerification = response.data.fileVerification;
        // Set Snackbar message and severity based on verification status
        if (fileVerification.status === "Verified") {
          setSnackbarMessage("File verification added successfully (Verified)");
          setSnackbarSeverity("success");
        } else {
          setSnackbarMessage("File verification added successfully (Not Verified)");
          setSnackbarSeverity("error");
        }
        // Open the Snackbar
        setOpenSnackbar(true);
        // Clear form data
        setFormData({
          fileSecurityCode: "",
          fileRegistrationCode: "",
          mobileNumber: "",
          name: "",
        });
      } else {
        console.error("Error adding file verification: Invalid response format");
      }
    } catch (error) {
      console.error("Error adding file verification:", error);
    }
  };

  return (
    <BasicLayout image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="info"
          mx={2}
          mt={-3}
          p={2}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            File Verification
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form" onSubmit={handleSubmit}>
            <MDBox mb={2}>
              <MDInput
                type="text"
                name="fileSecurityCode"
                label="File Security Code"
                value={formData.fileSecurityCode}
                onChange={handleChange}
                fullWidth
                sx={{ "& input": { height: "40px" } }} // Increase input field height
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="text"
                name="fileRegistrationCode"
                label="File Registration Code"
                value={formData.fileRegistrationCode}
                onChange={handleChange}
                fullWidth
                sx={{ "& input": { height: "40px" } }} // Increase input field height
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="text"
                name="mobileNumber"
                label="Mobile Number"
                value={formData.mobileNumber}
                onChange={handleChange}
                fullWidth
                sx={{ "& input": { height: "40px" } }} // Increase input field height
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="text"
                name="name"
                label="Name"
                value={formData.name}
                onChange={handleChange}
                fullWidth
                sx={{ "& input": { height: "40px" } }} // Increase input field height
              />
            </MDBox>
            <MDBox mt={4} mb={1}>
              <MDButton type="submit" variant="gradient" color="info" fullWidth>
                Verify
              </MDButton>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }} // Position the Snackbar at top center
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </BasicLayout>
  );
}

export default CreateFileVerification;
