import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Button } from "./ui/button";
import { useState } from "react";
import { generalImages } from "../config/imageAssets";
import royalDiningImage from "figma:asset/6f40939ebc2d770f428d068eb9051e2a842558ee.png";

const galleryImages = [
  {
    id: 1,
    src: generalImages.hotelExterior,
    alt: "Hotel Exterior",
    category: "Exterior"
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1742821855309-d26c83bdfe1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb3lhbCUyMHZpbnRhZ2UlMjBob3RlbCUyMGJlZHJvb218ZW58MXx8fHwxNzYzOTA1NTA3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    alt: "Deluxe Room",
    category: "Rooms"
  },
  {
    id: 3,
    src: royalDiningImage,
    alt: "Restaurant",
    category: "Dining"
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1553521245-afd67cef42e4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwbHV4dXJ5JTIwaG90ZWwlMjBwb29sfGVufDF8fHx8MTc2MzkwNTUwOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    alt: "Pool",
    category: "Amenities"
  },
  {
    id: 5,
    src: "https://images.unsplash.com/photo-1715979166019-dc4e1e0784fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb3lhbCUyMHNwYSUyMHdlbGxuZXNzJTIwdmludGFnZXxlbnwxfHx8fDE3NjM5MDU1MDh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    alt: "Spa",
    category: "Amenities"
  },
  {
    id: 6,
    src: "https://images.unsplash.com/photo-1725623831897-fb009acfe742?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcHVsZW50JTIwdmludGFnZSUyMGhvdGVsJTIwc3VpdGV8ZW58MXx8fHwxNzYzOTA1NTA3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    alt: "Suite",
    category: "Rooms"
  }
];

export function GallerySection() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const categories = ["All", "Exterior", "Rooms", "Dining", "Amenities"];

  const filteredImages = selectedCategory === "All" 
    ? galleryImages 
    : galleryImages.filter(img => img.category === selectedCategory);

  return (
    <section id="gallery" className="py-20 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-red-900 mb-2 tracking-wider">VISUAL TOUR</p>
          <h2 className="text-4xl md:text-5xl mb-4">Gallery</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg mb-8">
            Explore our stunning property through these captivating images
          </p>

          {/* Category Filters */}
          <div className="flex justify-center gap-4 flex-wrap">
            {categories.map((category) => (
              <Button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full transition-all ${
                  selectedCategory === category
                    ? "bg-gradient-to-r from-red-900 to-red-800 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid md:grid-cols-3 gap-4">
          {filteredImages.map((image) => (
            <div
              key={image.id}
              className="relative h-80 overflow-hidden rounded-lg group cursor-pointer"
            >
              <ImageWithFallback
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <p className="text-white text-xl">{image.alt}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}