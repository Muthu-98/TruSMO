import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Edit, Trash2, Server } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { useToast } from '../hooks/use-toast';
import { mockCUUPs, devices, vendors } from '../data/mockData';

const CUUPView = () => {
  const { gnbId } = useParams();
  const [cuupList, setCuupList] = useState(mockCUUPs);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ cuupId: '', name: '', length: '' });
  const { toast } = useToast();

  const device = devices.find(d => d.gNBId === gnbId);
  const vendor = vendors.find(v => v.manufacturer === device?.manufacturer);
  const maxCUUPs = vendor?.maxNoOfGNBCuUP || 0;
  const canAddCUUP = cuupList.length < maxCUUPs;

  const handleSubmit = (e) => {
    e.preventDefault();
    const newCUUP = {
      id: cuupList.length + 1,
      ...formData,
      gnbId: gnbId,
      length: parseInt(formData.length)
    };
    
    setCuupList(prev => [...prev, newCUUP]);
    toast({ title: "CUUP Added", description: "New CUUP has been added successfully." });
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
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Available CUUPs</h1>
          <p className="text-gray-600 text-lg">Device: {device?.name} | Max CUUPs: {maxCUUPs}</p>
        </div>
      </motion.div>

      <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Server className="h-6 w-6 text-orange-500" />
              <CardTitle className="text-xl font-bold text-gray-900">Centralized Unit User Plane</CardTitle>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
                  disabled={!canAddCUUP}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add CUUP
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Add New CUUP</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="cuupId">CUUP ID</Label>
                    <Input id="cuupId" value={formData.cuupId} onChange={(e) => setFormData({...formData, cuupId: e.target.value})} required />
                  </div>
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                  </div>
                  <div>
                    <Label htmlFor="length">Length</Label>
                    <Input id="length" type="number" value={formData.length} onChange={(e) => setFormData({...formData, length: e.target.value})} required />
                  </div>
                  <div className="flex justify-end space-x-2 pt-4">
                    <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                    <Button type="submit" className="bg-gradient-to-r from-orange-500 to-orange-600">Add CUUP</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Length</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cuupList.map((cuup, index) => (
                <motion.tr key={cuup.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: index * 0.1 }}>
                  <TableCell className="font-medium">{cuup.cuupId}</TableCell>
                  <TableCell>{cuup.name}</TableCell>
                  <TableCell><Badge variant="secondary">{cuup.length}</Badge></TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" className="hover:bg-blue-50"><Edit className="h-4 w-4" /></Button>
                      <Button variant="outline" size="sm" className="hover:bg-red-50 hover:text-red-600"><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default CUUPView;