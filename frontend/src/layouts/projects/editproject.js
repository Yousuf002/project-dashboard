import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./EditProjectForm.css";

function EditProjectForm() {
  let { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [formData, setFormData] = useState({
    name: "", // Change to match backend schema
    description: "",
    location: "",
  });

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/projects/getproject/${projectId}`);
        setProject(response.data);
        setFormData({
          name: response.data.name, // Update to match backend schema
          description: response.data.description,
          location: response.data.location,
        });
      } catch (error) {
        console.error("Error :", error);
      }
    };
    console.log("project id is " + projectId);
    fetchProject();
  }, [projectId]);

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
      await axios.put(`http://localhost:5000/projects/edit/${projectId}`, formData);
      console.log("Project updated successfully");
      window.location.href = "/projects"; // Redirect to /projects route
    } catch (error) {
      console.error("Error updating project:", error);
    }
  };

  return (
    <div className="edit-project-form-container">
      <h2>Edit Project</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Project Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="location">Location:</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="submit-button">
          Update
        </button>
      </form>
    </div>
  );
}

export default EditProjectForm;
