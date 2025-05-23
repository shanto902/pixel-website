
import React from 'react';
import { Button } from "@/components/ui/button";

const Hero: React.FC = () => {
  return (
    <div className="video-container">
      <video autoPlay muted loop playsInline>
        <source src="https://videos.ctfassets.net/w8fcmtakin9b/4Kdit2I9Ka9iHCzuo4e8xt/83d77455b62a7c626ddb53143c333059/LANE7_MASTER_FA_LONG_QUIETER_COMPRESSED.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="video-overlay"></div>
      <div className="content-wrapper h-full flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-display mb-6 neon-text-pink animate-neon-pulse">
              BOWL DRINK EAT PLAY
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90">
              Premium bowling and entertainment venues across the UK, featuring the best games, food, and drinks.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-neon-pink hover:bg-neon-blue text-white text-lg transition-colors duration-300">
                Book Now
              </Button>
              <Button size="lg" variant="outline" className="border-neon-blue text-white hover:bg-neon-blue/20 text-lg transition-colors duration-300">
                Find Location
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
