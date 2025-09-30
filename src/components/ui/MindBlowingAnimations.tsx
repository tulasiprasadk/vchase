"use client";

import React, { useState, useEffect } from "react";
import {
  Briefcase,
  Lightbulb,
  User,
  Megaphone,
  TrendingUp,
  Handshake,
  Zap,
  Sparkles,
} from "lucide-react";

interface FloatingElement {
  id: string;
  text: string;
  icon: React.ReactNode;
  color: string;
  x: number;
  y: number;
  scale: number;
  rotation: number;
  opacity: number;
}

const MindBlowingAnimations: React.FC = () => {
  const [elements, setElements] = useState<FloatingElement[]>([
    {
      id: "1",
      text: "Business Consultancy",
      icon: <Briefcase className="w-6 h-6" />,
      color: "from-blue-400 via-blue-500 to-blue-600",
      x: 20,
      y: 30,
      scale: 1,
      rotation: 0,
      opacity: 1,
    },
    {
      id: "2",
      text: "Turn Key Projects",
      icon: <Lightbulb className="w-6 h-6" />,
      color: "from-emerald-400 via-emerald-500 to-emerald-600",
      x: 60,
      y: 50,
      scale: 1,
      rotation: 0,
      opacity: 1,
    },
    {
      id: "3",
      text: "Personal Consultancy",
      icon: <User className="w-6 h-6" />,
      color: "from-purple-400 via-purple-500 to-purple-600",
      x: 30,
      y: 70,
      scale: 1,
      rotation: 0,
      opacity: 1,
    },
    {
      id: "4",
      text: "Digital Marketing",
      icon: <Megaphone className="w-6 h-6" />,
      color: "from-rose-400 via-rose-500 to-rose-600",
      x: 70,
      y: 20,
      scale: 1,
      rotation: 0,
      opacity: 1,
    },
    {
      id: "5",
      text: "Marketing & Sales",
      icon: <TrendingUp className="w-6 h-6" />,
      color: "from-orange-400 via-orange-500 to-orange-600",
      x: 15,
      y: 80,
      scale: 1,
      rotation: 0,
      opacity: 1,
    },
    {
      id: "6",
      text: "Organiser Sponsor Collaboration",
      icon: <Handshake className="w-6 h-6" />,
      color: "from-indigo-400 via-indigo-500 to-indigo-600",
      x: 80,
      y: 60,
      scale: 1,
      rotation: 0,
      opacity: 1,
    },
  ]);

  const [particles, setParticles] = useState<
    Array<{
      id: string;
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      color: string;
    }>
  >([]);

  // Floating animation for main elements
  useEffect(() => {
    const interval = setInterval(() => {
      setElements((prev) =>
        prev.map((element) => ({
          ...element,
          x:
            element.x +
            Math.sin(Date.now() * 0.001 + parseInt(element.id)) * 0.5,
          y:
            element.y +
            Math.cos(Date.now() * 0.0015 + parseInt(element.id)) * 0.3,
          rotation: element.rotation + 0.5,
          scale: 1 + Math.sin(Date.now() * 0.002 + parseInt(element.id)) * 0.1,
        }))
      );
    }, 50);

    return () => clearInterval(interval);
  }, []);

  // Particle system
  useEffect(() => {
    const interval = setInterval(() => {
      // Add new particles
      const newParticles = Array.from({ length: 3 }, (_, i) => ({
        id: `${Date.now()}-${i}`,
        x: Math.random() * 100,
        y: Math.random() * 100,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        life: 100,
        color: ["#3b82f6", "#10b981", "#8b5cf6", "#f59e0b"][
          Math.floor(Math.random() * 4)
        ],
      }));

      setParticles((prev) => [
        ...prev
          .filter((p) => p.life > 0)
          .map((p) => ({
            ...p,
            x: (p.x + p.vx + 100) % 100,
            y: (p.y + p.vy + 100) % 100,
            life: p.life - 1,
          })),
        ...newParticles,
      ]);
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-96 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 animate-pulse"></div>

      {/* Floating grid background */}
      <div className="absolute inset-0 opacity-10">
        <div className="w-full h-full bg-grid-pattern animate-pulse"></div>
      </div>

      {/* Particle system */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-1 h-1 rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            backgroundColor: particle.color,
            opacity: particle.life / 100,
            transform: `scale(${particle.life / 50})`,
          }}
        />
      ))}

      {/* Main floating elements */}
      {elements.map((element, index) => (
        <div
          key={element.id}
          className="absolute group cursor-pointer transition-all duration-700 ease-out"
          style={{
            left: `${element.x}%`,
            top: `${element.y}%`,
            transform: `translate(-50%, -50%) scale(${element.scale}) rotate(${element.rotation}deg)`,
            opacity: element.opacity,
          }}
        >
          {/* Glowing ring effect */}
          <div
            className={`absolute inset-0 rounded-full bg-gradient-to-r ${element.color} blur-xl opacity-30 animate-ping`}
          ></div>

          {/* Main card */}
          <div
            className={`relative bg-gradient-to-r ${element.color} p-6 rounded-2xl shadow-2xl backdrop-blur-sm border border-white/20 hover:scale-110 hover:rotate-6 transition-all duration-500 group-hover:shadow-[0_0_50px_rgba(99,102,241,0.5)]`}
          >
            {/* Icon with glow */}
            <div className="flex items-center justify-center mb-3 text-white relative">
              <div className="absolute inset-0 bg-white/20 rounded-full blur-md animate-pulse"></div>
              <div className="relative">{element.icon}</div>
            </div>

            {/* Text with typewriter effect */}
            <div className="text-white font-bold text-sm text-center relative overflow-hidden">
              <span className="relative z-10">{element.text}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
            </div>
          </div>

          {/* Orbiting sparkles */}
          <Sparkles
            className="absolute -top-2 -right-2 w-4 h-4 text-yellow-300 animate-spin"
            style={{ animationDuration: "3s" }}
          />
          <Zap
            className="absolute -bottom-2 -left-2 w-4 h-4 text-blue-300 animate-bounce"
            style={{ animationDelay: `${index * 0.5}s` }}
          />
        </div>
      ))}

      {/* Floating orbs */}
      <div className="absolute top-10 left-10 w-4 h-4 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-bounce shadow-lg shadow-cyan-500/50"></div>
      <div className="absolute top-20 right-16 w-3 h-3 bg-gradient-to-r from-pink-400 to-rose-500 rounded-full animate-pulse shadow-lg shadow-pink-500/50"></div>
      <div className="absolute bottom-16 left-20 w-5 h-5 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full animate-ping shadow-lg shadow-emerald-500/50"></div>
      <div className="absolute bottom-10 right-10 w-6 h-6 bg-gradient-to-r from-purple-400 to-violet-500 rounded-full animate-spin shadow-lg shadow-purple-500/50"></div>

      {/* Floating text elements */}
      <div className="absolute top-1/4 left-1/4 text-white/60 text-xs font-light animate-fade-in-out">
        Innovation
      </div>
      <div
        className="absolute top-3/4 right-1/4 text-white/60 text-xs font-light animate-fade-in-out"
        style={{ animationDelay: "2s" }}
      >
        Excellence
      </div>
      <div
        className="absolute bottom-1/4 left-1/2 text-white/60 text-xs font-light animate-fade-in-out"
        style={{ animationDelay: "4s" }}
      >
        Growth
      </div>

      {/* Animated border */}
      <div className="absolute inset-0 rounded-3xl border-2 border-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-30 animate-pulse"></div>

      {/* Corner decorations */}
      <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-blue-500/20 to-transparent rounded-br-full animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl from-purple-500/20 to-transparent rounded-tl-full animate-pulse"></div>

      {/* Central message */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-center">
        <div className="text-white/80 text-sm font-medium animate-fade-in-out">
          Experience the Future of Event Sponsorship
        </div>
        <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-white/50 to-transparent mt-2 animate-shimmer"></div>
      </div>
    </div>
  );
};

export default MindBlowingAnimations;
