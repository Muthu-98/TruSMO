import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Table, TableHead, TableRow, TableCell, TableBody } from '../components/ui/table';
import { Input } from '../components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../components/ui/select';
import { Badge } from '../components/ui/badge';

// Mock duration and status options
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

const TRACE_STATUS = [
	{ label: 'ALL', value: 'all' },
	{ label: 'COMPLETED', value: 'completed' },
	{ label: 'FAILED', value: 'failed' },
];

// Mock trace data
const MOCK_TRACE_DATA = [
	{
		id: 1,
		gnb: 'TRU009',
		dateTime: '2025-04-07 14:20:00',
		traceFile: 'D20251015.0810+0000-0811+0000_-1_Truminds-5G-S6-.xml',
		traceStatus: 'completed',
		reason: '',
	},
	{
		id: 2,
		gnb: 'TRU010',
		dateTime: '2025-04-07 14:25:00',
		traceFile: 'B20251015.0810+0000-0811+0000_-1_Truminds-5G-S6-.xml',
		traceStatus: 'failed',
		reason: 'File not found',
	},
	{
		id: 3,
		gnb: 'TRU011',
		dateTime: '2025-04-07 14:30:00',
		traceFile: 'A20251015.0810+0000-0811+0000_-1_Truminds-5G-S6-.xml',
		traceStatus: 'completed',
		reason: '',
	},
	{
		id: 4,
		gnb: 'TRU012',
		dateTime: '2025-04-07 14:35:00',
		traceFile: 'C20251015.0810+0000-0811+0000_-1_Truminds-5G-S6-.xml',
		traceStatus: 'failed',
		reason: 'Timeout error',
	},
];

const statusBadge = {
	completed: 'bg-green-100 text-green-700 border-green-200',
	failed: 'bg-red-100 text-red-700 border-red-200',
};

const PAGE_SIZE = 10;

const Trace = () => {
	const [filters, setFilters] = useState({
		gnb: '',
		date: '',
		traceFile: '',
		traceStatus: 'all',
		reason: '',
		duration: '1h',
		customRange: null,
	});
	const [durationSelect, setDurationSelect] = useState(filters.duration || '1h');
	const [customStart, setCustomStart] = useState('');
	const [customEnd, setCustomEnd] = useState('');
	const [page, setPage] = useState(1);

	// Filtering logic
	const filteredData = MOCK_TRACE_DATA.filter(row => {
		return (
			(filters.gnb === '' || row.gnb.toLowerCase().includes(filters.gnb.toLowerCase())) &&
			(filters.traceFile === '' || row.traceFile.toLowerCase().includes(filters.traceFile.toLowerCase())) &&
			(filters.traceStatus === 'all' || row.traceStatus === filters.traceStatus) &&
			(filters.reason === '' || row.reason.toLowerCase().includes(filters.reason.toLowerCase())) &&
			(filters.date === '' || row.dateTime.startsWith(filters.date))
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
		}
	};

	const handleSearch = () => {
		if (durationSelect === 'custom') {
			handleFilterChange('duration', 'custom');
			handleFilterChange('customRange', customStart && customEnd ? { start: customStart, end: customEnd } : null);
		} else {
			handleFilterChange('duration', durationSelect === 'all' ? '' : durationSelect);
			handleFilterChange('customRange', null);
		}
	};

	const columns = [
		{ key: 'gnb', label: 'gNB', minWidth: 'min-w-[110px]', filter: <Input className="w-full" placeholder="gNB" value={filters.gnb} onChange={e => handleFilterChange('gnb', e.target.value)} /> },
		{ key: 'dateTime', label: 'Date/Time', minWidth: 'min-w-[170px]', filter: <Input className="w-full" type="date" value={filters.date} onChange={e => handleFilterChange('date', e.target.value)} /> },
		{ key: 'traceFile', label: 'File Name', minWidth: 'min-w-[200px]', filter: <Input className="w-full" placeholder="Trace File" value={filters.traceFile} onChange={e => handleFilterChange('traceFile', e.target.value)} /> },
		{ key: 'traceStatus', label: 'Download Status', minWidth: 'min-w-[140px]', filter: (
			<Select value={filters.traceStatus} onValueChange={v => handleFilterChange('traceStatus', v)}>
				<SelectTrigger className="w-full"><SelectValue placeholder="Trace Status" /></SelectTrigger>
				<SelectContent>
					{TRACE_STATUS.map(opt => (
						<SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
					))}
				</SelectContent>
			</Select>
		) },
		{ key: 'reason', label: 'Reason', minWidth: 'min-w-[200px]', filter: <Input className="w-full" placeholder="Reason" value={filters.reason} onChange={e => handleFilterChange('reason', e.target.value)} /> },
	];

	return (
		<div className="space-y-6">
			{/* Header */}
			<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
				<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
					<div>
						<h1 className="text-4xl font-bold text-gray-900 mb-1">Trace Log Management</h1>
					</div>
					<div className="flex items-center gap-2">
						<span className="font-medium text-gray-700">Duration</span>
						<Select value={durationSelect} onValueChange={handleDurationDropdown}>
							<SelectTrigger className="w-40">
								<SelectValue placeholder="Duration" />
							</SelectTrigger>
							<SelectContent>
								{DURATION_OPTIONS.map(opt => (
									<SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
								))}
							</SelectContent>
						</Select>
						{durationSelect === 'custom' && (
							<div className="flex items-center gap-2">
								<Input
									type="datetime-local"
									value={customStart}
									onChange={e => setCustomStart(e.target.value)}
									className="w-44"
									placeholder="Start Date"
								/>
								<span className="mx-1 text-gray-500">to</span>
								<Input
									type="datetime-local"
									value={customEnd}
									onChange={e => setCustomEnd(e.target.value)}
									className="w-44"
									placeholder="End Date"
								/>
							</div>
						)}
						<button
							className="ml-2 px-4 py-2 rounded bg-orange-500 text-white font-semibold hover:bg-orange-600 transition flex items-center gap-1"
							onClick={handleSearch}
							title="Apply Duration Filter"
						>
							<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" fill="none"/>
								<line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" strokeWidth="2"/>
							</svg>
							Search
						</button>
					</div>
				</div>
			</motion.div>

			{/* Table Section */}
			<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
				<Card className="border-0 shadow-xl bg-white/90 backdrop-blur-md">
					<CardHeader>
						<CardTitle className="text-xl font-bold text-gray-900">Trace Data</CardTitle>
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
												style={{ width: '1%' }}
											>
												{col.label}
											</th>
										))}
									</tr>
									<tr>
										{columns.map(col => (
											<td
												key={col.key}
												className={`px-4 py-2 align-top ${col.minWidth} whitespace-nowrap border-b border-gray-100`}
												style={{ width: '1%' }}
											>
												{col.filter}
											</td>
										))}
									</tr>
								</thead>
								<tbody>
									{filteredData.length === 0 ? (
										<tr>
											<td colSpan={columns.length} className="text-center text-gray-400 py-4">
												No data found
											</td>
										</tr>
									) : (
										filteredData
											.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
											.map((row, idx) => (
												<tr
													key={row.id}
													className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
												>
													<td className={`px-4 py-2 border-b border-gray-100 ${columns[0].minWidth} whitespace-nowrap`}>{row.gnb}</td>
													<td className={`px-4 py-2 border-b border-gray-100 ${columns[1].minWidth} whitespace-nowrap`}>{row.dateTime}</td>
													<td className={`px-4 py-2 border-b border-gray-100 ${columns[2].minWidth} whitespace-nowrap`}>{row.traceFile}</td>
													<td className={`px-4 py-2 border-b border-gray-100 ${columns[3].minWidth} whitespace-nowrap`}>
														<Badge className={`border ${statusBadge[row.traceStatus]}`}>
															{row.traceStatus.toUpperCase()}
														</Badge>
													</td>
													<td className={`px-4 py-2 border-b border-gray-100 ${columns[4].minWidth} whitespace-nowrap`}>{row.reason}</td>
												</tr>
											))
									)}
								</tbody>
							</table>
						</div>
						{/* Pagination */}
						<div className="flex justify-end items-center gap-2 mt-4">
							<button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1 rounded border bg-gray-100">Prev</button>
							<span className="text-sm">{page} / {totalPages}</span>
							<button disabled={page === totalPages || filteredData.length === 0} onClick={() => setPage(p => p + 1)} className="px-3 py-1 rounded border bg-gray-100">Next</button>
						</div>
					</CardContent>
				</Card>
			</motion.div>
		</div>
	);
};

export default Trace;