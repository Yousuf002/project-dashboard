// projectsTableData.js
// @mui material components
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import axios from "axios"; // Import axios
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { useEffect, useState } from "react"; // Import useEffect and useState
import { Link } from "react-router-dom"; // Import Link from react-router-dom

const apiUrl = process.env.REACT_APP_API_URL;
export default function data() {
  const [projects, setProjects] = useState([]); // Initialize projects as a state variable

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(`${apiUrl}/projects`);
        setProjects(response.data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, []); // Fetch projects on component mount

  const handleDelete = async (projectId) => {
    try {
      await axios.delete(`${apiUrl}/projects/delete/${projectId}`);
      // Reload the page after deleting the project
      window.location.reload();
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };
  return {
    columns: [
      {
        Header: "Project Name",
        accessor: "projectName",
        width: "30%",
        align: "left",
      },
      { Header: "Description", accessor: "description", align: "left" },
      { Header: "Location", accessor: "location", align: "left" },
      { Header: "Actions", accessor: "actions", align: "center" },
    ],

    rows: projects.map((project) => ({
      projectName: project.name,
      description: project.description,
      location: project.location,
      actions: (
        <MDBox display="flex" justifyContent="center">
          <Link to={project._id ? `/edit-project/${project._id}` : "#"} className="edit-link">
            <Icon sx={{ color: "grey", fontSize: "24" }}>edit</Icon>{" "}
          </Link>
          <MDTypography
            component="a"
            href="#"
            color="text"
            ml={2}
            onClick={() => handleDelete(project._id)}
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
