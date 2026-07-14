'use client';

import React from 'react';

interface MapNode {
  id: string;
  name: string;
  fullName: string;
  x: number;
  y: number;
}

export default function KeralaInnovationMap() {
  // Coordinates based on a viewBox of 0 0 220 500 (slanted vertical map)
  const nodes: MapNode[] = [
    { id: 'cpcri', name: 'CPCRI', fullName: 'Central Plantation Crops Research Institute (Kasaragod)', x: 45, y: 50 },
    { id: 'cwrdm', name: 'CWRDM', fullName: 'Centre for Water Resources Development and Management (Kozhikode)', x: 75, y: 130 },
    { id: 'kau', name: 'KAU', fullName: 'Kerala Agricultural University (Thrissur)', x: 105, y: 210 },
    { id: 'kufos', name: 'KUFOS', fullName: 'Kerala University of Fisheries and Ocean Studies (Kochi)', x: 120, y: 270 },
    { id: 'cdac', name: 'C-DAC', fullName: 'Centre for Development of Advanced Computing (Trivandrum)', x: 145, y: 390 },
    { id: 'kscste', name: 'KSCSTE', fullName: 'Kerala State Council for Science, Technology and Environment (Trivandrum)', x: 152, y: 420 },
    { id: 'niist', name: 'NIIST', fullName: 'National Institute for Interdisciplinary Science and Technology (Trivandrum)', x: 157, y: 445 },
    { id: 'ctcri', name: 'CTCRI', fullName: 'Central Tuber Crops Research Institute (Trivandrum)', x: 162, y: 470 },
  ];

  // Draw continuous line through all nodes
  const pathD = nodes.map((node, i) => `${i === 0 ? 'M' : 'L'} ${node.x} ${node.y}`).join(' ');

  return (
    <div 
      className="absolute inset-y-0 right-10 md:right-20 w-[240px] md:w-[320px] pointer-events-none z-0 select-none flex items-center justify-center"
      style={{ opacity: 0.035 }} // Low ambient opacity
    >
      <svg 
        viewBox="0 0 220 520" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full max-h-[85%]"
      >
        {/* Stylized Abstract Kerala Outline Path */}
        <path
          d="M 28,25 
             C 45,35 60,60 68,90 
             C 75,115 88,140 92,175 
             C 98,210 115,240 120,290 
             C 125,330 148,375 152,415 
             C 155,445 178,475 168,495 
             C 160,505 145,490 142,475 
             C 138,455 120,410 115,380 
             C 110,350 95,310 90,270 
             C 85,230 70,180 65,140 
             C 60,100 40,65 30,45 Z"
          fill="#1D1451"
          fillOpacity="0.1"
          stroke="#00FA9A"
          strokeWidth="1.2"
          strokeOpacity="0.4"
        />

        {/* Ambient Map Grid lines */}
        <line x1="10" y1="100" x2="210" y2="100" stroke="#F8FAF8" strokeOpacity="0.1" strokeDasharray="3 3" />
        <line x1="10" y1="200" x2="210" y2="200" stroke="#F8FAF8" strokeOpacity="0.1" strokeDasharray="3 3" />
        <line x1="10" y1="300" x2="210" y2="300" stroke="#F8FAF8" strokeOpacity="0.1" strokeDasharray="3 3" />
        <line x1="10" y1="400" x2="210" y2="400" stroke="#F8FAF8" strokeOpacity="0.1" strokeDasharray="3 3" />

        {/* Connection Flow Lines (Background static trace) */}
        <path
          d={pathD}
          stroke="#1D1451"
          strokeWidth="2"
          strokeOpacity="0.4"
        />

        {/* Animated Glowing Connection Line */}
        <path
          d={pathD}
          stroke="#00FA9A"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="16 24"
          className="animate-[pipeline-flow_8s_linear_infinite]"
          strokeOpacity="0.8"
        />

        {/* Nodes and Text Labels */}
        {nodes.map((node) => (
          <g key={node.id} className="transition-all duration-300">
            {/* Glow Ring (Pulsing every 6s) */}
            <circle
              cx={node.x}
              cy={node.y}
              r="7"
              stroke="#00FA9A"
              strokeWidth="1"
              strokeOpacity="0.6"
              className="animate-[pulse-ring_6s_ease-out-in_infinite]"
              style={{
                transformOrigin: `${node.x}px ${node.y}px`
              }}
            />
            {/* Core Node Dot */}
            <circle
              cx={node.x}
              cy={node.y}
              r="3.5"
              fill="#E9C46A"
              className="shadow-sm"
            />
            {/* Node Label Text */}
            <text
              x={node.x + 10}
              y={node.y + 4}
              fill="#F8FAF8"
              fontSize="9"
              fontFamily="Outfit, sans-serif"
              fontWeight="700"
              letterSpacing="0.05em"
              fillOpacity="0.85"
            >
              {node.name}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
