
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const activitiesData = [
  {
    id: 1,
    name: 'Bowling',
    description: 'Premium bowling lanes with automatic scoring and lane-side service.',
    image: 'https://images.ctfassets.net/w8fcmtakin9b/4ZPufpA10gaSU0IOwuA2UM/b150a23df3dd8ac8814555ff6ee3204d/bowling-carousel.jpg',
  },
  {
    id: 2,
    name: 'Beer Pong',
    description: 'Competitive games with friends featuring digital scoring systems.',
    image: 'https://images.ctfassets.net/w8fcmtakin9b/3JAkkuWIYgOQKO6ySmQeim/8b4793d78035269507f6d0271891d763/beerpong-carousel.jpg',
  },
  {
    id: 3,
    name: 'Karaoke',
    description: 'Private booths with thousands of songs to choose from.',
    image: 'https://images.ctfassets.net/w8fcmtakin9b/1ppdCJJGAKAqc2ICSkEi8c/ff6db1685e8fb26f8b3721bfce299fbc/karaoke-carousel.jpg',
  },
  {
    id: 4,
    name: 'Arcade',
    description: 'Classic and modern arcade games for all ages.',
    image: 'https://images.ctfassets.net/w8fcmtakin9b/20F2BKLGDZlg6WUf08hZi8/63685653dfbbc2cf52df0cb50d2d6c2f/arcade-carousel.jpg',
  }
];

const Activities: React.FC = () => {
  return (
    <section id="activities" className="py-20 bg-dark">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display neon-text mb-4">ACTIVITIES</h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            From bowling and beer pong to karaoke and arcade games, we've got something for everyone.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {activitiesData.map((activity) => (
            <Card key={activity.id} className="bg-dark border border-neon-blue/50 overflow-hidden hover:border-neon-pink transition-colors duration-300">
              <div className="h-48 overflow-hidden">
                <img
                  src={activity.image}
                  alt={activity.name}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="text-2xl font-display text-white mb-2">{activity.name}</h3>
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
