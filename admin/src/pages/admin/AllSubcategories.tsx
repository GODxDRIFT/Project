import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/Layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { Link } from "react-router-dom";
import { postData } from "@/services/FetchNodeServices";
import { Search } from "lucide-react";

const AllSubcategories = () => {
  const { toast } = useToast();
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch all subcategories from backend
  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        const response = await axios.get("https://api.biziffy.com/api/admin/subcategories");

        // console.log("Response Data:", response.data);

        // Extract subcategories array from the response
        if (Array.isArray(response.data)) {
          setSubcategories(response.data);
        } else {
          console.error("Invalid data format:", response.data);
          toast({
            title: "Error",
            description: "Invalid data format received from the server.",
            variant: "destructive",
          });
        }

      } catch (error) {
        console.error("Error fetching subcategories:", error);
        toast({
          title: "Error",
          description: "Failed to fetch subcategories.",
          variant: "destructive",
        });
      }
    };

    fetchSubcategories();
  }, [toast]);

  // Handle delete of a subcategory
  const handleDelete = async (id: string) => {
    try {
      const response = await axios.delete(`https://api.biziffy.com/api/admin/delete-subcategory/${id}`);

      if (response.status) {
        // Filter the subcategories array to remove the deleted subcategory
        setSubcategories(prevSubcategories =>
          prevSubcategories.filter(sub => sub._id !== id)
        );
        toast({
          title: "Subcategory Deleted",
          description: "Subcategory deleted successfully.",
        });
      } else {
        console.error("Failed to delete subcategory:", response);
        toast({
          title: "Error",
          description: "Failed to delete subcategory.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error deleting subcategory:", error);
      toast({
        title: "Error",
        description: "Failed to delete subcategory.",
        variant: "destructive",
      });
    }
  };

  const handleCheckboxChange = async (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
    const updatedStatus = e.target.checked;
    try {
      const res = await postData('admin/change-status', { categoryId: id, statusHome: updatedStatus });
      if (res.success === true) {
        const updated = subcategories?.map(cat => cat?._id === id ? { ...cat, statusHome: updatedStatus } : cat);
        setSubcategories(updated);
        toast({ title: "Success", description: "Status updated successfully." });
      }
    } catch (error) {
      toast({ title: "Error", description: "Status update failed.", variant: "destructive" });
    }
  };

 const handleCheckboxChangeFooter = async (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
    const updatedStatus = e.target.checked;
    try {
      const res = await postData('admin/change-status-footer', { categoryId: id, statusFooter: updatedStatus });
      if (res.success === true) {
        const updated = subcategories?.map(cat => cat?._id === id ? { ...cat, statusFooter: updatedStatus } : cat);
        setSubcategories(updated);
        toast({ title: "Success", description: "Status updated successfully." });
      }
    } catch (error) {
      toast({ title: "Error", description: "Status update failed.", variant: "destructive" });
    }
  };
  
  const filteredCategories = subcategories.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout title="All Subcategories">
      <div className="space-y-4">
        {/* Add New Subcategory Button */}
        <div className="flex justify-end">
          <div className="relative w-64" style={{ marginRight: '10px' }}>
            <Input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                // setCurrentPage(1);
              }}
              className="pl-10"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>

          {/* <Button onClick={handleExportToCSV} className="bg-green-500 hover:bg-green-600 w-full sm:w-auto">
            Export to CSV
          </Button> */}

          <Button variant="outline">
            <Link to="/admin/subcategories/add">Add New Subcategory</Link>
          </Button>

        </div>

        {/* Display list of subcategories */}
        <div className="overflow-hidden rounded-lg border bg-white shadow-md">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">ID</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Subcategory Name</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Subcategory Image</th>
                {/* <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Subcategory Banner</th> */}
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Main Category</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Show in Home Page</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Show in Footer</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCategories?.length > 0 ? (
                filteredCategories?.map((subcategory) => (
                  <tr key={subcategory?._id}>
                    <td className="px-4 py-3 text-sm text-gray-900">{subcategory?._id}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{subcategory?.name}</td>
                    <td className="px-4 py-3">
                      <img
                        src={subcategory?.image || "/images/default-image.jpg"}
                        alt="Subcategory Image"
                        width={100}
                        height={60}
                        className="rounded object-cover"
                      />
                    </td>
                    {/* <td className="px-4 py-3">
                      <img
                        src={subcategory?.banner || "/images/default-banner.jpg"}
                        alt="Subcategory Banner"
                        width={100}
                        height={60}
                        className="rounded object-cover"
                      />
                    </td> */}
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {subcategory?.category?.name || "N/A"}
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={subcategory?.statusHome as boolean}
                        onChange={(e) => handleCheckboxChange(e, subcategory?._id)}
                      />
                    </td>

                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={subcategory?.statusFooter as boolean}
                        onChange={(e) => handleCheckboxChangeFooter(e, subcategory?._id)}
                      />
                    </td>

                    <td className="px-4 py-3 text-sm text-gray-900">{subcategory?.status}</td>
                    <td className="px-4 py-3 space-x-2">
                      <Button variant="link" size="sm">
                        <Link to={`/admin/EditSubCategory/${subcategory?._id}`}>Edit</Link>
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(subcategory?._id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                    No subcategories available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout >
  );
};

export default AllSubcategories;
