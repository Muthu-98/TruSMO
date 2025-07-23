import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Zap } from 'lucide-react';

const Globe3D = ({ sites, selectedCountry, selectedPlace }) => {
  const canvasRef = useRef(null);
  const [selectedSite, setSelectedSite] = useState(null);
  const [hoveredSite, setHoveredSite] = useState(null);

  // Simple 2D projection for now (can be enhanced with actual 3D library)
  const project = (lat, lng) => {
    const x = (lng + 180) * (400 / 360);
    const y = (90 - lat) * (200 / 180);
    return { x, y };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw world map outline (simplified)
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.beginPath();
    
    // Draw India outline (simplified)
    ctx.moveTo(280, 120);
    ctx.lineTo(320, 110);
    ctx.lineTo(350, 130);
    ctx.lineTo(340, 160);
    ctx.lineTo(300, 170);
    ctx.lineTo(280, 150);
    ctx.closePath();
    ctx.stroke();

    // Draw core NTK (center)
    const coreX = 310;
    const coreY = 140;
    
    // Glowing effect for core
    const gradient = ctx.createRadialGradient(coreX, coreY, 0, coreX, coreY, 20);
    gradient.addColorStop(0, '#FF6B00');
    gradient.addColorStop(0.5, '#FF8533');
    gradient.addColorStop(1, 'transparent');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(coreX, coreY, 20, 0, 2 * Math.PI);
    ctx.fill();

    // Draw core node
    ctx.fillStyle = '#FF6B00';
    ctx.beginPath();
    ctx.arc(coreX, coreY, 8, 0, 2 * Math.PI);
    ctx.fill();

    // Draw sites and connections
    sites.forEach(site => {
      const pos = project(site.lat, site.lng);
      const adjustedX = pos.x + 50; // Adjust for India positioning
      const adjustedY = pos.y + 20;

      // Draw connection line to core
      ctx.strokeStyle = '#4C57FF';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(coreX, coreY);
      ctx.lineTo(adjustedX, adjustedY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw site marker
      ctx.fillStyle = '#4C57FF';
      ctx.beginPath();
      ctx.arc(adjustedX, adjustedY, 6, 0, 2 * Math.PI);
      ctx.fill();

      // Highlight if hovered
      if (hoveredSite === site.id) {
        ctx.strokeStyle = '#FF6B00';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(adjustedX, adjustedY, 10, 0, 2 * Math.PI);
        ctx.stroke();
      }
    });

  }, [sites, hoveredSite]);

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <canvas
        ref={canvasRef}
        width={500}
        height={300}
        className="rounded-lg"
        style={{ filter: 'drop-shadow(0 0 20px rgba(76, 87, 255, 0.3))' }}
      />
      
      {/* Site markers overlay */}
      <div className="absolute inset-0 pointer-events-none">
        {sites.map((site, index) => {
          const pos = project(site.lat, site.lng);
          const adjustedX = pos.x + 50 + 50; // Adjust for positioning
          const adjustedY = pos.y + 20 + 50;
          
          return (
            <motion.div
              key={site.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
              style={{ left: adjustedX, top: adjustedY }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              onMouseEnter={() => setHoveredSite(site.id)}
              onMouseLeave={() => setHoveredSite(null)}
              onClick={() => setSelectedSite(site)}
            >
              <div className="relative">
                <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg cursor-pointer hover:scale-125 transition-transform duration-200" />
                
                {/* Tooltip */}
                {hoveredSite === site.id && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-white/95 backdrop-blur-sm p-3 rounded-lg shadow-xl border border-gray-200 min-w-48"
                  >
                    <div className="text-sm font-semibold text-gray-900">{site.name}</div>
                    <div className="text-xs text-gray-600">
                      {site.lat.toFixed(4)}, {site.lng.toFixed(4)}
                    </div>
                    <div className="text-xs text-blue-600 font-medium">
                      {site.gnbCount} GNB Nodes
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Core NTK indicator */}
      <div className="absolute top-4 left-4 bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
        <div className="flex items-center space-x-2">
          <Zap className="h-4 w-4 text-orange-400" />
          <div>
            <div className="text-xs text-white font-medium">Core NTK</div>
            <div className="text-xs text-orange-300">Active</div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-orange-500 rounded-full" />
            <span className="text-xs text-white">Core NTK</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full" />
            <span className="text-xs text-white">GNB Sites</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-0.5 bg-blue-500" style={{ background: 'linear-gradient(to right, #4C57FF, transparent)' }} />
            <span className="text-xs text-white">Connections</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Globe3D;