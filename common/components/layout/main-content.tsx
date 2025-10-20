import { ReactNode } from "react";

interface MainContentProps {
  children: ReactNode;
  className?: string;
}

export function MainContent({ children, className = "" }: MainContentProps) {
  return (
    <main
      className={`p-6 space-y-6 max-w-full mx-auto w-[1200px] ${className}`.trim()}
    >
      {children}
    </main>
  );
}
