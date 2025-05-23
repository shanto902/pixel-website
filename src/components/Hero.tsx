
import React, { useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";

const Hero: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Simple color matching game
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set actual canvas dimensions
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Game variables
    let score = 0;
    let gameActive = true;
    const colors = ['#ff0099', '#00c3ff', '#ffcc00', '#33ff33', '#ff3333', '#cc66ff'];
    const targetColor = colors[Math.floor(Math.random() * colors.length)];
    
    // Falling blocks
    const blocks: { x: number, y: number, color: string, width: number, speed: number }[] = [];
    
    // Create initial blocks
    const createBlocks = () => {
      for (let i = 0; i < 15; i++) {
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        blocks.push({
          x: Math.random() * (canvas.width - 40),
          y: -50 - (Math.random() * 500), // Start above the canvas at varying heights
          color: randomColor,
          width: 30 + Math.random() * 20,
          speed: 1 + Math.random() * 3
        });
      }
    };
    
    createBlocks();
    
    // Game loop
    const draw = () => {
      if (!ctx || !gameActive) return;
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw target color box at the bottom
      ctx.fillStyle = targetColor;
      ctx.fillRect(canvas.width / 2 - 75, canvas.height - 40, 150, 30);
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 2;
      ctx.strokeRect(canvas.width / 2 - 75, canvas.height - 40, 150, 30);
      
      // Draw score
      ctx.fillStyle = 'white';
      ctx.font = '20px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`Score: ${score}`, canvas.width / 2, 30);
      
      // Draw and move blocks
      blocks.forEach((block, index) => {
        ctx.fillStyle = block.color;
        ctx.fillRect(block.x, block.y, block.width, block.width);
        
        // Move block down
        block.y += block.speed;
        
        // Check if block reached target zone
        if (block.y > canvas.height - 40 && block.y < canvas.height - 10) {
          const blockCenterX = block.x + block.width / 2;
          if (blockCenterX > canvas.width / 2 - 75 && blockCenterX < canvas.width / 2 + 75) {
            // Block hit target zone
            if (block.color === targetColor) {
              // Correct color match
              score += 10;
              blocks.splice(index, 1);
              blocks.push({
                x: Math.random() * (canvas.width - 40),
                y: -50,
                color: colors[Math.floor(Math.random() * colors.length)],
                width: 30 + Math.random() * 20,
                speed: 1 + Math.random() * (2 + Math.min(score/100, 3))
              });
            } else {
              // Wrong color match
              gameActive = false;
              setTimeout(() => {
                // Restart game after 2 seconds
                score = 0;
                gameActive = true;
                blocks.length = 0;
                createBlocks();
              }, 2000);
            }
          }
        }
        
        // If block goes off screen, reset it
        if (block.y > canvas.height) {
          block.y = -50;
          block.x = Math.random() * (canvas.width - 40);
        }
      });
      
      // Instructions
      if (!gameActive) {
        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'white';
        ctx.font = '24px Arial';
        ctx.fillText('Game Over!', canvas.width / 2, canvas.height / 2 - 50);
        ctx.font = '18px Arial';
        ctx.fillText('Restarting...', canvas.width / 2, canvas.height / 2);
      }
      
      requestAnimationFrame(draw);
    };
    
    // Resize handler
    const handleResize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    
    window.addEventListener('resize', handleResize);
    draw();
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return (
    <div className="video-container">
      <video autoPlay muted loop playsInline>
        <source src="https://videos.ctfassets.net/w8fcmtakin9b/4Kdit2I9Ka9iHCzuo4e8xt/83d77455b62a7c626ddb53143c333059/LANE7_MASTER_FA_LONG_QUIETER_COMPRESSED.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="video-overlay"></div>
      <div className="content-wrapper h-full flex items-center">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="max-w-2xl">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-display mb-6 neon-text-pink animate-neon-pulse">
                BOWL DRINK EAT PLAY
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-white/90">
                Premium bowling and entertainment venues across Thailand, featuring the best games, food, and drinks.
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
            <div className="hidden md:block h-[400px] border-2 border-neon-pink rounded-lg overflow-hidden">
              <div className="w-full h-full relative bg-dark/80">
                <canvas 
                  ref={canvasRef} 
                  className="w-full h-full"
                  style={{ touchAction: "none" }}
                ></canvas>
                <div className="absolute top-0 left-0 p-4 text-white text-sm">
                  <p>Match falling blocks with the color at the bottom!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
