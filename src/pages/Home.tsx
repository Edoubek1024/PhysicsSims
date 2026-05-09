// // DEPRECATED: This file has been refactored.
// // The content is now split into:
// // - src/Home.tsx (new landing page with improved navbar)
// // - src/pages/Dashboard.tsx (simulations dashboard - contains the old Home content)
// //
// // This file is kept only for backwards compatibility.

// export { Dashboard as Home } from './Dashboard';
// //     'We are officially live as an interactive learning platform. Additional simulations and features will be introduced throughout the semester.',
// //   buttons: [
// //     { text: 'Start Exploring', url: '#mechanics' },
// //     { text: 'Project Repository', url: 'https://github.com/IlliniOpenEdu/PhysicsSims', newTab: true },
// //   ],
// // };

// // const base = import.meta.env.BASE_URL;
// // const PREVIEW_FALLBACK = `${base}thumbnails/preview.png`;
// // const DEPLOY_WORKFLOW_URL = 'https://github.com/IlliniOpenEdu/PhysicsSims/actions/workflows/deploy.yml';
// // const DEPLOY_STATUS_API =
// //   'https://api.github.com/repos/IlliniOpenEdu/PhysicsSims/actions/workflows/deploy.yml/runs?per_page=1';

// // type DeployUiState = { label: string; detail: string; dotClass: string };
// // type SimItem = { title: string; path: string; description: string; preview: string; status?: string };

// // const DEPLOY_LOADING_STATE: DeployUiState = {
// //   label: 'Checking',
// //   detail: 'Loading latest deploy run...',
// //   dotClass: 'bg-amber-300',
// // };
// // const DEPLOY_ERROR_STATE: DeployUiState = {
// //   label: 'Unavailable',
// //   detail: 'Could not fetch deploy status',
// //   dotClass: 'bg-slate-400',
// // };

// // const getDeployUiState = (status?: string, conclusion?: string): DeployUiState => {
// //   if (status === 'completed') {
// //     if (conclusion === 'success')
// //       return { label: 'Online', detail: 'Latest deploy succeeded.', dotClass: 'bg-emerald-400 animate-pulse' };
// //     if (conclusion === 'failure' || conclusion === 'timed_out')
// //       return { label: 'Issues', detail: 'Latest deploy failed.', dotClass: 'bg-rose-300 animate-ping' };
// //     if (conclusion === 'cancelled' || conclusion === 'skipped')
// //       return { label: 'Paused', detail: 'Latest deploy was not completed.', dotClass: 'bg-amber-300 animate-bounce' };
// //   }
// //   if (status === 'queued') return { label: 'Queued', detail: 'Deploy run is queued', dotClass: 'bg-amber-300' };
// //   if (status === 'in_progress' || status === 'waiting' || status === 'requested')
// //     return { label: 'Deploying', detail: 'Deploy is currently running', dotClass: 'bg-sky-300' };
// //   return DEPLOY_ERROR_STATE;
// // };

// // function SimPreviewImg({ src, alt, className }: { src: string; alt?: string; className?: string }) {
// //   return (
// //     <img
// //       src={src}
// //       alt={alt ?? ''}
// //       className={className}
// //       onError={(e) => {
// //         const el = e.currentTarget;
// //         if (el.src.includes('placeholder.svg')) return;
// //         el.src = PREVIEW_FALLBACK;
// //       }}
// //     />
// //   );
// // }

// // function StatPill({ value, label }: { value: number | string; label: string }) {
// //   return (
// //     <div className="text-center">
// //       <p className="text-2xl font-semibold text-white sm:text-3xl">{value}</p>
// //       <p className="mt-1 text-[0.63rem] uppercase tracking-[0.24em] text-slate-600">{label}</p>
// //     </div>
// //   );
// // }

// // const ease = [0.22, 1, 0.36, 1] as const;

// // const mechanicsSims: SimItem[] = [
// //   { title: '2-D Kinematics', path: '/kinematics-2d', description: 'Projectile and planar motion with adjustable launch angle and speed.', preview: `${base}thumbnails/kinematics2d.png` },
// //   { title: '1-D Kinematics', path: '/kinematics', description: 'Vertical motion with constant acceleration — throw a ball and watch position, velocity, and time.', preview: `${base}thumbnails/kinematics.png` },
// //   { title: 'Force Simulator', path: '/forces', description: 'Explore net force, mass, and resulting motion in a simple force diagram setup.', preview: `${base}thumbnails/forces.png` },
// //   { title: 'Simple Friction', path: '/gravity-friction', description: 'Friction on a horizontal surface with a rope — tension and kinetic friction.', preview: `${base}thumbnails/friction.png` },
// //   { title: 'Box on Incline', path: '/box-incline', description: 'Forces on a block on a ramp: weight components, normal force, and friction.', preview: `${base}thumbnails/incline.png` },
// //   { title: 'Spring Force', path: '/spring-force', description: "Hooke's Law and spring dynamics.", preview: `${base}thumbnails/spring.png` },
// //   { title: 'Pulley System', path: '/pulley-system', description: 'Two-mass Atwood machine: tension, gravity, and motion when masses differ.', preview: `${base}thumbnails/pulley.png` },
// //   { title: 'Energy Hills', path: '/energy-hills', description: 'Potential ↔ kinetic energy conversion on smooth, bumpy, and looped terrain.', preview: `${base}thumbnails/work.png` },
// //   { title: 'Spring Energy', path: '/spring-energy', description: "Oscillating spring–mass system: Hooke's law, energy exchange, and conserved total energy.", preview: `${base}thumbnails/spring.png` },
// //   { title: 'Work in Dynamics', path: '/work-in-dynamics', description: 'Incline, rope pull, and spring tabs with live work tracking (W = F·Δr) per force.', preview: `${base}thumbnails/incline.png` },
// //   { title: 'Center of Mass', path: '/center-of-mass', description: 'Drag multiple masses in 2D and track the system center of mass in real time.', preview: `${base}thumbnails/forces.png` },
// //   { title: 'Impulse Builder', path: '/impulse-builder', description: 'Constant horizontal force over a chosen duration: J = FΔt, Δp, and coasting motion.', preview: `${base}thumbnails/forces.png` },
// //   { title: '1D Collision', path: '/momentum-collision-1d', description: 'Elastic and inelastic 1D collisions with live momentum tracking.', preview: `${base}thumbnails/pulley.png` },
// //   { title: '2D Collisions', path: '/momentum-collision-2d', description: 'Elastic disks in a square arena with per-ball Σpₓ, Σpᵧ readouts.', preview: `${base}thumbnails/pulley.png` },
// // ];

// // const enmSims: SimItem[] = [
// //   { title: 'Large Hadron Collider', path: '/lhc', description: 'Simulate particle beam collisions in the LHC — real-time ring and tunnel views.', preview: `${base}thumbnails/LCH.png`, status: 'Featured experience' },
// //   { title: 'Wave Equation 3D', path: '/wave-3d', description: 'Real-time 3D wave equation visualization with camera orbit, mode switching, and live parameter control.', preview: `${base}thumbnails/wave.png`, status: 'Full 3D rendering' },
// //   { title: "Coulomb's Law Explorer", path: '/columbs-law', description: 'Map field lines and force vectors around charges in real time.', preview: `${base}thumbnails/columbs.png` },
// //   { title: "Gauss's Law Visualizer", path: '/gauss-law', description: 'Explore electric flux and field distributions for different charge configurations.', preview: `${base}thumbnails/gauss.png` },
// //   { title: "Maxwell's Equations", path: '/maxwell', description: 'Interactively visualize the interplay of electric and magnetic fields.', preview: `${base}thumbnails/maxwell.png` },
// //   { title: "Ampere's Law Simulator", path: '/amperes-law', description: 'Analyze current loops and their magnetic fields in cross-sectional area.', preview: `${base}thumbnails/ampere.png` },
// //   { title: "Faraday's Law Simulator", path: '/faradays-law', description: 'Visualize changing magnetic flux and induced EMF.', preview: `${base}thumbnails/faraday.png` },
// //   { title: 'RC Circuit Lab', path: '/rc-circuit', description: 'Explore capacitor charging and discharging with live voltage and current scopes.', preview: `${base}thumbnails/RC.png` },
// //   { title: 'Magnetic Field Simulator', path: '/mag-field', description: 'Visualize magnetic fields around point charges and magnets.', preview: `${base}thumbnails/mag.png` },
// //   { title: 'Capacitor Lab', path: '/capacitor', description: 'Understand how capacitors store charge and energy.', preview: `${base}thumbnails/capacitor.png` },
// // ];

// // const staticsSims: SimItem[] = [
// //   { title: 'Beam Balance Simulator', path: '/beam-balance', description: 'Explore torque and equilibrium with a virtual beam balance.', preview: `${base}thumbnails/beambalance.png`, status: 'Torque challenge' },
// //   { title: 'Beam Load Analyzer', path: '/distributed-load', description: 'Set end supports, apply forces and moments, then inspect reactions, shear, and moment diagrams.', preview: `${base}thumbnails/beam.png`, status: 'Structural response' },
// // ];

// // export function Home() {
// //   const [isLaunchAnnouncementOpen, setIsLaunchAnnouncementOpen] = useState(false);
// //   const [deployState, setDeployState] = useState<DeployUiState>(DEPLOY_LOADING_STATE);
// //   const [deployRunUrl, setDeployRunUrl] = useState(DEPLOY_WORKFLOW_URL);
// //   const [deployUpdatedAt, setDeployUpdatedAt] = useState<string | null>(null);
// //   const [adminControls, setAdminControls] = useState<AdminControlState>(loadAdminState);

// //   const mergedAnnouncement = adminControls.announcement.enabled
// //     ? {
// //         id: adminControls.announcement.id,
// //         title: adminControls.announcement.title,
// //         description: adminControls.announcement.description,
// //         buttons: [{ text: adminControls.announcement.primaryButtonText, url: adminControls.announcement.primaryButtonUrl, newTab: adminControls.announcement.openPrimaryInNewTab }],
// //       }
// //     : DEFAULT_HOME_ANNOUNCEMENT;

// //   const dismissKey = `home-announcement-dismissed:${mergedAnnouncement.id}`;

// //   useEffect(() => {
// //     try {
// //       setIsLaunchAnnouncementOpen(window.localStorage.getItem(dismissKey) !== 'true');
// //     } catch {
// //       setIsLaunchAnnouncementOpen(true);
// //     }
// //   }, [dismissKey]);

// //   useEffect(() => {
// //     const onStorage = () => setAdminControls(loadAdminState());
// //     window.addEventListener('storage', onStorage);
// //     return () => window.removeEventListener('storage', onStorage);
// //   }, []);

// //   useEffect(() => {
// //     const controller = new AbortController();

// //     const fetchDeploy = async () => {
// //       try {
// //         if (adminControls.bugTestControls.simulateSlowNetworkMs > 0) {
// //           await new Promise((r) => window.setTimeout(r, adminControls.bugTestControls.simulateSlowNetworkMs));
// //         }
// //         if (adminControls.bugTestControls.mockDeployStatus !== 'auto') {
// //           const mockMap = {
// //             online: { label: 'Online', detail: 'Forced by internal test control.', dotClass: 'bg-emerald-400 animate-pulse' },
// //             issues: { label: 'Issues', detail: 'Forced by internal test control.', dotClass: 'bg-rose-300 animate-ping' },
// //             deploying: { label: 'Deploying', detail: 'Forced by internal test control.', dotClass: 'bg-sky-300' },
// //           } as const;
// //           if (adminControls.bugTestControls.mockDeployStatus in mockMap) {
// //             setDeployState(mockMap[adminControls.bugTestControls.mockDeployStatus as keyof typeof mockMap]);
// //           }
// //           return;
// //         }
// //         const res = await fetch(DEPLOY_STATUS_API, { signal: controller.signal, headers: { Accept: 'application/vnd.github+json' }, cache: 'no-store' });
// //         if (!res.ok) throw new Error(`${res.status}`);
// //         const data = await res.json() as { workflow_runs?: Array<{ status?: string; conclusion?: string; html_url?: string; updated_at?: string }> };
// //         const run = data.workflow_runs?.[0];
// //         if (!run) { setDeployState(DEPLOY_ERROR_STATE); return; }
// //         setDeployState(getDeployUiState(run.status, run.conclusion));
// //         setDeployRunUrl(run.html_url ?? DEPLOY_WORKFLOW_URL);
// //         setDeployUpdatedAt(run.updated_at ?? null);
// //       } catch {
// //         if (!controller.signal.aborted) setDeployState(DEPLOY_ERROR_STATE);
// //       }
// //     };

// //     void fetchDeploy();
// //     return () => controller.abort();
// //   }, [adminControls.bugTestControls.mockDeployStatus, adminControls.bugTestControls.simulateSlowNetworkMs]);

// //   const closeLaunchAnnouncement = () => {
// //     setIsLaunchAnnouncementOpen(false);
// //     try { window.localStorage.setItem(dismissKey, 'true'); } catch { /* ignore */ }
// //   };

// //   const isMaintenanceMode = adminControls.featureFlags.maintenanceMode;
// //   const featureExperimentalMechanics = adminControls.featureFlags.experimentalMechanics;
// //   const featuredSimPath = adminControls.contentOverrides.featuredSimPath;

// //   if (adminControls.bugTestControls.forceHomeError) {
// //     throw new Error('Home error forced by admin bug/test controls.');
// //   }

// //   const filterVisible = (sim: SimItem) => adminControls.simulationVisibility[sim.path] !== false;
// //   const visibleMechanics = mechanicsSims.filter(filterVisible);
// //   const visibleENM = enmSims.filter(filterVisible);
// //   const visibleStatics = staticsSims.filter(filterVisible);
// //   const allCount = visibleMechanics.length + visibleENM.length + visibleStatics.length;

// //   const sections = [
// //     { id: 'mechanics', num: '01', short: 'Mechanics', title: 'Kinematics and Dynamics', accent: 'text-blue-400', chipClass: 'border-blue-400/40 bg-blue-400/10 text-blue-200', arrowClass: 'text-blue-300', sims: visibleMechanics, extra: featureExperimentalMechanics ? '· Experimental labs enabled' : '' },
// //     { id: 'enm', num: '02', short: 'E&M', title: 'Electricity and Magnetism', accent: 'text-emerald-400', chipClass: 'border-emerald-400/40 bg-emerald-400/10 text-emerald-200', arrowClass: 'text-emerald-300', sims: visibleENM, extra: '' },
// //     { id: 'statics', num: '03', short: 'Statics', title: 'Equilibrium and Supports', accent: 'text-red-400', chipClass: 'border-red-400/40 bg-red-400/10 text-red-200', arrowClass: 'text-red-300', sims: visibleStatics, extra: '' },
// //   ];

// //   return (
// //     <>
// //       <AnnouncementPopup announcement={mergedAnnouncement} isOpen={isLaunchAnnouncementOpen} onClose={closeLaunchAnnouncement} />

// //       <div className="bg-[#030507] text-white">

// //         {/* ─── HERO ─── */}
// //         <section className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-4 pb-32 text-center">
// //           {/* Ambient light */}
// //           <div className="pointer-events-none absolute inset-0 select-none">
// //             <div className="absolute inset-x-0 top-0 h-[60vh] bg-[radial-gradient(ellipse_70%_55%_at_50%_0%,rgba(56,189,248,0.11),transparent)]" />
// //             <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
// //           </div>

// //           <motion.div
// //             className="relative max-w-5xl"
// //             initial={{ opacity: 0, y: 28 }}
// //             animate={{ opacity: 1, y: 0 }}
// //             transition={{ duration: 0.9, ease }}
// //           >
// //             <motion.p
// //               className="mb-6 inline-block rounded-full border border-sky-400/20 bg-sky-400/8 px-4 py-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.3em] text-sky-300/80"
// //               initial={{ opacity: 0, y: 12 }}
// //               animate={{ opacity: 1, y: 0 }}
// //               transition={{ duration: 0.6, delay: 0.05, ease }}
// //             >
// //               IlliniOpenEdu
// //             </motion.p>

// //             <motion.h1
// //               className="text-[clamp(2.6rem,6.5vw,5.5rem)] font-semibold leading-[1.04] tracking-[-0.025em] text-white"
// //               initial={{ opacity: 0, y: 20 }}
// //               animate={{ opacity: 1, y: 0 }}
// //               transition={{ duration: 0.8, delay: 0.1, ease }}
// //             >
// //               {adminControls.contentOverrides.homeHeroTitle}
// //             </motion.h1>

// //             <motion.p
// //               className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-slate-400 sm:text-lg"
// //               initial={{ opacity: 0, y: 16 }}
// //               animate={{ opacity: 1, y: 0 }}
// //               transition={{ duration: 0.7, delay: 0.18, ease }}
// //             >
// //               {adminControls.contentOverrides.homeHeroSubtitle}
// //             </motion.p>

// //             <motion.div
// //               className="mt-9 flex flex-wrap justify-center gap-3"
// //               initial={{ opacity: 0, y: 12 }}
// //               animate={{ opacity: 1, y: 0 }}
// //               transition={{ duration: 0.6, delay: 0.26, ease }}
// //             >
// //               <Link
// //                 to={featuredSimPath}
// //                 className="rounded-full bg-white px-7 py-3 text-sm font-semibold text-[#030507] transition-all duration-200 hover:bg-slate-100 active:scale-[0.97]"
// //               >
// //                 Open a lab
// //               </Link>
// //               <a
// //                 href="#mechanics"
// //                 className="rounded-full border border-white/20 px-7 py-3 text-sm font-semibold text-white transition-all duration-200 hover:border-white/40 hover:bg-white/[0.07] active:scale-[0.97]"
// //               >
// //                 Browse sims
// //               </a>
// //             </motion.div>
// //           </motion.div>

// //           {/* Scroll indicator */}
// //           <motion.div
// //             className="absolute bottom-10 left-1/2 -translate-x-1/2"
// //             initial={{ opacity: 0 }}
// //             animate={{ opacity: 0.4 }}
// //             transition={{ duration: 1, delay: 1.1 }}
// //           >
// //             <div className="flex h-9 w-5 items-start justify-center rounded-full border border-white/20 pt-1.5">
// //               <motion.div
// //                 className="h-1.5 w-0.5 rounded-full bg-white/60"
// //                 animate={{ y: [0, 5, 0] }}
// //                 transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
// //               />
// //             </div>
// //           </motion.div>
// //         </section>

// //         {/* ─── STATS STRIP ─── */}
// //         <motion.div
// //           className="border-y border-white/[0.05] bg-white/[0.015] py-10"
// //           initial={{ opacity: 0 }}
// //           whileInView={{ opacity: 1 }}
// //           viewport={{ once: true }}
// //           transition={{ duration: 0.7, ease }}
// //         >
// //           <div className="mx-auto flex max-w-2xl flex-wrap justify-center gap-10 px-4 sm:gap-16">
// //             <StatPill value={allCount} label="Simulations" />
// //             <div className="h-10 w-px self-center bg-white/[0.08]" />
// //             <StatPill value={3} label="Tracks" />
// //             <div className="h-10 w-px self-center bg-white/[0.08]" />
// //             <StatPill value="Free" label="Always" />
// //           </div>
// //         </motion.div>

// //         {/* ─── SECTIONS ─── */}
// //         <div className="mx-auto max-w-6xl px-4">
// //           {isMaintenanceMode && (
// //             <div className="mb-6 mt-10 rounded-2xl border border-amber-300/35 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
// //               Maintenance mode is enabled. Browsing is limited while updates are in progress.
// //             </div>
// //           )}

// //           {sections.map((section, sectionIndex) => {
// //             if (section.sims.length === 0) return null;
// //             const [lead, second, ...rest] = section.sims;

// //             return (
// //               <section
// //                 key={section.id}
// //                 id={section.id}
// //                 data-hash={section.id}
// //                 className={sectionIndex === 0 ? 'pb-28 pt-24' : 'border-t border-white/[0.05] pb-28 pt-24'}
// //               >
// //                 {/* Section heading */}
// //                 <motion.div
// //                   className="mb-14"
// //                   initial={{ opacity: 0, y: 28 }}
// //                   whileInView={{ opacity: 1, y: 0 }}
// //                   viewport={{ once: true, margin: '-80px' }}
// //                   transition={{ duration: 0.65, ease }}
// //                 >
// //                   <p className={`text-[0.65rem] font-semibold uppercase tracking-[0.32em] ${section.accent}`}>
// //                     {section.num} — {section.short}
// //                     {section.extra ? <span className="ml-2 font-normal text-slate-500">{section.extra}</span> : null}
// //                   </p>
// //                   <h2 className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-[3.25rem]">
// //                     {section.title}
// //                   </h2>
// //                   <p className="mt-2 text-sm text-slate-600">{section.sims.length} simulations</p>
// //                 </motion.div>

// //                 {isMaintenanceMode && (
// //                   <div className="mb-6 rounded-xl border border-amber-300/25 bg-amber-500/10 px-3 py-2 text-xs text-amber-100">
// //                     Simulation launch is temporarily paused by maintenance mode.
// //                   </div>
// //                 )}

// //                 {/* Primary bento: featured (2/3) + second (1/3) */}
// //                 <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
// //                   {lead && (
// //                     <motion.div
// //                       className="md:col-span-2"
// //                       initial={{ opacity: 0, y: 28 }}
// //                       whileInView={{ opacity: 1, y: 0 }}
// //                       viewport={{ once: true, margin: '-60px' }}
// //                       transition={{ duration: 0.65, ease }}
// //                     >
// //                       {lead.path && !isMaintenanceMode ? (
// //                         <Link
// //                           to={lead.path}
// //                           className="group flex h-full flex-col overflow-hidden rounded-3xl border border-white/[0.07] bg-[#0c1018] transition-all duration-300 hover:-translate-y-1 hover:border-white/[0.14]"
// //                         >
// //                           <div className="relative overflow-hidden">
// //                             <SimPreviewImg
// //                               src={lead.preview}
// //                               alt={`${lead.title} preview`}
// //                               className="aspect-[16/9] w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
// //                             />
// //                             <div className="absolute inset-0 bg-gradient-to-t from-[#0c1018]/70 to-transparent" />
// //                           </div>
// //                           <div className="flex flex-1 flex-col p-7">
// //                             {lead.status && (
// //                               <span className={`mb-3 inline-block self-start rounded-full border px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.12em] ${section.chipClass}`}>
// //                                 {lead.status}
// //                               </span>
// //                             )}
// //                             <h3 className="text-xl font-semibold text-white">{lead.title}</h3>
// //                             <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-400">{lead.description}</p>
// //                             <span className={`mt-5 inline-flex items-center gap-2 text-sm font-medium transition-all duration-200 group-hover:gap-3 ${section.arrowClass}`}>
// //                               Open lab →
// //                             </span>
// //                           </div>
// //                         </Link>
// //                       ) : (
// //                         <div className="flex h-full flex-col overflow-hidden rounded-3xl border border-white/[0.05] bg-[#0c1018] opacity-40">
// //                           <div className="aspect-[16/9] w-full bg-white/[0.03]" />
// //                           <div className="p-7">
// //                             <h3 className="text-xl font-semibold text-white">{lead.title}</h3>
// //                             <p className="mt-2 text-sm text-slate-400">{lead.description}</p>
// //                           </div>
// //                         </div>
// //                       )}
// //                     </motion.div>
// //                   )}

// //                   {second && (
// //                     <motion.div
// //                       initial={{ opacity: 0, y: 28 }}
// //                       whileInView={{ opacity: 1, y: 0 }}
// //                       viewport={{ once: true, margin: '-60px' }}
// //                       transition={{ duration: 0.65, delay: 0.07, ease }}
// //                     >
// //                       {second.path && !isMaintenanceMode ? (
// //                         <Link
// //                           to={second.path}
// //                           className="group flex h-full flex-col overflow-hidden rounded-3xl border border-white/[0.07] bg-[#0c1018] transition-all duration-300 hover:-translate-y-1 hover:border-white/[0.14]"
// //                         >
// //                           <div className="relative overflow-hidden">
// //                             <SimPreviewImg
// //                               src={second.preview}
// //                               alt={`${second.title} preview`}
// //                               className="h-36 w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
// //                             />
// //                             <div className="absolute inset-0 bg-gradient-to-t from-[#0c1018]/50 to-transparent" />
// //                           </div>
// //                           <div className="flex flex-1 flex-col p-6">
// //                             {second.status && (
// //                               <span className={`mb-3 inline-block self-start rounded-full border px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.12em] ${section.chipClass}`}>
// //                                 {second.status}
// //                               </span>
// //                             )}
// //                             <h3 className="text-base font-semibold text-white">{second.title}</h3>
// //                             <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-400">{second.description}</p>
// //                             <span className={`mt-4 inline-flex items-center gap-2 text-sm font-medium transition-all duration-200 group-hover:gap-3 ${section.arrowClass}`}>
// //                               Open lab →
// //                             </span>
// //                           </div>
// //                         </Link>
// //                       ) : (
// //                         <div className="flex h-full flex-col overflow-hidden rounded-3xl border border-white/[0.05] bg-[#0c1018] opacity-40">
// //                           <div className="h-36 w-full bg-white/[0.03]" />
// //                           <div className="p-6">
// //                             <h3 className="text-base font-semibold text-white">{second.title}</h3>
// //                             <p className="mt-2 text-sm text-slate-400">{second.description}</p>
// //                           </div>
// //                         </div>
// //                       )}
// //                     </motion.div>
// //                   )}
// //                 </div>

// //                 {/* Secondary grid */}
// //                 {rest.length > 0 && (
// //                   <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
// //                     {rest.map((sim, i) => (
// //                       <motion.div
// //                         key={sim.path}
// //                         initial={{ opacity: 0, y: 20 }}
// //                         whileInView={{ opacity: 1, y: 0 }}
// //                         viewport={{ once: true, margin: '-40px' }}
// //                         transition={{ duration: 0.5, delay: i * 0.035, ease }}
// //                       >
// //                         {sim.path && !isMaintenanceMode ? (
// //                           <Link
// //                             to={sim.path}
// //                             className="group flex h-full flex-col rounded-2xl border border-white/[0.06] bg-white/[0.025] p-5 transition-all duration-200 hover:border-white/[0.12] hover:bg-white/[0.05]"
// //                           >
// //                             <h3 className="text-sm font-semibold text-slate-100">{sim.title}</h3>
// //                             <p className="mt-1.5 flex-1 text-xs leading-relaxed text-slate-500">{sim.description}</p>
// //                             <span className={`mt-3 text-xs font-medium opacity-50 transition-opacity duration-200 group-hover:opacity-100 ${section.arrowClass}`}>
// //                               Open →
// //                             </span>
// //                           </Link>
// //                         ) : (
// //                           <div className="flex h-full flex-col rounded-2xl border border-white/[0.04] bg-white/[0.015] p-5 opacity-35">
// //                             <h3 className="text-sm font-semibold text-slate-100">{sim.title}</h3>
// //                             <p className="mt-1.5 text-xs leading-relaxed text-slate-500">{sim.description}</p>
// //                           </div>
// //                         )}
// //                       </motion.div>
// //                     ))}
// //                   </div>
// //                 )}
// //               </section>
// //             );
// //           })}
// //         </div>

// //         {/* ─── STATUS BAR ─── */}
// //         <div className="mx-auto max-w-6xl px-4 pb-16">
// //           <motion.div
// //             className="flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.05] pt-8"
// //             initial={{ opacity: 0 }}
// //             whileInView={{ opacity: 1 }}
// //             viewport={{ once: true }}
// //             transition={{ duration: 0.6 }}
// //           >
// //             <p className="text-[0.6rem] uppercase tracking-[0.22em] text-slate-700">System Status</p>
// //             <a
// //               href={deployRunUrl}
// //               target="_blank"
// //               rel="noreferrer"
// //               className="inline-flex items-center gap-2 text-xs text-slate-700 transition-colors duration-200 hover:text-slate-400"
// //             >
// //               <span className={`h-1.5 w-1.5 rounded-full ${deployState.dotClass}`} />
// //               {deployState.label}
// //               {deployUpdatedAt && (
// //                 <span className="text-slate-800">· {new Date(deployUpdatedAt).toLocaleDateString()}</span>
// //               )}
// //             </a>
// //           </motion.div>

// //           {adminControls.featureFlags.showDebugPanel && (
// //             <section className="mt-8 rounded-2xl border border-white/10 bg-slate-950/60 p-4">
// //               <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-200">Debug Panel</p>
// //               <p className="mt-2 text-xs text-slate-300">featuredSimPath: {featuredSimPath}</p>
// //               <p className="mt-1 text-xs text-slate-300">maintenanceMode: {String(isMaintenanceMode)}</p>
// //               <p className="mt-1 text-xs text-slate-300">mockDeployStatus: {adminControls.bugTestControls.mockDeployStatus}</p>
// //               <p className="mt-1 text-xs text-slate-300">simulateSlowNetworkMs: {adminControls.bugTestControls.simulateSlowNetworkMs}</p>
// //             </section>
// //           )}
// //         </div>
// //       </div>
// //     </>
// //   );
// // }