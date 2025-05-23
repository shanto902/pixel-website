
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const activitiesData = [
  {
    id: 1,
    name: 'Bowling',
    description: 'Premium bowling lanes with automatic scoring and lane-side service.',
    image: 'https://images.unsplash.com/photo-1628139848731-9a280a16945b?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 2,
    name: 'Beer Pong',
    description: 'Competitive games with friends featuring digital scoring systems.',
    image: 'https://images.unsplash.com/photo-1567573766813-8d8da9089d65?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 3,
    name: 'Karaoke',
    description: 'Private booths with thousands of songs to choose from.',
    image: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 4,
    name: 'Arcade',
    description: 'Classic and modern arcade games for all ages.',
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80',
  }
];

const Activities: React.FC = () => {
  return (
    <section id="activities" className="py-20 bg-dark">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display neon-text mb-4 pixelated-text">ACTIVITIES</h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            From bowling and beer pong to karaoke and arcade games, we've got something for everyone.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {activitiesData.map((activity) => (
            <Card key={activity.id} className="bg-dark border border-neon-blue/50 overflow-hidden rounded-lg transition-all duration-300 hover:border-neon-pink/70">
              <div className="h-48 overflow-hidden">
                <img
                  src={activity.image}
                  alt={activity.name}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="text-2xl font-display text-white mb-2 pixelated-text">{activity.name}</h3>
                <p className="text-white/80 mb-4">{activity.description}</p>
                <Button variant="link" className="text-neon-pink hover:text-neon-blue p-0 transition-colors duration-300">
                  Learn More
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Button size="lg" className="bg-neon-pink hover:bg-neon-blue text-white text-lg transition-colors duration-300">
            Book Now
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Activities;
