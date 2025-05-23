
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MapPin, ChevronDown } from "lucide-react";

const locations = [
  'Bangkok',
  'Chiang Mai',
  'Phuket',
  'Pattaya',
  'Hua Hin',
  'Krabi',
  'Koh Samui',
  'Ayutthaya',
  'Khon Kaen',
  'Hat Yai'
];

const LocationSelector: React.FC = () => {
  const [selectedLocation, setSelectedLocation] = useState('Select Location');

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2 text-white">
          <MapPin size={16} className="text-neon-pink" />
          <span>{selectedLocation}</span>
          <ChevronDown size={16} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-dark border border-neon-blue">
        {locations.map((location) => (
          <DropdownMenuItem 
            key={location}
            onClick={() => setSelectedLocation(location)}
            className="cursor-pointer hover:bg-muted/20 text-white"
          >
            {location}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LocationSelector;
