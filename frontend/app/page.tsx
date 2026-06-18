'use client';

import Link from 'next/link';
import Navbar from '../components/Navbar';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950">
      <Navbar />
      <main className="mx-auto flex max-w-5xl flex-col items-center justify-center px-6 py-20 text-center">
        <div className="max-w-2xl rounded-3xl border border-slate-800 bg-slate-900/70 p-10 shadow-2xl">
          <h1 className="text-4xl font-semibold text-white">Welcome to EduChat</h1>
          <p className="mt-4 text-slate-300">
            Ask questions, get clear explanations, and learn faster with AI support.
          </p>
          <Link
            href="/chat"
            className="mt-8 inline-block rounded-xl bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-500"
          >
            Start Chat
          </Link>
        </div>
      </main>
    </div>
  );
}
