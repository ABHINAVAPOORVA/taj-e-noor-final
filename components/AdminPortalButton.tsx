import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Shield, X } from "lucide-react";

export function AdminPortalButton() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    navigate("/admin/sign-in");
  };

  // Only show on home page
  if (location.pathname !== "/") {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-[9999]">
      <motion.button
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="flex items-center gap-2 bg-gradient-to-r from-purple-800 to-purple-900 hover:from-purple-700 hover:to-purple-800 text-white px-4 py-3 rounded-full shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 border-2 border-purple-500"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Shield size={20} className="text-purple-200" />
        <span className="text-sm font-medium">Admin Portal</span>
      </motion.button>

      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-full right-0 mb-2 bg-purple-900 text-white text-xs px-3 py-2 rounded-lg shadow-xl whitespace-nowrap border border-purple-500"
          >
            🔒 Restricted Access Only
            <div className="absolute -bottom-1 right-4 w-2 h-2 bg-purple-900 transform rotate-45 border-r border-b border-purple-500"></div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}