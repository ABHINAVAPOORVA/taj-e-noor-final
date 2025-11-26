import { Card, CardContent } from "./ui/card";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Priya Sharma",
    location: "Mumbai, Maharashtra",
    rating: 5,
    text: "Our anniversary stay here was absolutely wonderful! The royal decor of the rooms and exceptional service from the staff made it truly memorable. Every facility was world-class. We're already planning our next visit!",
    date: "September 2025"
  },
  {
    id: 2,
    name: "Rajesh Kumar Patel",
    location: "Ahmedabad, Gujarat",
    rating: 5,
    text: "Stayed here with the entire family. The kids loved the Pet Salon and Hobbie Room. The food was delicious, especially the Rajasthani thali. Swimming pool and gym facilities were excellent. Highly recommend for family vacations!",
    date: "August 2025"
  },
  {
    id: 3,
    name: "Anjali and Vikram Desai",
    location: "Pune, Maharashtra",
    rating: 5,
    text: "Staying in the Emperor's Chamber truly made us feel like royalty! The Spa and Palace Tour were unforgettable experiences. Special thanks for the Private Bar facility and pet-friendly rooms. Completely satisfied with everything!",
    date: "October 2025"
  }
];

export function TestimonialsSection() {
  return (
    <section className="py-24 px-4 bg-white">
      <div className="max-w-[1400px] mx-auto">
        <div className="text-center mb-20">
          <p className="text-red-900 mb-3 tracking-widest text-base">GUEST REVIEWS</p>
          <h2 className="text-5xl md:text-6xl mb-6">What Our Guests Say</h2>
          <p className="text-gray-600 max-w-3xl mx-auto text-xl leading-relaxed">
            Read about the experiences of our valued guests
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="relative hover:shadow-xl transition-shadow">
              <CardContent className="p-10">
                <Quote className="text-red-900 mb-6" size={44} />
                
                <div className="flex gap-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="fill-yellow-500 text-yellow-500" size={20} />
                  ))}
                </div>

                <p className="text-gray-700 mb-8 italic text-lg leading-relaxed">
                  "{testimonial.text}"
                </p>

                <div className="border-t pt-6">
                  <p className="text-gray-900 text-lg">{testimonial.name}</p>
                  <p className="text-base text-gray-500 mt-1">{testimonial.location}</p>
                  <p className="text-sm text-gray-400 mt-1">{testimonial.date}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}