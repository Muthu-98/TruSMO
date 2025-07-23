// Mock data for TruSMO platform

export const dashboardStats = {
  totalSites: 245,
  totalGNBs: 1250,
  activeConnections: 15420,
  coreNTKStatus: {
    online: 98.5,
    offline: 1.5
  }
};

export const countries = [
  { id: 'all', name: 'All Countries' },
  { id: 'india', name: 'India' },
  { id: 'singapore', name: 'Singapore' },
  { id: 'thailand', name: 'Thailand' }
];

export const places = [
  { id: 'all', name: 'All Places' },
  { id: 'bangalore', name: 'Bangalore' },
  { id: 'chennai', name: 'Chennai' },
  { id: 'hyderabad', name: 'Hyderabad' },
  { id: 'delhi', name: 'Delhi' }
];

export const siteLocations = [
  { id: 1, name: 'Bangalore Site', lat: 12.9716, lng: 77.5946, gnbCount: 45, country: 'India' },
  { id: 2, name: 'Chennai Site', lat: 13.0827, lng: 80.2707, gnbCount: 32, country: 'India' },
  { id: 3, name: 'Hyderabad Site', lat: 17.3850, lng: 78.4867, gnbCount: 28, country: 'India' },
  { id: 4, name: 'Delhi Site', lat: 28.7041, lng: 77.1025, gnbCount: 38, country: 'India' }
];

export const vendors = [
  {
    id: 1,
    manufacturer: 'Nokia',
    product: 'AirScale Base Station',
    maxNoOfGNBCuCP: 100,
    maxNoOfGNBCuUP: 50,
    maxNoOfNrcellCuPerGNBCUCP: 8,
    maxNoOfGNBDu: 200,
    maxNoOfNrCellDuPerGNBDU: 12,
    createdAt: '2024-01-15'
  },
  {
    id: 2,
    manufacturer: 'Ericsson',
    product: 'Baseband 6630',
    maxNoOfGNBCuCP: 80,
    maxNoOfGNBCuUP: 40,
    maxNoOfNrcellCuPerGNBCUCP: 6,
    maxNoOfGNBDu: 150,
    maxNoOfNrCellDuPerGNBDU: 10,
    createdAt: '2024-01-20'
  },
  {
    id: 3,
    manufacturer: 'Huawei',
    product: 'BBU5900',
    maxNoOfGNBCuCP: 120,
    maxNoOfGNBCuUP: 60,
    maxNoOfNrcellCuPerGNBCUCP: 10,
    maxNoOfGNBDu: 250,
    maxNoOfNrCellDuPerGNBDU: 15,
    createdAt: '2024-02-01'
  }
];

export const devices = [
  {
    id: 1,
    gNBId: 'GNB001',
    name: 'Bangalore-Central-01',
    serialNumber: 'SN123456789',
    netconfIP: '192.168.1.100',
    pnfRegistered: true,
    notificationFormat: 'JSON',
    manufacturer: 'Nokia',
    product: 'AirScale Base Station',
    latitude: 12.9716,
    longitude: 77.5946,
    ssh: {
      username: 'admin',
      port: 22,
      tls: true
    },
    availableDUs: 3,
    availableCUCPs: 2,
    availableCUUPs: 1
  },
  {
    id: 2,
    gNBId: 'GNB002',
    name: 'Chennai-North-01',
    serialNumber: 'SN987654321',
    netconfIP: '192.168.1.101',
    pnfRegistered: true,
    notificationFormat: 'XML',
    manufacturer: 'Ericsson',
    product: 'Baseband 6630',
    latitude: 13.0827,
    longitude: 80.2707,
    ssh: {
      username: 'admin',
      port: 22,
      tls: false
    },
    availableDUs: 2,
    availableCUCPs: 1,
    availableCUUPs: 1
  }
];

export const mockDUs = [
  {
    id: 1,
    duId: 'DU001',
    duName: 'BLR-DU-01',
    length: 150,
    gnbId: 'GNB001',
    availableNrsector: 4,
    availableBWP: 2,
    availableCell: 6
  },
  {
    id: 2,
    duId: 'DU002',
    duName: 'BLR-DU-02',
    length: 200,
    gnbId: 'GNB001',
    availableNrsector: 3,
    availableBWP: 1,
    availableCell: 4
  }
];

export const mockCells = [
  {
    id: 1,
    cellId: 'CELL001',
    cellState: 'ACTIVE',
    adminState: 'UNLOCKED',
    phyCellId: 100,
    ulNrFreq: 3700,
    dlNrFreq: 3600,
    duId: 'DU001',
    cellLocalId: 0,
    administrativeState: 'UNLOCKED',
    nRPCI: 100,
    nRTAC: 'TAC001',
    arfcnDL: 632000,
    arfcnUL: 632000,
    arfcnSUL: 0,
    bSChannelBwDL: 100,
    bSChannelBwUL: 100,
    bSChannelBwSUL: 0,
    ssbFrequency: 632000,
    ssbPeriodicity: 20,
    ssbSubCarrierSpacing: 30,
    ssbOffset: 0,
    ssbDuration: 1,
    nRSectorCarrierRef: 1,
    bWPRef: '1'
  }
];

export const mockNRSectors = [
  {
    id: 1,
    sectorId: 'SECTOR001',
    arfcnDL: 632000,
    arfcnUL: 632000,
    bSChannelBwDL: 100,
    bSChannelBwUL: 100,
    duId: 'DU001',
    sectorEquipmentFunctionRef: 'SEF001',
    txDirection: 'UL_DL',
    configuredMaxTxPower: 46,
    configuredMaxTxEIRP: 65
  }
];

export const mockBWPs = [
  {
    id: 1,
    bwpId: '1',
    subcarrierSpacing: 'kHz30',
    numberOfRBs: 50,
    duId: 'DU001',
    cyclicPrefix: 'normal',
    startRB: 0
  }
];

export const mockCUCPs = [
  {
    id: 1,
    cucpId: 'CUCP001',
    name: 'BLR-CUCP-01',
    length: 100,
    gnbId: 'GNB001',
    availableCells: 3
  }
];

export const mockCUCPCells = [
  {
    id: 1,
    cellId: 'CUCP-CELL001',
    cellLocalId: 1,
    plmnInfoList: ['50101'],
    nrFrequencyRef: 'FREQ001',
    cucpId: 'CUCP001'
  }
];

export const mockCUUPs = [
  {
    id: 1,
    cuupId: 'CUUP001',
    name: 'BLR-CUUP-01',
    length: 80,
    gnbId: 'GNB001'
  }
];

export const mockNetworks = [
  {
    id: 1,
    gnbCuId: 1,
    gnbId: 'GNB001',
    xn: { localAddr: '192.168.1.10', remoteAddr: '192.168.1.11' },
    ng: { localAddr: '192.168.1.12', remoteAddr: '192.168.1.13' },
    f1: { localAddr: '192.168.1.14', remoteAddr: '192.168.1.15' },
    e1: { localAddr: '192.168.1.16', remoteAddr: '192.168.1.17' }
  }
];

export const mockNetworkDetails = {
  xn: [
    {
      id: 1,
      xnId: 'XN001',
      xncLocal: '192.168.1.10',
      xncRemote: '192.168.1.11',
      xnuLocal: '192.168.1.20',
      xnuRemote: '192.168.1.21'
    }
  ],
  f1: [
    {
      id: 1,
      f1Id: 'F1001',
      f1cLocal: '192.168.1.14',
      f1cRemote: '192.168.1.15',
      f1uLocal: '192.168.1.24',
      f1uRemote: '192.168.1.25'
    }
  ],
  ng: [
    {
      item: 'NGU Local',
      currentValue: '192.168.1.12'
    },
    {
      item: 'NGU Remote',
      currentValue: '192.168.1.13'
    },
    {
      item: 'NGC Local',
      currentValue: '192.168.1.22'
    },
    {
      item: 'NGC Remote',
      currentValue: '192.168.1.23'
    }
  ],
  e1: [
    {
      item: 'E1U Local',
      currentValue: '192.168.1.16'
    },
    {
      item: 'E1U Remote',
      currentValue: '192.168.1.17'
    },
    {
      item: 'E1C Local',
      currentValue: '192.168.1.26'
    },
    {
      item: 'E1C Remote',
      currentValue: '192.168.1.27'
    }
  ]
};