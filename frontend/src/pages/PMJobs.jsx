import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Plus, Edit, Trash2, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { useToast } from '../hooks/use-toast';
import { Badge } from '../components/ui/badge'; // If you use Badge for status

// Mock GNB and PM Jobs data
const gnbDetails = {
  name: 'BLR-GNB-01',
  id: 'GNB001',
  vendor: 'Nokia',
  location: 'Bangalore'
};

const initialPMJobs = [
  {
    job_id: '1',
    performance_metrics: ['UL-PRB-Usage'],
    file_location: '/root/smo/performance/',
    granularity_period: 300,
    file_reporting_period: 600,
    object_instances: ['SubNetwork=1', 'ManagedElement=CU'],
    root_object_instances: ['ManagedElement=1'],
    operational_state: 'ENABLED'
  }
];

const defaultForm = {
  job_id: '',
  performance_metrics: '',
  file_location: '/root/smo/performance/',
  granularity_period: 300,
  file_reporting_period: 600,
  object_instances: '',
  root_object_instances: ''
};

const COLUMN_OPTIONS = [
  { key: 'job_id', label: 'Job ID' },
  { key: 'performance_metrics', label: 'Performance Metrics' },
  { key: 'file_location', label: 'File Location' },
  { key: 'granularity_period', label: 'Granularity Period' },
  { key: 'file_reporting_period', label: 'File Reporting Period' },
  { key: 'object_instances', label: 'Object Instances' },
  { key: 'root_object_instances', label: 'Root Object Instances' },
  { key: 'operational_state', label: 'Operational State' }
];

const PMJobs = () => {
  const { gnbId } = useParams();
  const [pmJobs, setPmJobs] = useState(initialPMJobs);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState(defaultForm);
  const [editIndex, setEditIndex] = useState(null);
  const { toast } = useToast();

  // Column selector state
  const [visibleColumns, setVisibleColumns] = useState(
    COLUMN_OPTIONS.map(col => col.key)
  );
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  // Handle input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Open Add dialog
  const openAddDialog = () => {
    setFormData(defaultForm);
    setIsEdit(false);
    setIsDialogOpen(true);
  };

  // Open Edit dialog
  const openEditDialog = (job, idx) => {
    setFormData({
      job_id: job.job_id,
      performance_metrics: job.performance_metrics.join(','),
      file_location: job.file_location,
      granularity_period: job.granularity_period,
      file_reporting_period: job.file_reporting_period,
      object_instances: job.object_instances.join(','),
      root_object_instances: job.root_object_instances.join(',')
    });
    setEditIndex(idx);
    setIsEdit(true);
    setIsDialogOpen(true);
  };

  // Add or Edit submit
  const handleSubmit = (e) => {
    e.preventDefault();
    const newJob = {
      job_id: formData.job_id,
      performance_metrics: formData.performance_metrics.split(',').map(s => s.trim()),
      file_location: formData.file_location,
      granularity_period: Number(formData.granularity_period),
      file_reporting_period: Number(formData.file_reporting_period),
      object_instances: formData.object_instances.split(',').map(s => s.trim()),
      root_object_instances: formData.root_object_instances.split(',').map(s => s.trim()),
      operational_state: isEdit ? pmJobs[editIndex].operational_state : 'ENABLED'
    };
    if (isEdit) {
      setPmJobs(prev => prev.map((job, idx) => idx === editIndex ? newJob : job));
      toast({ title: "PM Job Updated", description: "PM Job updated successfully." });
    } else {
      setPmJobs(prev => [...prev, newJob]);
      toast({ title: "PM Job Added", description: "New PM Job added successfully." });
    }
    setIsDialogOpen(false);
  };

  // Delete PM Job
  const handleDelete = (idx) => {
    setPmJobs(prev => prev.filter((_, i) => i !== idx));
    toast({ title: "PM Job Deleted", description: "PM Job deleted successfully." });
  };

  // Toggle column visibility
  const handleColumnToggle = (key) => {
    setVisibleColumns(prev =>
      prev.includes(key)
        ? prev.filter(col => col !== key)
        : [...prev, key]
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Heading and Device Info */}
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
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Available PM Jobs</h1>
          <p className="text-gray-600 text-lg">
            Device: {gnbDetails.name} ({gnbDetails.id})
          </p>
        </div>
      </motion.div>

      {/* Device Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-600">gNB Details</h3>
                <p className="text-lg font-semibold text-gray-900">{gnbDetails.name}</p>
                <p className="text-sm text-gray-500">{gnbDetails.id}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-600">Vendor</h3>
                <p className="text-lg font-semibold text-blue-600">{gnbDetails.vendor}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-600">Location</h3>
                <p className="text-lg font-semibold text-green-600">{gnbDetails.location}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-600">Total PM Jobs</h3>
                <p className="text-lg font-semibold text-purple-600">{pmJobs.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Page Title and Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CardTitle className="text-xl font-bold text-gray-900">
                  PM Jobs
                </CardTitle>
              </div>
              <div className="flex items-center space-x-2">
                <div className="relative" ref={dropdownRef}>
                  <Button
                    variant="outline"
                    size="sm"
                    aria-label="View Columns"
                    className="flex items-center gap-1"
                    onClick={() => setDropdownOpen((open) => !open)}
                  >
                    <Eye className="h-4 w-4" />
                    <span className="ml-1">View Columns</span>
                  </Button>
                  {dropdownOpen && (
                    <div className="absolute z-10 mt-2 right-0 w-56 bg-white border rounded shadow-lg p-2">
                      <div className="font-semibold mb-2 text-gray-700 text-sm px-2">Show Columns</div>
                      {COLUMN_OPTIONS.map(col => (
                        <label key={col.key} className="flex items-center px-2 py-1 cursor-pointer hover:bg-gray-50 rounded">
                          <input
                            type="checkbox"
                            checked={visibleColumns.includes(col.key)}
                            onChange={() => setVisibleColumns(prev =>
                              prev.includes(col.key)
                                ? prev.filter(c => c !== col.key)
                                : [...prev, col.key]
                            )}
                            className="mr-2"
                          />
                          {col.label}
                        </label>
                      ))}
                    </div>
                  )}
                </div>
                <Button 
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
                  onClick={openAddDialog}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add PM Job
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    {COLUMN_OPTIONS.filter(col => visibleColumns.includes(col.key)).map(col => (
                      <TableHead key={col.key}>{col.label}</TableHead>
                    ))}
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pmJobs.map((job, idx) => (
                    <motion.tr
                      key={job.job_id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: idx * 0.1 }}
                    >
                      {visibleColumns.includes('job_id') && (
                        <TableCell className="font-medium">{job.job_id}</TableCell>
                      )}
                      {visibleColumns.includes('performance_metrics') && (
                        <TableCell>{job.performance_metrics.join(', ')}</TableCell>
                      )}
                      {visibleColumns.includes('file_location') && (
                        <TableCell>{job.file_location}</TableCell>
                      )}
                      {visibleColumns.includes('granularity_period') && (
                        <TableCell>{job.granularity_period}</TableCell>
                      )}
                      {visibleColumns.includes('file_reporting_period') && (
                        <TableCell>{job.file_reporting_period}</TableCell>
                      )}
                      {visibleColumns.includes('object_instances') && (
                        <TableCell>{job.object_instances.join(', ')}</TableCell>
                      )}
                      {visibleColumns.includes('root_object_instances') && (
                        <TableCell>{job.root_object_instances.join(', ')}</TableCell>
                      )}
                      {visibleColumns.includes('operational_state') && (
                        <TableCell>
                          <Badge variant={job.operational_state === 'ENABLED' ? "default" : "secondary"}>
                            {job.operational_state}
                          </Badge>
                        </TableCell>
                      )}
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="hover:bg-blue-50 hover:border-blue-300"
                            onClick={() => openEditDialog(job, idx)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDelete(idx)}
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{isEdit ? 'Edit PM Job' : 'Add New PM Job'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="job_id">Job ID</Label>
              <Input
                id="job_id"
                value={formData.job_id}
                onChange={(e) => handleInputChange('job_id', e.target.value)}
                placeholder="e.g., 2"
                required
                disabled={isEdit}
              />
            </div>
            <div>
              <Label htmlFor="performance_metrics">Performance Metrics</Label>
              <Input
                id="performance_metrics"
                value={formData.performance_metrics}
                onChange={(e) => handleInputChange('performance_metrics', e.target.value)}
                placeholder="e.g., UL-PRB-Usage, DL-PRB-Usage"
                required
              />
            </div>
            <div>
              <Label htmlFor="file_location">File Location</Label>
              <Input
                id="file_location"
                value={formData.file_location}
                onChange={(e) => handleInputChange('file_location', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="granularity_period">Granularity Period</Label>
              <Input
                id="granularity_period"
                type="number"
                value={formData.granularity_period}
                onChange={(e) => handleInputChange('granularity_period', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="file_reporting_period">File Reporting Period</Label>
              <Input
                id="file_reporting_period"
                type="number"
                value={formData.file_reporting_period}
                onChange={(e) => handleInputChange('file_reporting_period', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="object_instances">Object Instances</Label>
              <Input
                id="object_instances"
                value={formData.object_instances}
                onChange={(e) => handleInputChange('object_instances', e.target.value)}
                placeholder="e.g., SubNetwork=1, ManagedElement=CU"
                required
              />
            </div>
            <div>
              <Label htmlFor="root_object_instances">Root Object Instances</Label>
              <Input
                id="root_object_instances"
                value={formData.root_object_instances}
                onChange={(e) => handleInputChange('root_object_instances', e.target.value)}
                placeholder="e.g., ManagedElement=1"
                required
              />
            </div>
            {isEdit && (
              <div>
                <Label>Operational State</Label>
                <Input value="ENABLED" readOnly className="bg-gray-100" />
              </div>
            )}
            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700">
                {isEdit ? 'Update PM Job' : 'Add PM Job'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PMJobs;