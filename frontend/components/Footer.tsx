export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950/90">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-4 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
        <p>© 2026 EduChat. All rights reserved.</p>
        <div className="flex gap-4">
          <a href="#" className="hover:text-blue-400">
            Privacy
          </a>
          <a href="#" className="hover:text-blue-400">
            Terms
          </a>
        </div>
      </div>
    </footer>
  );
}
