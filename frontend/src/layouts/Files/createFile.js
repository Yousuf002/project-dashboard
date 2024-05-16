import axios from "axios"; // Import axios for HTTP requests
import { useEffect, useState } from "react";
import "./CreateFileForm.css"; // Import CSS file for styling

const apiUrl = process.env.REACT_APP_API_URL;
function CreateFileForm() {
  const [registrationCode, setRegistrationCode] = useState("");
  const [securityCode, setSecurityCode] = useState("");
  const [plotType, setPlotType] = useState("");
  const [plotSize, setPlotSize] = useState("");
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");

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
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Check if the registration code already exists
      const existingFiles = await axios.get(`${apiUrl}/files/get-all-files`);
      if (existingFiles.data.some((file) => file.RegistrationCode === registrationCode)) {
        alert("Registration code already exists. Please use a different one.");
        return; // Stop further execution
      }

      // Make a POST request to add the file to the backend
      await axios.post(`${apiUrl}/files/create-file`, {
        RegistrationCode: registrationCode,
        SecurityCode: securityCode,
        PlotType: plotType,
        PlotSize: plotSize,
        Project: selectedProject,
      });

      // Reset form fields after successful submission
      setRegistrationCode("");
      setSecurityCode("");
      setPlotType("");
      setPlotSize("");
      setSelectedProject("");
      // Redirect or handle success as needed
      //send alert
      alert("File created successfully!");
    } catch (error) {
      console.error("Error submitting form data:", error);
    }
  };

  return (
    <div className="create-file-form-container">
      <h2>Create New File</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="registrationCode">Registration Code:</label>
          <input
            type="text"
            id="registrationCode"
            value={registrationCode}
            onChange={(e) => setRegistrationCode(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="securityCode">Security Code:</label>
          <input
            type="text"
            id="securityCode"
            value={securityCode}
            onChange={(e) => setSecurityCode(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="plotType">Plot Type:</label>
          <select
            id="plotType"
            value={plotType}
            onChange={(e) => setPlotType(e.target.value)}
            required
          >
            <option value="">Select Plot Type</option>
            <option value="Residential">Residential</option>
            <option value="Commercial">Commercial</option>
            <option value="Farmhouse">Farmhouse</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="plotSize">Plot Size:</label>
          <select
            id="plotSize"
            value={plotSize}
            onChange={(e) => setPlotSize(e.target.value)}
            required
          >
            <option value="">Select Plot Size</option>
            <option value="5 Marla">5 Marla</option>
            <option value="10 Marla">10 Marla</option>
            <option value="1 Kanal">1 Kanal</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="project">Project:</label>
          <select
            id="project"
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
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
          Submit
        </button>
      </form>
    </div>
  );
}

export default CreateFileForm;
