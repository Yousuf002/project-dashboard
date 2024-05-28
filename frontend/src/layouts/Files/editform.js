import { FormGroup } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./editFileForm.css";

const apiUrl = process.env.REACT_APP_API_URL;

const EditFormPage = () => {
  const [formData, setFormData] = useState(null);
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

  const handleInputChange = (category, fieldName) => (e) => {
    const { value, files } = e.target;
    if (files) {
      // Handle file input
      setFormData((prevData) => ({
        ...prevData,
        attachedFiles: {
          ...prevData.attachedFiles,
          [fieldName]: files[0],
        },
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [category]: {
          ...prevData[category],
          [fieldName]: value,
        },
      }));
    }
  };

  const handleCheckboxChange = (category, fieldName, value) => (e) => {
    const checked = e.target.checked;
    setFormData((prevData) => {
      const updatedValues = checked
        ? [...(prevData[category][fieldName] || []), value]
        : (prevData[category][fieldName] || []).filter((v) => v !== value);

      return {
        ...prevData,
        [category]: {
          ...prevData[category],
          [fieldName]: updatedValues,
        },
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`${apiUrl}/form/edit-form-data/${fileId}`, formData);
      console.log("Form data updated successfully:", response.data);
      window.alert("Form data updated successfully");
    } catch (error) {
      console.error("Error updating form data:", error);
      window.alert("Error submitting form data");
    }
  };

  if (!formData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="edit-form-page">
      <h2>Edit Form Entry</h2>
      <form onSubmit={handleSubmit}>
        {/* Personal Information */}
        <label>Name of Applicant:</label>
        <input
          type="text"
          value={formData.personalInformation?.name || ""}
          onChange={handleInputChange("personalInformation", "name")}
        />
        <label>S/o, D/o, Wi/o:</label>
        <input
          type="text"
          value={formData.personalInformation?.s_dw_w || ""}
          onChange={handleInputChange("personalInformation", "s_dw_w")}
        />
        <label>CNIC:</label>
        <input
          type="text"
          value={formData.personalInformation?.cnic || ""}
          onChange={handleInputChange("personalInformation", "cnic")}
        />
        <label>Passport:</label>
        <input
          type="text"
          value={formData.personalInformation?.passport || ""}
          onChange={handleInputChange("personalInformation", "passport")}
        />
        <label>Current Mailing Address:</label>
        <input
          type="text"
          value={formData.personalInformation?.currentMailingAddress || ""}
          onChange={handleInputChange("personalInformation", "currentMailingAddress")}
        />
        <label>Permanent Mailing Address:</label>
        <input
          type="text"
          value={formData.personalInformation?.permanentMailingAddress || ""}
          onChange={handleInputChange("personalInformation", "permanentMailingAddress")}
        />
        <label>Mobile Number:</label>
        <input
          type="text"
          value={formData.personalInformation?.mobileNumber || ""}
          onChange={handleInputChange("personalInformation", "mobileNumber")}
        />
        <label>Office Number:</label>
        <input
          type="text"
          value={formData.personalInformation?.officeNumber || ""}
          onChange={handleInputChange("personalInformation", "officeNumber")}
        />
        <label>Email:</label>
        <input
          type="text"
          value={formData.personalInformation?.email || ""}
          onChange={handleInputChange("personalInformation", "email")}
        />

        {/* Nominee Information */}
        <label>Nominee Name:</label>
        <input
          type="text"
          value={formData.nomineeInformation?.nomineeName || ""}
          onChange={handleInputChange("nomineeInformation", "nomineeName")}
        />
        <label>S/o, D/o, Wi/o:</label>
        <input
          type="text"
          value={formData.nomineeInformation?.nomineeS_dw_w || ""}
          onChange={handleInputChange("nomineeInformation", "nomineeS_dw_w")}
        />
        <label>Nominee CNIC:</label>
        <input
          type="text"
          value={formData.nomineeInformation?.nomineeCnic || ""}
          onChange={handleInputChange("nomineeInformation", "nomineeCnic")}
        />
        <label>Nominee Passport:</label>
        <input
          type="text"
          value={formData.nomineeInformation?.nomineePassport || ""}
          onChange={handleInputChange("nomineeInformation", "nomineePassport")}
        />
        <label>Relation:</label>
        <input
          type="text"
          value={formData.nomineeInformation?.relation || ""}
          onChange={handleInputChange("nomineeInformation", "relation")}
        />
        <label>Contact Number:</label>
        <input
          type="text"
          value={formData.nomineeInformation?.contactNumber || ""}
          onChange={handleInputChange("nomineeInformation", "contactNumber")}
        />

        {/* Mode of Payment */}
        <FormGroup row>
          <label>
            Payment Methods: <br></br>
          </label>
          <br></br>
          {["Cash", "Cheque", "Deposit", "Other"].map((method) => (
            <div key={method}>
              <input
                type="checkbox"
                checked={formData.modeOfPayment?.paymentMethods?.includes(method) || false}
                onChange={handleCheckboxChange("modeOfPayment", "paymentMethods", method)}
              />
              <label>{method}</label>
            </div>
          ))}
        </FormGroup>
        <label>Amount 1:</label>
        <input
          type="text"
          value={formData.modeOfPayment?.amount1 || ""}
          onChange={handleInputChange("modeOfPayment", "amount1")}
        />
        <label>Date 1:</label>
        <input
          type="Date"
          value={formData.modeOfPayment?.date1 || ""}
          onChange={handleInputChange("modeOfPayment", "date1")}
        />
        <br></br>
        <label>Amount 2:</label>
        <input
          type="text"
          value={formData.modeOfPayment?.amount2 || ""}
          onChange={handleInputChange("modeOfPayment", "amount2")}
        />
        <label>Date 2:</label>
        <input
          type="date"
          value={formData.modeOfPayment?.date2 || ""}
          onChange={handleInputChange("modeOfPayment", "date2")}
        />
        <br></br>
        {/* Plot Sizes */}
        <label>Plot Sizes:</label>
        <FormGroup row>
          {["3 Marla", "4 Marla", "5 Marla", "7 Marla", "10 Marla", "Other"].map((size) => (
            <div key={size}>
              <input
                type="checkbox"
                checked={formData.plotSizes?.includes(size) || false}
                onChange={handleCheckboxChange("plotSizes", "plotSizes", size)}
              />
              <label>{size}</label>
            </div>
          ))}
        </FormGroup>

        {/* Signatures */}

        {/* Attached Files */}
        <label>Applicant CNIC:</label>
        <input type="file" onChange={handleInputChange("attachedFiles", "applicantCnic")} />
        <label>Passport Images:</label>
        {(formData.attachedFiles?.passportImages || []).map((image, index) => (
          <div key={index}>
            <input
              type="file"
              multiple
              onChange={(e) => {
                const newImages = [...formData.attachedFiles.passportImages];
                newImages[index] = e.target.files[0];
                setFormData((prevData) => ({
                  ...prevData,
                  attachedFiles: {
                    ...prevData.attachedFiles,
                    passportImages: newImages,
                  },
                }));
              }}
            />
          </div>
        ))}
        <label>Nominee CNIC:</label>
        <input type="file" onChange={handleInputChange("attachedFiles", "nomineeCnic")} />

        <button type="submit" className="submit-button">
          Update
        </button>
      </form>
    </div>
  );
};

export default EditFormPage;
