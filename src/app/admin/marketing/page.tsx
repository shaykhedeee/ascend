// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Admin: Meta Marketing Dashboard
// Campaign management, ad insights, conversion tracking, and audience management
// ═══════════════════════════════════════════════════════════════════════════════

'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  BarChart3,
  Target,
  Users,
  DollarSign,
  Eye,
  MousePointer,
  TrendingUp,
  RefreshCw,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Zap,
  Layers,
  ArrowLeft,
  ShieldCheck,
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

interface HealthStatus {
  configured: boolean;
  tokenValid: boolean;
  adAccountAccessible: boolean;
  pixelConfigured: boolean;
  errors: string[];
}

interface Campaign {
  id: string;
  name: string;
  status: string;
  objective: string;
  daily_budget?: string;
  lifetime_budget?: string;
  start_time?: string;
  stop_time?: string;
}

interface InsightSummary {
  impressions: string;
  clicks: string;
  spend: string;
  cpc: string;
  cpm: string;
  ctr: string;
  reach: string;
  frequency: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// STAT CARD COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  icon: Icon,
  sub,
  color = 'orange',
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  sub?: string;
  color?: 'orange' | 'green' | 'blue' | 'red' | 'gold';
}) {
  const colorMap = {
    orange: 'text-orange-500 border-orange-500/30',
    green: 'text-emerald-500 border-emerald-500/30',
    blue: 'text-blue-500 border-blue-500/30',
    red: 'text-red-500 border-red-500/30',
    gold: 'text-amber-500 border-amber-500/30',
  };

  return (
    <div className={`border ${colorMap[color]} bg-zinc-950 p-4`}>
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`w-4 h-4 ${colorMap[color].split(' ')[0]}`} />
        <span className="font-mono text-xs uppercase tracking-wider text-zinc-500">{label}</span>
      </div>
      <div className="font-mono text-2xl font-bold text-zinc-100">{value}</div>
      {sub && <div className="font-mono text-xs text-zinc-500 mt-1">{sub}</div>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STATUS BADGE
// ─────────────────────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    ACTIVE: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
    PAUSED: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
    DELETED: 'bg-red-500/20 text-red-400 border-red-500/40',
    ARCHIVED: 'bg-zinc-500/20 text-zinc-400 border-zinc-500/40',
  };

  return (
    <span className={`inline-block px-2 py-0.5 text-xs font-mono uppercase border ${map[status] || map.ARCHIVED}`}>
      {status}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN DASHBOARD COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export default function MetaMarketingDashboard() {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [insights, setInsights] = useState<InsightSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [datePreset, setDatePreset] = useState('last_7d');
  const [syncing, setSyncing] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch health status
      const healthRes = await fetch('/api/marketing/meta/health');
      const healthData = await healthRes.json();
      setHealth(healthData);

      // Only fetch campaigns/insights if API is configured
      if (healthData.configured && healthData.tokenValid) {
        const [campaignsRes, insightsRes] = await Promise.all([
          fetch('/api/marketing/meta/campaigns'),
          fetch(`/api/marketing/meta/insights?summary=true&date_preset=${datePreset}`),
        ]);

        if (campaignsRes.ok) {
          const campaignsData = await campaignsRes.json();
          setCampaigns(campaignsData.campaigns || []);
        }

        if (insightsRes.ok) {
          const insightsData = await insightsRes.json();
          setInsights(insightsData.summary || null);
        }
      }
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [datePreset]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const createFromTemplate = async (template: string) => {
    setSyncing(true);
    try {
      const res = await fetch('/api/marketing/meta/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create_from_template', template }),
      });
      const data = await res.json();
      if (data.success) {
        await fetchData();
      } else {
        setError(data.error);
      }
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSyncing(false);
    }
  };

  const createRetargetingAudiences = async () => {
    setSyncing(true);
    try {
      const res = await fetch('/api/marketing/meta/audiences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create_retargeting' }),
      });
      const data = await res.json();
      if (!data.success) setError(data.error);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSyncing(false);
    }
  };

  return (
    <main className="min-h-screen bg-black px-4 py-12 text-zinc-100">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* ── HEADER ── */}
        <header className="flex items-start justify-between">
          <div>
            <Link href="/admin/system-status" className="inline-flex items-center gap-1 font-mono text-xs text-zinc-500 hover:text-orange-500 transition mb-4">
              <ArrowLeft className="w-3 h-3" /> ADMIN
            </Link>
            <p className="font-mono text-xs tracking-[0.3em] text-orange-500">META_MARKETING_DASHBOARD</p>
            <h1 className="mt-3 font-mono text-3xl font-bold">Ad Performance & Campaigns</h1>
            <p className="mt-2 max-w-2xl font-mono text-sm leading-6 text-zinc-400">
              Manage Facebook/Instagram ad campaigns, track conversions, and monitor ROAS.
              App ID: 26209198785376657 | Business ID: 34829305176654710
            </p>
          </div>
          <button
            onClick={() => fetchData()}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 font-mono text-sm uppercase tracking-wider border border-zinc-700 bg-zinc-950 hover:border-orange-500/50 hover:text-orange-500 transition disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </header>

        {/* ── ERROR BANNER ── */}
        {error && (
          <div className="border border-red-500/30 bg-red-950/20 p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div className="font-mono text-sm text-red-300">{error}</div>
          </div>
        )}

        {/* ── HEALTH STATUS ── */}
        {health && (
          <section className="border border-zinc-800 bg-zinc-950 p-6 space-y-4">
            <h2 className="font-mono text-sm uppercase tracking-wider text-zinc-500 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" /> API Configuration Status
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <HealthCheck label="Credentials" ok={health.configured} />
              <HealthCheck label="Access Token" ok={health.tokenValid} />
              <HealthCheck label="Ad Account" ok={health.adAccountAccessible} />
              <HealthCheck label="Meta Pixel" ok={health.pixelConfigured} />
            </div>
            {health.errors.length > 0 && (
              <div className="mt-3 space-y-1">
                {health.errors.map((err, i) => (
                  <p key={i} className="font-mono text-xs text-red-400">• {err}</p>
                ))}
              </div>
            )}
            {!health.configured && (
              <div className="mt-4 border border-amber-500/30 bg-amber-950/20 p-4">
                <p className="font-mono text-sm text-amber-300 mb-2">Setup Required</p>
                <ol className="font-mono text-xs text-zinc-400 space-y-1 list-decimal list-inside">
                  <li>Go to <a href="https://business.facebook.com" target="_blank" className="text-orange-500 underline">business.facebook.com</a></li>
                  <li>Create a System User with ads_management scope</li>
                  <li>Generate access token → set <code className="text-orange-400">META_ACCESS_TOKEN</code> in .env</li>
                  <li>Copy Ad Account ID (act_XXXXX) → set <code className="text-orange-400">META_AD_ACCOUNT_ID</code></li>
                  <li>Create a Pixel in Events Manager → set <code className="text-orange-400">META_PIXEL_ID</code></li>
                  <li>Restart the dev server</li>
                </ol>
              </div>
            )}
          </section>
        )}

        {/* ── INSIGHTS SUMMARY ── */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-mono text-sm uppercase tracking-wider text-zinc-500 flex items-center gap-2">
              <BarChart3 className="w-4 h-4" /> Performance Overview
            </h2>
            <select
              value={datePreset}
              onChange={(e) => setDatePreset(e.target.value)}
              className="font-mono text-xs bg-zinc-950 border border-zinc-700 text-zinc-300 px-2 py-1 uppercase"
            >
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="last_3d">Last 3 Days</option>
              <option value="last_7d">Last 7 Days</option>
              <option value="last_14d">Last 14 Days</option>
              <option value="last_30d">Last 30 Days</option>
              <option value="this_month">This Month</option>
              <option value="last_month">Last Month</option>
            </select>
          </div>

          {insights ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard label="Impressions" value={Number(insights.impressions).toLocaleString()} icon={Eye} color="blue" />
              <StatCard label="Clicks" value={Number(insights.clicks || 0).toLocaleString()} icon={MousePointer} color="orange" />
              <StatCard label="Spend" value={`$${Number(insights.spend).toFixed(2)}`} icon={DollarSign} color="red" />
              <StatCard label="CPC" value={`$${Number(insights.cpc || 0).toFixed(2)}`} icon={TrendingUp} color="green" />
              <StatCard label="CTR" value={`${Number(insights.ctr || 0).toFixed(2)}%`} icon={Target} color="gold" />
              <StatCard label="CPM" value={`$${Number(insights.cpm || 0).toFixed(2)}`} icon={DollarSign} color="blue" />
              <StatCard label="Reach" value={Number(insights.reach || 0).toLocaleString()} icon={Users} color="green" />
              <StatCard label="Frequency" value={Number(insights.frequency || 0).toFixed(2)} icon={Layers} color="orange" />
            </div>
          ) : !loading && health?.configured ? (
            <div className="border border-zinc-800 bg-zinc-950 p-8 text-center">
              <BarChart3 className="w-8 h-8 text-zinc-600 mx-auto mb-3" />
              <p className="font-mono text-sm text-zinc-500">No insight data available for this period</p>
            </div>
          ) : !health?.configured ? (
            <div className="border border-zinc-800 bg-zinc-950 p-8 text-center">
              <p className="font-mono text-sm text-zinc-500">Configure Meta API credentials above to see insights</p>
            </div>
          ) : null}
        </section>

        {/* ── CAMPAIGNS ── */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-mono text-sm uppercase tracking-wider text-zinc-500 flex items-center gap-2">
              <Zap className="w-4 h-4" /> Campaigns
            </h2>
          </div>

          {campaigns.length > 0 ? (
            <div className="border border-zinc-800 overflow-hidden">
              <table className="w-full font-mono text-sm">
                <thead>
                  <tr className="border-b border-zinc-800 bg-zinc-950">
                    <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-zinc-500">Campaign</th>
                    <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-zinc-500">Status</th>
                    <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-zinc-500">Objective</th>
                    <th className="text-right px-4 py-3 text-xs uppercase tracking-wider text-zinc-500">Budget</th>
                  </tr>
                </thead>
                <tbody>
                  {campaigns.map((c) => (
                    <tr key={c.id} className="border-b border-zinc-900 hover:bg-zinc-900/50 transition">
                      <td className="px-4 py-3 text-zinc-200">{c.name}</td>
                      <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                      <td className="px-4 py-3 text-zinc-400">{c.objective}</td>
                      <td className="px-4 py-3 text-right text-zinc-400">
                        {c.daily_budget ? `$${(Number(c.daily_budget) / 100).toFixed(2)}/day` : c.lifetime_budget ? `$${(Number(c.lifetime_budget) / 100).toFixed(2)} lifetime` : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="border border-zinc-800 bg-zinc-950 p-8 text-center space-y-4">
              <Target className="w-8 h-8 text-zinc-600 mx-auto" />
              <p className="font-mono text-sm text-zinc-500">No campaigns yet</p>
              {health?.configured && (
                <div className="space-y-3">
                  <p className="font-mono text-xs text-zinc-600">Quick-start with a template:</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {[
                      { key: 'contentPromotion', label: 'Content Promotion' },
                      { key: 'signupAcquisition', label: 'Sign-Up Acquisition' },
                      { key: 'proConversion', label: 'Pro Conversion' },
                      { key: 'brandAwareness', label: 'Brand Awareness' },
                      { key: 'appInstalls', label: 'App Installs' },
                    ].map((t) => (
                      <button
                        key={t.key}
                        onClick={() => createFromTemplate(t.key)}
                        disabled={syncing}
                        className="inline-flex items-center gap-1 px-3 py-1.5 font-mono text-xs uppercase tracking-wider border border-orange-500/30 text-orange-500 hover:bg-orange-500/10 transition disabled:opacity-50"
                      >
                        <Zap className="w-3 h-3" /> {t.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </section>

        {/* ── AUDIENCES ── */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-mono text-sm uppercase tracking-wider text-zinc-500 flex items-center gap-2">
              <Users className="w-4 h-4" /> Retargeting Audiences
            </h2>
            {health?.configured && health?.pixelConfigured && (
              <button
                onClick={createRetargetingAudiences}
                disabled={syncing}
                className="inline-flex items-center gap-2 px-3 py-1.5 font-mono text-xs uppercase tracking-wider border border-zinc-700 hover:border-orange-500/50 hover:text-orange-500 transition disabled:opacity-50"
              >
                <Users className="w-3 h-3" /> Create Retargeting Audiences
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <AudienceCard
              name="All Site Visitors"
              description="Anyone who visited resurgo.life in the past 30 days"
              retention="30 days"
            />
            <AudienceCard
              name="Pricing Page Visitors"
              description="High-intent visitors who viewed the pricing page"
              retention="14 days"
            />
            <AudienceCard
              name="Blog Readers"
              description="Content readers for nurture campaigns"
              retention="60 days"
            />
          </div>
        </section>

        {/* ── CONVERSION TRACKING ── */}
        <section className="space-y-4">
          <h2 className="font-mono text-sm uppercase tracking-wider text-zinc-500 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" /> Conversion Tracking (Active)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { event: 'CompleteRegistration', desc: 'User sign-ups', trigger: 'Sign-up form submission' },
              { event: 'ViewContent', desc: 'Pricing page views', trigger: '/pricing page load' },
              { event: 'InitiateCheckout', desc: 'Checkout starts', trigger: 'Plan CTA click → checkout' },
              { event: 'Purchase', desc: 'Completed purchases', trigger: 'Dodo payment webhook' },
              { event: 'Lead', desc: 'Email captures', trigger: 'Email form submission' },
              { event: 'PageView', desc: 'All page views', trigger: 'Every page load (Pixel)' },
            ].map((e) => (
              <div key={e.event} className="border border-zinc-800 bg-zinc-950 p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span className="font-mono text-sm font-bold text-zinc-200">{e.event}</span>
                </div>
                <p className="font-mono text-xs text-zinc-400">{e.desc}</p>
                <p className="font-mono text-xs text-zinc-600">Trigger: {e.trigger}</p>
                <div className="flex gap-2 mt-2">
                  <span className="font-mono text-[10px] border border-blue-500/30 text-blue-400 px-1.5 py-0.5 uppercase">Pixel</span>
                  <span className="font-mono text-[10px] border border-emerald-500/30 text-emerald-400 px-1.5 py-0.5 uppercase">CAPI</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── QUICK LINKS ── */}
        <section className="border-t border-zinc-800 pt-8 mt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <QuickLink
              href="https://business.facebook.com/adsmanager"
              label="Ads Manager"
              desc="Manage campaigns in Meta Business Suite"
            />
            <QuickLink
              href="https://business.facebook.com/events_manager2"
              label="Events Manager"
              desc="View Pixel events and test conversions"
            />
            <QuickLink
              href="https://developers.facebook.com/tools/explorer/"
              label="Graph API Explorer"
              desc="Test API calls and debug responses"
            />
          </div>
        </section>
      </div>
    </main>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

function HealthCheck({ label, ok }: { label: string; ok: boolean }) {
  return (
    <div className="flex items-center gap-2 font-mono text-sm">
      {ok ? (
        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
      ) : (
        <XCircle className="w-4 h-4 text-red-500" />
      )}
      <span className={ok ? 'text-zinc-200' : 'text-zinc-500'}>{label}</span>
    </div>
  );
}

function AudienceCard({ name, description, retention }: { name: string; description: string; retention: string }) {
  return (
    <div className="border border-zinc-800 bg-zinc-950 p-4 space-y-2">
      <div className="flex items-center gap-2">
        <Users className="w-4 h-4 text-orange-500" />
        <span className="font-mono text-sm font-bold text-zinc-200">{name}</span>
      </div>
      <p className="font-mono text-xs text-zinc-400">{description}</p>
      <p className="font-mono text-xs text-zinc-600">Retention: {retention}</p>
    </div>
  );
}

function QuickLink({ href, label, desc }: { href: string; label: string; desc: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="border border-zinc-800 bg-zinc-950 p-4 hover:border-orange-500/30 transition group block"
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-sm font-bold text-zinc-200 group-hover:text-orange-500 transition">{label}</span>
        <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-orange-500 transition" />
      </div>
      <p className="font-mono text-xs text-zinc-500 mt-1">{desc}</p>
    </a>
  );
}
