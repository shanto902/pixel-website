
import React, { useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";

const Hero: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Neon Flappy Bird style game
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
    let gameStarted = false;
    const gravity = 0.5;
    const jumpStrength = -8;
    
    // Bird variables
    const bird = {
      x: canvas.width / 3,
      y: canvas.height / 2,
      radius: 15,
      velocity: 0,
      color: '#ff0099', // Neon pink
      glowColor: '#ff0099',
      draw: function() {
        // Bird body
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
        
        // Neon glow effect
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius + 2, 0, Math.PI * 2);
        ctx.strokeStyle = this.glowColor;
        ctx.lineWidth = 2;
        ctx.shadowBlur = 15;
        ctx.shadowColor = this.glowColor;
        ctx.stroke();
        ctx.closePath();
        
        // Reset shadow for other elements
        ctx.shadowBlur = 0;
      }
    };
    
    // Pipe variables
    const pipes = [];
    const pipeWidth = 60;
    const pipeGap = 160;
    const pipeColors = ['#00c3ff', '#ffcc00', '#33ff33', '#cc66ff']; // Neon colors
    const minPipeHeight = 50;
    
    function createPipe() {
      const pipeColor = pipeColors[Math.floor(Math.random() * pipeColors.length)];
      const topPipeHeight = minPipeHeight + Math.random() * (canvas.height - pipeGap - minPipeHeight * 2);
      
      pipes.push({
        x: canvas.width,
        width: pipeWidth,
        topHeight: topPipeHeight,
        bottomY: topPipeHeight + pipeGap,
        bottomHeight: canvas.height - topPipeHeight - pipeGap,
        color: pipeColor,
        glowColor: pipeColor,
        passed: false
      });
    }
    
    // Initial pipe
    setTimeout(createPipe, 1500);
    
    // Handle user input
    function handleClick() {
      if (!gameStarted) {
        gameStarted = true;
      }
      
      if (gameActive) {
        bird.velocity = jumpStrength;
      } else {
        // Reset game
        resetGame();
      }
    }
    
    function handleKeyPress(e) {
      if (e.code === 'Space' || e.key === ' ' || e.key === 'ArrowUp') {
        handleClick();
      }
    }
    
    canvas.addEventListener('click', handleClick);
    window.addEventListener('keydown', handleKeyPress);
    
    // Reset game function
    function resetGame() {
      bird.y = canvas.height / 2;
      bird.velocity = 0;
      pipes.length = 0;
      score = 0;
      gameActive = true;
      gameStarted = false;
      setTimeout(createPipe, 1500);
    }
    
    // Check collisions
    function checkCollision() {
      // Floor and ceiling collision
      if (bird.y + bird.radius > canvas.height || bird.y - bird.radius < 0) {
        gameActive = false;
      }
      
      // Pipe collision
      pipes.forEach(pipe => {
        // Check if bird is within the x-range of the pipe
        if (bird.x + bird.radius > pipe.x && bird.x - bird.radius < pipe.x + pipe.width) {
          // Check if bird hit top pipe
          if (bird.y - bird.radius < pipe.topHeight) {
            gameActive = false;
          }
          // Check if bird hit bottom pipe
          if (bird.y + bird.radius > pipe.bottomY) {
            gameActive = false;
          }
        }
        
        // Check if bird passed the pipe
        if (!pipe.passed && bird.x > pipe.x + pipe.width) {
          score += 1;
          pipe.passed = true;
        }
      });
    }
    
    // Game loop
    const draw = () => {
      if (!ctx) return;
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw background grid for neon effect
      drawNeonGrid();
      
      // Draw bird
      bird.draw();
      
      // Update bird position if game started
      if (gameStarted) {
        bird.velocity += gravity;
        bird.y += bird.velocity;
        
        // Check collisions
        if (gameActive) {
          checkCollision();
        }
        
        // Create new pipes
        if (gameActive && pipes.length > 0 && canvas.width - pipes[pipes.length - 1].x > 220) {
          createPipe();
        }
      }
      
      // Draw and update pipes
      pipes.forEach((pipe, index) => {
        // Draw top pipe
        ctx.fillStyle = pipe.color;
        ctx.fillRect(pipe.x, 0, pipe.width, pipe.topHeight);
        
        // Draw bottom pipe
        ctx.fillRect(pipe.x, pipe.bottomY, pipe.width, pipe.bottomHeight);
        
        // Add neon glow effect to pipes
        ctx.strokeStyle = pipe.glowColor;
        ctx.lineWidth = 2;
        ctx.shadowBlur = 10;
        ctx.shadowColor = pipe.glowColor;
        
        // Stroke top pipe
        ctx.strokeRect(pipe.x, 0, pipe.width, pipe.topHeight);
        
        // Stroke bottom pipe
        ctx.strokeRect(pipe.x, pipe.bottomY, pipe.width, pipe.bottomHeight);
        
        // Reset shadow
        ctx.shadowBlur = 0;
        
        // Move pipe if game is active and started
        if (gameActive && gameStarted) {
          pipe.x -= 2;
        }
        
        // Remove pipes that are off screen
        if (pipe.x + pipe.width < 0) {
          pipes.splice(index, 1);
        }
      });
      
      // Draw score
      ctx.fillStyle = 'white';
      ctx.font = '20px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`Score: ${score}`, canvas.width / 2, 30);
      
      // Game over or start message
      if (!gameActive) {
        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#ff0099';
        ctx.font = '24px Arial';
        ctx.fillText('Game Over!', canvas.width / 2, canvas.height / 2 - 50);
        ctx.font = '18px Arial';
        ctx.fillText('Click or press Space to restart', canvas.width / 2, canvas.height / 2);
      } else if (!gameStarted) {
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#00c3ff';
        ctx.font = '22px Arial';
        ctx.fillText('Neon Flapper', canvas.width / 2, canvas.height / 2 - 50);
        ctx.font = '16px Arial';
        ctx.fillStyle = 'white';
        ctx.fillText('Click or press Space to start', canvas.width / 2, canvas.height / 2);
        ctx.fillText('Avoid hitting the pipes!', canvas.width / 2, canvas.height / 2 + 30);
      }
      
      requestAnimationFrame(draw);
    };
    
    // Draw neon grid background
    function drawNeonGrid() {
      const gridSize = 40;
      ctx.strokeStyle = 'rgba(0, 195, 255, 0.2)'; // Neon blue with low opacity
      ctx.lineWidth = 1;
      
      // Draw vertical lines
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      
      // Draw horizontal lines
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
    }
    
    // Resize handler
    const handleResize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    
    window.addEventListener('resize', handleResize);
    draw();
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleKeyPress);
      canvas.removeEventListener('click', handleClick);
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
                  <p>Click or press Space to play!</p>
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
