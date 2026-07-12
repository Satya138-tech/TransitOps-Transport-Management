import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { createTrip } from '../api';

type TripFormData = {
  source: string;
  destination: string;
  dispatchDate: string;
  dispatchWindow: string;
  cargoWeight: string;
  plannedDistance: string;
  vehicleType: string;
  region: string;
  priority: string;
  notes: string;
};

const initialFormData: TripFormData = {
  source: '',
  destination: '',
  dispatchDate: '',
  dispatchWindow: 'Morning',
  cargoWeight: '',
  plannedDistance: '',
  vehicleType: 'Van',
  region: 'North',
  priority: 'Standard',
  notes: '',
};

const vehicleTypes = ['Van', 'Truck', 'Mini Truck', 'Bus', 'Trailer', 'EV'];
const regions = ['North', 'South', 'East', 'West', 'Central'];
const priorities = ['Standard', 'High', 'Critical'];
const dispatchWindows = ['Morning', 'Afternoon', 'Evening', 'Night'];

const backendSteps = [
  'Validate trip data, cargo weight, and service window.',
  'Filter available drivers by region, trip status, and license validity.',
  'Score eligible drivers by proximity, safety score, workload, and availability.',
  'Send a notification request to the best-ranked driver and reserve the preferred vehicle.',
];

const eligibilityRules = [
  'Drivers with expired licenses or suspended status must never be selected.',
  'Drivers and vehicles already on a trip are excluded from assignment.',
  'Cargo weight must stay within the selected vehicle category capacity.',
  'Only backend-confirmed matches should move to dispatch-ready state.',
];

export default function NewTrip() {
  const [formData, setFormData] = useState<TripFormData>(initialFormData);
  const [submittedTrip, setSubmittedTrip] = useState<Awaited<ReturnType<typeof createTrip>> | null>(null);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await createTrip({
        source: formData.source,
        destination: formData.destination,
        dispatchDate: formData.dispatchDate,
        dispatchWindow: formData.dispatchWindow,
        cargoWeight: Number(formData.cargoWeight),
        plannedDistance: Number(formData.plannedDistance),
        vehicleType: formData.vehicleType,
        region: formData.region,
        priority: formData.priority,
        notes: formData.notes,
      });

      setSubmittedTrip(response);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to create trip.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const tripSearchText =
    formData.source || formData.destination
      ? `${formData.source || 'Unknown source'} to ${formData.destination || 'Unknown destination'}`
      : 'Route search preview';

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(255,191,120,0.24),_transparent_24%),radial-gradient(circle_at_top_right,_rgba(24,119,145,0.12),_transparent_28%),linear-gradient(180deg,_#f5fbff_0%,_#edf5f8_100%)] text-slate-800">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
        <section className="rounded-[2rem] border border-slate-200/80 bg-[radial-gradient(circle_at_top_left,_rgba(255,185,107,0.18),_transparent_28%),linear-gradient(135deg,_#f7fbff_0%,_#ebf4f8_52%,_#fff9ef_100%)] p-6 shadow-[0_24px_60px_rgba(7,26,43,0.08)] sm:p-8 lg:p-10">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <span className="inline-flex rounded-full border border-cyan-900/10 bg-cyan-900/8 px-4 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-cyan-900 sm:text-xs">
                New Trip Request
              </span>
              <h1 className="mt-5 text-4xl leading-tight font-semibold tracking-[-0.04em] text-slate-950 sm:text-5xl lg:text-6xl">
                Search and submit a new trip for backend driver matching.
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
                Users can define the route, cargo, and timing here. The trip request now goes to
                the backend, which decides the best available driver and sends the notification
                automatically.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white/80 px-6 py-3 text-sm font-semibold text-slate-900 transition hover:-translate-y-0.5 hover:border-cyan-800 hover:text-cyan-900" to="/">
                Back to landing page
              </Link>
              <Link className="inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_35px_rgba(15,23,42,0.18)] transition hover:-translate-y-0.5 hover:bg-cyan-900" to="/admin">
                Open admin dashboard
              </Link>
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
          <form className="rounded-[1.9rem] border border-slate-200/80 bg-white/88 p-6 shadow-[0_20px_50px_rgba(15,23,42,0.05)] sm:p-8" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <span className="inline-flex rounded-full border border-cyan-900/10 bg-cyan-900/8 px-4 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-cyan-900 sm:text-xs">
                  Search criteria
                </span>
                <h2 className="mt-4 text-3xl font-semibold text-slate-950">
                  Trip request details
                </h2>
              </div>
              <p className="text-sm leading-7 text-slate-500">
                This form posts to the backend assignment logic.
              </p>
            </div>

            <div className="mt-8 grid gap-5 md:grid-cols-2">
              <Field label="Source" name="source" placeholder="Delhi Warehouse" value={formData.source} onChange={handleChange} required />
              <Field label="Destination" name="destination" placeholder="Jaipur Distribution Hub" value={formData.destination} onChange={handleChange} required />
              <Field label="Dispatch Date" name="dispatchDate" type="date" value={formData.dispatchDate} onChange={handleChange} required />
              <SelectField label="Dispatch Window" name="dispatchWindow" value={formData.dispatchWindow} onChange={handleChange} options={dispatchWindows} />
              <Field label="Cargo Weight (kg)" name="cargoWeight" type="number" min="0" placeholder="450" value={formData.cargoWeight} onChange={handleChange} required />
              <Field label="Planned Distance (km)" name="plannedDistance" type="number" min="0" placeholder="280" value={formData.plannedDistance} onChange={handleChange} required />
              <SelectField label="Preferred Vehicle Type" name="vehicleType" value={formData.vehicleType} onChange={handleChange} options={vehicleTypes} />
              <SelectField label="Region" name="region" value={formData.region} onChange={handleChange} options={regions} />
              <SelectField label="Priority" name="priority" value={formData.priority} onChange={handleChange} options={priorities} />
            </div>

            <div className="mt-5">
              <label className="block text-sm font-medium text-slate-700">
                Dispatch Notes
                <textarea
                  className="mt-2 min-h-32 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-700 focus:bg-white focus:ring-4 focus:ring-cyan-100"
                  name="notes"
                  placeholder="Add route restrictions, cargo handling notes, or service-level details."
                  value={formData.notes}
                  onChange={handleChange}
                />
              </label>
            </div>

            {error ? <Feedback message={error} tone="red" /> : null}

            <div className="mt-8 flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm leading-7 text-slate-500">
                Submitting here sends the request to the backend matcher.
              </p>
              <button
                className="inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_35px_rgba(15,23,42,0.18)] transition hover:-translate-y-0.5 hover:bg-cyan-900 disabled:cursor-not-allowed disabled:opacity-60"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Search and request trip'}
              </button>
            </div>
          </form>

          <div className="flex flex-col gap-6">
            <article className="rounded-[1.9rem] border border-slate-900/10 bg-[radial-gradient(circle_at_top,_rgba(255,164,89,0.18),_transparent_32%),linear-gradient(180deg,_#0b2233_0%,_#12374d_100%)] p-6 text-slate-100 shadow-[0_24px_60px_rgba(7,26,43,0.12)] sm:p-7">
              <span className="inline-flex rounded-full border border-cyan-200/20 bg-cyan-200/10 px-3 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-cyan-100 sm:text-xs">
                Backend flow
              </span>
              <h2 className="mt-4 text-3xl font-semibold text-white">
                How the best driver gets selected
              </h2>
              <ol className="mt-5 space-y-4 text-sm leading-7 text-slate-200">
                {backendSteps.map((step, index) => (
                  <li key={step} className="relative min-h-9 pl-12">
                    <span className="absolute top-0 left-0 grid h-8 w-8 place-items-center rounded-full bg-cyan-400/20 text-xs font-semibold text-cyan-100">
                      {index + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </article>

            <article className="rounded-[1.9rem] border border-slate-200/80 bg-white/88 p-6 shadow-[0_20px_50px_rgba(15,23,42,0.05)] sm:p-7">
              <span className="inline-flex rounded-full border border-cyan-900/10 bg-cyan-900/8 px-4 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-cyan-900 sm:text-xs">
                Eligibility guardrails
              </span>
              <ul className="mt-5 space-y-4 text-sm leading-7 text-slate-600">
                {eligibilityRules.map((rule) => (
                  <li
                    key={rule}
                    className="relative rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 pl-11"
                  >
                    <span className="absolute top-5 left-4 h-2.5 w-2.5 rounded-full bg-amber-500" />
                    {rule}
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <article className="rounded-[1.9rem] border border-slate-200/80 bg-white/88 p-6 shadow-[0_20px_50px_rgba(15,23,42,0.05)] sm:p-7">
            <span className="inline-flex rounded-full border border-cyan-900/10 bg-cyan-900/8 px-4 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-cyan-900 sm:text-xs">
              Search preview
            </span>
            <h2 className="mt-4 text-3xl font-semibold text-slate-950">
              Current route request
            </h2>

            <div className="mt-5 rounded-[1.7rem] border border-slate-200 bg-slate-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                Requested route
              </p>
              <p className="mt-3 text-2xl font-semibold text-slate-950">{tripSearchText}</p>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <SummaryItem label="Vehicle Type" value={formData.vehicleType} />
                <SummaryItem label="Cargo Weight" value={formData.cargoWeight ? `${formData.cargoWeight} kg` : 'Not set'} />
                <SummaryItem label="Distance" value={formData.plannedDistance ? `${formData.plannedDistance} km` : 'Not set'} />
                <SummaryItem label="Priority" value={formData.priority} />
                <SummaryItem label="Region" value={formData.region} />
                <SummaryItem label="Dispatch Window" value={formData.dispatchDate ? `${formData.dispatchDate} | ${formData.dispatchWindow}` : formData.dispatchWindow} />
              </div>
            </div>
          </article>

          <article className="rounded-[1.9rem] border border-slate-200/80 bg-white/88 p-6 shadow-[0_20px_50px_rgba(15,23,42,0.05)] sm:p-7">
            <span className="inline-flex rounded-full border border-cyan-900/10 bg-cyan-900/8 px-4 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-cyan-900 sm:text-xs">
              Request status
            </span>
            <h2 className="mt-4 text-3xl font-semibold text-slate-950">
              Backend assignment handoff
            </h2>

            {submittedTrip ? (
              <div className="mt-5 space-y-4">
                <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5 text-sm leading-7 text-emerald-900">
                  <p className="font-semibold">{submittedTrip.message}</p>
                  <p>
                    {submittedTrip.trip.assignedDriver} was selected for the route from {submittedTrip.trip.source} to {submittedTrip.trip.destination}.
                  </p>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                    Backend response
                  </p>
                  <dl className="mt-4 grid gap-4 sm:grid-cols-2">
                    <SummaryItem label="Trip ID" value={submittedTrip.trip.tripId} />
                    <SummaryItem label="Driver" value={submittedTrip.assignment.driverName} />
                    <SummaryItem label="Vehicle" value={submittedTrip.trip.assignedVehicle} />
                    <SummaryItem label="Status" value={submittedTrip.trip.status} />
                    <SummaryItem label="Region" value={submittedTrip.trip.region} />
                    <SummaryItem label="Safety Score" value={String(submittedTrip.assignment.safetyScore)} />
                  </dl>
                </div>

                <div className="rounded-3xl border border-cyan-200 bg-cyan-50 p-5 text-sm leading-7 text-cyan-950">
                  <p className="font-semibold">Notification sent</p>
                  <p>{submittedTrip.assignment.notification}</p>
                </div>
              </div>
            ) : (
              <div className="mt-5 rounded-3xl border border-slate-200 bg-slate-50 p-5 text-sm leading-7 text-slate-500">
                Submit a trip request to send it to the backend for best-driver selection and notification.
              </div>
            )}
          </article>
        </section>
      </div>
    </main>
  );
}

function Feedback({ message, tone }: { message: string; tone: 'red' }) {
  return (
    <div className={`mt-5 rounded-3xl border p-4 text-sm leading-7 ${tone === 'red' ? 'border-red-200 bg-red-50 text-red-900' : ''}`}>
      {message}
    </div>
  );
}

function Field({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = 'text',
  required = false,
  min,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  min?: string;
}) {
  return (
    <label className="block text-sm font-medium text-slate-700">
      {label}
      <input
        className="mt-2 h-13 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition focus:border-cyan-700 focus:bg-white focus:ring-4 focus:ring-cyan-100"
        min={min}
        name={name}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        type={type}
        value={value}
      />
    </label>
  );
}

function SelectField({
  label,
  name,
  value,
  onChange,
  options,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => void;
  options: string[];
}) {
  return (
    <label className="block text-sm font-medium text-slate-700">
      {label}
      <select
        className="mt-2 h-13 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition focus:border-cyan-700 focus:bg-white focus:ring-4 focus:ring-cyan-100"
        name={name}
        onChange={onChange}
        value={value}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4">
      <dt className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
        {label}
      </dt>
      <dd className="mt-2 text-sm font-medium text-slate-900">{value}</dd>
    </div>
  );
}
