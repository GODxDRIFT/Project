// import React from "react";
// import {
//   Document,
//   Page,
//   Text,
//   View,
//   StyleSheet,
// } from "@react-pdf/renderer";

// // ----------- Styles -------------
// const styles = StyleSheet.create({
//   page: {
//     padding: 30,
//     fontSize: 11,
//     fontFamily: "Helvetica",
//     lineHeight: 1.6,
//     color: "#000",
//   },
//   header: {
//     textAlign: "center",
//     marginBottom: 10,
//   },
//   logo: {
//     fontSize: 18,
//     fontWeight: "bold",
//   },
//   logoHighlight: {
//     color: "#007BFF",
//   },
//   businessName: {
//     fontSize: 13,
//     fontWeight: "bold",
//     marginTop: 4,
//   },
//   contactDetails: {
//     fontSize: 10,
//   },
//   taxInvoice: {
//     fontSize: 14,
//     fontWeight: "bold",
//     marginVertical: 12,
//     textAlign: "center",
//     textDecoration: "underline",
//   },
//   line: {
//     borderBottomWidth: 1,
//     borderColor: "#000",
//     marginVertical: 8,
//   },
//   section: {
//     marginBottom: 10,
//   },
//   label: {
//     fontWeight: "bold",
//   },
//   tableRow: {
//     flexDirection: "row",
//     borderBottomWidth: 1,
//     borderColor: "#000",
//     paddingVertical: 4,
//     paddingHorizontal: 4,
//   },
//   tableHeader: {
//     fontWeight: "bold",
//     backgroundColor: "#f0f0f0",
//   },
//   tableCol1: {
//     width: "60%",
//   },
//   tableCol2: {
//     width: "40%",
//     textAlign: "right",
//   },
//   signatureSection: {
//     flexDirection: "row",
//     justifyContent: "flex-end",
//     marginTop: 40,
//   },
//   signature: {
//     fontSize: 10,
//     textAlign: "center",
//   },
//   footerText: {
//     marginTop: 30,
//     textAlign: "center",
//     fontStyle: "italic",
//     fontSize: 10,
//   },
// });

// // ----------- Component -------------
// const InvoicePDF = ({ plan }) => {
//   const gstRate = 18;
//   const baseAmount = plan?.planDetails?.price || 0;

//   const start = new Date(plan?.startDate);
//   const end = new Date(plan?.endDate);

//   const durationMonths =
//     (end.getFullYear() - start.getFullYear()) * 12 +
//     (end.getMonth() - start.getMonth()) || 1;

//   const amount = baseAmount * durationMonths;
//   const gstAmount = (amount * gstRate) / 100;
//   const total = amount + gstAmount;

//   const business = plan?.businessId?.businessDetails || {};
//   const address = [
//     business?.street,
//     business?.landmark,
//     business?.city,
//     business?.state,
//     business?.pinCode,
//   ]
//     .filter(Boolean)
//     .join(", ");

//   return (
//     <Document>
//       <Page size="A4" style={styles.page}>
//         {/* Header */}
//         <View style={styles.header}>
//           <Text style={styles.logo}>
//             Bizi<Text style={styles.logoHighlight}>ff</Text>y
//           </Text>
//           <Text style={styles.businessName}>Mediaman Advertising Pvt Ltd</Text>
//           <Text style={styles.contactDetails}>
//             SCO-93, 3rd Floor, Sector-7, Karnal, Haryana - 132002
//           </Text>
//           <Text style={styles.contactDetails}>GSTIN: 06ATFPK4500K2ZU</Text>
//           <Text style={styles.contactDetails}>
//             Phone: +91-97296 06097 | Email: support@biziffy.com
//           </Text>
//         </View>

//         {/* Invoice Title */}
//         <Text style={styles.taxInvoice}>TAX INVOICE</Text>
//         <View style={styles.line} />

//         {/* Customer Info */}
//         <View style={styles.section}>
//           <Text>
//             <Text style={styles.label}>Invoice To:</Text>{" "}
//             {business?.businessName || "-"}
//           </Text>
//           <Text>
//             <Text style={styles.label}>Invoice No:</Text>{" "}
//             {plan?.orderUniqueId || "-"}
//           </Text>
         
//           <Text>
//             <Text style={styles.label}>Start Date:</Text>{" "}
//             {start.toLocaleDateString("en-IN")}
//           </Text>
//           <Text>
//             <Text style={styles.label}>End Date:</Text>{" "}
//             {end.toLocaleDateString("en-IN")}
//           </Text>
//           <Text>
//             <Text style={styles.label}>GSTIN:</Text> {plan?.gstin || "NOT AVAILABLE"}
//           </Text>
//           <Text>
//             <Text style={styles.label}>Address:</Text> {address || "-"}
//           </Text>
//           <Text>
//             <Text style={styles.label}>Date:</Text>{" "}
//             {new Date(plan?.createdAt).toLocaleDateString("en-IN") || "-"}
//           </Text>
//         </View>

//         {/* Pricing Table */}
//         <View style={styles.section}>
//           <View style={[styles.tableRow, styles.tableHeader]}>
//             <Text style={styles.tableCol1}>Description</Text>
//             <Text style={styles.tableCol2}>Amount</Text>
//           </View>
//           <View style={styles.tableRow}>
//             <Text style={styles.tableCol1}>
//               {plan?.planDetails?.name} ({durationMonths} month
//               {durationMonths > 1 ? "s" : ""})
//             </Text>
//             <Text style={styles.tableCol2}>₹{amount.toFixed(2)}</Text>
//           </View>
//           <View style={styles.tableRow}>
//             <Text style={styles.tableCol1}>GST @ {gstRate}%</Text>
//             <Text style={styles.tableCol2}>₹{gstAmount.toFixed(2)}</Text>
//           </View>
//           <View style={styles.tableRow}>
//             <Text style={[styles.tableCol1, { fontWeight: "bold" }]}>
//               Total Amount
//             </Text>
//             <Text style={[styles.tableCol2, { fontWeight: "bold" }]}>
//               ₹{total.toFixed(2)}
//             </Text>
//           </View>
//         </View>

//         {/* Payment Info */}
//         <View style={styles.section}>
//           <Text>
//             <Text style={styles.label}>Payment Status:</Text>{" "}
//             {plan?.paymentStatus || "-"}
//           </Text>
//           <Text>
//             <Text style={styles.label}>Payment Method:</Text>{" "}
//             {plan?.paymentMethod || "-"}
//           </Text>
//         </View>

//         {/* Signature */}
//         <View style={styles.signatureSection}>
//           <Text style={styles.signature}>Auto Generated Invoice</Text>
//         </View>

//         {/* Footer */}
//         <Text style={styles.footerText}>Thank you for your business!</Text>
//       </Page>
//     </Document>
//   );
// };

// export default InvoicePDF;


import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

// Styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 11,
    fontFamily: "Helvetica",
    lineHeight: 1.6,
    color: "#000",
  },
  header: {
    textAlign: "center",
    marginBottom: 10,
  },
  logo: {
    fontSize: 18,
    fontWeight: "bold",
  },
  logoHighlight: {
    color: "#007BFF",
  },
  businessName: {
    fontSize: 13,
    fontWeight: "bold",
    marginTop: 4,
  },
  contactDetails: {
    fontSize: 10,
  },
  taxInvoice: {
    fontSize: 14,
    fontWeight: "bold",
    marginVertical: 12,
    textAlign: "center",
    textDecoration: "underline",
  },
  line: {
    borderBottomWidth: 1,
    borderColor: "#000",
    marginVertical: 8,
  },
  section: {
    marginBottom: 10,
  },
  label: {
    fontWeight: "bold",
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#000",
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  tableHeader: {
    fontWeight: "bold",
    backgroundColor: "#f0f0f0",
  },
  tableCol1: {
    width: "60%",
  },
  tableCol2: {
    width: "40%",
    textAlign: "right",
  },
  signatureSection: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 40,
  },
  signature: {
    fontSize: 10,
    textAlign: "center",
  },
  footerText: {
    marginTop: 30,
    textAlign: "center",
    fontStyle: "italic",
    fontSize: 10,
  },
});

const InvoicePDF = ({ plan }) => {
  const gstRate = 18;
  const baseAmount = plan?.planDetails?.price || 0;

  const start = new Date(plan?.startDate);
  const end = new Date(plan?.endDate);
  const createdAt = new Date(plan?.createdAt);

  const durationMonths =
    (end.getFullYear() - start.getFullYear()) * 12 +
    (end.getMonth() - start.getMonth()) || 1;

  const amount = baseAmount * durationMonths;
  const gstAmount = (amount * gstRate) / 100;
  const total = amount + gstAmount;

  const business = plan?.businessId?.businessDetails || {};
  const address = [
    business?.street,
    business?.landmark,
    business?.city,
    business?.state,
    business?.pinCode,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>
            Bizi<Text style={styles.logoHighlight}>ff</Text>y
          </Text>
          <Text style={styles.businessName}>Mediaman Advertising Pvt Ltd</Text>
          <Text style={styles.contactDetails}>
            SCO-93, 3rd Floor, Sector-7, Karnal, Haryana - 132002
          </Text>
          <Text style={styles.contactDetails}>GSTIN: 06ATFPK4500K2ZU</Text>
          <Text style={styles.contactDetails}>
            Phone: +91-97296 06097 | Email: support@biziffy.com
          </Text>
        </View>

        <Text style={styles.taxInvoice}>TAX INVOICE</Text>
        <View style={styles.line} />

        {/* Invoice Info Right Aligned */}
        <View style={[styles.section, styles.rowBetween]}>
          <View>
            <Text>
              <Text style={styles.label}>Invoice To:</Text>{" "}
              {business?.businessName || "-"}
            </Text>
            <Text>
              <Text style={styles.label}>GSTIN:</Text>{" "}
              {plan?.gstin || "NOT AVAILABLE"}
            </Text>
            <Text>
              <Text style={styles.label}>Address:</Text>{" "}
              {address || "-"}
            </Text>
          </View>

          <View style={{ alignItems: "flex-end" }}>
            <Text>
              <Text style={styles.label}>Invoice No:</Text>{" "}
              {plan?.orderUniqueId || "-"}
            </Text>
            <Text>
              <Text style={styles.label}>Date:</Text>{" "}
              {createdAt.toLocaleDateString("en-IN") || "-"}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text>
            <Text style={styles.label}>Plan:</Text>{" "}
            {plan?.planDetails?.name || "-"}
          </Text>
          <Text>
            <Text style={styles.label}>Start Date:</Text>{" "}
            {start.toLocaleDateString("en-IN")}
          </Text>
          <Text>
            <Text style={styles.label}>End Date:</Text>{" "}
            {end.toLocaleDateString("en-IN")}
          </Text>
        </View>

        {/* Table */}
        <View style={styles.section}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={styles.tableCol1}>Description</Text>
            <Text style={styles.tableCol2}>Amount</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCol1}>
              {plan?.planDetails?.name} ({durationMonths} month
              {durationMonths > 1 ? "s" : ""})
            </Text>
            <Text style={styles.tableCol2}>₹{amount.toFixed(2)}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCol1}>GST @ {gstRate}%</Text>
            <Text style={styles.tableCol2}>₹{gstAmount.toFixed(2)}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCol1, { fontWeight: "bold" }]}>
              Total Amount
            </Text>
            <Text style={[styles.tableCol2, { fontWeight: "bold" }]}>
              ₹{total.toFixed(2)}
            </Text>
          </View>
        </View> 

        {/* Payment Info */}
        <View style={styles.section}>
          <Text>
            <Text style={styles.label}>Payment Status:</Text>{" "}
            {plan?.paymentStatus || "-"}
          </Text>
          <Text>
            <Text style={styles.label}>Payment Method:</Text>{" "}
            {plan?.paymentMethod || "-"}
          </Text>
        </View>

        {/* Signature */}
        <View style={styles.signatureSection}>
          <Text style={styles.signature}>Auto Generated Invoice</Text>
        </View>

        {/* Footer */}
        <Text style={styles.footerText}>Thank you for your business!</Text>
      </Page>
    </Document>
  );
};

export default InvoicePDF;
