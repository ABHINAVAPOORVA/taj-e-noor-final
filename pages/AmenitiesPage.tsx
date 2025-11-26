import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Sparkles, Dumbbell, Waves, Wine, UtensilsCrossed, Dog, GamepadIcon, Volleyball, Clock, Users, MapPin, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PageTransition } from "../components/PageTransition";
import { motion } from "motion/react";
import { useEffect } from "react";
import { diningImages, amenityImages } from "../config/imageAssets";

const amenities = [
  {
    id: 1,
    icon: Waves,
    name: "Infinity Rooftop Pool",
    description: "Experience luxury at our temperature-controlled rooftop infinity pool. Offering stunning panoramic city views, poolside service, and a sophisticated atmosphere perfect for relaxation.",
    image: amenityImages.swimmingPool,
    hours: "6:00 AM - 10:00 PM",
    location: "Rooftop, 15th Floor",
    capacity: "40 Guests",
    serviceAvailable: true,
    features: ["Heated Pool", "Poolside Bar", "Cabanas", "Towel Service", "Swimming Lessons"]
  },
  {
    id: 2,
    icon: Sparkles,
    name: "The Grand Spa & Wellness Center",
    description: "Indulge in world-class spa treatments and holistic wellness programs. Our expert therapists offer rejuvenating massages, facials, and body treatments using premium products.",
    image: amenityImages.spaWellness,
    hours: "8:00 AM - 10:00 PM",
    location: "Ground Floor, East Wing",
    capacity: "20 Treatment Rooms",
    serviceAvailable: true,
    features: ["Massage Therapy", "Facial Treatments", "Sauna & Steam", "Yoga Classes", "Meditation Sessions"]
  },
  {
    id: 3,
    icon: Dumbbell,
    name: "State-of-the-Art Fitness Center",
    description: "Maintain your fitness routine with our fully equipped gym featuring the latest cardiovascular and strength training equipment, plus personal training services.",
    image: amenityImages.gymFitness,
    hours: "24/7 Access",
    location: "Ground Floor, West Wing",
    capacity: "30 Guests",
    serviceAvailable: true,
    features: ["Cardio Equipment", "Weight Training", "Personal Trainers", "Group Classes", "Locker Rooms"]
  },
  {
    id: 4,
    icon: Dog,
    name: "Pampered Paws Pet Salon",
    description: "Premium grooming and care services for your beloved pets. Our pet salon offers professional grooming, spa treatments, and a comfortable environment for your furry companions.",
    image: amenityImages.petSalon,
    hours: "9:00 AM - 7:00 PM",
    location: "Ground Floor, Garden Level",
    capacity: "8 Pets at a time",
    serviceAvailable: true,
    features: ["Professional Grooming", "Pet Spa", "Nail Trimming", "Pet Accessories", "Pet Photography"]
  },
  {
    id: 5,
    icon: GamepadIcon,
    name: "Recreation & Game Room",
    description: "Entertainment hub featuring pool tables, board games, video game consoles, and more. Perfect for family fun or friendly competition with fellow guests.",
    image: amenityImages.gameRoom,
    hours: "10:00 AM - 11:00 PM",
    location: "Second Floor, Central Tower",
    capacity: "25 Guests",
    serviceAvailable: true,
    features: ["Pool Tables", "Gaming Consoles", "Board Games", "VR Experience", "Snack Bar"]
  },
  {
    id: 6,
    icon: Wine,
    name: "The Vault Private Bar",
    description: "Exclusive bar experience featuring premium spirits, craft cocktails, and an extensive wine collection. Available as a bookable service for private events.",
    image: amenityImages.privateBar,
    hours: "5:00 PM - 1:00 AM",
    location: "First Floor, Central Tower",
    capacity: "50 Guests",
    serviceAvailable: true,
    features: ["Expert Mixologists", "Premium Spirits", "Wine Collection", "Private Events", "Live Entertainment"]
  },
  {
    id: 7,
    icon: UtensilsCrossed,
    name: "The Royal Court Restaurant",
    description: "Fine dining restaurant offering exquisite international cuisine. Our award-winning chefs create culinary masterpieces using seasonal, locally-sourced ingredients.",
    image: diningImages.royalCourtRestaurant,
    hours: "6:00 PM - 11:00 PM",
    location: "Ground Floor, East Wing",
    capacity: "80 Guests",
    serviceAvailable: true,
    features: ["Fine Dining", "Wine Pairing", "Private Dining", "Chef's Table", "Tasting Menu"]
  }
];

const additionalFacilities = [
  {
    icon: Sparkles,
    title: "High-Speed WiFi",
    description: "Complimentary high-speed internet throughout the property"
  },
  {
    icon: Volleyball,
    title: "Valet Parking",
    description: "24/7 valet and secure parking services"
  },
  {
    icon: Dog,
    title: "Concierge Services",
    description: "Expert local guidance and reservations assistance"
  }
];

export function AmenitiesPage() {
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
          className="pt-32 pb-16 px-4 bg-gradient-to-b from-amber-50 to-white"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-amber-900 mb-2 tracking-wider">FACILITIES & SERVICES</p>
            <h1 className="text-5xl md:text-6xl mb-6">Amenities</h1>
            <p className="text-gray-600 max-w-3xl mx-auto text-lg">
              Discover our exceptional range of world-class facilities and services designed to enhance every moment of your stay. From relaxation to recreation, we have everything you need.
            </p>
          </div>
        </motion.div>

        {/* Main Amenities */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-7xl mx-auto space-y-16">
            {amenities.map((amenity, index) => {
              const Icon = amenity.icon;
              return (
                <motion.div 
                  key={amenity.id} 
                  className={`grid md:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'md:grid-flow-dense' : ''}`}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.6, 
                    delay: index * 0.15,
                    ease: [0.22, 1, 0.36, 1]
                  }}
                >
                  <div className={index % 2 === 1 ? 'md:col-start-2' : ''}>
                    <motion.div 
                      className="relative h-96 rounded-lg overflow-hidden shadow-xl group"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ImageWithFallback
                        src={amenity.image}
                        alt={amenity.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute top-6 right-6 bg-amber-900 text-white p-4 rounded-full shadow-lg">
                        <Icon size={32} />
                      </div>
                      {amenity.serviceAvailable && (
                        <div className="absolute top-6 left-6 bg-green-600 text-white px-4 py-2 rounded-full flex items-center gap-2">
                          <Star size={16} />
                          <span>Bookable Service</span>
                        </div>
                      )}
                    </motion.div>
                  </div>
                  
                  <div className={index % 2 === 1 ? 'md:col-start-1 md:row-start-1' : ''}>
                    <p className="text-sm text-amber-900 mb-2 tracking-wider">{amenity.name.toUpperCase()}</p>
                    <h2 className="text-4xl mb-4">{amenity.name}</h2>
                    <p className="text-gray-600 text-lg mb-6">{amenity.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Hours</p>
                        <div className="flex items-center gap-2">
                          <Clock size={16} className="text-amber-900" />
                          <p className="text-gray-900">{amenity.hours}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Location</p>
                        <div className="flex items-center gap-2">
                          <MapPin size={16} className="text-amber-900" />
                          <p className="text-gray-900">{amenity.location}</p>
                        </div>
                      </div>
                    </div>

                    <div className="mb-6">
                      <div className="flex items-center gap-2 mb-3">
                        <Users size={18} className="text-amber-900" />
                        <p className="text-gray-900">{amenity.capacity}</p>
                      </div>
                    </div>

                    <div className="mb-6">
                      <p className="mb-2 text-gray-900">Features</p>
                      <div className="flex flex-wrap gap-2">
                        {amenity.features.map((feature, idx) => (
                          <span key={idx} className="bg-amber-50 text-amber-900 px-3 py-1 rounded text-sm">
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>

                    <Button 
                      className="bg-amber-900 hover:bg-amber-800"
                      onClick={() => navigate('/booking')}
                    >
                      Add to Booking
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Additional Facilities */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-amber-900 mb-2 tracking-wider">MORE FACILITIES</p>
              <h2 className="text-4xl mb-4">Complimentary Services</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Additional amenities included with your stay at no extra charge
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {additionalFacilities.map((facility, idx) => {
                const Icon = facility.icon;
                return (
                  <Card key={idx} className="p-8 hover:shadow-lg transition-shadow">
                    <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
                      <Icon className="text-amber-900" size={32} />
                    </div>
                    <h3 className="text-2xl mb-3">{facility.title}</h3>
                    <p className="text-gray-600">{facility.description}</p>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-4xl mx-auto bg-amber-900 text-white rounded-lg p-12 text-center">
            <h3 className="text-3xl mb-4">Ready to Experience Luxury?</h3>
            <p className="text-amber-100 mb-8 text-lg">
              Book your stay now and enjoy access to all our world-class amenities. Add services to your booking for a truly personalized experience.
            </p>
            <Button 
              size="lg"
              variant="outline"
              className="bg-white text-amber-900 hover:bg-amber-50 border-none"
              onClick={() => navigate('/booking')}
            >
              Book Your Stay
            </Button>
          </div>
        </section>

        <Footer />
      </div>
    </PageTransition>
  );
}