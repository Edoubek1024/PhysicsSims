import { Link } from 'react-router-dom';

const LAST_UPDATED = 'May 7, 2026';

type Section = {
	id: string;
	title: string;
	body: string[];
};

const SECTIONS: Section[] = [
	{
		id: 'acceptance',
		title: '1. Acceptance of Terms',
		body: [
			'By accessing or using PhysicsSims, you agree to be bound by these Terms of Service and all applicable laws and regulations.',
			'If you do not agree with any part of these terms, you must discontinue use of the service.',
		],
	},
	{
		id: 'service',
		title: '2. Description of Service',
		body: [
			'PhysicsSims provides browser-based educational simulations, visualizations, and related content for learning and teaching physics.',
			'Features may be added, modified, suspended, or removed at any time to maintain quality, security, and academic usefulness.',
		],
	},
	{
		id: 'eligibility',
		title: '3. Eligibility and Account Use',
		body: [
			'PhysicsSims is intended for educational audiences including students, instructors, and self-learners.',
			'You are responsible for compliance with local policies and institutional rules when using this service in classroom or managed environments.',
		],
	},
	{
		id: 'acceptable-use',
		title: '4. Acceptable Use',
		body: [
			'You agree not to misuse the service, interfere with platform operations, or attempt unauthorized access to systems, source code, or data.',
			'You may not use PhysicsSims for unlawful, abusive, or deceptive activity, including automated abuse, denial-of-service behavior, or malicious payload delivery.',
		],
	},
	{
		id: 'intellectual-property',
		title: '5. Intellectual Property',
		body: [
			'Unless otherwise stated, platform design, branding, and original educational materials are protected by applicable intellectual property laws.',
			'Open-source components are governed by their respective licenses. You must respect third-party license terms when reusing code or assets.',
		],
	},
	{
		id: 'educational-disclaimer',
		title: '6. Educational Disclaimer',
		body: [
			'PhysicsSims is provided for educational and illustrative purposes. Simulation outputs are approximations and may not represent all real-world conditions.',
			'You are responsible for verifying results before relying on them for grading, research, engineering, or safety-critical decisions.',
		],
	},
	{
		id: 'availability',
		title: '7. Availability and Maintenance',
		body: [
			'We aim for reliable service but do not guarantee uninterrupted availability, error-free operation, or compatibility with every device and browser version.',
			'Scheduled and unscheduled maintenance may temporarily impact access.',
		],
	},
	{
		id: 'warranties',
		title: '8. Warranty Disclaimer',
		body: [
			'The service is provided on an "as is" and "as available" basis without warranties of any kind, express or implied, to the fullest extent permitted by law.',
			'This includes, without limitation, implied warranties of merchantability, fitness for a particular purpose, and non-infringement.',
		],
	},
	{
		id: 'liability',
		title: '9. Limitation of Liability',
		body: [
			'To the maximum extent permitted by law, PhysicsSims and its contributors shall not be liable for indirect, incidental, special, consequential, or punitive damages.',
			'Total liability for claims related to service use is limited to the amount you paid for the service in the preceding twelve months, which may be zero for free use.',
		],
	},
	{
		id: 'indemnification',
		title: '10. Indemnification',
		body: [
			'You agree to defend, indemnify, and hold harmless PhysicsSims and its contributors from claims, liabilities, damages, and expenses arising from your misuse of the service or violation of these Terms.',
		],
	},
	{
		id: 'termination',
		title: '11. Suspension and Termination',
		body: [
			'Access may be restricted or terminated at any time for security, policy violations, legal compliance, or operational reasons.',
			'Provisions that by nature should survive termination will remain in effect, including intellectual property, disclaimer, and liability sections.',
		],
	},
	{
		id: 'changes',
		title: '12. Changes to These Terms',
		body: [
			'We may update these Terms periodically. Material updates will be reflected by revising the "Last updated" date on this page.',
			'Continued use after updates constitutes acceptance of the revised Terms.',
		],
	},
	{
		id: 'governing-law',
		title: '13. Governing Law',
		body: [
			'These Terms are governed by applicable laws in the jurisdiction of the operating institution, without regard to conflict-of-law principles.',
			'If any provision is unenforceable, the remaining provisions remain in full force and effect.',
		],
	},
	{
		id: 'contact',
		title: '14. Contact',
		body: [
			'For policy questions or legal notices related to these Terms, use the contact channel available in the site footer.',
		],
	},
];

export function TOS() {
	return (
		<div className="min-h-screen bg-[#05080d] text-white">
			<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_75%_45%_at_50%_-10%,rgba(56,189,248,0.12),transparent)]" />

			<main className="relative mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
				<header className="rounded-2xl border border-white/10 bg-[#0d1118]/90 p-6 sm:p-8">
					<p className="text-xs uppercase tracking-[0.2em] text-sky-300/70">Legal</p>
					<h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Terms of Service</h1>
					<p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-300">
						These Terms govern your access to and use of PhysicsSims. Please read them carefully before using the platform.
					</p>
					<div className="mt-5 flex flex-wrap items-center gap-3 text-xs text-slate-400">
						<span className="rounded-full border border-white/15 bg-white/[0.03] px-3 py-1">Last updated: {LAST_UPDATED}</span>
						<Link
							to="/"
							className="rounded-full border border-white/15 bg-white/[0.03] px-3 py-1 transition hover:border-sky-300/70 hover:text-sky-200"
						>
							Back to Home
						</Link>
					</div>
				</header>

				<section className="mt-6 rounded-2xl border border-white/10 bg-[#0d1118]/90 p-6">
					<h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-300">Table of Contents</h2>
					<div className="mt-4 grid gap-2 sm:grid-cols-2">
						{SECTIONS.map((section) => (
							<a
								key={section.id}
								href={`#${section.id}`}
								className="rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2 text-sm text-slate-300 transition hover:border-sky-300/50 hover:text-sky-200"
							>
								{section.title}
							</a>
						))}
					</div>
				</section>

				<section className="mt-6 space-y-4">
					{SECTIONS.map((section) => (
						<article
							key={section.id}
							id={section.id}
							className="scroll-mt-24 rounded-2xl border border-white/10 bg-[#0d1118]/90 p-6"
						>
							<h3 className="text-lg font-semibold text-slate-100">{section.title}</h3>
							<div className="mt-3 space-y-3 text-sm leading-relaxed text-slate-300">
								{section.body.map((paragraph) => (
									<p key={paragraph}>{paragraph}</p>
								))}
							</div>
						</article>
					))}
				</section>

				<footer className="mt-8 rounded-2xl border border-white/10 bg-[#0d1118]/90 p-5 text-xs leading-relaxed text-slate-400">
					This page is provided for general platform policy communication and does not constitute legal advice.
				</footer>
			</main>
		</div>
	);
}

