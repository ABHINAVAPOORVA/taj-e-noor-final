import { Facebook, Instagram, Twitter, Linkedin, Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="max-w-[1400px] mx-auto px-4 py-16">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <h3 className="text-3xl mb-5 tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">TAJ-E-NOOR</h3>
            <p className="text-gray-400 mb-6 text-base leading-relaxed">
              Experience unparalleled luxury and hospitality in the heart of the city.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-11 h-11 bg-gradient-to-r from-red-900 to-red-800 hover:from-yellow-500 hover:to-yellow-400 rounded-full flex items-center justify-center transition-all duration-300">
                <Facebook size={22} />
              </a>
              <a href="#" className="w-11 h-11 bg-gradient-to-r from-red-900 to-red-800 hover:from-yellow-500 hover:to-yellow-400 rounded-full flex items-center justify-center transition-all duration-300">
                <Instagram size={22} />
              </a>
              <a href="#" className="w-11 h-11 bg-gradient-to-r from-red-900 to-red-800 hover:from-yellow-500 hover:to-yellow-400 rounded-full flex items-center justify-center transition-all duration-300">
                <Twitter size={22} />
              </a>
              <a href="#" className="w-11 h-11 bg-gradient-to-r from-red-900 to-red-800 hover:from-yellow-500 hover:to-yellow-400 rounded-full flex items-center justify-center transition-all duration-300">
                <Linkedin size={22} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-5 text-yellow-400 text-lg">Quick Links</h4>
            <ul className="space-y-3 text-gray-400 text-base">
              <li><Link to="/rooms" className="hover:text-yellow-400 transition-colors">Rooms & Suites</Link></li>
              <li><Link to="/dining" className="hover:text-yellow-400 transition-colors">Dining</Link></li>
              <li><Link to="/amenities" className="hover:text-yellow-400 transition-colors">Amenities</Link></li>
              <li><Link to="/#offers" className="hover:text-yellow-400 transition-colors">Special Offers</Link></li>
              <li><Link to="/gallery" className="hover:text-yellow-400 transition-colors">Gallery</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="mb-5 text-yellow-400 text-lg">Services</h4>
            <ul className="space-y-3 text-gray-400 text-base">
              <li><Link to="/amenities" className="hover:text-yellow-400 transition-colors">Spa & Wellness</Link></li>
              <li><Link to="/amenities" className="hover:text-yellow-400 transition-colors">Fitness Center</Link></li>
              <li><Link to="/amenities" className="hover:text-yellow-400 transition-colors">Swimming Pool</Link></li>
              <li><Link to="/booking" className="hover:text-yellow-400 transition-colors">Book Now</Link></li>
              <li><Link to="/admin" className="hover:text-yellow-400 transition-colors">Admin Portal</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-5 text-yellow-400 text-lg">Contact Info</h4>
            <ul className="space-y-4 text-gray-400 text-base">
              <li className="flex gap-3">
                <MapPin size={22} className="flex-shrink-0 text-yellow-400" />
                <span>Near upes bidholi</span>
              </li>
              <li className="flex gap-3">
                <Phone size={22} className="flex-shrink-0 text-yellow-400" />
                <span>+91 6299106880</span>
              </li>
              <li className="flex gap-3">
                <Mail size={22} className="flex-shrink-0 text-yellow-400" />
                <span>abhinavapoorva2007@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-red-900/50 pt-10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-base">
            © 2025 Taj-e-Noor. All rights reserved.
          </p>
          <div className="flex gap-8 text-base text-gray-400">
            <a href="#" className="hover:text-yellow-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-yellow-400 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-yellow-400 transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}