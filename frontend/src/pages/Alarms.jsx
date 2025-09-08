import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '../components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Table, TableHead, TableRow, TableCell, TableBody } from '../components/ui/table';
import { Input } from '../components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../components/ui/select';
import { Calendar } from '../components/ui/calendar';
import { OctagonAlert as AlarmOctagon, TriangleAlert as AlarmTriangle, CircleAlert as AlarmCircle } from 'lucide-react';
import { Button } from '../components/ui/button';

const SEVERITIES = [
  { key: 'critical', label: 'Critical', color: 'red', icon: AlarmOctagon },
  { key: 'major', label: 'Major', color: 'orange', icon: AlarmTriangle },
  { key: 'minor', label: 'Minor', color: 'yellow', icon: AlarmCircle },
];

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

const COLUMN_OPTIONS = [
  { key: 'alarm_list_id', label: 'AlarmListId' }, // New column
  { key: 'alarm_id', label: 'AlarmId' },
  { key: 'date_time', label: 'Date/Time' },
  { key: 'severity', label: 'Severity' },
  { key: 'probable_cause', label: 'Probable Cause' },
  { key: 'alarm_type', label: 'Alarm Type' },
  { key: 'specific_problem', label: 'Specific Problem' },
  { key: 'notification_type', label: 'Notification Type' },
  { key: 'ack_state', label: 'AckState' }, // New column
  { key: 'ack_time', label: 'AckTime' }    // New column
];

// Example alarm data (updated to match your table)
const SAMPLE_ALARMS = [
  {
    id: 1,
    alarm_list_id: 'AL001', // Add this field
    gnb: 'gNB001',
    alarmId: 'A12345',
    dateTime: '2025-07-24 09:15:00',
    severity: 'critical',
    probableCause: 'Hardware Failure',
    alarmType: 'Power Alarm',
    specificProblem: 'PSU Overvoltage',
    notificationType: 'Immediate',
    ack_state: 'UNACK',
    ack_time: new Date().toISOString()
  },
  {
    id: 2,
    alarm_list_id: 'AL002', // Add this field
    gnb: 'gNB002',
    alarmId: 'A12346',
    dateTime: '2025-07-24 10:30:00',
    severity: 'major',
    probableCause: 'Temperature Rise',
    alarmType: 'Env Alarm',
    specificProblem: 'High Internal Temp',
    notificationType: 'Delayed',
    ack_state: 'UNACK',
    ack_time: new Date().toISOString()
  },
  {
    id: 3,
    alarm_list_id: 'AL003', // Add this field
    gnb: 'gNB003',
    alarmId: 'A12347',
    dateTime: '2025-07-24 11:05:00',
    severity: 'minor',
    probableCause: 'Sync Loss',
    alarmType: 'Sync Alarm',
    specificProblem: 'GPS Sync Drift',
    notificationType: 'Immediate',
    ack_state: 'UNACK',
    ack_time: new Date().toISOString()
  },
  {
    id: 4,
    alarm_list_id: 'AL004', // Add this field
    gnb: 'gNB004',
    alarmId: 'A12348',
    dateTime: '2025-07-24 12:00:00',
    severity: 'major',
    probableCause: 'Config Error',
    alarmType: 'Mgmt Alarm',
    specificProblem: 'VLAN Misconfiguration',
    notificationType: 'Immediate',
    ack_state: 'UNACK',
    ack_time: new Date().toISOString()
  },
  {
    id: 5,
    alarm_list_id: 'AL005', // Add this field
    gnb: 'gNB005',
    alarmId: 'A12349',
    dateTime: '2025-07-24 12:45:00',
    severity: 'minor',
    probableCause: 'Link Down',
    alarmType: 'Transport',
    specificProblem: 'Fiber Disconnected',
    notificationType: 'Delayed',
    ack_state: 'UNACK',
    ack_time: new Date().toISOString()
  },
  {
    id: 6,
    alarm_list_id: 'AL006', // Add this field
    gnb: 'gNB006',
    alarmId: 'A12350',
    dateTime: '2025-07-24 13:30:00',
    severity: 'major',
    probableCause: 'Overcurrent',
    alarmType: 'Power Alarm',
    specificProblem: 'Current Surge Detected',
    notificationType: 'Immediate',
    ack_state: 'UNACK',
    ack_time: new Date().toISOString()
  },
];

// Helper for row background color
const severityRowBg = {
  critical: 'bg-red-50',
  major: 'bg-orange-50',
  minor: 'bg-yellow-50',
};

// Helper for badge color
const severityBadge = {
  critical: 'bg-red-100 text-red-700 border-red-200',
  major: 'bg-orange-100 text-orange-700 border-orange-200',
  minor: 'bg-yellow-100 text-yellow-700 border-yellow-200',
};

const PAGE_SIZE = 10;

const Alarms = () => {
  const [alarmCounts, setAlarmCounts] = useState({ critical: 1, major: 3, minor: 3 });
  const [alarms, setAlarms] = useState(SAMPLE_ALARMS);
  const [filters, setFilters] = useState({
    gnb: '',
    alarmType: '',
    severity: '',
    duration: '1h',
    customRange: null,
    probableCause: '',
    specificProblem: '',
    notificationType: '',
    alarmId: '',
  });
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const wsRef = useRef(null);
  const [durationSelect, setDurationSelect] = useState(filters.duration || '1h');
  const [customStart, setCustomStart] = useState(filters.customRange?.start || null);
  const [customEnd, setCustomEnd] = useState(filters.customRange?.end || null);

  // WebSocket connection for real-time alarm counts and table data
  useEffect(() => {
    // Replace with your actual WebSocket URL
    wsRef.current = new WebSocket('wss://your-backend/ws/alarms');
    wsRef.current.onopen = () => {
      wsRef.current.send(JSON.stringify({ type: 'subscribe', filters }));
    };
    wsRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'alarmCounts') {
        setAlarmCounts(data.counts);
      }
      if (data.type === 'alarmTable') {
        setAlarms(data.alarms);
        setTotal(data.total);
      }
    };
    return () => wsRef.current && wsRef.current.close();
  }, [filters, page]);

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters(f => ({ ...f, [key]: value }));
    setPage(1);
  };

  // Duration filter logic
  const handleDurationChange = (value) => {
    handleFilterChange('duration', value);
    if (value !== 'custom') handleFilterChange('customRange', null);
  };

  const handleDurationDropdown = (value) => {
    setDurationSelect(value);
    if (value !== 'custom') {
      setCustomStart(null);
      setCustomEnd(null);
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

  // Pagination
  const totalPages = Math.ceil(total / PAGE_SIZE);

//   // Severity counts from sample data
//   const alarmCounts = {
//     critical: alarms.filter(a => a.severity === 'critical').length,
//     major: alarms.filter(a => a.severity === 'major').length,
//     minor: alarms.filter(a => a.severity === 'minor').length,
//   };

  // Table columns for alignment
  const columns = [
    { key: 'alarm_list_id', label: 'AlarmListId', minWidth: 'min-w-[120px]' }, // New column
    { key: 'alarmId', label: 'Alarm ID', minWidth: 'min-w-[110px]' },
    { key: 'dateTime', label: 'Date/Time', minWidth: 'min-w-[170px]' },
    { key: 'severity', label: 'Severity', minWidth: 'min-w-[110px]' },
    { key: 'probableCause', label: 'Probable Cause', minWidth: 'min-w-[150px]' },
    { key: 'alarmType', label: 'Alarm Type', minWidth: 'min-w-[120px]' },
    { key: 'specificProblem', label: 'Specific Problem', minWidth: 'min-w-[170px]' },
    { key: 'notificationType', label: 'Notification Type', minWidth: 'min-w-[140px]' },
    { key: 'ack_state', label: 'AckState', minWidth: 'min-w-[120px]' }, // New column
    { key: 'ack_time', label: 'AckTime', minWidth: 'min-w-[170px]' },   // New column
  ];

  // Handler for ACK/UNACK
  const handleAckState = (idx, state) => {
    setAlarms(prev =>
      prev.map((alarm, i) =>
        i === idx ? { ...alarm, ack_state: state, ack_time: new Date().toISOString() } : alarm
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Bar: Title & Duration Filter */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-1">Alarms</h1>
            <p className="text-gray-600 text-lg">Real-time alarm monitoring and analysis</p>
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
                  value={customStart ? customStart : ''}
                  onChange={e => setCustomStart(e.target.value)}
                  className="w-44"
                  placeholder="Start Date"
                />
                <span className="mx-1 text-gray-500">to</span>
                <Input
                  type="datetime-local"
                  value={customEnd ? customEnd : ''}
                  onChange={e => setCustomEnd(e.target.value)}
                  className="w-44"
                  placeholder="End Date"
                />
              </div>
            )}
            <button
              className="ml-2 px-4 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition flex items-center gap-1"
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

      {/* Real-time Alarm Counts by Severity */}
      <motion.div className="flex gap-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
        {SEVERITIES.map(sev => {
          const Icon = sev.icon;
          return (
            <Card key={sev.key} className="flex-1 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className={`flex items-center gap-2 text-${sev.color}-600`}>
                  <Icon className={`h-5 w-5 text-${sev.color}-600`} />
                  {sev.label}
                </CardTitle>
                <Badge variant="secondary" className={`text-lg ${severityBadge[sev.key]}`}>
                  {alarmCounts[sev.key] || 0}
                </Badge>
              </CardHeader>
              <CardContent>
                <span className="text-xs text-gray-500">Active {sev.label} alarms</span>
              </CardContent>
            </Card>
          );
        })}
      </motion.div>

      {/* Alarm Table with Filters */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
        <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-900">Alarm List</CardTitle>
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
                  {alarms.length === 0 ? (
                    <tr>
                      <td colSpan={columns.length} className="text-center text-gray-400 py-4">
                        No alarms found
                      </td>
                    </tr>
                  ) : (
                    alarms.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE).map((alarm, idx) => (
                      <tr
                        key={alarm.id}
                        className={`${severityRowBg[alarm.severity]} ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                      >
                        <td className={`px-4 py-2 border-b border-gray-100 ${columns[0].minWidth} whitespace-nowrap`}>{alarm.alarm_list_id}</td>
                        <td className={`px-4 py-2 border-b border-gray-100 ${columns[1].minWidth} whitespace-nowrap`}>{alarm.alarmId}</td>
                        <td className={`px-4 py-2 border-b border-gray-100 ${columns[2].minWidth} whitespace-nowrap`}>{alarm.dateTime}</td>
                        <td className={`px-4 py-2 border-b border-gray-100 ${columns[3].minWidth} whitespace-nowrap`}>
                          <Badge className={`border ${severityBadge[alarm.severity]}`}>
                            {alarm.severity.charAt(0).toUpperCase() + alarm.severity.slice(1)}
                          </Badge>
                        </td>
                        <td className={`px-4 py-2 border-b border-gray-100 ${columns[4].minWidth} whitespace-nowrap`}>{alarm.probableCause}</td>
                        <td className={`px-4 py-2 border-b border-gray-100 ${columns[5].minWidth} whitespace-nowrap`}>{alarm.alarmType}</td>
                        <td className={`px-4 py-2 border-b border-gray-100 ${columns[6].minWidth} whitespace-nowrap`}>{alarm.specificProblem}</td>
                        <td className={`px-4 py-2 border-b border-gray-100 ${columns[7].minWidth} whitespace-nowrap`}>{alarm.notificationType}</td>
                        <td className={`px-4 py-2 border-b border-gray-100 ${columns[8].minWidth} whitespace-nowrap`}>
                          <Button
                            size="sm"
                            variant={alarm.ack_state === 'ACK' ? 'default' : 'outline'}
                            className="mr-2"
                            onClick={() => handleAckState(idx, 'ACK')}
                          >
                            ACK
                          </Button>
                          <Button
                            size="sm"
                            variant={alarm.ack_state === 'UNACK' ? 'default' : 'outline'}
                            onClick={() => handleAckState(idx, 'UNACK')}
                          >
                            UNACK
                          </Button>
                        </td>
                        <td className={`px-4 py-2 border-b border-gray-100 ${columns[9].minWidth} whitespace-nowrap`}>
                          {alarm.ack_time ? new Date(alarm.ack_time).toLocaleString() : ''}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {/* Pagination */}
            <div className="flex justify-end items-center gap-2 mt-4">
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1 rounded border bg-gray-100">Prev</button>
              <span className="text-sm">{page} / {Math.max(1, Math.ceil(alarms.length / PAGE_SIZE))}</span>
              <button disabled={page === Math.ceil(alarms.length / PAGE_SIZE) || alarms.length === 0} onClick={() => setPage(p => p + 1)} className="px-3 py-1 rounded border bg-gray-100">Next</button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Alarms;