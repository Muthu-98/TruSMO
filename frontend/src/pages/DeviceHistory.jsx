import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Table, TableHead, TableRow, TableCell, TableBody } from '../components/ui/table';
import { Input } from '../components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../components/ui/select';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';

const DURATION_OPTIONS = [
  { label: '5 Minutes', value: '5m' },
  { label: '1 Hour', value: '1h' },
  { label: '3 Hours', value: '3h' },
  { label: '12 Hours', value: '12h' },
  { label: '1 Day', value: '1d' },
  { label: '3 Days', value: '3d' },
  { label: '7 Days', value: '7d' },
  { label: 'Custom', value: 'custom' },
];

const PAGE_SIZE = 10;

// Mock notification history data
const MOCK_HISTORY = [
  {
    id: 1,
    gnb: 'TRU009',
    dateTime: '2025-10-20 09:15:00',
    source: 'SMO',
    destination: 'gNB',
    eventNotification: 'Software download completed',
    notificationType: 'CONFIG',
    description: 'Download completed for gNB TRU009'
  },
  {
    id: 2,
    gnb: 'TRU010',
    dateTime: '2025-10-20 09:18:30',
    source: 'gNB',
    destination: 'SMO',
    eventNotification: 'Alarm raised',
    notificationType: 'ALARM',
    description: 'High temperature detected in module A'
  },
  {
    id: 3,
    gnb: 'TRU011',
    dateTime: '2025-10-20 09:22:05',
    source: 'SMO',
    destination: 'gNB',
    eventNotification: 'Config push',
    notificationType: 'CONFIG',
    description: 'Configuration pushed to gNB TRU011'
  },
  // ...more mock rows...
];

const statusBadge = {
  INFO: 'bg-blue-100 text-blue-800 border-blue-200',
  ALARM: 'bg-red-100 text-red-800 border-red-200',
  CONFIG: 'bg-green-100 text-green-800 border-green-200'
};

const DeviceHistory = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    gnb: '',
    date: '',
    source: '',
    destination: '',
    eventNotification: '',
    notificationType: 'all',
    description: '',
    duration: '1h',
    customRange: null
  });
  const [durationSelect, setDurationSelect] = useState(filters.duration || '1h');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');
  const [page, setPage] = useState(1);
  const [data] = useState(MOCK_HISTORY); // replace with fetch when available

  const columns = [
    { key: 'gnb', label: 'gNB', minWidth: 'min-w-[110px]', filter: <Input className="w-full" placeholder="gNB" value={filters.gnb} onChange={e => handleFilterChange('gnb', e.target.value)} /> },
    { key: 'dateTime', label: 'Date/Time', minWidth: 'min-w-[170px]', filter: <Input className="w-full" type="date" value={filters.date} onChange={e => handleFilterChange('date', e.target.value)} /> },
    { key: 'source', label: 'Source', minWidth: 'min-w-[140px]', filter: <Input className="w-full" placeholder="Source" value={filters.source} onChange={e => handleFilterChange('source', e.target.value)} /> },
    { key: 'destination', label: 'Destination', minWidth: 'min-w-[140px]', filter: <Input className="w-full" placeholder="Destination" value={filters.destination} onChange={e => handleFilterChange('destination', e.target.value)} /> },
    { key: 'eventNotification', label: 'Event / Notification', minWidth: 'min-w-[220px]', filter: <Input className="w-full" placeholder="Event / Notification" value={filters.eventNotification} onChange={e => handleFilterChange('eventNotification', e.target.value)} /> },
    { key: 'notificationType', label: 'Notification Type', minWidth: 'min-w-[140px]', filter: (
      <Select value={filters.notificationType} onValueChange={v => handleFilterChange('notificationType', v)}>
        <SelectTrigger className="w-full"><SelectValue placeholder="Type" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">ALL</SelectItem>
          <SelectItem value="INFO">INFO</SelectItem>
          <SelectItem value="ALARM">ALARM</SelectItem>
          <SelectItem value="CONFIG">CONFIG</SelectItem>
        </SelectContent>
      </Select>
    ) },
    { key: 'description', label: 'Description', minWidth: 'min-w-[250px]', filter: <Input className="w-full" placeholder="Description" value={filters.description} onChange={e => handleFilterChange('description', e.target.value)} /> },
  ];

  // simple front-end filtering for mock data
  const filteredData = data.filter(row => {
    return (
      (filters.gnb === '' || row.gnb.toLowerCase().includes(filters.gnb.toLowerCase())) &&
      (filters.date === '' || row.dateTime.startsWith(filters.date)) &&
      (filters.source === '' || row.source.toLowerCase().includes(filters.source.toLowerCase())) &&
      (filters.destination === '' || row.destination.toLowerCase().includes(filters.destination.toLowerCase())) &&
      (filters.eventNotification === '' || row.eventNotification.toLowerCase().includes(filters.eventNotification.toLowerCase())) &&
      (filters.notificationType === 'all' || row.notificationType === filters.notificationType) &&
      (filters.description === '' || row.description.toLowerCase().includes(filters.description.toLowerCase()))
    );
  });

  const totalPages = Math.max(1, Math.ceil(filteredData.length / PAGE_SIZE));

  function handleFilterChange(key, value) {
    setFilters(f => ({ ...f, [key]: value }));
    setPage(1);
  }

  function handleDurationDropdown(value) {
    setDurationSelect(value);
    if (value !== 'custom') {
      setCustomStart('');
      setCustomEnd('');
      handleFilterChange('duration', value);
      handleFilterChange('customRange', null);
    }
  }

  function handleApplyDuration() {
    if (durationSelect === 'custom') {
      handleFilterChange('duration', 'custom');
      handleFilterChange('customRange', customStart && customEnd ? { start: customStart, end: customEnd } : null);
    } else {
      handleFilterChange('duration', durationSelect);
      handleFilterChange('customRange', null);
    }
    setPage(1);
  }

  function handleRefresh() {
    // If using API, re-fetch here. For mock, just reset page to 1
    setPage(1);
  }

  function handleClear() {
    setFilters({
      gnb: '',
      date: '',
      source: '',
      destination: '',
      eventNotification: '',
      notificationType: 'all',
      description: '',
      duration: '1h',
      customRange: null
    });
    setDurationSelect('1h');
    setCustomStart('');
    setCustomEnd('');
    setPage(1);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-1">Device History</h1>
            <p className="text-gray-600">Notification history with filters and duration control</p>
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
            <Button className="ml-2" onClick={handleApplyDuration}>Apply</Button>
            <Button variant="outline" className="ml-2" onClick={handleRefresh}>Refresh</Button>
            {/* <Button variant="ghost" className="ml-2" onClick={() => navigate(-1)}>Back</Button> */}
            <Button variant="outline" className="ml-2" onClick={handleClear}>Clear</Button>
          </div>
        </div>
      </motion.div>

      {/* Table Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
        <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-900">Notification Table</CardTitle>
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
                        No history found
                      </td>
                    </tr>
                  ) : (
                    filteredData
                      .slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
                      .map((row, idx) => (
                        <tr key={row.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className={`px-4 py-2 border-b border-gray-100 ${columns[0].minWidth} whitespace-nowrap`}>{row.gnb}</td>
                          <td className={`px-4 py-2 border-b border-gray-100 ${columns[1].minWidth} whitespace-nowrap`}>{row.dateTime}</td>
                          <td className={`px-4 py-2 border-b border-gray-100 ${columns[2].minWidth} whitespace-nowrap`}>{row.source}</td>
                          <td className={`px-4 py-2 border-b border-gray-100 ${columns[3].minWidth} whitespace-nowrap`}>{row.destination}</td>
                          <td className={`px-4 py-2 border-b border-gray-100 ${columns[4].minWidth} whitespace-nowrap`}>{row.eventNotification}</td>
                          <td className={`px-4 py-2 border-b border-gray-100 ${columns[5].minWidth} whitespace-nowrap`}>
                            <Badge className={`border ${statusBadge[row.notificationType] || 'bg-gray-100 text-gray-800 border-gray-200'}`}>
                              {row.notificationType}
                            </Badge>
                          </td>
                          <td className={`px-4 py-2 border-b border-gray-100 ${columns[6].minWidth} whitespace-nowrap`}>{row.description}</td>
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
    </div>
  );
};

export default DeviceHistory;