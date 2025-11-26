import { BookingWidget } from "./BookingWidget";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
// Import the stunning nighttime TAJ-E-NOOR palace image
import heroImage from 'figma:asset/0ba787c16149894a2d5d9be8a0f73b1ba74de2c7.png';

export function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="relative h-screen">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-black/30"></div>
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col justify-center items-center text-white px-4 pt-32">
        <div className="max-w-6xl text-center mb-16 rounded-[54px] px-[34px] py-[0px]">
          <h1 className="text-6xl md:text-8xl mb-8 tracking-wide">
            Experience Luxury Redefined
          </h1>
          <p className="text-2xl md:text-3xl text-gray-200 max-w-3xl mx-auto mb-10">
            Immerse yourself in unparalleled elegance and world-class hospitality
          </p>
          
          {/* Quick Links */}
          <div className="flex gap-6 justify-center flex-wrap mb-12">
            <Button 
              variant="outline" 
              className="bg-white/10 border-yellow-400 text-white hover:bg-gradient-to-r hover:from-yellow-500 hover:to-yellow-400 hover:text-red-900 backdrop-blur-sm transition-all duration-300 px-8 py-6 text-lg"
              onClick={() => navigate('/rooms')}
            >
              Explore Rooms <ArrowRight className="ml-2" size={20} />
            </Button>
            <Button 
              variant="outline" 
              className="bg-white/10 border-yellow-400 text-white hover:bg-gradient-to-r hover:from-yellow-500 hover:to-yellow-400 hover:text-red-900 backdrop-blur-sm transition-all duration-300 px-8 py-6 text-lg"
              onClick={() => navigate('/dining')}
            >
              View Dining <ArrowRight className="ml-2" size={20} />
            </Button>
            <Button 
              variant="outline" 
              className="bg-white/10 border-yellow-400 text-white hover:bg-gradient-to-r hover:from-yellow-500 hover:to-yellow-400 hover:text-red-900 backdrop-blur-sm transition-all duration-300 px-8 py-6 text-lg"
              onClick={() => navigate('/amenities')}
            >
              Discover Amenities <ArrowRight className="ml-2" size={20} />
            </Button>
          </div>
        </div>

        {/* Booking Widget */}
        <BookingWidget />
      </div>
    </section>
  );
}