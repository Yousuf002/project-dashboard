import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./editFileForm.css";

function EditFileForm() {
  let { fileId } = useParams();
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    RegistrationCode: "", // Updated naming to match schema
    SecurityCode: "", // Updated naming to match schema
    PlotType: "", // Updated naming to match schema
    PlotSize: "", // Updated naming to match schema
    Project: "", // Updated naming to match schema
  });
  const [projects, setProjects] = useState([]); // State to store the list of projects

  useEffect(() => {
    const fetchFile = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/files/get-file/${fileId}`);
        setFile(response.data);
        setFormData({
          RegistrationCode: response.data.RegistrationCode,
          SecurityCode: response.data.SecurityCode,
          PlotType: response.data.PlotType,
          PlotSize: response.data.PlotSize,
          Project: response.data.Project, // Set project field in formData
        });
      } catch (error) {
        console.error("Error fetching file:", error);
      }
    };
    fetchFile();
  }, [fileId]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get("http://localhost:5000/projects/");
        setProjects(response.data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };
    fetchProjects();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Check if the registration code already exists
      const existingFile = await axios.get(`http://localhost:5000/files/get-all-files`);
      if (
        existingFile.data.some(
          (file) => file.RegistrationCode === formData.RegistrationCode && file._id !== fileId
        )
      ) {
        alert("Registration code already exists. Please use a different one.");
        return; // Stop further execution
      }

      const response = await axios.put(`http://localhost:5000/files/edit-file/${fileId}`, formData);
      console.log("File updated successfully", response.data);
      // Optional: Redirect to /files route after successful update
      // window.location.href = "/files";
    } catch (error) {
      console.error("Error updating file:", error);
    }
  };

  return (
    <div className="edit-file-form-container">
      <h2>Edit File</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="RegistrationCode">Registration Code:</label>
          <input
            type="text"
            id="RegistrationCode"
            name="RegistrationCode"
            value={formData.RegistrationCode}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="SecurityCode">Security Code:</label>
          <input
            type="text"
            id="SecurityCode"
            name="SecurityCode"
            value={formData.SecurityCode}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="PlotType">Plot Type:</label>
          <select
            id="PlotType"
            name="PlotType"
            value={formData.PlotType}
            onChange={handleChange}
            required
          >
            <option value="">Select Plot Type</option>
            <option value="Residential">Residential</option>
            <option value="Commercial">Commercial</option>
            <option value="Farmhouse">Farmhouse</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="PlotSize">Plot Size:</label>
          <select
            id="PlotSize"
            name="PlotSize"
            value={formData.PlotSize}
            onChange={handleChange}
            required
          >
            <option value="">Select Plot Size</option>
            <option value="5 Marla">5 Marla</option>
            <option value="10 Marla">10 Marla</option>
            <option value="1 Kanal">1 Kanal</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="Project">Project:</label>
          <select
            id="Project"
            name="Project"
            value={formData.Project}
            onChange={handleChange}
            required
          >
            <option value="">Select Project</option>
            {projects.map((project) => (
              <option key={project._id} value={project._id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="submit-button">
          Update
        </button>
      </form>
    </div>
  );
}

export default EditFileForm;
