import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function EditProduct() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock_quantity: "1",
    category: "",
    negotiable: false,
  });
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [newImagePreviews, setNewImagePreviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const categories = [
    "Electronics",
    "Fashion",
    "Groceries",
    "Home & Living",
    "Beauty & Personal Care",
    "Agriculture",
    "Motorcycle Parts & Accessories",
    "Construction Materials",
    "Office & School Supplies",
    "Baby & Kids",
    "Gaming",
    "Sports & Fitness",
    "Automotive",
    "Pet Supplies",
    "Kitchen & Dining",
    "Books & Educational Materials",
    "Gifts & Crafts",
    "Music & Audio Equipment",
    "Electrical & Solar Equipment",
    "Health & Wellness",
    "Other",
  ];

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchProduct();
  }, [id, user]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/products/${id}`, {
        credentials: "include",
      });
      const data = await response.json();
      
      if (data.success) {
        const product = data.product;
        
        // Check ownership
        if (product.owner_id !== user.id) {
          navigate("/my-products");
          return;
        }

        setFormData({
          name: product.name || "",
          description: product.description || "",
          price: product.price || "",
          stock_quantity: product.stock_quantity || "1",
          category: product.category || "",
          negotiable: product.negotiable || false,
        });

        // Set existing images
        if (product.images && product.images.length > 0) {
          setExistingImages(product.images);
        } else if (product.image_urls) {
          const urls = Array.isArray(product.image_urls) ? product.image_urls : [product.image_urls];
          setExistingImages(urls.map((url, i) => ({ id: `existing-${i}`, image_url: url, position: i + 1 })));
        }
      } else {
        setError("Product not found");
      }
    } catch (err) {
      setError("Failed to load product");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin text-6xl">⚡</div>
          <p className="text-gray-500 mt-4">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <span className="text-6xl">🔒</span>
          <h2 className="text-2xl font-bold text-gray-700 mt-4">Please sign in</h2>
          <button onClick={() => navigate("/login")} className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-full">Sign In</button>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
    setError("");
  };

  const handleNewImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + newImages.length + existingImages.length > 5) {
      setError("Maximum 5 images allowed");
      return;
    }
    setNewImages([...newImages, ...files]);
    const previews = files.map((file) => URL.createObjectURL(file));
    setNewImagePreviews([...newImagePreviews, ...previews]);
  };

  const removeExistingImage = (index) => {
    setExistingImages(existingImages.filter((_, i) => i !== index));
  };

  const removeNewImage = (index) => {
    setNewImages(newImages.filter((_, i) => i !== index));
    setNewImagePreviews(newImagePreviews.filter((_, i) => i !== index));
  };

  const uploadNewImagesToCloudinary = async () => {
    if (newImages.length === 0) return [];

    setUploading(true);
    const formData = new FormData();
    newImages.forEach((image) => {
      formData.append("images", image);
    });

    try {
      const response = await fetch("http://localhost:5000/api/upload/multiple", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        return data.images.map((img) => img.url);
      } else {
        throw new Error(data.message || "Image upload failed");
      }
    } catch (err) {
      throw new Error("Image upload failed: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.name.trim()) { setError("Product name is required"); return; }
    if (!formData.description.trim()) { setError("Description is required"); return; }
    if (!formData.price || Number(formData.price) <= 0) { setError("Please enter a valid price"); return; }
    if (!formData.category) { setError("Please select a category"); return; }

    setSaving(true);

    try {
      // Upload new images if any
      let newImageUrls = [];
      if (newImages.length > 0) {
        try {
          newImageUrls = await uploadNewImagesToCloudinary();
        } catch (uploadErr) {
          setError(uploadErr.message);
          setSaving(false);
          return;
        }
      }

      // Combine existing image URLs with new ones
      const existingUrls = existingImages.map(img => img.image_url);
      const allImageUrls = [...existingUrls, ...newImageUrls];

      // Update product
      const response = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: formData.name.trim(),
          description: formData.description.trim(),
          price: Number(formData.price),
          stock_quantity: Number(formData.stock_quantity) || 1,
          category: formData.category,
          negotiable: formData.negotiable,
          image_urls: allImageUrls,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess("Product updated successfully!");
        setTimeout(() => navigate("/my-products"), 1500);
      } else {
        setError(data.message || "Failed to update product");
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-2xl mx-auto px-4">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Edit Product ✏️</h1>
            <p className="text-gray-500 mt-1">Update your product details</p>
          </div>
          <Link
            to="/my-products"
            className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-full font-medium hover:bg-gray-50 transition"
          >
            ← Back
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-8 border border-gray-100">
          {success && <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm font-medium">{success}</div>}
          {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="e.g. iPhone 14 Pro Max" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
              <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Describe your product in detail..." rows={4} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price (RWF) *</label>
                <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="0" min="0" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
                <input type="number" name="stock_quantity" value={formData.stock_quantity} onChange={handleChange} placeholder="1" min="1" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <select name="category" value={formData.category} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white">
                <option value="">Select a category...</option>
                {categories.map((cat) => (<option key={cat} value={cat}>{cat}</option>))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <input type="checkbox" name="negotiable" checked={formData.negotiable} onChange={handleChange} className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
              <label className="text-sm text-gray-700">Price is negotiable</label>
            </div>

            {/* Existing Images */}
            {existingImages.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Images</label>
                <div className="grid grid-cols-5 gap-2">
                  {existingImages.map((img, index) => (
                    <div key={index} className="relative">
                      <img src={img.image_url} alt={`Existing ${index + 1}`} className="w-full h-20 object-cover rounded-lg" />
                      <button type="button" onClick={() => removeExistingImage(index)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600">✕</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New Images */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Add New Images (Max 5 total)</label>
              {newImagePreviews.length > 0 && (
                <div className="grid grid-cols-5 gap-2 mb-3">
                  {newImagePreviews.map((preview, index) => (
                    <div key={index} className="relative">
                      <img src={preview} alt={`New ${index + 1}`} className="w-full h-20 object-cover rounded-lg" />
                      <button type="button" onClick={() => removeNewImage(index)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600">✕</button>
                    </div>
                  ))}
                </div>
              )}
              <label className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 transition">
                <span className="text-2xl">📷</span>
                <span className="text-sm text-gray-600">Click to upload new images</span>
                <input type="file" accept="image/*" multiple onChange={handleNewImageChange} className="hidden" />
              </label>
            </div>

            <div className="flex gap-3">
              <button type="submit" disabled={saving || uploading} className="flex-1 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed">
                {uploading ? "Uploading images..." : saving ? "Saving..." : "💾 Save Changes"}
              </button>
              <Link to="/my-products" className="px-6 py-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-bold text-lg">
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditProduct;