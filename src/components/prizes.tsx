'use client'
import React from 'react'
import { motion } from 'framer-motion'

const Prizes = () => {
  return (
    <motion.div 
      className='fixed bottom-4 right-4 md:bottom-8 md:right-8 z-50 bg-gradient-to-br from-pink-400 via-pink-500 to-red-500 rounded-full p-3 md:p-4 lg:p-6 shadow-2xl max-w-[200px] md:max-w-none'
      initial={{ scale: 0, opacity: 0 }}
      animate={{ 
        scale: 1, 
        opacity: 1,
        y: [0, -10, 0]
      }}
      transition={{
        scale: { duration: 0.5, ease: "easeOut" },
        opacity: { duration: 0.5 },
        y: { 
          duration: 2, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }
      }}
      whileHover={{ 
        scale: 1.1,
        rotate: 5,
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.95 }}
    >
      <div className='text-center'>
        {/* Mobile Version - Minimal Content */}
        <div className='md:hidden'>
          <motion.h2 
            className='text-lg font-bold text-white drop-shadow-lg'
            animate={{ 
              scale: [1, 1.05, 1],
              rotate: [0, 2, -2, 0]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            🏆 ₹10K
          </motion.h2>
          <motion.p 
            className='text-xs text-white/90 mt-1'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            Win Prizes!
          </motion.p>
        </div>

        {/* Desktop Version - Full Content */}
        <div className='hidden md:block'>
          <motion.h2 
            className='text-lg lg:text-2xl font-bold text-white mb-2 drop-shadow-lg'
            animate={{ 
              scale: [1, 1.05, 1],
              rotate: [0, 2, -2, 0]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            🏆 Participate
          </motion.h2>
          <motion.p 
            className='text-md font-semibold text-white drop-shadow-md mb-2'
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Win Exciting Rewards!
          </motion.p>
          <motion.p 
            className='text-lg font-bold text-white drop-shadow-lg mb-3'
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            Worth ₹10,000
          </motion.p>
          <motion.div 
            className='text-sm text-white/90 space-y-1'
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            <motion.p
              whileHover={{ scale: 1.1, color: "#ffffff" }}
              transition={{ duration: 0.2 }}
              className='leading-tight'
            >
              🎁 Cash Prizes
            </motion.p>
            <motion.p
              whileHover={{ scale: 1.1, color: "#ffffff" }}
              transition={{ duration: 0.2 }}
              className='leading-tight'
            >
              🏅 Certificates
            </motion.p>
            <motion.p
              whileHover={{ scale: 1.1, color: "#ffffff" }}
              transition={{ duration: 0.2 }}
              className='leading-tight'
            >
              🌟 Recognition
            </motion.p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

export default Prizes