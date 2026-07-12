import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { createVehicle } from '../api';

type VehicleFormData = {
  registrationNumber: string;
  vehicleName: string;
  vehicleType: string;
  maxLoadCapacity: string;
  odometer: string;
  acquisitionCost: string;
  status: string;
  region: string;
  acquisitionDate: string;
  notes: string;
};

const initialFormData: VehicleFormData = {
  registrationNumber: '',
  vehicleName: '',
  vehicleType: 'Van',
  maxLoadCapacity: '',
  odometer: '',
  acquisitionCost: '',
  status: 'Available',
  region: 'North',
  acquisitionDate: '',
  notes: '',
};

const statusOptions = ['Available', 'On Trip', 'In Shop', 'Retired'];
const vehicleTypes = ['Van', 'Truck', 'Mini Truck', 'Bus', 'Trailer', 'EV'];
const regionOptions = ['North', 'South', 'East', 'West', 'Central'];

const checklist = [
  'Registration number should be unique across the fleet.',
  'Only available vehicles should move into future dispatch flows.',
  'Load capacity must be maintained for cargo validation later.',
  'Acquisition cost and odometer feed ROI and maintenance analytics.',
];

export default function Vehicle() {
  const [formData, setFormData] = useState<VehicleFormData>(initialFormData);
  const [submitted, setSubmitted] = useState<Awaited<ReturnType<typeof createVehicle>> | null>(null);
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
      const response = await createVehicle({
        registrationNumber: formData.registrationNumber,
        vehicleName: formData.vehicleName,
        vehicleType: formData.vehicleType,
        maxLoadCapacity: Number(formData.maxLoadCapacity),
        odometer: Number(formData.odometer),
        acquisitionCost: Number(formData.acquisitionCost),
        status: formData.status,
        region: formData.region,
        acquisitionDate: formData.acquisitionDate,
        notes: formData.notes,
      });

      setSubmitted(response);
      setFormData(initialFormData);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to register vehicle.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(255,191,120,0.24),_transparent_24%),radial-gradient(circle_at_top_right,_rgba(24,119,145,0.12),_transparent_28%),linear-gradient(180deg,_#f5fbff_0%,_#edf5f8_100%)] text-slate-800">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
        <section className="rounded-[2rem] border border-slate-200/80 bg-[radial-gradient(circle_at_top_left,_rgba(255,185,107,0.18),_transparent_28%),linear-gradient(135deg,_#f7fbff_0%,_#ebf4f8_52%,_#fff9ef_100%)] p-6 shadow-[0_24px_60px_rgba(7,26,43,0.08)] sm:p-8 lg:p-10">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <span className="inline-flex rounded-full border border-cyan-900/10 bg-cyan-900/8 px-4 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-cyan-900 sm:text-xs">
                Vehicle Registry
              </span>
              <h1 className="mt-5 text-4xl leading-tight font-semibold tracking-[-0.04em] text-slate-950 sm:text-5xl lg:text-6xl">
                Register a new vehicle for the TransitOps fleet.
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
                Capture the operational details needed for dispatch, maintenance,
                analytics, and lifecycle management in one clean intake form.
              </p>
            </div>

            <Link
              className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white/80 px-6 py-3 text-sm font-semibold text-slate-900 transition hover:-translate-y-0.5 hover:border-cyan-800 hover:text-cyan-900"
              to="/"
            >
              Back to landing page
            </Link>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <form
            className="rounded-[1.9rem] border border-slate-200/80 bg-white/88 p-6 shadow-[0_20px_50px_rgba(15,23,42,0.05)] sm:p-8"
            onSubmit={handleSubmit}
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <span className="inline-flex rounded-full border border-cyan-900/10 bg-cyan-900/8 px-4 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-cyan-900 sm:text-xs">
                  New registration
                </span>
                <h2 className="mt-4 text-3xl font-semibold text-slate-950">
                  Vehicle details
                </h2>
              </div>
              <p className="text-sm leading-7 text-slate-500">
                This now posts to the backend API.
              </p>
            </div>

            <div className="mt-8 grid gap-5 md:grid-cols-2">
              <Field label="Registration Number" name="registrationNumber" placeholder="MH-12-TR-9087" value={formData.registrationNumber} onChange={handleChange} required />
              <Field label="Vehicle Name / Model" name="vehicleName" placeholder="Ashok Leyland Dost+" value={formData.vehicleName} onChange={handleChange} required />
              <SelectField label="Vehicle Type" name="vehicleType" value={formData.vehicleType} onChange={handleChange} options={vehicleTypes} />
              <Field label="Maximum Load Capacity (kg)" name="maxLoadCapacity" type="number" min="0" placeholder="500" value={formData.maxLoadCapacity} onChange={handleChange} required />
              <Field label="Current Odometer (km)" name="odometer" type="number" min="0" placeholder="18240" value={formData.odometer} onChange={handleChange} required />
              <Field label="Acquisition Cost" name="acquisitionCost" type="number" min="0" step="0.01" placeholder="950000" value={formData.acquisitionCost} onChange={handleChange} required />
              <SelectField label="Initial Status" name="status" value={formData.status} onChange={handleChange} options={statusOptions} />
              <SelectField label="Region" name="region" value={formData.region} onChange={handleChange} options={regionOptions} />
              <Field label="Acquisition Date" name="acquisitionDate" type="date" value={formData.acquisitionDate} onChange={handleChange} />
            </div>

            <div className="mt-5">
              <label className="block text-sm font-medium text-slate-700">
                Notes
                <textarea
                  className="mt-2 min-h-32 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-700 focus:bg-white focus:ring-4 focus:ring-cyan-100"
                  name="notes"
                  placeholder="Add acquisition notes, document reminders, or maintenance context."
                  value={formData.notes}
                  onChange={handleChange}
                />
              </label>
            </div>

            {error ? <InlineStatus message={error} tone="red" /> : null}

            <div className="mt-8 flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm leading-7 text-slate-500">
                The submitted vehicle is saved to the backend in-memory store.
              </p>
              <button
                className="inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_35px_rgba(15,23,42,0.18)] transition hover:-translate-y-0.5 hover:bg-cyan-900 disabled:cursor-not-allowed disabled:opacity-60"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Registering...' : 'Register vehicle'}
              </button>
            </div>
          </form>

          <div className="flex flex-col gap-6">
            <article className="rounded-[1.9rem] border border-slate-900/10 bg-[radial-gradient(circle_at_top,_rgba(255,164,89,0.18),_transparent_32%),linear-gradient(180deg,_#0b2233_0%,_#12374d_100%)] p-6 text-slate-100 shadow-[0_24px_60px_rgba(7,26,43,0.12)] sm:p-7">
              <span className="inline-flex rounded-full border border-cyan-200/20 bg-cyan-200/10 px-3 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-cyan-100 sm:text-xs">
                Registration checklist
              </span>
              <ul className="mt-5 space-y-4 text-sm leading-7 text-slate-200">
                {checklist.map((item) => (
                  <li
                    key={item}
                    className="relative border-b border-white/8 pb-4 pl-6 last:border-b-0 last:pb-0"
                  >
                    <span className="absolute top-2 left-0 h-2 w-2 rounded-full bg-amber-300" />
                    {item}
                  </li>
                ))}
              </ul>
            </article>

            <article className="rounded-[1.9rem] border border-slate-200/80 bg-white/88 p-6 shadow-[0_20px_50px_rgba(15,23,42,0.05)] sm:p-7">
              <span className="inline-flex rounded-full border border-cyan-900/10 bg-cyan-900/8 px-4 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-cyan-900 sm:text-xs">
                Live summary
              </span>
              <h2 className="mt-4 text-3xl font-semibold text-slate-950">
                Registration preview
              </h2>

              <dl className="mt-5 grid gap-4 sm:grid-cols-2">
                <SummaryItem label="Registration" value={formData.registrationNumber || 'Not set'} />
                <SummaryItem label="Model" value={formData.vehicleName || 'Not set'} />
                <SummaryItem label="Type" value={formData.vehicleType} />
                <SummaryItem label="Capacity" value={formData.maxLoadCapacity ? `${formData.maxLoadCapacity} kg` : 'Not set'} />
                <SummaryItem label="Odometer" value={formData.odometer ? `${formData.odometer} km` : 'Not set'} />
                <SummaryItem label="Acquisition Cost" value={formData.acquisitionCost ? `Rs. ${formData.acquisitionCost}` : 'Not set'} />
                <SummaryItem label="Status" value={formData.status} />
                <SummaryItem label="Region" value={formData.region} />
              </dl>

              {submitted ? (
                <div className="mt-6 rounded-3xl border border-emerald-200 bg-emerald-50 p-4 text-sm leading-7 text-emerald-900">
                  <p className="font-semibold">{submitted.message}</p>
                  <p>
                    {submitted.vehicle.vehicleName} with registration {submitted.vehicle.registrationNumber} was saved to the API.
                  </p>
                </div>
              ) : (
                <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm leading-7 text-slate-500">
                  Submit the form to save the vehicle through the backend.
                </div>
              )}
            </article>
          </div>
        </section>
      </div>
    </main>
  );
}

function InlineStatus({ message, tone }: { message: string; tone: 'red' }) {
  return (
    <div className={`mt-5 rounded-3xl border p-4 text-sm leading-7 ${tone === 'red' ? 'border-red-200 bg-red-50 text-red-900' : ''}`}>
      {message}
    </div>
  );
}

type FieldProps = {
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
  step?: string;
};

function Field({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = 'text',
  required = false,
  min,
  step,
}: FieldProps) {
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
        step={step}
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
    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
      <dt className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
        {label}
      </dt>
      <dd className="mt-2 text-sm font-medium text-slate-900">{value}</dd>
    </div>
  );
}
