"use client";
import React, { useEffect, useRef } from "react";

export const PixelPacGame: React.FC<{ className?: string }> = ({
  className = "",
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const setSize = () => {
      canvas.width = canvas.offsetWidth - 20;
      canvas.height = canvas.offsetHeight + 80;
    };
    setSize();

    const grid = 24;
    const rand = Math.random;
    let level = 1;
    let lives = 3;
    let score = 0;
    let gameRunning = false;
    let acceptInput = false;
    let frame = 0;

    const beep = (type: "chomp" | "death" | "next") => {
      const ctx = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain).connect(ctx.destination);

      gain.gain.value = 0.1;
      switch (type) {
        case "chomp":
          osc.type = "square";
          osc.frequency.value = 150;
          osc.start();
          osc.stop(ctx.currentTime + 0.1);
          break;
        case "death":
          osc.type = "triangle";
          osc.frequency.setValueAtTime(300, ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.5);
          gain.gain.value = 0.2;
          osc.start();
          osc.stop(ctx.currentTime + 0.5);
          break;
        case "next":
          osc.type = "sawtooth";
          osc.frequency.setValueAtTime(220, ctx.currentTime);
          osc.frequency.setValueAtTime(330, ctx.currentTime + 0.2);
          osc.frequency.setValueAtTime(440, ctx.currentTime + 0.4);
          osc.start();
          osc.stop(ctx.currentTime + 0.6);
          break;
      }
    };

    const colors = ["#000", "#00c3ff", "#ffcc00", "#ff0099", "#fff"];
    const [bgCol, wallCol, pacCol, ghostCol, pelletCol] = colors;

    const rows = Math.floor(canvas.height / grid);
    const cols = Math.floor(canvas.width / grid);

    const makeMaze = (density: number) => {
      const m: number[][] = [];
      for (let r = 0; r < rows; r++) {
        const row: number[] = [];
        for (let c = 0; c < cols; c++) {
          const border = r === 0 || r === rows - 1 || c === 0 || c === cols - 1;
          const wall = !border && rand() < density;
          row.push(border || wall ? 1 : 0);
        }
        m.push(row);
      }
      const cr = Math.floor(rows / 2);
      const cc = Math.floor(cols / 2);
      for (let r = cr - 1; r <= cr + 1; r++)
        for (let c = cc - 1; c <= cc + 1; c++) m[r][c] = 0;
      return m;
    };

    const pac = {
      x: 0,
      y: 0,
      size: grid - 4,
      speed: grid / 5,
      dir: { x: 0, y: 0 },
      next: { x: 0, y: 0 },
      mouth: true,
      draw() {
        ctx.save();
        ctx.translate(this.x + this.size / 2, this.y + this.size / 2);
        let rot = 0;
        if (this.dir.x === -1) rot = Math.PI;
        else if (this.dir.y === -1) rot = 1.5 * Math.PI;
        else if (this.dir.y === 1) rot = 0.5 * Math.PI;
        ctx.rotate(rot);

        const r = this.size / 2;
        const a = this.mouth ? Math.PI / 4 : Math.PI / 20;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, r, a, 2 * Math.PI - a);
        ctx.closePath();
        ctx.fillStyle = pacCol;
        ctx.fill();
        ctx.shadowBlur = 10;
        ctx.shadowColor = pacCol;
        ctx.strokeStyle = pacCol;
        ctx.stroke();
        ctx.restore();
      },
    };

    const ghosts: any[] = [];
    const pellets: any[] = [];

    const makeGhost = () => {
      let gx = 0,
        gy = 0,
        ok = false;
      while (!ok) {
        const r = Math.floor(rand() * rows);
        const c = Math.floor(rand() * cols);
        if (maze[r][c] === 0) {
          gx = c * grid;
          gy = r * grid;
          ok = true;
        }
      }
      const dirs = [
        { x: 1, y: 0 },
        { x: -1, y: 0 },
        { x: 0, y: 1 },
        { x: 0, y: -1 },
      ];
      ghosts.push({
        x: gx,
        y: gy,
        size: grid - 4,
        speed: grid / 10,
        dir: dirs[Math.floor(rand() * dirs.length)],
      });
    };

    const makePellet = () => {
      const size = Math.max(4, grid / 6);
      let x = 0,
        y = 0,
        ok = false;
      while (!ok) {
        const r = Math.floor(rand() * rows);
        const c = Math.floor(rand() * cols);
        if (maze[r][c] === 0) {
          x = c * grid + grid / 2 - size / 2;
          y = r * grid + grid / 2 - size / 2;
          ok = true;
        }
      }
      pellets.push({ x, y, size });
    };

    const setLevel = () => {
      maze = makeMaze(0.07 + 0.01 * level);
      pac.x = Math.floor(cols / 2) * grid;
      pac.y = Math.floor(rows / 2) * grid;
      ghosts.length = 0;
      pellets.length = 0;
      for (let i = 0; i < 4; i++) makeGhost();
      for (let i = 0; i < 30 + level * 5; i++) makePellet();
    };

    const lifeLost = () => {
      lives--;
      beep("death");
      if (lives <= 0) {
        gameRunning = false;
        return;
      }
      pac.x = Math.floor(cols / 2) * grid;
      pac.y = Math.floor(rows / 2) * grid;
      pac.dir = { x: 0, y: 0 };
      pac.next = { x: 0, y: 0 };
      gameRunning = false;
    };

    const nextLevel = () => {
      level++;
      beep("next");
      setLevel();
    };

    let maze = makeMaze(0.07);
    setLevel();

    const draw = () => {
      frame++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = bgCol;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let r = 0; r < rows; r++)
        for (let c = 0; c < cols; c++)
          if (maze[r][c] === 1) {
            ctx.fillStyle = wallCol;
            ctx.fillRect(c * grid, r * grid, grid, grid);
          }

      pellets.forEach((p) => {
        ctx.fillStyle = pelletCol;
        ctx.fillRect(p.x, p.y, p.size, p.size);
      });

      pac.draw();

      ghosts.forEach((g) => {
        ctx.save();
        ctx.translate(g.x, g.y);
        ctx.fillStyle = ghostCol;
        ctx.beginPath();
        ctx.arc(g.size / 2, g.size / 2, g.size / 2, Math.PI, 0, false);
        ctx.lineTo(g.size, g.size);
        for (let i = 0; i < 3; i++) {
          const dx = (g.size / 3) * i;
          ctx.arc(dx + g.size / 6, g.size, g.size / 6, 0, Math.PI, true);
        }
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.arc(g.size / 3, g.size / 2, g.size / 6, 0, 2 * Math.PI);
        ctx.arc((2 * g.size) / 3, g.size / 2, g.size / 6, 0, 2 * Math.PI);
        ctx.fill();

        ctx.fillStyle = "#000";
        ctx.beginPath();
        ctx.arc(g.size / 3, g.size / 2, g.size / 12, 0, 2 * Math.PI);
        ctx.arc((2 * g.size) / 3, g.size / 2, g.size / 12, 0, 2 * Math.PI);
        ctx.fill();
        ctx.restore();
      });

      ctx.fillStyle = "#fff";
      ctx.font = '14px "Press Start 2P", monospace';
      ctx.fillText(`Score: ${score}`, 80, 40);
      ctx.fillText(`Level: ${level}`, 80, 60);
      ctx.fillText(`Lives: ${"❤".repeat(lives)}`, 94, 80);

      if (!gameRunning) {
        ctx.fillStyle = "rgba(0,0,0,0.7)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#fff";
        ctx.textAlign = "center";
        ctx.font = '20px "Press Start 2P", monospace';
        ctx.fillText("PIXEL PAC", canvas.width / 2, canvas.height / 2 - 40);
        ctx.font = '12px "Press Start 2P", monospace';
        ctx.fillText(
          lives === 0
            ? "Press Space to restart"
            : "Click or Arrow Keys to Start",
          canvas.width / 2,
          canvas.height / 2
        );
      }
      requestAnimationFrame(draw);
    };
    draw();

    const tick = () => {
      if (gameRunning && acceptInput) {
        if (frame % 15 === 0) pac.mouth = !pac.mouth;
        const nx = pac.x + pac.dir.x * pac.speed;
        const ny = pac.y + pac.dir.y * pac.speed;
        const r = Math.floor((ny + pac.size / 2) / grid);
        const c = Math.floor((nx + pac.size / 2) / grid);
        if (maze[r]?.[c] !== 1) {
          pac.x = nx;
          pac.y = ny;
        }
        if (pac.next.x || pac.next.y) {
          const nr = Math.floor(
            (pac.y + pac.next.y * pac.speed + pac.size / 2) / grid
          );
          const nc = Math.floor(
            (pac.x + pac.next.x * pac.speed + pac.size / 2) / grid
          );
          if (maze[nr]?.[nc] !== 1) {
            pac.dir = { ...pac.next };
            pac.next = { x: 0, y: 0 };
          }
        }

        pellets.forEach((p, i) => {
          if (
            pac.x < p.x + p.size &&
            pac.x + pac.size > p.x &&
            pac.y < p.y + p.size &&
            pac.y + pac.size > p.y
          ) {
            pellets.splice(i, 1);
            score += 10;
            beep("chomp");
            if (pellets.length === 0) nextLevel();
          }
        });

        ghosts.forEach((g) => {
          const nx = g.x + g.dir.x * g.speed;
          const ny = g.y + g.dir.y * g.speed;
          const r = Math.floor((ny + g.size / 2) / grid);
          const c = Math.floor((nx + g.size / 2) / grid);
          if (maze[r]?.[c] !== 1) {
            g.x = nx;
            g.y = ny;
          } else {
            const dirs = [
              { x: 1, y: 0 },
              { x: -1, y: 0 },
              { x: 0, y: 1 },
              { x: 0, y: -1 },
            ].sort(() => rand() - 0.5);
            for (const d of dirs) {
              const nr = Math.floor((g.y + d.y * g.speed + g.size / 2) / grid);
              const nc = Math.floor((g.x + d.x * g.speed + g.size / 2) / grid);
              if (maze[nr]?.[nc] !== 1) {
                g.dir = d;
                break;
              }
            }
          }
          if (
            pac.x < g.x + g.size &&
            pac.x + pac.size > g.x &&
            pac.y < g.y + g.size &&
            pac.y + pac.size > g.y
          ) {
            lifeLost();
          }
        });
      }
      setTimeout(tick, 16);
    };
    tick();

    const keyHandler = (e: KeyboardEvent) => {
      const keys = [
        "ArrowUp",
        "ArrowDown",
        "ArrowLeft",
        "ArrowRight",
        " ",
        "Enter",
      ];
      if (keys.includes(e.key)) e.preventDefault();

      if (!acceptInput) {
        acceptInput = true;
        gameRunning = true;
      }

      if (!gameRunning && lives === 0 && [" ", "Enter"].includes(e.key)) {
        lives = 3;
        level = 1;
        score = 0;
        setLevel();
        gameRunning = true;
        return;
      }

      if (!gameRunning && [" ", "Enter"].includes(e.key)) {
        gameRunning = true;
        return;
      }

      if (gameRunning) {
        if (e.key === "ArrowUp") pac.next = { x: 0, y: -1 };
        if (e.key === "ArrowDown") pac.next = { x: 0, y: 1 };
        if (e.key === "ArrowLeft") pac.next = { x: -1, y: 0 };
        if (e.key === "ArrowRight") pac.next = { x: 1, y: 0 };
      }
    };
    const clickHandler = (e: MouseEvent) => {
      if (!acceptInput) {
        acceptInput = true;
        gameRunning = true;
      }
    };

    window.addEventListener("keydown", keyHandler, { passive: false });
    canvas.addEventListener("click", clickHandler);
    window.addEventListener("resize", setSize);

    return () => {
      window.removeEventListener("keydown", keyHandler);
      canvas.removeEventListener("click", clickHandler);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-[450px] absolute inset-0 block select-none ${className}`}
      style={{ touchAction: "none" }}
    />
  );
};
