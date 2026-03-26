import { useEffect, useState } from "react";
import axios from "axios";
import { AdminLayout } from "@/components/Layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { EditButton, DeleteButton } from "@/components/ui/table-actions";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import {
  Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious,
} from "@/components/ui/pagination";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { getData, postData } from "../../services/FetchNodeServices";


const AllCoupon = () => {
  const { toast } = useToast();
  const [coupons, setCoupons] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [formData, setFormData] = useState({ title: "", code: "", discount: "" });

  const itemsPerPage = 5;

  const fetchCoupons = async () => {
    try {
      const res = await getData(`coupon/get-all-coupon`);
      if (res.status === true) {
        setCoupons(res.data);
      }

    } catch (error) {
      console.error("Error fetching coupons", error);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleAddSubmit = async () => {
    try {
      const res = await postData(`coupon/create-coupon`, formData);
      if (res.status === true) {
        toast({ title: "Coupon Added", description: "New coupon successfully created." });
        setShowAddModal(false);
        setFormData({ title: "", code: "", discount: "" });
        fetchCoupons();
      }

    } catch {
      toast({ title: "Error", description: "Failed to add coupon." });
    }
  };

  const handleEdit = (coupon) => {
    setSelectedCoupon(coupon);
    setFormData({ title: coupon.title, code: coupon.code, discount: coupon.discount });
    setShowEditModal(true);
  };

  const handleEditSubmit = async () => {
    try {
      const res = await postData(`coupon/update-coupon/${selectedCoupon?._id}`, formData);
      if (res.status) {
        toast({ title: "Coupon Updated", description: "Coupon successfully updated." });
        setShowEditModal(false);
        setFormData({ title: "", code: "", discount: "" });
        fetchCoupons();
      }
    } catch {
      toast({ title: "Error", description: "Failed to update coupon." });
    }
  };

  const handleDelete = async () => {
    try {
      const res = await getData(`coupon/delete-coupon/${selectedCoupon?._id}`);
      if (res?.status === true) {
        toast({ title: "Coupon Deleted", description: `Coupon #${selectedCoupon._id} deleted.` });
        setShowDeleteConfirm(false);
        fetchCoupons();
      }
    } catch {
      toast({ title: "Delete Failed", description: "Could not delete the coupon." });
    }
  };

  const handleExportCSV = () => {
    const headers = ["ID", "Title", "Code", "Discount"];
    const rows = filteredCoupons.map((c) => [c._id, c.title, c.code, c.discount]);
    const csvContent = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "coupons.csv";
    a.click();
  };

  const filteredCoupons = coupons.filter((coupon) =>
    Object.values(coupon).some((val) =>
      String(val).toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredCoupons.length / itemsPerPage);
  const currentCoupons = filteredCoupons.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const paginate = (page) => setCurrentPage(page);

  const renderPageNumbers = () => {
    const maxVisible = 4;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start + 1 < maxVisible) start = Math.max(1, end - maxVisible + 1);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  return (
    <AdminLayout title="Coupons">
      {/* Header Controls */}
      <div className="mb-6 flex justify-between items-center">
        <Input
          placeholder="Search coupons..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          className="w-64"
        />
        <div className="flex gap-3">
          {/* <Button onClick={handleExportCSV} className="bg-green-500 hover:bg-green-600">Export CSV</Button> */}
          <Button onClick={() => setShowAddModal(true)} className="bg-blue-500 hover:bg-blue-600">Add Coupon</Button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-md border">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Discount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Edit</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Delete</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentCoupons.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-4 text-gray-500">No coupons found.</td>
              </tr>
            ) : (
              currentCoupons.map((coupon, index) => (
                <tr key={coupon._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{coupon.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{coupon.code}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{coupon.discount}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <EditButton onClick={() => handleEdit(coupon)} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <DeleteButton onClick={() => { setSelectedCoupon(coupon); setShowDeleteConfirm(true); }} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="py-4 flex justify-end">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={() => paginate(Math.max(currentPage - 1, 1))}
                  disabled={currentPage === 1}
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
                  disabled={currentPage === totalPages}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* Add Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Coupon</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div><Label>Title</Label><Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} /></div>
            <div><Label>Code</Label><Input value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })} /></div>
            <div><Label>Discount</Label><Input value={formData.discount} onChange={(e) => setFormData({ ...formData, discount: e.target.value })} /></div>
            <Button onClick={handleAddSubmit} className="w-full bg-blue-600 hover:bg-blue-700">Submit</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Coupon</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div><Label>Title</Label><Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} /></div>
            <div><Label>Code</Label><Input value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })} /></div>
            <div><Label>Discount</Label><Input value={formData.discount} onChange={(e) => setFormData({ ...formData, discount: e.target.value })} /></div>
            <Button onClick={handleEditSubmit} className="w-full bg-yellow-600 hover:bg-yellow-700">Update</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent>
          <DialogHeader><DialogTitle>Are you sure?</DialogTitle></DialogHeader>
          <p>This action will permanently delete this coupon.</p>
          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AllCoupon;
