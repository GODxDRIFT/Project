import { useEffect, useState } from "react";
import axios from "axios";
import { AdminLayout } from "@/components/Layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Eye, Trash } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { CSVLink } from "react-csv";
import { toast } from "@/components/ui/use-toast";
import { formatDate } from "@/constant";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table";
import { postData, getData } from "../../services/FetchNodeServices";
import { Item } from "@radix-ui/react-dropdown-menu";

interface FullListing {
  _id: string;
  businessDetails?: {
    _id: string;
    businessName?: string;
    pinCode?: string;
    building?: string;
    street?: string;
    area?: string;
    landmark?: string;
    city?: string;
    state?: string;
    direction?: string;
    website?: string;
    createdAt?: string;
    updatedAt?: string;
    __v?: number;
    category?: string;
    userId?: string;
    publishedDate?: string;
    status?: string;
    businessStatus?: string;
    trustStatus?: string;
    phon?: string;
  };
  businessCategory?: {
    category?: {
      name?: string;
      [key: string]: any;
    };
    [key: string]: any;
  };
  contactPerson?: {
    firstName?: string;
    lastName?: string;
    title?: string;
    [key: string]: any;
  };
  timings: {
    open: string;
    close: string;
    days: string[];
  };
  contact: {
    phone: string;
    email: string;
    firstName?: string; // Add firstName
    lastName?: string; // Add lastName
  };
  upgrade: {
    plan: string;
    expiryDate: string;
  };
}

export const AllListings = () => {
  const [fullListings, setFullListings] = useState<FullListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAction, setSelectedAction] = useState("Bulk Action");
  const [selectedListingIds, setSelectedListingIds] = useState<string[]>([]);
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const listingsPerPage = 10;
  const [totalPages, setTotalPages] = useState(1);

  // Editing status state
  const [editingPublishStatusId, setEditingPublishStatusId] = useState<string | null>(null);
  const [editingStatusId, setEditingStatusId] = useState<string | null>(null);
  const [editingVerifiedId, setEditingVerifiedId] = useState<string | null>(null);
  const [publishStatusOptions] = useState(["Pending", "Published", "Unpublished",]);
  const [statusOptions] = useState(["Pending", "Approved", "Rejected"]);
  const [verifiedOptions] = useState(["Pending", "Approved", "Rejected"]);

  const navigate = useNavigate();

  useEffect(() => {
    fetchFullListings();
  }, [currentPage]);

  const fetchFullListings = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getData(`get-all-listings`);
      console.log("SSSSSSSSSSSS-------", res)
      setFullListings(res?.data || []);
      setTotalPages(
        Math.ceil((res.data.length || 0) / listingsPerPage) || 1
      );
    } catch (err: unknown) {
      console.error("Failed to fetch full listings", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to fetch listings");
      }
      setFullListings([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };
  // console.log("setFullListings", fullListings.data)

  const filteredListings = fullListings.filter((listing) => {
    const query = searchQuery.toLowerCase();

    const businessName = listing?.businessDetails?.businessName?.toLowerCase() || "";
    const categoryName = listing?.businessCategory?.categoryName?.toLowerCase() || "";
    const subCategories = listing?.businessCategory?.subCategoryName?.join(" ").toLowerCase() || "";
    const firstName = listing?.contactPerson?.firstName?.toLowerCase() || "";
    const userEmail = listing?.contactPerson?.email?.toLowerCase() || "";
    const contactNumber = listing?.contactPerson?.contactNumber?.toLowerCase() || "";
    const createdAt = formatDate(listing?.createdAt)?.toLowerCase() || "";
    const status = listing?.businessDetails?.status?.toLowerCase() || "";


    return (
      businessName.includes(query) ||
      categoryName.includes(query) ||
      subCategories.includes(query) ||
      firstName.includes(query) ||
      createdAt.includes(query) ||
      status.includes(query) ||
      userEmail.includes(query) ||
      contactNumber.includes(query)

    );
  });


  const currentListings = filteredListings.slice(
    (currentPage - 1) * listingsPerPage,
    currentPage * listingsPerPage
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const handleBulkAction = async () => {
    if (selectedAction === "Bulk Action" || selectedListingIds.length === 0)
      return;

    try {
      await postData(`listing-bulk-action`, {
        ids: selectedListingIds,
        action: selectedAction,
      });
      toast({
        title: "Bulk Action Successful",
        description: `Successfully performed '${selectedAction}' on ${selectedListingIds.length} listings.`,
      });
      fetchFullListings();
      setSelectedListingIds([]);
      setSelectedAction("Bulk Action");
    } catch (error: any) {
      console.error(`Failed to ${selectedAction} listings`, error);
      toast({
        variant: "destructive",
        title: "Bulk Action Failed",
        description:
          error.response?.data?.message ||
          `Failed to perform '${selectedAction}' on selected listings.`,
      });
    }
  };

  const handleCheckboxChange = (id: string) => {
    if (selectedListingIds.includes(id)) {
      setSelectedListingIds(selectedListingIds.filter((item) => item !== id));
    } else {
      setSelectedListingIds([...selectedListingIds, id]);
    }
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedListingIds(
        currentListings.map((listing) => listing._id)
      );
    } else {
      setSelectedListingIds([]);
    }
  };

  const getStatusBadge = (status: string) => {
    const normalized =
      status?.toLowerCase() === "unpublish" ? "pending" : status?.toLowerCase();
    const displayStatus = normalized === "unpublish" ? "pending" : normalized;
    switch (displayStatus) {
      case "approved":
        return (
          <span className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded-full">
            Approved
          </span>
        );
      case "pending":
        return (
          <span className="px-3 py-1 text-sm bg-yellow-100 text-yellow-800 rounded-full">
            Pending
          </span>
        );
      case "rejected":
        return (
          <span className="px-3 py-1 text-sm bg-red-100 text-red-800 rounded-full">
            Rejected
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 text-sm bg-gray-100 text-gray-800 rounded-full">
            {status}
          </span>
        );
    }
  };

  const getStatusVerifiedBadge = (verified: string) => {
    const normalized =
      verified?.toLowerCase() === "unpublish" ? "pending" : verified?.toLowerCase();
    const displayStatus = normalized === "unpublish" ? "pending" : normalized;
    switch (displayStatus) {
      case "approved":
        return (
          <span className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded-full">
            Approved
          </span>
        );
      case "pending":
        return (
          <span className="px-3 py-1 text-sm bg-yellow-100 text-yellow-800 rounded-full">
            Pending
          </span>
        );
      case "rejected":
        return (
          <span className="px-3 py-1 text-sm bg-red-100 text-red-800 rounded-full">
            Rejected
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 text-sm bg-gray-100 text-gray-800 rounded-full">
            {verified}
          </span>
        );
    }
  };

  const getBusinessTrustStatus = (status: string) => {
    const normalized = status.toLowerCase();
    const color = normalized === "approved" ? "bg-blue-600" : "bg-red-600";
    return (
      <span className={`px-2 py-1 text-xs ${color} text-white rounded-md`}>
        {status} Business Status
      </span>
    );
  };

  const getTrustStatus = (status: string) => {
    const normalized = status.toLowerCase();
    const color = normalized === "approved" ? "bg-green-600" : "bg-yellow-600";
    return (
      <span className={`px-2 py-1 text-xs ${color} text-white rounded-md`}>
        {status} Trust Status
      </span>
    );
  };

  const handleUpdatePublishStatus = async (id: string, newStatus: string) => {
    try {
      await axios.post(`https://api.biziffy.com/api/change-publish-status/${id}`, { status: newStatus });
      setFullListings(
        fullListings.map((listing) =>
          listing._id === id && listing.businessDetails
            ? {
              ...listing,
              businessDetails: {
                ...listing.businessDetails,
                publishedDate: newStatus,
              },
            }
            : listing
        )
      );
      setEditingPublishStatusId(null);
      toast({
        title: "Publish Status Updated",
        description: `Listing ${id} publish status updated to ${newStatus}.`,
      });
    } catch (error: any) {
      console.error("Failed to update publish status", error);
      toast({
        variant: "destructive",
        title: "Error Updating Publish Status",
        description:
          error.response?.data?.message || "Failed to update publish status.",
      });
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    // console.log("XXXXXXXXXXXXXXXXXXXXXXXX----", newStatus)
    try {
      await postData(`update-business-listing-status/${id}`, { status: newStatus });
      setFullListings(
        fullListings.map((listing) => {
          if (listing._id === id && listing.businessDetails) {
            return {
              ...listing,
              businessDetails: {
                ...listing.businessDetails,
                status: newStatus,
                businessStatus:
                  newStatus === "Approved" ? "Approved" : "Not Approved",
                trustStatus:
                  newStatus === "Approved" || newStatus === "Pending"
                    ? "Approved"
                    : "Not Approved",
              },
            };
          }
          return listing;
        })
      );
      setEditingStatusId(null);
      toast({
        title: "Status Updated",
        description: `Listing ${id} status updated to ${newStatus}.`,
      });
    } catch (error: any) {
      console.error("Failed to update status", error);
      toast({
        variant: "destructive",
        title: "Error Updating Status",
        description:
          error.response?.data?.message || "Failed to update status.",
      });
    }
  };

  // const handleUpdateVerified = async (id: string, newStatus: string) => {
  //   // console.log("XXXXXXXXXXXXXXXXXXXXXXXX----", newStatus)
  //   try {
  //     const response = await postData(`update-business-listing-verified/${id}`, { verified: newStatus });
  //     if (response?.status === true) {
  //       setFullListings(
  //         fullListings.map((listing) => {
  //           if (listing._id === id) {
  //             return { ...listing, verified: newStatus, };
  //           }
  //           return listing;
  //         })
  //       );
  //       setEditingVerifiedId(null);
  //       toast({ title: "Status Verified", description: `Listing ${id} status Verified to ${newStatus}.`, });
  //     }

  //   } catch (error: any) {
  //     console.error("Failed to update status", error);
  //     toast({
  //       variant: "destructive",
  //       title: "Error Updating Status",
  //       description:
  //         error.response?.data?.message || "Failed to update status.",
  //     });
  //   }
  // };


  const handleToggleVerified = async (id, isChecked) => {
    try {
      const response = await postData(`update-business-listing-verified/${id}`, { verified: isChecked, });
      console.log("response:=>", response)
      if (response?.status === true) {
        // Update state
        setFullListings((prevListings) =>
          prevListings.map((listing) =>
            listing._id === id
              ? { ...listing, verified: isChecked }
              : listing
          )
        );

        toast({
          title: "Verification Updated", description: `Listing ID ${id} is now ${isChecked ? "Verified" : "Pending"}.`,
        });
      }
    } catch (error) {
      console.error("Failed to update verified status:", error);
      toast({ variant: "destrctive", title: "Error", description: error?.response?.data?.message || "Could not update verified status.", });
    }
  };

  const handleToggleTrust = async (id, isChecked) => {
    try {
      const response = await postData(`update-business-listing-trust/${id}`, { trust: isChecked, });
      // console.log("response:=>", response)
      if (response?.status === true) {
        // Update state
        setFullListings((prevListings) =>
          prevListings.map((listing) =>
            listing._id === id
              ? { ...listing, trust: isChecked }
              : listing
          )
        );

        toast({
          title: "Verification Updated", description: `Listing ID ${id} is now ${isChecked ? "trust" : "Pending"}.`,
        });
      }
    } catch (error) {
      console.error("Failed to update verified status:", error);
      toast({ trust: "destrctive", title: "Error", description: error?.response?.data?.message || "Could not update verified status.", });
    }
  };

  const handleDeleteListing = async (id: string) => {
    if (!id) {
      console.error("No ID provided for deletion");
      toast({ variant: "destructive", title: "Invalid ID", description: "Listing ID is missing. Please try again.", });
      return;
    }

    try {
      const response = await axios.get(`https://api.biziffy.com/api/delete-business-listing/${id}`);
      // console.log("Delete Response: ", response);
      fetchFullListings();
    } catch (error) {
      console.error("Delete failed: ", error.response ? error.response.data : error.message);
    }
  };

  // console.log("XXXXXXXXXXXXXXXXXVXXXXXX==>", filteredListings);

  const indexOfLastUser = currentPage * listingsPerPage;
  const indexOfFirstUser = indexOfLastUser - listingsPerPage;

  const exportToCSV = () => {
    const headers = [
      "Sr. No", "Business Name", "Full Name", "Email", "Phone", "Whatsapp",
      "User ID", "User Name", "User Email", "User Phone",
      "Category", "Subcategories", "Business Address", "Business Status",
      "Year In Business", "Keywords", "About", "Service Area", "Business Images",
      "Verified", "Trusted", "Click Count ID", "FAQs Count", "Reviews Count", "Business Hours", "Created At"
    ];

    const formatField = (value) => {
      if (!value) return '""';
      const str = Array.isArray(value) ? value.join(", ") : value.toString();
      return `"${str.replace(/"/g, '""')}"`; // escape double quotes
    };

    const rows = filteredListings.map((listing, index) => [
      formatField(index + 1),
      // formatField(listing._id),
      formatField(listing?.businessDetails?.businessName),
      formatField(
        `${listing?.contactPerson?.title || ""} ${listing?.contactPerson?.firstName || ""} ${listing?.contactPerson?.lastName || ""}`
      ),
      formatField(listing?.contactPerson?.email),
      formatField(listing?.contactPerson?.contactNumber),
      formatField(listing?.contactPerson?.whatsappNumber),
      formatField(listing?.contactPerson?.userId?._id),
      formatField(listing?.contactPerson?.userId?.fullName),
      formatField(listing?.contactPerson?.userId?.email),
      formatField(listing?.contactPerson?.userId?.phone),
      formatField(listing?.businessCategory?.category?.name),
      formatField(listing?.businessCategory?.subCategory?.map(item => item?.name).join(", ")),
      formatField(
        `${listing?.businessDetails?.building || ""} ${listing?.businessDetails?.street || ""} ${listing?.businessDetails?.landmark || ""} ${listing?.businessDetails?.city || ""} ${listing?.businessDetails?.state || ""} ${listing?.businessDetails?.pinCode || ""}`
      ),
      formatField(listing?.businessDetails?.status),
      // formatField(listing?.businessDetails?.publishedDate),
      formatField(listing?.businessDetails?.yib),
      formatField(listing?.businessCategory?.keywords?.join(", ")),
      formatField(listing?.businessCategory?.about),
      formatField(listing?.businessCategory?.serviceArea?.join(", ")),
      formatField(listing?.businessCategory?.businessImages?.join(", ")),
      formatField(listing?.verified),
      formatField(listing?.trust),
      formatField(listing?.clickCounts?._id),
      formatField(listing?.faq?.length),
      formatField(listing?.reviews?.length),
      formatField(
        listing?.businessTiming?.map(day =>
          `${day.day} ${day.openTime}${day.openPeriod} - ${day.closeTime}${day.closePeriod}`
        ).join(" | ")
      ),
      formatField(new Date(listing?.createdAt).toLocaleDateString("en-IN"))
    ]);

    const csvContent = [headers.map(formatField).join(","), ...rows.map(r => r.join(","))].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "business_listings.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const capitalizeWords = (str) => {
    return str?.toLowerCase()?.split(" ")?.map(word => word?.charAt(0).toUpperCase() + word?.slice(1)).join(" ");
  };

  if (loading) {
    return (
      <AdminLayout title="">
        <div>Loading listings...</div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout title="">
        <div className="text-red-500">Error loading listings: {error}</div>
      </AdminLayout>
    );
  }
  // console.log("currentListings", currentListings)
  return (
    <AdminLayout title="">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">All Business Listings</h1>
      </div>

      {/* Bulk Actions + Search/Export */}
      <div className="flex flex-col md:flex-row md:justify-between mb-4 gap-4">
        <div className="flex items-center gap-2">
          <select
            className="px-4 py-2 border rounded-md"
            value={selectedAction}
            onChange={(e) => setSelectedAction(e.target.value)}
          >
            <option value="Bulk Action">Bulk Action</option>
            <option value="Delete">Delete</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
          <Button
            className="bg-blue-500 hover:bg-blue-600"
            onClick={handleBulkAction}
            disabled={selectedListingIds.length === 0}
          >
            Apply
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <Input
            type="text"
            placeholder="Search"
            className="w-40 md:w-64"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {/* <CSVLink
            data={csvData}
            filename="listings.csv"
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 sm:px-4 sm:py-2 rounded-md text-xs sm:text-sm text-center w-28 sm:w-auto"
          >
            Export to CSV
          </CSVLink> */}
          <select
            className="px-4 py-2 border rounded-md"
            value={searchQuery}
            onChange={(e) =>setSearchQuery(e.target.value)}
          >
            <option value="Bulk Action">Filter Status</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
          <Button className="bg-blue-500 hover:bg-blue-600" onClick={exportToCSV}>
            Export to CSV
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-md border shadow-sm mt-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px]">
                <input
                  type="checkbox"
                  className="h-4 w-4"
                  onChange={handleSelectAll}
                  checked={
                    currentListings.length > 0 &&
                    selectedListingIds.length === currentListings.length
                  }
                />
              </TableHead>
              <TableHead>ID</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Business Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Created Date</TableHead>
              {/* <TableHead>Published</TableHead> */}
              <TableHead>Business Status</TableHead>
              <TableHead>Verified</TableHead>
              <TableHead>Trusted</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentListings?.map((listing, index) => (
              <TableRow key={listing._id}>
                <TableCell>
                  <input
                    type="checkbox"
                    className="h-4 w-4"
                    checked={selectedListingIds.includes(listing._id)}
                    onChange={() => handleCheckboxChange(listing._id)}
                  />
                </TableCell>
                <TableCell>{indexOfFirstUser + index + 1}</TableCell>
                <TableCell>
                  {(listing?.contactPerson?.title ? listing.contactPerson.title + ' ' : '') + (capitalizeWords(listing?.contactPerson?.firstName || '')) + ' ' + (capitalizeWords(listing?.contactPerson?.lastName || ''))}
                  <div className="text-xs text-gray-500">{listing?.contactPerson?.email}</div>
                  <div className="text-xs text-gray-500">{listing.contactPerson?.contactNumber}</div>

                </TableCell>
                <TableCell>{capitalizeWords(listing?.businessDetails?.businessName)}</TableCell>
                <TableCell>{capitalizeWords(listing?.businessCategory?.category?.name)}</TableCell>
                <TableCell>{formatDate(listing?.createdAt)}</TableCell>
                {/* <TableCell>
                  {editingPublishStatusId === listing._id ? (
                    <select
                      className="px-2 py-1 border rounded-md"
                      value={listing.businessDetails?.publishedDate || "Pending"}
                      onChange={(e) => handleUpdatePublishStatus(listing._id, e.target.value)}
                      onBlur={() => setEditingPublishStatusId(null)}
                      autoFocus
                    >
                      {publishStatusOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="flex items-center gap-2">
                      {listing.businessDetails?.publishedDate || "Pending"}
                      <button
                        onClick={() =>
                          setEditingPublishStatusId(listing._id)
                        }
                        className="p-1 bg-orange-200 rounded-md hover:bg-orange-300 transition-colors w-6 h-6 flex items-center justify-center"
                      >
                        <Pencil className="w-3 h-3 text-orange-600" />
                      </button>
                    </div>
                  )}
                </TableCell> */}

                <TableCell>
                  {editingStatusId === listing._id ? (
                    <select
                      className="px-2 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
                      value={listing.businessDetails?.status || ''} onChange={(e) => handleUpdateStatus(listing._id, e.target.value)} onBlur={() => setEditingStatusId(null)} autoFocus                    >

                      {statusOptions?.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="flex items-center gap-2">
                      {getStatusBadge(listing.businessDetails?.status || "Pending")}
                      <button
                        onClick={() => setEditingStatusId(listing?._id)}
                        className="p-1 bg-orange-200 rounded-md hover:bg-orange-300 transition-colors w-6 h-6 flex items-center justify-center"
                        title="Edit Status"
                      >
                        <Pencil className="w-3 h-3 text-orange-600" />
                      </button>
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <label className="relative inline-flex items-center cursor-pointer group">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={JSON.parse(listing?.verified)}
                        onChange={(e) => handleToggleVerified(listing?._id, e.target?.checked)}
                      />
                      <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-400 rounded-full peer-checked:bg-blue-600 transition-colors duration-300"></div>
                      <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white border border-gray-300 rounded-full transition-transform duration-300 transform peer-checked:translate-x-full"></div>
                    </label>
                    <span className={`text-sm font-medium ${JSON.parse(listing?.verified) ? "text-green-600" : "text-gray-500"}`}>
                      {JSON.parse(listing?.verified) || listing?.verified === "Verified" ? "Verified" : "Pending"}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <label className="relative inline-flex items-center cursor-pointer group">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={listing?.trust}
                        onChange={(e) => handleToggleTrust(listing?._id, e.target?.checked)}
                      />
                      <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-400 rounded-full peer-checked:bg-blue-600 transition-colors duration-300"></div>
                      <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white border border-gray-300 rounded-full transition-transform duration-300 transform peer-checked:translate-x-full"></div>
                    </label>
                    <span className={`text-sm font-medium ${listing?.trust ? "text-green-600" : "text-gray-500"}`}>
                      {listing?.trust ? "trust" : "Pending"}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                      {/* <Link to={`/admin/listings/details/${listing.businessId}`}> */}
                      <Button
                        onClick={() => navigate(`/admin/listings/details/${listing?.businessDetails?._id}`, { state: { listing: listing } })}
                        size="sm"
                        variant="default"
                        className="bg-blue-500 hover:bg-blue-600 text-white"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      {/* </Link> */}

                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteListing(listing?._id)}
                      >
                        <Trash className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>

                    {/* <div className="flex flex-col gap-1">
                      {getBusinessTrustStatus(
                        listing.businessDetails?.status ||
                        "Not Approved"
                      )}
                      {getTrustStatus(
                        listing.businessDetails?.publishedDate || "Not Approved"
                      )}
                    </div> */}

                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination Controls */}
        <div className="flex justify-center mt-6 space-x-2">
          <Button
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </Button>

          {[...Array(totalPages)].map((_, i) => (
            <Button
              key={i}
              size="sm"
              variant={currentPage === i + 1 ? "default" : "outline"}
              onClick={() => handlePageChange(i + 1)}
            >
              {i + 1}
            </Button>
          ))}
          <Button
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AllListings;
