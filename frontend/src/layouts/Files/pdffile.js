import { Document, Image, Page, StyleSheet, View } from "@react-pdf/renderer";
import PropTypes from "prop-types";
import RegistrationForm from "./Fileform";

// Standard PDF template styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    backgroundColor: "#E4E4E4",
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  logo: {
    width: 100,
    height: 50,
    marginBottom: 10,
  },
});

// Standard PDF template component
const PDFTemplate = ({ children }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Image style={styles.logo} src="/path/to/your/logo.png" />
        {children}
      </View>
    </Page>
  </Document>
);

PDFTemplate.propTypes = {
  children: PropTypes.node.isRequired, // Ensure children prop is provided and is a valid React node
};

// Component to render PDF
const PDFGenerator = () => {
  return (
    <PDFTemplate>
      {/* Your content component */}
      <RegistrationForm />
    </PDFTemplate>
  );
};

export default PDFGenerator;
