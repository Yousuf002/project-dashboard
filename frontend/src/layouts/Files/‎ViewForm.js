import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const apiUrl = process.env.REACT_APP_API_URL;
const useStyles = makeStyles({
  tableContainer: {
    maxWidth: 800,
    margin: "auto",
    marginTop: 20,
  },
  table: {
    minWidth: 650,
  },
});

function ViewForm() {
  const [formData, setFormData] = useState(null);
  const classes = useStyles();
  const { fileId } = useParams();

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

  return (
    <div>
      {formData ? (
        <TableContainer component={Paper} className={classes.tableContainer}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Field</TableCell>
                <TableCell align="right">Value</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/* Render each field according to your choice */}
              <TableRow>
                <TableCell>Plot Size</TableCell>
                <TableCell align="right">{formData.plotSizes.join(", ")}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Name of Applicant</TableCell>
                <TableCell align="right">{formData.personalInformation.name}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>S/o, D/o, Wi/o</TableCell>
                <TableCell align="right">{formData.personalInformation.s_dw_w}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Cnic</TableCell>
                <TableCell align="right">{formData.personalInformation.cnic}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Passport</TableCell>
                <TableCell align="right">{formData.personalInformation.passport}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Current Mailing Address</TableCell>
                <TableCell align="right">
                  {formData.personalInformation.currentMailingAddress}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Permanent Mailing Address</TableCell>
                <TableCell align="right">
                  {formData.personalInformation.permanentMailingAddress}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Mobile Number</TableCell>
                <TableCell align="right">{formData.personalInformation.mobileNumber}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Office Number</TableCell>
                <TableCell align="right">{formData.personalInformation.officeNumber}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Email</TableCell>
                <TableCell align="right">{formData.personalInformation.email}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Name of Nominee</TableCell>
                <TableCell align="right">{formData.nomineeInformation.nomineeName}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>S/o, D/o, Wi/o (Nominee)</TableCell>
                <TableCell align="right">{formData.nomineeInformation.nomineeS_dw_w}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Nominee Cnic</TableCell>
                <TableCell align="right">{formData.nomineeInformation.nomineeCnic}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Nominee Passport</TableCell>
                <TableCell align="right">{formData.nomineeInformation.nomineePassport}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Relation</TableCell>
                <TableCell align="right">{formData.nomineeInformation.relation}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Contact Number</TableCell>
                <TableCell align="right">{formData.nomineeInformation.contactNumber}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Payment Methods</TableCell>
                <TableCell align="right">
                  {formData.modeOfPayment.paymentMethods.join(", ")}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Amount 1</TableCell>
                <TableCell align="right">{formData.modeOfPayment.amount1}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Date 1</TableCell>
                <TableCell align="right">{formData.modeOfPayment.date1}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Amount 2</TableCell>
                <TableCell align="right">{formData.modeOfPayment.amount2}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Date 2</TableCell>
                <TableCell align="right">{formData.modeOfPayment.date2}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Manager&apos;s Signature</TableCell>
                <TableCell align="right">{formData.signatures.manager}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Officer&apos;s Signature</TableCell>
                <TableCell align="right">{formData.signatures.officer}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Applicant&apos;s Signature</TableCell>
                <TableCell align="right">{formData.signatures.applicant}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Applicant&apos;s CNIC</TableCell>
                <TableCell align="right">
                  <img src={formData.attachedFiles.applicantCnic} alt="Applicant's CNIC" />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Nominee&apos;s CNIC</TableCell>
                <TableCell align="right">
                  <img src={formData.attachedFiles.nomineeCnic} alt="Nominee's CNIC" />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default ViewForm;
