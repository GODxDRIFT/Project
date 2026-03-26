// import { useState, useEffect, useCallback } from "react";
// import { useNavigate } from "react-router-dom";
// import { AdminLayout } from "@/components/Layout/AdminLayout";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Pencil, Plus, Search, Trash2 } from "lucide-react";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { useToast } from "@/components/ui/use-toast";
// import * as XLSX from 'xlsx';
// import axios from "axios";
// import { getData, postData } from "@/services/FetchNodeServices";

// const AllPinCode = () => {
//     const [pinCodes, setPinCodes] = useState([]);
//     const [filteredPinCodes, setFilteredPinCodes] = useState([]);
//     const [searchTerm, setSearchTerm] = useState("");
//     const [loading, setLoading] = useState(false);
//     const [fileName, setFileName] = useState("");
//     const [file, setFile] = useState(null);
//     const [excelData, setExcelData] = useState([]);
//     const [excelLoading, setExcelLoading] = useState(false);
//     const [currentPage, setCurrentPage] = useState(1);
//     const [totalPages, setTotalPages] = useState(1);

//     const navigate = useNavigate();
//     const { toast } = useToast();


//     const fetchPinCodes = useCallback(
//         async (search = searchTerm, page = currentPage) => {
//             setLoading(true);
//             try {
//                 const url = `pincode/get-All-PinCodesWith-Pagination?search=${search || ""}&limit=${100}&page=${page}`;
//                 const res = await getData(url);

//                 if (res.status) {
//                     setPinCodes((prev) => (page === 1 ? res.data || [] : [...prev, ...(res.data || [])]));
//                     setTotalPages(res?.pagination?.totalPages || 1);
//                 } else {
//                     setPinCodes([]);
//                     setTotalPages(1);
//                     toast({ variant: "destructive", title: "Error", description: "Failed to load pinCodes." });
//                 }
//             } catch (error) {
//                 toast({ variant: "destructive", title: "Error", description: "Failed to load pinCodes." });
//                 console.error(error);
//             } finally {
//                 setLoading(false);
//             }
//         },
//         [searchTerm, currentPage]
//     );

//     // const fetchPinCodes = async () => {
//     //     setLoading(true);
//     //     try {
//     //         const response = await getData("pincode/get-all-pin-codes");
//     //         // console.log("GGGG=>", response?.pinCodes)
//     //         console.log('response', response.data.pinCodes);
//     //         if (response.status === true) {
//     //             // setPinCodes(response?.pinCodes)
//     //             setTotalPages(response?.pagination?.totalPages || 1);
//     //             setPinCodes((prev) => (currentPage === 1 ? response?.data?.pinCodes || [] : [...prev, ...(response?.data?.pinCodes || [])]));
//     //             setFilteredPinCodes(response?.pinCodes);
//     //             setLoading(false)
//     //         }
//     //     } catch (error) {
//     //         toast({ variant: "destructive", title: "Error", description: "Failed to load pinCodes." });
//     //     }
//     //     setLoading(false);
//     // };

//     useEffect(() => {
//         fetchPinCodes();
//     }, [currentPage]);


//     const handleInfiniteScroll = useCallback(() => {
//         if (
//             window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 &&
//             !loading &&
//             currentPage < totalPages
//         ) {
//             setCurrentPage((prev) => prev + 1);
//         }
//     }, [loading, currentPage, totalPages]);

//     useEffect(() => {
//         window.addEventListener("scroll", handleInfiniteScroll);
//         return () => window.removeEventListener("scroll", handleInfiniteScroll);
//     }, [handleInfiniteScroll]);


//     useEffect(() => {
//         if (searchTerm.trim()) {
//             setFilteredPinCodes(
//                 pinCodes.filter(c =>
//                     c.stateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                     c.area.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                     c.pinCode.toLowerCase().includes(searchTerm.toLowerCase())
//                 )
//             );
//         } else {
//             setFilteredPinCodes(pinCodes);
//         }
//     }, [searchTerm, pinCodes]);

//     const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         setSearchTerm(e.target.value);
//     };

//     const handleDelete = async (id: string) => {
//         if (!window.confirm("Are you sure you want to delete this city?")) return;
//         try {
//             await getData(`pincode/delete-Pincode/${id}`);
//             setPinCodes(prev => prev.filter(c => c._id !== id));
//             toast({ title: "Deleted", description: "PinCode deleted successfully." });
//         } catch (err) {
//             toast({ variant: "destructive", title: "Error", description: "Failed to delete pinCode." });
//         }
//     };

//     const handleEdit = (id: string) => {
//         navigate(`/admin/pincode/edit/${id}`);
//     };

//     //////////////////////////////////////////////////////////

//     const downloadCSV = () => {
//         const userAgent = window.navigator.userAgent;
//         let fileType = '';
//         let fileName = '';

//         if (userAgent.includes('Mac')) {
//             fileType = 'numbers';
//             fileName = 'All_PinCode.numbers';
//         } else if (userAgent.includes('Windows')) {
//             fileType = 'xlsx';
//             fileName = 'All_PinCode.xlsx';
//         } else {
//             fileType = 'xlsx';
//             fileName = 'All_PinCode.xlsx';
//         }

//         const link = document.createElement('a');
//         link.href = `https://admin.biziffy.com/images/${fileName}`;
//         link.download = fileName;
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);
//     };


//     // const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
//     //     const selectedFile = event.target.files?.[0];
//     //     if (!selectedFile) return;
//     //     console.log("GGG:==>", selectedFile)
//     //     setFile(selectedFile);
//     //     setFileName(selectedFile.name);

//     //     // Optional: preview first sheet
//     //     const reader = new FileReader();
//     //     reader.onload = (e) => {
//     //         const data = new Uint8Array(e.target?.result as ArrayBuffer);
//     //         const workbook = XLSX.read(data, { type: "array" });
//     //         const sheet = workbook.Sheets[workbook.SheetNames[0]];
//     //         const jsonData = XLSX.utils.sheet_to_json(sheet);
//     //         setExcelData(jsonData);
//     //     };
//     //     reader.readAsArrayBuffer(selectedFile);
//     // };

//     // // Submit to backend
//     // const handleSubmitExcel = async () => {
//     //     if (!file) {
//     //         toast({
//     //             variant: "destructive",
//     //             title: "No file",
//     //             description: "Please upload a valid Excel file first.",
//     //         });
//     //         return;
//     //     }

//     //     try {
//     //         setExcelLoading(true);
//     //         const formData = new FormData();
//     //         formData.append("file", file);

//     //         const response = await axios.post("https://api.biziffy.com/api/pincode/create-pincode-by-excel", formData);

//     //         const { status, createdCount, duplicateCount, invalidCount, message } = response.data;

//     //         if (status) {
//     //             toast({
//     //                 title: "Upload Completed",
//     //                 description: `${createdCount} created, ${duplicateCount} duplicates, ${invalidCount} invalid.`,
//     //             });
//     //             setExcelData([]);
//     //             setFileName("");
//     //             setFile(null);
//     //             fetchPinCodes?.();

//     //             // also clear file input (important!)
//     //             const fileInput = document.getElementById("excel-file") as HTMLInputElement;
//     //             if (fileInput) fileInput.value = "";
//     //         } else {
//     //             toast({
//     //                 variant: "destructive",
//     //                 title: "Upload Failed",
//     //                 description: message || "Something went wrong.",
//     //             });
//     //         }
//     //     } catch (error: any) {
//     //         console.error("Excel submission failed", error);
//     //         toast({
//     //             variant: "destructive",
//     //             title: "Error",
//     //             description: error.response?.data?.message || "Unexpected error while uploading.",
//     //         });
//     //     } finally {
//     //         setExcelLoading(false);
//     //     }
//     // };

//     //     const handleFileUpload = (event) => {
//     //         const file = event.target.files[0];
//     //         if (!file) return;

//     //         setFileName(file.name);

//     //         const reader = new FileReader();
//     //         reader.onload = (e) => {
//     //             try {
//     //                 const data = new Uint8Array(e.target.result as ArrayBuffer)
//     //                 const workbook = XLSX.read(data, { type: "array" });
//     //                 const sheet = workbook.Sheets[workbook.SheetNames[0]];
//     //                 const jsonData = XLSX.utils.sheet_to_json(sheet);
//     //                 setExcelData(jsonData);
//     //             } catch (error) {
//     //                 console.error("Error parsing Excel file", error);
//     //                 // Optionally show toast: toast.error("Invalid Excel format");
//     //             }
//     //         };
//     //         reader.readAsArrayBuffer(file);
//     //     };


//     //     // // console.log("excelData:---", excelData)

//     //     const handleSubmitExcel = async () => {
//     //         try {
//     //             if (!excelData || excelData.length === 0) {
//     //                 toast({ variant: "destructive", title: "No data", description: "Please upload a valid Excel file first.", });
//     //                 return;
//     //             }

//     //             setExcelLoading(true);
//     //             console.log('SSSSSSSS;;:=>', excelData)
//     // // https://api.biziffy.com
//     //             const response = await axios.post("http://localhost:18001/api/pincode/create-pincode-by-excel", excelData);
//     //             const { status, created, duplicates, invalid, createdCount, duplicateCount, invalidCount } = response?.data;

//     //             if (status === true) {
//     //                 if (createdCount > 0) {
//     //                     toast({ title: "Success", description: `${createdCount} PinCodes created successfully.`, });
//     //                 }

//     //                 if (duplicateCount > 0) {
//     //                     toast({
//     //                         variant: "destructive",
//     //                         title: "Duplicates Skipped",
//     //                         description: `${duplicateCount} duplicate records found.`,
//     //                     });
//     //                 }

//     //                 if (invalidCount > 0) {
//     //                     const invalidPreview = invalid.slice(0, 3).map(i => `${i["Area Name"]} (${i.reason})`).join(", ");
//     //                     toast({
//     //                         variant: "destructive",
//     //                         title: "Invalid Records",
//     //                         description: `${invalidCount} invalid entries found. Example: ${invalidPreview}${invalidCount > 3 ? '...' : ''}`,
//     //                     });
//     //                 }

//     //                 // Optional: Reset UI
//     //                 setExcelData([]);
//     //                 setFileName("");
//     //                 fetchPinCodes?.(); // If defined, refresh the list
//     //             } else {
//     //                 toast({
//     //                     variant: "destructive",
//     //                     title: "Submission Failed",
//     //                     description: response?.data?.message || "Something went wrong.",
//     //                 });
//     //             }
//     //         } catch (error) {
//     //             console.error("Excel submission failed", error);
//     //             toast({
//     //                 variant: "destructive",
//     //                 title: "Error",
//     //                 description: "An unexpected error occurred while uploading the data.",
//     //             });
//     //         } finally {
//     //             setExcelLoading(false);
//     //         }
//     //     };


//     const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
//         const file = event.target.files?.[0];
//         if (!file) return;

//         setFileName(file.name);

//         const reader = new FileReader();
//         reader.onload = (e) => {
//             try {
//                 const data = new Uint8Array(e.target?.result as ArrayBuffer);
//                 const workbook = XLSX.read(data, { type: "array" });
//                 const sheet = workbook.Sheets[workbook.SheetNames[0]];
//                 const jsonData = XLSX.utils.sheet_to_json(sheet, { defval: "" }); // ✅ keep empty cells as ""
//                 setExcelData(jsonData);
//             } catch (error) {
//                 console.error("Error parsing Excel file", error);
//                 toast({
//                     variant: "destructive",
//                     title: "Invalid File",
//                     description: "Please upload a valid Excel file.",
//                 });
//             }
//         };
//         reader.readAsArrayBuffer(file);
//     };

//     const handleSubmitExcel = async () => {
//         try {
//             if (!excelData || excelData.length === 0) {
//                 toast({
//                     variant: "destructive",
//                     title: "No Data",
//                     description: "Please upload a valid Excel file first.",
//                 });
//                 return;
//             }

//             setExcelLoading(true);

//             // ✅ POST with explicit headers & larger limit
//             const response = await postData("pincode/create-pincode-by-excel", excelData,
//                 {
//                     headers: { "Content-Type": "application/json" },
//                     maxBodyLength: Infinity, maxContentLength: Infinity,
//                 }
//             );

//             const { status, createdCount, duplicateCount, invalidCount, invalid = [], } = response?.data || {};

//             if (status) {
//                 if (createdCount > 0) {
//                     toast({
//                         title: "Success",
//                         description: `${createdCount} PinCodes created successfully.`,
//                     });
//                 }
//                 if (duplicateCount > 0) {
//                     toast({
//                         variant: "destructive",
//                         title: "Duplicates Skipped",
//                         description: `${duplicateCount} duplicate records found.`,
//                     });
//                 }
//                 if (invalidCount > 0) {
//                     const invalidPreview = invalid
//                         .slice(0, 3)
//                         .map((i: any) => `${i["Area Name"]} (${i.reason})`)
//                         .join(", ");
//                     toast({
//                         variant: "destructive",
//                         title: "Invalid Records",
//                         description: `${invalidCount} invalid entries. Example: ${invalidPreview}${invalidCount > 3 ? "..." : ""
//                             }`,
//                     });
//                 }

//                 // ✅ Reset UI
//                 setExcelData([]);
//                 setFileName("");
//                 fetchPinCodes?.();
//             } else {
//                 toast({
//                     variant: "destructive",
//                     title: "Failed",
//                     description: response?.data?.message || "Something went wrong.",
//                 });
//             }
//         } catch (error: any) {
//             console.error("Excel submission failed:", error?.response || error?.message);
//             toast({
//                 variant: "destructive", title: "Error", description: error?.response?.data?.message || "An unexpected error occurred while uploading the data.",
//             });
//         } finally {
//             setExcelLoading(false);
//         }
//     };


//     ////////////////////////////////////////////////////////////////////////////////////

//     const downloadAllPinCodeCSV = async () => {
//         if (!filteredPinCodes || filteredPinCodes.length === 0) {
//             toast({
//                 variant: "destructive",
//                 title: "No Data",
//                 description: "There are no pinCodes to export.",
//             });
//             return;
//         }

//         try {
//             const exportData = filteredPinCodes.map(p => ({
//                 "State Name": p.stateName,
//                 "Area Name": p.area,
//                 "Pin Code": p.pinCode,
//                 "Status": p.isActive ? "Active" : "Inactive",
//             }));

//             const worksheet = XLSX.utils.json_to_sheet(exportData);

//             // Make headers bold
//             const headerStyle = {
//                 font: { bold: true },
//             };

//             const headerKeys = Object.keys(exportData[0]);

//             headerKeys.forEach((key, index) => {
//                 const cellAddress = XLSX.utils.encode_cell({ c: index, r: 0 }); // row 0 is header
//                 if (!worksheet[cellAddress]) return;
//                 if (!worksheet[cellAddress].s) worksheet[cellAddress].s = {};
//                 worksheet[cellAddress].s = headerStyle;
//             });

//             const workbook = XLSX.utils.book_new();
//             XLSX.utils.book_append_sheet(workbook, worksheet, "PinCodes");

//             // Enable styles (requires writeFile or write with cellStyles)
//             const excelBuffer = XLSX.write(workbook, {
//                 bookType: 'xlsx',
//                 type: 'array',
//                 cellStyles: true, // This helps in some cases
//             });

//             const dataBlob = new Blob([excelBuffer], { type: "application/octet-stream" });
//             const url = window.URL.createObjectURL(dataBlob);
//             const link = document.createElement("a");
//             link.href = url;
//             link.setAttribute("download", "All_PinCodes.xlsx");
//             document.body.appendChild(link);
//             link.click();
//             document.body.removeChild(link);
//             window.URL.revokeObjectURL(url);
//         } catch (error) {
//             console.error("Download failed", error);
//             toast({
//                 variant: "destructive",
//                 title: "Error",
//                 description: "Failed to download Excel file.",
//             });
//         }
//     };
//     //////////////////////////////////////////////////////////////////////////////////////
//     return (
//         <AdminLayout title="All PinCode">
//             <div className="flex flex-col gap-5">
//                 <div className="flex justify-between items-center">
//                     <h1 className="text-2xl font-bold">Manage PinCode</h1>
//                     <Button onClick={() => navigate("/admin/pincode/create")}>
//                         <Plus className="h-4 w-4 mr-2" />
//                         Add New PinCode
//                     </Button>
//                 </div>

//                 <Card>
//                     <CardHeader>
//                         <div className="flex flex-col md:flex-row gap-4 justify-between">
//                             <CardTitle>All pinCode</CardTitle>
//                             <div style={{ display: "flex", gap: "10px" }}>
//                                 {/* Search Input */}
//                                 <div className="relative w-full max-w-sm">
//                                     <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
//                                     <Input
//                                         type="search"
//                                         placeholder="Search pinCode..."
//                                         className="pl-8"
//                                         value={searchTerm}
//                                         onChange={handleSearchChange}
//                                     />
//                                 </div>

//                                 {/* Conditional Upload/Download Buttons */}
//                                 {excelData.length === 0 && (
//                                     <>
//                                         {/* Download Button */}
//                                         <div className="w-full max-w-sm">
//                                             <Button
//                                                 onClick={downloadCSV}
//                                                 className="w-full bg-green-600 hover:bg-green-700 text-white"
//                                             >
//                                                 <Plus className="h-4 w-4 mr-2" />
//                                                 Download Excel
//                                             </Button>
//                                         </div>

//                                         {/* Upload Button */}
//                                         <div className="w-full max-w-sm relative">
//                                             <label className="w-full inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded cursor-pointer">
//                                                 <Plus className="h-4 w-4 mr-2" />
//                                                 Upload Excel
//                                                 <input
//                                                     type="file"
//                                                     accept=".xlsx, .xls"
//                                                     hidden
//                                                     onChange={handleFileUpload}
//                                                 />
//                                             </label>
//                                         </div>
//                                     </>
//                                 )}
//                                 <div className="w-full max-w-sm">
//                                     <Button
//                                         onClick={downloadAllPinCodeCSV}
//                                         className="w-full bg-green-600 hover:bg-green-700 text-white"
//                                     >
//                                         <Plus className="h-4 w-4 mr-2" />
//                                         Download All PinCode In Excel
//                                     </Button>
//                                 </div>

//                                 {/* Uploaded File Name */}
//                                 {fileName && (
//                                     <div className="w-full">
//                                         <p className="text-sm text-gray-700">📄 Uploaded File: <strong>{fileName}</strong></p>
//                                     </div>
//                                 )}

//                                 {/* Submit Button when Excel Data is loaded */}
//                                 {excelData.length > 0 && (
//                                     <div className="w-full max-w-sm">
//                                         <button
//                                             disabled={excelLoading}
//                                             onClick={handleSubmitExcel}
//                                             className={`w-full inline-flex items-center justify-center py-2 px-4 rounded text-white font-medium ${excelLoading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
//                                                 }`}
//                                         >
//                                             {excelLoading ? "Uploading..." : "Submit"}
//                                         </button>
//                                     </div>
//                                 )}
//                             </div>
//                         </div>
//                     </CardHeader>
//                     <CardContent>
//                         {loading ? (
//                             <div className="text-center py-4">Loading pinCode...</div>
//                         ) : (
//                             <div className="rounded-md border overflow-x-auto">
//                                 <Table>
//                                     <TableHeader>
//                                         <TableRow>
//                                             <TableHead>State</TableHead>
//                                             <TableHead>Aria Name</TableHead>
//                                             <TableHead>Pin Code</TableHead>
//                                             <TableHead>Status</TableHead>
//                                             <TableHead className="text-right">Actions</TableHead>
//                                         </TableRow>
//                                     </TableHeader>
//                                     <TableBody>
//                                         {filteredPinCodes?.length > 0 ? (
//                                             filteredPinCodes?.map((c) => (
//                                                 <TableRow key={c?._id}>

//                                                     <TableCell>{c?.stateName}</TableCell>
//                                                     <TableCell>{c?.area}</TableCell>
//                                                     <TableCell>{c?.pinCode || "—"}</TableCell>

//                                                     <TableCell>
//                                                         <span
//                                                             className={`px-2 py-1 rounded-full text-xs ${c?.isActive
//                                                                 ? "bg-green-100 text-green-800"
//                                                                 : "bg-red-100 text-red-800"
//                                                                 }`}
//                                                         >
//                                                             {c?.isActive ? "Active" : "Inactive"}
//                                                         </span>
//                                                     </TableCell>
//                                                     <TableCell className="text-right">
//                                                         <div className="flex justify-end gap-2">
//                                                             <Button size="sm" variant="outline" onClick={() => handleEdit(c?._id)}>
//                                                                 <Pencil className="h-4 w-4" />
//                                                             </Button>
//                                                             <Button size="sm" variant="destructive" onClick={() => handleDelete(c?._id)}>
//                                                                 <Trash2 className="h-4 w-4" />
//                                                             </Button>
//                                                         </div>
//                                                     </TableCell>
//                                                 </TableRow>
//                                             ))
//                                         ) : (
//                                             <TableRow>
//                                                 <TableCell colSpan={7} className="h-24 text-center">
//                                                     No pinCodes found.
//                                                 </TableCell>
//                                             </TableRow>
//                                         )}
//                                     </TableBody>
//                                 </Table>
//                             </div>
//                         )}
//                     </CardContent>
//                 </Card>
//             </div>
//         </AdminLayout>
//     );
// };

// export default AllPinCode;


import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { AdminLayout } from "@/components/Layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Plus, Search, Trash2, Download, Upload } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import * as XLSX from 'xlsx';
import { getData, postData } from "@/services/FetchNodeServices";
import { debounce } from "lodash";

const AllPinCode = () => {
    const [pinCodes, setPinCodes] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);
    const [fileName, setFileName] = useState("");
    const [file, setFile] = useState(null);
    const [excelData, setExcelData] = useState([]);
    const [excelLoading, setExcelLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const navigate = useNavigate();
    const { toast } = useToast();

    // Debounced search function
    const debouncedSearch = useCallback(
        debounce((searchValue: string) => {
            setCurrentPage(1);
            fetchPinCodes(searchValue, 1);
        }, 500),
        []
    );

    const fetchPinCodes = async (search = "", page = 1) => {
        setLoading(true);
        try {
            const url = `pincode/get-All-PinCodesWith-Pagination?search=${search}&limit=800&page=${page}`;
            const res = await getData(url);
            console.log('re===>>s', res)
            if (res.status) {
                if (page === 1) {
                    setPinCodes(res.pinCodes || []);
                } else {
                    setPinCodes(prev => [...prev, ...(res.pinCodes || [])]);
                }
                setTotalPages(res?.pagination?.totalPages || 1);
                // setHasMore(page < (res?.pagination?.totalPages || 1));
            } else {
                if (page === 1) setPinCodes([]);
                toast({ variant: "destructive", title: "Error", description: "Failed to load pinCodes." });
            }
        } catch (error) {
            if (page === 1) setPinCodes([]);
            toast({ variant: "destructive", title: "Error", description: "Failed to load pinCodes." });
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPinCodes(searchTerm, currentPage);
    }, [currentPage]);

    useEffect(() => {
        debouncedSearch(searchTerm);
        return () => debouncedSearch.cancel();
    }, [searchTerm, debouncedSearch]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleInfiniteScroll = useCallback(() => {
    if (
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 &&
      !loading &&
      currentPage < totalPages
    ) {
      setCurrentPage((prev) => prev + 1);
    }
  }, [loading, currentPage, totalPages]);

  useEffect(() => {
    // window.addEventListener("scroll", handleInfiniteScroll);
    // return () => window.removeEventListener("scroll", handleInfiniteScroll);
    handleInfiniteScroll()
  }, [handleInfiniteScroll]);

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this pin code?")) return;
        try {
            await getData(`pincode/delete-Pincode/${id}`);
            setPinCodes(prev => prev.filter(c => c._id !== id));
            toast({ title: "Deleted", description: "PinCode deleted successfully." });
        } catch (err) {
            toast({ variant: "destructive", title: "Error", description: "Failed to delete pinCode." });
        }
    };

    const handleEdit = (id: string) => {
        navigate(`/admin/pincode/edit/${id}`);
    };

    const downloadCSV = () => {
        const userAgent = window.navigator.userAgent;
        let fileType = '';
        let fileName = '';

        if (userAgent.includes('Mac')) {
            fileType = 'numbers';
            fileName = 'All_PinCode.numbers';
        } else if (userAgent.includes('Windows')) {
            fileType = 'xlsx';
            fileName = 'All_PinCode.xlsx';
        } else {
            fileType = 'xlsx';
            fileName = 'All_PinCode.xlsx';
        }

        const link = document.createElement('a');
        link.href = `https://admin.biziffy.com/images/${fileName}`;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };


    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setFileName(file.name);
        setFile(file);

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target?.result as ArrayBuffer);
                const workbook = XLSX.read(data, { type: "array" });
                const sheet = workbook.Sheets[workbook.SheetNames[0]];
                const jsonData = XLSX.utils.sheet_to_json(sheet, { defval: "" });
                setExcelData(jsonData);
            } catch (error) {
                toast({
                    variant: "destructive",
                    title: "Invalid File",
                    description: "Please upload a valid Excel file.",
                });
            }
        };
        reader.readAsArrayBuffer(file);
    };

    const handleSubmitExcel = async () => {
        if (!excelData || excelData.length === 0) {
            toast({
                variant: "destructive",
                title: "No Data",
                description: "Please upload a valid Excel file first.",
            });
            return;
        }

        setExcelLoading(true);
        try {
            const response = await postData("pincode/create-pincode-by-excel", excelData);
            console.log("response:==>", response)
            const { status, createdCount, duplicateCount, invalidCount, invalid = [] } = response || {};

            if (status) {
                let description = "";
                if (createdCount > 0) description += `${createdCount} created. `;
                if (duplicateCount > 0) description += `${duplicateCount} duplicates skipped. `;
                if (invalidCount > 0) description += `${invalidCount} invalid entries.`;

                toast({
                    title: "Upload Completed",
                    description,
                });

                setExcelData([]);
                setFileName("");
                setFile(null);
                fetchPinCodes(searchTerm, currentPage);

                // Clear file input
                const fileInput = document.getElementById("excel-file") as HTMLInputElement;
                if (fileInput) fileInput.value = "";
            } else {
                toast({
                    variant: "destructive",
                    title: "Upload Failed",
                    description: response?.data?.message || "Something went wrong.",
                });
            }
        } catch (error: any) {
            console.error("Excel submission failed:", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: error?.response?.data?.message || "An unexpected error occurred.",
            });
        } finally {
            setExcelLoading(false);
        }
    };

    const downloadAllPinCodeCSV = () => {
        if (!pinCodes || pinCodes.length === 0) {
            toast({
                variant: "destructive",
                title: "No Data",
                description: "There are no pinCodes to export.",
            });
            return;
        }

        try {
            const exportData = pinCodes.map(p => ({
                "State Name": p.stateName,
                "Area Name": p.area,
                "Pin Code": p.pinCode,
                "Status": p.isActive ? "Active" : "Inactive",
            }));

            const worksheet = XLSX.utils.json_to_sheet(exportData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "PinCodes");

            XLSX.writeFile(workbook, "All_PinCodes.xlsx");
        } catch (error) {
            console.error("Download failed", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to download Excel file.",
            });
        }
    };

    return (
        <AdminLayout title="All PinCode">
            <div className="flex flex-col gap-5">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Manage PinCode</h1>
                    <Button onClick={() => navigate("/admin/pincode/create")}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add New PinCode
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                            <CardTitle>All Pin Codes</CardTitle>
                            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                                <div className="relative w-full sm:w-64">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                                    <Input
                                        type="search"
                                        placeholder="Search pin codes..."
                                        className="pl-8"
                                        value={searchTerm}
                                        onChange={handleSearchChange}
                                    />
                                </div>

                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        onClick={downloadCSV}
                                        className="flex items-center"
                                    >
                                        <Download className="h-4 w-4 mr-2" />
                                        Sample
                                    </Button>

                                    <label className="inline-flex items-center justify-center bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md text-sm font-medium cursor-pointer">
                                        <Upload className="h-4 w-4 mr-2" />
                                        Upload Excel
                                        <input
                                            id="excel-file"
                                            type="file"
                                            accept=".xlsx, .xls"
                                            hidden
                                            onChange={handleFileUpload}
                                        />
                                    </label>

                                    <Button
                                        onClick={downloadAllPinCodeCSV}
                                        className="bg-green-600 hover:bg-green-700"
                                    >
                                        <Download className="h-4 w-4 mr-2" />
                                        Export
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {fileName && (
                            <div className="mt-2">
                                <p className="text-sm text-gray-700">
                                    📄 Selected File: <strong>{fileName}</strong>
                                    {excelData.length > 0 && (
                                        <span className="ml-2 text-green-600">({excelData.length} records found)</span>
                                    )}
                                </p>
                            </div>
                        )}

                        {excelData.length > 0 && (
                            <div className="mt-3">
                                <Button
                                    onClick={handleSubmitExcel}
                                    disabled={excelLoading}
                                    className="w-full md:w-auto"
                                >
                                    {excelLoading ? "Processing..." : `Import ${excelData.length} Records`}
                                </Button>
                            </div>
                        )}
                    </CardHeader>

                    <CardContent>
                        <div className="rounded-md border overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>State</TableHead>
                                        <TableHead>Area Name</TableHead>
                                        <TableHead>Pin Code</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {pinCodes.length > 0 ? (
                                        pinCodes.map((c) => (
                                            <TableRow key={c._id}>
                                                <TableCell className="font-medium">{c.stateName}</TableCell>
                                                <TableCell>{c.area}</TableCell>
                                                <TableCell>{c.pinCode || "—"}</TableCell>
                                                <TableCell>
                                                    <span
                                                        className={`px-2 py-1 rounded-full text-xs ${c.isActive
                                                            ? "bg-green-100 text-green-800"
                                                            : "bg-red-100 text-red-800"
                                                            }`}
                                                    >
                                                        {c.isActive ? "Active" : "Inactive"}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => handleEdit(c._id)}
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="destructive"
                                                            onClick={() => handleDelete(c._id)}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={5} className="h-24 text-center">
                                                {loading ? "Loading pin codes..." : "No pin codes found."}
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        {loading && pinCodes.length > 0 && (
                            <div className="text-center py-4">Loading more pin codes...</div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
};

export default AllPinCode;
