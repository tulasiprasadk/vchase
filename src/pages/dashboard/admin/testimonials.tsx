import React, { useEffect, useState } from "react";
import Head from "next/head";
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
import UploadAdFile from "@/components/admin/UploadAdFile";
import toast from "react-hot-toast";

interface Testimonial {
  id?: string;
  name: string;
  title?: string;
  message: string;
  imageUrl?: string;
  imagePath?: string;
  isActive?: boolean;
  createdAt?: Timestamp | null;
  updatedAt?: Timestamp | null;
}

const AdminTestimonials: React.FC = () => {
  const { user } = useAuth();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);

  const [form, setForm] = useState({
    name: "",
    title: "",
    message: "",
    isActive: true,
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>("");
  const [uploadedImagePath, setUploadedImagePath] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);

  const { uploading, uploadImage, deleteImage } = useFirebaseStorageUpload();

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "testimonials"));
    const unsub = onSnapshot(q, (snap) => {
      const items = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as Testimonial[];
      // sort newest first
      items.sort((a, b) => {
        const ta = a.createdAt ? a.createdAt.seconds || 0 : 0;
        const tb = b.createdAt ? b.createdAt.seconds || 0 : 0;
        return tb - ta;
      });
      setTestimonials(items);
      setLoading(false);
    });

    return () => unsub();
  }, [user]);

  const resetForm = () => {
    setForm({ name: "", title: "", message: "", isActive: true });
    setSelectedFile(null);
    setUploadedImageUrl("");
    setUploadedImagePath("");
    setEditing(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim() || !form.message.trim()) {
      toast.error("Please provide name and message");
      return;
    }

    if (isUploading) {
      toast.error("Image is still uploading — please wait");
      return;
    }

    try {
      let imageUrl = editing?.imageUrl || "";
      let imagePath = editing?.imagePath || "";

      if (uploadedImageUrl) {
        imageUrl = uploadedImageUrl;
        imagePath = uploadedImagePath;
      } else if (selectedFile) {
        const res = await uploadImage(selectedFile, "testimonials");
        if (!res) {
          toast.error("Image upload failed");
          return;
        }
        imageUrl = res.url;
        imagePath = res.path;
      }

      const payload: Partial<Testimonial> = {
        name: form.name,
        title: form.title || undefined,
        message: form.message,
        imageUrl: imageUrl || undefined,
        imagePath: imagePath || undefined,
        isActive: form.isActive,
        updatedAt: Timestamp.now(),
      };

      if (editing) {
        await updateDoc(doc(db, "testimonials", editing.id!), payload);
        toast.success("Testimonial updated");
      } else {
        await addDoc(collection(db, "testimonials"), {
          ...payload,
          createdAt: Timestamp.now(),
        });
        toast.success("Testimonial created");
      }

      resetForm();
    } catch (err) {
      console.error("Error saving testimonial", err);
      toast.error("Failed to save testimonial");
    }
  };

  const handleEdit = (t: Testimonial) => {
    setEditing(t);
    setForm({
      name: t.name || "",
      title: t.title || "",
      message: t.message || "",
      isActive: t.isActive !== false,
    });
    setUploadedImageUrl("");
    setUploadedImagePath("");
    setShowForm(true);
  };

  const handleDelete = async (t: Testimonial) => {
    if (!confirm("Delete this testimonial?")) return;

    try {
      if (t.imagePath) {
        if (t.imageUrl && t.imageUrl.includes("cloudinary")) {
          try {
            await fetch(
              `/api/upload/delete?public_id=${encodeURIComponent(t.imagePath)}`,
              {
                method: "DELETE",
              }
            );
          } catch (e) {
            console.warn("Cloudinary delete failed (continuing):", e);
          }
        } else {
          await deleteImage(t.imagePath);
        }
      }
      await deleteDoc(doc(db, "testimonials", t.id!));
      toast.success("Testimonial deleted");
    } catch (err) {
      console.error("Error deleting testimonial", err);
      toast.error("Failed to delete testimonial");
    }
  };

  if (loading) {
    return (
      <ProtectedRoute
        requireAuth={true}
        allowedRoles={["admin", "super_admin"]}
      >
        <DashboardLayout title="Manage Testimonials">
          <div className="py-12 text-center text-gray-700">
            Loading testimonials...
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requireAuth={true} allowedRoles={["admin", "super_admin"]}>
      <Head>
        <title>Manage Testimonials - Admin</title>
      </Head>

      <DashboardLayout title="Manage Testimonials">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Testimonials</h1>
              <p className="text-gray-700">
                Manage user testimonials shown on the site
              </p>
            </div>
            <Button onClick={() => setShowForm(true)}>Add Testimonial</Button>
          </div>

          {showForm && (
            <Card>
              <CardContent>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">
                    {editing ? "Edit Testimonial" : "Add Testimonial"}
                  </h2>
                  <Button variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Name *
                      </label>
                      <input
                        required
                        value={form.name}
                        onChange={(e) =>
                          setForm({ ...form, name: e.target.value })
                        }
                        className="w-full px-3 py-2 border rounded"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Title
                      </label>
                      <input
                        value={form.title}
                        onChange={(e) =>
                          setForm({ ...form, title: e.target.value })
                        }
                        className="w-full px-3 py-2 border rounded"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Message *
                    </label>
                    <textarea
                      required
                      value={form.message}
                      onChange={(e) =>
                        setForm({ ...form, message: e.target.value })
                      }
                      className="w-full px-3 py-2 border rounded h-28"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Image (optional)
                    </label>
                    <UploadAdFile
                      onUploaded={(res) => {
                        // use the Cloudinary hook shape: url and publicId
                        setUploadedImageUrl(res.url || "");
                        setUploadedImagePath(res.publicId || "");
                      }}
                      onUploading={(u) => setIsUploading(u)}
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <Button type="submit" disabled={isUploading || uploading}>
                      {editing ? "Update" : "Create"}
                    </Button>
                    <Button variant="ghost" onClick={resetForm}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {testimonials.map((t) => (
              <Card key={t.id}>
                <CardContent>
                  <div className="flex gap-4">
                    {t.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={t.imageUrl}
                        alt={t.name}
                        className="w-20 h-20 object-cover rounded"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-gray-100 rounded flex items-center justify-center text-sm text-gray-500">
                        No Image
                      </div>
                    )}

                    <div className="flex-1">
                      <div className="flex justify-between">
                        <div>
                          <div className="font-semibold text-gray-900">
                            {t.name}
                          </div>
                          {t.title && (
                            <div className="text-sm text-gray-600">
                              {t.title}
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(t)}
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 border-red-200"
                            onClick={() => handleDelete(t)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>

                      <p className="mt-2 text-gray-700">{t.message}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default AdminTestimonials;
