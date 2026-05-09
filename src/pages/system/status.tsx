import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { loadAdminState, type AdminControlState } from '../../config/internalAdmin';

type WorkflowRun = {
  status?: string;
  conclusion?: string;
  html_url?: string;
  updated_at?: string;
  run_number?: number;
};

type ApiResponse = {
  workflow_runs?: WorkflowRun[];
};

type StatusUi = {
  label: string;
  detail: string;
  dotClass: string;
  toneClass: string;
  badgeClass: string;
};

const DEPLOY_STATUS_API =
  'https://api.github.com/repos/IlliniOpenEdu/PhysicsSims/actions/workflows/deploy.yml/runs?per_page=1';

const LOADING_UI: StatusUi = {
  label: 'Checking',
  detail: 'Loading latest deploy run...',
  dotClass: 'bg-amber-300',
  toneClass: 'text-amber-200',
  badgeClass: 'bg-amber-400/15 border-amber-300/35',
};

const ERROR_UI: StatusUi = {
  label: 'Unavailable',
  detail: 'Could not fetch deploy status',
  dotClass: 'bg-slate-400',
  toneClass: 'text-slate-200',
  badgeClass: 'bg-slate-400/15 border-slate-300/35',
};

function mapStatus(status?: string, conclusion?: string): StatusUi {
  if (status === 'completed') {
    if (conclusion === 'success') {
      return {
        label: 'Online',
        detail: 'Latest deploy completed successfully.',
        dotClass: 'bg-emerald-400',
        toneClass: 'text-emerald-200',
        badgeClass: 'bg-emerald-400/15 border-emerald-300/35',
      };
    }
    if (conclusion === 'failure' || conclusion === 'timed_out') {
      return {
        label: 'Issues',
        detail: 'Latest deploy failed or timed out.',
        dotClass: 'bg-rose-400',
        toneClass: 'text-rose-200',
        badgeClass: 'bg-rose-400/15 border-rose-300/35',
      };
    }
    if (conclusion === 'cancelled' || conclusion === 'skipped') {
      return {
        label: 'Paused',
        detail: 'Latest deploy did not complete normally.',
        dotClass: 'bg-amber-300',
        toneClass: 'text-amber-200',
        badgeClass: 'bg-amber-400/15 border-amber-300/35',
      };
    }
  }

  if (status === 'queued') {
    return {
      label: 'Queued',
      detail: 'Deploy run is queued.',
      dotClass: 'bg-amber-300',
      toneClass: 'text-amber-200',
      badgeClass: 'bg-amber-400/15 border-amber-300/35',
    };
  }

  if (status === 'in_progress' || status === 'waiting' || status === 'requested') {
    return {
      label: 'Deploying',
      detail: 'A deploy is currently running.',
      dotClass: 'bg-sky-300',
      toneClass: 'text-sky-200',
      badgeClass: 'bg-sky-400/15 border-sky-300/35',
    };
  }

  return ERROR_UI;
}

export function System() {
  const [ui, setUi] = useState<StatusUi>(LOADING_UI);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [runNumber, setRunNumber] = useState<number | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [adminControls, setAdminControls] = useState<AdminControlState>(loadAdminState);

  const refresh = async (signal?: AbortSignal) => {
    setIsRefreshing(true);

    try {
      const simulatedDelay = Math.max(0, adminControls.bugTestControls.simulateSlowNetworkMs || 0);
      if (simulatedDelay > 0) {
        await new Promise((resolve) => {
          window.setTimeout(resolve, simulatedDelay);
        });
      }

      if (signal?.aborted) {
        return;
      }

      const mockStatus = adminControls.bugTestControls.mockDeployStatus;
      if (mockStatus !== 'auto') {
        if (mockStatus === 'online') {
          setUi(mapStatus('completed', 'success'));
        } else if (mockStatus === 'issues') {
          setUi(mapStatus('completed', 'failure'));
        } else if (mockStatus === 'deploying') {
          setUi(mapStatus('in_progress'));
        } else if (mockStatus === 'paused') {
          setUi(mapStatus('completed', 'cancelled'));
        } else if (mockStatus === 'queued') {
          setUi(mapStatus('queued'));
        }

        setUpdatedAt(new Date().toISOString());
        setRunNumber(null);
        return;
      }

      const response = await fetch(DEPLOY_STATUS_API, {
        signal,
        headers: { Accept: 'application/vnd.github+json' },
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error(`GitHub status fetch failed: ${response.status}`);
      }

      const data = (await response.json()) as ApiResponse;
      const latest = data.workflow_runs?.[0];

      if (!latest) {
        setUi(ERROR_UI);
        return;
      }

      setUi(mapStatus(latest.status, latest.conclusion));
      setUpdatedAt(latest.updated_at ?? null);
      setRunNumber(latest.run_number ?? null);
    } catch {
      if (!signal?.aborted) {
        setUi(ERROR_UI);
      }
    } finally {
      if (!signal?.aborted) {
        setIsRefreshing(false);
      }
    }
  };

  useEffect(() => {
    const onStorageUpdated = () => {
      setAdminControls(loadAdminState());
    };

    window.addEventListener('storage', onStorageUpdated);
    return () => {
      window.removeEventListener('storage', onStorageUpdated);
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    void refresh(controller.signal);
    return () => controller.abort();
  }, [adminControls.bugTestControls.mockDeployStatus, adminControls.bugTestControls.simulateSlowNetworkMs]);

  const updatedText = useMemo(() => {
    if (!updatedAt) return 'Unknown';
    return new Date(updatedAt).toLocaleString();
  }, [updatedAt]);

  const generatedAt = useMemo(() => new Date().toLocaleTimeString(), [updatedAt]);

  return (
    <div className="min-h-screen bg-[#05080d] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_40%_at_50%_-10%,rgba(56,189,248,0.12),transparent)]" />

      <div className="relative mx-auto w-full max-w-6xl px-4 py-12">
        <div className="mb-10 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-sky-300/70">Platform Operations</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">System Status</h1>
            <p className="mt-2 text-sm text-slate-400">Live deployment and availability snapshot for PhysicsSims services.</p>
          </div>
          <Link
            to="/dashboard"
            className="rounded-lg border border-white/15 bg-white/[0.02] px-3 py-2 text-sm text-slate-200 transition hover:border-sky-300/70 hover:text-sky-200"
          >
            Back to Dashboard
          </Link>
        </div>

        <section className="rounded-2xl border border-white/10 bg-[#0d1118]/90 p-6 shadow-xl shadow-slate-950/40">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="inline-flex items-center gap-3">
              <span className={`h-2.5 w-2.5 rounded-full ${ui.dotClass}`} aria-hidden="true" />
              <span className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] ${ui.badgeClass} ${ui.toneClass}`}>
                {ui.label}
              </span>
              <span className="text-sm text-slate-400">{ui.detail}</span>
            </div>
            <button
              type="button"
              onClick={() => {
                void refresh();
              }}
              disabled={isRefreshing}
              className="rounded-md border border-white/15 px-3 py-1.5 text-sm text-slate-200 transition hover:border-sky-300/70 hover:text-sky-200 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isRefreshing ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-white/10 bg-[#111722] p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Current State</p>
              <p className={`mt-2 text-sm font-semibold ${ui.toneClass}`}>{ui.label}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-[#111722] p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Latest Deploy Run</p>
              <p className="mt-2 text-sm text-slate-200">{runNumber ? `#${runNumber}` : 'Unknown'}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-[#111722] p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Updated</p>
              <p className="mt-2 text-sm text-slate-200">{updatedText}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-[#111722] p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Snapshot Generated</p>
              <p className="mt-2 text-sm text-slate-200">{generatedAt}</p>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-white/10 bg-[#0b1017] p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Service Components</p>
            <div className="mt-3 space-y-2 text-sm">
              <div className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2">
                <span className="text-slate-300">Public Web App</span>
                <span className={`inline-flex items-center gap-2 ${ui.toneClass}`}><span className={`h-2 w-2 rounded-full ${ui.dotClass}`} />{ui.label}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2">
                <span className="text-slate-300">Simulation Routes</span>
                <span className={`inline-flex items-center gap-2 ${ui.toneClass}`}><span className={`h-2 w-2 rounded-full ${ui.dotClass}`} />{ui.label}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2">
                <span className="text-slate-300">Deploy Pipeline</span>
                <span className={`inline-flex items-center gap-2 ${ui.toneClass}`}><span className={`h-2 w-2 rounded-full ${ui.dotClass}`} />{ui.label}</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
