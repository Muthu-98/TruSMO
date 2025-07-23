import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Edit, Trash2, Radio, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { useToast } from '../hooks/use-toast';
import { mockCUCPCells } from '../data/mockData';

const CUCPCellView = () => {
  const { gnbId, cucpId } = useParams();
  const [cellList, setCellList] = useState(mockCUCPCells);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    cellLocalId: '',
    plmnInfoList: '',
    nrFrequencyRef: ''
  });
  const { toast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    const newCell = {
      id: cellList.length + 1,
      cellId: `CUCP-CELL${String(cellList.length + 1).padStart(3, '0')}`,
      ...formData,
      cucpId: cucpId,
      cellLocalId: parseInt(formData.cellLocalId),
      plmnInfoList: formData.plmnInfoList.split(',').map(p => p.trim())
    };
    
    setCellList(prev => [...prev, newCell]);
    toast({ title: "CUCP Cell Added", description: "New CUCP cell has been added successfully." });
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
        <Link to={`/device/${gnbId}/cucp`}>
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to CUCPs
          </Button>
        </Link>
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">CUCP Cell Configuration</h1>
          <p className="text-gray-600 text-lg">CUCP: {cucpId}</p>
        </div>
      </motion.div>

      <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Radio className="h-6 w-6 text-purple-500" />
              <CardTitle className="text-xl font-bold text-gray-900">CUCP Cells</CardTitle>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Cell
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Add New CUCP Cell</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="cellLocalId">Cell Local ID</Label>
                    <Input id="cellLocalId" type="number" value={formData.cellLocalId} onChange={(e) => setFormData({...formData, cellLocalId: e.target.value})} required />
                  </div>
                  <div>
                    <Label htmlFor="plmnInfoList">PLMN Info List (comma-separated)</Label>
                    <Input id="plmnInfoList" value={formData.plmnInfoList} onChange={(e) => setFormData({...formData, plmnInfoList: e.target.value})} placeholder="50101,50102" required />
                  </div>
                  <div>
                    <Label htmlFor="nrFrequencyRef">NR Frequency Ref</Label>
                    <Input id="nrFrequencyRef" value={formData.nrFrequencyRef} onChange={(e) => setFormData({...formData, nrFrequencyRef: e.target.value})} required />
                  </div>
                  <div className="flex justify-end space-x-2 pt-4">
                    <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                    <Button type="submit" className="bg-gradient-to-r from-purple-500 to-purple-600">Add Cell</Button>
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
                <TableHead>Cell ID</TableHead>
                <TableHead>NR Frequency Ref</TableHead>
                <TableHead>AvailableCellRelation</TableHead>
                <TableHead>AvailableFreqRelation</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cellList.map((cell, index) => (
                <motion.tr key={cell.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: index * 0.1 }}>
                  <TableCell className="font-medium">{cell.cellId}</TableCell>
                  <TableCell>{cell.nrFrequencyRef}</TableCell>
                  <TableCell>
                    <Link to={`/cell-relation`}>
                      <Button variant="outline" size="sm" className="hover:bg-blue-50">
                        <Eye className="h-4 w-4 mr-1" />
                        View ({cell.availableCellRelation ?? 2})
                      </Button>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link to={`/freq-relation`}>
                      <Button variant="outline" size="sm" className="hover:bg-blue-50">
                        <Eye className="h-4 w-4 mr-1" />
                        View ({cell.availableFreqRelation ?? 2})
                      </Button>
                    </Link>
                  </TableCell>
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

export default CUCPCellView;