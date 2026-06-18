import Link from 'next/link';
import { useEffect, useState } from 'react';
import ThemeToggle from './ThemeToggle';

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/chat', label: 'Chat' },
  { href: '/about', label: 'About' },
];

export default function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('educhat-token');
    setIsAuthenticated(Boolean(token));
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/70 bg-slate-950/70 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-semibold text-white">
          EduChat
        </Link>
        <div className="flex items-center gap-3">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-xl px-3 py-2 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-blue-400"
            >
              {item.label}
            </Link>
          ))}
          {isAuthenticated ? (
            <button
              type="button"
              onClick={() => {
                localStorage.removeItem('educhat-token');
                setIsAuthenticated(false);
                window.location.href = '/';
              }}
              className="rounded-xl px-3 py-2 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-rose-400"
            >
              Logout
            </button>
          ) : (
            <Link
              href="/login"
              className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500"
            >
              Login
            </Link>
          )}
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
