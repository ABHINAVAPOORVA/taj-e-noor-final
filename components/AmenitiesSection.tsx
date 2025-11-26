import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Waves, Dumbbell, Sparkles, Wifi, Car, Utensils } from "lucide-react";

const amenities = [
  {
    id: 1,
    icon: <Waves className="size-6" />,
    title: "Infinity Pool",
    description: "Temperature-controlled rooftop pool with stunning views",
    image: "https://images.unsplash.com/photo-1553521245-afd67cef42e4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwbHV4dXJ5JTIwaG90ZWwlMjBwb29sfGVufDF8fHx8MTc2MzkwNTUwOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  },
  {
    id: 2,
    icon: <Sparkles className="size-6" />,
    title: "Luxury Spa",
    description: "World-class spa treatments and wellness programs",
    image: "https://images.unsplash.com/photo-1715979166019-dc4e1e0784fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb3lhbCUyMHNwYSUyMHdlbGxuZXNzJTIwdmludGFnZXxlbnwxfHx8fDE3NjM5MDU1MDh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  },
  {
    id: 3,
    icon: <Dumbbell className="size-6" />,
    title: "Fitness Center",
    description: "State-of-the-art equipment and personal training",
    image: "https://images.unsplash.com/photo-1574755851171-8959b8334d6e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwaG90ZWwlMjBneW0lMjBmaXRuZXNzfGVufDF8fHx8MTc2MzkwNTUwOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  },
  {
    id: 4,
    icon: Wifi,
    title: "High-Speed WiFi",
    description: "Complimentary high-speed internet throughout the property"
  },
  {
    id: 5,
    icon: Car,
    title: "Valet Parking",
    description: "24/7 valet and secure parking services"
  },
  {
    id: 6,
    icon: Utensils,
    title: "Room Service",
    description: "24-hour in-room dining with extensive menu options"
  }
];

export function AmenitiesSection() {
  return (
    <section id="amenities" className="py-20 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-red-900 mb-2 tracking-wider">FACILITIES</p>
          <h2 className="text-4xl md:text-5xl mb-4">Amenities</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Discover world-class facilities designed for your comfort and convenience
          </p>
        </div>

        {/* Featured Amenities with Images */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {amenities.slice(0, 3).map((amenity) => {
            const Icon = amenity.icon;
            return (
              <div key={amenity.id} className="group cursor-pointer">
                <div className="relative h-80 mb-4 overflow-hidden rounded-lg">
                  <ImageWithFallback
                    src={amenity.image!}
                    alt={amenity.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-6 left-6 text-white">
                    <Icon size={32} className="mb-2" />
                    <h3 className="text-2xl mb-2">{amenity.title}</h3>
                    <p className="text-gray-200">{amenity.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Additional Amenities */}
        <div className="grid md:grid-cols-3 gap-8">
          {amenities.slice(3).map((amenity) => {
            const Icon = amenity.icon;
            return (
              <div key={amenity.id} className="flex gap-4 p-6 bg-white rounded-lg hover:shadow-lg transition-shadow">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center">
                    <Icon className="text-red-900" size={24} />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl mb-2">{amenity.title}</h3>
                  <p className="text-gray-600">{amenity.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}