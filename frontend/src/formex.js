// import jsPDF from "jspdf";
// import { useRef, useState } from "react";
// import PIA from "./PIA.png";
// add img variable PIA.png

// const FormWithBackground = () => {
//   const [formData, setFormData] = useState({
//     Define your form fields here
//     name: "",
//     email: "",
//     Add more fields as needed
//   });

//   const formRef = useRef(null);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//   };

//   const generatePDF = () => {
//     const background = new Image();
//     background.src = PIA;
//     background.crossOrigin = "anonymous";

//     const logo = new Image();
//     logo.src = PIA;
//     logo.crossOrigin = "anonymous";

//     Promise.all([
//       new Promise((resolve) => {
//         background.onload = resolve;
//       }),
//       new Promise((resolve) => {
//         logo.onload = resolve;
//       }),
//     ]).then(() => {
//       Generate PDF
//       const pdf = new jsPDF("p", "mm", "a4");
//       pdf.addImage(background, "PNG", 0, 0, 210, 297);
//       pdf.addImage(logo, "PNG", 10, 10, 50, 50);
//       pdf.text(formData.name, 100, 100);
//       pdf.text(formData.email, 100, 120);
//       pdf.save("form.pdf");
//     });
//   };

//   return (
//     <div
//       className="form-container"
//       style={{
//         backgroundImage: `url(https://static.vecteezy.com/system/resources/thumbnails/020/525/157/small/abstract-background-design-background-texture-design-with-abstract-style-creative-illustration-for-advertising-posters-business-cards-flyers-websites-banners-covers-landings-pages-etc-vector.jpg)`,
//         backgroundSize: "cover",
//       }}
//     >
//       <div className="logo-container">
//         <img src={PIA} alt="Logo" />
//       </div>
//       <form ref={formRef} className="form">
//         <input
//           type="text"
//           name="name"
//           value={formData.name}
//           onChange={handleInputChange}
//           placeholder="Name"
//         />
//         <input
//           type="email"
//           name="email"
//           value={formData.email}
//           onChange={handleInputChange}
//           placeholder="Email"
//         />
//         {/* Add more form fields as needed */}
//         <button type="button" onClick={generatePDF}>
//           Generate PDF
//         </button>
//       </form>
//     </div>
//   );
// };

// export default FormWithBackground;
