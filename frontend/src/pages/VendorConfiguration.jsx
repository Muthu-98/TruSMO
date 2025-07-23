import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Building2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { useToast } from '../hooks/use-toast';
import { vendors } from '../data/mockData';

const VendorConfiguration = () => {
  const [vendorList, setVendorList] = useState(vendors);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState(null);
  const [formData, setFormData] = useState({
    manufacturer: '',
    product: '',
    maxNoOfGNBCuCP: '',
    maxNoOfGNBCuUP: '',
    maxNoOfNrcellCuPerGNBCUCP: '',
    maxNoOfGNBDu: '',
    maxNoOfNrCellDuPerGNBDU: ''
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
    
    if (editingVendor) {
      // Update existing vendor
      setVendorList(prev => prev.map(vendor => 
        vendor.id === editingVendor.id 
          ? { ...vendor, ...formData, id: editingVendor.id }
          : vendor
      ));
      toast({
        title: "Vendor Updated",
        description: "Vendor configuration has been updated successfully."
      });
      setEditingVendor(null);
    } else {
      // Add new vendor
      const newVendor = {
        ...formData,
        id: vendorList.length + 1,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setVendorList(prev => [...prev, newVendor]);
      toast({
        title: "Vendor Added",
        description: "New vendor has been added successfully."
      });
    }
    
    setFormData({
      manufacturer: '',
      product: '',
      maxNoOfGNBCuCP: '',
      maxNoOfGNBCuUP: '',
      maxNoOfNrcellCuPerGNBCUCP: '',
      maxNoOfGNBDu: '',
      maxNoOfNrCellDuPerGNBDU: ''
    });
    setIsAddDialogOpen(false);
  };

  const handleEdit = (vendor) => {
    setEditingVendor(vendor);
    setFormData({
      manufacturer: vendor.manufacturer,
      product: vendor.product,
      maxNoOfGNBCuCP: vendor.maxNoOfGNBCuCP.toString(),
      maxNoOfGNBCuUP: vendor.maxNoOfGNBCuUP.toString(),
      maxNoOfNrcellCuPerGNBCUCP: vendor.maxNoOfNrcellCuPerGNBCUCP.toString(),
      maxNoOfGNBDu: vendor.maxNoOfGNBDu.toString(),
      maxNoOfNrCellDuPerGNBDU: vendor.maxNoOfNrCellDuPerGNBDU.toString()
    });
    setIsAddDialogOpen(true);
  };

  const handleDelete = (vendorId) => {
    setVendorList(prev => prev.filter(vendor => vendor.id !== vendorId));
    toast({
      title: "Vendor Deleted",
      description: "Vendor has been removed successfully."
    });
  };

  return (
    <div className="space-y-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Vendor Configuration</h1>
        <p className="text-gray-600 text-lg">Manage vendor specifications and device configurations</p>
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
                <Building2 className="h-6 w-6 text-orange-500" />
                <CardTitle className="text-xl font-bold text-gray-900">Registered Vendors</CardTitle>
              </div>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Vendor
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>
                      {editingVendor ? 'Edit Vendor' : 'Add New Vendor'}
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="manufacturer">Manufacturer</Label>
                        <Input
                          id="manufacturer"
                          value={formData.manufacturer}
                          onChange={(e) => handleInputChange('manufacturer', e.target.value)}
                          placeholder="e.g., Nokia, Ericsson"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="product">Product</Label>
                        <Input
                          id="product"
                          value={formData.product}
                          onChange={(e) => handleInputChange('product', e.target.value)}
                          placeholder="e.g., AirScale Base Station"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="maxNoOfGNBCuCP">Max No. of GNB CuCP</Label>
                        <Input
                          id="maxNoOfGNBCuCP"
                          type="number"
                          value={formData.maxNoOfGNBCuCP}
                          onChange={(e) => handleInputChange('maxNoOfGNBCuCP', e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="maxNoOfGNBCuUP">Max No. of GNB CuUP</Label>
                        <Input
                          id="maxNoOfGNBCuUP"
                          type="number"
                          value={formData.maxNoOfGNBCuUP}
                          onChange={(e) => handleInputChange('maxNoOfGNBCuUP', e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="maxNoOfNrcellCuPerGNBCUCP">Max No. of NrCell Cu Per GNBCUCP</Label>
                      <Input
                        id="maxNoOfNrcellCuPerGNBCUCP"
                        type="number"
                        value={formData.maxNoOfNrcellCuPerGNBCUCP}
                        onChange={(e) => handleInputChange('maxNoOfNrcellCuPerGNBCUCP', e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="maxNoOfGNBDu">Max No. of GNB Du</Label>
                        <Input
                          id="maxNoOfGNBDu"
                          type="number"
                          value={formData.maxNoOfGNBDu}
                          onChange={(e) => handleInputChange('maxNoOfGNBDu', e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="maxNoOfNrCellDuPerGNBDU">Max No. of NrCell Du Per GNBDU</Label>
                        <Input
                          id="maxNoOfNrCellDuPerGNBDU"
                          type="number"
                          value={formData.maxNoOfNrCellDuPerGNBDU}
                          onChange={(e) => handleInputChange('maxNoOfNrCellDuPerGNBDU', e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-end space-x-2 pt-4">
                      <Button type="button" variant="outline" onClick={() => {
                        setIsAddDialogOpen(false);
                        setEditingVendor(null);
                        setFormData({
                          manufacturer: '',
                          product: '',
                          maxNoOfGNBCuCP: '',
                          maxNoOfGNBCuUP: '',
                          maxNoOfNrcellCuPerGNBCUCP: '',
                          maxNoOfGNBDu: '',
                          maxNoOfNrCellDuPerGNBDU: ''
                        });
                      }}>
                        Cancel
                      </Button>
                      <Button type="submit" className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700">
                        {editingVendor ? 'Update' : 'Add'} Vendor
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
                    <TableHead>Manufacturer</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Max CuCP</TableHead>
                    <TableHead>Max CuUP</TableHead>
                    <TableHead>Max Du</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vendorList.map((vendor, index) => (
                    <motion.tr
                      key={vendor.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <TableCell className="font-medium">{vendor.manufacturer}</TableCell>
                      <TableCell>{vendor.product}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{vendor.maxNoOfGNBCuCP}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{vendor.maxNoOfGNBCuUP}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{vendor.maxNoOfGNBDu}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">{vendor.createdAt}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEdit(vendor)}
                            className="hover:bg-blue-50 hover:border-blue-300"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDelete(vendor.id)}
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

export default VendorConfiguration;