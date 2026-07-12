import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAdminDashboard } from '../api';

type DashboardData = Awaited<ReturnType<typeof getAdminDashboard>>;

export default function Admin() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    getAdminDashboard()
      .then((data) => {
        if (!active) {
          return;
        }

        setDashboard(data);
        setError('');
      })
      .catch((fetchError: Error) => {
        if (!active) {
          return;
        }

        setError(fetchError.message);
      })
      .finally(() => {
        if (active) {
          setIsLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(255,191,120,0.24),_transparent_24%),radial-gradient(circle_at_top_right,_rgba(24,119,145,0.12),_transparent_28%),linear-gradient(180deg,_#f5fbff_0%,_#edf5f8_100%)] text-slate-800">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
        <section className="rounded-[2rem] border border-slate-200/80 bg-[radial-gradient(circle_at_top_left,_rgba(255,185,107,0.18),_transparent_28%),linear-gradient(135deg,_#f7fbff_0%,_#ebf4f8_52%,_#fff9ef_100%)] p-6 shadow-[0_24px_60px_rgba(7,26,43,0.08)] sm:p-8 lg:p-10">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <span className="inline-flex rounded-full border border-cyan-900/10 bg-cyan-900/8 px-4 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-cyan-900 sm:text-xs">
                Admin Dashboard
              </span>
              <h1 className="mt-5 text-4xl leading-tight font-semibold tracking-[-0.04em] text-slate-950 sm:text-5xl lg:text-6xl">
                Fleet operations at a glance, powered by the backend.
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
                This admin view is intentionally read-only for now. It loads overall fleet,
                trip, compliance, and cost data from the TransitOps API.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white/80 px-6 py-3 text-sm font-semibold text-slate-900 transition hover:-translate-y-0.5 hover:border-cyan-800 hover:text-cyan-900"
                to="/"
              >
                Back to landing page
              </Link>
              <Link
                className="inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_35px_rgba(15,23,42,0.18)] transition hover:-translate-y-0.5 hover:bg-cyan-900"
                to="/vehicle-registration"
              >
                View vehicle intake
              </Link>
            </div>
          </div>
        </section>

        {isLoading ? (
          <StatusCard message="Loading admin dashboard from the backend..." tone="slate" />
        ) : null}

        {error ? <StatusCard message={error} tone="red" /> : null}

        {dashboard ? (
          <>
            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {dashboard.kpiCards.map((card) => (
                <article
                  key={card.label}
                  className="rounded-[1.7rem] border border-slate-200/80 bg-white/88 p-6 shadow-[0_18px_40px_rgba(15,23,42,0.05)]"
                >
                  <p className="text-sm font-medium text-slate-500">{card.label}</p>
                  <strong className="mt-3 block text-4xl leading-none font-semibold text-slate-950">
                    {card.value}
                  </strong>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{card.change}</p>
                </article>
              ))}
            </section>

            <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
              <article className="rounded-[1.9rem] border border-slate-900/10 bg-[radial-gradient(circle_at_top,_rgba(255,164,89,0.18),_transparent_32%),linear-gradient(180deg,_#0b2233_0%,_#12374d_100%)] p-6 text-slate-100 shadow-[0_24px_60px_rgba(7,26,43,0.12)] sm:p-7">
                <span className="inline-flex rounded-full border border-cyan-200/20 bg-cyan-200/10 px-3 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-cyan-100 sm:text-xs">
                  Fleet status mix
                </span>
                <h2 className="mt-4 text-3xl font-semibold text-white">Current asset distribution</h2>

                <div className="mt-6 space-y-4">
                  {dashboard.fleetOverview.map((item) => (
                    <div key={item.label}>
                      <div className="mb-2 flex items-center justify-between text-sm text-slate-200">
                        <span>{item.label}</span>
                        <span>{item.value} vehicles</span>
                      </div>
                      <div className="h-3 rounded-full bg-white/10">
                        <div
                          className={`h-3 rounded-full ${item.tone}`}
                          style={{ width: `${Math.max(item.value * 18, 8)}px` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </article>

              <article className="rounded-[1.9rem] border border-slate-200/80 bg-white/88 p-6 shadow-[0_20px_50px_rgba(15,23,42,0.05)] sm:p-7">
                <span className="inline-flex rounded-full border border-cyan-900/10 bg-cyan-900/8 px-4 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-cyan-900 sm:text-xs">
                  Compliance pulse
                </span>
                <h2 className="mt-4 text-3xl font-semibold text-slate-950">
                  Read-only alerts and guardrails
                </h2>
                <ul className="mt-5 space-y-4 text-sm leading-7 text-slate-600">
                  {dashboard.complianceAlerts.map((alert) => (
                    <li
                      key={alert}
                      className="relative rounded-3xl border border-amber-200 bg-amber-50 px-4 py-4 pl-11"
                    >
                      <span className="absolute top-5 left-4 h-2.5 w-2.5 rounded-full bg-amber-500" />
                      {alert}
                    </li>
                  ))}
                </ul>
              </article>
            </section>

            <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
              <article className="rounded-[1.9rem] border border-slate-200/80 bg-white/88 p-6 shadow-[0_20px_50px_rgba(15,23,42,0.05)] sm:p-7">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <span className="inline-flex rounded-full border border-cyan-900/10 bg-cyan-900/8 px-4 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-cyan-900 sm:text-xs">
                      Active trips
                    </span>
                    <h2 className="mt-4 text-3xl font-semibold text-slate-950">
                      Trips currently in motion
                    </h2>
                  </div>
                  <p className="text-sm leading-7 text-slate-500">Monitoring only, no dispatch actions yet.</p>
                </div>

                <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200">
                  <div className="grid grid-cols-1 gap-2 bg-slate-50 px-5 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 sm:grid-cols-[1.1fr_1.4fr_1fr_1fr_0.9fr]">
                    <span>Trip</span>
                    <span>Route</span>
                    <span>Vehicle</span>
                    <span>Driver</span>
                    <span>Status</span>
                  </div>
                  {dashboard.activeTrips.map((trip) => (
                    <div
                      key={trip.tripId}
                      className="grid grid-cols-1 gap-2 border-t border-slate-200 px-5 py-4 text-sm text-slate-700 sm:grid-cols-[1.1fr_1.4fr_1fr_1fr_0.9fr]"
                    >
                      <span className="font-semibold text-slate-950">{trip.tripId}</span>
                      <span>{trip.route}</span>
                      <span>{trip.vehicle}</span>
                      <span>{trip.driver}</span>
                      <span className="inline-flex w-fit rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-900">
                        {trip.status}
                      </span>
                    </div>
                  ))}
                </div>
              </article>

              <div className="flex flex-col gap-6">
                <article className="rounded-[1.9rem] border border-slate-200/80 bg-white/88 p-6 shadow-[0_20px_50px_rgba(15,23,42,0.05)] sm:p-7">
                  <span className="inline-flex rounded-full border border-cyan-900/10 bg-cyan-900/8 px-4 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-cyan-900 sm:text-xs">
                    Cost snapshot
                  </span>
                  <h2 className="mt-4 text-3xl font-semibold text-slate-950">
                    Fuel, maintenance, and ROI
                  </h2>
                  <div className="mt-5 space-y-4">
                    {dashboard.costSummary.map((item) => (
                      <div
                        key={item.label}
                        className="rounded-3xl border border-slate-200 bg-slate-50 p-4"
                      >
                        <div className="flex items-center justify-between gap-4">
                          <p className="text-sm font-medium text-slate-500">{item.label}</p>
                          <strong className="text-xl font-semibold text-slate-950">{item.value}</strong>
                        </div>
                        <p className="mt-2 text-sm leading-7 text-slate-600">{item.detail}</p>
                      </div>
                    ))}
                  </div>
                </article>

                <article className="rounded-[1.9rem] border border-slate-200/80 bg-white/88 p-6 shadow-[0_20px_50px_rgba(15,23,42,0.05)] sm:p-7">
                  <span className="inline-flex rounded-full border border-cyan-900/10 bg-cyan-900/8 px-4 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-cyan-900 sm:text-xs">
                    Regional performance
                  </span>
                  <h2 className="mt-4 text-3xl font-semibold text-slate-950">
                    Utilization by region
                  </h2>
                  <div className="mt-5 space-y-4">
                    {dashboard.regionPerformance.map((region) => (
                      <div
                        key={region.region}
                        className="rounded-3xl border border-slate-200 bg-slate-50 p-4"
                      >
                        <div className="flex items-center justify-between gap-4">
                          <strong className="text-base font-semibold text-slate-950">{region.region}</strong>
                          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
                            {region.utilization}
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-slate-600">{region.available}</p>
                        <p className="mt-1 text-sm text-slate-600">{region.trips}</p>
                      </div>
                    ))}
                  </div>
                </article>
              </div>
            </section>
          </>
        ) : null}
      </div>
    </main>
  );
}

function StatusCard({ message, tone }: { message: string; tone: 'slate' | 'red' }) {
  const className =
    tone === 'red'
      ? 'border-red-200 bg-red-50 text-red-900'
      : 'border-slate-200 bg-white/88 text-slate-600';

  return (
    <div className={`rounded-[1.7rem] border p-5 shadow-[0_18px_40px_rgba(15,23,42,0.05)] ${className}`}>
      {message}
    </div>
  );
}
