import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import axios from "axios";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import Footer from "examples/Footer";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { useEffect, useState } from "react";
import { FaFile } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";

const apiUrl = process.env.REACT_APP_API_URL;

function FileFormData() {
  const { fileId } = useParams();
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const response = await axios.get(`${apiUrl}/form/get-form-d/${fileId}`);
        setFormData(response.data);
      } catch (error) {
        console.error("Error fetching form data:", error);
      }
    };

    fetchFormData();
  }, [fileId]);

  const openFile = (filePath) => {
    window.open(filePath, "_blank");
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h5" color="white">
                  Form Data
                </MDTypography>
                <Link
                  to={!formData ? `/file-form/${fileId}` : `/edit-form/${fileId}`}
                  className="form-link"
                >
                  <Button variant="contained" style={{ backgroundColor: "white" }}>
                    {!formData ? "Create Form +" : "Edit Form"}
                  </Button>
                </Link>
              </MDBox>
              <MDBox pt={3} px={2}>
                {formData ? (
                  <>
                    <Link to={`/view-form/${fileId}`}>
                      <Button variant="contained" color="white">
                        View Form
                      </Button>
                    </Link>
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell style={{ padding: "10px 20px" }}>
                              Applicant Information
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          <TableRow>
                            <TableCell style={{ padding: "10px 20px" }}>Name</TableCell>
                            <TableCell style={{ padding: "10px 20px" }}>
                              {formData.personalInformation?.name}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell style={{ padding: "10px 20px" }}>CNIC</TableCell>
                            <TableCell style={{ padding: "10px 20px" }}>
                              {formData.personalInformation?.cnic}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell style={{ padding: "10px 20px" }}>Email</TableCell>
                            <TableCell style={{ padding: "10px 20px" }}>
                              {formData.personalInformation?.email}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell style={{ padding: "10px 20px" }}>Attachment Field</TableCell>
                            <TableCell style={{ padding: "10px 20px" }}>File</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {formData.attachedFiles &&
                            Object.entries(formData.attachedFiles).map(([field, value]) => (
                              <TableRow key={field}>
                                <TableCell style={{ padding: "10px 20px" }}>{field}</TableCell>
                                <TableCell style={{ padding: "10px 20px" }}>
                                  {value && (
                                    <>
                                      <IconButton onClick={() => openFile(value)}>
                                        <FaFile />
                                      </IconButton>
                                      <span>{value.label || ""}</span>
                                    </>
                                  )}
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </>
                ) : (
                  <MDTypography variant="h6">...</MDTypography>
                )}
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default FileFormData;
