import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Activity, Globe, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import Globe3D from '../components/Globe3D';
import { dashboardStats, countries, places, siteLocations } from '../data/mockData';

const Dashboard = () => {
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [selectedPlace, setSelectedPlace] = useState('all');

  const statCards = [
    {
      title: 'Total Sites',
      value: dashboardStats.totalSites,
      icon: MapPin,
      color: 'from-blue-500 to-blue-600',
      change: '+12%'
    },
    {
      title: 'Total GNBs',
      value: dashboardStats.totalGNBs.toLocaleString(),
      icon: Globe,
      color: 'from-green-500 to-green-600',
      change: '+8%'
    },
    {
      title: 'Active Connections',
      value: dashboardStats.activeConnections.toLocaleString(),
      icon: Activity,
      color: 'from-purple-500 to-purple-600',
      change: '+15%'
    },
    {
      title: 'Core NTK Status',
      value: `${dashboardStats.coreNTKStatus.online}%`,
      icon: Zap,
      color: 'from-orange-500 to-orange-600',
      change: '+2%'
    }
  ];

  return (
    <div className="space-y-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Network Dashboard</h1>
        <p className="text-gray-600 text-lg">Real-time network monitoring and site management</p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <Card className="relative overflow-hidden border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      {stat.title}
                    </CardTitle>
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${stat.color}`}>
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-baseline justify-between">
                    <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                    <Badge variant="secondary" className="text-green-600 bg-green-50 border-green-200">
                      {stat.change}
                    </Badge>
                  </div>
                  <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.color} opacity-20`} />
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Filters */}
      <motion.div 
        className="flex flex-wrap gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Select value={selectedCountry} onValueChange={setSelectedCountry}>
          <SelectTrigger className="w-48 bg-white/80 backdrop-blur-sm border-gray-200 shadow-sm">
            <SelectValue placeholder="Select country" />
          </SelectTrigger>
          <SelectContent>
            {countries.map(country => (
              <SelectItem key={country.id} value={country.id}>
                {country.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedPlace} onValueChange={setSelectedPlace}>
          <SelectTrigger className="w-48 bg-white/80 backdrop-blur-sm border-gray-200 shadow-sm">
            <SelectValue placeholder="Select place" />
          </SelectTrigger>
          <SelectContent>
            {places.map(place => (
              <SelectItem key={place.id} value={place.id}>
                {place.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </motion.div>

      {/* 3D Globe */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.5 }}
      >
        <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-md overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-slate-900 to-slate-800 text-white">
            <CardTitle className="text-xl font-bold">Global Network Topology</CardTitle>
            <p className="text-slate-300">Interactive 3D visualization of network sites</p>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-96 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
              <Globe3D 
                sites={siteLocations}
                selectedCountry={selectedCountry}
                selectedPlace={selectedPlace}
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Site Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-900">Site Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {siteLocations.map((site, index) => (
                <motion.div
                  key={site.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="p-4 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 cursor-pointer group hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-2">
                    <MapPin className="h-5 w-5 text-orange-500 group-hover:text-orange-600 transition-colors" />
                    <Badge variant="outline" className="text-xs">
                      {site.country}
                    </Badge>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">{site.name}</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    {site.lat.toFixed(4)}, {site.lng.toFixed(4)}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">GNB Nodes</span>
                    <span className="text-sm font-bold text-blue-600">{site.gnbCount}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Dashboard;