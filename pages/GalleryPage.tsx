import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { PageTransition } from "../components/PageTransition";
import { motion } from "motion/react";
import { roomImages, diningImages, generalImages } from "../config/imageAssets";

const galleryImages = [
  {
    id: 1,
    src: generalImages.hotelExterior,
    alt: "Taj-e-Noor Exterior",
    category: "Exterior",
    description: "Majestic exterior showcasing timeless architecture"
  },
  {
    id: 2,
    src: roomImages.dreamClassicRoom,
    alt: "Dream's Classic Room",
    category: "Rooms",
    description: "Elegantly appointed classic room"
  },
  {
    id: 3,
    src: roomImages.nizamDeluxRoom,
    alt: "Nizam Delux Room",
    category: "Rooms",
    description: "Spacious deluxe suite with premium amenities"
  },
  {
    id: 4,
    src: roomImages.begumChamber,
    alt: "Begum Chamber",
    category: "Rooms",
    description: "Pet-friendly chamber with special amenities"
  },
  {
    id: 5,
    src: roomImages.emperorChamber,
    alt: "Emperor's Chamber VIP",
    category: "Rooms",
    description: "Our most luxurious VIP chamber"
  },
  {
    id: 6,
    src: diningImages.royalCourtRestaurant,
    alt: "The Royal Court Restaurant",
    category: "Dining",
    description: "Fine dining experience in elegant setting"
  },
  {
    id: 7,
    src: "https://images.unsplash.com/photo-1553521245-afd67cef42e4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwbHV4dXJ5JTIwaG90ZWwlMjBwb29sfGVufDF8fHx8MTc2MzkwNTUwOHww&ixlib=rb-4.1.0&q=80&w=1080",
    alt: "Infinity Rooftop Pool",
    category: "Amenities",
    description: "Luxurious rooftop pool with panoramic views"
  },
  {
    id: 8,
    src: "https://images.unsplash.com/photo-1715979166019-dc4e1e0784fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb3lhbCUyMHNwYSUyMHdlbGxuZXNzJTIwdmludGFnZXxlbnwxfHx8fDE3NjM5MDU1MDh8MA&ixlib=rb-4.1.0&q=80&w=1080",
    alt: "The Grand Spa",
    category: "Amenities",
    description: "World-class spa and wellness center"
  },
  {
    id: 9,
    src: "https://images.unsplash.com/photo-1574755851171-8959b8334d6e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwaG90ZWwlMjBneW0lMjBmaXRuZXNzfGVufDF8fHx8MTc2MzkwNTUwOHww&ixlib=rb-4.1.0&q=80&w=1080",
    alt: "Fitness Center",
    category: "Amenities",
    description: "State-of-the-art fitness facilities"
  },
  {
    id: 10,
    src: generalImages.hotelInterior,
    alt: "Grand Interior Courtyard",
    category: "Interior",
    description: "Stunning courtyard with Mughal architecture and water features"
  },
  {
    id: 11,
    src: "https://images.unsplash.com/photo-1656593447226-6e2abf722d2c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwbHV4dXJ5JTIwcGFsYWNlJTIwaG90ZWwlMjBleHRlcmlvcnxlbnwxfHx8fDE3NjM5MDU1MDZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    alt: "Palace Gardens",
    category: "Exterior",
    description: "Beautiful palace exterior and gardens"
  },
  {
    id: 12,
    src: "https://images.unsplash.com/photo-1760931657881-93916b137d67?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwY29ja3RhaWwlMjBiYXIlMjBsb3VuZ2V8ZW58MXx8fHwxNzYzOTA1NTEwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    alt: "Private Bar Lounge",
    category: "Dining",
    description: "Exclusive private bar with vintage charm"
  }
];

export function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const categories = ["All", "Exterior", "Rooms", "Dining", "Amenities", "Interior"];

  const filteredImages = selectedCategory === "All" 
    ? galleryImages 
    : galleryImages.filter(img => img.category === selectedCategory);

  const openImage = (id: number) => {
    setSelectedImage(id);
    setIsDialogOpen(true);
  };

  const closeImage = () => {
    setIsDialogOpen(false);
    setTimeout(() => setSelectedImage(null), 300);
  };

  const navigateImage = (direction: 'prev' | 'next') => {
    if (selectedImage === null) return;
    
    const currentIndex = filteredImages.findIndex(img => img.id === selectedImage);
    let newIndex;
    
    if (direction === 'prev') {
      newIndex = currentIndex > 0 ? currentIndex - 1 : filteredImages.length - 1;
    } else {
      newIndex = currentIndex < filteredImages.length - 1 ? currentIndex + 1 : 0;
    }
    
    setSelectedImage(filteredImages[newIndex].id);
  };

  const currentImage = filteredImages.find(img => img.id === selectedImage);

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <div className="pt-32 pb-16 px-4 bg-gradient-to-b from-amber-50 to-white">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-amber-900 mb-2 tracking-wider">VISUAL TOUR</p>
          <h1 className="text-5xl md:text-6xl mb-6">Gallery</h1>
          <p className="text-gray-600 max-w-3xl mx-auto text-lg">
            Explore the elegance and luxury of Taj-e-Noor through our curated collection of stunning imagery. From opulent suites to world-class amenities, discover what awaits you.
          </p>
        </div>
      </div>

      {/* Category Filters */}
      <section className="py-8 px-4 bg-white sticky top-[104px] z-40 border-b">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center gap-3 flex-wrap">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full transition-all ${
                  selectedCategory === category
                    ? "bg-amber-900 text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredImages.map((image) => (
              <div
                key={image.id}
                className="relative h-72 overflow-hidden rounded-lg group cursor-pointer shadow-md hover:shadow-xl transition-shadow"
                onClick={() => openImage(image.id)}
              >
                <ImageWithFallback
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
            ))}
          </div>

          {filteredImages.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">No images found in this category.</p>
            </div>
          )}
        </div>
      </section>

      {/* Image Viewer Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-6xl p-0 bg-black border-none">
          <DialogTitle className="sr-only">
            {currentImage?.alt || "Gallery Image"}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {currentImage?.description || "Full size gallery image view"}
          </DialogDescription>
          {currentImage && (
            <div className="relative">
              <button
                onClick={closeImage}
                className="absolute top-4 right-4 z-50 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full transition-colors"
              >
                <X size={24} />
              </button>

              <div className="relative">
                <ImageWithFallback
                  src={currentImage.src}
                  alt={currentImage.alt}
                  className="w-full h-[80vh] object-contain"
                />
                
                {/* Navigation Buttons */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateImage('prev');
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-colors"
                >
                  <ChevronLeft size={32} />
                </button>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateImage('next');
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-colors"
                >
                  <ChevronRight size={32} />
                </button>
              </div>

              <div className="bg-black/80 text-white p-6">
                <h3 className="text-2xl mb-2">{currentImage.alt}</h3>
                <p className="text-gray-300">{currentImage.description}</p>
                <p className="text-sm text-amber-400 mt-2">{currentImage.category}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}