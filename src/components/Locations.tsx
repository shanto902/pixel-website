
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const locationsData = [
  { id: 1, name: 'Birmingham', address: '100 Broad St, Birmingham, B15 1AE', image: 'https://images.ctfassets.net/w8fcmtakin9b/3EkYOlLDPh7n5KjudJDpbC/74f6c78b1bb1eebeec5430913f914dcc/birmingham.jpg' },
  { id: 2, name: 'Bristol', address: '11-12 Millennium Promenade, Bristol, BS1 5SZ', image: 'https://images.ctfassets.net/w8fcmtakin9b/6l8CDPhaiBsBrhVvvGxb5B/037f17c73d5fa483c9053e078e187e45/bristol.jpg' },
  { id: 3, name: 'Durham', address: 'The Riverwalk, Millburngate, Durham, DH1 4SL', image: 'https://images.ctfassets.net/w8fcmtakin9b/3IyaKLwulqbH0UBDRADwOx/89384f6d06bde0e887d5e1eb890deb02/durham.jpg' },
  { id: 4, name: 'Edinburgh', address: '11 Little King St, Edinburgh, EH1 3EG', image: 'https://images.ctfassets.net/w8fcmtakin9b/1mXhwJVvKxE5294hRbx6GM/839c81e6609f897ab524a8d43329d0c1/edinburgh.jpg' },
  { id: 5, name: 'Glasgow', address: '60 St Vincent St, Glasgow, G2 5TS', image: 'https://images.ctfassets.net/w8fcmtakin9b/4HpVehiO3jg3YT38DSNZxI/10fb107b364fa6a05debc66249b1e979/glasgow.jpg' },
  { id: 6, name: 'Leicester', address: '59 Abbey St, Leicester, LE1 3TE', image: 'https://images.ctfassets.net/w8fcmtakin9b/2MFSsUW0SIgXjuhiGSofZk/10a03f1b3f319fadc248c4cf2f6e2b1a/leicester.jpg' }
];

const Locations: React.FC = () => {
  const [visibleLocations, setVisibleLocations] = useState(4);

  const handleLoadMore = () => {
    setVisibleLocations(locationsData.length);
  };

  return (
    <section id="locations" className="py-20 bg-dark">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display neon-text mb-4">LOCATIONS</h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Find your nearest Lane7 venue and start planning your epic night out.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {locationsData.slice(0, visibleLocations).map((location) => (
            <Card key={location.id} className="bg-dark border border-neon-blue/50 overflow-hidden hover:border-neon-pink transition-all duration-300">
              <div className="h-48 overflow-hidden">
                <img
                  src={location.image}
                  alt={location.name}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
              </div>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin size={16} className="text-neon-pink" />
                  <h3 className="text-xl font-display text-white">{location.name}</h3>
                </div>
                <p className="text-white/70 mb-4">{location.address}</p>
                <Button variant="link" className="text-neon-blue hover:text-neon-pink p-0 transition-colors duration-300">
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {visibleLocations < locationsData.length && (
          <div className="mt-8 text-center">
            <Button 
              onClick={handleLoadMore} 
              variant="outline" 
              className="border-neon-blue text-white hover:bg-neon-blue/20"
            >
              Load More Locations
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Locations;
