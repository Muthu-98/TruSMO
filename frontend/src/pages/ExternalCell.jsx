import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Edit, Trash2, Plus } from 'lucide-react';

const mockExternalCells = [
	{
		id: 1,
		gnbId: 'GNB001',
		cellLocalId: 'CELL001',
		nRPCI: '101',
		MCC: '501',
		MNC: '01',
	},
];

const ExternalCell = () => {
	const [externalCellList, setExternalCellList] = useState(mockExternalCells);
	const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
	const [formData, setFormData] = useState({
		gnbId: '',
		cellLocalId: '',
		nRPCI: '',
		MCC: '',
		MNC: '',
	});

	const handleSubmit = (e) => {
		e.preventDefault();
		const newCell = {
			id: externalCellList.length + 1,
			...formData,
		};
		setExternalCellList((prev) => [...prev, newCell]);
		setIsAddDialogOpen(false);
		setFormData({
			gnbId: '',
			cellLocalId: '',
			nRPCI: '',
			MCC: '',
			MNC: '',
		});
	};

	return (
		<div className="space-y-6">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
			>
				<h1 className="text-4xl font-bold text-gray-900 mb-2">
					External Cell Configuration
				</h1>
				<p className="text-gray-600 text-lg">
					Manage External Cells for NeighborGNBs
				</p>
			</motion.div>
			<Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
				<CardHeader>
					<div className="flex items-center justify-between">
						<CardTitle className="text-xl font-bold text-gray-900">
							List of External Cell
						</CardTitle>
						<Dialog
							open={isAddDialogOpen}
							onOpenChange={setIsAddDialogOpen}
						>
							<DialogTrigger asChild>
								<Button className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
									<Plus className="h-4 w-4 mr-2" />
									Add External Cell
								</Button>
							</DialogTrigger>
							<DialogContent className="max-w-lg">
								<DialogHeader>
									<DialogTitle>Add External Cell</DialogTitle>
								</DialogHeader>
								<form
									onSubmit={handleSubmit}
									className="space-y-4"
								>
									<div>
										<Label htmlFor="gnbId">gnbId</Label>
										<Input
											id="gnbId"
											value={formData.gnbId}
											onChange={(e) =>
												setFormData({
													...formData,
													gnbId: e.target.value,
												})
											}
											required
										/>
									</div>
									<div>
										<Label htmlFor="cellLocalId">cellLocalId</Label>
										<Input
											id="cellLocalId"
											value={formData.cellLocalId}
											onChange={(e) =>
												setFormData({
													...formData,
													cellLocalId: e.target.value,
												})
											}
											required
										/>
									</div>
									<div>
										<Label htmlFor="nRPCI">nRPCI</Label>
										<Input
											id="nRPCI"
											value={formData.nRPCI}
											onChange={(e) =>
												setFormData({
													...formData,
													nRPCI: e.target.value,
												})
											}
											required
										/>
									</div>
									<div>
										<Label htmlFor="MCC">MCC</Label>
										<Input
											id="MCC"
											value={formData.MCC}
											onChange={(e) =>
												setFormData({
													...formData,
													MCC: e.target.value,
												})
											}
											required
										/>
									</div>
									<div>
										<Label htmlFor="MNC">MNC</Label>
										<Input
											id="MNC"
											value={formData.MNC}
											onChange={(e) =>
												setFormData({
													...formData,
													MNC: e.target.value,
												})
											}
											required
										/>
									</div>
									<div className="flex justify-end space-x-2 pt-4">
										<Button
											type="button"
											variant="outline"
											onClick={() => setIsAddDialogOpen(false)}
										>
											Cancel
										</Button>
										<Button
											type="submit"
											className="bg-gradient-to-r from-blue-500 to-blue-600"
										>
											Add
										</Button>
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
								<TableHead>gnbId</TableHead>
								<TableHead>cellLocalId</TableHead>
								<TableHead>nRPCI</TableHead>
								<TableHead>MCC</TableHead>
								<TableHead>MNC</TableHead>
								<TableHead>Action</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{externalCellList.map((cell) => (
								<TableRow key={cell.id}>
									<TableCell>{cell.gnbId}</TableCell>
									<TableCell>{cell.cellLocalId}</TableCell>
									<TableCell>{cell.nRPCI}</TableCell>
									<TableCell>{cell.MCC}</TableCell>
									<TableCell>{cell.MNC}</TableCell>
									<TableCell>
										<div className="flex space-x-2">
											<Button
												variant="outline"
												size="sm"
												className="hover:bg-blue-50"
											>
												<Edit className="h-4 w-4" />
											</Button>
											<Button
												variant="outline"
												size="sm"
												className="hover:bg-red-50 hover:text-red-600"
											>
												<Trash2 className="h-4 w-4" />
											</Button>
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

export default ExternalCell;