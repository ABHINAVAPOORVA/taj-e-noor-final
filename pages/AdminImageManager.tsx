import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { useState, useEffect, useRef, DragEvent } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Edit2, Save, X, Upload, RefreshCw, UploadCloud, CheckCircle2 } from "lucide-react";
import { projectId, publicAnonKey } from "../utils/supabase/info";
import { useAuth } from "../contexts/AuthContext";
import { getAuthToken } from "../utils/api";
import { toast } from "sonner@2.0.3";

interface ImageItem {
  id: string;
  category: string;
  name: string;
  currentUrl: string;
  componentPath: string;
}

export default function AdminImageManager() {
  const { session } = useAuth();
  const [images, setImages] = useState<ImageItem[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [filterCategory, setFilterCategory] = useState("All");
  const [dragOver, setDragOver] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentEditingFile, setCurrentEditingFile] = useState<File | null>(null);

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-e031cba6/images`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setImages(data.images || getDefaultImages());
      } else {
        setImages(getDefaultImages());
      }
    } catch (error) {
      console.error("Error loading images:", error);
      setImages(getDefaultImages());
    } finally {
      setLoading(false);
    }
  };

  const getDefaultImages = (): ImageItem[] => {
    return [
      // Hero Section
      {
        id: "hero-main",
        category: "Hero",
        name: "Main Hero Image",
        currentUrl: "https://images.unsplash.com/photo-1656593447226-6e2abf722d2c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwbHV4dXJ5JTIwaG90ZWwlMjBleHRlcmlvcnxlbnwxfHx8fDE3NjM5MDU1MDZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
        componentPath: "HeroSection.tsx"
      },
      // Rooms
      {
        id: "room-deluxe",
        category: "Rooms",
        name: "Deluxe Room",
        currentUrl: "https://images.unsplash.com/photo-1742821855309-d26c83bdfe1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb3lhbCUyMHZpbnRhZ2UlMjBob3RlbCUyMGJlZHJvb218ZW58MXx8fHwxNzYzOTA1NTA3fDA&ixlib=rb-4.1.0&q=80&w=1080",
        componentPath: "RoomsSection.tsx"
      },
      {
        id: "room-suite",
        category: "Rooms",
        name: "Premium Suite",
        currentUrl: "https://images.unsplash.com/photo-1725623831897-fb009acfe742?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcHVsZW50JTIwdmludGFnZSUyMGhvdGVsJTIwc3VpdGV8ZW58MXx8fHwxNzYzOTA1NTA3fDA&ixlib=rb-4.1.0&q=80&w=1080",
        componentPath: "RoomsSection.tsx"
      },
      // Amenities
      {
        id: "amenity-pool",
        category: "Amenities",
        name: "Infinity Pool",
        currentUrl: "https://images.unsplash.com/photo-1553521245-afd67cef42e4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwbHV4dXJ5JTIwaG90ZWwlMjBwb29sfGVufDF8fHx8MTc2MzkwNTUwOHww&ixlib=rb-4.1.0&q=80&w=1080",
        componentPath: "AmenitiesSection.tsx"
      },
      {
        id: "amenity-spa",
        category: "Amenities",
        name: "Luxury Spa",
        currentUrl: "https://images.unsplash.com/photo-1715979166019-dc4e1e0784fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb3lhbCUyMHNwYSUyMHdlbGxuZXNzJTIwdmludGFnZXxlbnwxfHx8fDE3NjM5MDU1MDh8MA&ixlib=rb-4.1.0&q=80&w=1080",
        componentPath: "AmenitiesSection.tsx"
      },
      {
        id: "amenity-gym",
        category: "Amenities",
        name: "State-of-the-Art Gym",
        currentUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwaG90ZWwlMjBneW18ZW58MXx8fHwxNzYzOTA1NTA5fDA&ixlib=rb-4.1.0&q=80&w=1080",
        componentPath: "AmenitiesSection.tsx"
      },
      // Dining
      {
        id: "dining-restaurant",
        category: "Dining",
        name: "Fine Dining Restaurant",
        currentUrl: "https://images.unsplash.com/photo-1529692836580-0f46d37b64ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB2aW50YWdlJTIwcmVzdGF1cmFudHxlbnwxfHx8fDE3NjM5MDU1MDl8MA&ixlib=rb-4.1.0&q=80&w=1080",
        componentPath: "DiningSection.tsx"
      },
      {
        id: "dining-bar",
        category: "Dining",
        name: "Private Bar",
        currentUrl: "https://images.unsplash.com/photo-1631897031201-ee7a69ac1700?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGFzc2ljJTIwbHV4dXJ5JTIwYmFyfGVufDF8fHx8MTc2MzkwNTUwOXww&ixlib=rb-4.1.0&q=80&w=1080",
        componentPath: "DiningSection.tsx"
      },
      // Gallery
      {
        id: "gallery-1",
        category: "Gallery",
        name: "Hotel Exterior Night",
        currentUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob3RlbCUyMG5pZ2h0fGVufDF8fHx8MTc2MzkwNTUxMHww&ixlib=rb-4.1.0&q=80&w=1080",
        componentPath: "Gallery.tsx"
      },
      {
        id: "gallery-2",
        category: "Gallery",
        name: "Lobby Interior",
        currentUrl: "https://images.unsplash.com/photo-1530803628556-e2bdf73cdb36?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGFzc2ljJTIwaG90ZWwlMjBsb2JieXxlbnwxfHx8fDE3NjM5MDU1MTB8MA&ixlib=rb-4.1.0&q=80&w=1080",
        componentPath: "Gallery.tsx"
      },
    ];
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>, imageId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(imageId);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(null);
  };

  const handleDrop = async (e: DragEvent<HTMLDivElement>, imageId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(null);

    const files = e.dataTransfer?.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    await uploadAndUpdateImage(file, imageId);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>, imageId: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    await uploadAndUpdateImage(file, imageId);
  };

  const uploadAndUpdateImage = async (file: File, imageId: string) => {
    // Get token from localStorage
    const token = getAuthToken();
    
    if (!token) {
      toast.error("Please sign in to upload images");
      return;
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error("Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed");
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5242880) {
      toast.error("File too large. Maximum size is 5MB");
      return;
    }

    try {
      setUploading(true);
      const loadingToast = toast.loading("Uploading image...");

      console.log("🔄 Starting upload...");
      console.log("📁 File:", file.name, file.type, file.size);
      console.log("🔑 Token:", token.substring(0, 20) + "...");

      // Upload to server
      const formData = new FormData();
      formData.append('file', file);

      const uploadUrl = `https://${projectId}.supabase.co/functions/v1/make-server-e031cba6/upload-image`;
      console.log("📤 Uploading to:", uploadUrl);

      const uploadResponse = await fetch(uploadUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      console.log("📥 Response status:", uploadResponse.status);
      console.log("📥 Response headers:", Object.fromEntries(uploadResponse.headers.entries()));

      // Get response text first to handle non-JSON responses
      const responseText = await uploadResponse.text();
      console.log("📥 Response text:", responseText.substring(0, 200));

      if (!uploadResponse.ok) {
        let errorMessage = 'Upload failed';
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          errorMessage = `Server error: ${responseText.substring(0, 100)}`;
        }
        throw new Error(errorMessage);
      }

      const uploadData = JSON.parse(responseText);
      console.log("✅ Upload successful:", uploadData);

      const imageUrl = uploadData.url;

      // Update image URL in database
      console.log("🔄 Updating image in database...");
      const updateResponse = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-e031cba6/images/${imageId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({ url: imageUrl }),
        }
      );

      if (!updateResponse.ok) {
        throw new Error('Failed to update image');
      }

      console.log("✅ Image updated in database");

      // Update local state
      setImages(prev =>
        prev.map(img =>
          img.id === imageId ? { ...img, currentUrl: imageUrl } : img
        )
      );

      toast.dismiss(loadingToast);
      toast.success("Image uploaded and updated successfully!");
      
    } catch (error: any) {
      console.error("❌ Upload error:", error);
      toast.dismiss();
      toast.error(error.message || "Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const categories = ["All", ...Array.from(new Set(images.map(img => img.category)))];
  
  const filteredImages = filterCategory === "All" 
    ? images 
    : images.filter(img => img.category === filterCategory);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <RefreshCw className="animate-spin" size={48} />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-amber-50 to-white">
      <Header />
      
      <main className="flex-1 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl mb-2">Image Manager</h1>
            <p className="text-gray-600 mb-4">
              Drag and drop images to update, or click the upload button
            </p>
            <div className="flex items-center gap-2 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <UploadCloud className="text-blue-600" size={20} />
              <p className="text-sm text-blue-800">
                <strong>Drag & Drop Enabled!</strong> Simply drag an image file onto any card below to replace it. Maximum file size: 5MB. Supported formats: JPEG, PNG, GIF, WebP.
              </p>
            </div>
          </div>

          {/* Category Filter */}
          <div className="mb-6 flex gap-2 flex-wrap">
            {categories.map(cat => (
              <Button
                key={cat}
                variant={filterCategory === cat ? "default" : "outline"}
                onClick={() => setFilterCategory(cat)}
                className="min-w-[100px]"
              >
                {cat}
              </Button>
            ))}
          </div>

          {/* Images Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredImages.map((image) => (
              <Card 
                key={image.id}
                className={`overflow-hidden transition-all ${
                  dragOver === image.id 
                    ? 'ring-4 ring-blue-500 scale-105 shadow-xl' 
                    : 'hover:shadow-lg'
                } ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
                onDragOver={(e) => handleDragOver(e, image.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, image.id)}
              >
                <CardContent className="p-0">
                  {/* Image Preview */}
                  <div className="relative aspect-video bg-gray-100 overflow-hidden group">
                    <ImageWithFallback
                      src={image.currentUrl}
                      alt={image.name}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Drag Overlay */}
                    {dragOver === image.id && (
                      <div className="absolute inset-0 bg-blue-500 bg-opacity-90 flex items-center justify-center z-10">
                        <div className="text-center text-white">
                          <UploadCloud size={48} className="mx-auto mb-2" />
                          <p className="font-semibold">Drop to upload</p>
                        </div>
                      </div>
                    )}

                    {/* Upload Button Overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center">
                      <Button
                        onClick={() => {
                          const input = document.getElementById(`file-${image.id}`) as HTMLInputElement;
                          input?.click();
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        size="lg"
                      >
                        <Upload size={20} className="mr-2" />
                        Upload New Image
                      </Button>
                    </div>

                    {/* Hidden File Input */}
                    <input
                      id={`file-${image.id}`}
                      type="file"
                      accept="image/jpeg,image/png,image/gif,image/webp"
                      className="hidden"
                      onChange={(e) => handleFileSelect(e, image.id)}
                    />
                  </div>

                  {/* Image Info */}
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-lg">{image.name}</h3>
                        <p className="text-sm text-gray-500">{image.category}</p>
                      </div>
                      <span className="px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded">
                        {image.componentPath}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 truncate mt-2">
                      {image.currentUrl}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {filteredImages.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No images found in this category</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}