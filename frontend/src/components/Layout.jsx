import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Set default sidebar open on desktop
  useEffect(() => {
    const handleResize = () => {
      setSidebarOpen(window.innerWidth >= 1024);
    };
    handleResize(); // run once
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-blue-50">
      <Topbar
        onMenuToggle={() => setSidebarOpen((prev) => !prev)}
        sidebarOpen={sidebarOpen}
      />

      <div className="flex pt-16">
        <AnimatePresence mode="wait">
          {sidebarOpen && (
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          )}
        </AnimatePresence>

        <motion.main
          className="flex-1 p-6 transition-all duration-300"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          key={location.pathname}
          transition={{ duration: 0.3 }}
        >
          <div className="max-w-7xl mx-auto">{children}</div>
        </motion.main>
      </div>
    </div>
  );
};

export default Layout;
