import React, { useState, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import {
  collection,
  query,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { useFirebaseStorageUpload } from "@/hooks/useFirebaseStorageUpload";
import { Advertisement } from "@/types";
import { Plus, Edit, Trash2, Eye, EyeOff, ExternalLink } from "lucide-react";
import toast from "react-hot-toast";
import UploadAdFile from "@/components/admin/UploadAdFile";

const AdminAdvertisements: React.FC = () => {
  const { user } = useAuth();
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAd, setEditingAd] = useState<Advertisement | null>(null);
  const { uploading, uploadImage, deleteImage } = useFirebaseStorageUpload();

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    link: "",
    position: "featured" as Advertisement["position"],
    isActive: true,
    advertiserName: "",
    advertiserEmail: "",
    startDate: "",
    endDate: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  // If the image was uploaded by the helper component, store its data here
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>("");
  const [uploadedImagePath, setUploadedImagePath] = useState<string>("");

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, "advertisements"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ads = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Advertisement[];

      // Sort by order
      ads.sort((a, b) => a.order - b.order);
      setAdvertisements(ads);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile && !editingAd) {
      toast.error("Please select an image");
      return;
    }

    try {
      let imageUrl = editingAd?.imageUrl || "";
      let imagePath = editingAd?.imagePath || "";

      // If an image was already uploaded via the UploadAdFile helper, prefer that
      if (uploadedImageUrl) {
        imageUrl = uploadedImageUrl;
        imagePath = uploadedImagePath;
      } else if (selectedFile) {
        // Upload directly to Firebase Storage using client SDK
        const result = await uploadImage(selectedFile, "advertisements");
        if (!result) {
          toast.error("Upload failed");
          return;
        }
        imageUrl = result.url;
        imagePath = result.path;
      }

      const adData = {
        title: formData.title,
        imageUrl,
        imagePath,
        link: formData.link || undefined,
        position: formData.position,
        isActive: formData.isActive,
        order: editingAd ? editingAd.order : advertisements.length + 1,
        clickCount: editingAd ? editingAd.clickCount : 0,
        impressions: editingAd ? editingAd.impressions : 0,
        advertiserName: formData.advertiserName || undefined,
        advertiserEmail: formData.advertiserEmail || undefined,
        startDate: formData.startDate
          ? Timestamp.fromDate(new Date(formData.startDate))
          : undefined,
        endDate: formData.endDate
          ? Timestamp.fromDate(new Date(formData.endDate))
          : undefined,
        updatedAt: Timestamp.now(),
      };

      if (editingAd) {
        await updateDoc(doc(db, "advertisements", editingAd.id!), adData);
        toast.success("Advertisement updated successfully");
      } else {
        await addDoc(collection(db, "advertisements"), {
          ...adData,
          createdAt: Timestamp.now(),
        });
        toast.success("Advertisement created successfully");
      }

      resetForm();
    } catch (error) {
      console.error("Error saving advertisement:", error);
      toast.error("Failed to save advertisement");
    }
  };

  const handleEdit = (ad: Advertisement) => {
    setEditingAd(ad);
    setFormData({
      title: ad.title,
      link: ad.link || "",
      position: ad.position,
      isActive: ad.isActive,
      advertiserName: ad.advertiserName || "",
      advertiserEmail: ad.advertiserEmail || "",
      startDate: ad.startDate
        ? ad.startDate.toDate().toISOString().split("T")[0]
        : "",
      endDate: ad.endDate
        ? ad.endDate.toDate().toISOString().split("T")[0]
        : "",
    });
    setImagePreview(ad.imageUrl);
    // clear any previously uploaded transient image data
    setUploadedImageUrl("");
    setUploadedImagePath("");
    setShowForm(true);
  };

  const handleDelete = async (adId: string) => {
    if (!confirm("Are you sure you want to delete this advertisement?")) return;

    try {
      // Find the advertisement to get the image path
      const adToDelete = advertisements.find((ad) => ad.id === adId);
      if (adToDelete?.imagePath) {
        // If this ad was uploaded to Cloudinary (imageUrl contains cloudinary domain), call the server delete API
        if (adToDelete.imageUrl && adToDelete.imageUrl.includes("cloudinary")) {
          try {
            await fetch(`/api/upload/delete?public_id=${encodeURIComponent(adToDelete.imagePath)}`, {
              method: "DELETE",
            });
          } catch (err) {
            console.warn("Cloudinary delete failed (continuing):", err);
          }
        } else {
          // Fallback: delete from Firebase Storage
          await deleteImage(adToDelete.imagePath);
        }
      }

      await deleteDoc(doc(db, "advertisements", adId));
      toast.success("Advertisement deleted successfully");
    } catch (error) {
      console.error("Error deleting advertisement:", error);
      toast.error("Failed to delete advertisement");
    }
  };

  const toggleActive = async (ad: Advertisement) => {
    try {
      await updateDoc(doc(db, "advertisements", ad.id!), {
        isActive: !ad.isActive,
        updatedAt: Timestamp.now(),
      });
      toast.success(
        `Advertisement ${!ad.isActive ? "activated" : "deactivated"}`
      );
    } catch (error) {
      console.error("Error toggling advertisement status:", error);
      toast.error("Failed to update advertisement status");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      link: "",
      position: "featured",
      isActive: true,
      advertiserName: "",
      advertiserEmail: "",
      startDate: "",
      endDate: "",
    });
    setSelectedFile(null);
    setImagePreview("");
    setUploadedImageUrl("");
    setUploadedImagePath("");
    setEditingAd(null);
    setShowForm(false);
  };

  if (loading) {
    return (
      <ProtectedRoute
        requireAuth={true}
        allowedRoles={["admin", "super_admin"]}
      >
        <DashboardLayout title="Manage Advertisements">
          <div className="flex justify-center items-center py-12">
            <div className="text-gray-600">Loading advertisements...</div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requireAuth={true} allowedRoles={["admin", "super_admin"]}>
      <Head>
        <title>Manage Advertisements - Admin</title>
        <meta name="description" content="Manage platform advertisements" />
      </Head>

      <DashboardLayout title="Manage Advertisements">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Advertisements
              </h1>
              <p className="text-gray-600">
                Manage advertisement images displayed on the platform
              </p>
            </div>
            <Button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Advertisement
            </Button>
          </div>

          {/* Form Modal */}
          {showForm && (
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">
                    {editingAd ? "Edit Advertisement" : "Add New Advertisement"}
                  </h2>
                  <Button variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) =>
                          setFormData({ ...formData, title: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Advertisement title"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Position *
                      </label>
                      <select
                        value={formData.position}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            position: e.target
                              .value as Advertisement["position"],
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="featured">Featured</option>
                        <option value="leaderboard">Leaderboard</option>
                        <option value="sidebar">Sidebar</option>
                        <option value="mobile">Mobile</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Link (optional)
                    </label>
                    <input
                      type="url"
                      value={formData.link}
                      onChange={(e) =>
                        setFormData({ ...formData, link: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="https://example.com"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Advertiser Name
                      </label>
                      <input
                        type="text"
                        value={formData.advertiserName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            advertiserName: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Company name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Advertiser Email
                      </label>
                      <input
                        type="email"
                        value={formData.advertiserEmail}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            advertiserEmail: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="contact@company.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Start Date
                      </label>
                      <input
                        type="date"
                        value={formData.startDate}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            startDate: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        End Date
                      </label>
                      <input
                        type="date"
                        value={formData.endDate}
                        onChange={(e) =>
                          setFormData({ ...formData, endDate: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Image *
                    </label>

                    <div className="space-y-4">
                      <UploadAdFile
                        onUploaded={(res) => {
                          setUploadedImageUrl(res.url);
                          // Cloudinary returns a public_id; store that so we can delete later
                          setUploadedImagePath(res.publicId);
                          setImagePreview(res.url);
                        }}
                      />

                      {/* Keep preview if available */}
                      {imagePreview && (
                        <div className="relative w-full max-w-md">
                          <Image
                            src={imagePreview}
                            alt="Preview"
                            width={400}
                            height={192}
                            className="w-full h-48 object-cover rounded-md border"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={formData.isActive}
                      onChange={(e) =>
                        setFormData({ ...formData, isActive: e.target.checked })
                      }
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="isActive"
                      className="ml-2 text-sm text-gray-700"
                    >
                      Active
                    </label>
                  </div>

                  <div className="flex gap-4">
                    <Button type="submit" disabled={uploading}>
                      {uploading
                        ? "Uploading..."
                        : editingAd
                        ? "Update"
                        : "Create"}{" "}
                      Advertisement
                    </Button>
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Advertisements List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {advertisements.map((ad) => (
              <Card key={ad.id} className="overflow-hidden">
                <div className="relative">
                  <Image
                    src={ad.imageUrl}
                    alt={ad.title}
                    width={400}
                    height={192}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-2 right-2 flex gap-2">
                    <Button
                      size="sm"
                      variant={ad.isActive ? "primary" : "secondary"}
                      onClick={() => toggleActive(ad)}
                      className="h-8 w-8 p-0"
                    >
                      {ad.isActive ? (
                        <Eye className="h-4 w-4" />
                      ) : (
                        <EyeOff className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <div className="absolute top-2 left-2">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        ad.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {ad.position}
                    </span>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{ad.title}</h3>
                  {ad.link && (
                    <div className="flex items-center text-sm text-blue-600 mb-2">
                      <ExternalLink className="h-4 w-4 mr-1" />
                      {ad.link}
                    </div>
                  )}
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                    <span>Clicks: {ad.clickCount}</span>
                    <span>Impressions: {ad.impressions}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(ad)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      color="red"
                      onClick={() => handleDelete(ad.id!)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {advertisements.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <div className="text-gray-400 mb-4">
                  <Plus className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No advertisements yet
                </h3>
                <p className="text-gray-600 mb-4">
                  Get started by adding your first advertisement
                </p>
                <Button onClick={() => setShowForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Advertisement
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default AdminAdvertisements;
