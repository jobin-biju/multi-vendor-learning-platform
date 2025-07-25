import React, { useState } from "react";
import { motion } from "framer-motion";

const CourseMascot = () => {
  const [showPopup, setShowPopup] = useState(false);

  const handleClick = () => {
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 3000); // Auto-close after 3 sec
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: [0, -5, 0] }}
      transition={{
        duration: 3,
        repeat: Infinity,
        repeatType: "mirror",
        ease: "easeInOut",
      }}
      onClick={handleClick}
      style={{
        position: "fixed",
        bottom: "30px",
        left: "30px", // ✅ Changed from right to left
        width: "80px",
        height: "80px",
        zIndex: 999,
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Graduation Cap */}
      <motion.div
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: "mirror",
        }}
        style={{
          width: "30px",
          height: "30px",
          backgroundColor: "#000",
          clipPath: "polygon(50% 0%, 100% 35%, 50% 70%, 0% 35%)",
          marginBottom: "8px",
        }}
      ></motion.div>

      {/* Course Book */}
      <motion.div
        style={{
          width: "60px",
          height: "45px",
          position: "relative",
          transformStyle: "preserve-3d",
        }}
      >
        {/* Left Cover */}
        <motion.div
          style={{
            width: "30px",
            height: "100%",
            backgroundColor: "#4B2E83",
            position: "absolute",
            left: "0",
            top: "0",
            transformOrigin: "right",
            borderRadius: "4px 0 0 4px",
          }}
          animate={{ rotateY: [0, -20, 0] }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        />

        {/* Right Cover */}
        <motion.div
          style={{
            width: "30px",
            height: "100%",
            backgroundColor: "#6C3FB1",
            position: "absolute",
            right: "0",
            top: "0",
            transformOrigin: "left",
            borderRadius: "0 4px 4px 0",
          }}
          animate={{ rotateY: [0, 20, 0] }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        />

        {/* Pages */}
        <motion.div
          style={{
            width: "48px",
            height: "38px",
            background: "white",
            position: "absolute",
            left: "6px",
            top: "4px",
            borderRadius: "3px",
            zIndex: -1,
            boxShadow: "0 0 6px rgba(255,255,255,0.5)",
          }}
          animate={{ scale: [1, 1.03, 1] }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            repeatType: "mirror",
          }}
        />
      </motion.div>

      {/* Glow Light */}
      <motion.div
        animate={{ opacity: [0.3, 0.8, 0.3] }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          position: "left",
          bottom: "-5px",
          width: "60px",
          height: "8px",
          borderRadius: "50%",
          backgroundColor: "#fff",
          filter: "blur(5px)",
          opacity: 0.5,
        }}
      />

      {/* ✅ Popup Message */}
      {showPopup && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          style={{
            position: "absolute",
            bottom: "90px",
            left: "0",
            backgroundColor: "#fff",
            color: "#333",
            padding: "8px 12px",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
            fontSize: "14px",
            fontWeight: "500",
          }}
        >
          👋 Welcome to the Learning Platform!
        </motion.div>
      )}
    </motion.div>
  );
};

export default CourseMascot;
