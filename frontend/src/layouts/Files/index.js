import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import axios from "axios";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import Footer from "examples/Footer";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const apiUrl = process.env.REACT_APP_API_URL;

function Files() {
  const [files, setFiles] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [filteredRows, setFilteredRows] = useState([]);
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await axios.get(`${apiUrl}/files/get-all-files`);
        setFiles(response.data);
        setFilteredRows(response.data);
      } catch (error) {
        console.error("Error fetching files:", error);
      }
    };

    fetchFiles();
  }, []);

  const handleDelete = async (fileId) => {
    try {
      await axios.delete(`${apiUrl}/files/delete-file/${fileId}`);
      // Reload the page after deleting the file
      window.location.reload();
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };

  const handleSearch = () => {
    const filtered = files.filter(
      (file) =>
        file.RegistrationCode.toLowerCase().includes(searchInput.toLowerCase()) ||
        file.SecurityCode.toLowerCase().includes(searchInput.toLowerCase())
    );
    setFilteredRows(filtered);
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
                  Files
                </MDTypography>
                <Link to="/create-file">
                  <Button variant="contained" style={{ backgroundColor: "white" }}>
                    Create File +
                  </Button>
                </Link>
              </MDBox>
              <MDBox pt={3} px={2}>
                <MDBox display="flex" alignItems="center">
                  <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Search by registration code or security code"
                    style={{
                      border: "1px solid grey",
                      borderRadius: "3px",
                      padding: "5px",
                      width: "70%", // Adjusted width
                      marginRight: "5px",
                    }}
                  />
                  <Button variant="contained" onClick={handleSearch}>
                    <Icon style={{ color: "white" }}>search</Icon>
                  </Button>
                </MDBox>
                <DataTable
                  table={{
                    columns: [
                      { Header: "Registration Code", accessor: "registrationCode" },
                      { Header: "Security Code", accessor: "securityCode" },
                      { Header: "Plot Type", accessor: "plotType" },
                      { Header: "Plot Size", accessor: "plotSize" },
                      { Header: "Project", accessor: "project" },
                      { Header: "Status", accessor: "status" },
                      { Header: "Actions", accessor: "actions" },
                    ],
                    rows: filteredRows.map((file) => ({
                      registrationCode: file.RegistrationCode,
                      securityCode: file.SecurityCode,
                      plotType: file.PlotType,
                      plotSize: file.PlotSize,
                      project: file.Project.name,
                      status: file.FileStatus,
                      actions: (
                        <MDBox display="flex" justifyContent="center">
                          <Link to={`/files/edit-file/${file._id}`} className="edit-link">
                            <Icon sx={{ color: "grey" }}>edit</Icon>{" "}
                          </Link>
                          <MDTypography
                            component="a"
                            href="#"
                            color="text"
                            ml={2}
                            onClick={() => handleDelete(file._id)}
                            style={{ verticalAlign: "middle" }}
                          >
                            <Icon style={{ verticalAlign: "top", color: "red" }}>delete</Icon>{" "}
                          </MDTypography>
                          <MDTypography
                            component="a"
                            href="#"
                            color="text"
                            ml={2}
                            style={{ verticalAlign: "middle" }}
                          >
                            <Link to={`/file-form/${file._id}`} className="form-link">
                              <Icon style={{ color: "#49a3f1", fontSize: "44" }}>description</Icon>
                            </Link>
                          </MDTypography>
                        </MDBox>
                      ), // Add the icon for the Form header
                    })),
                  }}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                  customCellStyles={{
                    fontFamily: "inherit",
                    fontWeight: "inherit",
                    fontSize: "inherit",
                    color: "inherit",
                  }}
                />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Files;
