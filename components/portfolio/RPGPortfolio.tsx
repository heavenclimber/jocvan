"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { projects } from "@/data/projects";
import type { ProjectItem } from "@/types";

/* ═══════════════════════════════════════════════════════════════
 *  RPG PORTFOLIO — 2D RPG-style portfolio browser
 *  Appears when the user "zooms into" the monitor in the 3D room
 * ═══════════════════════════════════════════════════════════════ */

interface RPGPortfolioProps {
  onExit: () => void;
  speakerPlaying: boolean;
  onSpeakerToggle: (playing: boolean) => void;
}

/* ── Town map locations for projects ── */
interface TownLocation {
  id: string;
  name: string;
  icon: string;
  x: number; // percentage
  y: number; // percentage
  project: ProjectItem;
  buildingColor: string;
}

const TOWN_LOCATIONS: TownLocation[] = projects.map((proj, i) => {
  const positions = [
    { x: 18, y: 30 },
    { x: 42, y: 22 },
    { x: 68, y: 28 },
    { x: 25, y: 58 },
    { x: 52, y: 62 },
    { x: 75, y: 55 },
  ];
  const icons = ["🏪", "🏛️", "🏰", "⛺", "🏚️", "🗼"];
  const colors = [
    "#ff6b6b",
    "#4ecdc4",
    "#45b7d1",
    "#f9ca24",
    "#a29bfe",
    "#fd79a8",
  ];

  const pos = positions[i % positions.length];
  return {
    id: proj.id,
    name: proj.title,
    icon: icons[i % icons.length],
    x: pos.x,
    y: pos.y,
    project: proj,
    buildingColor: colors[i % colors.length],
  };
});

/* ── RPG Character ── */
interface CharPosition {
  x: number;
  y: number;
}

export default function RPGPortfolio({ onExit, speakerPlaying, onSpeakerToggle }: RPGPortfolioProps) {
  const [charPos, setCharPos] = useState<CharPosition>({ x: 50, y: 80 });
  const [charDirection, setCharDirection] = useState<"left" | "right">("right");
  const [isWalking, setIsWalking] = useState(false);
  const [selectedProject, setSelectedProject] = useState<TownLocation | null>(null);
  const [nearbyLocation, setNearbyLocation] = useState<TownLocation | null>(null);
  const [showWelcome, setShowWelcome] = useState(true);
  const keysPressed = useRef<Set<string>>(new Set());
  const animationFrameRef = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  /* ── Check proximity to buildings ── */
  useEffect(() => {
    const nearby = TOWN_LOCATIONS.find((loc) => {
      const dx = charPos.x - loc.x;
      const dy = charPos.y - loc.y;
      return Math.sqrt(dx * dx + dy * dy) < 10;
    });
    setNearbyLocation(nearby || null);
  }, [charPos]);

  /* ── Keyboard movement loop ── */
  useEffect(() => {
    const SPEED = 0.4;

    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current.add(e.key.toLowerCase());

      if (e.key === "Escape") {
        if (selectedProject) {
          setSelectedProject(null);
        } else {
          onExit();
        }
      }

      if ((e.key === "Enter" || e.key === " ") && nearbyLocation && !selectedProject) {
        e.preventDefault();
        setSelectedProject(nearbyLocation);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current.delete(e.key.toLowerCase());
    };

    const tick = () => {
      const keys = keysPressed.current;
      let dx = 0;
      let dy = 0;

      if (keys.has("arrowleft") || keys.has("a")) dx -= SPEED;
      if (keys.has("arrowright") || keys.has("d")) dx += SPEED;
      if (keys.has("arrowup") || keys.has("w")) dy -= SPEED;
      if (keys.has("arrowdown") || keys.has("s")) dy += SPEED;

      if (dx !== 0 || dy !== 0) {
        setIsWalking(true);
        if (dx < 0) setCharDirection("left");
        if (dx > 0) setCharDirection("right");

        setCharPos((prev) => ({
          x: Math.max(5, Math.min(95, prev.x + dx)),
          y: Math.max(15, Math.min(90, prev.y + dy)),
        }));
      } else {
        setIsWalking(false);
      }

      animationFrameRef.current = requestAnimationFrame(tick);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    animationFrameRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, [nearbyLocation, selectedProject, onExit]);

  /* ── Dismiss welcome message ── */
  useEffect(() => {
    const t = setTimeout(() => setShowWelcome(false), 5000);
    return () => clearTimeout(t);
  }, []);

  /* ── Click on building ── */
  const handleBuildingClick = useCallback((loc: TownLocation) => {
    setCharPos({ x: loc.x, y: loc.y + 10 });
    setSelectedProject(loc);
  }, []);

  return (
    <div className="rpg-container" ref={containerRef}>
      {/* ── CRT Overlay Effects ── */}
      <div className="rpg-scanlines" />
      <div className="rpg-vignette" />

      {/* ── Top Bar ── */}
      <div className="rpg-top-bar">
        <div className="rpg-title-badge">
          <span className="rpg-pixel-icon">🗺️</span>
          <span>PROJECT TOWN</span>
        </div>
        <div className="rpg-controls-hint">
          <span className="rpg-key">WASD</span> Move
          <span className="rpg-key-separator">|</span>
          <span className="rpg-key">ENTER</span> Interact
          <span className="rpg-key-separator">|</span>
          <span className="rpg-key">ESC</span> Exit
        </div>
        <button onClick={onExit} className="rpg-exit-btn">
          ⏻ Power Off
        </button>
      </div>

      {/* ── Town Map ── */}
      <div className="rpg-map">
        {/* Ground decorations */}
        <div className="rpg-ground" />

        {/* Path/roads */}
        <svg className="rpg-paths" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path
            d="M 50 85 L 50 65 L 25 55 M 50 65 L 75 55 M 50 65 L 50 45 L 18 30 M 50 45 L 42 22 M 50 45 L 68 28"
            fill="none"
            stroke="rgba(255,200,100,0.15)"
            strokeWidth="2"
            strokeDasharray="2,2"
          />
        </svg>

        {/* Town Locations (Buildings) */}
        {TOWN_LOCATIONS.map((loc) => (
          <button
            key={loc.id}
            className={`rpg-building ${nearbyLocation?.id === loc.id ? "rpg-building--nearby" : ""}`}
            style={{
              left: `${loc.x}%`,
              top: `${loc.y}%`,
              "--building-color": loc.buildingColor,
            } as React.CSSProperties}
            onClick={() => handleBuildingClick(loc)}
          >
            <span className="rpg-building-icon">{loc.icon}</span>
            <span className="rpg-building-label">{loc.name}</span>
            {nearbyLocation?.id === loc.id && (
              <span className="rpg-interact-hint animate-bounce">
                ⬆ Enter
              </span>
            )}
          </button>
        ))}

        {/* Character */}
        <div
          className={`rpg-character ${isWalking ? "rpg-character--walking" : ""}`}
          style={{
            left: `${charPos.x}%`,
            top: `${charPos.y}%`,
            transform: `translate(-50%, -100%) scaleX(${charDirection === "left" ? -1 : 1})`,
          }}
        >
          <div className="rpg-char-sprite">
            <div className="rpg-char-body" />
            <div className="rpg-char-head" />
            <div className="rpg-char-eye" />
            <div className="rpg-char-shadow" />
          </div>
          {/* Character name tag */}
          <div className="rpg-char-name">You</div>
        </div>

        {/* Trees / decoration */}
        {[
          { x: 8, y: 20 },
          { x: 92, y: 25 },
          { x: 5, y: 50 },
          { x: 93, y: 48 },
          { x: 10, y: 75 },
          { x: 88, y: 72 },
          { x: 35, y: 15 },
          { x: 82, y: 18 },
        ].map((tree, i) => (
          <div
            key={`tree-${i}`}
            className="rpg-tree"
            style={{ left: `${tree.x}%`, top: `${tree.y}%` }}
          >
            🌲
          </div>
        ))}

        {/* Lamp posts */}
        {[
          { x: 30, y: 45 },
          { x: 60, y: 42 },
        ].map((lamp, i) => (
          <div
            key={`lamp-${i}`}
            className="rpg-lamp"
            style={{ left: `${lamp.x}%`, top: `${lamp.y}%` }}
          >
            <div className="rpg-lamp-glow" />
            🏮
          </div>
        ))}
      </div>

      {/* ── Welcome Dialog ── */}
      {showWelcome && !selectedProject && (
        <div className="rpg-dialog rpg-dialog--welcome animate-rpg-dialog-in">
          <div className="rpg-dialog-portrait">🧙</div>
          <div className="rpg-dialog-content">
            <p className="rpg-dialog-speaker">Guide</p>
            <p className="rpg-dialog-text">
              Welcome to <strong>Project Town</strong>! Walk around with{" "}
              <span className="rpg-key">WASD</span> or{" "}
              <span className="rpg-key">Arrow Keys</span> and visit buildings to
              see my work. Press <span className="rpg-key">Enter</span> near a
              building to check it out!
            </p>
          </div>
          <button className="rpg-dialog-dismiss" onClick={() => setShowWelcome(false)}>
            ▼ OK
          </button>
        </div>
      )}

      {/* ── Project Detail Dialog ── */}
      {selectedProject && (
        <div className="rpg-dialog rpg-dialog--project animate-rpg-dialog-in">
          <div className="rpg-dialog-header">
            <span className="rpg-dialog-header-icon">
              {selectedProject.icon}
            </span>
            <h3 className="rpg-dialog-title">{selectedProject.project.title}</h3>
            <button
              className="rpg-dialog-close"
              onClick={() => setSelectedProject(null)}
            >
              ✕
            </button>
          </div>

          <p className="rpg-dialog-desc">{selectedProject.project.description}</p>

          <div className="rpg-dialog-tech">
            {selectedProject.project.techStack.map((tech) => (
              <span key={tech} className="rpg-tech-badge">
                {tech}
              </span>
            ))}
          </div>

          <div className="rpg-dialog-actions">
            {selectedProject.project.liveUrl && (
              <a
                href={selectedProject.project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rpg-action-btn rpg-action-btn--primary"
              >
                <span>🌐</span> Visit Site
              </a>
            )}
            {selectedProject.project.repoUrl && (
              <a
                href={selectedProject.project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rpg-action-btn rpg-action-btn--secondary"
              >
                <span>📂</span> View Code
              </a>
            )}
            <button
              className="rpg-action-btn rpg-action-btn--close"
              onClick={() => setSelectedProject(null)}
            >
              <span>←</span> Back
            </button>
          </div>
        </div>
      )}

      {/* ── Mobile D-Pad ── */}
      <div className="rpg-dpad">
        <button
          className="rpg-dpad-btn rpg-dpad-up"
          onTouchStart={() => keysPressed.current.add("w")}
          onTouchEnd={() => keysPressed.current.delete("w")}
          onMouseDown={() => keysPressed.current.add("w")}
          onMouseUp={() => keysPressed.current.delete("w")}
        >
          ▲
        </button>
        <button
          className="rpg-dpad-btn rpg-dpad-left"
          onTouchStart={() => keysPressed.current.add("a")}
          onTouchEnd={() => keysPressed.current.delete("a")}
          onMouseDown={() => keysPressed.current.add("a")}
          onMouseUp={() => keysPressed.current.delete("a")}
        >
          ◀
        </button>
        <button
          className="rpg-dpad-btn rpg-dpad-right"
          onTouchStart={() => keysPressed.current.add("d")}
          onTouchEnd={() => keysPressed.current.delete("d")}
          onMouseDown={() => keysPressed.current.add("d")}
          onMouseUp={() => keysPressed.current.delete("d")}
        >
          ▶
        </button>
        <button
          className="rpg-dpad-btn rpg-dpad-down"
          onTouchStart={() => keysPressed.current.add("s")}
          onTouchEnd={() => keysPressed.current.delete("s")}
          onMouseDown={() => keysPressed.current.add("s")}
          onMouseUp={() => keysPressed.current.delete("s")}
        >
          ▼
        </button>
        <button
          className="rpg-dpad-btn rpg-dpad-action"
          onClick={() => {
            if (nearbyLocation && !selectedProject) {
              setSelectedProject(nearbyLocation);
            }
          }}
        >
          A
        </button>
      </div>

      {/* ── Mini-map indicator ── */}
      <div className="rpg-minimap">
        <div className="rpg-minimap-frame">
          {TOWN_LOCATIONS.map((loc) => (
            <div
              key={loc.id}
              className="rpg-minimap-dot"
              style={{
                left: `${loc.x}%`,
                top: `${loc.y}%`,
                background: loc.buildingColor,
              }}
            />
          ))}
          <div
            className="rpg-minimap-player"
            style={{
              left: `${charPos.x}%`,
              top: `${charPos.y}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
