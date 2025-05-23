import React, { useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";

const Hero: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Pixelated Pac-Man style game
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set actual canvas dimensions
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Grid size for pixelated effect
    const gridSize = 20;
    
    // Game variables
    let score = 0;
    let gameActive = true;
    let gameStarted = false;
    
    // Colors
    const colors = {
      background: '#000',
      walls: '#00c3ff',
      pacman: '#ffcc00',
      ghost: '#ff0099',
      pellet: '#ffffff',
      text: '#ff0099'
    };
    
    // Pac-Man variables
    const pacman = {
      x: Math.floor(canvas.width / (2 * gridSize)) * gridSize,
      y: Math.floor(canvas.height / (2 * gridSize)) * gridSize,
      size: gridSize - 2,
      speed: gridSize,
      direction: { x: 0, y: 0 },
      nextDirection: { x: 0, y: 0 },
      color: colors.pacman,
      mouthAngle: 0,
      mouthOpen: true,
      draw: function() {
        ctx.save();
        ctx.translate(this.x + this.size/2, this.y + this.size/2);
        
        // Determine rotation based on direction
        let rotation = 0;
        if (this.direction.x === 1) rotation = 0;
        if (this.direction.x === -1) rotation = Math.PI;
        if (this.direction.y === -1) rotation = Math.PI * 1.5;
        if (this.direction.y === 1) rotation = Math.PI / 2;
        
        ctx.rotate(rotation);
        
        // Draw Pac-Man body (pixelated style)
        ctx.fillStyle = this.color;
        ctx.fillRect(-this.size/2, -this.size/2, this.size, this.size);
        
        // Create "mouth" by clearing a triangle
        const mouthSize = this.mouthOpen ? this.size/3 : 0;
        ctx.fillStyle = colors.background;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(this.size/2, -mouthSize);
        ctx.lineTo(this.size/2, mouthSize);
        ctx.fill();
        
        // Add neon glow effect
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2;
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
        ctx.strokeRect(-this.size/2, -this.size/2, this.size, this.size);
        
        ctx.restore();
      },
      update: function() {
        // Try to change direction if a new direction is queued
        if (this.nextDirection.x !== 0 || this.nextDirection.y !== 0) {
          const nextX = this.x + this.nextDirection.x * this.speed;
          const nextY = this.y + this.nextDirection.y * this.speed;
          
          // Check if next position is valid
          if (!checkWallCollision(nextX, nextY)) {
            this.direction = { ...this.nextDirection };
            this.nextDirection = { x: 0, y: 0 };
          }
        }
        
        // Move Pac-Man
        this.x += this.direction.x * this.speed;
        this.y += this.direction.y * this.speed;
        
        // Keep Pac-Man within bounds
        if (this.x < 0) this.x = canvas.width - this.size;
        if (this.x > canvas.width - this.size) this.x = 0;
        if (this.y < 0) this.y = canvas.height - this.size;
        if (this.y > canvas.height - this.size) this.y = 0;
        
        // Animate mouth
        if (gameActive && frameCount % 10 === 0) {
          this.mouthOpen = !this.mouthOpen;
        }
        
        // Collect pellets
        pellets.forEach((pellet, index) => {
          if (
            this.x < pellet.x + pellet.size &&
            this.x + this.size > pellet.x &&
            this.y < pellet.y + pellet.size &&
            this.y + this.size > pellet.y
          ) {
            pellets.splice(index, 1);
            score += 10;
            
            // Create a new pellet elsewhere
            if (pellets.length < maxPellets) {
              createPellet();
            }
          }
        });
        
        // Check ghost collision
        ghosts.forEach(ghost => {
          if (
            this.x < ghost.x + ghost.size &&
            this.x + this.size > ghost.x &&
            this.y < ghost.y + ghost.size &&
            this.y + this.size > ghost.y
          ) {
            gameActive = false;
          }
        });
      }
    };
    
    // Ghost variables
    const ghosts = [];
    const maxGhosts = 3;
    
    function createGhost() {
      const size = gridSize - 2;
      // Place ghost away from Pac-Man
      let x, y;
      do {
        x = Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize;
        y = Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize;
      } while (
        Math.abs(x - pacman.x) < canvas.width / 3 &&
        Math.abs(y - pacman.y) < canvas.height / 3
      );
      
      const ghost = {
        x,
        y,
        size,
        speed: gridSize/4,
        direction: { 
          x: Math.random() < 0.5 ? -1 : 1, 
          y: Math.random() < 0.5 ? -1 : 1 
        },
        color: colors.ghost,
        draw: function() {
          // Draw ghost body (pixelated style)
          ctx.fillStyle = this.color;
          ctx.fillRect(this.x, this.y, this.size, this.size);
          
          // Add neon glow effect
          ctx.strokeStyle = this.color;
          ctx.lineWidth = 2;
          ctx.shadowBlur = 10;
          ctx.shadowColor = this.color;
          ctx.strokeRect(this.x, this.y, this.size, this.size);
          ctx.shadowBlur = 0;
          
          // Draw eyes (two white pixels)
          ctx.fillStyle = 'white';
          const eyeSize = Math.max(2, Math.floor(this.size/5));
          ctx.fillRect(this.x + this.size/4 - eyeSize/2, this.y + this.size/3, eyeSize, eyeSize);
          ctx.fillRect(this.x + 3*this.size/4 - eyeSize/2, this.y + this.size/3, eyeSize, eyeSize);
        },
        update: function() {
          // Randomly change direction occasionally
          if (Math.random() < 0.02) {
            this.direction.x = Math.random() < 0.5 ? -1 : 1;
            this.direction.y = Math.random() < 0.5 ? -1 : 1;
          }
          
          // Move towards Pac-Man with slight intelligence
          if (Math.random() < 0.1) {
            this.direction.x = this.x < pacman.x ? 1 : -1;
            this.direction.y = this.y < pacman.y ? 1 : -1;
          }
          
          // Move ghost
          this.x += this.direction.x * this.speed;
          this.y += this.direction.y * this.speed;
          
          // Keep ghost within bounds
          if (this.x < 0) this.x = canvas.width - this.size;
          if (this.x > canvas.width - this.size) this.x = 0;
          if (this.y < 0) this.y = canvas.height - this.size;
          if (this.y > canvas.height - this.size) this.y = 0;
        }
      };
      
      ghosts.push(ghost);
    }
    
    // Pellet variables
    const pellets = [];
    const maxPellets = 20;
    
    function createPellet() {
      const size = Math.max(4, Math.floor(gridSize/4));
      let x, y;
      let valid = false;
      
      // Make sure pellet isn't on top of pacman, ghost or another pellet
      while (!valid) {
        x = Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize + gridSize/2 - size/2;
        y = Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize + gridSize/2 - size/2;
        
        // Check if it's away from Pac-Man
        valid = !(
          x < pacman.x + pacman.size &&
          x + size > pacman.x &&
          y < pacman.y + pacman.size &&
          y + size > pacman.y
        );
        
        // Check if it's away from ghosts
        if (valid) {
          for (const ghost of ghosts) {
            if (
              x < ghost.x + ghost.size &&
              x + size > ghost.x &&
              y < ghost.y + ghost.size &&
              y + size > ghost.y
            ) {
              valid = false;
              break;
            }
          }
        }
        
        // Check if it's away from other pellets
        if (valid) {
          for (const pellet of pellets) {
            if (
              x < pellet.x + pellet.size &&
              x + size > pellet.x &&
              y < pellet.y + pellet.size &&
              y + size > pellet.y
            ) {
              valid = false;
              break;
            }
          }
        }
      }
      
      pellets.push({
        x,
        y,
        size,
        color: colors.pellet,
        draw: function() {
          ctx.fillStyle = this.color;
          ctx.fillRect(this.x, this.y, this.size, this.size);
          
          // Add slight glow
          ctx.shadowBlur = 5;
          ctx.shadowColor = this.color;
          ctx.strokeStyle = this.color;
          ctx.strokeRect(this.x, this.y, this.size, this.size);
          ctx.shadowBlur = 0;
        }
      });
    }
    
    // Create initial game elements
    for (let i = 0; i < maxGhosts; i++) {
      createGhost();
    }
    
    for (let i = 0; i < maxPellets; i++) {
      createPellet();
    }
    
    // Wall collision detection
    function checkWallCollision(x, y) {
      // For now, we'll just have boundary walls
      return (
        x < 0 ||
        x > canvas.width - pacman.size ||
        y < 0 ||
        y > canvas.height - pacman.size
      );
    }
    
    // Handle user input
    function handleKeyPress(e) {
      if (!gameStarted) {
        gameStarted = true;
      }
      
      if (gameActive) {
        switch (e.key) {
          case 'ArrowUp':
            pacman.nextDirection = { x: 0, y: -1 };
            break;
          case 'ArrowDown':
            pacman.nextDirection = { x: 0, y: 1 };
            break;
          case 'ArrowLeft':
            pacman.nextDirection = { x: -1, y: 0 };
            break;
          case 'ArrowRight':
            pacman.nextDirection = { x: 1, y: 0 };
            break;
        }
      } else if (e.key === ' ' || e.key === 'Enter') {
        // Reset game
        resetGame();
      }
    }
    
    // Touch and mouse controls
    function handleClick(e) {
      if (!gameStarted) {
        gameStarted = true;
      }
      
      if (!gameActive) {
        resetGame();
        return;
      }
      
      // Get touch/click position relative to canvas
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Calculate direction based on click position relative to Pac-Man
      const dx = x - (pacman.x + pacman.size/2);
      const dy = y - (pacman.y + pacman.size/2);
      
      // Determine which direction has the larger magnitude
      if (Math.abs(dx) > Math.abs(dy)) {
        pacman.nextDirection = { x: dx > 0 ? 1 : -1, y: 0 };
      } else {
        pacman.nextDirection = { x: 0, y: dy > 0 ? 1 : -1 };
      }
    }
    
    canvas.addEventListener('click', handleClick);
    window.addEventListener('keydown', handleKeyPress);
    
    // Reset game function
    function resetGame() {
      pacman.x = Math.floor(canvas.width / (2 * gridSize)) * gridSize;
      pacman.y = Math.floor(canvas.height / (2 * gridSize)) * gridSize;
      pacman.direction = { x: 0, y: 0 };
      pacman.nextDirection = { x: 0, y: 0 };
      
      score = 0;
      gameActive = true;
      gameStarted = false;
      
      ghosts.length = 0;
      pellets.length = 0;
      
      for (let i = 0; i < maxGhosts; i++) {
        createGhost();
      }
      
      for (let i = 0; i < maxPellets; i++) {
        createPellet();
      }
    }
    
    // Draw pixelated grid for background
    function drawPixelGrid() {
      ctx.strokeStyle = 'rgba(0, 195, 255, 0.1)';
      ctx.lineWidth = 1;
      
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
    }
    
    // Frame counter for animations
    let frameCount = 0;
    
    // Game loop
    const draw = () => {
      frameCount++;
      
      if (!ctx) return;
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = colors.background;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw pixelated grid
      drawPixelGrid();
      
      // Draw pellets
      pellets.forEach(pellet => pellet.draw());
      
      // Draw Pac-Man
      pacman.draw();
      
      // Draw ghosts
      ghosts.forEach(ghost => ghost.draw());
      
      // Update game logic if game is active and started
      if (gameActive && gameStarted) {
        pacman.update();
        ghosts.forEach(ghost => ghost.update());
      }
      
      // Draw score
      ctx.fillStyle = colors.text;
      ctx.font = '20px "Press Start 2P", monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`Score: ${score}`, canvas.width / 2, 30);
      
      // Game over or start message
      if (!gameActive) {
        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = colors.ghost;
        ctx.font = '24px "Press Start 2P", monospace';
        ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 50);
        ctx.font = '16px "Press Start 2P", monospace';
        ctx.fillText('Click or press Space to restart', canvas.width / 2, canvas.height / 2);
      } else if (!gameStarted) {
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = colors.pacman;
        ctx.font = '22px "Press Start 2P", monospace';
        ctx.fillText('PIXEL PAC', canvas.width / 2, canvas.height / 2 - 50);
        ctx.font = '16px "Press Start 2P", monospace';
        ctx.fillStyle = 'white';
        ctx.fillText('Click or press arrow keys to start', canvas.width / 2, canvas.height / 2);
        ctx.fillText('Collect dots & avoid ghosts!', canvas.width / 2, canvas.height / 2 + 30);
      }
      
      requestAnimationFrame(draw);
    };
    
    // Resize handler
    const handleResize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      
      // Adjust Pac-Man and ghosts to stay in bounds
      pacman.x = Math.min(pacman.x, canvas.width - pacman.size);
      pacman.y = Math.min(pacman.y, canvas.height - pacman.size);
      
      ghosts.forEach(ghost => {
        ghost.x = Math.min(ghost.x, canvas.width - ghost.size);
        ghost.y = Math.min(ghost.y, canvas.height - ghost.size);
      });
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
        <source src="https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?auto=format&fit=crop&w=1920&q=80" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="video-overlay pixel-overlay"></div>
      <div className="content-wrapper h-full flex items-center">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="max-w-2xl">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-display mb-6 pixelated-text neon-text-pink">
                BOWL DRINK EAT PLAY
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-white/90">
                Premium bowling and entertainment venues across Thailand, featuring the best games, food, and drinks.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-neon-pink hover:bg-neon-blue text-white text-lg transition-colors duration-300 pixel-btn">
                  Book Now
                </Button>
                <Button size="lg" variant="outline" className="border-neon-blue text-white hover:bg-neon-blue/20 text-lg transition-colors duration-300 pixel-btn">
                  Find Location
                </Button>
              </div>
            </div>
            <div className="hidden md:block h-[400px] border-2 border-neon-pink rounded-lg overflow-hidden pixel-border">
              <div className="w-full h-full relative bg-dark/80">
                <canvas 
                  ref={canvasRef} 
                  className="w-full h-full pixel-canvas"
                  style={{ touchAction: "none" }}
                ></canvas>
                <div className="absolute top-0 left-0 p-4 text-white text-sm pixelated-text">
                  <p>Use arrow keys or click to move!</p>
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
