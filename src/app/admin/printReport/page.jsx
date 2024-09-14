// UserReportPDF.jsx
import React from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#E4E4E4",
    padding: 20,
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
  },
  text: {
    fontSize: 12,
  },
});

const UserReportPDF = ({ userReportData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.title}>User Report</Text>
        <Text style={styles.text}>Name: {userReportData.name}</Text>
        <Text style={styles.text}>MUJid: {userReportData.mujid}</Text>
        <Text style={styles.text}>
          Form Status: {userReportData.isFormFilled ? "Filled" : "Not Filled"}
        </Text>
        {/* Add more user details as needed */}
      </View>
    </Page>
  </Document>
);

export default UserReportPDF;
