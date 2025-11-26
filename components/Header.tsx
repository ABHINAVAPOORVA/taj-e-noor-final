import { Menu, Phone, Mail, User, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, isAuthenticated, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out successfully");
    navigate("/");
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-[#FAF9F6]/95 backdrop-blur-sm z-50 border-b border-red-900/20">
      {/* Top Bar with Royal Red Background */}
      <div className="bg-gradient-to-r from-red-900 to-red-800 text-white py-3 px-4">
        <div className="max-w-[1400px] mx-auto flex justify-between items-center">
          <div className="flex gap-8">
            <a href="tel:+916299106880" className="flex items-center gap-2 hover:text-yellow-300 transition-colors text-base">
              <Phone size={18} />
              <span className="hidden sm:inline">+91 6299106880</span>
            </a>
            <a href="mailto:abhinavapoorva2007@gmail.com" className="flex items-center gap-2 hover:text-yellow-300 transition-colors text-base">
              <Mail size={18} />
              <span className="hidden sm:inline">abhinavapoorva2007@gmail.com</span>
            </a>
          </div>
          <div className="flex gap-4 items-center">
            {isAuthenticated ? (
              <>
                <span className="text-base flex items-center gap-2">
                  <User size={18} />
                  <span className="hidden sm:inline">
                    {user?.full_name 
                      ? user.full_name.split(' ')[0] // Show first name only
                      : user?.email?.split('@')[0] // Fallback to email username
                    }
                  </span>
                </span>
                <span className="text-yellow-300">|</span>
                <button 
                  onClick={handleSignOut}
                  className="text-base hover:text-yellow-300 transition-colors flex items-center gap-2"
                >
                  <LogOut size={18} />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => navigate('/sign-in')}
                  className="text-base hover:text-yellow-300 transition-colors flex items-center gap-2"
                >
                  <User size={18} />
                  <span className="hidden sm:inline">Sign In</span>
                </button>
                <span className="text-yellow-300">|</span>
                <button 
                  onClick={() => navigate('/sign-up')}
                  className="text-base hover:text-yellow-300 transition-colors"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="max-w-[1400px] mx-auto px-4 py-5">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-16">
            <Link to="/" className="text-transparent bg-clip-text bg-gradient-to-r from-red-900 to-red-700">
              <span className="text-3xl tracking-wider font-bold">TAJ-E-NOOR</span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden lg:flex gap-10 font-bold font-normal text-base">
              <Link to="/rooms" className="text-gray-700 hover:text-red-900 transition-colors">Rooms & Suites</Link>
              <Link to="/dining" className="text-gray-700 hover:text-red-900 transition-colors">Dining</Link>
              <Link to="/amenities" className="text-gray-700 hover:text-red-900 transition-colors">Amenities</Link>
              <Link to="/gallery" className="text-gray-700 hover:text-red-900 transition-colors">Gallery</Link>
              <Link to="/#offers" className="text-gray-700 hover:text-red-900 transition-colors">Offers</Link>
              <Link to="/#contact" className="text-gray-700 hover:text-red-900 transition-colors">Contact</Link>
            </div>
          </div>

          {/* CTA Buttons with Royal Colors */}
          <div className="hidden lg:flex gap-4">
            <Button 
              variant="outline" 
              className="border-red-900 text-red-900 hover:bg-red-50 px-6 py-5 text-base"
              onClick={() => navigate('/rooms')}
            >
              View Rates
            </Button>
            <Button 
              className="bg-gradient-to-r from-red-900 to-red-800 hover:from-red-800 hover:to-red-700 text-white px-6 py-5 text-base"
              onClick={() => navigate('/booking')}
            >
              Book Now
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="text-red-900" />
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t pt-4">
            <div className="flex flex-col gap-4">
              <Link to="/rooms" className="text-gray-700 hover:text-red-900 transition-colors">Rooms & Suites</Link>
              <Link to="/dining" className="text-gray-700 hover:text-red-900 transition-colors">Dining</Link>
              <Link to="/amenities" className="text-gray-700 hover:text-red-900 transition-colors">Amenities</Link>
              <Link to="/gallery" className="text-gray-700 hover:text-red-900 transition-colors">Gallery</Link>
              <Link to="/#offers" className="text-gray-700 hover:text-red-900 transition-colors">Offers</Link>
              <Link to="/#contact" className="text-gray-700 hover:text-red-900 transition-colors">Contact</Link>
              
              <div className="border-t pt-4 flex gap-2">
                <Button 
                  variant="outline" 
                  className="border-red-900 text-red-900 hover:bg-red-50 flex-1"
                  onClick={() => {
                    navigate('/sign-in');
                    setMobileMenuOpen(false);
                  }}
                >
                  Sign In
                </Button>
                <Button 
                  variant="outline" 
                  className="border-red-900 text-red-900 hover:bg-red-50 flex-1"
                  onClick={() => {
                    navigate('/sign-up');
                    setMobileMenuOpen(false);
                  }}
                >
                  Sign Up
                </Button>
              </div>
              
              <Button 
                variant="outline" 
                className="border-red-900 text-red-900 hover:bg-red-50 w-full"
                onClick={() => {
                  navigate('/rooms');
                  setMobileMenuOpen(false);
                }}
              >
                View Rates
              </Button>
              <Button 
                className="bg-gradient-to-r from-red-900 to-red-800 hover:from-red-800 hover:to-red-700 text-white w-full"
                onClick={() => {
                  navigate('/booking');
                  setMobileMenuOpen(false);
                }}
              >
                Book Now
              </Button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}