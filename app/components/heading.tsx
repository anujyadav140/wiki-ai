"use client";

import React from "react";
import { motion } from "framer-motion";

function Header() {
  return (
    <motion.div
      className="h-10 w-10 rounded-full bg-blue-950"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    />
  );
}

export default Header;
