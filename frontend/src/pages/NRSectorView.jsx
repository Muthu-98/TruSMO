import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Edit, Trash2, Antenna } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { useToast } from '../hooks/use-toast';
import { mockNRSectors } from '../data/mockData';

const NRSectorView = () => {
  const { gnbId, duId } = useParams();
  const [sectorList, setSectorList] = useState(mockNRSectors);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    sectorId: '',
    sectorEquipmentFunctionRef: '',
    txDirection: '',
    configuredMaxTxPower: '',
    configuredMaxTxEIRP: '',
    arfcnDL: '',
    arfcnUL: '',
    bSChannelBwDL: '',
    bSChannelBwUL: ''
  });
  const { toast } = useToast();

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newSector = {
      id: sectorList.length + 1,
      ...formData,
      duId: duId,
      configuredMaxTxPower: parseInt(formData.configuredMaxTxPower),
      configuredMaxTxEIRP: parseInt(formData.configuredMaxTxEIRP),
      arfcnDL: parseInt(formData.arfcnDL),
      arfcnUL: parseInt(formData.arfcnUL),
      bSChannelBwDL: parseInt(formData.bSChannelBwDL),
      bSChannelBwUL: parseInt(formData.bSChannelBwUL)
    };
    
    setSectorList(prev => [...prev, newSector]);
    toast({ title: "NR Sector Added", description: "New NR Sector has been added successfully." });
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
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Available NR Sectors</h1>
          <p className="text-gray-600 text-lg">DU: {duId}</p>
        </div>
      </motion.div>

      <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Antenna className="h-6 w-6 text-indigo-500" />
              <CardTitle className="text-xl font-bold text-gray-900">NR Sector Configuration</CardTitle>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Add NR Sector
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New NR Sector</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="sectorId">Sector ID</Label>
                      <Input id="sectorId" value={formData.sectorId} onChange={(e) => handleInputChange('sectorId', e.target.value)} required />
                    </div>
                    <div>
                      <Label htmlFor="txDirection">TX Direction</Label>
                      <Input id="txDirection" value={formData.txDirection} onChange={(e) => handleInputChange('txDirection', e.target.value)} required />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="arfcnDL">ARFCN DL</Label>
                      <Input id="arfcnDL" type="number" value={formData.arfcnDL} onChange={(e) => handleInputChange('arfcnDL', e.target.value)} required />
                    </div>
                    <div>
                      <Label htmlFor="arfcnUL">ARFCN UL</Label>
                      <Input id="arfcnUL" type="number" value={formData.arfcnUL} onChange={(e) => handleInputChange('arfcnUL', e.target.value)} required />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2 pt-4">
                    <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                    <Button type="submit" className="bg-gradient-to-r from-indigo-500 to-indigo-600">Add Sector</Button>
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
                <TableHead>Sector ID</TableHead>
                <TableHead>ARFCN DL</TableHead>
                <TableHead>ARFCN UL</TableHead>
                <TableHead>BW DL</TableHead>
                <TableHead>BW UL</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sectorList.map((sector, index) => (
                <motion.tr key={sector.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: index * 0.1 }}>
                  <TableCell className="font-medium">{sector.sectorId}</TableCell>
                  <TableCell>{sector.arfcnDL}</TableCell>
                  <TableCell>{sector.arfcnUL}</TableCell>
                  <TableCell><Badge variant="secondary">{sector.bSChannelBwDL}</Badge></TableCell>
                  <TableCell><Badge variant="secondary">{sector.bSChannelBwUL}</Badge></TableCell>
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

export default NRSectorView;