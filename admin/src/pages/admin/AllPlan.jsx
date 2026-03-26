import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/Layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { EditButton, DeleteButton } from "@/components/ui/table-actions";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { getData, postData } from "../../services/FetchNodeServices";


const AllPlan = () => {
  const { toast } = useToast();
  const [plans, setPlans] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    values: [],
    features: [],
  });

  const itemsPerPage = 5;

  const fetchPlans = async () => {
    try {
      const res = await getData(`plans/get-all-plan`);
      if (res.status === true) {
        setPlans(res.data);
      }
    } catch (error) {
      console.error("Error fetching plans", error);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleEdit = (plan) => {
    setSelectedPlan(plan);
    setFormData({
      name: plan.name,
      price: plan.price,
      values: plan.values,
      features: plan.features,
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = async () => {
    try {
      const res = await postData(`plans/update-plan/${selectedPlan?._id}`, formData);
      if (res.status) {
        toast({ title: "Plan Updated", description: "Plan successfully updated." });
        setShowEditModal(false);
        fetchPlans();
      }
    } catch {
      toast({ title: "Error", description: "Failed to update plan." });
    }
  };

  const handleDelete = async () => {
    try {
      const res = await getData(`plans/delete-plan/${selectedPlan._id}`);
      if (res.status) {
        toast({ title: "Plan Deleted", description: `Plan #${selectedPlan._id} deleted.` });
        setShowDeleteConfirm(false);
        fetchPlans();
      }
    } catch {
      toast({ title: "Delete Failed", description: "Could not delete the plan." });
    }
  };

  const filteredPlans = plans.filter((plan) =>
    Object.values(plan).some((val) =>
      String(val).toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredPlans.length / itemsPerPage);
  const currentPlans = filteredPlans.slice(
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
    <AdminLayout title="Plans">
      <div className="mb-6 flex justify-between items-center">
        <Input
          placeholder="Search plans..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          className="w-64"
        />
        {/* <div className="flex gap-3">
          <Button onClick={() => setShowAddModal(true)} className="bg-blue-500 hover:bg-blue-600">Add Plan</Button>
        </div> */}
      </div>

      <div className="overflow-x-auto rounded-md border">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Features</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Edit</th>
              {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Delete</th> */}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentPlans.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-4 text-gray-500">No plans found.</td>
              </tr>
            ) : (
              currentPlans.map((plan, index) => (
                <tr key={plan._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{plan.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">₹{plan.price}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm max-w-xs truncate">{plan.features?.join(", ")}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <EditButton onClick={() => handleEdit(plan)} />
                  </td>
                  {/* <td className="px-6 py-4 whitespace-nowrap">
                    <DeleteButton onClick={() => { setSelectedPlan(plan); setShowDeleteConfirm(true); }} />
                  </td> */}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

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

      {/* Edit Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Plan</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* <div><Label>Name</Label><Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} /></div> */}
            <div><Label>Price</Label><Input value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} /></div>
            {/* <div><Label>Values</Label><Input value={formData.values.join(", ")} onChange={(e) => setFormData({ ...formData, values: e.target.value.split(",").map(v => v.trim()) })} /></div> */}
            {/* <div><Label>Features</Label><Input value={formData.features.join(", ")} onChange={(e) => setFormData({ ...formData, features: e.target.value.split(",").map(v => v.trim()) })} /></div> */}
            <Button onClick={handleEditSubmit} className="w-full bg-yellow-600 hover:bg-yellow-700">Update</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent>
          <DialogHeader><DialogTitle>Are you sure?</DialogTitle></DialogHeader>
          <p>This action will permanently delete this plan.</p>
          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AllPlan;
