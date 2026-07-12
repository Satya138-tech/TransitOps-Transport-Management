import { Link } from 'react-router-dom';

const portalLinks = [
  {
    title: 'Fleet Control',
    subtitle: 'Admin workspace',
    description:
      'Track vehicle health, monitor active fleet status, and keep operations aligned with operational rules.',
    to: '/admin',
  },
  {
    title: 'Dispatch Desk',
    subtitle: 'Driver operations',
    description:
      'Create trips, assign available assets, and move deliveries through a clean dispatch lifecycle.',
    to: '/driver',
  },
  {
    title: 'Field Access',
    subtitle: 'User portal',
    description:
      'Support role-based access for transport staff, coordinators, and analysts across the platform.',
    to: '/user',
  },
  {
    title: 'Vehicle Registry',
    subtitle: 'Asset onboarding',
    description:
      'Register vehicles with capacity, odometer, acquisition cost, and lifecycle status in one place.',
    to: '/vehicle-registration',
  },
];

const capabilities = [
  'Live KPIs for active vehicles, trips, maintenance load, and fleet utilization',
  'Vehicle and driver records with compliance, capacity, and lifecycle tracking',
  'Trip dispatch rules that block invalid assignments before they disrupt operations',
  'Maintenance, fuel, and expense workflows tied directly to operational cost',
  'Analytics-ready reporting for fuel efficiency, ROI, and performance visibility',
  'Responsive role-based interface suitable for both hackathon delivery and scale-up',
];

const workflow = [
  'Register vehicles and drivers with their required availability and compliance details.',
  'Create trips using only eligible drivers and vehicles that satisfy load limits.',
  'Dispatch trips to automatically move both assets into the On Trip state.',
  'Complete or cancel trips to restore availability and keep utilization data accurate.',
  'Log maintenance, fuel, and expenses to update operational cost and fleet insights.',
];

const rules = [
  'Unique registration numbers prevent duplicate vehicle records.',
  'Retired and in-shop vehicles never appear in dispatch selection.',
  'Suspended drivers and expired licenses are blocked from assignment.',
  'Drivers or vehicles already on a trip cannot be double-booked.',
  'Cargo weight must stay within each vehicle’s maximum load capacity.',
  'Maintenance and trip actions trigger automatic status transitions.',
];

const metrics = [
  { value: '8 hrs', label: 'Hackathon build window' },
  { value: '6', label: 'Core data entities' },
  { value: '100%', label: 'Status-driven workflows' },
];

const pulseMetrics = [
  { value: '42', label: 'Active Vehicles' },
  { value: '11', label: 'On Trip' },
  { value: '4', label: 'In Shop' },
  { value: '87%', label: 'Fleet Utilization' },
];

export default function Landing() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(255,191,120,0.28),_transparent_22%),radial-gradient(circle_at_top_right,_rgba(24,119,145,0.14),_transparent_28%),linear-gradient(180deg,_#f5fbff_0%,_#edf5f8_100%)] text-slate-800">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
        <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-[2rem] border border-slate-200/80 bg-[radial-gradient(circle_at_top_left,_rgba(255,185,107,0.22),_transparent_34%),linear-gradient(135deg,_#f6fbff_0%,_#e8f1f8_48%,_#fdf8ef_100%)] p-6 shadow-[0_24px_60px_rgba(7,26,43,0.08)] sm:p-8 lg:p-10">
            <span className="inline-flex rounded-full border border-cyan-900/10 bg-cyan-900/8 px-4 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-cyan-900 sm:text-xs">
              TransitOps Smart Transport Operations Platform
            </span>

            <h1 className="mt-5 max-w-[11ch] text-5xl leading-[0.95] font-semibold tracking-[-0.05em] text-slate-950 sm:text-6xl lg:text-8xl">
              Digitize fleet operations from registration to reporting.
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
              TransitOps centralizes vehicles, drivers, dispatch, maintenance, fuel, and
              expenses into one operational control layer built for logistics teams that
              have outgrown spreadsheets and manual logbooks.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                className="inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_35px_rgba(15,23,42,0.18)] transition hover:-translate-y-0.5 hover:bg-cyan-900"
                to="/auth"
              >
                Explore platform
              </Link>
              <a
                className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white/80 px-6 py-3 text-sm font-semibold text-slate-900 transition hover:-translate-y-0.5 hover:border-cyan-800 hover:text-cyan-900"
                href="#problem-statement"
              >
                View requirements
              </a>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {metrics.map((metric) => (
                <article
                  key={metric.label}
                  className="rounded-3xl border border-slate-200/80 bg-white/70 p-4"
                >
                  <strong className="block text-3xl leading-none font-semibold text-slate-950">
                    {metric.value}
                  </strong>
                  <span className="mt-2 block text-sm text-slate-500">{metric.label}</span>
                </article>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-900/10 bg-[radial-gradient(circle_at_top,_rgba(255,164,89,0.18),_transparent_32%),linear-gradient(180deg,_#0b2233_0%,_#12374d_100%)] p-5 text-slate-100 shadow-[0_24px_60px_rgba(7,26,43,0.12)] sm:p-6">
            <div className="rounded-[1.6rem] border border-white/10 bg-white/6 p-5 backdrop-blur">
              <span className="inline-flex rounded-full border border-cyan-200/20 bg-cyan-200/10 px-3 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-cyan-100 sm:text-xs">
                Operations pulse
              </span>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {pulseMetrics.map((metric) => (
                  <div
                    key={metric.label}
                    className="rounded-3xl border border-white/10 bg-white/7 p-4"
                  >
                    <strong className="block text-3xl leading-none font-semibold text-white">
                      {metric.value}
                    </strong>
                    <span className="mt-2 block text-sm text-slate-300">{metric.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 rounded-[1.6rem] border border-white/10 bg-white/6 p-5 backdrop-blur">
              <span className="inline-flex rounded-full border border-amber-200/20 bg-amber-200/10 px-3 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-amber-100 sm:text-xs">
                Rule-aware dispatch
              </span>

              <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-200">
                <li className="border-b border-white/8 pb-3">
                  Capacity validation before dispatch
                </li>
                <li className="border-b border-white/8 pb-3">
                  License expiry checks before assignment
                </li>
                <li>Automatic driver and vehicle state changes</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-4">
          {portalLinks.map((portal) => (
            <Link
              key={portal.title}
              className="rounded-[1.7rem] border border-slate-200/80 bg-white/85 p-6 text-left shadow-[0_18px_40px_rgba(15,23,42,0.06)] transition hover:-translate-y-1 hover:shadow-[0_22px_48px_rgba(15,23,42,0.1)]"
              to={portal.to}
            >
              <span className="inline-flex text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-amber-700 sm:text-xs">
                {portal.subtitle}
              </span>
              <h2 className="mt-4 text-2xl font-semibold text-slate-950">{portal.title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">{portal.description}</p>
            </Link>
          ))}
        </section>

        <section id="problem-statement" className="grid gap-6 xl:grid-cols-2">
          <article className="rounded-[1.9rem] border border-slate-200/80 bg-[radial-gradient(circle_at_top_right,_rgba(255,184,107,0.18),_transparent_34%),linear-gradient(180deg,_#ffffff,_#f8fbff)] p-6 shadow-[0_20px_50px_rgba(15,23,42,0.05)] sm:p-7">
            <span className="inline-flex rounded-full border border-cyan-900/10 bg-cyan-900/8 px-4 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-cyan-900 sm:text-xs">
              Problem statement
            </span>
            <h2 className="mt-4 text-3xl font-semibold text-slate-950">
              Why TransitOps exists
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-600">
              Logistics operators often juggle manual logbooks, spreadsheets, and disconnected
              approvals. That leads to scheduling conflicts, poor asset utilization, missed
              maintenance, inaccurate cost tracking, and weak operational visibility.
            </p>
            <p className="mt-4 text-base leading-8 text-slate-600">
              TransitOps solves that by turning transport operations into one auditable,
              role-based system with smart validations, automatic status changes, and
              analytics-friendly data.
            </p>
          </article>

          <article className="rounded-[1.9rem] border border-slate-200/80 bg-white/86 p-6 shadow-[0_20px_50px_rgba(15,23,42,0.05)] sm:p-7">
            <span className="inline-flex rounded-full border border-cyan-900/10 bg-cyan-900/8 px-4 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-cyan-900 sm:text-xs">
              Core capabilities
            </span>
            <h2 className="mt-4 text-3xl font-semibold text-slate-950">
              What the platform needs to cover
            </h2>
            <ul className="mt-5 space-y-4 text-sm leading-7 text-slate-600">
              {capabilities.map((item) => (
                <li key={item} className="relative pl-5 before:absolute before:top-2.5 before:left-0 before:h-2 before:w-2 before:rounded-full before:bg-amber-500 before:content-['']">
                  {item}
                </li>
              ))}
            </ul>
          </article>
        </section>

        <section className="grid gap-6 xl:grid-cols-2">
          <article className="rounded-[1.9rem] border border-slate-200/80 bg-white/86 p-6 shadow-[0_20px_50px_rgba(15,23,42,0.05)] sm:p-7">
            <span className="inline-flex rounded-full border border-cyan-900/10 bg-cyan-900/8 px-4 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-cyan-900 sm:text-xs">
              Workflow
            </span>
            <h2 className="mt-4 text-3xl font-semibold text-slate-950">
              From onboarding to delivery completion
            </h2>
            <ol className="mt-5 space-y-4 text-sm leading-7 text-slate-600">
              {workflow.map((step, index) => (
                <li key={step} className="relative min-h-9 pl-13">
                  <span className="absolute top-0 left-0 grid h-9 w-9 place-items-center rounded-full bg-cyan-900 text-sm font-semibold text-white">
                    {index + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </article>

          <article className="rounded-[1.9rem] border border-slate-200/80 bg-white/86 p-6 shadow-[0_20px_50px_rgba(15,23,42,0.05)] sm:p-7">
            <span className="inline-flex rounded-full border border-cyan-900/10 bg-cyan-900/8 px-4 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-cyan-900 sm:text-xs">
              Guardrails
            </span>
            <h2 className="mt-4 text-3xl font-semibold text-slate-950">
              Mandatory business rules
            </h2>
            <ul className="mt-5 space-y-4 text-sm leading-7 text-slate-600">
              {rules.map((rule) => (
                <li key={rule} className="relative pl-5 before:absolute before:top-2.5 before:left-0 before:h-2 before:w-2 before:rounded-full before:bg-amber-500 before:content-['']">
                  {rule}
                </li>
              ))}
            </ul>
          </article>
        </section>
      </div>
    </main>
  );
}
