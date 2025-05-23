
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
    const gridSize = 24;
    
    // Game variables
    let score = 0;
    let gameActive = true;
    let gameStarted = false;
    
    // Audio setup
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    function createSound(type: 'chomp' | 'death' | 'win') {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      if (type === 'chomp') {
        oscillator.type = 'square';
        oscillator.frequency.value = 120;
        gainNode.gain.value = 0.1;
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.1);
      } else if (type === 'death') {
        oscillator.type = 'triangle';
        oscillator.frequency.setValueAtTime(300, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(50, audioContext.currentTime + 1);
        gainNode.gain.value = 0.2;
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 1);
      } else if (type === 'win') {
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(220, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(330, audioContext.currentTime + 0.2);
        oscillator.frequency.setValueAtTime(440, audioContext.currentTime + 0.4);
        gainNode.gain.value = 0.1;
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.6);
      }
    }
    
    // Colors
    const colors = {
      background: '#000',
      walls: '#00c3ff',
      pacman: '#ffcc00',
      ghost: '#ff0099',
      pellet: '#ffffff',
      text: '#ff0099'
    };
    
    // Create maze layout
    const rows = Math.floor(canvas.height / gridSize);
    const cols = Math.floor(canvas.width / gridSize);
    
    // Create a simplified maze
    const maze: number[][] = [];
    for (let r = 0; r < rows; r++) {
      const row: number[] = [];
      for (let c = 0; c < cols; c++) {
        // Create border walls
        if (r === 0 || r === rows - 1 || c === 0 || c === cols - 1) {
          row.push(1); // Wall
        } 
        // Create some internal walls
        else if ((r === 3 && c > 2 && c < cols - 3) || 
                (r === rows - 4 && c > 2 && c < cols - 3) ||
                (c === 3 && r > 2 && r < rows - 3) ||
                (c === cols - 4 && r > 2 && r < rows - 3)) {
          row.push(1); // Wall
        }
        // Add some random internal walls
        else if (Math.random() < 0.1 && !(r === Math.floor(rows/2) && c === Math.floor(cols/2))) {
          row.push(1); // Wall
        }
        else {
          row.push(0); // Path
        }
      }
      maze.push(row);
    }
    
    // Ensure there's a clear space at the center for Pac-Man's starting position
    const centerRow = Math.floor(rows / 2);
    const centerCol = Math.floor(cols / 2);
    for (let r = centerRow - 1; r <= centerRow + 1; r++) {
      for (let c = centerCol - 1; c <= centerCol + 1; c++) {
        if (r >= 0 && r < rows && c >= 0 && c < cols) {
          maze[r][c] = 0; // Clear path
        }
      }
    }
    
    // Pac-Man variables
    const pacman = {
      x: Math.floor(canvas.width / (2 * gridSize)) * gridSize,
      y: Math.floor(canvas.height / (2 * gridSize)) * gridSize,
      size: gridSize - 4,
      speed: gridSize / 5, // Reduced speed
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
        const mouthSize = this.mouthOpen ? this.size/3 : 2;
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
        ctx.shadowBlur = 0;
        
        ctx.restore();
      },
      update: function() {
        // Try to change direction if a new direction is queued
        if (this.nextDirection.x !== 0 || this.nextDirection.y !== 0) {
          const nextRow = Math.floor((this.y + this.nextDirection.y * this.speed + this.size/2) / gridSize);
          const nextCol = Math.floor((this.x + this.nextDirection.x * this.speed + this.size/2) / gridSize);
          
          // Check if next position is valid (not a wall)
          if (nextRow >= 0 && nextRow < rows && nextCol >= 0 && nextCol < cols && maze[nextRow][nextCol] !== 1) {
            this.direction = { ...this.nextDirection };
            this.nextDirection = { x: 0, y: 0 };
          }
        }
        
        // Calculate next position
        const nextX = this.x + this.direction.x * this.speed;
        const nextY = this.y + this.direction.y * this.speed;
        
        // Check collision with walls
        const nextRow = Math.floor((nextY + this.size/2) / gridSize);
        const nextCol = Math.floor((nextX + this.size/2) / gridSize);
        
        if (nextRow >= 0 && nextRow < rows && nextCol >= 0 && nextCol < cols && maze[nextRow][nextCol] !== 1) {
          // Move Pac-Man if no wall collision
          this.x = nextX;
          this.y = nextY;
        }
        
        // Wrap around screen
        if (this.x < 0) this.x = canvas.width - this.size;
        if (this.x > canvas.width - this.size) this.x = 0;
        if (this.y < 0) this.y = canvas.height - this.size;
        if (this.y > canvas.height - this.size) this.y = 0;
        
        // Animate mouth
        if (gameActive && frameCount % 15 === 0) { // Slower mouth animation
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
            
            // Create sound effect
            createSound('chomp');
            
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
            if (gameActive) {
              createSound('death');
            }
            gameActive = false;
          }
        });
      }
    };
    
    // Ghost variables
    const ghosts = [];
    const maxGhosts = 3;
    
    function createGhost() {
      const size = gridSize - 4;
      // Place ghost away from Pac-Man
      let x, y;
      let valid = false;
      
      while (!valid) {
        const r = Math.floor(Math.random() * rows);
        const c = Math.floor(Math.random() * cols);
        
        if (maze[r][c] === 0) { // If not a wall
          x = c * gridSize;
          y = r * gridSize;
          
          // Make sure it's far enough from Pac-Man
          if (Math.abs(x - pacman.x) > canvas.width / 3 || Math.abs(y - pacman.y) > canvas.height / 3) {
            valid = true;
          }
        }
      }
      
      const ghost = {
        x,
        y,
        size,
        speed: gridSize/10, // Reduced speed
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
          // Check if current direction leads to a wall
          const nextRow = Math.floor((this.y + this.direction.y * this.speed + this.size/2) / gridSize);
          const nextCol = Math.floor((this.x + this.direction.x * this.speed + this.size/2) / gridSize);
          
          // If hitting a wall or randomly (to make movement less predictable)
          if (nextRow < 0 || nextRow >= rows || nextCol < 0 || nextCol >= cols || 
              maze[nextRow][nextCol] === 1 || Math.random() < 0.02) {
              
            // Try to find a valid direction
            const directions = [
              { x: 1, y: 0 },
              { x: -1, y: 0 },
              { x: 0, y: 1 },
              { x: 0, y: -1 }
            ];
            
            // Shuffle directions to make movement more random
            for (let i = directions.length - 1; i > 0; i--) {
              const j = Math.floor(Math.random() * (i + 1));
              [directions[i], directions[j]] = [directions[j], directions[i]];
            }
            
            let foundValidDirection = false;
            for (const dir of directions) {
              const newRow = Math.floor((this.y + dir.y * this.speed + this.size/2) / gridSize);
              const newCol = Math.floor((this.x + dir.x * this.speed + this.size/2) / gridSize);
              
              if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols && maze[newRow][newCol] !== 1) {
                this.direction = dir;
                foundValidDirection = true;
                break;
              }
            }
            
            // If no valid direction, stop
            if (!foundValidDirection) {
              this.direction = { x: 0, y: 0 };
            }
          }
          
          // Move ghost if the path is clear
          const newX = this.x + this.direction.x * this.speed;
          const newY = this.y + this.direction.y * this.speed;
          const newRow = Math.floor((newY + this.size/2) / gridSize);
          const newCol = Math.floor((newX + this.size/2) / gridSize);
          
          if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols && maze[newRow][newCol] !== 1) {
            this.x = newX;
            this.y = newY;
          }
          
          // Occasionally move toward Pac-Man
          if (gameActive && Math.random() < 0.1) {
            // Decide whether to move horizontally or vertically toward Pac-Man
            if (Math.abs(this.x - pacman.x) > Math.abs(this.y - pacman.y)) {
              this.direction.x = this.x < pacman.x ? 1 : -1;
              this.direction.y = 0;
            } else {
              this.direction.x = 0;
              this.direction.y = this.y < pacman.y ? 1 : -1;
            }
            
            // Check if this direction hits a wall
            const targetRow = Math.floor((this.y + this.direction.y * this.speed + this.size/2) / gridSize);
            const targetCol = Math.floor((this.x + this.direction.x * this.speed + this.size/2) / gridSize);
            
            // If it would hit a wall, revert the direction change
            if (targetRow < 0 || targetRow >= rows || targetCol < 0 || targetCol >= cols || maze[targetRow][targetCol] === 1) {
              if (Math.random() < 0.5) {
                this.direction.x = Math.random() < 0.5 ? -1 : 1;
                this.direction.y = 0;
              } else {
                this.direction.x = 0;
                this.direction.y = Math.random() < 0.5 ? -1 : 1;
              }
            }
          }
        }
      };
      
      ghosts.push(ghost);
    }
    
    // Pellet variables
    const pellets = [];
    const maxPellets = 30;
    
    function createPellet() {
      const size = Math.max(4, Math.floor(gridSize/6));
      let valid = false;
      let x, y, row, col;
      
      // Make sure pellet isn't on top of pacman, ghost, another pellet, or a wall
      while (!valid) {
        row = Math.floor(Math.random() * rows);
        col = Math.floor(Math.random() * cols);
        
        if (maze[row][col] === 0) { // Not a wall
          x = col * gridSize + gridSize/2 - size/2;
          y = row * gridSize + gridSize/2 - size/2;
          
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
        } else {
          valid = false;
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
      
      // Create win sound
      createSound('win');
    }
    
    // Draw maze function
    function drawMaze() {
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (maze[r][c] === 1) {
            ctx.fillStyle = colors.walls;
            ctx.fillRect(c * gridSize, r * gridSize, gridSize, gridSize);
            
            // Add subtle glow effect to walls
            ctx.shadowBlur = 3;
            ctx.shadowColor = colors.walls;
            ctx.strokeStyle = colors.walls;
            ctx.strokeRect(c * gridSize, r * gridSize, gridSize, gridSize);
            ctx.shadowBlur = 0;
          }
        }
      }
    }
    
    // Draw pixelated grid for background (behind walls)
    function drawPixelGrid() {
      ctx.strokeStyle = 'rgba(0, 195, 255, 0.05)';
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
      
      // Draw maze
      drawMaze();
      
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
      ctx.font = '16px "Press Start 2P", monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`Score: ${score}`, canvas.width / 2, 24);
      
      // Game over or start message
      if (!gameActive) {
        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = colors.ghost;
        ctx.font = '20px "Press Start 2P", monospace';
        ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 50);
        ctx.font = '12px "Press Start 2P", monospace';
        ctx.fillText('Click or press Space to restart', canvas.width / 2, canvas.height / 2);
      } else if (!gameStarted) {
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = colors.pacman;
        ctx.font = '20px "Press Start 2P", monospace';
        ctx.fillText('PIXEL PAC', canvas.width / 2, canvas.height / 2 - 50);
        ctx.font = '12px "Press Start 2P", monospace';
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
                <Button size="lg" className="bg-neon-pink hover:bg-neon-blue text-white text-lg transition-colors duration-300">
                  Book Now
                </Button>
                <Button size="lg" variant="outline" className="border-neon-blue text-white hover:bg-neon-blue/20 text-lg transition-colors duration-300">
                  Find Location
                </Button>
              </div>
            </div>
            <div className="hidden md:block h-[400px] border-2 border-neon-pink rounded-lg overflow-hidden pixelated-border">
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
