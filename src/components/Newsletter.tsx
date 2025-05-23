
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

const Newsletter: React.FC = () => {
  const { toast } = useToast();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Subscription successful!",
      description: "Thanks for subscribing to our newsletter.",
    });
  };

  return (
    <section className="py-16 bg-black">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-display neon-text mb-4">JOIN THE LANE7 CLUB</h2>
          <p className="text-lg text-white/80 mb-8">
            Sign up to receive exclusive offers, event invites and updates from your local Lane7.
          </p>
          
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              required
              className="bg-dark/60 border-neon-blue/50 text-white placeholder:text-white/50 flex-1"
            />
            <Button type="submit" className="bg-neon-pink hover:bg-neon-blue text-white transition-colors duration-300">
              Subscribe
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
