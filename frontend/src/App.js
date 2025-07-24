import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from './components/ui/toaster';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import VendorConfiguration from './pages/VendorConfiguration';
import DeviceConfiguration from './pages/DeviceConfiguration';
import NRNetworkConfiguration from './pages/NRNetworkConfiguration';
import DUView from './pages/DUView';
import CellView from './pages/CellView';
import NRSectorView from './pages/NRSectorView';
import BWPView from './pages/BWPView';
import CUCPView from './pages/CUCPView';
import CUCPCellView from './pages/CUCPCellView';
import CUUPView from './pages/CUUPView';
import NetworksView from './pages/NetworksView';
import NetworkDetails from './pages/NetworkDetails';
import CellRelation from './pages/CellRelation'; // Add this import
import FreqRelation from './pages/FreqRelation'; // Add this import
import ExternalCell from './pages/ExternalCell'; // Add this import
import Alarms from './pages/Alarms'; // Add this import
import DeviceKPI from './pages/DeviceKPI'; // Add this import
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/alarms" element={<Alarms />} />
            <Route path="/device-kpi" element={<DeviceKPI />} /> {/* Add this route */}
            <Route path="/vendor-configuration" element={<VendorConfiguration />} />
            <Route path="/device-configuration" element={<DeviceConfiguration />} />
            <Route path="/nr-network-configuration" element={<NRNetworkConfiguration />} />
            <Route path="/device/:gnbId/du" element={<DUView />} />
            <Route path="/device/:gnbId/du/:duId/cell" element={<CellView />} />
            <Route path="/device/:gnbId/du/:duId/nrsector" element={<NRSectorView />} />
            <Route path="/device/:gnbId/du/:duId/bwp" element={<BWPView />} />
            <Route path="/device/:gnbId/cucp" element={<CUCPView />} />
            <Route path="/device/:gnbId/cucp/:cucpId/cell" element={<CUCPCellView />} />
            <Route path="/device/:gnbId/cuup" element={<CUUPView />} />
            <Route path="/device/:gnbId/networks" element={<NetworksView />} />
            <Route path="/device/:gnbId/networks/:type/:id" element={<NetworkDetails />} />
            <Route path="/cell-relation" element={<CellRelation />} /> 
            <Route path="/freq-relation" element={<FreqRelation />} />
            <Route path="/external-cell" element={<ExternalCell />} />
          </Routes>
        </Layout>
        <Toaster />
      </div>
    </Router>
  );
}

export default App;