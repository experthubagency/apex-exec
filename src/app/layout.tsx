import React from "react";

export const metadata = {
  title: "ApexExec Suite | Executive Search Engine",
  description: "6-Stage Executive Search & Candidate Dossier Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <style>{`
          body { font-family: 'Inter', sans-serif; background-color: #090d16; color: #f8fafc; }
          @media print {
            .no-print { display: none !important; }
            body { background: white !important; color: black !important; }
            .print-card { border: none !important; box-shadow: none !important; background: white !important; color: black !important; }
          }
        `}</style>
      </head>
      <body className="min-h-screen antialiased selection:bg-amber-500/30 selection:text-amber-200">
        {children}
      </body>
    </html>
  );
}
