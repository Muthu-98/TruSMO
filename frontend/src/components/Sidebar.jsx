import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Globe, Settings, Monitor, X, AlertTriangle, Cog, BarChart, Network } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '../lib/utils';

const sidebarItems = [
  {
    name: 'Dashboard',
    href: '/',
    icon: Globe,
    description: 'Network monitoring'
  },
  {
    name: 'Vendor Configuration',
    href: '/vendor-configuration',
    icon: Settings,
    description: 'Manage vendors'
  },
  {
    name: 'Device Configuration',
    href: '/device-configuration',
    icon: Monitor,
    description: 'Configure gNBs'
  },
  {
    name: 'NR Network Configuration',
    href: '/nr-network-configuration',
    icon: Network,
    description: 'Configure Neighbor gNBs'
  },
  {
    name: "Device KPI's",
    href: '/device-kpi',
    icon: BarChart,
    description: 'Performance management'
  },
  {
    name: 'Alarms',
    href: '/alarms',
    icon: AlertTriangle,
    description: 'Fault management'
  },
  // {
  //   name: 'Settings',
  //   href: '/settings',
  //   icon: Cog,
  //   description: 'System settings'
  // },
];

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: isOpen ? 0 : -300 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={cn(
          "fixed top-16 left-0 z-50 w-64 h-[calc(100vh-4rem)] bg-white/95 backdrop-blur-md border-r border-gray-200/50 shadow-xl lg:translate-x-0 lg:static lg:inset-0",
          "lg:w-64 lg:z-30"
        )}
      >
        <div className="flex items-center justify-between p-4 lg:hidden">
          <span className="text-lg font-semibold">Navigation</span>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="p-4 space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            
            return (
              <Link key={item.name} to={item.href} onClick={onClose}>
                <motion.div
                  className={cn(
                    "flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-200",
                    "hover:bg-gray-100 hover:shadow-sm",
                    isActive && "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg"
                  )}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon className={cn(
                    "h-5 w-5 transition-colors",
                    isActive ? "text-white" : "text-gray-600"
                  )} />
                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      "text-sm font-medium transition-colors",
                      isActive ? "text-white" : "text-gray-900"
                    )}>
                      {item.name}
                    </p>
                    <p className={cn(
                      "text-xs transition-colors",
                      isActive ? "text-orange-100" : "text-gray-500"
                    )}>
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
            <p className="text-xs text-blue-700 font-medium">TruSMO Platform</p>
            <p className="text-xs text-blue-600">Version 1.0.0</p>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;