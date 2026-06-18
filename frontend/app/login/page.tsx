'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleReady, setIsGoogleReady] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => setIsGoogleReady(true);
    script.onerror = () => {
      setError('Failed to load Google login script.');
      setIsGoogleReady(false);
    };
    document.body.appendChild(script);

    return () => {
      script.onload = null;
      script.onerror = null;
      document.body.removeChild(script);
    };
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      localStorage.setItem('educhat-token', data.token);
      window.location.href = '/chat';
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Unexpected error occurred',
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    const googleWindow = window as Window & {
      google?: {
        accounts?: {
          id?: {
            initialize: (config: {
              client_id: string;
              callback: (response: { credential?: string }) => void;
            }) => void;
            prompt: () => void;
          };
        };
      };
    };

    setError('');

    if (!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) {
      setError('Google client ID is not configured.');
      return;
    }

    if (!isGoogleReady || !googleWindow.google?.accounts?.id) {
      setError('Google authentication is still loading. Please try again.');
      return;
    }

    setIsGoogleLoading(true);

    try {
      googleWindow.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        callback: async (response: { credential?: string }) => {
          if (!response.credential) return;

          try {
            const res = await fetch(`${API_URL}/auth/google`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ credential: response.credential }),
            });

            const data = await res.json();
            if (!res.ok) {
              throw new Error(data.message || 'Google login failed');
            }

            localStorage.setItem('educhat-token', data.token);
            window.location.href = '/chat';
          } catch (err) {
            setError(
              err instanceof Error ? err.message : 'Google login failed',
            );
          }
        },
      });

      googleWindow.google.accounts.id.prompt();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Google login could not start',
      );
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto flex max-w-md items-center justify-center px-6 py-16">
        <section className="w-full rounded-3xl border border-slate-800/70 bg-slate-900/75 p-8 shadow-2xl backdrop-blur-xl">
          <h1 className="text-3xl font-semibold text-white">Login</h1>
          <p className="mt-2 text-sm text-slate-400">
            Welcome back! Sign in to continue.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-2xl bg-blue-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-blue-500 disabled:opacity-50"
            >
              {isLoading ? 'Signing in...' : 'Login'}
            </button>
          </form>

          {error && <p className="mt-3 text-sm text-rose-400">{error}</p>}

          <div className="mt-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-700" />
            <span className="text-xs text-slate-500">or</span>
            <div className="h-px flex-1 bg-slate-700" />
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isGoogleLoading}
            className="mt-6 w-full rounded-2xl border border-slate-700 bg-white px-4 py-3 text-sm font-medium text-slate-900 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isGoogleLoading ? 'Opening Google...' : 'Continue with Google'}
          </button>

          <p className="mt-4 text-center text-sm text-slate-400">
            Don’t have an account?{' '}
            <Link href="/signup" className="text-blue-400 hover:underline">
              Sign up
            </Link>
          </p>
        </section>
      </main>
    </div>
  );
}
