import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Table, TableHead, TableRow, TableCell, TableBody } from '../components/ui/table';
import { Input } from '../components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../components/ui/select';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Plus, Edit, Trash2, Play, Square } from 'lucide-react';

const DURATION_OPTIONS = [
	{ label: 'All', value: 'all' },
	{ label: '1 Minute', value: '1m' },
	{ label: '5 Minutes', value: '5m' },
	{ label: '10 Minutes', value: '10m' },
	{ label: '30 Minutes', value: '30m' },
	{ label: '1 Hour', value: '1h' },
	{ label: '12 Hours', value: '12h' },
	{ label: 'Custom', value: 'custom' },
];

// Mock PM Jobs data
const MOCK_PM_JOBS = [
	{
		id: 1,
		gnb_id: '1',
		job_id: '1',
		created_at: '2025-10-20 09:15:00',
		file_reporting_period: 600,
		granularity_period: 300,
		performance_metrics: ['UL-PRB-Usage'],
		operational_state: 'ENABLED',
		file_location: '/root/smo/performance/',
		object_instances: ['SubNetwork=1', 'ManagedElement=CU'],
		root_object_instances: ['ManagedElement=1'],
		isRunning: false,
	},
	{
		id: 2,
		gnb_id: '2',
		job_id: '2',
		created_at: '2025-10-20 09:30:00',
		file_reporting_period: 600,
		granularity_period: 300,
		performance_metrics: ['DL-PRB-Usage', 'CQI'],
		operational_state: 'ENABLED',
		file_location: '/root/smo/performance/',
		object_instances: ['SubNetwork=2', 'ManagedElement=DU'],
		root_object_instances: ['ManagedElement=2'],
		isRunning: true,
	},
	{
		id: 3,
		gnb_id: '3',
		job_id: '3',
		created_at: '2025-10-20 09:45:00',
		file_reporting_period: 300,
		granularity_period: 60,
		performance_metrics: ['RRC-Setup-Success-Rate'],
		operational_state: 'DISABLED',
		file_location: '/root/smo/performance/',
		object_instances: ['SubNetwork=3', 'ManagedElement=CU-CP'],
		root_object_instances: ['ManagedElement=3'],
		isRunning: false,
	},
];

const statusBadge = {
	completed: 'bg-green-100 text-green-700 border-green-200',
	failed: 'bg-red-100 text-red-700 border-red-200',
};

const PAGE_SIZE = 10;

const DeviceKPI = () => {
	const [pmJobs, setPmJobs] = useState(MOCK_PM_JOBS);
	const [filters, setFilters] = useState({
		gnb_id: '',
		job_id: '',
		performance_metrics: '',
		operational_state: 'all',
		duration: '1h',
		customRange: null,
	});
	const [durationSelect, setDurationSelect] = useState(filters.duration || '1h');
	const [customStart, setCustomStart] = useState('');
	const [customEnd, setCustomEnd] = useState('');
	const [page, setPage] = useState(1);
	const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
	const [selectedJob, setSelectedJob] = useState(null);
	const [formData, setFormData] = useState({
		gnb_id: '',
		job_id: '',
		file_reporting_period: 600,
		granularity_period: 300,
		performance_metrics: '',
		object_instances: '',
		root_object_instances: '',
		file_location: '/root/smo/performance/',
	});

	// Filtering logic (simple front-end filter for mock data)
	const filteredData = pmJobs.filter(row => {
		return (
			(filters.gnb_id === '' || row.gnb_id.includes(filters.gnb_id)) &&
			(filters.job_id === '' || row.job_id.includes(filters.job_id)) &&
			(filters.performance_metrics === '' || row.performance_metrics.some(m => m.toLowerCase().includes(filters.performance_metrics.toLowerCase()))) &&
			(filters.operational_state === 'all' || row.operational_state === filters.operational_state)
		);
	});

	const totalPages = Math.max(1, Math.ceil(filteredData.length / PAGE_SIZE));

	const handleFilterChange = (key, value) => {
		setFilters(f => ({ ...f, [key]: value }));
		setPage(1);
	};

	const handleDurationDropdown = (value) => {
		setDurationSelect(value);
		if (value !== 'custom') {
			setCustomStart('');
			setCustomEnd('');
			handleFilterChange('duration', value);
		}
	};

	const handleApplyDuration = () => {
		if (durationSelect === 'custom') {
			handleFilterChange('duration', 'custom');
			handleFilterChange('customRange', customStart && customEnd ? { start: customStart, end: customEnd } : null);
		} else {
			handleFilterChange('duration', durationSelect);
			handleFilterChange('customRange', null);
		}
		setPage(1);
	};

	const handleAddJob = (e) => {
		e.preventDefault();
		const newJob = {
			id: pmJobs.length + 1,
			gnb_id: formData.gnb_id,
			job_id: formData.job_id,
			created_at: new Date().toLocaleString(),
			file_reporting_period: Number(formData.file_reporting_period),
			granularity_period: Number(formData.granularity_period),
			performance_metrics: formData.performance_metrics.split(',').map(m => m.trim()),
			operational_state: 'ENABLED',
			file_location: formData.file_location,
			object_instances: formData.object_instances.split(',').map(o => o.trim()),
			root_object_instances: formData.root_object_instances.split(',').map(r => r.trim()),
			isRunning: false,
		};
		setPmJobs([...pmJobs, newJob]);
		setIsAddDialogOpen(false);
		resetForm();
	};

	const handleEditJob = (job) => {
		setSelectedJob(job);
		setFormData({
			gnb_id: job.gnb_id,
			job_id: job.job_id,
			file_reporting_period: job.file_reporting_period,
			granularity_period: job.granularity_period,
			performance_metrics: job.performance_metrics.join(', '),
			object_instances: job.object_instances.join(', '),
			root_object_instances: job.root_object_instances.join(', '),
			file_location: job.file_location,
		});
		setIsEditDialogOpen(true);
	};

	const handleUpdateJob = (e) => {
		e.preventDefault();
		setPmJobs(pmJobs.map(job =>
			job.id === selectedJob.id
				? {
						...job,
						gnb_id: formData.gnb_id,
						job_id: formData.job_id,
						file_reporting_period: Number(formData.file_reporting_period),
						granularity_period: Number(formData.granularity_period),
						performance_metrics: formData.performance_metrics.split(',').map(m => m.trim()),
						file_location: formData.file_location,
						object_instances: formData.object_instances.split(',').map(o => o.trim()),
						root_object_instances: formData.root_object_instances.split(',').map(r => r.trim()),
				  }
				: job
		));
		setIsEditDialogOpen(false);
		resetForm();
	};

	const handleDeleteJob = (id) => {
		setPmJobs(pmJobs.filter(job => job.id !== id));
	};

	const handleToggleJob = (id) => {
		setPmJobs(pmJobs.map(job =>
			job.id === id ? { ...job, isRunning: !job.isRunning } : job
		));
	};

	const resetForm = () => {
		setFormData({
			gnb_id: '',
			job_id: '',
			file_reporting_period: 600,
			granularity_period: 300,
			performance_metrics: '',
			object_instances: '',
			root_object_instances: '',
			file_location: '/root/smo/performance/',
		});
		setSelectedJob(null);
	};

	const columns = [
		{ key: 'gnb_id', label: 'gNB ID', minWidth: 'min-w-[100px]', filter: <Input className="w-full" placeholder="gNB ID" value={filters.gnb_id} onChange={e => handleFilterChange('gnb_id', e.target.value)} /> },
		{ key: 'job_id', label: 'Job ID', minWidth: 'min-w-[100px]', filter: <Input className="w-full" placeholder="Job ID" value={filters.job_id} onChange={e => handleFilterChange('job_id', e.target.value)} /> },
		{ key: 'created_at', label: 'Created At', minWidth: 'min-w-[170px]', filter: null },
		{ key: 'file_reporting_period', label: 'File Reporting Period', minWidth: 'min-w-[150px]', filter: null },
		{ key: 'granularity_period', label: 'Granularity Period', minWidth: 'min-w-[150px]', filter: null },
		{ key: 'performance_metrics', label: 'Performance Metrics', minWidth: 'min-w-[200px]', filter: <Input className="w-full" placeholder="Metrics" value={filters.performance_metrics} onChange={e => handleFilterChange('performance_metrics', e.target.value)} /> },
		{ key: 'operational_state', label: 'Operational State', minWidth: 'min-w-[140px]', filter: (
			<Select value={filters.operational_state} onValueChange={v => handleFilterChange('operational_state', v)}>
				<SelectTrigger className="w-full"><SelectValue placeholder="State" /></SelectTrigger>
				<SelectContent>
					<SelectItem value="all">ALL</SelectItem>
					<SelectItem value="ENABLED">ENABLED</SelectItem>
					<SelectItem value="DISABLED">DISABLED</SelectItem>
				</SelectContent>
			</Select>
		) },
		{ key: 'startStop', label: 'Start/Stop', minWidth: 'min-w-[120px]', filter: null },
		{ key: 'action', label: 'Action', minWidth: 'min-w-[140px]', filter: null },
	];

	return (
		<div className="space-y-6">
			{/* Header */}
			<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
				<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
					<div>
						<h1 className="text-4xl font-bold text-gray-900 mb-1">PM Jobs</h1>
						<p className="text-gray-600">Manage Performance Monitoring Jobs</p>
					</div>
					<div className="flex items-center gap-2">
						<span className="font-medium text-gray-700">Duration</span>
						<Select value={durationSelect} onValueChange={handleDurationDropdown}>
							<SelectTrigger className="w-44">
								<SelectValue placeholder="Duration" />
							</SelectTrigger>
							<SelectContent>
								{DURATION_OPTIONS.map(opt => (
									<SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
								))}
							</SelectContent>
						</Select>
						{durationSelect === 'custom' && (
							<div className="flex items-center gap-2 ml-2">
								<Input type="datetime-local" value={customStart} onChange={e => setCustomStart(e.target.value)} className="w-44" />
								<span className="mx-1 text-gray-500">to</span>
								<Input type="datetime-local" value={customEnd} onChange={e => setCustomEnd(e.target.value)} className="w-44" />
							</div>
						)}
						<Button onClick={handleApplyDuration}>Apply</Button>
						<Button
							className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
							onClick={() => setIsAddDialogOpen(true)}
						>
							<Plus className="h-4 w-4 mr-2" />
							Add PM Job
						</Button>
					</div>
				</div>
			</motion.div>

			{/* Table Section */}
			<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
				<Card className="border-0 shadow-xl bg-white/90 backdrop-blur-md">
					<CardHeader>
						<CardTitle className="text-xl font-bold text-gray-900">PM Jobs Table</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="overflow-x-auto">
							<table className="min-w-full table-fixed mb-2 border border-gray-200">
								<thead>
									<tr>
										{columns.map(col => (
											<th
												key={col.key}
												className={`px-4 py-2 text-xs font-semibold text-gray-600 text-left ${col.minWidth} whitespace-nowrap border-b border-gray-200`}
											>
												{col.label}
											</th>
										))}
									</tr>
									<tr>
										{columns.map(col => (
											<td key={col.key} className={`px-4 py-2 align-top ${col.minWidth} whitespace-nowrap border-b border-gray-100`}>
												{col.filter}
											</td>
										))}
									</tr>
								</thead>
								<tbody>
									{filteredData.length === 0 ? (
										<tr>
											<td colSpan={columns.length} className="text-center text-gray-400 py-4">
												No PM Jobs found
											</td>
										</tr>
									) : (
										filteredData
											.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
											.map((row, idx) => (
												<tr key={row.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
													<td className={`px-4 py-2 border-b border-gray-100 ${columns[0].minWidth} whitespace-nowrap`}>{row.gnb_id}</td>
													<td className={`px-4 py-2 border-b border-gray-100 ${columns[1].minWidth} whitespace-nowrap`}>{row.job_id}</td>
													<td className={`px-4 py-2 border-b border-gray-100 ${columns[2].minWidth} whitespace-nowrap`}>{row.created_at}</td>
													<td className={`px-4 py-2 border-b border-gray-100 ${columns[3].minWidth} whitespace-nowrap`}>{row.file_reporting_period}</td>
													<td className={`px-4 py-2 border-b border-gray-100 ${columns[4].minWidth} whitespace-nowrap`}>{row.granularity_period}</td>
													<td className={`px-4 py-2 border-b border-gray-100 ${columns[5].minWidth} whitespace-nowrap`}>{row.performance_metrics.join(', ')}</td>
													<td className={`px-4 py-2 border-b border-gray-100 ${columns[6].minWidth} whitespace-nowrap`}>
														<Badge variant={row.operational_state === 'ENABLED' ? 'default' : 'secondary'}>
															{row.operational_state}
														</Badge>
													</td>
													<td className={`px-4 py-2 border-b border-gray-100 ${columns[7].minWidth} whitespace-nowrap`}>
														<Button
															size="sm"
															variant={row.isRunning ? 'destructive' : 'default'}
															onClick={() => handleToggleJob(row.id)}
															className="flex items-center gap-1"
														>
															{row.isRunning ? <Square className="h-4 w-4" /> : <Play className="h-4 w-4" />}
															{row.isRunning ? 'Stop' : 'Start'}
														</Button>
													</td>
													<td className={`px-4 py-2 border-b border-gray-100 ${columns[8].minWidth} whitespace-nowrap`}>
														<div className="flex space-x-2">
															<Button
																size="sm"
																variant="outline"
																className="hover:bg-blue-50"
																onClick={() => handleEditJob(row)}
															>
																<Edit className="h-4 w-4" />
															</Button>
															<Button
																size="sm"
																variant="outline"
																className="hover:bg-red-50 hover:text-red-600"
																onClick={() => handleDeleteJob(row.id)}
															>
																<Trash2 className="h-4 w-4" />
															</Button>
														</div>
													</td>
												</tr>
											))
									)}
								</tbody>
							</table>
						</div>

						{/* Pagination */}
						<div className="flex justify-between items-center gap-2 mt-4">
							<div className="flex items-center gap-2">
								<Button disabled={page === 1} variant="outline" onClick={() => setPage(p => Math.max(1, p - 1))}>Prev</Button>
								<span className="text-sm">{page} / {totalPages}</span>
								<Button disabled={page === totalPages || filteredData.length === 0} variant="outline" onClick={() => setPage(p => Math.min(totalPages, p + 1))}>Next</Button>
							</div>
							<div className="text-sm text-gray-600">Showing {Math.min(filteredData.length, page * PAGE_SIZE)} of {filteredData.length}</div>
						</div>
					</CardContent>
				</Card>
			</motion.div>

			{/* Add PM Job Dialog */}
			<Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
				<DialogContent className="max-w-lg">
					<DialogHeader>
						<DialogTitle>Add PM Job</DialogTitle>
					</DialogHeader>
					<form onSubmit={handleAddJob} className="space-y-4">
						<div>
							<Label htmlFor="gnb_id">gNB ID</Label>
							<Input id="gnb_id" value={formData.gnb_id} onChange={e => setFormData({ ...formData, gnb_id: e.target.value })} required />
						</div>
						<div>
							<Label htmlFor="job_id">Job ID</Label>
							<Input id="job_id" value={formData.job_id} onChange={e => setFormData({ ...formData, job_id: e.target.value })} required />
						</div>
						<div>
							<Label htmlFor="file_reporting_period">File Reporting Period</Label>
							<Input id="file_reporting_period" type="number" value={formData.file_reporting_period} onChange={e => setFormData({ ...formData, file_reporting_period: e.target.value })} />
						</div>
						<div>
							<Label htmlFor="granularity_period">Granularity Period</Label>
							<Input id="granularity_period" type="number" value={formData.granularity_period} onChange={e => setFormData({ ...formData, granularity_period: e.target.value })} />
						</div>
						<div>
							<Label htmlFor="performance_metrics">Performance Metrics (comma-separated)</Label>
							<Input id="performance_metrics" placeholder="UL-PRB-Usage, DL-PRB-Usage" value={formData.performance_metrics} onChange={e => setFormData({ ...formData, performance_metrics: e.target.value })} required />
						</div>
						<div>
							<Label htmlFor="object_instances">Object Instances (comma-separated)</Label>
							<Input id="object_instances" placeholder="SubNetwork=1, ManagedElement=CU" value={formData.object_instances} onChange={e => setFormData({ ...formData, object_instances: e.target.value })} />
						</div>
						<div>
							<Label htmlFor="root_object_instances">Root Object Instances (comma-separated)</Label>
							<Input id="root_object_instances" placeholder="ManagedElement=1" value={formData.root_object_instances} onChange={e => setFormData({ ...formData, root_object_instances: e.target.value })} />
						</div>
						<div>
							<Label htmlFor="file_location">File Location</Label>
							<Input id="file_location" value={formData.file_location} onChange={e => setFormData({ ...formData, file_location: e.target.value })} />
						</div>
						<div className="flex justify-end space-x-2 pt-4">
							<Button type="button" variant="outline" onClick={() => { setIsAddDialogOpen(false); resetForm(); }}>Cancel</Button>
							<Button type="submit" className="bg-gradient-to-r from-green-500 to-green-600">Add</Button>
						</div>
					</form>
				</DialogContent>
			</Dialog>

			{/* Edit PM Job Dialog */}
			<Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
				<DialogContent className="max-w-lg">
					<DialogHeader>
						<DialogTitle>Edit PM Job</DialogTitle>
					</DialogHeader>
					<form onSubmit={handleUpdateJob} className="space-y-4">
						<div>
							<Label htmlFor="edit_gnb_id">gNB ID</Label>
							<Input id="edit_gnb_id" value={formData.gnb_id} onChange={e => setFormData({ ...formData, gnb_id: e.target.value })} required />
						</div>
						<div>
							<Label htmlFor="edit_job_id">Job ID</Label>
							<Input id="edit_job_id" value={formData.job_id} onChange={e => setFormData({ ...formData, job_id: e.target.value })} required />
						</div>
						<div>
							<Label htmlFor="edit_file_reporting_period">File Reporting Period</Label>
							<Input id="edit_file_reporting_period" type="number" value={formData.file_reporting_period} onChange={e => setFormData({ ...formData, file_reporting_period: e.target.value })} />
						</div>
						<div>
							<Label htmlFor="edit_granularity_period">Granularity Period</Label>
							<Input id="edit_granularity_period" type="number" value={formData.granularity_period} onChange={e => setFormData({ ...formData, granularity_period: e.target.value })} />
						</div>
						<div>
							<Label htmlFor="edit_performance_metrics">Performance Metrics (comma-separated)</Label>
							<Input id="edit_performance_metrics" value={formData.performance_metrics} onChange={e => setFormData({ ...formData, performance_metrics: e.target.value })} required />
						</div>
						<div>
							<Label htmlFor="edit_object_instances">Object Instances (comma-separated)</Label>
							<Input id="edit_object_instances" value={formData.object_instances} onChange={e => setFormData({ ...formData, object_instances: e.target.value })} />
						</div>
						<div>
							<Label htmlFor="edit_root_object_instances">Root Object Instances (comma-separated)</Label>
							<Input id="edit_root_object_instances" value={formData.root_object_instances} onChange={e => setFormData({ ...formData, root_object_instances: e.target.value })} />
						</div>
						<div>
							<Label htmlFor="edit_file_location">File Location</Label>
							<Input id="edit_file_location" value={formData.file_location} onChange={e => setFormData({ ...formData, file_location: e.target.value })} />
						</div>
						<div className="flex justify-end space-x-2 pt-4">
							<Button type="button" variant="outline" onClick={() => { setIsEditDialogOpen(false); resetForm(); }}>Cancel</Button>
							<Button type="submit" className="bg-gradient-to-r from-blue-500 to-blue-600">Update</Button>
						</div>
					</form>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default DeviceKPI;