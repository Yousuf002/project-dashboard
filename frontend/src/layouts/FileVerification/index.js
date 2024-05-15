import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import Footer from "examples/Footer";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";
import fileVerificationTableData from "layouts/FileVerification/data/filesVerificationTableData";
import { useState } from "react";
import { Link } from "react-router-dom";

function FileVerification() {
  const { columns: fvColumns, rows: fvRows } = fileVerificationTableData(); // Assuming you have file verification data
  // Change page
  const [currentPage, setCurrentPage] = useState(1);
  // Set items per page
  const [itemsPerPage, setItemsPerPage] = useState(7);
  // Paginate function
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  // Calculate index of the first and last item on the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRows = fvRows.slice(indexOfFirstItem, indexOfLastItem);

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
                  File Verification
                </MDTypography>
                <Link to="/create-file-verification">
                  <Button variant="contained" style={{ backgroundColor: "white" }}>
                    Create File Verification +
                  </Button>
                </Link>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={{ columns: fvColumns, rows: currentRows }}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                  // Apply custom styles to data fields
                  customCellStyles={{
                    fontFamily: "inherit",
                    fontWeight: "inherit",
                    fontSize: "inherit",
                    color: "inherit",
                  }}
                />
                {/* Pagination */}
                <div>
                  <Button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
                    Previous
                  </Button>
                  <Button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={indexOfLastItem >= fvRows.length}
                  >
                    Next
                  </Button>
                </div>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default FileVerification;
