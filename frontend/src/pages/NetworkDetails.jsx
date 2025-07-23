import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Edit, Save, Trash2, X, CheckSquare } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Input } from '../components/ui/input';
import { Checkbox } from '../components/ui/checkbox';
import { useToast } from '../hooks/use-toast';
import { mockNetworkDetails, devices, mockCUCPs } from '../data/mockData';

const NetworkDetails = () => {
  const { gnbId, type, id } = useParams();
  const [selectedItems, setSelectedItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [editValue, setEditValue] = useState('');
  const { toast } = useToast();

  const device = devices.find(d => d.gNBId === gnbId);
  const cucp = mockCUCPs.find(c => c.id === parseInt(id));

  const getNetworkTypeDetails = () => {
    switch (type) {
      case 'xn':
        return {
          title: 'XN Network Details',
          subtitle: 'X2/Xn Interface Configuration',
          color: 'blue',
          data: mockNetworkDetails.xn,
          isTable: true
        };
      case 'f1':
        return {
          title: 'F1 Network Details',
          subtitle: 'F1 Interface Configuration',
          color: 'purple',
          data: mockNetworkDetails.f1,
          isTable: true
        };
      case 'ng':
        return {
          title: 'NG Network Details',
          subtitle: 'NG Interface Configuration',
          color: 'green',
          data: mockNetworkDetails.ng,
          isTable: false
        };
      case 'e1':
        return {
          title: 'E1 Network Details',
          subtitle: 'E1 Interface Configuration',
          color: 'orange',
          data: mockNetworkDetails.e1,
          isTable: false
        };
      default:
        return {
          title: 'Network Details',
          subtitle: 'Configuration',
          color: 'gray',
          data: [],
          isTable: false
        };
    }
  };

  const networkInfo = getNetworkTypeDetails();

  const handleItemSelect = (itemId) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleEdit = (item) => {
    setEditingItem(item.id || item.item);
    setEditValue(item.currentValue || item.xncLocal || '');
  };

  const handleSaveEdit = () => {
    toast({
      title: "Updated",
      description: "Network configuration has been updated successfully."
    });
    setEditingItem(null);
    setEditValue('');
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
    setEditValue('');
  };

  const handleDelete = () => {
    if (selectedItems.length === 0) {
      toast({
        title: "No Selection",
        description: "Please select items to delete.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Deleted",
      description: `${selectedItems.length} item(s) have been deleted successfully.`
    });
    setSelectedItems([]);
  };

  const handleSubmit = () => {
    toast({
      title: "Submitted",
      description: "Network configuration has been submitted successfully."
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
        <Link to={`/device/${gnbId}/networks`}>
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Networks
          </Button>
        </Link>
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{networkInfo.title}</h1>
          <p className="text-gray-600 text-lg">
            {networkInfo.subtitle} | Device: {device?.name}
          </p>
        </div>
      </motion.div>

      {/* Device & CUCP Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className={`border-0 shadow-lg bg-gradient-to-r from-${networkInfo.color}-50 to-${networkInfo.color}-100`}>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-600">gNB Details</h3>
                <p className="text-lg font-semibold text-gray-900">{device?.name}</p>
                <p className="text-sm text-gray-500">{gnbId}</p>
              </div>
              {cucp && (
                <div>
                  <h3 className="text-sm font-medium text-gray-600">CUCP Details</h3>
                  <p className="text-lg font-semibold text-gray-900">{cucp.name}</p>
                  <p className="text-sm text-gray-500">{cucp.cucpId}</p>
                </div>
              )}
              <div>
                <h3 className="text-sm font-medium text-gray-600">Interface Type</h3>
                <p className="text-lg font-semibold text-gray-900">{type.toUpperCase()}</p>
                <p className="text-sm text-gray-500">Configuration ID: {id}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Network Configuration Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold text-gray-900">
                {networkInfo.title}
              </CardTitle>
              <div className="flex space-x-2">
                {selectedItems.length > 0 && (
                  <Button 
                    variant="outline" 
                    onClick={handleDelete}
                    className="hover:bg-red-50 hover:border-red-300 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Selected
                  </Button>
                )}
                <Button 
                  onClick={handleSubmit}
                  className={`bg-gradient-to-r from-${networkInfo.color}-500 to-${networkInfo.color}-600 hover:from-${networkInfo.color}-600 hover:to-${networkInfo.color}-700 text-white`}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Submit
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    {networkInfo.isTable && <TableHead>Select</TableHead>}
                    <TableHead>
                      {networkInfo.isTable ? 
                        (type === 'xn' ? 'XN ID' : 'F1 ID') : 
                        'Configuration Item'
                      }
                    </TableHead>
                    <TableHead>
                      {networkInfo.isTable ? 
                        `${type.toUpperCase()}C Local` : 
                        'Current Value'
                      }
                    </TableHead>
                    {networkInfo.isTable && (
                      <>
                        <TableHead>{type.toUpperCase()}C Remote</TableHead>
                        <TableHead>{type.toUpperCase()}U Local</TableHead>
                        <TableHead>{type.toUpperCase()}U Remote</TableHead>
                      </>
                    )}
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {networkInfo.data.map((item, index) => (
                    <motion.tr
                      key={item.id || item.item}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      {networkInfo.isTable && (
                        <TableCell>
                          <Checkbox
                            checked={selectedItems.includes(item.id)}
                            onCheckedChange={() => handleItemSelect(item.id)}
                          />
                        </TableCell>
                      )}
                      <TableCell className="font-medium">
                        {item.xnId || item.f1Id || item.item}
                      </TableCell>
                      <TableCell>
                        {editingItem === (item.id || item.item) ? (
                          <Input
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="w-32"
                          />
                        ) : (
                          item.xncLocal || item.f1cLocal || item.currentValue
                        )}
                      </TableCell>
                      {networkInfo.isTable && (
                        <>
                          <TableCell>{item.xncRemote || item.f1cRemote}</TableCell>
                          <TableCell>{item.xnuLocal || item.f1uLocal}</TableCell>
                          <TableCell>{item.xnuRemote || item.f1uRemote}</TableCell>
                        </>
                      )}
                      <TableCell>
                        {editingItem === (item.id || item.item) ? (
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={handleSaveEdit}
                              className="hover:bg-green-50 hover:border-green-300"
                            >
                              <CheckSquare className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={handleCancelEdit}
                              className="hover:bg-red-50 hover:border-red-300"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEdit(item)}
                            className="hover:bg-blue-50 hover:border-blue-300"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
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

export default NetworkDetails;