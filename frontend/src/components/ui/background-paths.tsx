"use client";

import { motion } from "framer-motion";
import { Button } from "./button";
import { useNavigate } from "react-router-dom";
import { GraduationCap, ArrowRight, BookOpen, Brain, Users } from "lucide-react";

function FloatingPaths({ position }: { position: number }) {
  const paths = Array.from({ length: 36 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
      380 - i * 5 * position
    } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
      152 - i * 5 * position
    } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
      684 - i * 5 * position
    } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
    width: 0.5 + i * 0.03,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none">
      <svg
        className="w-full h-full"
        viewBox="0 0 696 316"
        fill="none"
      >
        <title>Background Paths</title>
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke="#ffffff"
            strokeWidth={path.width}
            strokeOpacity={0.05 + path.id * 0.015}
            initial={{ pathLength: 0.3, opacity: 0.4 }}
            animate={{
              pathLength: 1,
              opacity: [0.15, 0.45, 0.15],
              pathOffset: [0, 1, 0],
            }}
            transition={{
              duration: 20 + Math.random() * 10,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
        ))}
      </svg>
    </div>
  );
}

const features = [
  { icon: Brain, title: "AI Insights", desc: "Personalized academic advice driven by Gemini AI." },
  { icon: BookOpen, title: "Smart Tracking", desc: "Automated attendance tracking & risk alerts." },
  { icon: Users, title: "Multi-Tenancy", desc: "Secure data isolation per university via join codes." },
];

export function BackgroundPaths({ title = "UniSync AI" }: { title?: string }) {
  const words = title.split(" ");
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-black text-white selection:bg-white/20">

      {/* Animated SVG paths */}
      <div className="absolute inset-0">
        <FloatingPaths position={1} />
        <FloatingPaths position={-1} />
      </div>

      {/* Subtle Premium Glow blobs */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] rounded-full pointer-events-none mix-blend-screen overflow-hidden"
        style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 60%)', filter: 'blur(80px)' }} />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] rounded-full pointer-events-none mix-blend-screen overflow-hidden"
        style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.05) 0%, transparent 60%)', filter: 'blur(80px)' }} />

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 md:px-8 text-center flex flex-col items-center mt-12 mb-20">

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 mb-8 px-4 py-1.5 rounded-full text-xs font-semibold border border-white/10 bg-white/5 text-neutral-300 backdrop-blur-md shadow-sm"
        >
          <GraduationCap size={14} />
          Smart Academic Command Center
        </motion.div>

        {/* Animated Title */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-6 flex flex-wrap justify-center gap-x-4 md:gap-x-6"
        >
          <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tighter leading-tight flex flex-wrap justify-center">
            {words.map((word, wordIndex) => (
              <span key={wordIndex} className="inline-block mr-4 md:mr-6 last:mr-0">
                {word.split("").map((letter, letterIndex) => (
                  <motion.span
                    key={`${wordIndex}-${letterIndex}`}
                    initial={{ y: 80, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{
                      delay: wordIndex * 0.1 + letterIndex * 0.04,
                      type: "spring",
                      stiffness: 150,
                      damping: 25,
                    }}
                    className={`inline-block ${wordIndex === words.length - 1 ? "text-transparent bg-clip-text bg-gradient-to-r from-neutral-200 to-neutral-600" : "text-white"}`}
                  >
                    {letter}
                  </motion.span>
                ))}
            </span>
            ))}
          </h1>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-lg md:text-xl mb-12 max-w-2xl mx-auto text-neutral-400 font-medium"
        >
          Track attendance, manage assignments, chat with AI, and stay ahead — all seamlessly integrated into one minimal platform.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-24 w-full"
        >
          {/* Primary CTA */}
          <Button
            variant="default"
            onClick={() => navigate('/auth')}
            className="rounded-full px-8 py-6 text-sm font-bold bg-white text-black hover:bg-neutral-200 transition-all duration-300 hover:scale-105"
          >
            Get Started Free
            <ArrowRight size={16} className="ml-2" />
          </Button>

          {/* Secondary CTA */}
          <Button
            variant="outline"
            onClick={() => navigate('/auth')}
            className="rounded-full px-8 py-6 text-sm font-semibold bg-transparent hover:bg-white/10 text-white border-white/20 transition-all duration-300 hover:scale-105"
          >
            Login / Sign Up
          </Button>
        </motion.div>

        {/* Features Row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.7 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl"
        >
          {features.map((f, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="group relative p-8 rounded-[2rem] text-left bg-neutral-950 border border-white/5 hover:border-white/10 transition-colors duration-300 overflow-hidden"
            >
              {/* Subtle top inner glow for boxes */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="w-12 h-12 rounded-full flex items-center justify-center mb-6 bg-white/5 border border-white/10 text-neutral-300 group-hover:bg-white/10 group-hover:scale-110 transition-all duration-300">
                <f.icon size={22} strokeWidth={1.5} />
              </div>
              <h3 className="font-semibold text-lg text-white mb-2 tracking-tight">{f.title}</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Bottom hint */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        className="absolute bottom-6 text-xs text-neutral-600 font-mono tracking-wider"
      >
        UniSync AI v2.0
      </motion.p>
    </div>
  );
}
