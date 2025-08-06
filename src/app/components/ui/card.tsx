// src/components/ui/card.tsx
import { ReactNode } from 'react';

export function Card({ children }: { children: ReactNode }) {
  return <div className="bg-white shadow rounded-2xl p-4">{children}</div>;
}

export function CardContent({ children }: { children: ReactNode }) {
  return <div>{children}</div>;
}