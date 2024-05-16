import Icon from "@mui/material/Icon";
import axios from "axios";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function FileVerificationTableData() {
  const [fileVerification, setFileVerification] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchFileVerification = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/file-verification/file-verifications"
        );
        setFileVerification(response.data);
      } catch (error) {
        console.error("Error fetching file verification data:", error);
      }
    };

    fetchFileVerification();
  }, []);

  const handleDelete = async (fileVerificationId) => {
    try {
      await axios.delete(
        `http://localhost:5000/file-verification/delete-file-verification/${fileVerificationId}`
      );
      window.location.reload();
    } catch (error) {
      console.error("Error deleting file verification:", error);
    }
  };

  // Filter file verification data based on search term and registration code
  const filteredFileVerification = fileVerification.filter((verification) => {
    return verification.fileRegistrationCode.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return {
    columns: [
      { Header: "File Security Code", accessor: "fileSecurityCode", width: "20%", align: "left" },
      {
        Header: "File Registration Code",
        accessor: "fileRegistrationCode",
        width: "20%",
        align: "left",
      },
      { Header: "Mobile Number", accessor: "mobileNumber", width: "20%", align: "left" },
      { Header: "Name", accessor: "name", width: "20%", align: "left" },
      { Header: "Status", accessor: "status", width: "20%", align: "left" },
      { Header: "Actions", accessor: "actions", align: "center" },
    ],
    rows: filteredFileVerification.map((verification) => ({
      fileSecurityCode: verification.fileSecurityCode,
      fileRegistrationCode: verification.fileRegistrationCode,
      mobileNumber: verification.mobileNumber,
      name: verification.name,
      status: verification.status,
      actions: (
        <MDBox display="flex" justifyContent="center">
          <Link to={`/edit-file-verification/${verification._id}`} className="edit-link">
            <Icon sx={{ color: "grey", fontSize: "24" }}>edit</Icon>
          </Link>
          <MDTypography
            component="a"
            href="#"
            color="text"
            ml={2}
            onClick={() => handleDelete(verification._id)}
            style={{ verticalAlign: "middle" }}
          >
            <Icon style={{ verticalAlign: "top", color: "grey" }}>delete</Icon>
          </MDTypography>
        </MDBox>
      ),
    })),
    search: {
      value: searchTerm,
      onChange: (event) => setSearchTerm(event.target.value),
      placeholder: "Search by registration code...",
    },
  };
}
