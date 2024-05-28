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
                <TableCell align="right">
                  {formData.plotSizes ? formData.plotSizes.join(", ") : "N/A"}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Name of Applicant</TableCell>
                <TableCell align="right">{formData.personalInformation?.name || "N/A"}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>S/o, D/o, Wi/o</TableCell>
                <TableCell align="right">{formData.personalInformation?.s_dw_w || "N/A"}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Cnic</TableCell>
                <TableCell align="right">{formData.personalInformation?.cnic || "N/A"}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Passport</TableCell>
                <TableCell align="right">
                  {formData.personalInformation?.passport || "N/A"}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Current Mailing Address</TableCell>
                <TableCell align="right">
                  {formData.personalInformation?.currentMailingAddress || "N/A"}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Permanent Mailing Address</TableCell>
                <TableCell align="right">
                  {formData.personalInformation?.permanentMailingAddress || "N/A"}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Mobile Number</TableCell>
                <TableCell align="right">
                  {formData.personalInformation?.mobileNumber || "N/A"}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Office Number</TableCell>
                <TableCell align="right">
                  {formData.personalInformation?.officeNumber || "N/A"}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Email</TableCell>
                <TableCell align="right">{formData.personalInformation?.email || "N/A"}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Name of Nominee</TableCell>
                <TableCell align="right">
                  {formData.nomineeInformation?.nomineeName || "N/A"}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>S/o, D/o, Wi/o (Nominee)</TableCell>
                <TableCell align="right">
                  {formData.nomineeInformation?.nomineeS_dw_w || "N/A"}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Nominee Cnic</TableCell>
                <TableCell align="right">
                  {formData.nomineeInformation?.nomineeCnic || "N/A"}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Nominee Passport</TableCell>
                <TableCell align="right">
                  {formData.nomineeInformation?.nomineePassport || "N/A"}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Relation</TableCell>
                <TableCell align="right">
                  {formData.nomineeInformation?.relation || "N/A"}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Contact Number</TableCell>
                <TableCell align="right">
                  {formData.nomineeInformation?.contactNumber || "N/A"}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Payment Methods</TableCell>
                <TableCell align="right">
                  {formData.modeOfPayment?.paymentMethods?.join(", ") || "N/A"}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Amount 1</TableCell>
                <TableCell align="right">{formData.modeOfPayment?.amount1 || "N/A"}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Date 1</TableCell>
                <TableCell align="right">{formData.modeOfPayment?.date1 || "N/A"}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Amount 2</TableCell>
                <TableCell align="right">{formData.modeOfPayment?.amount2 || "N/A"}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Date 2</TableCell>
                <TableCell align="right">{formData.modeOfPayment?.date2 || "N/A"}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Manager&apos;s Signature</TableCell>
                <TableCell align="right">{formData.signatures?.manager || "N/A"}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Officer&apos;s Signature</TableCell>
                <TableCell align="right">{formData.signatures?.officer || "N/A"}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Applicant&apos;s Signature</TableCell>
                <TableCell align="right">{formData.signatures?.applicant || "N/A"}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Applicant&apos;s CNIC</TableCell>
                <TableCell align="right">
                  {formData.attachedFiles?.applicantCnic ? (
                    <img src={formData.attachedFiles.applicantCnic} alt="Applicant's CNIC" />
                  ) : (
                    "N/A"
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Nominee&apos;s CNIC</TableCell>
                <TableCell align="right">
                  {formData.attachedFiles?.nomineeCnic ? (
                    <img src={formData.attachedFiles.nomineeCnic} alt="Nominee's CNIC" />
                  ) : (
                    "N/A"
                  )}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <p>...</p>
      )}
    </div>
  );
}

export default ViewForm;
