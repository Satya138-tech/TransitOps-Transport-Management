import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { submitAuth } from '../api';

type AuthMode = 'login' | 'signup';

type AuthFormData = {
  email: string;
  password: string;
  role: 'user' | 'driver';
};

const initialFormData: AuthFormData = {
  email: '',
  password: '',
  role: 'user',
};

const roleOptions: Array<AuthFormData['role']> = ['user', 'driver'];

const benefits = [
  'Users can create and track trip requests from a single portal.',
  'Drivers receive assignment visibility based on backend matching.',
  'Role choice keeps the experience aligned with each workflow.',
];

export default function Auth() {
  const [mode, setMode] = useState<AuthMode>('login');
  const [formData, setFormData] = useState<AuthFormData>(initialFormData);
  const [submittedState, setSubmittedState] = useState<Awaited<ReturnType<typeof submitAuth>> | null>(null);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
      const response = await submitAuth({
        mode,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });

      setSubmittedState(response);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to submit auth request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const heading = mode === 'login' ? 'Sign in to TransitOps' : 'Create your TransitOps account';
  const helperText =
    mode === 'login'
      ? 'Access your trip, fleet, or driver workflow with your role-based account.'
      : 'Register with email, password, and role so the platform can route you to the right experience.';
  const submitLabel = mode === 'login' ? 'Log in' : 'Sign up';

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(255,191,120,0.24),_transparent_24%),radial-gradient(circle_at_top_right,_rgba(24,119,145,0.12),_transparent_28%),linear-gradient(180deg,_#f5fbff_0%,_#edf5f8_100%)] text-slate-800">
      <div className="mx-auto grid min-h-screen w-full max-w-7xl gap-6 px-4 py-5 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8 lg:py-8">
        <section className="rounded-[2rem] border border-slate-900/10 bg-[radial-gradient(circle_at_top,_rgba(255,164,89,0.18),_transparent_32%),linear-gradient(180deg,_#0b2233_0%,_#12374d_100%)] p-6 text-slate-100 shadow-[0_24px_60px_rgba(7,26,43,0.12)] sm:p-8 lg:p-10">
          <span className="inline-flex rounded-full border border-cyan-200/20 bg-cyan-200/10 px-3 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-cyan-100 sm:text-xs">
            Auth Portal
          </span>
          <h1 className="mt-5 text-4xl leading-tight font-semibold tracking-[-0.04em] text-white sm:text-5xl">
            Role-based access for both users and drivers.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-8 text-slate-200 sm:text-lg">
            Choose whether you are signing in or creating an account, then select the role
            that matches your workflow in TransitOps.
          </p>

          <div className="mt-8 space-y-4">
            {benefits.map((item) => (
              <div
                key={item}
                className="rounded-3xl border border-white/10 bg-white/6 p-4 text-sm leading-7 text-slate-200"
              >
                {item}
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/15"
              to="/"
            >
              Back to landing page
            </Link>
            <Link
              className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5 hover:bg-cyan-50"
              to="/new-trip"
            >
              Explore trip flow
            </Link>
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200/80 bg-[radial-gradient(circle_at_top_left,_rgba(255,185,107,0.18),_transparent_28%),linear-gradient(135deg,_#f7fbff_0%,_#ebf4f8_52%,_#fff9ef_100%)] p-6 shadow-[0_24px_60px_rgba(7,26,43,0.08)] sm:p-8 lg:p-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span className="inline-flex rounded-full border border-cyan-900/10 bg-cyan-900/8 px-4 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-cyan-900 sm:text-xs">
                {mode === 'login' ? 'Login' : 'Signup'}
              </span>
              <h2 className="mt-4 text-3xl font-semibold text-slate-950 sm:text-4xl">
                {heading}
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
                {helperText}
              </p>
            </div>

            <div className="inline-flex rounded-full border border-slate-200 bg-white p-1 shadow-sm">
              <button
                className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                  mode === 'login'
                    ? 'bg-slate-950 text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                onClick={() => setMode('login')}
                type="button"
              >
                Login
              </button>
              <button
                className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                  mode === 'signup'
                    ? 'bg-slate-950 text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                onClick={() => setMode('signup')}
                type="button"
              >
                Signup
              </button>
            </div>
          </div>

          <form className="mt-8" onSubmit={handleSubmit}>
            <div className="grid gap-5">
              <Field label="Email Address" name="email" type="email" placeholder="name@transitops.com" value={formData.email} onChange={handleChange} />
              <Field label="Password" name="password" type="password" placeholder="Enter your password" value={formData.password} onChange={handleChange} />

              <label className="block text-sm font-medium text-slate-700">
                Role
                <select
                  className="mt-2 h-13 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition focus:border-cyan-700 focus:bg-white focus:ring-4 focus:ring-cyan-100"
                  name="role"
                  onChange={handleChange}
                  value={formData.role}
                >
                  {roleOptions.map((role) => (
                    <option key={role} value={role}>
                      {role === 'user' ? 'User' : 'Driver'}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {error ? (
              <div className="mt-5 rounded-3xl border border-red-200 bg-red-50 p-4 text-sm leading-7 text-red-900">
                {error}
              </div>
            ) : null}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm leading-7 text-slate-500">
                {mode === 'login'
                  ? 'Use your registered role to enter the right operational workspace.'
                  : 'New accounts are created against the backend auth route.'}
              </p>
              <button
                className="inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_35px_rgba(15,23,42,0.18)] transition hover:-translate-y-0.5 hover:bg-cyan-900 disabled:cursor-not-allowed disabled:opacity-60"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : submitLabel}
              </button>
            </div>
          </form>

          <div className="mt-8 rounded-[1.7rem] border border-slate-200 bg-white/80 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
              Preview
            </p>
            <dl className="mt-4 grid gap-4 sm:grid-cols-3">
              <SummaryItem label="Mode" value={mode === 'login' ? 'Login' : 'Signup'} />
              <SummaryItem label="Email" value={formData.email || 'Not set'} />
              <SummaryItem label="Role" value={formData.role === 'user' ? 'User' : 'Driver'} />
            </dl>

            {submittedState ? (
              <div className="mt-5 rounded-3xl border border-emerald-200 bg-emerald-50 p-4 text-sm leading-7 text-emerald-900">
                <p className="font-semibold">{submittedState.message}</p>
                <p>
                  {submittedState.user.email} is ready to continue as a {submittedState.user.role}.
                </p>
              </div>
            ) : (
              <div className="mt-5 rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm leading-7 text-slate-500">
                Submit the form to send the auth request to the backend.
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

function Field({
  label,
  name,
  type,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  name: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}) {
  return (
    <label className="block text-sm font-medium text-slate-700">
      {label}
      <input
        className="mt-2 h-13 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition focus:border-cyan-700 focus:bg-white focus:ring-4 focus:ring-cyan-100"
        name={name}
        onChange={onChange}
        placeholder={placeholder}
        required
        type={type}
        value={value}
      />
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
