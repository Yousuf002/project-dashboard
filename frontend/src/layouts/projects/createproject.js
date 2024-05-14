import axios from "axios"; // Import axios for HTTP requests
import { useState } from "react";
import "./CreateProjectForm.css"; // Import CSS file for styling

function CreateProjectForm() {
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Make a POST request to add the project to the backend
      await axios.post("http://localhost:5000/projects/addProject", {
        name: projectName,
        description,
        location,
      });

      // Reset form fields after successful submission
      setProjectName("");
      setDescription("");
      setLocation("");

      // Redirect to the /projects route after adding the project
      window.location.href = "/projects";
    } catch (error) {
      console.error("Error submitting form data:", error);
    }
  };

  return (
    <div className="create-project-form-container">
      <h2>Create New Project</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="projectName">Project Name:</label>
          <input
            type="text"
            id="projectName"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="location">Location:</label>
          <input
            type="text"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="submit-button">
          Submit
        </button>
      </form>
    </div>
  );
}

export default CreateProjectForm;
