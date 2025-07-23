import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Edit, Trash2, Plus, ArrowLeft } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { mockCUCPCells } from '../data/mockData'; // Import available CUCP cells

const mockCellRelations = [
  { id: 1, nrCellCu: 'CUCP-CELL001', adjacentNRCellRef: 'REF-001', relationId: 'REL-001' },
  { id: 2, nrCellCu: 'CUCP-CELL002', adjacentNRCellRef: 'REF-002', relationId: 'REL-002' }
];

const CellRelation = () => {
  const [relationList, setRelationList] = useState(mockCellRelations);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    nrCellCu: '',
    adjacentNRCellRef: '',
    relationId: ''
  });
  const { gnbId, cucpId } = useParams();

  const handleSubmit = (e) => {
    e.preventDefault();
    const newRelation = {
      id: relationList.length + 1,
      ...formData
    };
    setRelationList(prev => [...prev, newRelation]);
    setIsAddDialogOpen(false);
    setFormData({ nrCellCu: '', adjacentNRCellRef: '', relationId: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link to={`/device/${gnbId}/cucp/${cucpId}/cell`}>
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to CUCP Cells
          </Button>
        </Link>
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Cell Relation Configuration</h1>
          {cucpId && <p className="text-gray-600 text-lg">CUCP: {cucpId}</p>}
        </div>
      </div>
      <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold text-gray-900">List of Cell Relation</CardTitle>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Cell Relation
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Add Cell Relation</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="nrCellCu">nrCellCu (CUCP Cell)</Label>
                    <select
                      id="nrCellCu"
                      value={formData.nrCellCu}
                      onChange={e => setFormData({ ...formData, nrCellCu: e.target.value })}
                      className="w-full border rounded px-3 py-2"
                      required
                    >
                      <option value="">Select CUCP Cell</option>
                      {mockCUCPCells.map(cell => (
                        <option key={cell.cellId} value={cell.cellId}>{cell.cellId}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="adjacentNRCellRef">adjacentNRCellRef</Label>
                    <Input
                      id="adjacentNRCellRef"
                      value={formData.adjacentNRCellRef}
                      onChange={e => setFormData({ ...formData, adjacentNRCellRef: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="relationId">RelationId</Label>
                    <Input
                      id="relationId"
                      value={formData.relationId}
                      onChange={e => setFormData({ ...formData, relationId: e.target.value })}
                      required
                    />
                  </div>
                  <div className="flex justify-end space-x-2 pt-4">
                    <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                    <Button type="submit" className="bg-gradient-to-r from-purple-500 to-purple-600">Add</Button>
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
                <TableHead>RelationId</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {relationList.map((rel) => (
                <TableRow key={rel.id}>
                  <TableCell>{rel.id}</TableCell>
                  <TableCell>{rel.relationId}</TableCell>
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

export default CellRelation;