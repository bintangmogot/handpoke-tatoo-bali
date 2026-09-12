import { ReactNode } from 'react';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-surface p-4 flex justify-between items-center">
        <div className="font-heading font-bold text-xl text-primary">Dotlinetattu Admin</div>
        <div className="flex gap-4">
          {/* We'll add logout later if needed, but for now just navigation */}
        </div>
      </nav>
      <main className="p-4 md:p-8 max-w-7xl mx-auto">
        {children}
      </main>
    </div>
  );
}
