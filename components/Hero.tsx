'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function Hero() {
  return (
    <section id="home" className="min-h-screen flex items-center px-6 md:px-12 lg:px-24 py-20">
      <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 items-center">
        
        {/* Left Side - Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.h1 
            className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            I Build Products{' '}
            <span className="text-primary">People Actually Use</span>
          </motion.h1>

          <motion.p 
            className="text-lg md:text-xl opacity-80 mb-4 max-w-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Full-stack developer shipping Flutter & Next.js apps to real users.
          </motion.p>

          <motion.p 
            className="text-lg md:text-xl opacity-80 mb-10 max-w-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            Currently scaling <span className="text-primary font-semibold">Muslifie</span> — a Muslim travel marketplace live on iOS & Android.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            className="flex flex-wrap gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <a
              href="#projects"
              className="px-8 py-4 bg-cta text-background font-semibold rounded-lg hover:opacity-90 transition-all duration-300 hover:scale-105"
            >
              View My Work
            </a>
            <a
              href="#contact"
              className="px-8 py-4 border-2 border-primary text-primary font-semibold rounded-lg hover:bg-primary hover:bg-opacity-10 transition-all duration-300"
            >
              Let's Talk
            </a>
          </motion.div>
        </motion.div>

      {/* Right Side - Muslifie Mockup with Real Screenshot */}
      <motion.div
          className="relative hidden lg:flex justify-center items-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {/* Glow Effect */}
          <div className="absolute inset-0 bg-primary opacity-20 blur-[120px] rounded-full"></div>
          
          {/* Phone Mockup with App Screenshot */}
          <div className="relative z-10 w-[300px] h-[600px] bg-gradient-to-br from-[#1A1F3A] to-[#0F1323] rounded-[3rem] border-4 border-primary border-opacity-40 shadow-2xl overflow-hidden">
            
            {/* App Screenshot */}
            <div className="relative w-full h-full p-3">
              <div className="w-full h-full rounded-[2rem] overflow-hidden bg-white">
                <Image
                  src="/muslifie-app.png"
                  alt="Muslifie App Screenshot"
                  width={300}
                  height={600}
                  className="w-full h-full object-cover"
                  priority
                />
              </div>
            </div>

            {/* Glow on the phone */}
            <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent pointer-events-none"></div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
