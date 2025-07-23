import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Edit, Trash2, Plus, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const mockNeighborGNBs = [
  {
    nbrid: 1,
    nbrGnbMnc: '01',
    nbrGnbMcc: '501',
    nbrGnbIdLength: 32,
    availableExternalCells: 2
  }
];

const NRNetworkConfiguration = () => {
  const [neighborList, setNeighborList] = useState(mockNeighborGNBs);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [formData, setFormData] = useState({

    nbrGnbMnc: '',
    nbrGnbMcc: '',
    nbrGnbIdLength: '',
    availableExternalCells: 0
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newNeighbor = {
      nbrid: neighborList.length + 1,
      ...formData,
      nbrGnbIdLength: Number(formData.nbrGnbIdLength),
      availableExternalCells: Number(formData.availableExternalCells)
    };
    setNeighborList(prev => [...prev, newNeighbor]);
    setIsAddDialogOpen(false);
    setFormData({
      nbrGnbMnc: '',
      nbrGnbMcc: '',
      nbrGnbIdLength: '',
      availableExternalCells: 0
    });
  };

  return (
    <div className="space-y-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-2">NeighborGNB Configuration</h1>
        <p className="text-gray-600 text-lg">Manage NeighborGNBs and their external cells</p>
      </motion.div>
      <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold text-gray-900">List of NeighborGNB</CardTitle>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Add NeighborGNB
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Add NeighborGNB</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="nbrGnbId">nbrId</Label>
                    <Input
                      id="nbrGnbId"
                      type="number"
                      value={formData.nbrGnbId}
                      onChange={e => setFormData({ ...formData, nbrGnbIdLength: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="nbrGnbMnc">nbrGnbMnc</Label>
                    <Input
                      id="nbrGnbMnc"
                      value={formData.nbrGnbMnc}
                      onChange={e => setFormData({ ...formData, nbrGnbMnc: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="nbrGnbMcc">nbrGnbMcc</Label>
                    <Input
                      id="nbrGnbMcc"
                      value={formData.nbrGnbMcc}
                      onChange={e => setFormData({ ...formData, nbrGnbMcc: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="nbrGnbIdLength">nbrGnbIdLength</Label>
                    <Input
                      id="nbrGnbIdLength"
                      type="number"
                      value={formData.nbrGnbIdLength}
                      onChange={e => setFormData({ ...formData, nbrGnbIdLength: e.target.value })}
                      required
                    />
                  </div>
                  {/* <div>
                    <Label htmlFor="availableExternalCells">AvailableExternalCells</Label>
                    <Input
                      id="availableExternalCells"
                      type="number"
                      value={formData.availableExternalCells}
                      onChange={e => setFormData({ ...formData, availableExternalCells: e.target.value })}
                      required
                    />
                  </div> */}
                  <div className="flex justify-end space-x-2 pt-4">
                    <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                    <Button type="submit" className="bg-gradient-to-r from-blue-500 to-blue-600">Add</Button>
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
                <TableHead>nbrid</TableHead>
                <TableHead>nbrGnbMnc</TableHead>
                <TableHead>nbrGnbMcc</TableHead>
                <TableHead>nbrGnbIdLength</TableHead>
                <TableHead>AvailableExternalCells</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {neighborList.map((nbr) => (
                <TableRow key={nbr.nbrid}>
                  <TableCell>{nbr.nbrid}</TableCell>
                  <TableCell>{nbr.nbrGnbMnc}</TableCell>
                  <TableCell>{nbr.nbrGnbMcc}</TableCell>
                  <TableCell>{nbr.nbrGnbIdLength}</TableCell>
                  <TableCell>
                    <Link to="/external-cell">
                      <Button variant="outline" size="sm" className="hover:bg-blue-50">
                        <Eye className="h-4 w-4 mr-1" />
                        View ({nbr.availableExternalCells})
                      </Button>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" className="hover:bg-blue-50"><Edit className="h-4 w-4" /></Button>
                      <Button variant="outline" size="sm" className="hover:bg-red-50 hover:text-red-600"><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default NRNetworkConfiguration;