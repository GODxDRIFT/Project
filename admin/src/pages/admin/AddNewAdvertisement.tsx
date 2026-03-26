import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { AdminLayout } from "@/components/Layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getData, postData } from "@/services/FetchNodeServices";

interface Category {
  _id: string;
  name: string;
}

interface AdvertisementData {
  title: string;
  type: string;
  businessCategory: string;
  subCategory: string;
  redirectUrl: string;
  status: "Active" | "Inactive";
  image: File | null;
  categoryName?: string;
  subCategoryName?: string;
}

const AddNewAdvertisement: React.FC = () => {
  const navigate = useNavigate();
  const [categoryList, setCategoryList] = useState<Category[]>([]);
  const [subCategoryList, setSubCategoryList] = useState<Category[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [formData, setFormData] = useState<AdvertisementData>({
    title: "",
    type: "",
    businessCategory: "",
    subCategory: "",
    redirectUrl: "",
    status: "Inactive",
    image: null,
    categoryName: '',
    subCategoryName: ''
  });

  useEffect(() => {
    const fetchCategory = async () => {
      const res = await axios.get("https://api.biziffy.com/api/categories");
      setCategoryList(res.data || []);
    };
    fetchCategory();
  }, []);

  useEffect(() => {
    const fetchSubcategories = async () => {
      if (formData.businessCategory) {
        const response = await getData(`admin/get-Subcategories-by-category/${formData.businessCategory}`);
        setSubCategoryList(response || []);
      }
    };
    fetchSubcategories();
  }, [formData.businessCategory]);

  useEffect(() => {
    const selectedCategory = categoryList.find(item => item?._id === formData.businessCategory);
    const selectedSubCategory = subCategoryList.find(item => item?._id === formData.subCategory);
    setFormData(prev => ({
      ...prev,
      categoryName: selectedCategory?.name || "",
      subCategoryName: selectedSubCategory?.name || "",
    }));
  }, [formData.businessCategory, formData.subCategory, categoryList, subCategoryList]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData((prev) => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formPayload = new FormData();
      formPayload.append("title", formData.title);
      formPayload.append("type", formData.type);
      formPayload.append("category", formData.businessCategory);
      formPayload.append("subCategory", formData.subCategory);
      formPayload.append("categoryName", formData.categoryName);
      formPayload.append("subCategoryName", formData.subCategoryName);
      formPayload.append("redirectUrl", formData.redirectUrl);
      formPayload.append("status", formData.status);
      if (formData.image) formPayload.append("image", formData.image);

      await postData("advertisements/create-advertisements", formPayload);
      navigate("/admin/advertisements");
    } catch (error) {
      console.error("Error uploading advertisement:", error);
      alert("Error uploading advertisement");
    }
  };

  return (
    <AdminLayout title="Add New Advertisement">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Add New Advertisement</h1>
        <Link to="/admin/advertisements">
          <Button className="bg-blue-500 hover:bg-blue-600">
            All Advertisements
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-md border shadow-sm p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="Enter advertisement title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <select
                id="type"
                name="type"
                className="w-full px-3 py-2 border rounded-md"
                value={formData.type}
                onChange={handleInputChange}
                required
              >
                <option >Select a Type</option>
                <option value="Top"> All Listing Top</option>
                <option value="Bottom">All Listing Bottom</option>
                <option value="Right">Under Listing Right Side</option>
                <option value="Center">All Listing Center</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="businessCategory">Business Category *</Label>
              <select
                id="businessCategory"
                name="businessCategory"
                className="w-full px-3 py-2 border rounded-md"
                value={formData.businessCategory}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Category</option>
                {categoryList.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subCategory">Sub Category</Label>
              <select
                id="subCategory"
                name="subCategory"
                className="w-full px-3 py-2 border rounded-md"
                value={formData.subCategory}
                onChange={handleInputChange}
              >
                <option value="">Select Sub Category</option>
                {subCategoryList.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="redirectUrl">Redirect URL</Label>
              <Input
                id="redirectUrl"
                name="redirectUrl"
                placeholder="https://example.com"
                value={formData.redirectUrl}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                name="status"
                className="w-full px-3 py-2 border rounded-md"
                value={formData.status}
                onChange={handleInputChange}
              >
                <option value="Inactive">Inactive</option>
                <option value="Active">Active</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Advertisement Image</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
              <div className="space-y-2">
                <div className="flex justify-center">
                  <input
                    type="file"
                    id="imageUpload"
                    name="image"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: "none" }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="bg-gray-200 hover:bg-gray-300"
                    onClick={() =>
                      document.getElementById("imageUpload")?.click()
                    }
                  >
                    Upload Image
                  </Button>
                </div>
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="mx-auto mt-4 w-48 h-32 object-contain border"
                  />
                )}
                <p className="text-sm text-gray-500">
                  Supported formats: JPG, PNG, GIF
                </p>
                {/* <p className="text-sm text-gray-500">
                  Supported Banner Size
                </p> */}
                <p className="text-sm text-blue-500">
                  All Listing Top and Bottom:- 1100 * 200
                </p>
                <p className="text-sm text-blue-500">
                  Under Listing Right Side :- 350 * 250
                </p>
                <p className="text-sm text-blue-500">
                  All Listing Center :- 550 * 130
                </p>
              </div>
            </div>
          </div>

          <Button type="submit" className="bg-blue-500 hover:bg-blue-600 px-6">
            Submit Advertisement
          </Button>
        </form>
      </div>
    </AdminLayout>
  );
};

export default AddNewAdvertisement;
