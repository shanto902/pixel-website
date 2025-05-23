import React from "react";
import { Button } from "@/components/ui/button";
import { PixelPacGame } from "@/components/PixelPacGame";

const Hero: React.FC = () => {
  return (
    <div className="video-container">
      <video autoPlay muted loop playsInline>
        <source
          src="https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?auto=format&fit=crop&w=1920&q=80"
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>

      <div className="video-overlay pixel-overlay"></div>

      <div className="content-wrapper h-full flex items-center">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* -- Text column -- */}
            <div className="max-w-4xl">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-display mb-6 pixelated-text neon-text-pink">
                BOWL DRINK EAT & PLAY
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-white/90">
                Premium bowling and entertainment venues across Thailand,
                featuring the best games, food, and drinks.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-neon-pink hover:bg-neon-blue text-white text-lg transition-colors duration-300"
                >
                  Book Now
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-neon-blue text-white hover:bg-neon-blue/20 text-lg transition-colors duration-300"
                >
                  Find Location
                </Button>
              </div>
            </div>

            {/* -- Game column -- */}
            <div className="hidden md:block h-[450px]  rounded-lg overflow-hidden ">
              <div className="w-full h-full relative">
                <PixelPacGame />
              </div>
              <div className=" p-4 text-white text-sm pixelated-text">
                <p>Use arrow keys or click to move!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
