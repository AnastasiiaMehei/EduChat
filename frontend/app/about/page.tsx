'use client';

import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';

interface AboutData {
  name: string;
  description: string;
  technologies: string[];
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export default function AboutPage() {
  const [about, setAbout] = useState<AboutData | null>(null);

  useEffect(() => {
    const loadAbout = async () => {
      try {
        const response = await fetch(`${API_URL}/about`);
        const data = await response.json();
        setAbout(data);
      } catch {
        setAbout({
          name: 'About EduChat',
          description:
            'EduChat is an AI-powered learning assistant designed to explain difficult topics in simple language.',
          technologies: ['Next.js', 'NestJS', 'AI APIs'],
        });
      }
    };

    loadAbout();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950">
      <Navbar />
      <main className="mx-auto max-w-4xl px-6 py-16">
        <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-8 shadow-2xl">
          <h1 className="text-3xl font-semibold text-white">
            {about?.name || 'About EduChat'}
          </h1>
          <p className="mt-4 text-slate-300">
            {about?.description ||
              'EduChat is an AI-powered learning assistant designed to explain difficult topics in simple language.'}
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-slate-950 p-4">
              <h2 className="font-medium text-white">Frontend</h2>
              <p className="mt-2 text-sm text-slate-400">Next.js, React, Tailwind CSS</p>
            </div>
            <div className="rounded-2xl bg-slate-950 p-4">
              <h2 className="font-medium text-white">Backend</h2>
              <p className="mt-2 text-sm text-slate-400">
                {about?.technologies?.join(', ') || 'NestJS, WebSocket, AI APIs'}
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
