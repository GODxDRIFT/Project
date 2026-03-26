

"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, } from "@/components/ui/pagination";
import { getData, postData } from "../../services/FetchNodeServices";
import { AdminLayout } from "@/components/Layout/AdminLayout";
import Swal from "sweetalert2";

const Enquiries = () => {
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedEnquiry, setSelectedEnquiry] = useState<any | null>(null);
  const [bulkAction, setBulkAction] = useState("Bulk Action");
  const [formData, setFormData] = useState('')
  const enquiriesPerPage = 7;

  useEffect(() => {
    (async () => {
      try {
        const data = await getData("enquiries");
        setEnquiries(data || []);
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

  const paginate = (page: number) => setCurrentPage(page);

  const exportToCSV = () => {
    const headers = ["ID", "User Name", "Name", "Phone", "Requirement"];
    const rows = filtered.map((e: any) => [
      e._id,
      e.user?.fullName || "-",
      e.name || "-",
      e.phone || "-",
      e.requirement || "-",
    ]);
    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "enquiries.csv";
    a.click();
  };

  const handleSelect = (id: string, enquiry: any) => {
    if (selectedId === id) {
      setSelectedId(null);
      setSelectedEnquiry(null);
    } else {
      setSelectedId(id);
      setSelectedEnquiry(enquiry);
    }
  };

  const handleBulkAction = async () => {
    if (!selectedId || bulkAction === "Bulk Action" || !selectedEnquiry) return;
    try {
      const res = await postData(`enquiries/send-user-enquiry-for-vendor/${selectedId}`, {
        category: [selectedEnquiry?.category],
        action: bulkAction,
        data: selectedEnquiry,
      });
      if (res?.status === true) {
        Swal.fire("Success", res?.message, "success");
        // console.log("Response:", res);
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
  console.log("GGGGGG:==>", current)
  return (
    <AdminLayout>
      <div className="p-6 space-y-4">
        <h1 className="text-2xl font-bold">All Enquiries</h1>

        <div className="flex flex-wrap justify-between gap-3 items-center">
          <div className="flex items-center gap-2">
            <select
              className="px-4 py-2 border rounded-md"
              value={bulkAction}
              onChange={(e) => setBulkAction(e.target.value)}
            >
              <option value="Bulk Action">Bulk Action</option>
              {/* <option value="Delete">Delete</option> */}
              <option value="Free">Free</option>
              <option value="Standard">Standard</option>
              <option value="Premium">Premium</option>
            </select>

            <Button
              className="bg-blue-500 hover:bg-blue-600"
              onClick={handleBulkAction}
              disabled={!selectedId}
            >
              {selectedId ? (bulkAction === "Delete" ? "Delete" : "Send") : "Select Enquiry"}
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
                <th className="px-4 py-3"></th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Requirement</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mantion</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {current?.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-4 text-gray-500">No enquiries found.</td>
                </tr>
              ) : (
                current?.map((enquiry: any, index: number) => (
                  <tr
                    key={enquiry?._id}
                    className={`hover:bg-gray-50 ${selectedId === enquiry?._id ? "bg-blue-50" : ""}`}
                  >
                    <td className="px-4 py-2">
                      <input
                        type="checkbox"
                        className="h-4 w-4"
                        checked={selectedId === enquiry?._id}
                        onChange={() => handleSelect(enquiry?._id, enquiry)}
                      />
                    </td>
                    <td className="px-4 py-2">{indexOfFirst + index + 1}</td>
                    <td className="px-4 py-2">{enquiry?.user?.fullName || "-"}</td>
                    <td className="px-4 py-2">{enquiry?.user?.email || "-"}</td>
                    <td className="px-4 py-2">{enquiry?.phone}</td>
                    <td className="px-4 py-2">{enquiry?.category}</td>
                    <td className="px-4 py-2 max-w-lg">{enquiry?.requirement || enquiry?.name}</td>
                    <td className="px-4 py-2 max-w-lg">  {enquiry?.planSentTo?.length > 0 ? enquiry.planSentTo.join(", ") : "-"}</td>
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

export default Enquiries;
