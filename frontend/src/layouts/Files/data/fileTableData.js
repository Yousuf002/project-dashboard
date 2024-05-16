// filesTableData.js
// @mui material components
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import axios from "axios"; // Import axios
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { useEffect, useState } from "react"; // Import useEffect and useState
import { Link } from "react-router-dom"; // Import Link from react-router-dom

export default function data() {
  const [files, setFiles] = useState([]); // Initialize files as a state variable

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await axios.get("http://localhost:5000/files/get-all-files");
        setFiles(response.data);
      } catch (error) {
        console.error("Error fetching files:", error);
      }
    };

    fetchFiles();
  }, []); // Fetch files on component mount

  const handleDelete = async (fileId) => {
    try {
      await axios.delete(`http://localhost:5000/files/delete-file/${fileId}`);
      // Reload the page after deleting the file
      window.location.reload();
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };

  return {
    columns: [
      { Header: "Registration Code", accessor: "registrationCode", width: "20%", align: "left" },
      { Header: "Security Code", accessor: "securityCode", width: "20%", align: "left" },
      { Header: "Plot Type", accessor: "plotType", width: "20%", align: "left" },
      { Header: "Plot Size", accessor: "plotSize", width: "20%", align: "left" },
      { Header: "Project", accessor: "project", width: "20%", align: "left" }, // Add Project column
      { Header: "Status", accessor: "status", width: "20%", align: "left" },
      { Header: "Actions", accessor: "actions", align: "center" },
    ],

    rows: files.map((file) => ({
      registrationCode: file.RegistrationCode,
      securityCode: file.SecurityCode,
      plotType: file.PlotType,
      plotSize: file.PlotSize,
      project: file.Project.name, // Access the project name
      status: file.FileStatus,
      actions: (
        <MDBox display="flex" justifyContent="center">
          <Link to={file._id ? `/files/edit-file/${file._id}` : "#"} className="edit-link">
            <Icon sx={{ color: "grey", fontSize: "24" }}>edit</Icon>{" "}
          </Link>
          <MDTypography
            component="a"
            href="#"
            color="text"
            ml={2}
            onClick={() => handleDelete(file._id)}
            style={{ verticalAlign: "middle" }} // Adjust vertical alignment
          >
            <Link to="#">
              <Icon style={{ verticalAlign: "top", color: "grey" }}>delete</Icon>{" "}
            </Link>
          </MDTypography>
        </MDBox>
      ),
    })),
  };
}
