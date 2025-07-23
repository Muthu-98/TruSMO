import React from "react";
import { Menu, User, LogOut, Settings } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback } from "./ui/avatar";

const Topbar = ({ onMenuToggle, sidebarOpen }) => {
  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 h-16 bg-white/90 backdrop-blur-md border-b border-gray-200/50 shadow-sm"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center h-full px-4">
        {/* Left: Hamburger Menu */}
        <div className="flex items-center justify-start w-1/3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuToggle}
            className="hover:bg-gray-100 transition-colors z-50"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        {/* Center: TruSMO Logo */}
        <div className="flex items-center justify-center w-1/3">
          <motion.div
            className="flex items-center space-x-2"
            whileHover={{ scale: 1.02 }}
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">T</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900">TruSMO</h1>
          </motion.div>
        </div>

        {/* Right: Profile Icon */}
        <div className="flex items-center justify-end w-1/3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full z-50">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-blue-500 text-white">
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1 leading-none">
                  <p className="font-medium">Admin User</p>
                  <p className="w-[200px] truncate text-sm text-muted-foreground">
                    admin@trusmo.com
                  </p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </motion.header>
  );
};

export default Topbar;
