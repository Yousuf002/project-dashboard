import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import Footer from "examples/Footer";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";
import filesTableData from "layouts/Files/data/fileTableData";
import { useState } from "react";
import { Link } from "react-router-dom";

function Files() {
  const { columns: pColumns, rows: pRows } = filesTableData();
  //change page
  const [currentPage, setCurrentPage] = useState(1);
  //set items on page
  const [itemsPerPage, setItemsPerPage] = useState(7);
  //paginate function
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  // Calculate index of the first and last item on the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRows = pRows.slice(indexOfFirstItem, indexOfLastItem);

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
              <MDBox pt={3}>
                <DataTable
                  table={{ columns: pColumns, rows: currentRows }}
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
                {/* pagination */}
                <div>
                  <Button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
                    Previous
                  </Button>
                  <Button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={indexOfLastItem >= pRows.length}
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

export default Files;