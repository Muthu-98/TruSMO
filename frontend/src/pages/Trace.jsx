import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../components/ui/select';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Plus, Edit, Trash2, Play, Square, Eye } from 'lucide-react';

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

const JOB_TYPE_OPTIONS = [
	{ label: 'TRACE', value: 'TRACE' },
	{ label: 'MDT', value: 'MDT' },
	{ label: 'TRACE_ONLY', value: 'TRACE_ONLY' },
];

const TRACE_REPORTING_FORMAT_OPTIONS = [
	{ label: 'FILE_BASED', value: 'FILE_BASED' },
	{ label: 'REAL_TIME', value: 'REAL_TIME' },
];

const TARGET_ID_TYPE_OPTIONS = [
	{ label: 'GNB', value: 'GNB' },
	{ label: 'GNB_CU_CP', value: 'GNB_CU_CP' },
	{ label: 'GNB_CU_UP', value: 'GNB_CU_UP' },
	{ label: 'GNB_DU', value: 'GNB_DU' },
];

const NE_TYPES = [
	{ label: 'EN_GNB', value: 'EN_GNB' },
	{ label: 'GNB_CU_CP', value: 'GNB_CU_CP' },
	{ label: 'GNB_CU_UP', value: 'GNB_CU_UP' },
	{ label: 'GNB_DU', value: 'GNB_DU' },
];

const TRACE_DEPTH_OPTIONS = [
	{ label: 'SHORT', value: 'SHORT' },
	{ label: 'MEDIUM', value: 'MEDIUM' },
	{ label: 'MAXIMUM', value: 'MAXIMUM' },
];

const EN_GNB_INTERFACES = [
	{ label: 'S1-MME', value: 'S1-MME' },
	{ label: 'X2', value: 'X2' },
	{ label: 'Uu', value: 'Uu' },
	{ label: 'F1-C', value: 'F1-C' },
	{ label: 'E1', value: 'E1' },
];

const GNB_CU_CP_INTERFACES = [
	{ label: 'NG-C', value: 'NG-C' },
	{ label: 'Xn-C', value: 'Xn-C' },
	{ label: 'Uu', value: 'Uu' },
	{ label: 'F1-C', value: 'F1-C' },
	{ label: 'E1', value: 'E1' },
	{ label: 'X2-C', value: 'X2-C' },
];

const GNB_CU_UP_INTERFACES = [
	{ label: 'E1', value: 'E1' },
];

const GNB_DU_INTERFACES = [
	{ label: 'F1-C', value: 'F1-C' },
];

// Mock trace jobs data with predefined configurations
const MOCK_TRACE_JOBS = [
	{
		id: 1,
		gnb_id: '1',
		job_id: '1',
		created_at: '2025-10-20 09:15:00',
		jobType: 'TRACE_ONLY',
		traceConfig: [
			{
				idx: '1',
				listOfNETypes: ['EN_GNB', 'GNB_CU_CP', 'GNB_CU_UP', 'GNB_DU'],
				traceDepth: 'MAXIMUM',
				listOfInterfaces: [
					{
						idx: 1,
						'en-gNBInterfaces': ['S1-MME', 'X2', 'Uu', 'F1-C', 'E1'],
					},
					{
						idx: 2,
						'gNB-CU-CPInterfaces': ['NG-C', 'Xn-C', 'Uu', 'F1-C', 'E1', 'X2-C'],
					},
					{
						idx: 3,
						'gNB-CU-UPInterfaces': ['E1'],
					},
					{
						idx: 4,
						'gNB-DUInterfaces': ['F1-C'],
					},
				],
			},
		],
		mdtConfig: {},
		isRunning: false,
	},
	{
		id: 2,
		gnb_id: '2',
		job_id: '2',
		created_at: '2025-10-20 09:30:00',
		jobType: 'MDT',
		traceConfig: [
			{
				idx: '1',
				listOfNETypes: ['GNB_CU_CP', 'GNB_DU'],
				traceDepth: 'MEDIUM',
				listOfInterfaces: [
					{
						idx: 1,
						'gNB-CU-CPInterfaces': ['NG-C', 'F1-C', 'E1'],
					},
					{
						idx: 2,
						'gNB-DUInterfaces': ['F1-C'],
					},
				],
			},
		],
		mdtConfig: {},
		isRunning: true,
	},
];

const PAGE_SIZE = 10;

const Trace = () => {
	const [traceJobs, setTraceJobs] = useState(MOCK_TRACE_JOBS);
	const [filters, setFilters] = useState({
		gnb_id: '',
		job_id: '',
		jobType: 'all',
		duration: '1h',
		customRange: null,
	});
	const [durationSelect, setDurationSelect] = useState(filters.duration || '1h');
	const [customStart, setCustomStart] = useState('');
	const [customEnd, setCustomEnd] = useState('');
	const [page, setPage] = useState(1);
	const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
	const [isTraceConfigOpen, setIsTraceConfigOpen] = useState(false);
	const [isMdtConfigOpen, setIsMdtConfigOpen] = useState(false);
	const [selectedJob, setSelectedJob] = useState(null);
	const [formData, setFormData] = useState({
		id: '',
		gnb_id: '',
		jobId: '',
		job_id: '',
		jobType: 'TRACE',
		traceReportingFormat: 'FILE_BASED',
		traceReference: [
			{
				idx: 1,
				mcc: '',
				mnc: '',
				traceId: '',
			}
		],
		pLMNTarget: [
			{
				mcc: '',
				mnc: '',
			}
		],
		traceTarget: [
			{
				targetIdType: 'GNB',
				targetIdValue: '',
			}
		],
		traceConfig: [
			{
				idx: '1',
				listOfNETypes: [],
				traceDepth: 'MAXIMUM',
				listOfInterfaces: [
					{ idx: 1, 'en-gNBInterfaces': [] },
					{ idx: 2, 'gNB-CU-CPInterfaces': [] },
					{ idx: 3, 'gNB-CU-UPInterfaces': [] },
					{ idx: 4, 'gNB-DUInterfaces': [] },
				],
			}
		],
	});

	const filteredData = traceJobs.filter(row => {
		return (
			(filters.gnb_id === '' || row.gnb_id.includes(filters.gnb_id)) &&
			(filters.job_id === '' || row.job_id.includes(filters.job_id)) &&
			(filters.jobType === 'all' || row.jobType === filters.jobType)
		);
	});

	const totalPages = Math.max(1, Math.ceil(filteredData.length / PAGE_SIZE));

	const handleFilterChange = (key, value) => {
		setFilters(f => ({ ...f, [key]: value }));
		setPage(1);
	};

	const handleDurationDropdown = value => {
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

	const handleAddJob = e => {
		e.preventDefault();
		const newJob = {
			id: formData.id || traceJobs.length + 1,
			gnb_id: formData.gnb_id,
			jobId: formData.jobId,
			job_id: formData.job_id,
			created_at: new Date().toLocaleString(),
			jobType: formData.jobType,
			traceReportingFormat: formData.traceReportingFormat,
			traceReference: formData.traceReference,
			pLMNTarget: formData.pLMNTarget,
			traceTarget: formData.traceTarget,
			traceConfig: formData.traceConfig,
			mdtConfig: {},
			isRunning: false,
		};
		setTraceJobs([...traceJobs, newJob]);
		setIsAddDialogOpen(false);
		resetForm();
	};

	const handleEditJob = job => {
		setSelectedJob(job);
		setFormData({
			id: job.id,
			gnb_id: job.gnb_id,
			jobId: job.jobId || '',
			job_id: job.job_id,
			jobType: job.jobType,
			traceReportingFormat: job.traceReportingFormat || 'FILE_BASED',
			traceReference: job.traceReference || [{ idx: 1, mcc: '', mnc: '', traceId: '' }],
			pLMNTarget: job.pLMNTarget || [{ mcc: '', mnc: '' }],
			traceTarget: job.traceTarget || [{ targetIdType: 'GNB', targetIdValue: '' }],
			traceConfig: job.traceConfig || [
				{
					idx: '1',
					listOfNETypes: [],
					traceDepth: 'MAXIMUM',
					listOfInterfaces: [
						{ idx: 1, 'en-gNBInterfaces': [] },
						{ idx: 2, 'gNB-CU-CPInterfaces': [] },
						{ idx: 3, 'gNB-CU-UPInterfaces': [] },
						{ idx: 4, 'gNB-DUInterfaces': [] },
					],
				}
			],
		});
		setIsEditDialogOpen(true);
	};

	const handleUpdateJob = e => {
		e.preventDefault();
		setTraceJobs(
			traceJobs.map(job =>
				job.id === selectedJob.id
					? {
							...job,
							gnb_id: formData.gnb_id,
							jobId: formData.jobId,
							job_id: formData.job_id,
							jobType: formData.jobType,
							traceReportingFormat: formData.traceReportingFormat,
							traceReference: formData.traceReference,
							pLMNTarget: formData.pLMNTarget,
							traceTarget: formData.traceTarget,
							traceConfig: formData.traceConfig,
					  }
					: job
			)
		);
		setIsEditDialogOpen(false);
		resetForm();
	};

	const handleDeleteJob = id => {
		setTraceJobs(traceJobs.filter(job => job.id !== id));
	};

	const handleToggleJob = id => {
		setTraceJobs(
			traceJobs.map(job => (job.id === id ? { ...job, isRunning: !job.isRunning } : job))
		);
	};

	const handleToggleAllJobs = () => {
		// If any job is not running, start all. Otherwise stop all.
		const anyStopped = traceJobs.some(job => !job.isRunning);
		setTraceJobs(traceJobs.map(job => ({ ...job, isRunning: anyStopped })));
	};

	const handleViewTraceConfig = job => {
		setSelectedJob(job);
		setIsTraceConfigOpen(true);
	};

	const handleViewMdtConfig = job => {
		setSelectedJob(job);
		setIsMdtConfigOpen(true);
	};

	const resetForm = () => {
		setFormData({
			id: '',
			gnb_id: '',
			jobId: '',
			job_id: '',
			jobType: 'TRACE',
			traceReportingFormat: 'FILE_BASED',
			traceReference: [{ idx: 1, mcc: '', mnc: '', traceId: '' }],
			pLMNTarget: [{ mcc: '', mnc: '' }],
			traceTarget: [{ targetIdType: 'GNB', targetIdValue: '' }],
			traceConfig: [
				{
					idx: '1',
					listOfNETypes: [],
					traceDepth: 'MAXIMUM',
					listOfInterfaces: [
						{ idx: 1, 'en-gNBInterfaces': [] },
						{ idx: 2, 'gNB-CU-CPInterfaces': [] },
						{ idx: 3, 'gNB-CU-UPInterfaces': [] },
						{ idx: 4, 'gNB-DUInterfaces': [] },
					],
				}
			],
		});
		setSelectedJob(null);
	};

	const columns = [
		{ key: 'gnb_id', label: 'gNB ID', minWidth: 'min-w-[100px]', filter: <Input className="w-full" placeholder="gNB ID" value={filters.gnb_id} onChange={e => handleFilterChange('gnb_id', e.target.value)} /> },
		{ key: 'job_id', label: 'Job ID', minWidth: 'min-w-[100px]', filter: <Input className="w-full" placeholder="Job ID" value={filters.job_id} onChange={e => handleFilterChange('job_id', e.target.value)} /> },
		{ key: 'created_at', label: 'Created At', minWidth: 'min-w-[170px]', filter: null },
		{ key: 'jobType', label: 'Job Type', minWidth: 'min-w-[120px]', filter: (
			<Select value={filters.jobType} onValueChange={v => handleFilterChange('jobType', v)}>
				<SelectTrigger className="w-full"><SelectValue placeholder="Type" /></SelectTrigger>
				<SelectContent>
					<SelectItem value="all">ALL</SelectItem>
					<SelectItem value="TRACE">TRACE</SelectItem>
					<SelectItem value="MDT">MDT</SelectItem>
				</SelectContent>
			</Select>
		) },
		{ key: 'traceConfig', label: 'Trace Config', minWidth: 'min-w-[120px]', filter: null },
		{ key: 'mdtConfig', label: 'MDT Config', minWidth: 'min-w-[120px]', filter: null },
		{ key: 'action', label: 'Actions', minWidth: 'min-w-[140px]', filter: null },
	];

	return (
		<div className="space-y-6">
			{/* Header */}
			<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
				<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
					<div>
						<h1 className="text-4xl font-bold text-gray-900 mb-1">Trace Jobs</h1>
						<p className="text-gray-600">Manage Trace and MDT Jobs</p>
					</div>
					<div className="flex items-center gap-2 flex-wrap">
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
							Add Trace Job
						</Button>
					</div>
				</div>
			</motion.div>

			{/* Start/Stop Controls Section */}
			<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
				<Card className="border-0 shadow-lg bg-white/90 backdrop-blur-md">
					<CardContent className="pt-6">
						<div className="flex items-center justify-between">
							<div>
								<h3 className="text-lg font-semibold text-gray-900 mb-1">Trace Controls</h3>
								<p className="text-sm text-gray-600">Start or Stop Trace</p>
							</div>
							<div className="flex items-center gap-3">
								{/* Single Start/Stop button controlling all jobs */}
								<Button
									size="lg"
									variant={traceJobs.some(j => !j.isRunning) ? 'default' : 'destructive'}
									onClick={handleToggleAllJobs}
									className="flex items-center gap-2"
								>
									{traceJobs.some(j => !j.isRunning) ? (
										<>
											<Play className="h-5 w-5" />
											Start Trace
										</>
									) : (
										<>
											<Square className="h-5 w-5" />
											Stop Trace
										</>
									)}
								</Button>
							</div>
						</div>
					</CardContent>
				</Card>
			</motion.div>

			{/* Table Section */}
			<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
				<Card className="border-0 shadow-xl bg-white/90 backdrop-blur-md">
					<CardHeader>
						<CardTitle className="text-xl font-bold text-gray-900">Trace Jobs Table</CardTitle>
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
												No Trace Jobs found
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
													<td className={`px-4 py-2 border-b border-gray-100 ${columns[3].minWidth} whitespace-nowrap`}>
														<Badge variant={row.jobType === 'TRACE' ? 'default' : 'secondary'}>
															{row.jobType}
														</Badge>
													</td>
													<td className={`px-4 py-2 border-b border-gray-100 ${columns[4].minWidth} whitespace-nowrap`}>
														<Button
															size="sm"
															variant="outline"
															className="hover:bg-blue-50"
															onClick={() => handleViewTraceConfig(row)}
														>
															<Eye className="h-4 w-4 mr-1" />
															View
														</Button>
													</td>
													<td className={`px-4 py-2 border-b border-gray-100 ${columns[5].minWidth} whitespace-nowrap`}>
														<Button
															size="sm"
															variant="outline"
															className="hover:bg-blue-50"
															onClick={() => handleViewMdtConfig(row)}
														>
															<Eye className="h-4 w-4 mr-1" />
															View
														</Button>
													</td>
													<td className={`px-4 py-2 border-b border-gray-100 ${columns[6].minWidth} whitespace-nowrap`}>
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

		{/* Add Trace Job Dialog */}
		<Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
			<DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>Add Trace Job</DialogTitle>
				</DialogHeader>
				<form onSubmit={handleAddJob} className="space-y-4">
					{/* Basic Information */}
					<div className="border rounded-lg p-4 bg-gray-50">
						<h3 className="font-semibold text-lg mb-4 text-gray-900">Basic Information</h3>
						<div className="grid grid-cols-2 gap-4">
							<div>
								<Label htmlFor="id">ID</Label>
								<Input id="id" value={formData.id} onChange={e => setFormData({ ...formData, id: e.target.value })} placeholder="e.g., TraceJob-001" />
							</div>
							<div>
								<Label htmlFor="jobId">Job ID</Label>
								<Input id="jobId" value={formData.jobId} onChange={e => setFormData({ ...formData, jobId: e.target.value })} placeholder="e.g., job-trace-001" />
							</div>
							<div>
								<Label htmlFor="gnb_id">gNB ID</Label>
								<Input id="gnb_id" value={formData.gnb_id} onChange={e => setFormData({ ...formData, gnb_id: e.target.value })} placeholder="GNB Serial Number" required />
							</div>
							<div>
								<Label htmlFor="job_id">Legacy Job ID</Label>
								<Input id="job_id" value={formData.job_id} onChange={e => setFormData({ ...formData, job_id: e.target.value })} placeholder="Legacy Job ID" required />
							</div>
						</div>
						<div className="grid grid-cols-2 gap-4 mt-4">
							<div>
								<Label htmlFor="jobType">Job Type</Label>
								<Select value={formData.jobType} onValueChange={v => setFormData({ ...formData, jobType: v })}>
									<SelectTrigger className="w-full"><SelectValue placeholder="Select Job Type" /></SelectTrigger>
									<SelectContent>
										{JOB_TYPE_OPTIONS.map(opt => (
											<SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
							<div>
								<Label htmlFor="traceReportingFormat">Trace Reporting Format</Label>
								<Select value={formData.traceReportingFormat} onValueChange={v => setFormData({ ...formData, traceReportingFormat: v })}>
									<SelectTrigger className="w-full"><SelectValue placeholder="Select Format" /></SelectTrigger>
									<SelectContent>
										{TRACE_REPORTING_FORMAT_OPTIONS.map(opt => (
											<SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						</div>
					</div>

					{/* Trace Reference */}
					<div className="border rounded-lg p-4 bg-gray-50">
						<h3 className="font-semibold text-lg mb-4 text-gray-900">Trace Reference</h3>
						{formData.traceReference && formData.traceReference.map((ref, idx) => (
							<div key={idx} className="grid grid-cols-3 gap-4 mb-4 pb-4 border-b last:border-b-0">
								<div>
									<Label htmlFor={`traceRef_mcc_${idx}`}>MCC</Label>
									<Input 
										id={`traceRef_mcc_${idx}`}
										value={ref.mcc} 
										onChange={e => {
											const newRefs = [...formData.traceReference];
											newRefs[idx].mcc = e.target.value;
											setFormData({ ...formData, traceReference: newRefs });
										}} 
										placeholder="e.g., 001"
									/>
								</div>
								<div>
									<Label htmlFor={`traceRef_mnc_${idx}`}>MNC</Label>
									<Input 
										id={`traceRef_mnc_${idx}`}
										value={ref.mnc} 
										onChange={e => {
											const newRefs = [...formData.traceReference];
											newRefs[idx].mnc = e.target.value;
											setFormData({ ...formData, traceReference: newRefs });
										}} 
										placeholder="e.g., 01"
									/>
								</div>
								<div>
									<Label htmlFor={`traceRef_traceId_${idx}`}>Trace ID</Label>
									<Input 
										id={`traceRef_traceId_${idx}`}
										value={ref.traceId} 
										onChange={e => {
											const newRefs = [...formData.traceReference];
											newRefs[idx].traceId = e.target.value;
											setFormData({ ...formData, traceReference: newRefs });
										}} 
										placeholder="e.g., ABC123"
									/>
								</div>
							</div>
						))}
					</div>

					{/* PLMN Target */}
					<div className="border rounded-lg p-4 bg-gray-50">
						<h3 className="font-semibold text-lg mb-4 text-gray-900">PLMN Target</h3>
						{formData.pLMNTarget && formData.pLMNTarget.map((target, idx) => (
							<div key={idx} className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b last:border-b-0">
								<div>
									<Label htmlFor={`plmn_mcc_${idx}`}>MCC</Label>
									<Input 
										id={`plmn_mcc_${idx}`}
										value={target.mcc} 
										onChange={e => {
											const newTargets = [...formData.pLMNTarget];
											newTargets[idx].mcc = e.target.value;
											setFormData({ ...formData, pLMNTarget: newTargets });
										}} 
										placeholder="e.g., 001"
									/>
								</div>
								<div>
									<Label htmlFor={`plmn_mnc_${idx}`}>MNC</Label>
									<Input 
										id={`plmn_mnc_${idx}`}
										value={target.mnc} 
										onChange={e => {
											const newTargets = [...formData.pLMNTarget];
											newTargets[idx].mnc = e.target.value;
											setFormData({ ...formData, pLMNTarget: newTargets });
										}} 
										placeholder="e.g., 01"
									/>
								</div>
							</div>
						))}
					</div>

					{/* Trace Target */}
					<div className="border rounded-lg p-4 bg-gray-50">
						<h3 className="font-semibold text-lg mb-4 text-gray-900">Trace Target</h3>
						{formData.traceTarget && formData.traceTarget.map((target, idx) => (
							<div key={idx} className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b last:border-b-0">
								<div>
									<Label htmlFor={`traceTarget_type_${idx}`}>Target ID Type</Label>
									<Select value={target.targetIdType} onValueChange={v => {
										const newTargets = [...formData.traceTarget];
										newTargets[idx].targetIdType = v;
										setFormData({ ...formData, traceTarget: newTargets });
									}}>
										<SelectTrigger className="w-full"><SelectValue placeholder="Select Type" /></SelectTrigger>
										<SelectContent>
											{TARGET_ID_TYPE_OPTIONS.map(opt => (
												<SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
								<div>
									<Label htmlFor={`traceTarget_value_${idx}`}>Target ID Value</Label>
									<Input 
										id={`traceTarget_value_${idx}`}
										value={target.targetIdValue} 
										onChange={e => {
											const newTargets = [...formData.traceTarget];
											newTargets[idx].targetIdValue = e.target.value;
											setFormData({ ...formData, traceTarget: newTargets });
										}} 
										placeholder="e.g., GNBSerialNumber"
									/>
								</div>
							</div>
						))}
					</div>

					{/* Trace Config */}
					<div className="border rounded-lg p-4 bg-gray-50">
						<h3 className="font-semibold text-lg mb-4 text-gray-900">Trace Configuration</h3>
						{formData.traceConfig && formData.traceConfig.map((config, configIdx) => (
							<div key={configIdx} className="space-y-4">
								{/* Trace Depth */}
								<div>
									<Label htmlFor={`traceDepth_${configIdx}`}>Trace Depth</Label>
									<Select value={config.traceDepth} onValueChange={v => {
										const newConfigs = [...formData.traceConfig];
										newConfigs[configIdx].traceDepth = v;
										setFormData({ ...formData, traceConfig: newConfigs });
									}}>
										<SelectTrigger className="w-full"><SelectValue placeholder="Select Depth" /></SelectTrigger>
										<SelectContent>
											{TRACE_DEPTH_OPTIONS.map(opt => (
												<SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>

								{/* List of NE Types */}
								<div>
									<Label>List of NE Types (Select Multiple)</Label>
									<div className="grid grid-cols-2 gap-2 mt-2">
										{NE_TYPES.map(neType => (
											<div key={neType.value} className="flex items-center space-x-2">
												<input 
													type="checkbox" 
													id={`neType_${configIdx}_${neType.value}`}
													checked={config.listOfNETypes.includes(neType.value)}
													onChange={e => {
														const newConfigs = [...formData.traceConfig];
														if (e.target.checked) {
															newConfigs[configIdx].listOfNETypes = [...newConfigs[configIdx].listOfNETypes, neType.value];
														} else {
															newConfigs[configIdx].listOfNETypes = newConfigs[configIdx].listOfNETypes.filter(n => n !== neType.value);
														}
														setFormData({ ...formData, traceConfig: newConfigs });
													}}
													className="rounded border-gray-300"
												/>
												<Label htmlFor={`neType_${configIdx}_${neType.value}`} className="cursor-pointer">{neType.label}</Label>
											</div>
										))}
									</div>
								</div>

								{/* Interfaces by NE Type */}
								<div className="border-t pt-4">
									<Label className="font-semibold text-gray-700 block mb-3">Interfaces by NE Type</Label>
									
									{/* EN_GNB Interfaces */}
									<div className="mb-4 pb-4 border-b">
										<Label className="block mb-2 font-medium">en-gNB Interfaces</Label>
										<div className="grid grid-cols-2 gap-2">
											{EN_GNB_INTERFACES.map(iface => (
												<div key={iface.value} className="flex items-center space-x-2">
													<input 
														type="checkbox" 
														id={`en_gnb_iface_${configIdx}_${iface.value}`}
														checked={config.listOfInterfaces[0] && config.listOfInterfaces[0]['en-gNBInterfaces']?.includes(iface.value) || false}
														onChange={e => {
															const newConfigs = [...formData.traceConfig];
															if (!newConfigs[configIdx].listOfInterfaces[0]) {
																newConfigs[configIdx].listOfInterfaces[0] = { idx: 1, 'en-gNBInterfaces': [] };
															}
															const interfaces = newConfigs[configIdx].listOfInterfaces[0]['en-gNBInterfaces'] || [];
															if (e.target.checked) {
																newConfigs[configIdx].listOfInterfaces[0]['en-gNBInterfaces'] = [...interfaces, iface.value];
															} else {
																newConfigs[configIdx].listOfInterfaces[0]['en-gNBInterfaces'] = interfaces.filter(i => i !== iface.value);
															}
															setFormData({ ...formData, traceConfig: newConfigs });
														}}
														className="rounded border-gray-300"
													/>
													<Label htmlFor={`en_gnb_iface_${configIdx}_${iface.value}`} className="cursor-pointer">{iface.label}</Label>
												</div>
											))}
										</div>
									</div>

									{/* GNB_CU_CP Interfaces */}
									<div className="mb-4 pb-4 border-b">
										<Label className="block mb-2 font-medium">gNB-CU-CP Interfaces</Label>
										<div className="grid grid-cols-2 gap-2">
											{GNB_CU_CP_INTERFACES.map(iface => (
												<div key={iface.value} className="flex items-center space-x-2">
													<input 
														type="checkbox" 
														id={`cu_cp_iface_${configIdx}_${iface.value}`}
														checked={config.listOfInterfaces[1] && config.listOfInterfaces[1]['gNB-CU-CPInterfaces']?.includes(iface.value) || false}
														onChange={e => {
															const newConfigs = [...formData.traceConfig];
															if (!newConfigs[configIdx].listOfInterfaces[1]) {
																newConfigs[configIdx].listOfInterfaces[1] = { idx: 2, 'gNB-CU-CPInterfaces': [] };
															}
															const interfaces = newConfigs[configIdx].listOfInterfaces[1]['gNB-CU-CPInterfaces'] || [];
															if (e.target.checked) {
																newConfigs[configIdx].listOfInterfaces[1]['gNB-CU-CPInterfaces'] = [...interfaces, iface.value];
															} else {
																newConfigs[configIdx].listOfInterfaces[1]['gNB-CU-CPInterfaces'] = interfaces.filter(i => i !== iface.value);
															}
															setFormData({ ...formData, traceConfig: newConfigs });
														}}
														className="rounded border-gray-300"
													/>
													<Label htmlFor={`cu_cp_iface_${configIdx}_${iface.value}`} className="cursor-pointer">{iface.label}</Label>
												</div>
											))}
										</div>
									</div>

									{/* GNB_CU_UP Interfaces */}
									<div className="mb-4 pb-4 border-b">
										<Label className="block mb-2 font-medium">gNB-CU-UP Interfaces</Label>
										<div className="grid grid-cols-2 gap-2">
											{GNB_CU_UP_INTERFACES.map(iface => (
												<div key={iface.value} className="flex items-center space-x-2">
													<input 
														type="checkbox" 
														id={`cu_up_iface_${configIdx}_${iface.value}`}
														checked={config.listOfInterfaces[2] && config.listOfInterfaces[2]['gNB-CU-UPInterfaces']?.includes(iface.value) || false}
														onChange={e => {
															const newConfigs = [...formData.traceConfig];
															if (!newConfigs[configIdx].listOfInterfaces[2]) {
																newConfigs[configIdx].listOfInterfaces[2] = { idx: 3, 'gNB-CU-UPInterfaces': [] };
															}
															const interfaces = newConfigs[configIdx].listOfInterfaces[2]['gNB-CU-UPInterfaces'] || [];
															if (e.target.checked) {
																newConfigs[configIdx].listOfInterfaces[2]['gNB-CU-UPInterfaces'] = [...interfaces, iface.value];
															} else {
																newConfigs[configIdx].listOfInterfaces[2]['gNB-CU-UPInterfaces'] = interfaces.filter(i => i !== iface.value);
															}
															setFormData({ ...formData, traceConfig: newConfigs });
														}}
														className="rounded border-gray-300"
													/>
													<Label htmlFor={`cu_up_iface_${configIdx}_${iface.value}`} className="cursor-pointer">{iface.label}</Label>
												</div>
											))}
										</div>
									</div>

									{/* GNB_DU Interfaces */}
									<div>
										<Label className="block mb-2 font-medium">gNB-DU Interfaces</Label>
										<div className="grid grid-cols-2 gap-2">
											{GNB_DU_INTERFACES.map(iface => (
												<div key={iface.value} className="flex items-center space-x-2">
													<input 
														type="checkbox" 
														id={`du_iface_${configIdx}_${iface.value}`}
														checked={config.listOfInterfaces[3] && config.listOfInterfaces[3]['gNB-DUInterfaces']?.includes(iface.value) || false}
														onChange={e => {
															const newConfigs = [...formData.traceConfig];
															if (!newConfigs[configIdx].listOfInterfaces[3]) {
																newConfigs[configIdx].listOfInterfaces[3] = { idx: 4, 'gNB-DUInterfaces': [] };
															}
															const interfaces = newConfigs[configIdx].listOfInterfaces[3]['gNB-DUInterfaces'] || [];
															if (e.target.checked) {
																newConfigs[configIdx].listOfInterfaces[3]['gNB-DUInterfaces'] = [...interfaces, iface.value];
															} else {
																newConfigs[configIdx].listOfInterfaces[3]['gNB-DUInterfaces'] = interfaces.filter(i => i !== iface.value);
															}
															setFormData({ ...formData, traceConfig: newConfigs });
														}}
														className="rounded border-gray-300"
													/>
													<Label htmlFor={`du_iface_${configIdx}_${iface.value}`} className="cursor-pointer">{iface.label}</Label>
												</div>
											))}
										</div>
									</div>
								</div>
							</div>
						))}
					</div>
				</form>
			</DialogContent>
		</Dialog>

		{/* Edit Trace Job Dialog */}
		<Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
			<DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>Edit Trace Job</DialogTitle>
				</DialogHeader>
				<form onSubmit={handleUpdateJob} className="space-y-4">
					{/* Basic Information */}
					<div className="border rounded-lg p-4 bg-gray-50">
						<h3 className="font-semibold text-lg mb-4 text-gray-900">Basic Information</h3>
						<div className="grid grid-cols-2 gap-4">
							<div>
								<Label htmlFor="edit_id">ID</Label>
								<Input id="edit_id" value={formData.id} onChange={e => setFormData({ ...formData, id: e.target.value })} placeholder="e.g., TraceJob-001" />
							</div>
							<div>
								<Label htmlFor="edit_jobId">Job ID</Label>
								<Input id="edit_jobId" value={formData.jobId} onChange={e => setFormData({ ...formData, jobId: e.target.value })} placeholder="e.g., job-trace-001" />
							</div>
							<div>
								<Label htmlFor="edit_gnb_id">gNB ID</Label>
								<Input id="edit_gnb_id" value={formData.gnb_id} onChange={e => setFormData({ ...formData, gnb_id: e.target.value })} required />
							</div>
							<div>
								<Label htmlFor="edit_job_id">Legacy Job ID</Label>
								<Input id="edit_job_id" value={formData.job_id} onChange={e => setFormData({ ...formData, job_id: e.target.value })} required />
							</div>
						</div>
						<div className="grid grid-cols-2 gap-4 mt-4">
							<div>
								<Label htmlFor="edit_jobType">Job Type</Label>
								<Select value={formData.jobType} onValueChange={v => setFormData({ ...formData, jobType: v })}>
									<SelectTrigger className="w-full"><SelectValue placeholder="Select Job Type" /></SelectTrigger>
									<SelectContent>
										{JOB_TYPE_OPTIONS.map(opt => (
											<SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
							<div>
								<Label htmlFor="edit_traceReportingFormat">Trace Reporting Format</Label>
								<Select value={formData.traceReportingFormat} onValueChange={v => setFormData({ ...formData, traceReportingFormat: v })}>
									<SelectTrigger className="w-full"><SelectValue placeholder="Select Format" /></SelectTrigger>
									<SelectContent>
										{TRACE_REPORTING_FORMAT_OPTIONS.map(opt => (
											<SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						</div>
					</div>

					{/* Trace Reference */}
					<div className="border rounded-lg p-4 bg-gray-50">
						<h3 className="font-semibold text-lg mb-4 text-gray-900">Trace Reference</h3>
						{formData.traceReference && formData.traceReference.map((ref, idx) => (
							<div key={idx} className="grid grid-cols-3 gap-4 mb-4 pb-4 border-b last:border-b-0">
								<div>
									<Label htmlFor={`edit_traceRef_mcc_${idx}`}>MCC</Label>
									<Input 
										id={`edit_traceRef_mcc_${idx}`}
										value={ref.mcc} 
										onChange={e => {
											const newRefs = [...formData.traceReference];
											newRefs[idx].mcc = e.target.value;
											setFormData({ ...formData, traceReference: newRefs });
										}} 
										placeholder="e.g., 001"
									/>
								</div>
								<div>
									<Label htmlFor={`edit_traceRef_mnc_${idx}`}>MNC</Label>
									<Input 
										id={`edit_traceRef_mnc_${idx}`}
										value={ref.mnc} 
										onChange={e => {
											const newRefs = [...formData.traceReference];
											newRefs[idx].mnc = e.target.value;
											setFormData({ ...formData, traceReference: newRefs });
										}} 
										placeholder="e.g., 01"
									/>
								</div>
								<div>
									<Label htmlFor={`edit_traceRef_traceId_${idx}`}>Trace ID</Label>
									<Input 
										id={`edit_traceRef_traceId_${idx}`}
										value={ref.traceId} 
										onChange={e => {
											const newRefs = [...formData.traceReference];
											newRefs[idx].traceId = e.target.value;
											setFormData({ ...formData, traceReference: newRefs });
										}} 
										placeholder="e.g., ABC123"
									/>
								</div>
							</div>
						))}
					</div>

					{/* PLMN Target */}
					<div className="border rounded-lg p-4 bg-gray-50">
						<h3 className="font-semibold text-lg mb-4 text-gray-900">PLMN Target</h3>
						{formData.pLMNTarget && formData.pLMNTarget.map((target, idx) => (
							<div key={idx} className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b last:border-b-0">
								<div>
									<Label htmlFor={`edit_plmn_mcc_${idx}`}>MCC</Label>
									<Input 
										id={`edit_plmn_mcc_${idx}`}
										value={target.mcc} 
										onChange={e => {
											const newTargets = [...formData.pLMNTarget];
											newTargets[idx].mcc = e.target.value;
											setFormData({ ...formData, pLMNTarget: newTargets });
										}} 
										placeholder="e.g., 001"
									/>
								</div>
								<div>
									<Label htmlFor={`edit_plmn_mnc_${idx}`}>MNC</Label>
									<Input 
										id={`edit_plmn_mnc_${idx}`}
										value={target.mnc} 
										onChange={e => {
											const newTargets = [...formData.pLMNTarget];
											newTargets[idx].mnc = e.target.value;
											setFormData({ ...formData, pLMNTarget: newTargets });
										}} 
										placeholder="e.g., 01"
									/>
								</div>
							</div>
						))}
					</div>

					{/* Trace Target */}
					<div className="border rounded-lg p-4 bg-gray-50">
						<h3 className="font-semibold text-lg mb-4 text-gray-900">Trace Target</h3>
						{formData.traceTarget && formData.traceTarget.map((target, idx) => (
							<div key={idx} className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b last:border-b-0">
								<div>
									<Label htmlFor={`edit_traceTarget_type_${idx}`}>Target ID Type</Label>
									<Select value={target.targetIdType} onValueChange={v => {
										const newTargets = [...formData.traceTarget];
										newTargets[idx].targetIdType = v;
										setFormData({ ...formData, traceTarget: newTargets });
									}}>
										<SelectTrigger className="w-full"><SelectValue placeholder="Select Type" /></SelectTrigger>
										<SelectContent>
											{TARGET_ID_TYPE_OPTIONS.map(opt => (
												<SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
								<div>
									<Label htmlFor={`edit_traceTarget_value_${idx}`}>Target ID Value</Label>
									<Input 
										id={`edit_traceTarget_value_${idx}`}
										value={target.targetIdValue} 
										onChange={e => {
											const newTargets = [...formData.traceTarget];
											newTargets[idx].targetIdValue = e.target.value;
											setFormData({ ...formData, traceTarget: newTargets });
										}} 
										placeholder="e.g., GNBSerialNumber"
									/>
								</div>
							</div>
						))}
					</div>

					{/* Trace Config */}
					<div className="border rounded-lg p-4 bg-gray-50">
						<h3 className="font-semibold text-lg mb-4 text-gray-900">Trace Configuration</h3>
						{formData.traceConfig && formData.traceConfig.map((config, configIdx) => (
							<div key={configIdx} className="space-y-4">
								{/* Trace Depth */}
								<div>
									<Label htmlFor={`edit_traceDepth_${configIdx}`}>Trace Depth</Label>
									<Select value={config.traceDepth} onValueChange={v => {
										const newConfigs = [...formData.traceConfig];
										newConfigs[configIdx].traceDepth = v;
										setFormData({ ...formData, traceConfig: newConfigs });
									}}>
										<SelectTrigger className="w-full"><SelectValue placeholder="Select Depth" /></SelectTrigger>
										<SelectContent>
											{TRACE_DEPTH_OPTIONS.map(opt => (
												<SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>

								{/* List of NE Types */}
								<div>
									<Label>List of NE Types (Select Multiple)</Label>
									<div className="grid grid-cols-2 gap-2 mt-2">
										{NE_TYPES.map(neType => (
											<div key={neType.value} className="flex items-center space-x-2">
												<input 
													type="checkbox" 
													id={`edit_neType_${configIdx}_${neType.value}`}
													checked={config.listOfNETypes.includes(neType.value)}
													onChange={e => {
														const newConfigs = [...formData.traceConfig];
														if (e.target.checked) {
															newConfigs[configIdx].listOfNETypes = [...newConfigs[configIdx].listOfNETypes, neType.value];
														} else {
															newConfigs[configIdx].listOfNETypes = newConfigs[configIdx].listOfNETypes.filter(n => n !== neType.value);
														}
														setFormData({ ...formData, traceConfig: newConfigs });
													}}
													className="rounded border-gray-300"
												/>
												<Label htmlFor={`edit_neType_${configIdx}_${neType.value}`} className="cursor-pointer">{neType.label}</Label>
											</div>
										))}
									</div>
								</div>

								{/* Interfaces by NE Type */}
								<div className="border-t pt-4">
									<Label className="font-semibold text-gray-700 block mb-3">Interfaces by NE Type</Label>
									
									{/* EN_GNB Interfaces */}
									<div className="mb-4 pb-4 border-b">
										<Label className="block mb-2 font-medium">en-gNB Interfaces</Label>
										<div className="grid grid-cols-2 gap-2">
											{EN_GNB_INTERFACES.map(iface => (
												<div key={iface.value} className="flex items-center space-x-2">
													<input 
														type="checkbox" 
														id={`edit_en_gnb_iface_${configIdx}_${iface.value}`}
														checked={config.listOfInterfaces[0] && config.listOfInterfaces[0]['en-gNBInterfaces']?.includes(iface.value) || false}
														onChange={e => {
															const newConfigs = [...formData.traceConfig];
															if (!newConfigs[configIdx].listOfInterfaces[0]) {
																newConfigs[configIdx].listOfInterfaces[0] = { idx: 1, 'en-gNBInterfaces': [] };
															}
															const interfaces = newConfigs[configIdx].listOfInterfaces[0]['en-gNBInterfaces'] || [];
															if (e.target.checked) {
																newConfigs[configIdx].listOfInterfaces[0]['en-gNBInterfaces'] = [...interfaces, iface.value];
															} else {
																newConfigs[configIdx].listOfInterfaces[0]['en-gNBInterfaces'] = interfaces.filter(i => i !== iface.value);
															}
															setFormData({ ...formData, traceConfig: newConfigs });
														}}
														className="rounded border-gray-300"
													/>
													<Label htmlFor={`edit_en_gnb_iface_${configIdx}_${iface.value}`} className="cursor-pointer">{iface.label}</Label>
												</div>
											))}
										</div>
									</div>

									{/* GNB_CU_CP Interfaces */}
									<div className="mb-4 pb-4 border-b">
										<Label className="block mb-2 font-medium">gNB-CU-CP Interfaces</Label>
										<div className="grid grid-cols-2 gap-2">
											{GNB_CU_CP_INTERFACES.map(iface => (
												<div key={iface.value} className="flex items-center space-x-2">
													<input 
														type="checkbox" 
														id={`edit_cu_cp_iface_${configIdx}_${iface.value}`}
														checked={config.listOfInterfaces[1] && config.listOfInterfaces[1]['gNB-CU-CPInterfaces']?.includes(iface.value) || false}
														onChange={e => {
															const newConfigs = [...formData.traceConfig];
															if (!newConfigs[configIdx].listOfInterfaces[1]) {
																newConfigs[configIdx].listOfInterfaces[1] = { idx: 2, 'gNB-CU-CPInterfaces': [] };
															}
															const interfaces = newConfigs[configIdx].listOfInterfaces[1]['gNB-CU-CPInterfaces'] || [];
															if (e.target.checked) {
																newConfigs[configIdx].listOfInterfaces[1]['gNB-CU-CPInterfaces'] = [...interfaces, iface.value];
															} else {
																newConfigs[configIdx].listOfInterfaces[1]['gNB-CU-CPInterfaces'] = interfaces.filter(i => i !== iface.value);
															}
															setFormData({ ...formData, traceConfig: newConfigs });
														}}
														className="rounded border-gray-300"
													/>
													<Label htmlFor={`edit_cu_cp_iface_${configIdx}_${iface.value}`} className="cursor-pointer">{iface.label}</Label>
												</div>
											))}
										</div>
									</div>

									{/* GNB_CU_UP Interfaces */}
									<div className="mb-4 pb-4 border-b">
										<Label className="block mb-2 font-medium">gNB-CU-UP Interfaces</Label>
										<div className="grid grid-cols-2 gap-2">
											{GNB_CU_UP_INTERFACES.map(iface => (
												<div key={iface.value} className="flex items-center space-x-2">
													<input 
														type="checkbox" 
														id={`edit_cu_up_iface_${configIdx}_${iface.value}`}
														checked={config.listOfInterfaces[2] && config.listOfInterfaces[2]['gNB-CU-UPInterfaces']?.includes(iface.value) || false}
														onChange={e => {
															const newConfigs = [...formData.traceConfig];
															if (!newConfigs[configIdx].listOfInterfaces[2]) {
																newConfigs[configIdx].listOfInterfaces[2] = { idx: 3, 'gNB-CU-UPInterfaces': [] };
															}
															const interfaces = newConfigs[configIdx].listOfInterfaces[2]['gNB-CU-UPInterfaces'] || [];
															if (e.target.checked) {
																newConfigs[configIdx].listOfInterfaces[2]['gNB-CU-UPInterfaces'] = [...interfaces, iface.value];
															} else {
																newConfigs[configIdx].listOfInterfaces[2]['gNB-CU-UPInterfaces'] = interfaces.filter(i => i !== iface.value);
															}
															setFormData({ ...formData, traceConfig: newConfigs });
														}}
														className="rounded border-gray-300"
													/>
													<Label htmlFor={`edit_cu_up_iface_${configIdx}_${iface.value}`} className="cursor-pointer">{iface.label}</Label>
												</div>
											))}
										</div>
									</div>

									{/* GNB_DU Interfaces */}
									<div>
										<Label className="block mb-2 font-medium">gNB-DU Interfaces</Label>
										<div className="grid grid-cols-2 gap-2">
											{GNB_DU_INTERFACES.map(iface => (
												<div key={iface.value} className="flex items-center space-x-2">
													<input 
														type="checkbox" 
														id={`edit_du_iface_${configIdx}_${iface.value}`}
														checked={config.listOfInterfaces[3] && config.listOfInterfaces[3]['gNB-DUInterfaces']?.includes(iface.value) || false}
														onChange={e => {
															const newConfigs = [...formData.traceConfig];
															if (!newConfigs[configIdx].listOfInterfaces[3]) {
																newConfigs[configIdx].listOfInterfaces[3] = { idx: 4, 'gNB-DUInterfaces': [] };
															}
															const interfaces = newConfigs[configIdx].listOfInterfaces[3]['gNB-DUInterfaces'] || [];
															if (e.target.checked) {
																newConfigs[configIdx].listOfInterfaces[3]['gNB-DUInterfaces'] = [...interfaces, iface.value];
															} else {
																newConfigs[configIdx].listOfInterfaces[3]['gNB-DUInterfaces'] = interfaces.filter(i => i !== iface.value);
															}
															setFormData({ ...formData, traceConfig: newConfigs });
														}}
														className="rounded border-gray-300"
													/>
													<Label htmlFor={`edit_du_iface_${configIdx}_${iface.value}`} className="cursor-pointer">{iface.label}</Label>
												</div>
											))}
										</div>
									</div>
								</div>
							</div>
						))}
					</div>
				</form>
			</DialogContent>
		</Dialog>

			{/* View Trace Config Dialog - Display Predefined Configuration */}
			<Dialog open={isTraceConfigOpen} onOpenChange={setIsTraceConfigOpen}>
				<DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
					<DialogHeader>
						<DialogTitle>Trace Configuration - Job {selectedJob?.job_id}</DialogTitle>
					</DialogHeader>

					{selectedJob?.traceConfig && selectedJob.traceConfig.length > 0 ? (
						<div className="space-y-6">
							{selectedJob.traceConfig.map((config, configIdx) => (
								<div key={configIdx} className="border rounded-lg p-4 bg-gray-50">
									<h3 className="font-semibold text-lg mb-4 text-gray-900">Configuration {config.idx}</h3>

									{/* List of NE Types */}
									<div className="mb-4">
										<Label className="font-semibold text-gray-700">List of NE Types</Label>
										<div className="flex flex-wrap gap-2 mt-2">
											{config.listOfNETypes && config.listOfNETypes.map((neType, idx) => (
												<Badge key={idx} variant="default" className="bg-blue-500">
													{neType}
												</Badge>
											))}
										</div>
									</div>

									{/* Trace Depth */}
									<div className="mb-4">
										<Label className="font-semibold text-gray-700">Trace Depth</Label>
										<Badge variant="secondary" className="mt-2 text-lg px-4 py-2">
											{config.traceDepth}
										</Badge>
									</div>

									{/* List of Interfaces by NE Type */}
									<div className="mb-4">
										<Label className="font-semibold text-gray-700 block mb-3">Interfaces by NE Type</Label>
										<div className="space-y-3">
											{config.listOfInterfaces && config.listOfInterfaces.map((interfaceGroup, groupIdx) => {
												const neTypeKey = Object.keys(interfaceGroup).find(key => key !== 'idx');
												return (
													<div key={groupIdx} className="bg-white border border-gray-200 rounded p-3">
														<h4 className="font-medium text-gray-800 mb-2">{neTypeKey}</h4>
														<div className="flex flex-wrap gap-2">
															{interfaceGroup[neTypeKey] && interfaceGroup[neTypeKey].map((iface, ifaceIdx) => (
																<Badge key={ifaceIdx} variant="outline" className="bg-green-50 text-green-700 border-green-200">
																	{iface}
																</Badge>
															))}
														</div>
													</div>
												);
											})}
										</div>
									</div>
								</div>
							))}
						</div>
					) : (
						<div className="text-center text-gray-500 py-8">
							<p>No trace configuration available for this job.</p>
						</div>
					)}

					<div className="flex justify-end pt-4 border-t">
						<Button variant="outline" onClick={() => setIsTraceConfigOpen(false)}>Close</Button>
					</div>
				</DialogContent>
			</Dialog>

			{/* View MDT Config Dialog */}
			<Dialog open={isMdtConfigOpen} onOpenChange={setIsMdtConfigOpen}>
				<DialogContent className="max-w-lg">
					<DialogHeader>
						<DialogTitle>MDT Configuration - Job {selectedJob?.job_id}</DialogTitle>
					</DialogHeader>
					<div className="space-y-4">
						<div className="text-center text-gray-500 py-8">
							<p>MDT Configuration is reserved for future use.</p>
						</div>
						<div className="flex justify-end pt-4">
							<Button variant="outline" onClick={() => setIsMdtConfigOpen(false)}>Close</Button>
						</div>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default Trace;