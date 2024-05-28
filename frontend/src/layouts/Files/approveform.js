import { useState } from "react";
import "./editFileForm.css";
const ApproveFormPage = () => {
  const [plotNumber, setPlotNumber] = useState("");
  const [block, setBlock] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleSubmitForm = (e) => {
    e.preventDefault();
    // Logic for submitting the form
    setShowPopup(true);
  };

  const handlePopupSubmit = () => {
    // Logic for submitting popup data
    // You can send the data to the backend here
    setShowPopup(false);
    // Reset state after submission
    setName("");
    setPhoneNumber("");
    setPlotNumber("");
    setBlock("");
  };

  return (
    <div className="approve-form-page">
      <h2>Approve Form</h2>
      <form onSubmit={handleSubmitForm}>
        <label>Plot Number:</label>
        <input type="text" value={plotNumber} onChange={(e) => setPlotNumber(e.target.value)} />
        <label>Block:</label>
        <input type="text" value={block} onChange={(e) => setBlock(e.target.value)} />
        <button type="submit">Submit</button>
      </form>

      {/* Popup for entering property details */}
      {showPopup && (
        <div className="popup">
          <div className="popup-inner">
            <h2>Property Details</h2>
            <form onSubmit={handlePopupSubmit}>
              <label>Name:</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
              <label>Phone Number:</label>
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
              <label>Plot Number:</label>
              <input
                type="text"
                value={plotNumber}
                disabled // Prevent editing plot number in popup
              />
              <label>Block:</label>
              <input
                type="text"
                value={block}
                disabled // Prevent editing block in popup
              />
              <button type="submit">Submit</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApproveFormPage;
