import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
  title: 'Precision Fermentation Scale-Up & Oxygen Transfer Workbench',
  description: 'Research-grade observability scenario simulator',
};
export default function RootLayout({ children }: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-ink text-slate-100 antialiased">
        {children}
      </body>
    </html>
  );
}
