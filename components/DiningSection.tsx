import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { UtensilsCrossed, Coffee, Wine, Clock } from "lucide-react";
import { diningImages } from "../config/imageAssets";

const restaurants = [
  {
    id: 1,
    icon: <UtensilsCrossed className="size-5" />,
    name: "The Royal Court",
    cuisine: "Fine Dining",
    image: diningImages.royalCourtRestaurant,
    description: "Exquisite international cuisine crafted by award-winning chefs",
    hours: "6:00 PM - 11:00 PM"
  },
  {
    id: 2,
    icon: <Coffee className="size-5" />,
    name: "Cafe Serenity",
    cuisine: "All-Day Dining",
    image: "https://images.unsplash.com/photo-1718957345266-e1d51066c73f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGFzc2ljJTIwaG90ZWwlMjBjYWZlJTIwdmludGFnZXxlbnwxfHx8fDE3NjM5MDU1MTB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "Casual dining with a diverse menu of global favorites",
    hours: "6:00 AM - 11:00 PM"
  },
  {
    id: 3,
    icon: <Wine className="size-5" />,
    name: "The Vault Bar",
    cuisine: "Bar & Lounge",
    image: "https://images.unsplash.com/photo-1760931657881-93916b137d67?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwY29ja3RhaWwlMjBiYXIlMjBsb3VuZ2V8ZW58MXx8fHwxNzYzOTA1NTEwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "Premium cocktails and spirits in an elegant setting",
    hours: "5:00 PM - 1:00 AM"
  }
];

export function DiningSection() {
  return (
    <section id="dining" className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-red-900 mb-2 tracking-wider">CULINARY EXPERIENCES</p>
          <h2 className="text-4xl md:text-5xl mb-4">Dining</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Savor exceptional flavors from around the world in our signature restaurants
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {restaurants.map((restaurant) => {
            const Icon = restaurant.icon;
            return (
              <Card key={restaurant.id} className="overflow-hidden hover:shadow-xl transition-shadow">
                <div className="relative h-72">
                  <ImageWithFallback
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-red-900 text-white p-3 rounded-full">
                    {Icon}
                  </div>
                </div>
                <CardContent className="p-6">
                  <p className="text-sm text-red-900 mb-1 tracking-wider">{restaurant.cuisine}</p>
                  <h3 className="text-2xl mb-3">{restaurant.name}</h3>
                  <p className="text-gray-600 mb-4">{restaurant.description}</p>
                  <div className="flex items-center gap-2 text-gray-500">
                    <Clock size={16} />
                    <span className="text-sm">{restaurant.hours}</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}