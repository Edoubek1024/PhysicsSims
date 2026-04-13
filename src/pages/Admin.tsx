import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import {
	ADMIN_SESSION_KEY,
	KNOWN_SIM_PATHS,
	createDefaultAdminState,
	isInternalEnvironment,
	loadAdminState,
	loadAnalyticsEvents,
	pushAnalyticsEvent,
	saveAdminState,
	type AccessRole,
	type AdminControlState,
} from '../config/internalAdmin';

type AccessIdentity = {
	username: string;
	password: string;
	role: AccessRole;
};

type AdminTab =
	| 'analytics'
	| 'feature-flags'
	| 'publish'
	| 'content'
	| 'bug-test'
	| 'announcements';

const ACCESS_IDENTITIES: AccessIdentity[] = [
	{
		username: (import.meta.env.VITE_ADMIN_UN as string | undefined)?.trim() || '',
		password: (import.meta.env.VITE_ADMIN_PW as string | undefined)?.trim() || '',
		role: 'admin',
	},
];

const isAccessRole = (value: string): value is AccessRole => value === 'admin' || value === 'dev';

const TABS: Array<{ id: AdminTab; label: string }> = [
	{ id: 'analytics', label: 'Analytics Dashboard' },
	{ id: 'feature-flags', label: 'Feature Flags' },
	{ id: 'publish', label: 'Publish Controls' },
	{ id: 'content', label: 'Content Editing' },
	{ id: 'bug-test', label: 'Bug/Test Controls' },
	{ id: 'announcements', label: 'Announcements' },
];

const toggleBoolean = (value: boolean) => !value;

export function Admin() {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [errorMessage, setErrorMessage] = useState('');
	const [activeRole, setActiveRole] = useState<AccessRole | null>(null);
	const [activeTab, setActiveTab] = useState<AdminTab>('analytics');
	const [controls, setControls] = useState<AdminControlState>(createDefaultAdminState);
	const [analyticsEvents, setAnalyticsEvents] = useState(loadAnalyticsEvents);
	const [announcementPreviewOpen, setAnnouncementPreviewOpen] = useState(false);

	const canAccessInternal = isInternalEnvironment();

	useEffect(() => {
		const storedRole = window.sessionStorage.getItem(ADMIN_SESSION_KEY);
		if (storedRole && isAccessRole(storedRole)) {
			setActiveRole(storedRole);
		}
		setControls(loadAdminState());
		setAnalyticsEvents(loadAnalyticsEvents());
	}, []);
    
	const publishedCount = useMemo(
		() => Object.values(controls.simulationVisibility).filter(Boolean).length,
		[controls.simulationVisibility],
	);

	const analyticsSummary = useMemo(() => {
		const pageViews = analyticsEvents.filter((event) => event.type === 'page_view').length;
		const adminActions = analyticsEvents.filter((event) => event.type === 'admin_action').length;
		const loginSuccess = analyticsEvents.filter((event) => event.type === 'login_success').length;
		const loginFailure = analyticsEvents.filter((event) => event.type === 'login_failure').length;
		return { pageViews, adminActions, loginSuccess, loginFailure };
	}, [analyticsEvents]);

	const persistControls = (nextState: AdminControlState, actionLabel: string) => {
		setControls(nextState);
		saveAdminState(nextState);
		pushAnalyticsEvent('admin_action', actionLabel);
		setAnalyticsEvents(loadAnalyticsEvents());
	};

	const handleLogin = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		const matchedIdentity = ACCESS_IDENTITIES.find(
			(identity) =>
				identity.username &&
				identity.password &&
				identity.username === username.trim() &&
				identity.password === password,
		);

		if (!matchedIdentity) {
			setErrorMessage('Invalid username or password.');
			pushAnalyticsEvent('login_failure', 'Admin login failed', { username: username.trim() });
			setAnalyticsEvents(loadAnalyticsEvents());
			return;
		}

		window.sessionStorage.setItem(ADMIN_SESSION_KEY, matchedIdentity.role);
		setActiveRole(matchedIdentity.role);
		setErrorMessage('');
		setPassword('');
		pushAnalyticsEvent('login_success', 'Admin login succeeded', { role: matchedIdentity.role });
		setAnalyticsEvents(loadAnalyticsEvents());
	};

	const handleLogout = () => {
		window.sessionStorage.removeItem(ADMIN_SESSION_KEY);
		setActiveRole(null);
		setUsername('');
		setPassword('');
		setErrorMessage('');
	};

	if (!canAccessInternal) {
		return (
			<section className="mx-auto w-full max-w-3xl px-4 py-10">
				<div className="rounded-3xl border border-rose-300/20 bg-rose-950/20 p-8 text-center">
					<p className="text-xs font-semibold uppercase tracking-[0.22em] text-rose-200">Internal Only</p>
					<h1 className="mt-2 text-2xl font-semibold text-slate-100">Access blocked on this host</h1>
					<p className="mt-3 text-sm text-slate-300">
						This admin console is restricted to internal environments only (localhost, *.local, *.internal, or VITE_INTERNAL_ADMIN_ENABLED=true).
					</p>
				</div>
			</section>
		);
	}

	return (
		<section className={`mx-auto w-full max-w-6xl px-4 ${activeRole ? 'py-10' : 'py-4'}`}>
			<div className="overflow-hidden rounded-3xl border border-cyan-300/20 bg-slate-900/70 shadow-2xl shadow-cyan-500/10 backdrop-blur">
				{activeRole ? (
					<div className="border-b border-white/10 px-6 py-6 sm:px-8">
						<p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">Internal Operations Console</p>
						<h1 className="mt-2 text-2xl font-semibold text-slate-100 sm:text-3xl">Dev Control Center</h1>
						<p className="mt-2 max-w-2xl text-sm text-slate-300">
							Real tools for analytics, feature management, publish controls, content updates, testing, and announcements.
						</p>
					</div>
				) : null}

				{!activeRole ? (
					<div className="relative min-h-[82vh] overflow-hidden px-3 py-5 sm:px-5 sm:py-6">
						<div className="pointer-events-none absolute inset-0 opacity-95">
							<div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(34,211,238,0.08),transparent_28%),linear-gradient(180deg,rgba(2,6,23,0.90),rgba(2,6,23,0.98))]" />
						</div>

						<div className="relative mx-auto flex min-h-[72vh] w-full max-w-2xl items-center justify-center">
							<div className="pointer-events-none absolute h-[28rem] w-[28rem] rounded-full bg-cyan-300/20 blur-3xl" />
							<div className="relative w-full rounded-3xl border border-cyan-300/40 bg-slate-950/86 p-6 shadow-[0_35px_95px_-20px_rgba(6,182,212,0.5)] sm:p-8">
								<div className="mb-6 text-center">
									<p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-cyan-200">Restricted Zone</p>
									<h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-100 sm:text-4xl">Dev Control Center</h2>
									<p className="mt-3 text-sm text-slate-300">
										Authorized personnel only. Authenticate to enter internal operations.
									</p>
									<p className="mt-4 inline-flex items-center gap-2 text-[0.72rem] font-medium uppercase tracking-[0.16em] text-emerald-200">
										<span className="h-2 w-2 rounded-full bg-emerald-300 animate-pulse" />
										internal use only
									</p>
								</div>

								<form className="space-y-5" onSubmit={handleLogin}>
									<label className="block text-xs font-semibold uppercase tracking-[0.16em] text-slate-300">
										
										<div className="mt-2 relative">
											<span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">U</span>
											<input
												type="text"
												required
												value={username}
												onChange={(event) => setUsername(event.target.value)}
												className="w-full rounded-xl border border-slate-700 bg-slate-900 pl-9 pr-4 py-3 text-base text-slate-100 outline-none transition focus:border-cyan-200 focus:ring-2 focus:ring-cyan-300/35"
											/>
										</div>
									</label>

									<label className="block text-xs font-semibold uppercase tracking-[0.16em] text-slate-300">
										
										<div className="mt-2 relative">
											<span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">*</span>
											<input
												type="password"
												required
												value={password}
												onChange={(event) => setPassword(event.target.value)}
												className="w-full rounded-xl border border-slate-700 bg-slate-900 pl-9 pr-4 py-3 text-base text-slate-100 outline-none transition focus:border-cyan-200 focus:ring-2 focus:ring-cyan-300/35"
											/>
										</div>
									</label>

									{errorMessage ? (
										<p className="rounded-xl border border-rose-400/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
											{errorMessage}
										</p>
									) : null}

									<button
										type="submit"
										className="w-full rounded-xl bg-cyan-300 px-5 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-slate-950 transition duration-200 hover:brightness-110 hover:-translate-y-0.5"
									>
										Access Console →
									</button>
								</form>
							</div>
						</div>
					</div>
				) : (
					<div className="space-y-6 px-6 py-6 sm:px-8">
						<div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-emerald-300/30 bg-emerald-400/10 px-4 py-4">
							<div>
								<p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-200">Access Granted</p>
								<h2 className="mt-1 text-xl font-semibold text-slate-100">Welcome, {activeRole.toUpperCase()}</h2>
							</div>
							<div className="flex gap-2">
								<button
									type="button"
									onClick={() => {
										const resetState = createDefaultAdminState();
										persistControls(resetState, 'Reset admin controls');
									}}
									className="rounded-lg border border-amber-300/50 px-3 py-2 text-xs font-semibold uppercase tracking-[0.1em] text-amber-100 transition hover:bg-amber-300/10"
								>
									Reset Controls
								</button>
								<button
									type="button"
									onClick={handleLogout}
									className="rounded-lg border border-slate-500 px-3 py-2 text-xs font-semibold uppercase tracking-[0.1em] text-slate-100 transition hover:border-cyan-300 hover:text-cyan-200"
								>
									Sign Out
								</button>
							</div>
						</div>

						<nav className="flex flex-wrap gap-2">
							{TABS.map((tab) => (
								<button
									key={tab.id}
									type="button"
									onClick={() => setActiveTab(tab.id)}
									className={`rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-[0.1em] transition ${
										activeTab === tab.id
											? 'bg-cyan-300 text-slate-950'
											: 'border border-white/10 bg-slate-900 text-slate-200 hover:border-cyan-300/60'
									}`}
								>
									{tab.label}
								</button>
							))}
						</nav>

						{activeTab === 'analytics' ? (
							<div className="space-y-4">
								<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
									<div className="rounded-xl border border-white/10 bg-slate-900/70 p-4">
										<p className="text-xs uppercase tracking-[0.16em] text-slate-400">Page Views</p>
										<p className="mt-1 text-2xl font-semibold text-slate-100">{analyticsSummary.pageViews}</p>
									</div>
									<div className="rounded-xl border border-white/10 bg-slate-900/70 p-4">
										<p className="text-xs uppercase tracking-[0.16em] text-slate-400">Admin Actions</p>
										<p className="mt-1 text-2xl font-semibold text-slate-100">{analyticsSummary.adminActions}</p>
									</div>
									<div className="rounded-xl border border-white/10 bg-slate-900/70 p-4">
										<p className="text-xs uppercase tracking-[0.16em] text-slate-400">Login Success</p>
										<p className="mt-1 text-2xl font-semibold text-slate-100">{analyticsSummary.loginSuccess}</p>
									</div>
									<div className="rounded-xl border border-white/10 bg-slate-900/70 p-4">
										<p className="text-xs uppercase tracking-[0.16em] text-slate-400">Login Failure</p>
										<p className="mt-1 text-2xl font-semibold text-slate-100">{analyticsSummary.loginFailure}</p>
									</div>
								</div>

								<div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
									<div className="mb-3 flex items-center justify-between gap-2">
										<h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-cyan-200">Recent Events</h3>
										<button
											type="button"
											onClick={() => {
												window.localStorage.removeItem('physicssims-analytics-events');
												setAnalyticsEvents([]);
											}}
											className="rounded-md border border-white/20 px-2.5 py-1 text-xs text-slate-200 transition hover:border-cyan-300"
										>
											Clear Log
										</button>
									</div>
									<div className="max-h-80 overflow-auto rounded-xl border border-white/10">
										<table className="w-full text-left text-xs text-slate-200">
											<thead className="sticky top-0 bg-slate-900/95 text-slate-400">
												<tr>
													<th className="px-3 py-2 font-medium">Time</th>
													<th className="px-3 py-2 font-medium">Type</th>
													<th className="px-3 py-2 font-medium">Detail</th>
												</tr>
											</thead>
											<tbody>
												{[...analyticsEvents].reverse().slice(0, 100).map((event) => (
													<tr key={event.id} className="border-t border-white/10">
														<td className="px-3 py-2">{new Date(event.ts).toLocaleString()}</td>
														<td className="px-3 py-2 uppercase">{event.type}</td>
														<td className="px-3 py-2">{event.detail}</td>
													</tr>
												))}
												{analyticsEvents.length === 0 ? (
													<tr>
														<td className="px-3 py-4 text-slate-400" colSpan={3}>
															No events yet.
														</td>
													</tr>
												) : null}
											</tbody>
										</table>
									</div>
								</div>
							</div>
						) : null}

						{activeTab === 'feature-flags' ? (
							<div className="grid gap-3 sm:grid-cols-2">
								{[
									{ key: 'maintenanceMode', label: 'Maintenance Mode', help: 'Shows site maintenance banner and locks browsing in Home.' },
									{ key: 'experimentalMechanics', label: 'Experimental Mechanics', help: 'Displays experimental content badges in Home.' },
									{ key: 'analyticsCollection', label: 'Analytics Collection', help: 'Collects internal page view and admin action events.' },
									{ key: 'showDebugPanel', label: 'Show Debug Panel', help: 'Shows internal debug metadata in Home.' },
								].map((flag) => {
									const flagKey = flag.key as keyof AdminControlState['featureFlags'];
									const enabled = controls.featureFlags[flagKey];
									return (
										<button
											key={flag.key}
											type="button"
											onClick={() => {
												const nextState = {
													...controls,
													featureFlags: {
														...controls.featureFlags,
														[flagKey]: toggleBoolean(enabled),
													},
												};
												persistControls(nextState, `Toggled flag: ${flag.key}`);
											}}
											className="rounded-xl border border-white/10 bg-slate-900/70 p-4 text-left transition hover:border-cyan-300/50"
										>
											<p className="text-xs uppercase tracking-[0.14em] text-slate-400">Flag</p>
											<h3 className="mt-1 text-base font-semibold text-slate-100">{flag.label}</h3>
											<p className="mt-2 text-xs text-slate-400">{flag.help}</p>
											<p className={`mt-3 text-xs font-semibold uppercase tracking-[0.12em] ${enabled ? 'text-emerald-200' : 'text-slate-400'}`}>
												{enabled ? 'Enabled' : 'Disabled'}
											</p>
										</button>
									);
								})}
							</div>
						) : null}

						{activeTab === 'publish' ? (
							<div className="space-y-3">
								<div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-white/10 bg-slate-900/70 p-4">
									<p className="text-sm text-slate-200">
										{publishedCount}/{KNOWN_SIM_PATHS.length} simulations are published.
									</p>
									<div className="flex gap-2">
										<button
											type="button"
											onClick={() => {
												const nextVisibility: Record<string, boolean> = {};
												for (const path of KNOWN_SIM_PATHS) {
													nextVisibility[path] = true;
												}
												persistControls({ ...controls, simulationVisibility: nextVisibility }, 'Published all simulations');
											}}
											className="rounded-md border border-emerald-300/40 px-2.5 py-1 text-xs text-emerald-100 transition hover:bg-emerald-300/10"
										>
											Publish all
										</button>
										<button
											type="button"
											onClick={() => {
												const nextVisibility: Record<string, boolean> = {};
												for (const path of KNOWN_SIM_PATHS) {
													nextVisibility[path] = false;
												}
												persistControls({ ...controls, simulationVisibility: nextVisibility }, 'Unpublished all simulations');
											}}
											className="rounded-md border border-rose-300/40 px-2.5 py-1 text-xs text-rose-100 transition hover:bg-rose-300/10"
										>
											Unpublish all
										</button>
									</div>
								</div>

								<div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
									{KNOWN_SIM_PATHS.map((path) => {
										const isPublished = controls.simulationVisibility[path] !== false;
										return (
											<button
												key={path}
												type="button"
												onClick={() => {
													const nextState = {
														...controls,
														simulationVisibility: {
															...controls.simulationVisibility,
															[path]: !isPublished,
														},
													};
													persistControls(nextState, `${isPublished ? 'Unpublished' : 'Published'} ${path}`);
												}}
												className="rounded-lg border border-white/10 bg-slate-900/70 px-3 py-3 text-left transition hover:border-cyan-300/50"
											>
												<p className="text-xs uppercase tracking-[0.14em] text-slate-500">Simulation</p>
												<p className="mt-1 text-sm font-semibold text-slate-100">{path}</p>
												<p className={`mt-2 text-xs font-semibold uppercase tracking-[0.1em] ${isPublished ? 'text-emerald-200' : 'text-rose-200'}`}>
													{isPublished ? 'Published' : 'Unpublished'}
												</p>
											</button>
										);
									})}
								</div>
							</div>
						) : null}

						{activeTab === 'content' ? (
							<div className="grid gap-4 lg:grid-cols-2">
								<label className="text-xs font-medium uppercase tracking-wide text-slate-300">
									Home Hero Title
									<input
										type="text"
										value={controls.contentOverrides.homeHeroTitle}
										onChange={(event) => {
											persistControls(
												{
													...controls,
													contentOverrides: {
														...controls.contentOverrides,
														homeHeroTitle: event.target.value,
													},
												},
												'Updated home hero title',
											);
										}}
										className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-cyan-300"
									/>
								</label>
								<label className="text-xs font-medium uppercase tracking-wide text-slate-300">
									Featured Simulation Path
									<select
										value={controls.contentOverrides.featuredSimPath}
										onChange={(event) => {
											persistControls(
												{
													...controls,
													contentOverrides: {
														...controls.contentOverrides,
														featuredSimPath: event.target.value,
													},
												},
												'Changed featured simulation path',
											);
										}}
										className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-cyan-300"
									>
										{KNOWN_SIM_PATHS.map((path) => (
											<option key={path} value={path}>
												{path}
											</option>
										))}
									</select>
								</label>
								<label className="text-xs font-medium uppercase tracking-wide text-slate-300 lg:col-span-2">
									Home Hero Subtitle
									<textarea
										rows={3}
										value={controls.contentOverrides.homeHeroSubtitle}
										onChange={(event) => {
											persistControls(
												{
													...controls,
													contentOverrides: {
														...controls.contentOverrides,
														homeHeroSubtitle: event.target.value,
													},
												},
												'Updated home hero subtitle',
											);
										}}
										className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-cyan-300"
									/>
								</label>
								<label className="text-xs font-medium uppercase tracking-wide text-slate-300 lg:col-span-2">
									Home Hero Tagline
									<input
										type="text"
										value={controls.contentOverrides.homeHeroTagline}
										onChange={(event) => {
											persistControls(
												{
													...controls,
													contentOverrides: {
														...controls.contentOverrides,
														homeHeroTagline: event.target.value,
													},
												},
												'Updated home hero tagline',
											);
										}}
										className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-cyan-300"
									/>
								</label>
							</div>
						) : null}

						{activeTab === 'bug-test' ? (
							<div className="grid gap-4 lg:grid-cols-2">
								<button
									type="button"
									onClick={() => {
										persistControls(
											{
												...controls,
												bugTestControls: {
													...controls.bugTestControls,
													forceHomeError: !controls.bugTestControls.forceHomeError,
												},
											},
											'Toggled forceHomeError',
										);
									}}
									className="rounded-xl border border-white/10 bg-slate-900/70 p-4 text-left transition hover:border-cyan-300/50"
								>
									<p className="text-xs uppercase tracking-[0.14em] text-slate-400">Forced Error</p>
									<h3 className="mt-1 text-base font-semibold text-slate-100">Home Error Trigger</h3>
									<p className="mt-2 text-xs text-slate-400">Throw a controlled error in Home for error-boundary verification.</p>
									<p className={`mt-3 text-xs font-semibold uppercase tracking-[0.12em] ${controls.bugTestControls.forceHomeError ? 'text-rose-200' : 'text-slate-400'}`}>
										{controls.bugTestControls.forceHomeError ? 'Enabled' : 'Disabled'}
									</p>
								</button>

								<label className="rounded-xl border border-white/10 bg-slate-900/70 p-4 text-xs font-medium uppercase tracking-wide text-slate-300">
									Simulated Network Delay (ms)
									<input
										type="number"
										min={0}
										max={10000}
										value={controls.bugTestControls.simulateSlowNetworkMs}
										onChange={(event) => {
											const nextValue = Number(event.target.value);
											persistControls(
												{
													...controls,
													bugTestControls: {
														...controls.bugTestControls,
														simulateSlowNetworkMs: Number.isFinite(nextValue) ? Math.max(0, nextValue) : 0,
													},
												},
												'Updated simulated network delay',
											);
										}}
										className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-cyan-300"
									/>
								</label>

								<label className="rounded-xl border border-white/10 bg-slate-900/70 p-4 text-xs font-medium uppercase tracking-wide text-slate-300 lg:col-span-2">
									Mock Deploy Status
									<select
										value={controls.bugTestControls.mockDeployStatus}
										onChange={(event) => {
											persistControls(
												{
													...controls,
													bugTestControls: {
														...controls.bugTestControls,
														mockDeployStatus: event.target.value as AdminControlState['bugTestControls']['mockDeployStatus'],
													},
												},
												'Updated mock deploy status',
											);
										}}
										className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-cyan-300"
									>
										<option value="auto">Auto (live status)</option>
										<option value="online">Force online</option>
										<option value="issues">Force issues</option>
										<option value="deploying">Force deploying</option>
									</select>
								</label>
							</div>
						) : null}

						{activeTab === 'announcements' ? (
							<div className="space-y-4">
								<button
									type="button"
									onClick={() => {
										persistControls(
											{
												...controls,
												announcement: {
													...controls.announcement,
													enabled: !controls.announcement.enabled,
												},
											},
											'Toggled managed announcement',
										);
									}}
									className="rounded-xl border border-white/10 bg-slate-900/70 p-4 text-left transition hover:border-cyan-300/50"
								>
									<p className="text-xs uppercase tracking-[0.14em] text-slate-400">Announcement State</p>
									<h3
										className={`mt-1 text-base font-semibold ${
											controls.announcement.enabled ? 'text-emerald-300' : 'text-rose-300'
										}`}
									>
										{controls.announcement.enabled ? 'Enabled' : 'Disabled'}
									</h3>
									<p className="mt-2 text-xs text-slate-400">When enabled, this overrides the default home launch announcement.</p>
								</button>

								<div className="grid gap-4 lg:grid-cols-2">
									<label className="text-xs font-medium uppercase tracking-wide text-slate-300">
										Announcement ID
										<input
											type="text"
											value={controls.announcement.id}
											onChange={(event) => {
												persistControls(
													{
														...controls,
														announcement: {
															...controls.announcement,
															id: event.target.value,
														},
													},
													'Updated announcement id',
												);
											}}
											className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-cyan-300"
										/>
									</label>
									<label className="text-xs font-medium uppercase tracking-wide text-slate-300">
										Title
										<input
											type="text"
											value={controls.announcement.title}
											onChange={(event) => {
												persistControls(
													{
														...controls,
														announcement: {
															...controls.announcement,
															title: event.target.value,
														},
													},
													'Updated announcement title',
												);
											}}
											className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-cyan-300"
										/>
									</label>
									<label className="text-xs font-medium uppercase tracking-wide text-slate-300 lg:col-span-2">
										Description
										<textarea
											rows={3}
											value={controls.announcement.description}
											onChange={(event) => {
												persistControls(
													{
														...controls,
														announcement: {
															...controls.announcement,
															description: event.target.value,
														},
													},
													'Updated announcement description',
												);
											}}
											className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-cyan-300"
										/>
									</label>
									<label className="text-xs font-medium uppercase tracking-wide text-slate-300">
										Button Text
										<input
											type="text"
											value={controls.announcement.primaryButtonText}
											onChange={(event) => {
												persistControls(
													{
														...controls,
														announcement: {
															...controls.announcement,
															primaryButtonText: event.target.value,
														},
													},
													'Updated announcement button text',
												);
											}}
											className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-cyan-300"
										/>
									</label>
									<label className="text-xs font-medium uppercase tracking-wide text-slate-300">
										Button URL
										<input
											type="text"
											value={controls.announcement.primaryButtonUrl}
											onChange={(event) => {
												persistControls(
													{
														...controls,
														announcement: {
															...controls.announcement,
															primaryButtonUrl: event.target.value,
														},
													},
													'Updated announcement button url',
												);
											}}
											className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-cyan-300"
										/>
									</label>
								</div>

								<button
									type="button"
									onClick={() => setAnnouncementPreviewOpen((value) => !value)}
									className="rounded-lg border border-cyan-300/40 px-3 py-2 text-xs font-semibold uppercase tracking-[0.1em] text-cyan-100 transition hover:bg-cyan-300/10"
								>
									{announcementPreviewOpen ? 'Hide Preview' : 'Preview Announcement'}
								</button>

								{announcementPreviewOpen ? (
									<div className="rounded-2xl border border-white/10 bg-slate-950/70 p-5">
										<p className="text-sm font-semibold text-cyan-200">{controls.announcement.title}</p>
										<p className="mt-2 text-sm text-slate-300">{controls.announcement.description}</p>
										<p className="mt-4 inline-flex rounded-md bg-cyan-300 px-3 py-1 text-xs font-semibold text-slate-950">
											{controls.announcement.primaryButtonText}
										</p>
									</div>
								) : null}
							</div>
						) : null}
					</div>
				)}
			</div>
		</section>
	);
}
