import { services } from "../../data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Checkbox } from "../ui/checkbox";
import { Utensils, Sparkles, Landmark, Dog, Gamepad2, Dumbbell, Waves, Wine } from "lucide-react";

interface ServiceSelectionProps {
  selectedServices: string[];
  setSelectedServices: (services: string[]) => void;
}

const iconMap: Record<string, any> = {
  utensils: Utensils,
  sparkles: Sparkles,
  landmark: Landmark,
  dog: Dog,
  gamepad: Gamepad2,
  dumbbell: Dumbbell,
  waves: Waves,
  wine: Wine,
};

export function ServiceSelection({
  selectedServices,
  setSelectedServices,
}: ServiceSelectionProps) {
  const toggleService = (serviceId: string) => {
    if (selectedServices.includes(serviceId)) {
      setSelectedServices(selectedServices.filter(id => id !== serviceId));
    } else {
      setSelectedServices([...selectedServices, serviceId]);
    }
  };

  const totalServiceCost = services
    .filter(service => selectedServices.includes(service.id))
    .reduce((sum, service) => sum + service.price, 0);

  return (
    <div>
      <h2 className="text-3xl mb-2">Add Services (Optional)</h2>
      <p className="text-gray-600 mb-6">Enhance your stay with our premium services</p>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {services.map((service) => {
          const Icon = iconMap[service.icon];
          const isSelected = selectedServices.includes(service.id);

          return (
            <Card
              key={service.id}
              className={`cursor-pointer transition-all ${
                isSelected
                  ? "border-amber-900 border-2 shadow-lg bg-amber-50"
                  : "hover:shadow-lg"
              }`}
              onClick={() => toggleService(service.id)}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => toggleService(service.id)}
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                        <Icon className="text-amber-900" size={20} />
                      </div>
                      <h3 className="text-lg">{service.name}</h3>
                    </div>
                    <p className="text-xl text-amber-900">₹{service.price.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">per stay</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {selectedServices.length > 0 && (
        <Card className="bg-amber-50 border-amber-200">
          <CardHeader>
            <CardTitle>Selected Services Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {services
                .filter(s => selectedServices.includes(s.id))
                .map(service => (
                  <div key={service.id} className="flex justify-between">
                    <span>{service.name}</span>
                    <span>₹{service.price.toLocaleString()}</span>
                  </div>
                ))}
              <div className="flex justify-between pt-2 border-t border-amber-300">
                <span>Total Service Charges</span>
                <span className="text-xl text-amber-900">₹{totalServiceCost.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
