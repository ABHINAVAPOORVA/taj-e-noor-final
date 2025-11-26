import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Calendar, Tag } from "lucide-react";

const offers = [
  {
    id: 1,
    title: "Early Bird Special",
    discount: "30% OFF",
    description: "Book 30 days in advance and save up to 30% on your stay",
    validUntil: "Dec 31, 2025",
    image: "https://images.unsplash.com/photo-1742821855309-d26c83bdfe1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb3lhbCUyMHZpbnRhZ2UlMjBob3RlbCUyMGJlZHJvb218ZW58MXx8fHwxNzYzOTA1NTA3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    tag: "Limited Time"
  },
  {
    id: 2,
    title: "Weekend Getaway",
    discount: "20% OFF",
    description: "Enjoy a relaxing weekend with complimentary breakfast and spa access",
    validUntil: "Nov 30, 2025",
    image: "https://images.unsplash.com/photo-1725623831897-fb009acfe742?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcHVsZW50JTIwdmludGFnZSUyMGhvdGVsJTIwc3VpdGV8ZW58MXx8fHwxNzYzOTA1NTA3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    tag: "Best Seller"
  },
  {
    id: 3,
    title: "Extended Stay",
    discount: "15% OFF",
    description: "Stay 5 nights or more and receive exclusive benefits and savings",
    validUntil: "Jan 31, 2026",
    image: "https://images.unsplash.com/photo-1656593447226-6e2abf722d2c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwbHV4dXJ5JTIwcGFsYWNlJTIwaG90ZWwlMjBleHRlcmlvcnxlbnwxfHx8fDE3NjM5MDU1MDZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    tag: "Popular"
  }
];

export function OffersSection() {
  return (
    <section id="offers" className="py-24 px-4 bg-white">
      <div className="max-w-[1400px] mx-auto">
        <div className="text-center mb-20">
          <p className="text-red-900 mb-3 tracking-widest text-base">SPECIAL DEALS</p>
          <h2 className="text-5xl md:text-6xl mb-6">Exclusive Offers</h2>
          <p className="text-gray-600 max-w-3xl mx-auto text-xl leading-relaxed">
            Take advantage of our limited-time promotions and packages
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          {offers.map((offer) => (
            <Card key={offer.id} className="overflow-hidden hover:shadow-xl transition-shadow">
              <div className="relative h-72">
                <ImageWithFallback
                  src={offer.image}
                  alt={offer.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-red-900 text-white px-3 py-1 text-sm">
                    <Tag size={16} className="mr-1" />
                    {offer.tag}
                  </Badge>
                </div>
                <div className="absolute top-4 right-4 bg-white px-5 py-3 rounded-lg shadow-lg">
                  <span className="text-3xl text-red-900">{offer.discount}</span>
                </div>
              </div>
              <CardContent className="p-8">
                <h3 className="text-3xl mb-4">{offer.title}</h3>
                <p className="text-gray-600 mb-5 text-lg leading-relaxed">{offer.description}</p>
                <div className="flex items-center gap-2 text-base text-gray-500 mb-4">
                  <Calendar size={18} />
                  <span>Valid until {offer.validUntil}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}