import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Edit, Trash2, Wifi } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useToast } from '../hooks/use-toast';
import { mockBWPs } from '../data/mockData';

const BWPView = () => {
  const { gnbId, duId } = useParams();
  const [bwpList, setBwpList] = useState(mockBWPs);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    bwpId: '',
    subcarrierSpacing: 'kHz30',
    cyclicPrefix: 'normal',
    startRB: '',
    numberOfRBs: ''
  });
  const { toast } = useToast();

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newBWP = {
      id: bwpList.length + 1,
      ...formData,
      duId: duId,
      startRB: parseInt(formData.startRB),
      numberOfRBs: parseInt(formData.numberOfRBs)
    };
    
    setBwpList(prev => [...prev, newBWP]);
    toast({ title: "BWP Added", description: "New BWP has been added successfully." });
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
        <Link to={`/device/${gnbId}/du`}>
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to DUs
          </Button>
        </Link>
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Available BWP</h1>
          <p className="text-gray-600 text-lg">DU: {duId}</p>
        </div>
      </motion.div>

      <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Wifi className="h-6 w-6 text-cyan-500" />
              <CardTitle className="text-xl font-bold text-gray-900">Bandwidth Part Configuration</CardTitle>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Add BWP
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Add New BWP</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="bwpId">BWP ID</Label>
                    <Input id="bwpId" value={formData.bwpId} onChange={(e) => handleInputChange('bwpId', e.target.value)} required />
                  </div>
                  <div>
                    <Label htmlFor="subcarrierSpacing">Subcarrier Spacing</Label>
                    <Select value={formData.subcarrierSpacing} onValueChange={(value) => handleInputChange('subcarrierSpacing', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kHz15">15 kHz</SelectItem>
                        <SelectItem value="kHz30">30 kHz</SelectItem>
                        <SelectItem value="kHz60">60 kHz</SelectItem>
                        <SelectItem value="kHz120">120 kHz</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="startRB">Start RB</Label>
                      <Input id="startRB" type="number" value={formData.startRB} onChange={(e) => handleInputChange('startRB', e.target.value)} required />
                    </div>
                    <div>
                      <Label htmlFor="numberOfRBs">Number of RBs</Label>
                      <Input id="numberOfRBs" type="number" value={formData.numberOfRBs} onChange={(e) => handleInputChange('numberOfRBs', e.target.value)} required />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2 pt-4">
                    <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                    <Button type="submit" className="bg-gradient-to-r from-cyan-500 to-cyan-600">Add BWP</Button>
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
                <TableHead>BWP ID</TableHead>
                <TableHead>Subcarrier Spacing</TableHead>
                <TableHead>Number of RBs</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bwpList.map((bwp, index) => (
                <motion.tr key={bwp.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: index * 0.1 }}>
                  <TableCell className="font-medium">{bwp.bwpId}</TableCell>
                  <TableCell><Badge variant="secondary">{bwp.subcarrierSpacing}</Badge></TableCell>
                  <TableCell>{bwp.numberOfRBs}</TableCell>
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

export default BWPView;