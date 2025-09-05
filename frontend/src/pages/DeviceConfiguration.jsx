import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Eye, Router } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Switch } from '../components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useToast } from '../hooks/use-toast';
import { devices, vendors } from '../data/mockData';

const DeviceConfiguration = () => {
  const [deviceList, setDeviceList] = useState(devices);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingDevice, setEditingDevice] = useState(null);
  const [formData, setFormData] = useState({
    manufacturer: '',
    product: '',
    gNBName: '',
    serialNumber: '',
    netconfIP: '',
    sshUsername: '',
    sshPassword: '',
    sshPort: '22',
    tls: false,
    latitude: '',
    longitude: ''
  });
  const { toast } = useToast();

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingDevice) {
      // Update existing device
      setDeviceList(prev => prev.map(device => 
        device.id === editingDevice.id 
          ? { 
              ...device, 
              ...formData,
              name: formData.gNBName,
              ssh: {
                username: formData.sshUsername,
                password: formData.sshPassword,
                port: parseInt(formData.sshPort),
                tls: formData.tls
              },
              latitude: parseFloat(formData.latitude),
              longitude: parseFloat(formData.longitude)
            }
          : device
      ));
      toast({
        title: "Device Updated",
        description: "GNB device has been updated successfully."
      });
      setEditingDevice(null);
    } else {
      // Add new device
      const newDevice = {
        id: deviceList.length + 1,
        gNBId: `GNB${String(deviceList.length + 1).padStart(3, '0')}`,
        name: formData.gNBName,
        serialNumber: formData.serialNumber,
        netconfIP: formData.netconfIP,
        pnfRegistered: true,
        notificationFormat: 'JSON',
        manufacturer: formData.manufacturer,
        product: formData.product,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        ssh: {
          username: formData.sshUsername,
          password: formData.sshPassword,
          port: parseInt(formData.sshPort),
          tls: formData.tls
        },
        availableDUs: 0,
        availableCUCPs: 0,
        availableCUUPs: 0
      };
      setDeviceList(prev => [...prev, newDevice]);
      toast({
        title: "Device Added",
        description: "New GNB device has been added successfully."
      });
    }
    
    setFormData({
      manufacturer: '',
      product: '',
      gNBName: '',
      serialNumber: '',
      netconfIP: '',
      sshUsername: '',
      sshPassword: '',
      sshPort: '22',
      tls: false,
      latitude: '',
      longitude: ''
    });
    setIsAddDialogOpen(false);
  };

  const handleEdit = (device) => {
    setEditingDevice(device);
    setFormData({
      manufacturer: device.manufacturer,
      product: device.product,
      gNBName: device.name,
      serialNumber: device.serialNumber,
      netconfIP: device.netconfIP,
      sshUsername: device.ssh.username,
      sshPassword: device.ssh.password || '',
      sshPort: device.ssh.port.toString(),
      tls: device.ssh.tls,
      latitude: device.latitude.toString(),
      longitude: device.longitude.toString()
    });
    setIsAddDialogOpen(true);
  };

  const handleDelete = (deviceId) => {
    setDeviceList(prev => prev.filter(device => device.id !== deviceId));
    toast({
      title: "Device Deleted",
      description: "GNB device has been removed successfully."
    });
  };

  const resetForm = () => {
    setFormData({
      manufacturer: '',
      product: '',
      gNBName: '',
      serialNumber: '',
      netconfIP: '',
      sshUsername: '',
      sshPassword: '',
      sshPort: '22',
      tls: false,
      latitude: '',
      longitude: ''
    });
  };

  return (
    <div className="space-y-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Device Configuration</h1>
        <p className="text-gray-600 text-lg">Manage GNB devices and their configurations</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Router className="h-6 w-6 text-blue-500" />
                <CardTitle className="text-xl font-bold text-gray-900">GNB Devices</CardTitle>
              </div>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Add GNB
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingDevice ? 'Edit GNB Device' : 'Add New GNB Device'}
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="manufacturer">Manufacturer</Label>
                        <Select value={formData.manufacturer} onValueChange={(value) => handleInputChange('manufacturer', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select manufacturer" />
                          </SelectTrigger>
                          <SelectContent>
                            {vendors.map(vendor => (
                              <SelectItem key={vendor.id} value={vendor.manufacturer}>
                                {vendor.manufacturer}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="product">Product</Label>
                        <Select value={formData.product} onValueChange={(value) => handleInputChange('product', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select product" />
                          </SelectTrigger>
                          <SelectContent>
                            {vendors
                              .filter(vendor => vendor.manufacturer === formData.manufacturer)
                              .map(vendor => (
                                <SelectItem key={vendor.id} value={vendor.product}>
                                  {vendor.product}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="gNBName">gNB Name</Label>
                        <Input
                          id="gNBName"
                          value={formData.gNBName}
                          onChange={(e) => handleInputChange('gNBName', e.target.value)}
                          placeholder="e.g., Bangalore-Central-01"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="serialNumber">Serial Number</Label>
                        <Input
                          id="serialNumber"
                          value={formData.serialNumber}
                          onChange={(e) => handleInputChange('serialNumber', e.target.value)}
                          placeholder="e.g., SN123456789"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="netconfIP">Netconf IP</Label>
                      <Input
                        id="netconfIP"
                        value={formData.netconfIP}
                        onChange={(e) => handleInputChange('netconfIP', e.target.value)}
                        placeholder="e.g., 192.168.1.100"
                        required
                      />
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">SSH Configuration</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="sshUsername">SSH Username</Label>
                          <Input
                            id="sshUsername"
                            value={formData.sshUsername}
                            onChange={(e) => handleInputChange('sshUsername', e.target.value)}
                            placeholder="admin"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="sshPassword">SSH Password</Label>
                          <Input
                            id="sshPassword"
                            type="password"
                            value={formData.sshPassword}
                            onChange={(e) => handleInputChange('sshPassword', e.target.value)}
                            placeholder="Enter password"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="sshPort">SSH Port</Label>
                          <Input
                            id="sshPort"
                            type="number"
                            value={formData.sshPort}
                            onChange={(e) => handleInputChange('sshPort', e.target.value)}
                            placeholder="22"
                            required
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="tls"
                            checked={formData.tls}
                            onCheckedChange={(checked) => handleInputChange('tls', checked)}
                          />
                          <Label htmlFor="tls">Enable TLS</Label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">Location</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="latitude">Latitude</Label>
                          <Input
                            id="latitude"
                            type="number"
                            step="any"
                            value={formData.latitude}
                            onChange={(e) => handleInputChange('latitude', e.target.value)}
                            placeholder="e.g., 12.9716"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="longitude">Longitude</Label>
                          <Input
                            id="longitude"
                            type="number"
                            step="any"
                            value={formData.longitude}
                            onChange={(e) => handleInputChange('longitude', e.target.value)}
                            placeholder="e.g., 77.5946"
                            required
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end space-x-2 pt-4">
                      <Button type="button" variant="outline" onClick={resetForm}>
                        Reset
                      </Button>
                      <Button type="button" variant="outline" onClick={() => {
                        setIsAddDialogOpen(false);
                        setEditingDevice(null);
                        resetForm();
                      }}>
                        Cancel
                      </Button>
                      <Button type="submit" className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
                        {editingDevice ? 'Update' : 'Save'} Device
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <div className="min-w-[1024px] w-full">
              <Table className="table-auto w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead>gNB ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Serial Number</TableHead>
                    <TableHead>Netconf IP</TableHead>
                    <TableHead>PNF Registered</TableHead>
                    <TableHead>Available DUs</TableHead>
                    <TableHead>Available CUCPs</TableHead>
                    <TableHead>Available CUUPs</TableHead>
                    <TableHead>Available Networks</TableHead>
                    <TableHead>Available PM Jobs</TableHead> {/* Added column */}
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {deviceList.map((device, index) => (
                    <motion.tr
                      key={device.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <TableCell className="font-medium">{device.gNBId}</TableCell>
                      <TableCell>{device.name}</TableCell>
                      <TableCell>{device.serialNumber}</TableCell>
                      <TableCell>{device.netconfIP}</TableCell>
                      <TableCell>
                        <Badge variant={device.pnfRegistered ? "default" : "secondary"}>
                          {device.pnfRegistered ? 'Yes' : 'No'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Link to={`/device/${device.gNBId}/du`}>
                          <Button variant="outline" size="sm" className="hover:bg-blue-50">
                            <Eye className="h-4 w-4 mr-1" />
                            View ({device.availableDUs})
                          </Button>
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Link to={`/device/${device.gNBId}/cucp`}>
                          <Button variant="outline" size="sm" className="hover:bg-green-50">
                            <Eye className="h-4 w-4 mr-1" />
                            View ({device.availableCUCPs})
                          </Button>
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Link to={`/device/${device.gNBId}/cuup`}>
                          <Button variant="outline" size="sm" className="hover:bg-purple-50">
                            <Eye className="h-4 w-4 mr-1" />
                            View ({device.availableCUUPs})
                          </Button>
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Link to={`/device/${device.gNBId}/networks`}>
                          <Button variant="outline" size="sm" className="hover:bg-orange-50">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Link to={`/device/${device.gNBId}/pmjobs`}>
                          <Button variant="outline" size="sm" className="hover:bg-cyan-50">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </Link>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEdit(device)}
                            className="hover:bg-blue-50 hover:border-blue-300"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDelete(device.id)}
                            className="hover:bg-red-50 hover:border-red-300 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default DeviceConfiguration;