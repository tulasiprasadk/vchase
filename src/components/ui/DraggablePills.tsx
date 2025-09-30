"use client";

import React, { useState, useRef, useEffect } from "react";

interface Pill {
  id: string;
  text: string;
  color: string;
  x: number;
  y: number;
  vx: number; // velocity x
  vy: number; // velocity y
  isDragging: boolean;
}

const DraggablePills: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  const [pills, setPills] = useState<Pill[]>([
    {
      id: "1",
      text: "Event Management",
      color: "bg-gradient-to-r from-blue-500 to-blue-600",
      x: 100,
      y: 50,
      vx: 0,
      vy: 0,
      isDragging: false,
    },
    {
      id: "2",
      text: "Sponsor Matching",
      color: "bg-gradient-to-r from-green-500 to-green-600",
      x: 300,
      y: 80,
      vx: 0,
      vy: 0,
      isDragging: false,
    },
    {
      id: "3",
      text: "Partnership Growth",
      color: "bg-gradient-to-r from-purple-500 to-purple-600",
      x: 150,
      y: 150,
      vx: 0,
      vy: 0,
      isDragging: false,
    },
    {
      id: "4",
      text: "Analytics & Insights",
      color: "bg-gradient-to-r from-orange-500 to-pink-500",
      x: 400,
      y: 120,
      vx: 0,
      vy: 0,
      isDragging: false,
    },
    {
      id: "5",
      text: "ROI Tracking",
      color: "bg-gradient-to-r from-teal-500 to-cyan-600",
      x: 250,
      y: 200,
      vx: 0,
      vy: 0,
      isDragging: false,
    },
    {
      id: "6",
      text: "Brand Exposure",
      color: "bg-gradient-to-r from-indigo-500 to-purple-600",
      x: 500,
      y: 180,
      vx: 0,
      vy: 0,
      isDragging: false,
    },
  ]);

  const [draggedPill, setDraggedPill] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Physics simulation
  useEffect(() => {
    const GRAVITY = 0.5;
    const FRICTION = 0.98;
    const BOUNCE_DAMPING = 0.7;

    const animate = () => {
      setPills((prevPills) =>
        prevPills.map((pill) => {
          if (pill.isDragging) return pill; // Don't apply physics to dragged pills

          const container = containerRef.current;
          if (!container) return pill;

          const containerRect = container.getBoundingClientRect();
          const maxX = containerRect.width - 120; // pill width
          const maxY = containerRect.height - 40; // pill height

          let newVx = pill.vx * FRICTION;
          let newVy = pill.vy + GRAVITY; // Apply gravity

          let newX = pill.x + newVx;
          let newY = pill.y + newVy;

          // Bounce off walls
          if (newX <= 0) {
            newX = 0;
            newVx = -newVx * BOUNCE_DAMPING;
          } else if (newX >= maxX) {
            newX = maxX;
            newVx = -newVx * BOUNCE_DAMPING;
          }

          // Bounce off floor and ceiling
          if (newY <= 0) {
            newY = 0;
            newVy = -newVy * BOUNCE_DAMPING;
          } else if (newY >= maxY) {
            newY = maxY;
            newVy = -newVy * BOUNCE_DAMPING;
            // Add some friction when bouncing on the ground
            newVx *= 0.9;
          }

          return {
            ...pill,
            x: newX,
            y: newY,
            vx: newVx,
            vy: newVy,
          };
        })
      );

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const handleMouseDown = (e: React.MouseEvent, pillId: string) => {
    e.preventDefault();
    const pill = pills.find((p) => p.id === pillId);
    if (!pill) return;

    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setDraggedPill(pillId);

    // Stop the pill's velocity when grabbed
    setPills((prevPills) =>
      prevPills.map((p) =>
        p.id === pillId ? { ...p, isDragging: true, vx: 0, vy: 0 } : p
      )
    );
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggedPill || !containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const newX = e.clientX - containerRect.left - dragOffset.x;
    const newY = e.clientY - containerRect.top - dragOffset.y;

    const maxX = containerRect.width - 120;
    const maxY = containerRect.height - 40;

    setPills((prevPills) =>
      prevPills.map((pill) =>
        pill.id === draggedPill
          ? {
              ...pill,
              x: Math.max(0, Math.min(maxX, newX)),
              y: Math.max(0, Math.min(maxY, newY)),
            }
          : pill
      )
    );
  };

  const handleMouseUp = () => {
    if (draggedPill) {
      // Add some velocity when releasing the pill
      setPills((prevPills) =>
        prevPills.map((pill) =>
          pill.id === draggedPill
            ? {
                ...pill,
                isDragging: false,
                // Add some random velocity for more interesting physics
                vx: (Math.random() - 0.5) * 8,
                vy: (Math.random() - 0.5) * 8,
              }
            : pill
        )
      );
    }
    setDraggedPill(null);
    setDragOffset({ x: 0, y: 0 });
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-80 bg-gradient-to-br from-slate-50 to-slate-100 rounded-3xl overflow-hidden cursor-grab active:cursor-grabbing"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {pills.map((pill) => (
        <div
          key={pill.id}
          className={`absolute px-6 py-3 rounded-full text-white font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-200 cursor-grab active:cursor-grabbing select-none ${
            pill.color
          } ${pill.isDragging ? "scale-110 z-50" : "hover:scale-105"}`}
          style={{
            left: `${pill.x}px`,
            top: `${pill.y}px`,
            transform: pill.isDragging ? "rotate(-2deg)" : "rotate(0deg)",
          }}
          onMouseDown={(e) => handleMouseDown(e, pill.id)}
        >
          {pill.text}
        </div>
      ))}

      {/* Instructions */}
      <div className="absolute bottom-4 left-4 text-slate-500 text-sm">
        Drag the pills around! They&apos;ll fall with gravity and bounce when
        released.
      </div>
    </div>
  );
};

export default DraggablePills;
