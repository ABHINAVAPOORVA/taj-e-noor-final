import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { UtensilsCrossed, Coffee, Wine, Clock, Users, Award, Utensils, ChefHat, MapPin, Star, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PageTransition } from "../components/PageTransition";
import { motion } from "motion/react";
import { useEffect } from "react";
import { diningImages } from "../config/imageAssets";

const restaurants = [
  {
    id: 1,
    icon: UtensilsCrossed,
    name: "The Royal Court - Restro",
    cuisine: "Fine Dining",
    image: diningImages.royalCourtRestaurant,
    description: "Exquisite international cuisine crafted by award-winning chefs. Experience culinary excellence with seasonal menus featuring locally sourced ingredients.",
    hours: "Dinner: 6:00 PM - 11:00 PM",
    capacity: "80 Guests",
    location: "Ground Floor, East Wing",
    specialty: "European & Asian Fusion",
    price: "₹₹₹₹",
    dresscode: "Smart Casual",
    reservation: "Recommended",
    highlights: ["Michelin-Starred Chef", "Wine Pairing", "Private Dining", "Tasting Menu"]
  },
  {
    id: 2,
    icon: Coffee,
    name: "Cafe Serenity",
    cuisine: "All-Day Dining",
    image: "https://images.unsplash.com/photo-1718957345266-e1d51066c73f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGFzc2ljJTIwaG90ZWwlMjBjYWZlJTIwdmludGFnZXxlbnwxfHx8fDE3NjM5MDU1MTB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Casual dining with a diverse menu of global favorites. From hearty breakfasts to late-night snacks, we serve delicious food around the clock.",
    hours: "Open 24/7",
    capacity: "120 Guests",
    location: "Ground Floor, West Wing",
    specialty: "International Buffet",
    price: "₹₹₹",
    dresscode: "Casual",
    reservation: "Walk-ins Welcome",
    highlights: ["Live Cooking Stations", "Breakfast Buffet", "Outdoor Seating", "Kid-Friendly Menu"]
  },
  {
    id: 3,
    icon: Wine,
    name: "The Vault - Private Bar",
    cuisine: "Bar & Lounge",
    image: "https://images.unsplash.com/photo-1760931657881-93916b137d67?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwY29ja3RhaWwlMjBiYXIlMjBsb3VuZ2V8ZW58MXx8fHwxNzYzOTA1NTEwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Premium cocktails and rare spirits in an elegant setting. Our expert mixologists craft signature drinks in an intimate atmosphere.",
    hours: "5:00 PM - 1:00 AM",
    capacity: "50 Guests",
    location: "First Floor, Central Tower",
    specialty: "Craft Cocktails & Whiskey",
    price: "₹₹₹₹",
    dresscode: "Smart Casual",
    reservation: "Recommended",
    highlights: ["Expert Mixologists", "Premium Spirits", "Live Music", "Cigar Lounge"]
  }
];

const menuHighlights = [
  {
    category: "Signature Dishes",
    items: [
      "Pan-Seared Foie Gras with Fig Compote",
      "Wagyu Beef Tenderloin with Truffle Sauce",
      "Mediterranean Seafood Platter",
      "Rack of Lamb with Rosemary Jus"
    ]
  },
  {
    category: "Breakfast Specialties",
    items: [
      "Royal Palace Breakfast Buffet",
      "Belgian Waffles with Berry Compote",
      "Eggs Benedict Royale",
      "Fresh Pastry Selection"
    ]
  },
  {
    category: "Signature Cocktails",
    items: [
      "Palace Martini",
      "Royal Old Fashioned",
      "Golden Sunset Margarita",
      "Emperor's Mojito"
    ]
  }
];

export function DiningPage() {
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
            <p className="text-amber-900 mb-2 tracking-wider">CULINARY EXPERIENCES</p>
            <h1 className="text-5xl md:text-6xl mb-6">Dining at Taj-e-Noor</h1>
            <p className="text-gray-600 max-w-3xl mx-auto text-lg">
              Embark on a gastronomic journey through our world-class restaurants. From fine dining to casual fare, every meal is an unforgettable experience.
            </p>
          </div>
        </motion.div>

        {/* Restaurants */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-7xl mx-auto space-y-16">
            {restaurants.map((restaurant, index) => {
              const Icon = restaurant.icon;
              return (
                <motion.div 
                  key={restaurant.id} 
                  className={`grid md:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'md:grid-flow-dense' : ''}`}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.6, 
                    delay: index * 0.2,
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
                        src={restaurant.image}
                        alt={restaurant.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute top-6 right-6 bg-amber-900 text-white p-4 rounded-full shadow-lg">
                        <Icon size={32} />
                      </div>
                    </motion.div>
                  </div>
                  
                  <div className={index % 2 === 1 ? 'md:col-start-1 md:row-start-1' : ''}>
                    <p className="text-sm text-amber-900 mb-2 tracking-wider">{restaurant.cuisine}</p>
                    <h2 className="text-4xl mb-4">{restaurant.name}</h2>
                    <p className="text-gray-600 text-lg mb-6">{restaurant.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Hours</p>
                        <p className="text-gray-900">{restaurant.hours}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Capacity</p>
                        <p className="text-gray-900">{restaurant.capacity}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Specialty</p>
                        <p className="text-gray-900">{restaurant.specialty}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Price Range</p>
                        <p className="text-gray-900">{restaurant.price}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 mb-6 text-gray-600">
                      <MapPin size={18} />
                      <span>{restaurant.location}</span>
                    </div>

                    <div className="mb-6">
                      <p className="mb-2 text-gray-900">Highlights</p>
                      <div className="flex flex-wrap gap-2">
                        {restaurant.highlights.map((highlight, idx) => (
                          <span key={idx} className="bg-amber-50 text-amber-900 px-3 py-1 rounded-full text-sm">
                            {highlight}
                          </span>
                        ))}
                      </div>
                    </div>

                    <Button 
                      className="bg-amber-900 hover:bg-amber-800"
                      onClick={() => navigate('/booking')}
                    >
                      Reserve a Table
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Menu Highlights */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-amber-900 mb-2 tracking-wider">MENU</p>
              <h2 className="text-4xl mb-4">Culinary Highlights</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                A selection of our most beloved dishes, crafted with passion and precision
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {menuHighlights.map((section, idx) => (
                <Card key={idx} className="p-6">
                  <h3 className="text-2xl mb-4 text-amber-900">{section.category}</h3>
                  <ul className="space-y-3">
                    {section.items.map((item, itemIdx) => (
                      <li key={itemIdx} className="flex items-start gap-2">
                        <Star size={16} className="text-amber-600 mt-1 flex-shrink-0" />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Services Note */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-4xl mx-auto bg-amber-50 rounded-lg p-8 text-center">
            <UtensilsCrossed className="mx-auto mb-4 text-amber-900" size={48} />
            <h3 className="text-2xl mb-4">Room Service & Private Dining</h3>
            <p className="text-gray-700 mb-6">
              All our dining experiences can be added to your booking as additional services. Enjoy in-room dining, private chef experiences, and exclusive dining packages during your stay.
            </p>
            <div className="flex items-center justify-center gap-2 text-amber-900">
              <Phone size={20} />
              <span className="font-bold">Call ext. 6299106880 for reservations</span>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </PageTransition>
  );
}