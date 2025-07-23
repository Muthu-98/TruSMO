import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Eye, Network } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useToast } from '../hooks/use-toast';
import { mockNetworks, devices, mockCUCPs } from '../data/mockData';

const NetworksView = () => {
  const { gnbId } = useParams();
  const [networkList, setNetworkList] = useState(mockNetworks);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    gnbCuId: '',
    xncLocal: '',
    xncRemote: '',
    xnuLocal: '',
    xnuRemote: '',
    f1cLocal: '',
    f1cRemote: '',
    f1uLocal: '',
    f1uRemote: '',
    ngcLocal: '',
    ngcRemote: '',
    nguLocal: '',
    nguRemote: '',
    e1cLocal: '',
    e1cRemote: '',
    e1uLocal: '',
    e1uRemote: ''
  });
  const { toast } = useToast();

  const device = devices.find(d => d.gNBId === gnbId);
  const cucpOptions = mockCUCPs.filter(cucp => cucp.gnbId === gnbId);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
  e.preventDefault();

  // Check if at least one protocol section has any value
  const hasXN = formData.xncLocal || formData.xncRemote || formData.xnuLocal || formData.xnuRemote;
  const hasF1 = formData.f1cLocal || formData.f1cRemote || formData.f1uLocal || formData.f1uRemote;
  const hasNG = formData.ngcLocal || formData.ngcRemote || formData.nguLocal || formData.nguRemote;
  const hasE1 = formData.e1cLocal || formData.e1cRemote || formData.e1uLocal || formData.e1uRemote;

  if (!hasXN && !hasF1 && !hasNG && !hasE1) {
    toast({
      title: "No Configuration Provided",
      description: "Please fill at least one protocol configuration (XN, F1, NG, or E1).",
      variant: "destructive"
    });
    return;
  }

  const newNetwork = {
    id: networkList.length + 1,
    gnbCuId: parseInt(formData.gnbCuId),
    gnbId: gnbId,
    ...(hasXN && {
      xn: {
        localAddr: formData.xncLocal,
        remoteAddr: formData.xncRemote,
        localU: formData.xnuLocal,
        remoteU: formData.xnuRemote
      }
    }),
    ...(hasF1 && {
      f1: {
        localAddr: formData.f1cLocal,
        remoteAddr: formData.f1cRemote,
        localU: formData.f1uLocal,
        remoteU: formData.f1uRemote
      }
    }),
    ...(hasNG && {
      ng: {
        localAddr: formData.ngcLocal,
        remoteAddr: formData.ngcRemote,
        localU: formData.nguLocal,
        remoteU: formData.nguRemote
      }
    }),
    ...(hasE1 && {
      e1: {
        localAddr: formData.e1cLocal,
        remoteAddr: formData.e1cRemote,
        localU: formData.e1uLocal,
        remoteU: formData.e1uRemote
      }
    })
  };

  setNetworkList(prev => [...prev, newNetwork]);

  toast({
    title: "Network Added",
    description: "New network configuration has been added successfully."
  });

  setFormData({
    gnbCuId: '',
    xncLocal: '', xncRemote: '', xnuLocal: '', xnuRemote: '',
    f1cLocal: '', f1cRemote: '', f1uLocal: '', f1uRemote: '',
    ngcLocal: '', ngcRemote: '', nguLocal: '', nguRemote: '',
    e1cLocal: '', e1cRemote: '', e1uLocal: '', e1uRemote: ''
  });

  setIsAddDialogOpen(false);
};


  return (
    <div className="space-y-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center space-x-4"
      >
        <Link to="/device-configuration">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Devices
          </Button>
        </Link>
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Available Networks</h1>
          <p className="text-gray-600 text-lg">
            Device: {device?.name} ({gnbId})
          </p>
        </div>
      </motion.div>

      {/* Device Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-600">gNB Details</h3>
                <p className="text-lg font-semibold text-gray-900">{device?.name}</p>
                <p className="text-sm text-gray-500">{gnbId}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-600">Available CUCPs</h3>
                <p className="text-lg font-semibold text-blue-600">{cucpOptions.length}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-600">Available CUUPs</h3>
                <p className="text-lg font-semibold text-green-600">{device?.availableCUUPs || 0}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-600">Network Configs</h3>
                <p className="text-lg font-semibold text-purple-600">{networkList.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Networks Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Network className="h-6 w-6 text-blue-500" />
                <CardTitle className="text-xl font-bold text-gray-900">
                  Network Configurations
                </CardTitle>
              </div>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Network
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add New Network Configuration</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <Label htmlFor="gnbCuId">GNB CU ID</Label>
                      <Select value={formData.gnbCuId} onValueChange={(value) => handleInputChange('gnbCuId', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select CUCP" />
                        </SelectTrigger>
                        <SelectContent>
                          {cucpOptions.map(cucp => (
                            <SelectItem key={cucp.id} value={cucp.id.toString()}>
                              {cucp.cucpId} - {cucp.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {/* XN Configuration */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">XN Configuration</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="xncLocal">XNC Local Address</Label>
                          <Input
                            id="xncLocal"
                            value={formData.xncLocal}
                            onChange={(e) => handleInputChange('xncLocal', e.target.value)}
                            placeholder="192.168.1.10"
                            
                          />
                        </div>
                        <div>
                          <Label htmlFor="xncRemote">XNC Remote Address</Label>
                          <Input
                            id="xncRemote"
                            value={formData.xncRemote}
                            onChange={(e) => handleInputChange('xncRemote', e.target.value)}
                            placeholder="192.168.1.11"
                            
                          />
                        </div>
                        <div>
                          <Label htmlFor="xnuLocal">XNU Local Address</Label>
                          <Input
                            id="xnuLocal"
                            value={formData.xnuLocal}
                            onChange={(e) => handleInputChange('xnuLocal', e.target.value)}
                            placeholder="192.168.1.20"
                            
                          />
                        </div>
                        <div>
                          <Label htmlFor="xnuRemote">XNU Remote Address</Label>
                          <Input
                            id="xnuRemote"
                            value={formData.xnuRemote}
                            onChange={(e) => handleInputChange('xnuRemote', e.target.value)}
                            placeholder="192.168.1.21"
                            
                          />
                        </div>
                      </div>
                    </div>
                    
                    {/* F1 Configuration */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">F1 Configuration</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="f1cLocal">F1C Local Address</Label>
                          <Input
                            id="f1cLocal"
                            value={formData.f1cLocal}
                            onChange={(e) => handleInputChange('f1cLocal', e.target.value)}
                            placeholder="192.168.1.14"
                            
                          />
                        </div>
                        <div>
                          <Label htmlFor="f1cRemote">F1C Remote Address</Label>
                          <Input
                            id="f1cRemote"
                            value={formData.f1cRemote}
                            onChange={(e) => handleInputChange('f1cRemote', e.target.value)}
                            placeholder="192.168.1.15"
                            
                          />
                        </div>
                        <div>
                          <Label htmlFor="f1uLocal">F1U Local Address</Label>
                          <Input
                            id="f1uLocal"
                            value={formData.f1uLocal}
                            onChange={(e) => handleInputChange('f1uLocal', e.target.value)}
                            placeholder="192.168.1.24"
                            
                          />
                        </div>
                        <div>
                          <Label htmlFor="f1uRemote">F1U Remote Address</Label>
                          <Input
                            id="f1uRemote"
                            value={formData.f1uRemote}
                            onChange={(e) => handleInputChange('f1uRemote', e.target.value)}
                            placeholder="192.168.1.25"
                            
                          />
                        </div>
                      </div>
                    </div>
                    
                    {/* NG Configuration */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">NG Configuration</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="ngcLocal">NGC Local Address</Label>
                          <Input
                            id="ngcLocal"
                            value={formData.ngcLocal}
                            onChange={(e) => handleInputChange('ngcLocal', e.target.value)}
                            placeholder="192.168.1.12"
                            
                          />
                        </div>
                        <div>
                          <Label htmlFor="ngcRemote">NGC Remote Address</Label>
                          <Input
                            id="ngcRemote"
                            value={formData.ngcRemote}
                            onChange={(e) => handleInputChange('ngcRemote', e.target.value)}
                            placeholder="192.168.1.13"
                            
                          />
                        </div>
                        <div>
                          <Label htmlFor="nguLocal">NGU Local Address</Label>
                          <Input
                            id="nguLocal"
                            value={formData.nguLocal}
                            onChange={(e) => handleInputChange('nguLocal', e.target.value)}
                            placeholder="192.168.1.22"
                            
                          />
                        </div>
                        <div>
                          <Label htmlFor="nguRemote">NGU Remote Address</Label>
                          <Input
                            id="nguRemote"
                            value={formData.nguRemote}
                            onChange={(e) => handleInputChange('nguRemote', e.target.value)}
                            placeholder="192.168.1.23"
                            
                          />
                        </div>
                      </div>
                    </div>
                    
                    {/* E1 Configuration */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">E1 Configuration</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="e1cLocal">E1C Local Address</Label>
                          <Input
                            id="e1cLocal"
                            value={formData.e1cLocal}
                            onChange={(e) => handleInputChange('e1cLocal', e.target.value)}
                            placeholder="192.168.1.16"
                            
                          />
                        </div>
                        <div>
                          <Label htmlFor="e1cRemote">E1C Remote Address</Label>
                          <Input
                            id="e1cRemote"
                            value={formData.e1cRemote}
                            onChange={(e) => handleInputChange('e1cRemote', e.target.value)}
                            placeholder="192.168.1.17"
                            
                          />
                        </div>
                        <div>
                          <Label htmlFor="e1uLocal">E1U Local Address</Label>
                          <Input
                            id="e1uLocal"
                            value={formData.e1uLocal}
                            onChange={(e) => handleInputChange('e1uLocal', e.target.value)}
                            placeholder="192.168.1.26"
                            
                          />
                        </div>
                        <div>
                          <Label htmlFor="e1uRemote">E1U Remote Address</Label>
                          <Input
                            id="e1uRemote"
                            value={formData.e1uRemote}
                            onChange={(e) => handleInputChange('e1uRemote', e.target.value)}
                            placeholder="192.168.1.27"
                            
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end space-x-2 pt-4">
                      <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
                        Save Network
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>GNB CU ID</TableHead>
                    <TableHead>XN</TableHead>
                    <TableHead>NG</TableHead>
                    <TableHead>F1</TableHead>
                    <TableHead>E1</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {networkList.map((network, index) => (
                    <motion.tr
                      key={network.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <TableCell className="font-medium">{network.gnbCuId}</TableCell>
                      <TableCell>
                        <Link to={`/device/${gnbId}/networks/xn/${network.id}`}>
                          <Button variant="outline" size="sm" className="hover:bg-blue-50">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Link to={`/device/${gnbId}/networks/ng/${network.id}`}>
                          <Button variant="outline" size="sm" className="hover:bg-green-50">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Link to={`/device/${gnbId}/networks/f1/${network.id}`}>
                          <Button variant="outline" size="sm" className="hover:bg-purple-50">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Link to={`/device/${gnbId}/networks/e1/${network.id}`}>
                          <Button variant="outline" size="sm" className="hover:bg-orange-50">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </Link>
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

export default NetworksView;