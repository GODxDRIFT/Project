"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { getData, postData } from "../../services/FetchNodeServices";
import { AdminLayout } from "@/components/Layout/AdminLayout";
import Swal from "sweetalert2";

const CorporateAdvertiseEnquiries = () => {
    const [enquiries, setEnquiries] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedId, setSelectedId] = useState(null);
    const [selectedEnquiry, setSelectedEnquiry] = useState(null);
    const [bulkAction, setBulkAction] = useState("Bulk Action");

    const enquiriesPerPage = 7;

    useEffect(() => {
        (async () => {
            try {
                const data = await getData("corporateAdvertise/get-all-corporates")
                if (data?.status === true) {
                    setEnquiries(data?.data || []);
                }
            } catch (error) {
                console.error("Failed to load enquiries:", error);
            }
        })();
    }, []);

    const filtered = enquiries.filter((e) =>
        Object.values(e).some((val) =>
            String(val).toLowerCase().includes(searchQuery.toLowerCase())
        )
    );

    const totalPages = Math.ceil(filtered.length / enquiriesPerPage);
    const indexOfLast = currentPage * enquiriesPerPage;
    const indexOfFirst = indexOfLast - enquiriesPerPage;
    const current = filtered.slice(indexOfFirst, indexOfLast);

    const paginate = (page) => setCurrentPage(page);

    const exportToCSV = () => {
        const headers = ["ID", "User ID", "Full Name", "Email", "Phone", "Box Type", "Business Name", "Message"];
        const rows = filtered.map((e) => [
            e._id || "-",
            e.userId || "-",
            `${e.firstName || ""} ${e.lastName || ""}`.trim(),
            e.email || "-",
            e.phone || "-",
            e.boxType || "-",
            e.businessName || "-",
            e.message || "-",
        ]);
        const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
        const blob = new Blob([csv], { type: "text/csv" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "corporate-enquiries.csv";
        a.click();
    };

    const handleSelect = (id, enquiry) => {
        setSelectedId(selectedId === id ? null : id);
        setSelectedEnquiry(selectedId === id ? null : enquiry);
    };

    const handleBulkAction = async () => {
        if (!selectedId || bulkAction === "Bulk Action" || !selectedEnquiry) return;

        try {
            const res = await postData(`corporates/send-user-enquiry-for-vendor/${selectedId}`, {
                action: bulkAction,
                data: selectedEnquiry,
            });

            if (res?.status === true) {
                Swal.fire("Success", res?.message, "success");
            } else {
                Swal.fire("Error", res?.message || "Something went wrong", "error");
            }
        } catch (err) {
            console.error("Bulk Action Error:", err);
        }
    };

    const renderPageNumbers = () => {
        const maxVisible = 4;
        let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
        let end = Math.min(totalPages, start + maxVisible - 1);
        if (end - start + 1 < maxVisible) start = Math.max(1, end - maxVisible + 1);
        return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    };

    return (
        <AdminLayout>
            <div className="p-6 space-y-4">
                <h1 className="text-2xl font-bold">Corporate Advertise Enquiries</h1>

                <div className="flex flex-wrap justify-between gap-3 items-center">
                    <div className="flex items-center gap-2">
                        {/* <select
              className="px-4 py-2 border rounded-md"
              value={bulkAction}
              onChange={(e) => setBulkAction(e.target.value)}
            >
              <option value="Bulk Action">Bulk Action</option>
              <option value="Free">Free</option>
              <option value="Standard">Standard</option>
              <option value="Premium">Premium</option>
            </select>

            <Button
              className="bg-blue-500 hover:bg-blue-600"
              onClick={handleBulkAction}
              disabled={!selectedId}
            >
              {selectedId ? "Send" : "Select Enquiry"}
            </Button> */}

                        <Button
                            className="bg-green-500 hover:bg-green-600"
                            onClick={exportToCSV}
                        >
                            Export CSV
                        </Button>
                    </div>

                    <Input
                        placeholder="Search enquiries..."
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="w-64"
                    />
                </div>

                <div className="overflow-x-auto border rounded-md">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Business</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Box Type</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Message</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {current.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="text-center py-4 text-gray-500">No enquiries found.</td>
                                </tr>
                            ) : (
                                current.map((enquiry, index) => (
                                    <tr
                                        key={enquiry?._id}
                                        className={`hover:bg-gray-50 ${selectedId === enquiry?._id ? "bg-blue-50" : ""}`}
                                    >
                                        {/* <td className="px-4 py-2">
                      <input
                        type="checkbox"
                        className="h-4 w-4"
                        checked={selectedId === enquiry?._id}
                        onChange={() => handleSelect(enquiry?._id, enquiry)}
                      />
                    </td> */}
                                        <td className="px-4 py-2">{indexOfFirst + index + 1}</td>
                                        <td className="px-4 py-2">{`${enquiry?.firstName || ""} ${enquiry?.lastName || ""}`}</td>
                                        <td className="px-4 py-2">{enquiry?.email || "-"}</td>
                                        <td className="px-4 py-2">{enquiry?.phone || "-"}</td>
                                        <td className="px-4 py-2">{enquiry?.businessName || "-"}</td>
                                        <td className="px-4 py-2">{enquiry?.boxType || "-"}</td>
                                        <td className="px-4 py-2">{enquiry?.message || "-"}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {totalPages > 1 && (
                    <div className="pt-4 flex justify-end">
                        <Pagination>
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious
                                        href="#"
                                        onClick={() => paginate(Math.max(currentPage - 1, 1))}
                                    />
                                </PaginationItem>
                                {renderPageNumbers().map((num) => (
                                    <PaginationItem key={num}>
                                        <PaginationLink
                                            href="#"
                                            onClick={() => paginate(num)}
                                            isActive={num === currentPage}
                                        >
                                            {num}
                                        </PaginationLink>
                                    </PaginationItem>
                                ))}
                                <PaginationItem>
                                    <PaginationNext
                                        href="#"
                                        onClick={() => paginate(Math.min(currentPage + 1, totalPages))}
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default CorporateAdvertiseEnquiries;
