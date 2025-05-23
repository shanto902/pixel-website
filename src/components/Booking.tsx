
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const Booking: React.FC = () => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  
  return (
    <section id="booking" className="py-20 bg-gradient-to-b from-black to-dark">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-dark border border-neon-blue neon-border overflow-hidden">
            <CardHeader className="text-center border-b border-neon-blue/30 bg-black/50">
              <CardTitle className="text-3xl md:text-4xl font-display neon-text">BOOK YOUR LANE</CardTitle>
              <CardDescription className="text-white/80">
                Reserve your spot for bowling, karaoke, beer pong, and more
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm text-white/70">Select Location</label>
                  <Select>
                    <SelectTrigger className="bg-black/60 text-white border-neon-blue/50">
                      <SelectValue placeholder="Choose location" />
                    </SelectTrigger>
                    <SelectContent className="bg-dark text-white border border-neon-blue/50">
                      <SelectItem value="birmingham">Birmingham</SelectItem>
                      <SelectItem value="bristol">Bristol</SelectItem>
                      <SelectItem value="durham">Durham</SelectItem>
                      <SelectItem value="edinburgh">Edinburgh</SelectItem>
                      <SelectItem value="glasgow">Glasgow</SelectItem>
                      <SelectItem value="leicester">Leicester</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm text-white/70">Select Activity</label>
                  <Select>
                    <SelectTrigger className="bg-black/60 text-white border-neon-blue/50">
                      <SelectValue placeholder="Choose activity" />
                    </SelectTrigger>
                    <SelectContent className="bg-dark text-white border border-neon-blue/50">
                      <SelectItem value="bowling">Bowling</SelectItem>
                      <SelectItem value="karaoke">Karaoke</SelectItem>
                      <SelectItem value="beer-pong">Beer Pong</SelectItem>
                      <SelectItem value="arcade">Arcade</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm text-white/70">Select Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full bg-black/60 text-white border-neon-blue/50 justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-dark border border-neon-blue/50">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        className="p-3 pointer-events-auto bg-dark text-white"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm text-white/70">Select Time</label>
                  <Select>
                    <SelectTrigger className="bg-black/60 text-white border-neon-blue/50">
                      <SelectValue placeholder="Choose time" />
                    </SelectTrigger>
                    <SelectContent className="bg-dark text-white border border-neon-blue/50">
                      <SelectItem value="1200">12:00 PM</SelectItem>
                      <SelectItem value="1300">1:00 PM</SelectItem>
                      <SelectItem value="1400">2:00 PM</SelectItem>
                      <SelectItem value="1500">3:00 PM</SelectItem>
                      <SelectItem value="1600">4:00 PM</SelectItem>
                      <SelectItem value="1700">5:00 PM</SelectItem>
                      <SelectItem value="1800">6:00 PM</SelectItem>
                      <SelectItem value="1900">7:00 PM</SelectItem>
                      <SelectItem value="2000">8:00 PM</SelectItem>
                      <SelectItem value="2100">9:00 PM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm text-white/70">Group Size</label>
                <Input 
                  type="number" 
                  placeholder="Number of people" 
                  min="1"
                  className="bg-black/60 text-white border-neon-blue/50"
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-center p-6 bg-black/30">
              <Button size="lg" className="bg-neon-pink hover:bg-neon-blue text-white text-lg font-medium transition-colors duration-300">
                Book Now
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Booking;
