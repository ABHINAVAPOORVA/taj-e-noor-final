import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Users, Maximize, Wifi, Coffee, Tv, Wind, Bath, Star, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PageTransition } from "../components/PageTransition";
import { motion } from "motion/react";
import { useEffect } from "react";
import { roomImages } from "../config/imageAssets";

const rooms = [
  {
    id: "zaria-001",
    name: "Zaria Room",
    image: roomImages.dreamClassicRoom,
    description: "Elegant room with modern amenities and classic decor. Perfect for business or leisure travelers.",
    size: "380 sq ft",
    occupancy: "2 Adults",
    pricePerNight: 5000,
    available: 8,
    amenities: ["Free WiFi", "Air Conditioning", "Smart TV", "Mini Bar", "Room Service", "Safe"],
    features: ["King Size Bed", "Marble Bathroom", "City View", "Work Desk"]
  },
  {
    id: "nizam-001",
    name: "Nizam Deluxe",
    image: roomImages.nizamDeluxRoom,
    description: "Spacious deluxe room with premium furnishings and separate seating area. Experience royal comfort and elegance.",
    size: "520 sq ft",
    occupancy: "3 Adults",
    pricePerNight: 8000,
    available: 6,
    amenities: ["Free WiFi", "Air Conditioning", "Smart TV", "Mini Bar", "Room Service", "Safe", "Coffee Machine"],
    features: ["King Size Bed", "Luxury Bathroom", "Seating Area", "Balcony", "Work Desk"]
  },
  {
    id: "begum-001",
    name: "Begum Chamber",
    image: roomImages.begumChamber,
    description: "Pet-friendly suite designed for travelers with furry companions. Includes special pet amenities and outdoor access.",
    size: "650 sq ft",
    occupancy: "3 Adults + Pets",
    pricePerNight: 10000,
    available: 4,
    amenities: ["Free WiFi", "Air Conditioning", "Smart TV", "Mini Bar", "Room Service", "Safe", "Pet Bed", "Pet Bowls"],
    features: ["King Size Bed", "Pet-Friendly", "Garden Access", "Seating Area", "Luxury Bathroom"],
    petFriendly: true
  },
  {
    id: "emperor-001",
    name: "Emperor Chamber",
    image: roomImages.emperorChamber,
    description: "Our most luxurious offering with opulent furnishings, exclusive services, and panoramic views. VIP pet-friendly suite.",
    size: "1200 sq ft",
    occupancy: "4 Adults + Pets",
    pricePerNight: 15000,
    available: 2,
    amenities: ["Free WiFi", "Air Conditioning", "Smart TV", "Premium Bar", "24/7 Butler Service", "Safe", "Pet Amenities", "Coffee Machine"],
    features: ["Master Bedroom", "Living Room", "Dining Area", "Private Terrace", "Jacuzzi", "Pet-Friendly", "VIP Service"],
    petFriendly: true,
    vip: true
  }
];

export function RoomsPage() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <PageTransition>
      <div className="min-h-screen">
        <Header />
        
        {/* Hero Section */}
        <motion.div 
          className="pt-40 pb-20 px-4 bg-gradient-to-b from-amber-50 to-white"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="max-w-[1400px] mx-auto text-center">
            <p className="text-amber-900 mb-3 tracking-widest text-base">ACCOMMODATIONS</p>
            <h1 className="text-6xl md:text-7xl mb-8">Rooms & Suites</h1>
            <p className="text-gray-600 max-w-4xl mx-auto text-xl leading-relaxed">
              Experience unparalleled luxury in our meticulously designed accommodations. Each room offers the perfect blend of comfort, elegance, and modern amenities.
            </p>
          </div>
        </motion.div>

        {/* Rooms Grid */}
        <section className="py-20 px-4 bg-white">
          <div className="max-w-[1400px] mx-auto">
            <div className="grid lg:grid-cols-2 gap-12">
              {rooms.map((room, index) => (
                <motion.div
                  key={room.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.5, 
                    delay: index * 0.1,
                    ease: [0.4, 0, 0.2, 1]
                  }}
                >
                  <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                    <motion.div 
                      className="relative h-96 overflow-hidden"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                    >
                      <ImageWithFallback
                        src={room.image}
                        alt={room.name}
                        className="w-full h-full object-cover"
                      />
                      {room.petFriendly && (
                        <div className="absolute top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-full flex items-center gap-2 text-sm">
                          <Star size={16} />
                          <span>Pet Friendly</span>
                        </div>
                      )}
                      {room.vip && (
                        <div className="absolute top-4 left-4 bg-amber-900 text-white px-4 py-2 rounded-full flex items-center gap-2 text-sm">
                          <Star size={16} />
                          <span>VIP Suite</span>
                        </div>
                      )}
                      <div className="absolute bottom-4 left-4 bg-white px-4 py-2 rounded shadow">
                        <p className="text-sm text-gray-600">Room ID: {room.id}</p>
                      </div>
                    </motion.div>
                    
                    <CardContent className="p-10">
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <h3 className="text-4xl mb-3">{room.name}</h3>
                          <p className="text-gray-600 text-lg leading-relaxed">{room.description}</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-8 mb-8 text-gray-600 text-base">
                        <div className="flex items-center gap-2">
                          <Maximize size={20} />
                          <span>{room.size}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users size={20} />
                          <span>{room.occupancy}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-green-600">● {room.available} Available</span>
                        </div>
                      </div>

                      {/* Features */}
                      <div className="mb-8">
                        <h4 className="mb-4 text-gray-900 text-lg">Key Features</h4>
                        <div className="grid grid-cols-2 gap-3">
                          {room.features.map((feature, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-gray-600 text-base">
                              <Check size={18} className="text-green-600" />
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Amenities */}
                      <div className="mb-8">
                        <h4 className="mb-4 text-gray-900 text-lg">Amenities</h4>
                        <div className="flex flex-wrap gap-2">
                          {room.amenities.map((amenity, idx) => (
                            <span key={idx} className="bg-gray-100 px-4 py-2 rounded text-base text-gray-700">
                              {amenity}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-8 border-t">
                        <div>
                          <span className="text-sm text-gray-500">Starting from</span>
                          <p className="text-4xl text-amber-900">₹{room.pricePerNight.toLocaleString()}</p>
                          <span className="text-sm text-gray-500">per night</span>
                        </div>
                        <Button 
                          className="bg-amber-900 hover:bg-amber-800 px-8 py-6 text-base"
                          onClick={() => navigate('/booking')}
                        >
                          Book Now
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Additional Information */}
        <section className="py-20 px-4 bg-gray-50">
          <div className="max-w-[1400px] mx-auto">
            <div className="grid md:grid-cols-3 gap-12 text-center">
              {[
                { icon: Wifi, title: "Complimentary WiFi", desc: "High-speed internet access throughout your stay" },
                { icon: Bath, title: "Luxury Bathrooms", desc: "Premium toiletries and marble bathrooms" },
                { icon: Coffee, title: "24/7 Room Service", desc: "Round-the-clock dining and service" }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                >
                  <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <item.icon className="text-amber-900" size={36} />
                  </div>
                  <h3 className="text-2xl mb-3">{item.title}</h3>
                  <p className="text-gray-600 text-lg">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </PageTransition>
  );
}