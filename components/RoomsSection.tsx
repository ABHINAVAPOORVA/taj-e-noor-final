import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Users, Maximize, Wifi, Coffee } from "lucide-react";
import emperorChamberImage from "figma:asset/a71b149a121e2f9111a4d467dd69b7495c81d221.png";

const rooms = [
  {
    id: 1,
    name: "Deluxe Room",
    image: "https://images.unsplash.com/photo-1742821855309-d26c83bdfe1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb3lhbCUyMHZpbnRhZ2UlMjBob3RlbCUyMGJlZHJvb218ZW58MXx8fHwxNzYzOTA1NTA3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "Elegantly designed room with modern amenities and city views",
    size: "380 sq ft",
    occupancy: "2 Adults",
    price: "$299"
  },
  {
    id: 2,
    name: "Premium Suite",
    image: "https://images.unsplash.com/photo-1725623831897-fb009acfe742?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcHVsZW50JTIwdmludGFnZSUyMGhvdGVsJTIwc3VpdGV8ZW58MXx8fHwxNzYzOTA1NTA3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "Spacious suite with separate living area and panoramic views",
    size: "650 sq ft",
    occupancy: "3 Adults",
    price: "$499"
  },
  {
    id: 3,
    name: "Royal Suite",
    image: emperorChamberImage,
    description: "Our finest offering with luxury furnishings and exclusive services",
    size: "1200 sq ft",
    occupancy: "4 Adults",
    price: "$899"
  }
];

export function RoomsSection() {
  return (
    <section id="rooms" className="py-20 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-red-900 mb-2 tracking-wider">ACCOMMODATIONS</p>
          <h2 className="text-4xl md:text-5xl mb-4">Rooms & Suites</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Each room is meticulously designed to provide the perfect blend of comfort and elegance
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {rooms.map((room) => (
            <Card key={room.id} className="overflow-hidden hover:shadow-xl transition-shadow">
              <div className="relative h-64">
                <ImageWithFallback
                  src={room.image}
                  alt={room.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="text-2xl mb-2">{room.name}</h3>
                <p className="text-gray-600 mb-4">{room.description}</p>
                
                <div className="flex gap-4 mb-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Maximize size={16} />
                    <span>{room.size}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users size={16} />
                    <span>{room.occupancy}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-4 text-sm text-gray-500">
                  <Wifi size={16} />
                  <Coffee size={16} />
                  <span>+ More Amenities</span>
                </div>

                <div className="flex justify-between items-center pt-4 border-t">
                  <div>
                    <span className="text-sm text-gray-500">From</span>
                    <p className="text-2xl text-red-900">{room.price}</p>
                    <span className="text-sm text-gray-500">per night</span>
                  </div>
                  <Button className="bg-gradient-to-r from-red-900 to-red-800 hover:from-red-800 hover:to-red-700 text-white">
                    Book Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}