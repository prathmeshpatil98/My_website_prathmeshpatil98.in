import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useMotionValue, AnimatePresence } from 'framer-motion';
import { Cpu, Mail, User, Code, ChevronRight, X, ExternalLink, Github, Zap, Linkedin, ArrowUp } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8000';

// 1. Star Warp Background (Canvas)
const StarField = () => {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const stars = Array.from({ length: 400 }).map(() => ({
      x: Math.random() * width - width / 2,
      y: Math.random() * height - height / 2,
      z: Math.random() * 1000,
    }));

    const animate = () => {
      ctx.fillStyle = '#030014';
      ctx.fillRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;

      stars.forEach(star => {
        star.z -= 2; // Speed
        if (star.z <= 0) {
          star.z = 1000;
          star.x = Math.random() * width - width / 2;
          star.y = Math.random() * height - height / 2;
        }

        const x = (star.x / star.z) * width + cx;
        const y = (star.y / star.z) * height + cy;
        const radius = (1 - star.z / 1000) * 3;

        // Draw Star
        ctx.beginPath();
        ctx.arc(x, y, radius > 0 ? radius : 0, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 220, 255, ${1 - star.z / 1000})`;
        ctx.fill();
      });

      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 bg-[#030014]" />;
};

// 2. Floating Dock Navigation
const FloatingDock = ({ onNavigate }) => {
  const links = [
    { id: 'hero', icon: <User size={20} />, label: 'Home' },
    { id: 'about-me', icon: <Cpu size={20} />, label: 'About' },
    { id: 'projects', icon: <Code size={20} />, label: 'Work' },
    { id: 'contact', icon: <Mail size={20} />, label: 'Contact' },
  ];

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] flex gap-4 px-6 py-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl shadow-indigo-500/10">
      {links.map((link) => (
        <button
          key={link.id}
          onClick={() => {
            if (onNavigate) onNavigate();
            document.getElementById(link.id)?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="group relative p-3 rounded-full hover:bg-white/10 transition-all text-slate-400 hover:text-white"
        >
          <span className="relative z-10">{link.icon}</span>
          <span className="absolute -top-12 left-1/2 -translate-x-1/2 px-2 py-1 bg-black/80 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-white/10">
            {link.label}
          </span>
          <motion.div
            className="absolute inset-0 bg-indigo-500/20 rounded-full opacity-0 group-hover:opacity-100 blur-md"
            layoutId="nav-glow"
          />
        </button>
      ))}
    </div>
  );
};

// 3. Project Detail View Overlay
const ProjectDetailOverlay = ({ project, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-[#030014]/90 backdrop-blur-xl overflow-y-auto"
    >
      <div className="relative min-h-screen pb-24">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="fixed top-8 right-8 z-[110] p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/10"
        >
          <X size={24} />
        </button>

        {/* Hero Header */}
        <div className="h-[60vh] relative flex items-end px-6 md:px-24 pb-16 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/20 to-[#030014] z-0" />
          <StarField />

          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="relative z-10 max-w-5xl"
          >
            <div className="flex gap-3 mb-6">
              {(project.tech || []).map(t => (
                <span key={t} className="px-3 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full text-sm font-mono tracking-wider">{t}</span>
              ))}
            </div>
            <h1 className="text-5xl md:text-8xl font-display font-bold text-white mb-6 leading-tight">
              {project.title}
            </h1>
          </motion.div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-6 md:px-24 grid lg:grid-cols-[1fr_300px] gap-16 mt-12 relative z-10">
          <div className="space-y-16">
            <motion.section
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-display font-bold text-white mb-4">The Challenge</h2>
              <p className="text-xl text-slate-300 leading-relaxed font-light">
                {project.challenge}
              </p>
            </motion.section>

            <motion.section
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-display font-bold text-white mb-4">The Solution</h2>
              <p className="text-xl text-slate-300 leading-relaxed font-light mb-8">
                {project.solution}
              </p>
              <p className="text-slate-400 leading-relaxed">
                {project.description}
              </p>
            </motion.section>

            <motion.section
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-display font-bold text-white mb-6">Key Engineering Features</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {(project.features || []).map((f, i) => (
                  <div key={i} className="p-6 bg-white/5 border border-white/5 rounded-2xl hover:border-indigo-500/30 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold mb-4 font-mono">{i + 1}</div>
                    <h3 className="text-white font-medium mb-1 text-lg">{f}</h3>
                  </div>
                ))}
              </div>
            </motion.section>
          </div>

          <div className="lg:sticky lg:top-8 h-fit space-y-8">
            <div className="p-8 border border-white/10 rounded-3xl bg-white/5 backdrop-blur-md">
              <h3 className="text-sm font-mono text-slate-500 uppercase tracking-widest mb-6">Project Links</h3>
              <div className="flex flex-col gap-4">
                <a href={project.link || '#'} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-3 w-full py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-600/20">
                  <ExternalLink size={18} /> View Live Deployment
                </a>
                <a href={project.github || '#'} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-3 w-full py-4 bg-white/5 border border-white/10 text-white font-medium rounded-xl hover:bg-white/10 transition-colors">
                  <Github size={18} /> View Source Code
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// 4. 3D Project Card
const ProjectCard3D = ({ project, onClick }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [10, -10]);
  const rotateY = useTransform(x, [-100, 100], [-10, 10]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(e.clientX - centerX);
    y.set(e.clientY - centerY);
  };

  return (
    <motion.div
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      onClick={onClick}
      className="relative h-full min-h-[400px] rounded-3xl bg-[#09090b]/40 border border-white/10 p-8 backdrop-blur-md group perspective-1000 cursor-pointer overflow-hidden transform transition-all duration-300"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div
        className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-3xl blur opacity-0 group-hover:opacity-20 transition duration-500"
        style={{ transform: "translateZ(-10px)" }}
      />

      <div className="relative z-10 flex flex-col h-full" style={{ transform: "translateZ(20px)" }}>
        <div className="mb-4">
          <div className="flex gap-2 mb-4">
            {(project.tech || []).slice(0, 3).map(t => (
              <span key={t} className="px-2 py-1 text-[10px] uppercase tracking-wider font-mono text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 rounded-md">
                {t}
              </span>
            ))}
          </div>
          <h3 className="text-3xl font-display font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-indigo-400 group-hover:to-cyan-400 transition-all">
            {project.title}
          </h3>
          <p className="text-slate-400 text-sm leading-relaxed line-clamp-4">
            {project.description}
          </p>
        </div>

        <div className="mt-auto pt-8 border-t border-white/5 flex items-center justify-between">
          <span className="text-xs font-mono text-slate-500 group-hover:text-indigo-400 transition-colors">EXPLORE CASE STUDY</span>
          <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-indigo-500 group-hover:text-white transition-all">
            <ChevronRight size={16} />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// 5. Advanced Contact Form
const ContactForm = () => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    projectType: 'AI Agent',
    message: ''
  });
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');

    const formData = new FormData();
    formData.append('name', formState.name);
    formData.append('email', formState.email);
    // Append project type to message for backend compatibility
    const finalMessage = `[Type: ${formState.projectType}]\n\n${formState.message}`;
    formData.append('message', finalMessage);

    // --- SERVERLESS CHANGE: Formspree Integration ---
    // 1. Go to https://formspree.io
    // 2. Create a new form
    // 3. Replace 'YOUR_FORMSPREE_ID' below with your actual Form ID (e.g., 'xmqvbdlp')
    const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mjkndgzk';

    try {
      console.log("Submitting to Formspree...");
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formState.name,
          email: formState.email,
          message: `[Type: ${formState.projectType}]\n\n${formState.message}`
        }),
      });

      console.log("Response status:", res.status);

      if (res.ok) {
        setStatus('success');
        setFormState({ name: '', email: '', projectType: 'AI Agent', message: '' });
      } else {
        const errorData = await res.json();
        console.error("Formspree Error:", errorData);
        setStatus('error');
      }
    } catch (err) {
      console.error("Network Error:", err);
      setStatus('error');
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <AnimatePresence mode='wait'>
        {status === 'success' ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-green-500/10 border border-green-500/20 rounded-3xl p-12 text-center backdrop-blur-xl"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 10 }}
              className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/20"
            >
              <Zap size={40} className="text-white fill-current" />
            </motion.div>
            <h3 className="text-3xl font-display font-bold text-white mb-4">Message Received!</h3>
            <p className="text-slate-300 text-lg">I'll analyze your request and get back to you within 24 hours.</p>
            <button
              onClick={() => setStatus('idle')}
              className="mt-8 px-6 py-3 bg-white/5 hover:bg-white/10 rounded-full text-sm font-bold transition-colors"
            >
              Send Another Message
            </button>
          </motion.div>
        ) : status === 'error' ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-500/10 border border-red-500/20 rounded-3xl p-12 text-center backdrop-blur-xl"
          >
            <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <X size={40} className="text-red-500" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Transmission Failed</h3>
            <p className="text-slate-400 mb-6">Create a GitHub Issue or try again later.</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setStatus('idle')}
                className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm font-bold transition-colors"
              >
                Try Again
              </button>
              <a
                href="mailto:prathampatil9798@gmail.com"
                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-full text-sm font-bold transition-colors"
              >
                Send Email Directly
              </a>
            </div>
          </motion.div>
        ) : (
          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit}
            className="relative z-10 bg-[#09090b]/60 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl shadow-indigo-500/5 group"
          >    <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 group-hover:opacity-50 transition-opacity" />

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-2">
                <label className="text-xs font-mono text-slate-400 ml-1">NAME</label>
                <input
                  required
                  type="text"
                  value={formState.name}
                  onChange={e => setFormState({ ...formState, name: e.target.value })}
                  placeholder="pratham patil"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-mono text-slate-400 ml-1">EMAIL</label>
                <input
                  required
                  type="email"
                  value={formState.email}
                  onChange={e => setFormState({ ...formState, email: e.target.value })}
                  placeholder="prathampatil9798@gmail.com"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2 mb-6">
              <label className="text-xs font-mono text-slate-400 ml-1">Why Contact</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {['AI Automation', 'For Hire', 'AI Voice Agent', 'Consult'].map(type => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFormState({ ...formState, projectType: type })}
                    className={`px-3 py-2 rounded-lg text-sm transition-all border ${formState.projectType === type ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10'}`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2 mb-8">
              <label className="text-xs font-mono text-slate-400 ml-1">PROJECT DETAILS</label>
              <textarea
                required
                value={formState.message}
                onChange={e => setFormState({ ...formState, message: e.target.value })}
                placeholder="Tell me about your project goals, timeline, and budget..."
                rows={4}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all resize-none"
              />
            </div>

            <button
              disabled={status === 'submitting'}
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {status === 'submitting' ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <Mail size={20} />
                  <span>Initiate Collaboration</span>
                </>
              )}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
};

// 6. Hacker Text Scramble Component
const HackerText = ({ text }) => {
  const [displayText, setDisplayText] = useState(text);
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*";

  const scramble = () => {
    let iterations = 0;
    const interval = setInterval(() => {
      setDisplayText(prev =>
        text.split("").map((letter, index) => {
          if (index < iterations) {
            return text[index];
          }
          return chars[Math.floor(Math.random() * chars.length)];
        }).join("")
      );

      if (iterations >= text.length) {
        clearInterval(interval);
      }

      iterations += 1 / 3;
    }, 30);
  };

  useEffect(() => {
    scramble();
  }, []);

  return (
    <motion.h1
      onMouseEnter={scramble}
      className="text-6xl md:text-8xl font-display font-bold mb-4 cursor-default tracking-tighter"
      style={{
        fontFamily: "'Share Tech Mono', monospace", // Ensure monospace-ish feel even if font is Inter
      }}
    >
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-white to-cyan-400">
        {displayText}
      </span>
    </motion.h1>
  );
};

// 7. Holographic Profile Component
const HoloProfile = () => {
  return (
    <div className="relative group w-full max-w-sm mx-auto">
      {/* Hologram Base Glow */}
      <div className="absolute -inset-4 bg-gradient-to-t from-indigo-500/20 to-cyan-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

      {/* Main Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-white/10 bg-[#09090b] shadow-2xl shadow-indigo-500/20"
      >
        {/* Animated Scanline Overlay */}
        <div className="absolute inset-0 z-20 pointer-events-none bg-[linear-gradient(transparent_0%,rgba(6,182,212,0.1)_50%,transparent_100%)] bg-[length:100%_4px] animate-scanlines opacity-30" />

        {/* Laser Scanner */}
        <motion.div
          animate={{ top: ['0%', '100%', '0%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="absolute left-0 right-0 h-1 bg-cyan-400/50 shadow-[0_0_20px_rgba(34,211,238,0.8)] z-30 blur-[2px]"
        />

        {/* Glitch Effect Layers (Red/Blue shift on hover) */}
        <div className="absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 mix-blend-color-dodge">
          <div className="absolute inset-0 bg-indigo-500/20 translate-x-[2px]" />
          <div className="absolute inset-0 bg-cyan-500/20 -translate-x-[2px]" />
        </div>

        {/* The Image */}
        <img
          src="/profile.jpg"
          alt="Prathamesh Patil"
          className="relative z-0 object-cover w-full h-full grayscale group-hover:grayscale-0 transition-all duration-700 scale-100 group-hover:scale-110"
        />

        {/* ID Card Overlay */}
        <div className="absolute bottom-4 left-4 right-4 p-4 bg-black/60 backdrop-blur-md border border-white/10 rounded-xl z-20 transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-bold text-sm">PRATHAMESH PATIL</h3>
              <p className="text-[10px] font-mono text-cyan-400 tracking-wider">prathampatil9798@gmail.com</p>
            </div>
            <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_#22c55e] animate-pulse" />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// 8. Command Core - Termninal Palette
const CommandPalette = ({ isOpen, onClose }) => {
  const [input, setInput] = useState('');
  const [logs, setLogs] = useState([
    { type: 'success', text: 'SYSTEM_READY' },
    { type: 'info', text: 'Type "help" for valid commands' }
  ]);
  const inputRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  const handleCommand = (e) => {
    if (e.key === 'Enter') {
      const cmd = input.trim().toLowerCase();
      const newLogs = [...logs, { type: 'input', text: `> ${input}` }];

      switch (cmd) {
        case 'help':
          newLogs.push(
            { type: 'info', text: 'AVAILABLE COMMANDS:' },
            { type: 'success', text: '  home     - Goto System Root' },
            { type: 'success', text: '  about    - View Bio-Data' },
            { type: 'success', text: '  work     - View Deployments' },
            { type: 'success', text: '  contact  - Send Signal' },
            { type: 'warning', text: '  clear    - Purge Logs' },
            { type: 'error', text: '  exit     - Close Terminal' }
          );
          break;
        case 'home':
          document.getElementById('hero').scrollIntoView({ behavior: 'smooth' });
          newLogs.push({ type: 'success', text: 'Navigating to SECTOR: ROOT...' });
          setTimeout(onClose, 1000);
          break;
        case 'about':
          document.getElementById('about-me').scrollIntoView({ behavior: 'smooth' });
          newLogs.push({ type: 'success', text: 'Navigating to SECTOR: PROFILE...' });
          setTimeout(onClose, 1000);
          break;
        case 'work':
          document.getElementById('projects').scrollIntoView({ behavior: 'smooth' });
          newLogs.push({ type: 'success', text: 'Navigating to SECTOR: PROJECTS...' });
          setTimeout(onClose, 1000);
          break;
        case 'contact':
          document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
          newLogs.push({ type: 'success', text: 'Navigating to SECTOR: COMMS...' });
          setTimeout(onClose, 1000);
          break;
        case 'clear':
          setLogs([{ type: 'success', text: 'SYSTEM_READY' }]);
          setInput('');
          return;
        case 'exit':
          onClose();
          return;
        default:
          newLogs.push({ type: 'error', text: `UNKNOWN COMMAND: "${cmd}"` });
      }

      setLogs(newLogs);
      setInput('');
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-xl flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="w-full max-w-2xl bg-[#0c0c0c] border border-green-500/30 rounded-lg shadow-[0_0_50px_rgba(34,197,94,0.1)] overflow-hidden font-mono text-sm"
      >
        {/* Header */}
        <div className="bg-white/5 px-4 py-2 border-b border-white/5 flex items-center justify-between">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/50" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
            <div className="w-3 h-3 rounded-full bg-green-500/50" />
          </div>
          <span className="text-slate-500 text-xs">COMMAND CORE v1.0</span>
        </div>

        {/* Terminal Body */}
        <div className="p-6 h-[400px] overflow-y-auto custom-scrollbar flex flex-col">
          {logs.map((log, i) => (
            <div key={i} className={`mb-1 ${log.type === 'input' ? 'text-slate-300 font-bold' :
              log.type === 'error' ? 'text-red-400' :
                log.type === 'success' ? 'text-green-400' :
                  log.type === 'warning' ? 'text-yellow-400' :
                    'text-slate-400'
              }`}>
              {log.text}
            </div>
          ))}
          <div ref={bottomRef} className="flex items-center gap-2 mt-2 text-green-500">
            <span>➜</span>
            <span>~</span>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleCommand}
              className="bg-transparent border-none outline-none flex-1 text-white placeholder-slate-700"
              placeholder="Type command..."
              autoFocus
            />
          </div>
        </div>

        {/* Footer hints */}
        <div className="px-4 py-2 bg-white/5 border-t border-white/5 text-[10px] text-slate-500 flex justify-between">
          <span>STATUS: ONLINE</span>
          <span>TYPE "HELP" FOR LIST</span>
        </div>
      </motion.div>
    </motion.div>
  );
};

// 9. Advanced 3D Footer
const Footer3D = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative z-10 pt-20 pb-10 px-6 border-t border-white/5 bg-[#030014]">
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12 mb-16">
        <div className="md:col-span-2 space-y-6">
          <h2 className="text-2xl font-display font-bold text-white">Prathamesh Patil</h2>
          <p className="text-slate-400 max-w-sm leading-relaxed">
            Architecting the future of AI with agentic workflows and immersive web experiences.
          </p>
          <div className="flex items-center gap-2 text-sm font-mono text-green-400 bg-green-500/10 px-3 py-1 rounded-full w-fit border border-green-500/20">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            SYSTEM STATUS: ONLINE
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Navigation</h3>
          <ul className="space-y-2 text-slate-400">
            {['Home', 'About', 'Work', 'Contact'].map((item) => (
              <li key={item}>
                <button
                  onClick={() => document.getElementById(item === 'Home' ? 'hero' : item === 'Work' ? 'projects' : item.toLowerCase().replace(' ', '-')).scrollIntoView({ behavior: 'smooth' })}
                  className="hover:text-indigo-400 transition-colors"
                >
                  {item}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Connect</h3>
          <div className="flex gap-4">
            <a href="https://www.linkedin.com/in/prathmeshpatil98/" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:bg-[#0077b5] hover:text-white transition-all hover:scale-110">
              <Linkedin size={20} />
            </a>
            <a href="https://github.com/prathmeshpatil98" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:bg-black hover:text-white transition-all hover:scale-110">
              <Github size={20} />
            </a>
            <a href="mailto:prathampatil9798@gmail.com" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:bg-red-500 hover:text-white transition-all hover:scale-110">
              <Mail size={20} />
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-slate-600 text-sm">
          © {new Date().getFullYear()} Prathamesh Patil. All rights reserved.
        </p>
        <button
          onClick={scrollToTop}
          className="p-3 rounded-full bg-white/5 hover:bg-indigo-600 text-slate-400 hover:text-white transition-all group"
        >
          <ArrowUp size={20} className="group-hover:-translate-y-1 transition-transform" />
        </button>
      </div>
    </footer>
  );
};

// --- Main Application ---
export default function App() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isCmdOpen, setIsCmdOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCmdOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    setProjects([
      {
        title: 'Terminal Based AI Voice Cursor',
        description: 'A voice controlled AI coding assistant that generates production ready applications in real time in VS code CLI. Features seamless voice interaction and intelligent error handling.',
        tech: ['Python', 'LangGraph', 'Groq API'],
        features: ['Voice-to-Code', 'Event Driven', 'Real-time Error Handling'],
        challenge: 'Developers often break flow to type complex commands or look up syntax. The goal was to enable hands-free coding and rapid prototyping directly in the terminal.',
        solution: 'Optimized pipeline with Groq LPU and local VAD. LangGraph manages the complex state machine needed for multi-step code generation tasks.'
      },
      {
        title: 'AI Chat Agent – Facebook Messenger',
        description: 'A dual-persona AI agent for Facebook Messenger. Offers professional support for pages and engaging, context-aware interactions for DMs using n8n and Groq.',
        tech: ['n8n', 'Groq LLM', 'Webhook'],
        features: ['Dual Persona', 'Auto-Routing', 'Context Memory'],
        challenge: 'Managing diverse customer interactions on social media requires switching between professional support and engaging community building. Automated systems often feel robotic.',
        solution: 'Built a dual-persona agent using n8n for workflow automation. It intelligently routes messages and switches tone (Professional vs. Casual/Flirty) based on user intent and context.'
      },
      {
        title: 'Trading Chatbot for Financial Firm',
        description: 'An LLM-based Q&A system for financial queries using LLaMA 3.1. Reduces customer support workload by providing instant, accurate answers from internal documents.',
        tech: ['RAG', 'LLaMA 3.1', 'LangChain'],
        features: ['Secure RAG', 'Instant QA', 'Citation Support'],
        challenge: 'Customer care staff were overwhelmed with repetitive queries about trading data and documents. The firm needed an instant, accurate Q&A system.',
        solution: 'Designed a RAG-based chatbot using LLaMA 3.1 and LangChain. It ingests complex financial documents and provides instant, cited answers with strict data security boundaries.'
      }
    ]);
  }, []);

  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);

  return (
    <div className="bg-[#030014] min-h-screen text-white font-sans selection:bg-indigo-500/30 overflow-x-hidden perspective-1000">
      <StarField />
      <div className="noise-overlay absolute inset-0 z-[1] pointer-events-none opacity-20" />
      <CommandPalette isOpen={isCmdOpen} onClose={() => setIsCmdOpen(false)} />

      <AnimatePresence>
        {selectedProject && (
          <ProjectDetailOverlay
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>

      <FloatingDock onNavigate={() => setSelectedProject(null)} />

      {/* HERO SECTION */}
      <section id="hero" className="relative z-10 h-screen flex items-center justify-center px-6">
        <motion.div
          style={{ opacity, scale }}
          className="text-center max-w-5xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur"
          >
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-mono text-slate-300">AI Prompt Engineer | Agentic AI Developer</span>
          </motion.div>
          <div className="mb-8 h-32 flex items-center justify-center">
            <HackerText text="PRATHAMESH PATIL" />
          </div>
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="text-2xl md:text-3xl font-light text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400 animate-gradient-x"
          >
            Building Production Ready AI Systems & AI Voice Agents.
          </motion.h2>


          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
            Agentic AI Engineer architecting next gen agentic workflows.
            Turning complex problems into elegant code.
          </p>


          <div className="flex justify-center gap-6">
            <button onClick={() => document.getElementById('projects').scrollIntoView({ behavior: 'smooth' })} className="px-8 py-4 bg-indigo-600 rounded-full font-bold hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/25 active:scale-95">
              View My Projects
            </button>
            <button onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })} className="px-8 py-4 bg-white/5 border border-white/10 rounded-full font-bold hover:bg-white/10 transition-all active:scale-95">
              Contact Me
            </button>
            <a href="https://www.linkedin.com/in/prathmeshpatil98/" target="_blank" rel="noreferrer" className="w-14 h-14 flex items-center justify-center bg-[#0077b5]/20 border border-[#0077b5]/30 rounded-full text-[#0077b5] hover:bg-[#0077b5]/30 hover:scale-110 transition-all">
              <Linkedin size={24} />
            </a>
          </div>
        </motion.div>
      </section>

      {/* ABOUT SECTION */}
      <section id="about-me" className="relative z-10 py-32 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">The Architect's Mindset</h2>
            <p className="text-lg text-slate-400 leading-relaxed mb-6">
              I don't just Make Workflows & write code; I design AI systems. From low latency voice agents to high frequency trading Chatbots, I treat every project as a piece of high performance art.
            </p>
            <div className="grid grid-cols-2 gap-4 mt-8">
              {[
                { label: 'Code & Tools', val: 'Python | FastAPI | Langchain | Langgraph' },
                { label: 'LLM & Agent Tools', val: 'N8N | vapi | Hugging Face | OpenAI | Ollama | Groq | RAG | MCP' },
                { label: 'Prompting Techniques', val: 'Zero Shot | Few Shot | Chain of Thought (CoT)' },
                { label: 'Cloud & DevOps', val: 'Azure | Docker | Git | Langfuse' }
              ].map((item, i) => (
                <div key={i} className="p-4 bg-white/5 border border-white/10 rounded-xl">
                  <div className="text-xs text-slate-500 uppercase tracking-widest mb-1">{item.label}</div>
                  <div className="font-mono text-indigo-300">{item.val}</div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex justify-center"
          >
            <HoloProfile />
          </motion.div>
        </div>
      </section>

      {/* WORK SECTION */}
      <section id="projects" className="relative z-10 py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">Agentic Architectures, LLM Pipelines & Automation</h2>
            <p className="text-slate-400 max-w-xl">
              Where engineering meets AI autonomy, solving challenges with precision and speed.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <ProjectCard3D
                  project={p}
                  onClick={() => setSelectedProject(p)}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section id="contact" className="relative z-10 py-32 px-6">
        <div className="max-w-4xl mx-auto mb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">Ready to Scale?</h2>
            <p className="text-xl text-slate-400">
              Let's build something extraordinary. Tell me about your vision.
            </p>
          </motion.div>
        </div>

        <ContactForm />
      </section>

      {/* FOOTER */}
      {/* FOOTER */}
      <Footer3D />
    </div>
  );
}
