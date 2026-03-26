"use client";

import { useEffect, useMemo, useState } from "react";
import { AdminLayout } from "@/components/Layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Search, Download, Trash2, Mail } from "lucide-react";
import { getData, postData } from "../../services/FetchNodeServices";
import { Dialog, DialogContent, DialogHeader, DialogTitle, } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogFooter, } from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { PDFDownloadLink } from "@react-pdf/renderer";
import InvoicePDF from "../../components/InvoicePDF.jsx";


const ITEMS_PER_PAGE = 4;

const Membership = () => {
  const { toast } = useToast();
  const [memberships, setMemberships] = useState([]);
  const [filterType, setFilterType] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [bulkAction, setBulkAction] = useState("Bulk Action");
  const [message, setMessage] = useState("");
  const [historyData, setHistoryData] = useState(null);
  const [emailPopup, setEmailPopup] = useState(null);
  const [deletePopup, setDeletePopup] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await getData("membership/get-all-memberships");
        setMemberships(res?.data || []);
      } catch (err) {
        toast({
          title: "Error",
          description: "Failed to fetch memberships",
          variant: "destructive",
        });
        console.error(err);
      }
    })();
  }, []);

  const filteredData = useMemo(() => {
    return memberships.filter((member) => {
      const matchesType =
        filterType === "All" || member.planDetails?.name === filterType;
      const matchesSearch = [
        member?.user?.fullName,
        member?.user?.email,
        member?.planDetails?.name,
        member?.orderUniqueId,
        member?.startDate,
        member?.endDate,
      ]
        .join(" ")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      return matchesType && matchesSearch;
    });
  }, [memberships, filterType, searchTerm]);

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const currentData = filteredData.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  const currentUserIds = useMemo(() => currentData.map((m) => m._id), [currentData]);
  const isAllCurrentUsersSelected = currentUserIds.every((id) => selectedUsers.includes(id));

  const handleCheckboxChange = (id) => {
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]
    );
  };

  const handleBulkCheckboxChange = () => {
    if (isAllCurrentUsersSelected) {
      setSelectedUsers((prev) => prev.filter((id) => !currentUserIds.includes(id)));
    } else {
      setSelectedUsers((prev) => [...new Set([...prev, ...currentUserIds])]);
    }
  };

  const handleExportCSV = () => {
    const headers = ["#", "Plan", "User", "Email", "Phone", "Gateway", "Payment Status", "Status", "Start", "End"];
    const rows = filteredData.map((m, i) => [
      i + 1,
      m.planDetails?.name,
      m.user?.fullName,
      m.user?.email,
      m.user?.phone,
      m.paymentMethod,
      m.paymentStatus,
      m.status ? "Active" : "Inactive",
      new Date(m.startDate).toLocaleDateString(),
      new Date(m.endDate).toLocaleDateString(),
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((row) => row.map(cell => `"${cell || ""}"`).join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "memberships.csv";
    link.click();
  };

  const handleBulkAction = async () => {
    if (bulkAction === "Bulk Action" || selectedUsers.length === 0) return;

    try {
      if (bulkAction === "Delete") {
        const responses = await Promise.all(
          selectedUsers.map((id) => getData(`membership/delete-membership/${id}`))
        );
        const deletedIds = selectedUsers.filter((_, i) => responses[i]?.status);
        setMemberships(memberships.filter((m) => !deletedIds.includes(m._id)));
        setSelectedUsers([]);
        toast({ title: "Deleted", description: `${deletedIds.length} memberships deleted.`, variant: "success" });
      } else {
        const status = bulkAction === "Active";
        const responses = await Promise.all(
          selectedUsers.map((id) => postData(`membership/status-membership/${id}`, { status }))
        );
        const updatedIds = selectedUsers.filter((_, i) => responses[i]?.status);
        setMemberships(
          memberships.map((m) => updatedIds.includes(m._id) ? { ...m, status } : m)
        );
        toast({ title: "Updated", description: `${updatedIds.length} memberships updated.`, variant: "success" });
      }
    } catch (err) {
      toast({ title: "Error", description: "Bulk operation failed.", variant: "destructive" });
    }

    setBulkAction("Bulk Action");
  };

  const handleDelete = async (id) => {
    try {
      const res = await getData(`membership/delete-membership/${id}`);
      if (res?.status) {
        setMemberships((prev) => prev.filter((m) => m._id !== id));
        toast({ title: "Deleted", description: "Membership deleted.", variant: "success" });
      }
    } catch (err) {
      toast({ title: "Error", description: "Delete failed.", variant: "destructive" });
    }
    setDeletePopup(null);
  };

  const sendEmail = async (emailPopup, message) => {
    try {
      const res = await postData("membership/sendEmail", { emailPopup, message, });
      // console.log("Email Response:", res);

      if (res?.status === true) {
        toast({ title: "Email Sent", description: `Message sent to ${emailPopup?.user?.email || "user"}`, variant: "success", });
        setMessage("");
        setEmailPopup(null);
      } else {
        toast({ title: "Email Failed", description: res?.message || "Something went wrong.", variant: "destructive", });
      }
    } catch (error) {
      console.error("Error sending email:", error);
      toast({ title: "Error", description: "Failed to send the email. Please try again.", variant: "destructive", });
    }
  };

  return (
    <AdminLayout title="User Memberships">
      {/* Toolbar */}
      <div className="mb-6 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 md:space-x-4">
        <div className="flex space-x-2">
          {["All", "Premium", "Standard"].map((type) => (
            <Button
              key={type}
              variant={filterType === type ? "default" : "outline"}
              onClick={() => {
                setFilterType(type);
                setPage(1);
              }}
            >
              {type}
            </Button>
          ))}

          <select className="border rounded-md px-2 py-1" value={bulkAction} onChange={(e) => setBulkAction(e.target.value)}>
            <option>Bulk Action</option>
            <option value="Delete">Delete</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
          <Button className="bg-blue-500 hover:bg-blue-600" onClick={handleBulkAction} disabled={selectedUsers.length === 0 || bulkAction === "Bulk Action"}>
            Apply
          </Button>
        </div>

        <div className="flex space-x-2 items-center">
          <div className="relative">
            <Input type="text" placeholder="Search" value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }} className="pl-10" />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>
          <Button onClick={handleExportCSV} variant="outline"><Download className="h-4 w-4 mr-2" />Export CSV</Button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-md border">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3">#</th>
              <th className="px-6 py-3"><input type="checkbox" className="h-4 w-4" checked={isAllCurrentUsersSelected} onChange={handleBulkCheckboxChange} /></th>
              <th className="px-6 py-3">Plan</th>
              <th className="px-6 py-3">User</th>
              <th className="px-6 py-3">Gateway</th>
              <th className="px-6 py-3">Start</th>
              <th className="px-6 py-3">End</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Download Bill</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentData.map((member, i) => (
              <tr key={member._id || i}>
                <td className="px-6 py-4 text-sm">{i + 1 + (page - 1) * ITEMS_PER_PAGE}</td>
                <td className="px-6 py-4 text-sm">
                  <input type="checkbox" className="h-4 w-4" checked={selectedUsers.includes(member._id)} onChange={() => handleCheckboxChange(member._id)} />
                </td>
                <td className="px-6 py-4 text-sm">
                  <div className="font-semibold">{member.planDetails?.name || "-"}</div>
                  <div className="text-xs text-gray-500">₹{member.planDetails?.price?.toFixed(2)}</div>
                  <div className="text-xs text-gray-500">{member.duration} month</div>
                </td>
                <td className="px-6 py-4 text-sm">
                  <div>{member.user?.fullName}</div>
                  <div className="text-xs text-gray-500">{member.user?.email}</div>
                  <div className="text-xs text-gray-500">{member.user?.phone}</div>
                </td>
                <td className="px-6 py-4 text-sm">{member.paymentMethod}</td>
                <td className="px-6 py-4 text-sm">{new Date(member?.startDate).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-sm">{new Date(member?.endDate).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-sm">{member?.status ? "Active" : "Inactive"}</td>
                <td className="px-6 py-4 text-sm">
                  <Button variant="outline">
                    <PDFDownloadLink
                      document={<InvoicePDF plan={member} />}
                      fileName={`Invoice_${member.orderUniqueId}.pdf`}
                      className="btn btn-light btn-sm"
                    >
                      {({ loading }) => (loading ? "Generating..." : "Download Invoice")}
                    </PDFDownloadLink>
                  </Button>
                </td>
                <td className="px-6 py-4 flex flex-col space-y-2">
                  <Button variant="outline" onClick={() => setHistoryData(member)}>View Details</Button>
                  <Button variant="outline" onClick={() => setEmailPopup(member)}><Mail className="w-4 h-4 mr-1" /> Email</Button>
                  <Button variant="destructive" onClick={() => setDeletePopup(member)}><Trash2 className="w-4 h-4 mr-1" /> Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex justify-center space-x-2">
          <Button onClick={() => setPage((p) => Math.max(p - 1, 1))} disabled={page === 1}>Previous</Button>
          {[...Array(totalPages)].map((_, i) => (
            <Button key={i + 1} variant={page === i + 1 ? "default" : "outline"} onClick={() => setPage(i + 1)}>{i + 1}</Button>
          ))}
          <Button onClick={() => setPage((p) => Math.min(p + 1, totalPages))} disabled={page === totalPages}>Next</Button>
        </div>
      )}

      {/* Modals */}
      <Dialog open={!!historyData} onOpenChange={() => setHistoryData(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Membership Details</DialogTitle></DialogHeader>
          <div className="space-y-2 text-sm">
            <div><strong>Order ID:</strong> {historyData?.orderUniqueId}</div>
            <div><strong>User:</strong> {historyData?.user?.fullName}</div>
            <div><strong>Email:</strong> {historyData?.user?.email}</div>
            <div><strong>Plan:</strong> {historyData?.planDetails?.name}</div>
            <div><strong>Total:</strong> ₹{historyData?.totalAmount}</div>
            <div><strong>Status:</strong> {historyData?.status ? "Active" : "Inactive"}</div>
            <div><strong>Payment:</strong> {historyData?.paymentStatus}</div>
            <div><strong>Method:</strong> {historyData?.paymentMethod}</div>
            <div><strong>Start:</strong> {new Date(historyData?.startDate).toLocaleDateString()}</div>
            <div><strong>End:</strong> {new Date(historyData?.endDate).toLocaleDateString()}</div>
            <div><strong>Address:</strong> {`${historyData?.address?.street}, ${historyData?.address?.city}, ${historyData?.address?.state} - ${historyData?.address?.pinCode}`}</div>

            <hr />
            <div style={{ display: 'flex', alignItems: 'center', width: '100%', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', width: '20%' }}>
                <img src={historyData?.businessId?.businessCategory.businessImages[0]} />
              </div>
              <div style={{ alignItems: 'center', width: '80%' }} >
                <div><strong>Business Name:</strong> {historyData?.businessId?.businessDetails?.businessName}</div>
                <div><strong>Address:</strong> {[
                  historyData?.businessId?.businessDetails?.street,
                  historyData?.businessId?.businessDetails?.landmark,
                  historyData?.businessId?.businessDetails?.city,
                  historyData?.businessId?.businessDetails?.state,
                  historyData?.businessId?.businessDetails?.pinCode
                ].filter(Boolean).join(", ")}</div>
                <div><strong>Category:</strong> {historyData?.businessId?.businessCategory?.categoryName}</div>
                <div><strong>Service Areas:</strong> {historyData?.businessId?.businessCategory?.serviceArea?.join(", ")}</div>
                <div><strong>Verified:</strong> {historyData?.businessId?.verified ? "Yes" : "No"}</div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!emailPopup} onOpenChange={() => setEmailPopup(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Send Email</DialogTitle></DialogHeader>
          <Textarea placeholder="Enter message..." value={message} onChange={(e) => setMessage(e.target.value)} />
          <Button onClick={() => {
            // alert(JSON.stringify(emailPopup))
            sendEmail(emailPopup, message)
            // toast({ title: "Email Sent", description: `Message sent to ${emailPopup}` });
            // setMessage("");
            // setEmailPopup(null);
          }}>Send</Button>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deletePopup} onOpenChange={() => setDeletePopup(null)}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle></AlertDialogHeader>
          <AlertDialogFooter>
            <Button variant="outline" onClick={() => setDeletePopup(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => handleDelete(deletePopup._id)}>Delete</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default Membership;
