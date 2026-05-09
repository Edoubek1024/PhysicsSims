import { Link } from 'react-router-dom';

const partnerTypes = [
	{
		title: 'Academic Partners',
		icon: '🎓',
		accent: 'text-cyan-200',
		border: 'border-cyan-800/60',
		detail:
			'Universities, departments, and instructors who integrate PhysicsSims into their curricula and provide feedback to guide our development.',
	},
	{
		title: 'Open Source Contributors',
		icon: '🔧',
		accent: 'text-emerald-200',
		border: 'border-emerald-800/60',
		detail:
			'Developers who contribute code, bug fixes, or new simulations through our GitHub repository.',
	},
	{
		title: 'Content Collaborators',
		icon: '📐',
		accent: 'text-amber-200',
		border: 'border-amber-800/60',
		detail:
			'Physics educators and graduate students who help us design accurate, pedagogically sound simulation content.',
	},
];

const benefits = [
	{ icon: '🔗', title: 'Attribution', desc: 'Your institution or name is credited on all relevant pages.' },
	{ icon: '📣', title: 'Early Access', desc: 'Get new simulations and features before they are publicly released.' },
	{ icon: '🛠️', title: 'Custom Requests', desc: 'Request simulations tailored to your specific coursework or curriculum.' },
	{ icon: '📊', title: 'Usage Insights', desc: 'Receive aggregated, anonymous analytics on how your students engage with our tools.' },
];

const steps = [
	{ num: '01', label: 'Reach Out', desc: 'Contact us via GitHub Discussions or our contact form with a brief description of your partnership interest.' },
	{ num: '02', label: 'Discuss', desc: 'We\'ll set up a short conversation to understand your needs and how we can best collaborate.' },
	{ num: '03', label: 'Collaborate', desc: 'We formalize the arrangement — whether that means a GitHub collaborator invite, a curriculum integration plan, or a content review cycle.' },
];

export function Partnership() {
	return (
		<div className="relative mx-auto min-h-[100dvh] max-w-6xl overflow-hidden px-3 py-6 text-slate-100 sm:px-4 sm:py-8">
			<div className="pointer-events-none absolute inset-0 -z-10">
				<div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-violet-500/20 blur-3xl" />
				<div className="absolute right-0 top-32 h-80 w-80 rounded-full bg-cyan-500/20 blur-3xl" />
				<div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-emerald-500/15 blur-3xl" />
			</div>

			<header className="mb-6 rounded-3xl border border-slate-800/90 bg-slate-900/70 p-5 shadow-[0_20px_60px_rgba(2,6,23,0.55)] sm:p-8">
				<p className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-300">Partnership</p>
				<h1 className="mt-3 bg-[linear-gradient(90deg,#c4b5fd_0%,#a5b4fc_24%,#7dd3fc_48%,#6ee7b7_74%,#fde68a_100%)] bg-clip-text text-3xl font-semibold tracking-tight text-transparent sm:text-5xl">
					Build With Us
				</h1>
				<p className="mt-4 max-w-3xl text-sm leading-relaxed text-slate-300 sm:text-base">
					PhysicsSims is a student-built, community-driven project. We welcome academic institutions, open-source
					contributors, and educators who want to help make physics education more visual, accessible, and free.
				</p>

				<div className="mt-5 flex flex-wrap gap-3 text-xs">
					<span className="rounded-full border border-violet-300/40 bg-violet-300/10 px-3 py-1 text-violet-100">Open Source</span>
					<span className="rounded-full border border-cyan-300/40 bg-cyan-300/10 px-3 py-1 text-cyan-100">Student-Led</span>
					<span className="rounded-full border border-emerald-300/40 bg-emerald-300/10 px-3 py-1 text-emerald-100">UIUC Based</span>
					<span className="rounded-full border border-amber-300/40 bg-amber-300/10 px-3 py-1 text-amber-100">Always Free</span>
				</div>

				<div className="mt-6">
					<Link
						to="/"
						className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-950/80 px-4 py-2 text-xs font-semibold text-slate-200 transition hover:border-violet-400 hover:text-violet-100"
					>
						<span>←</span>
						Back to Home
					</Link>
				</div>
			</header>

			<main className="grid gap-4 sm:gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
				{/* Partner types */}
				<section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-lg shadow-slate-950/40 lg:col-span-2">
					<h2 className="text-lg font-semibold text-slate-100">Ways to Partner</h2>
					<p className="mt-1 text-sm text-slate-400">We support several kinds of collaboration depending on your background and goals.</p>

					<div className="mt-4 grid gap-4 md:grid-cols-3">
						{partnerTypes.map((type) => (
							<article
								key={type.title}
								className={`group rounded-2xl border ${type.border} bg-slate-950/70 p-5 transition hover:-translate-y-1 hover:border-slate-600`}
							>
								<div className="mb-3 text-4xl">{type.icon}</div>
								<h3 className={`text-sm font-semibold ${type.accent}`}>{type.title}</h3>
								<p className="mt-3 text-sm leading-relaxed text-slate-300">{type.detail}</p>
							</article>
						))}
					</div>
				</section>

				{/* Benefits */}
				<section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-lg shadow-slate-950/40">
					<h2 className="text-lg font-semibold text-slate-100">Partner Benefits</h2>
					<p className="mt-1 text-sm text-slate-400">What you get when you collaborate with us.</p>

					<div className="mt-4 space-y-3">
						{benefits.map((b) => (
							<article key={b.title} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
								<div className="flex items-start gap-3">
									<span className="text-2xl">{b.icon}</span>
									<div>
										<h3 className="text-sm font-semibold text-violet-200">{b.title}</h3>
										<p className="mt-1 text-sm text-slate-400">{b.desc}</p>
									</div>
								</div>
							</article>
						))}
					</div>
				</section>

				{/* How it works */}
				<section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-lg shadow-slate-950/40">
					<h2 className="text-lg font-semibold text-slate-100">How It Works</h2>
					<p className="mt-1 text-sm text-slate-400">Getting started is simple and informal.</p>

					<div className="mt-4 space-y-4">
						{steps.map((step, idx) => (
							<div key={step.num} className="flex gap-4">
								<div className="flex flex-col items-center">
									<span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet-500/20 text-xs font-bold text-violet-300">
										{step.num}
									</span>
									{idx < steps.length - 1 && <span className="mt-1 h-full w-px bg-slate-800" />}
								</div>
								<div className="pb-4">
									<p className="text-sm font-semibold text-slate-100">{step.label}</p>
									<p className="mt-1 text-sm leading-relaxed text-slate-400">{step.desc}</p>
								</div>
							</div>
						))}
					</div>
				</section>

				{/* CTA */}
				<section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-lg shadow-slate-950/40 lg:col-span-2">
					<h2 className="text-lg font-semibold text-slate-100">Get In Touch</h2>
					<p className="mt-1 text-sm text-slate-400">Ready to collaborate? Here are the best ways to reach us.</p>

					<div className="mt-6 grid gap-4 md:grid-cols-2">
						<div className="rounded-xl border border-slate-800 bg-slate-950/70 p-5">
							<h3 className="text-sm font-semibold text-cyan-200">GitHub Discussions</h3>
							<p className="mt-2 text-sm text-slate-400">
								The fastest way to start a conversation. Open a discussion in our repository and tag it with{' '}
								<span className="rounded bg-slate-800 px-1 py-0.5 font-mono text-xs text-slate-200">partnership</span>.
							</p>
							<a
								href="https://github.com/IlliniOpenEdu/PhysicsSims/discussions"
								target="_blank"
								rel="noreferrer"
								className="mt-4 inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/80 px-3 py-2 text-xs font-semibold text-slate-200 transition hover:border-cyan-400 hover:text-cyan-100"
							>
								<svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 fill-current">
									<path d="M12 .5C5.73.5.75 5.58.75 11.92c0 5.07 3.29 9.37 7.86 10.89.58.11.79-.25.79-.56v-2.1c-3.2.71-3.88-1.57-3.88-1.57-.53-1.38-1.3-1.75-1.3-1.75-1.06-.74.08-.73.08-.73 1.17.09 1.8 1.22 1.8 1.22 1.04 1.83 2.72 1.3 3.38.99.11-.77.41-1.3.75-1.6-2.56-.3-5.25-1.3-5.25-5.79 0-1.28.44-2.33 1.16-3.15-.12-.3-.5-1.5.11-3.12 0 0 .94-.31 3.08 1.2.89-.25 1.84-.38 2.79-.39.95.01 1.9.14 2.79.39 2.14-1.51 3.08-1.2 3.08-1.2.61 1.62.23 2.82.11 3.12.72.82 1.16 1.87 1.16 3.15 0 4.5-2.69 5.48-5.26 5.78.42.36.79 1.07.79 2.16v3.2c0 .31.21.68.8.56 4.56-1.53 7.85-5.82 7.85-10.89C23.25 5.58 18.27.5 12 .5Z" />
								</svg>
								Open a Discussion
							</a>
						</div>

						<div className="rounded-xl border border-slate-800 bg-slate-950/70 p-5">
							<h3 className="text-sm font-semibold text-emerald-200">Direct Contact</h3>
							<p className="mt-2 text-sm text-slate-400">
								Prefer email? Reach the development team directly via the contact form on our site.
							</p>
							<p className="mt-3 text-xs text-slate-500">
								We are a small student team — please allow a few days for a response.
							</p>
						</div>
					</div>

					<div className="mt-5 rounded-xl border border-violet-800/40 bg-violet-500/5 p-4">
						<p className="text-xs font-semibold uppercase tracking-wide text-violet-300">Our Commitment</p>
						<p className="mt-2 text-sm text-slate-300">
							All partnerships are voluntary and non-commercial. We will never paywall simulations or sell data. Any collaboration
							must align with our core principle: free, open, student-first education.
						</p>
					</div>
				</section>
			</main>
		</div>
	);
}
