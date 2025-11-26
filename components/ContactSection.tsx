import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import mapImage from "figma:asset/5917eced7d0718d20d302757347f27d76066d599.png";

export function ContactSection() {
  return (
    <section id="contact" className="py-24 px-4 bg-gray-50">
      <div className="max-w-[1400px] mx-auto">
        <div className="text-center mb-20">
          <p className="text-red-900 mb-3 tracking-widest text-base">GET IN TOUCH</p>
          <h2 className="text-5xl md:text-6xl mb-6">Contact Us</h2>
          <p className="text-gray-600 max-w-3xl mx-auto text-xl leading-relaxed">
            We're here to help you plan your perfect stay
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          {/* Contact Information */}
          <div className="space-y-10">
            <div>
              <h3 className="text-3xl mb-8 text-center">Visit Us</h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="flex gap-5 bg-white p-8 rounded-lg shadow-md">
                  <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="text-red-900" size={28} />
                  </div>
                  <div>
                    <p className="mb-2 text-lg">Address</p>
                    <p className="text-gray-600 text-base">
                      Near upes bidholi
                    </p>
                  </div>
                </div>

                <div className="flex gap-5 bg-white p-8 rounded-lg shadow-md">
                  <div className="flex-shrink-0 w-14 h-14 bg-red-50 rounded-full flex items-center justify-center">
                    <Phone className="text-red-900" size={28} />
                  </div>
                  <div>
                    <p className="mb-2 text-lg">Phone</p>
                    <p className="text-gray-600 text-base">+91 6299106880</p>
                  </div>
                </div>

                <div className="flex gap-5 bg-white p-8 rounded-lg shadow-md">
                  <div className="flex-shrink-0 w-14 h-14 bg-red-50 rounded-full flex items-center justify-center">
                    <Mail className="text-red-900" size={28} />
                  </div>
                  <div>
                    <p className="mb-2 text-lg">Email</p>
                    <p className="text-gray-600 text-base">abhinavapoorva2007@gmail.com</p>
                  </div>
                </div>

                <div className="flex gap-5 bg-white p-8 rounded-lg shadow-md">
                  <div className="flex-shrink-0 w-14 h-14 bg-red-50 rounded-full flex items-center justify-center">
                    <Clock className="text-red-900" size={28} />
                  </div>
                  <div>
                    <p className="mb-2 text-lg">Front Desk</p>
                    <p className="text-gray-600 text-base">24/7 Available</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="h-[500px] rounded-lg overflow-hidden shadow-lg">
              <ImageWithFallback
                src={mapImage}
                alt="Map Location - Near UPES Bidholi"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}