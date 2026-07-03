import { Suspense, ReactNode } from "react";

interface SuspenseLoaderProps {
  children: ReactNode;
}

export const SuspenseLoader = ({ children }: SuspenseLoaderProps) => (
  <Suspense
    fallback={
      <div className="flex h-full min-h-[400px] items-center justify-center p-8">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    }
  >
    {children}
  </Suspense>
);
