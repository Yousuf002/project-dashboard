import { TextField } from "@mui/material";
import PropTypes from "prop-types";
import { useState } from "react";

function DataTableSearch({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  return (
    <TextField
      value={searchTerm}
      onChange={handleChange}
      variant="outlined"
      margin="dense"
      fullWidth
      placeholder="Search..."
    />
  );
}

DataTableSearch.propTypes = {
  onSearch: PropTypes.func.isRequired,
};

export default DataTableSearch;
