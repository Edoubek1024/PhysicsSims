import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const ease = [0.22, 1, 0.36, 1] as const;

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 backdrop-blur-md bg-[#030507]/80 border-b border-white/[0.05]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center font-bold text-[#030507] group-hover:shadow-lg group-hover:shadow-blue-400/30 transition-all">
              φ
            </div>
            <span className="text-lg font-bold text-white hidden sm:inline">PhysicsSims</span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            <Link
              to="/dashboard"
              className="px-4 py-2 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-white/[0.05] transition-all duration-200"
            >
              Simulations
            </Link>
            <a
              href="https://github.com/IlliniOpenEdu/PhysicsSims"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-white/[0.05] transition-all duration-200"
            >
              GitHub
            </a>
            <a
              href="/PhysicsSims/about"
              className="px-4 py-2 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-white/[0.05] transition-all duration-200"
            >
              About
            </a>
          </div>

          {/* CTA Button */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/dashboard"
              className="px-5 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-sm font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-200 active:scale-95"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-white/[0.05] text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
              />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <motion.div
            className="md:hidden bg-[#0c1018] border-t border-white/[0.05]"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="px-2 py-3 space-y-1">
              <Link
                to="/dashboard"
                className="block px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/[0.05] transition-all"
              >
                Simulations
              </Link>
              <a
                href="https://github.com/IlliniOpenEdu/PhysicsSims"
                target="_blank"
                rel="noreferrer"
                className="block px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/[0.05] transition-all"
              >
                GitHub
              </a>
              <a
                href="/about"
                className="block px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/[0.05] transition-all"
              >
                About
              </a>
              <a
                href="/instructor"
                className="block px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/[0.05] transition-all"
              >
                Instructor
              </a>
              <Link
                to="/dashboard"
                className="block mt-2 px-3 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-sm font-semibold text-center"
              >
                Get Started
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
}

export function Home() {
  return (
    <div className="bg-[#030507] text-white min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Background elements */}
        <div className="pointer-events-none absolute inset-0 select-none">
          <div className="absolute top-0 inset-x-0 h-[60vh] bg-[radial-gradient(ellipse_70%_55%_at_50%_0%,rgba(56,189,248,0.15),transparent)]" />
          <div className="absolute bottom-1/3 right-0 w-96 h-96 rounded-full blur-3xl opacity-20 bg-blue-500" />
          <div className="absolute bottom-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20 bg-cyan-500" />
        </div>

        <div className="relative max-w-6xl mx-auto">
          <motion.div
            className="text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease }}
          >
            <motion.div
              className="inline-block mb-6"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1, ease }}
            >
              <span className="px-4 py-2 rounded-full border border-blue-400/30 bg-blue-400/10 text-blue-200 text-[0.75rem] font-semibold uppercase tracking-[0.3em]">
                Interactive Physics Learning
              </span>
            </motion.div>

            <motion.h1
              className="text-[clamp(2.5rem,8vw,5.5rem)] font-bold leading-[1.1] tracking-[-0.02em] mt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15, ease }}
            >
              Visualize Physics in
              <span className="block bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                Real Time
              </span>
            </motion.h1>

            <motion.p
              className="text-lg text-slate-400 mt-8 leading-relaxed max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25, ease }}
            >
              Explore kinematics, dynamics, electromagnetism, and more with our interactive simulations. Designed for students and educators who want to deeply understand physics through hands-on exploration.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center mt-10"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35, ease }}
            >
              <Link
                to="/dashboard"
                className="px-8 py-4 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold hover:shadow-lg hover:shadow-blue-500/40 transition-all duration-200 active:scale-95 text-center"
              >
                Explore All Labs
              </Link>
              <a
                href="https://github.com/IlliniOpenEdu/PhysicsSims"
                target="_blank"
                rel="noreferrer"
                className="px-8 py-4 rounded-lg border border-white/20 text-white font-semibold hover:border-white/40 hover:bg-white/[0.05] transition-all duration-200 text-center"
              >
                View on GitHub
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <motion.section
        className="relative py-16 px-4 border-y border-white/[0.05] bg-white/[0.015]"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-16">
            {[
              { label: '25+', desc: 'Simulations' },
              { label: '3', desc: 'Physics Tracks' },
              { label: 'Free', desc: 'Forever' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <p className="text-3xl sm:text-4xl font-bold">{stat.label}</p>
                <p className="text-slate-500 text-sm uppercase tracking-wider mt-2">{stat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <section className="relative py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold">Why Use PhysicsSims?</h2>
            <p className="text-slate-400 mt-4 text-lg">
              Built for understanding, not memorization
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: '🎯',
                title: 'Interactive Labs',
                desc: 'Hands-on exploration of physics concepts with real-time visualization and instant feedback.',
              },
              {
                icon: '📊',
                title: 'Real-Time Visualization',
                desc: 'See how physics works in real time. Adjust parameters and watch results change instantly.',
              },
              {
                icon: '🔬',
                title: 'Research-Based Design',
                desc: 'Built by educators with expertise in physics education and learning science.',
              },
              {
                icon: '🌐',
                title: 'Always Accessible',
                desc: 'Web-based platform works on any device. No installation or subscriptions required.',
              },
              {
                icon: '📱',
                title: 'Student-Friendly',
                desc: 'Clean, intuitive interface designed to minimize cognitive load and maximize learning.',
              },
              {
                icon: '🎓',
                title: 'Educator Tools',
                desc: 'Instructors can use PhysicsSims in lectures, labs, and assignments.',
              },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                className="p-6 rounded-2xl border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/[0.12] transition-all duration-300 hover:-translate-y-1"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-slate-400 text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <motion.section
        className="relative py-20 px-4"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-3xl mx-auto">
          <div className="relative rounded-3xl border border-white/[0.1] bg-gradient-to-b from-white/[0.08] to-white/[0.02] p-12 text-center overflow-hidden">
            {/* Background glow */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_0%,rgba(56,189,248,0.1),transparent)] pointer-events-none" />

            <motion.div
              className="relative z-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Ready to Explore Physics?
              </h2>
              <p className="text-slate-400 text-lg mb-8">
                Start with any simulation or browse our complete collection of interactive labs.
              </p>
              <Link
                to="/dashboard"
                className="inline-block px-8 py-4 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold hover:shadow-lg hover:shadow-blue-500/40 transition-all duration-200 active:scale-95"
              >
                Launch Dashboard
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="border-t border-white/[0.05] py-12 px-4 bg-white/[0.015]">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center font-bold text-[#030507] text-xs">
                  φ
                </div>
                <span className="font-bold">PhysicsSims</span>
              </div>
              <p className="text-slate-500 text-sm">
                Interactive physics visualizations for everyone.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-3 text-sm uppercase tracking-wider text-slate-400">
                Product
              </h3>
              <ul className="space-y-2 text-sm text-slate-500">
                <li>
                  <Link to="/dashboard" className="hover:text-white transition">
                    Simulations
                  </Link>
                </li>
                <li>
                  <a href="/about" className="hover:text-white transition">
                    About
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3 text-sm uppercase tracking-wider text-slate-400">
                Resources
              </h3>
              <ul className="space-y-2 text-sm text-slate-500">
                <li>
                  <a
                    href="https://github.com/IlliniOpenEdu/PhysicsSims"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-white transition"
                  >
                    GitHub
                  </a>
                </li>
                <li>
                  <a href="/instructor" className="hover:text-white transition">
                    Instructors
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3 text-sm uppercase tracking-wider text-slate-400">
                Legal
              </h3>
              <ul className="space-y-2 text-sm text-slate-500">
                <li>
                  <a href="#" className="hover:text-white transition">
                    License
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/[0.05] pt-8 text-center text-sm text-slate-600">
            <p>© 2026 IlliniOpenEdu. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
