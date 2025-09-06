import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Priya Sharma",
    role: "Smart Shopper",
    content: "DealHunter saved me ₹2,500 on my iPhone purchase! Found the best deal across 3 different platforms in seconds.",
    rating: 5,
    avatar: "P"
  },
  {
    name: "Rahul Kumar",
    role: "Tech Enthusiast",
    content: "Amazing tool! I compare prices for all my gadgets now. The interface is clean and results are instant.",
    rating: 5,
    avatar: "R"
  },
  {
    name: "Sneha Patel",
    role: "Home Chef",
    content: "Perfect for grocery shopping. Found cheaper rates for cooking oil and spices. Highly recommended!",
    rating: 5,
    avatar: "S"
  }
];

export default function Testimonials() {
  return (
    <section className="py-16 bg-theme-surface/50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-theme-text-primary mb-4">
            What Our Users Say
          </h2>
          <p className="text-lg text-theme-text-secondary max-w-2xl mx-auto">
            Join thousands of smart shoppers who save money with DealHunter
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-theme-background border-theme-secondary/20 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-theme-primary rounded-full flex items-center justify-center text-theme-text-primary font-semibold mr-4">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="font-semibold text-theme-text-primary">{testimonial.name}</h4>
                    <p className="text-sm text-theme-text-secondary">{testimonial.role}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <Quote className="w-8 h-8 text-theme-primary/30 mb-2" />
                  <p className="text-theme-text-secondary italic">"{testimonial.content}"</p>
                </div>

                <div className="flex">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="inline-flex items-center space-x-1 text-theme-text-secondary">
            <span>⭐⭐⭐⭐⭐</span>
            <span className="ml-2">4.9/5 from 10,000+ reviews</span>
          </div>
        </div>
      </div>
    </section>
  );
}