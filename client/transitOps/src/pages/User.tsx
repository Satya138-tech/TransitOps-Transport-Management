import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getUserPortal } from '../api';

type UserPortal = Awaited<ReturnType<typeof getUserPortal>>;

export default function User() {
  const [portal, setPortal] = useState<UserPortal | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    getUserPortal()
      .then((data) => {
        if (!active) {
          return;
        }

        setPortal(data);
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
                User Portal
              </span>
              <h1 className="mt-5 text-4xl leading-tight font-semibold tracking-[-0.04em] text-slate-950 sm:text-5xl lg:text-6xl">
                Create trip requests and track backend matching status.
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
                This page gives operations users a clear place to start a trip request, monitor
                recent submissions, and understand how assignment decisions move through the
                platform.
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
                to="/new-trip"
              >
                Start new trip
              </Link>
            </div>
          </div>
        </section>

        {isLoading ? <PortalStatus message="Loading user portal..." tone="slate" /> : null}
        {error ? <PortalStatus message={error} tone="red" /> : null}

        {portal ? (
          <>
            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {portal.userMetrics.map((metric) => (
                <article
                  key={metric.label}
                  className="rounded-[1.7rem] border border-slate-200/80 bg-white/88 p-6 shadow-[0_18px_40px_rgba(15,23,42,0.05)]"
                >
                  <p className="text-sm font-medium text-slate-500">{metric.label}</p>
                  <strong className="mt-3 block text-4xl leading-none font-semibold text-slate-950">
                    {metric.value}
                  </strong>
                </article>
              ))}
            </section>

            <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
              <article className="rounded-[1.9rem] border border-slate-200/80 bg-white/88 p-6 shadow-[0_20px_50px_rgba(15,23,42,0.05)] sm:p-7">
                <span className="inline-flex rounded-full border border-cyan-900/10 bg-cyan-900/8 px-4 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-cyan-900 sm:text-xs">
                  Quick actions
                </span>
                <h2 className="mt-4 text-3xl font-semibold text-slate-950">
                  What would you like to do?
                </h2>

                <div className="mt-6 grid gap-4">
                  {portal.quickActions.map((action) => (
                    <Link
                      key={action.title}
                      className="rounded-[1.6rem] border border-slate-200 bg-slate-50 p-5 transition hover:-translate-y-0.5 hover:border-cyan-700 hover:bg-white"
                      to={action.to}
                    >
                      <h3 className="text-xl font-semibold text-slate-950">{action.title}</h3>
                      <p className="mt-2 text-sm leading-7 text-slate-600">{action.detail}</p>
                    </Link>
                  ))}
                </div>
              </article>

              <article className="rounded-[1.9rem] border border-slate-900/10 bg-[radial-gradient(circle_at_top,_rgba(255,164,89,0.18),_transparent_32%),linear-gradient(180deg,_#0b2233_0%,_#12374d_100%)] p-6 text-slate-100 shadow-[0_24px_60px_rgba(7,26,43,0.12)] sm:p-7">
                <span className="inline-flex rounded-full border border-cyan-200/20 bg-cyan-200/10 px-3 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-cyan-100 sm:text-xs">
                  Matching pipeline
                </span>
                <h2 className="mt-4 text-3xl font-semibold text-white">
                  How user requests move forward
                </h2>
                <ul className="mt-5 space-y-4 text-sm leading-7 text-slate-200">
                  {portal.backendNotes.map((item) => (
                    <li key={item} className="relative pl-6">
                      <span className="absolute top-2 left-0 h-2 w-2 rounded-full bg-amber-300" />
                      {item}
                    </li>
                  ))}
                </ul>
              </article>
            </section>

            <section className="rounded-[1.9rem] border border-slate-200/80 bg-white/88 p-6 shadow-[0_20px_50px_rgba(15,23,42,0.05)] sm:p-7">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <span className="inline-flex rounded-full border border-cyan-900/10 bg-cyan-900/8 px-4 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-cyan-900 sm:text-xs">
                    Recent requests
                  </span>
                  <h2 className="mt-4 text-3xl font-semibold text-slate-950">
                    Your latest trip submissions
                  </h2>
                </div>
                <p className="text-sm leading-7 text-slate-500">
                  Live from backend request history.
                </p>
              </div>

              <div className="mt-6 grid gap-4 lg:grid-cols-3">
                {portal.requestHistory.map((request) => (
                  <article
                    key={request.tripId}
                    className="rounded-[1.7rem] border border-slate-200 bg-slate-50 p-5"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                        {request.tripId}
                      </p>
                      <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-900">
                        {request.status}
                      </span>
                    </div>
                    <h3 className="mt-3 text-xl font-semibold text-slate-950">{request.route}</h3>
                    <p className="mt-2 text-sm text-slate-600">{request.requestedAt}</p>
                  </article>
                ))}
              </div>
            </section>
          </>
        ) : null}
      </div>
    </main>
  );
}

function PortalStatus({ message, tone }: { message: string; tone: 'slate' | 'red' }) {
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
