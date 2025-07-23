import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Edit, Trash2, Radio, Play, Pause } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useToast } from '../hooks/use-toast';
import { mockCells, devices, mockDUs } from '../data/mockData';

const CellView = () => {
  const { gnbId, duId } = useParams();
  const [cellList, setCellList] = useState(mockCells);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    cellLocalId: '',
    administrativeState: 'UNLOCKED',
    nRPCI: '',
    nRTAC: '',
    arfcnDL: '',
    arfcnUL: '',
    arfcnSUL: '',
    bSChannelBwDL: '',
    bSChannelBwUL: '',
    bSChannelBwSUL: '',
    ssbFrequency: '',
    ssbPeriodicity: '5',
    ssbSubCarrierSpacing: '15',
    ssbOffset: '',
    ssbDuration: '1',
    nRSectorCarrierRef: '1',
    bWPRef: '1'
  });
  const { toast } = useToast();

  const device = devices.find(d => d.gNBId === gnbId);
  const du = mockDUs.find(d => d.duId === duId);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newCell = {
      id: cellList.length + 1,
      cellId: `CELL${String(cellList.length + 1).padStart(3, '0')}`,
      cellState: 'INACTIVE',
      adminState: formData.administrativeState,
      phyCellId: parseInt(formData.nRPCI),
      ulNrFreq: parseInt(formData.arfcnUL),
      dlNrFreq: parseInt(formData.arfcnDL),
      duId: duId,
      ...formData,
      cellLocalId: parseInt(formData.cellLocalId),
      nRPCI: parseInt(formData.nRPCI),
      arfcnDL: parseInt(formData.arfcnDL),
      arfcnUL: parseInt(formData.arfcnUL),
      arfcnSUL: parseInt(formData.arfcnSUL) || 0,
      bSChannelBwDL: parseInt(formData.bSChannelBwDL),
      bSChannelBwUL: parseInt(formData.bSChannelBwUL),
      bSChannelBwSUL: parseInt(formData.bSChannelBwSUL) || 0,
      ssbFrequency: parseInt(formData.ssbFrequency),
      ssbPeriodicity: parseInt(formData.ssbPeriodicity),
      ssbSubCarrierSpacing: parseInt(formData.ssbSubCarrierSpacing),
      ssbOffset: parseInt(formData.ssbOffset),
      ssbDuration: parseInt(formData.ssbDuration),
      nRSectorCarrierRef: parseInt(formData.nRSectorCarrierRef)
    };
    
    setCellList(prev => [...prev, newCell]);
    toast({
      title: "Cell Added",
      description: "New cell has been added successfully."
    });
    
    setFormData({
      cellLocalId: '',
      administrativeState: 'UNLOCKED',
      nRPCI: '',
      nRTAC: '',
      arfcnDL: '',
      arfcnUL: '',
      arfcnSUL: '',
      bSChannelBwDL: '',
      bSChannelBwUL: '',
      bSChannelBwSUL: '',
      ssbFrequency: '',
      ssbPeriodicity: '5',
      ssbSubCarrierSpacing: '15',
      ssbOffset: '',
      ssbDuration: '1',
      nRSectorCarrierRef: '1',
      bWPRef: '1'
    });
    setIsAddDialogOpen(false);
  };

  const handleActivate = (cellId) => {
    setCellList(prev => prev.map(cell => 
      cell.id === cellId 
        ? { ...cell, cellState: 'ACTIVE' }
        : cell
    ));
    toast({
      title: "Cell Activated",
      description: "Cell has been activated successfully."
    });
  };

  const handleDeactivate = (cellId) => {
    setCellList(prev => prev.map(cell => 
      cell.id === cellId 
        ? { ...cell, cellState: 'INACTIVE' }
        : cell
    ));
    toast({
      title: "Cell Deactivated",
      description: "Cell has been deactivated successfully."
    });
  };

  const handleDelete = (cellId) => {
    setCellList(prev => prev.filter(cell => cell.id !== cellId));
    toast({
      title: "Cell Deleted",
      description: "Cell has been removed successfully."
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
        <Link to={`/device/${gnbId}/du`}>
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to DUs
          </Button>
        </Link>
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Available Cells</h1>
          <p className="text-gray-600 text-lg">
            Device: {device?.name} | DU: {du?.duName} ({duId})
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
                <Radio className="h-6 w-6 text-pink-500" />
                <CardTitle className="text-xl font-bold text-gray-900">Cell Configuration</CardTitle>
              </div>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Cell
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add New Cell</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="cellLocalId">Cell Local ID</Label>
                        <Input
                          id="cellLocalId"
                          type="number"
                          value={formData.cellLocalId}
                          onChange={(e) => handleInputChange('cellLocalId', e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="administrativeState">Administrative State</Label>
                        <Select value={formData.administrativeState} onValueChange={(value) => handleInputChange('administrativeState', value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="UNLOCKED">UNLOCKED</SelectItem>
                            <SelectItem value="LOCKED">LOCKED</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="nRPCI">NR PCI</Label>
                        <Input
                          id="nRPCI"
                          type="number"
                          value={formData.nRPCI}
                          onChange={(e) => handleInputChange('nRPCI', e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="nRTAC">NR TAC</Label>
                        <Input
                          id="nRTAC"
                          value={formData.nRTAC}
                          onChange={(e) => handleInputChange('nRTAC', e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="arfcnDL">ARFCN DL</Label>
                        <Input
                          id="arfcnDL"
                          type="number"
                          value={formData.arfcnDL}
                          onChange={(e) => handleInputChange('arfcnDL', e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="arfcnUL">ARFCN UL</Label>
                        <Input
                          id="arfcnUL"
                          type="number"
                          value={formData.arfcnUL}
                          onChange={(e) => handleInputChange('arfcnUL', e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="arfcnSUL">ARFCN SUL</Label>
                        <Input
                          id="arfcnSUL"
                          type="number"
                          value={formData.arfcnSUL}
                          onChange={(e) => handleInputChange('arfcnSUL', e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="bSChannelBwDL">BS Channel BW DL</Label>
                        <Input
                          id="bSChannelBwDL"
                          type="number"
                          value={formData.bSChannelBwDL}
                          onChange={(e) => handleInputChange('bSChannelBwDL', e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="bSChannelBwUL">BS Channel BW UL</Label>
                        <Input
                          id="bSChannelBwUL"
                          type="number"
                          value={formData.bSChannelBwUL}
                          onChange={(e) => handleInputChange('bSChannelBwUL', e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="bSChannelBwSUL">BS Channel BW SUL</Label>
                        <Input
                          id="bSChannelBwSUL"
                          type="number"
                          value={formData.bSChannelBwSUL}
                          onChange={(e) => handleInputChange('bSChannelBwSUL', e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="ssbFrequency">SSB Frequency</Label>
                        <Input
                          id="ssbFrequency"
                          type="number"
                          value={formData.ssbFrequency}
                          onChange={(e) => handleInputChange('ssbFrequency', e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="ssbPeriodicity">SSB Periodicity</Label>
                        <Select value={formData.ssbPeriodicity} onValueChange={(value) => handleInputChange('ssbPeriodicity', value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="5">5</SelectItem>
                            <SelectItem value="10">10</SelectItem>
                            <SelectItem value="20">20</SelectItem>
                            <SelectItem value="40">40</SelectItem>
                            <SelectItem value="80">80</SelectItem>
                            <SelectItem value="160">160</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="flex justify-end space-x-2 pt-4">
                      <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700">
                        Add Cell
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
                    <TableHead>Cell ID</TableHead>
                    <TableHead>Cell State</TableHead>
                    <TableHead>Admin State</TableHead>
                    <TableHead>Phy. Cell ID</TableHead>
                    <TableHead>UL NR Freq.</TableHead>
                    <TableHead>DL NR Freq.</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cellList.map((cell, index) => (
                    <motion.tr
                      key={cell.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <TableCell className="font-medium">{cell.cellId}</TableCell>
                      <TableCell>
                        <Badge variant={cell.cellState === 'ACTIVE' ? 'default' : 'secondary'}>
                          {cell.cellState}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={cell.adminState === 'UNLOCKED' ? 'default' : 'secondary'}>
                          {cell.adminState}
                        </Badge>
                      </TableCell>
                      <TableCell>{cell.phyCellId}</TableCell>
                      <TableCell>{cell.ulNrFreq}</TableCell>
                      <TableCell>{cell.dlNrFreq}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="hover:bg-blue-50 hover:border-blue-300"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          {cell.cellState === 'ACTIVE' ? (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDeactivate(cell.id)}
                              className="hover:bg-orange-50 hover:border-orange-300"
                            >
                              <Pause className="h-4 w-4" />
                            </Button>
                          ) : (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleActivate(cell.id)}
                              className="hover:bg-green-50 hover:border-green-300"
                            >
                              <Play className="h-4 w-4" />
                            </Button>
                          )}
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDelete(cell.id)}
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

export default CellView;