import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Edit, Trash2, Eye, Cpu } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { useToast } from '../hooks/use-toast';
import { mockDUs, devices, vendors } from '../data/mockData';

const DUView = () => {
  const { gnbId } = useParams();
  const [duList, setDuList] = useState(mockDUs);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    duId: '',
    duName: '',
    length: ''
  });
  const { toast } = useToast();

  const device = devices.find(d => d.gNBId === gnbId);
  const vendor = vendors.find(v => v.manufacturer === device?.manufacturer);
  const maxDUs = vendor?.maxNoOfGNBDu || 0;
  const canAddDU = duList.length < maxDUs;

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newDU = {
      id: duList.length + 1,
      duId: formData.duId,
      duName: formData.duName,
      length: parseInt(formData.length),
      gnbId: gnbId,
      availableNrsector: 0,
      availableBWP: 0,
      availableCell: 0
    };
    
    setDuList(prev => [...prev, newDU]);
    toast({
      title: "DU Added",
      description: "New DU has been added successfully."
    });
    
    setFormData({
      duId: '',
      duName: '',
      length: ''
    });
    setIsAddDialogOpen(false);
  };

  const handleDelete = (duId) => {
    setDuList(prev => prev.filter(du => du.id !== duId));
    toast({
      title: "DU Deleted",
      description: "DU has been removed successfully."
    });
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
          <h1 className="text-4xl font-bold text-gray-900 mb-2">List of DU per gNB</h1>
          <p className="text-gray-600 text-lg">
            Device: {device?.name} ({gnbId}) | Max DUs: {maxDUs}
          </p>
        </div>
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
                <Cpu className="h-6 w-6 text-green-500" />
                <CardTitle className="text-xl font-bold text-gray-900">
                  Distributed Units (DUs)
                </CardTitle>
              </div>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
                    disabled={!canAddDU}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add DU
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Add New DU</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="duId">DU ID</Label>
                      <Input
                        id="duId"
                        value={formData.duId}
                        onChange={(e) => handleInputChange('duId', e.target.value)}
                        placeholder="e.g., DU003"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="duName">DU Name</Label>
                      <Input
                        id="duName"
                        value={formData.duName}
                        onChange={(e) => handleInputChange('duName', e.target.value)}
                        placeholder="e.g., BLR-DU-03"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="length">Length</Label>
                      <Input
                        id="length"
                        type="number"
                        value={formData.length}
                        onChange={(e) => handleInputChange('length', e.target.value)}
                        placeholder="e.g., 100"
                        required
                      />
                    </div>
                    <div className="flex justify-end space-x-2 pt-4">
                      <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700">
                        Add DU
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            {!canAddDU && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <p className="text-sm text-amber-800">
                  Maximum number of DUs ({maxDUs}) reached for this vendor configuration.
                </p>
              </div>
            )}
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>DU ID</TableHead>
                    <TableHead>DU Name</TableHead>
                    <TableHead>Length</TableHead>
                    <TableHead>Available NRSector</TableHead>
                    <TableHead>Available BWP</TableHead>
                    <TableHead>Available Cell</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {duList.map((du, index) => (
                    <motion.tr
                      key={du.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <TableCell className="font-medium">{du.duId}</TableCell>
                      <TableCell>{du.duName}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{du.length}</Badge>
                      </TableCell>
                      <TableCell>
                        <Link to={`/device/${gnbId}/du/${du.duId}/nrsector`}>
                          <Button variant="outline" size="sm" className="hover:bg-blue-50">
                            <Eye className="h-4 w-4 mr-1" />
                            View ({du.availableNrsector})
                          </Button>
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Link to={`/device/${gnbId}/du/${du.duId}/bwp`}>
                          <Button variant="outline" size="sm" className="hover:bg-purple-50">
                            <Eye className="h-4 w-4 mr-1" />
                            View ({du.availableBWP})
                          </Button>
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Link to={`/device/${gnbId}/du/${du.duId}/cell`}>
                          <Button variant="outline" size="sm" className="hover:bg-green-50">
                            <Eye className="h-4 w-4 mr-1" />
                            View ({du.availableCell})
                          </Button>
                        </Link>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="hover:bg-blue-50 hover:border-blue-300"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDelete(du.id)}
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

export default DUView;