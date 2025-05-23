import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const locationsData = [
  {
    id: 1,
    name: "Bangkok",
    address: "789 Sukhumvit Rd, Klongtoey-Nua, Wattana, Bangkok 10110",
    image:
      "https://images.unsplash.com/photo-1563492065599-3520f775eeed?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    name: "Chiang Mai",
    address: "22 Nimmanhaemin Rd, Suthep, Muang, Chiang Mai 50200",
    image:
      "https://images.unsplash.com/photo-1578157695179-d7b7ddeb2f53?q=80&w=1931&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 3,
    name: "Phuket",
    address: "88 Thanon Ratuthit Songroipi, Patong, Kathu, Phuket 83150",
    image:
      "https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 4,
    name: "Pattaya",
    address: "255 Beach Road, Pattaya City, Bang Lamung, Chonburi 20150",
    image:
      "https://images.unsplash.com/photo-1620374710130-51526b5200f7?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8UGF0dGF5YXxlbnwwfHwwfHx8Mg%3D%3D",
  },
  {
    id: 5,
    name: "Hua Hin",
    address: "129 Phetkasem Road, Hua Hin, Prachuap Khiri Khan 77110",
    image:
      "https://images.unsplash.com/photo-1565888283243-9d0315f13e6a?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 6,
    name: "Krabi",
    address: "45 Maharaj Road, Pak Nam, Muang, Krabi 81000",
    image:
      "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=800&q=80",
  },
];

const Locations: React.FC = () => {
  const [visibleLocations, setVisibleLocations] = useState(4);

  const handleLoadMore = () => {
    setVisibleLocations(locationsData.length);
  };

  return (
    <section id="locations" className="py-20 bg-dark pixel-bg">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display neon-text mb-4 pixelated-text">
            LOCATIONS
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Find your nearest Pixel venue and start planning your epic night
            out.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {locationsData.slice(0, visibleLocations).map((location) => (
            <Card
              key={location.id}
              className="bg-dark border border-neon-blue/50 overflow-hidden rounded-lg transition-all duration-300 hover:border-neon-pink/70"
            >
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
                  <h3 className="text-xl font-display text-white pixelated-text">
                    {location.name}
                  </h3>
                </div>
                <p className="text-white/70 mb-4">{location.address}</p>
                <Button
                  variant="link"
                  className="text-neon-blue hover:text-neon-pink p-0 transition-colors duration-300 pixelated-text"
                >
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
