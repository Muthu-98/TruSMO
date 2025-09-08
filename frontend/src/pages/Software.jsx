import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Eye, Plus } from 'lucide-react';

// Add mock slot details for demonstration
const slotDetailsData = {
	1: {
		access: 'READ_WRITE',
		active: true,
		buildId: '20240731',
		buildName: 'P5G-308X',
		buildVersion: 'p5g-308xc-1.0-014',
		fileLocation: './BBUOAM_V100R100C003B220.zip',
		fileVersion: 'V100R100C003B220',
		productCode: 'P5G-308X',
		running: true,
		status: 'VALID',
		vendorCode: 'SG'
	},
	2: {
		access: 'READ_WRITE',
		active: false,
		buildId: '20240730',
		buildName: 'P5G-308X',
		buildVersion: 'p5g-308xc-1.0-013',
		fileLocation: './BBUOAM_V100R100C003B219.zip',
		fileVersion: 'V100R100C003B219',
		productCode: 'P5G-308X',
		running: false,
		status: 'INVALID',
		vendorCode: 'SG'
	}
};

const mockSoftware = [
	{
		id: 1,
		gnbId: 'GNB001',
		version: 'gNB_v1.0',
		downloadStatus: 'not started',
		installStatus: 'not started',
		activateStatus: 'not started',
		availableSlots: [
			{ slot: 1, status: 'Completed' },
			{ slot: 2, status: 'not started' }
		]
	},
	{
		id: 2,
		gnbId: 'GNB002',
		version: 'gNB_v2.0',
		downloadStatus: 'Completed',
		installStatus: 'Completed',
		activateStatus: 'Completed',
		availableSlots: [
			{ slot: 1, status: 'Completed' },
			{ slot: 2, status: 'Completed' }
		]
	}
];

const SoftwareMgmt = () => {
	const [softwareList, setSoftwareList] = useState(mockSoftware);
	const [dialogType, setDialogType] = useState(null); // 'download' | 'install' | 'activate'
	const [selectedRow, setSelectedRow] = useState(null);
	const [downloadForm, setDownloadForm] = useState({
		remoteFilePath: '/root/gNB/software/gNB_v1.0.zip',
		password: ''
	});
	const [installForm, setInstallForm] = useState({
		slotName: '',
		fileName: ''
	});
	const [activateForm, setActivateForm] = useState({
		slot: ''
	});
	const [activateError, setActivateError] = useState('');
	const [slotDialogOpen, setSlotDialogOpen] = useState(false);
	const [slotInfo, setSlotInfo] = useState([]);

	// Handlers for opening dialogs
	const openDialog = (type, row) => {
		setDialogType(type);
		setSelectedRow(row);
		setActivateError('');
		if (type === 'download') {
			setDownloadForm({
				remoteFilePath: `/root/gNB/software/${row.version}.zip`,
				password: ''
			});
		}
		if (type === 'install') {
			setInstallForm({
				slotName: row.availableSlots[0]?.slot || '',
				fileName: row.version
			});
		}
		if (type === 'activate') {
			setActivateForm({ slot: '' });
		}
	};

	// Download form handlers
	const handleDownloadChange = (field, value) => {
		setDownloadForm(prev => ({ ...prev, [field]: value }));
	};
	const handleDownloadClear = () => {
		setDownloadForm({
			remoteFilePath: `/root/gNB/software/${selectedRow.version}.zip`,
			password: ''
		});
	};
	const handleDownloadSubmit = (e) => {
		e.preventDefault();
		// Simulate download status update
		setSoftwareList(list =>
			list.map(item =>
				item.id === selectedRow.id
					? { ...item, downloadStatus: 'Completed' }
					: item
			)
		);
		setDialogType(null);
	};

	// Install form handlers
	const handleInstallChange = (field, value) => {
		setInstallForm(prev => ({ ...prev, [field]: value }));
	};
	const handleInstallClear = () => {
		setInstallForm({
			slotName: selectedRow.availableSlots[0]?.slot || '',
			fileName: selectedRow.version
		});
	};
	const handleInstallSubmit = (e) => {
		e.preventDefault();
		setSoftwareList(list =>
			list.map(item =>
				item.id === selectedRow.id
					? { ...item, installStatus: 'Completed' }
					: item
			)
		);
		setDialogType(null);
	};

	// Activate form handlers
	const handleActivateChange = (field, value) => {
		setActivateForm(prev => ({ ...prev, [field]: value }));
		setActivateError('');
	};
	const handleActivateClear = () => {
		setActivateForm({ slot: '' });
		setActivateError('');
	};
	const handleActivateSubmit = (e) => {
		e.preventDefault();
		// Find the slot status
		const slot = selectedRow.availableSlots.find(s => String(s.slot) === String(activateForm.slot));
		if (!slot || slot.status !== 'Completed') {
			setActivateError('Select a slot whose status is valid (Completed)');
			return;
		}
		setSoftwareList(list =>
			list.map(item =>
				item.id === selectedRow.id
					? { ...item, activateStatus: 'Completed' }
					: item
			)
		);
		setDialogType(null);
	};

	// Handler for AvailableSlots view button
	const handleViewSlots = (row) => {
		// Simulate fetching slot details for each slot
		// In real app, fetch from API using row.gnbId or row.id
		const slots = row.availableSlots.map(slot => ({
			slot: slot.slot,
			...slotDetailsData[slot.slot]
		}));
		setSlotInfo(slots);
		setSlotDialogOpen(true);
	};

	return (
		<div className="space-y-6">
			<div className="flex items-center space-x-4">
				<h1 className="text-4xl font-bold text-gray-900 mb-2">Software Management</h1>
			</div>
			<Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
				<CardHeader>
					<CardTitle className="text-xl font-bold text-gray-900">Software Management Table</CardTitle>
				</CardHeader>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>GNBId</TableHead>
								<TableHead>Version</TableHead>
								<TableHead>Download</TableHead>
								<TableHead>DownloadStatus</TableHead>
								<TableHead>Install</TableHead>
								<TableHead>InstallStatus</TableHead>
								<TableHead>Activate</TableHead>
								<TableHead>ActivateStatus</TableHead>
								<TableHead>AvailableSlots</TableHead>
								<TableHead>StatusReset</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{softwareList.map(row => (
								<TableRow key={row.id}>
									<TableCell>{row.gnbId}</TableCell>
									<TableCell>{row.version}</TableCell>
									<TableCell>
										<Button
											size="sm"
											variant="outline"
											onClick={() => openDialog('download', row)}
											disabled={row.downloadStatus === 'Completed'}
										>
											Download
										</Button>
									</TableCell>
									<TableCell>
										{row.downloadStatus}
									</TableCell>
									<TableCell>
										<Button
											size="sm"
											variant="outline"
											onClick={() => openDialog('install', row)}
											disabled={row.downloadStatus !== 'Completed' || row.installStatus === 'Completed'}
										>
											Install
										</Button>
									</TableCell>
									<TableCell>
										{row.installStatus}
									</TableCell>
									<TableCell>
										<Button
											size="sm"
											variant="outline"
											onClick={() => openDialog('activate', row)}
											disabled={row.installStatus !== 'Completed' || row.activateStatus === 'Completed'}
										>
											Activate
										</Button>
									</TableCell>
									<TableCell>
										{row.activateStatus}
									</TableCell>
									<TableCell>
										<Button
											size="sm"
											variant="outline"
											className="hover:bg-blue-50"
											onClick={() => handleViewSlots(row)}
										>
											<Eye className="h-4 w-4 mr-1" />
											View
										</Button>
									</TableCell>
									<TableCell>
										<Button
											size="sm"
											variant="outline"
											className="hover:bg-orange-50"
											onClick={() => {
												setSoftwareList(list =>
													list.map(item =>
														item.id === row.id
															? {
																	...item,
																	downloadStatus: 'not started',
																	installStatus: 'not started',
																	activateStatus: 'not started'
																}
															: item
													)
												);
											}}
										>
											StatusReset
										</Button>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</CardContent>
			</Card>

			{/* Download Dialog */}
			<Dialog open={dialogType === 'download'} onOpenChange={open => !open && setDialogType(null)}>
				<DialogContent className="max-w-md">
					<DialogHeader>
						<DialogTitle>Download Software</DialogTitle>
					</DialogHeader>
					<form onSubmit={handleDownloadSubmit} className="space-y-4">
						<div>
							<Label htmlFor="remoteFilePath">Remote file path</Label>
							<Input
								id="remoteFilePath"
								value={downloadForm.remoteFilePath}
								onChange={e => handleDownloadChange('remoteFilePath', e.target.value)}
								required
							/>
						</div>
						<div>
							<Label htmlFor="password">Password</Label>
							<Input
								id="password"
								type="password"
								value={downloadForm.password}
								onChange={e => handleDownloadChange('password', e.target.value)}
								required
							/>
						</div>
						<div className="flex justify-end space-x-2 pt-4">
							<Button type="button" variant="outline" onClick={handleDownloadClear}>Clear</Button>
							<Button type="button" variant="outline" onClick={() => setDialogType(null)}>Cancel</Button>
							<Button type="submit" className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">Download</Button>
						</div>
					</form>
				</DialogContent>
			</Dialog>

			{/* Install Dialog */}
			<Dialog open={dialogType === 'install'} onOpenChange={open => !open && setDialogType(null)}>
				<DialogContent className="max-w-md">
					<DialogHeader>
						<DialogTitle>Install Software</DialogTitle>
					</DialogHeader>
					<form onSubmit={handleInstallSubmit} className="space-y-4">
						<div>
							<Label htmlFor="slotName">Slot Name</Label>
							<Input
								id="slotName"
								type="number"
								value={installForm.slotName}
								onChange={e => handleInstallChange('slotName', e.target.value)}
								required
							/>
						</div>
						<div>
							<Label htmlFor="fileName">File Name</Label>
							<Input
								id="fileName"
								value={installForm.fileName}
								onChange={e => handleInstallChange('fileName', e.target.value)}
								required
							/>
						</div>
						<div className="flex justify-end space-x-2 pt-4">
							<Button type="button" variant="outline" onClick={handleInstallClear}>Clear</Button>
							<Button type="button" variant="outline" onClick={() => setDialogType(null)}>Cancel</Button>
							<Button type="submit" className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">Install</Button>
						</div>
					</form>
				</DialogContent>
			</Dialog>

			{/* Activate Dialog */}
			<Dialog open={dialogType === 'activate'} onOpenChange={open => !open && setDialogType(null)}>
				<DialogContent className="max-w-md">
					<DialogHeader>
						<DialogTitle>Activate Software</DialogTitle>
					</DialogHeader>
					<form onSubmit={handleActivateSubmit} className="space-y-4">
						<div>
							<Label htmlFor="slot">Select Slot</Label>
							<select
								id="slot"
								value={activateForm.slot}
								onChange={e => handleActivateChange('slot', e.target.value)}
								className="w-full border rounded px-3 py-2"
								required
							>
								<option value="">Select Slot</option>
								{selectedRow?.availableSlots.map(slot => (
									<option key={slot.slot} value={slot.slot}>
										Slot {slot.slot} ({slot.status})
									</option>
								))}
							</select>
							{activateError && (
								<div className="text-red-600 text-sm mt-1">{activateError}</div>
							)}
						</div>
						<div className="flex justify-end space-x-2 pt-4">
							<Button type="button" variant="outline" onClick={handleActivateClear}>Clear</Button>
							<Button type="button" variant="outline" onClick={() => setDialogType(null)}>Cancel</Button>
							<Button type="submit" className="bg-gradient-to-r from-green-500 to-green-600 text-white">Activate</Button>
						</div>
					</form>
				</DialogContent>
			</Dialog>

			{/* Slot Info Dialog */}
			<Dialog open={slotDialogOpen} onOpenChange={setSlotDialogOpen}>
				<DialogContent className="max-w-2xl">
					<DialogHeader>
						<DialogTitle>Slot Information</DialogTitle>
					</DialogHeader>
					<div className="space-y-6">
						{slotInfo.length === 0 ? (
							<div className="text-gray-500">No slot information available.</div>
						) : (
							slotInfo.map(slot => (
								<Card key={slot.slot} className="mb-4 border">
									<CardHeader>
										<CardTitle>Slot {slot.slot}</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
											<div><span className="font-semibold">Access:</span> {slot.access}</div>
											<div><span className="font-semibold">Active:</span> {slot.active ? 'Yes' : 'No'}</div>
											<div><span className="font-semibold">Build ID:</span> {slot.buildId}</div>
											<div><span className="font-semibold">Build Name:</span> {slot.buildName}</div>
											<div><span className="font-semibold">Build Version:</span> {slot.buildVersion}</div>
											<div><span className="font-semibold">File Location:</span> {slot.fileLocation}</div>
											<div><span className="font-semibold">File Version:</span> {slot.fileVersion}</div>
											<div><span className="font-semibold">Product Code:</span> {slot.productCode}</div>
											<div><span className="font-semibold">Running:</span> {slot.running ? 'Yes' : 'No'}</div>
											<div><span className="font-semibold">Status:</span> {slot.status}</div>
											<div><span className="font-semibold">Vendor Code:</span> {slot.vendorCode}</div>
										</div>
									</CardContent>
								</Card>
							))
						)}
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default SoftwareMgmt;