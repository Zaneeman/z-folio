"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type ViewState = "splash" | "index";

interface RotationContextValue {
  state: ViewState;
  isIndex: boolean;
  isAnimating: boolean;
  toggle: () => void;
  goTo: (next: ViewState) => void;
}

const RotationContext = createContext<RotationContextValue | null>(null);

// Matches the CSS transition duration in globals.css (--rotation-duration).
const ROTATION_DURATION_MS = 750;

export function RotationProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ViewState>("splash");
  const [isAnimating, setIsAnimating] = useState(false);

  const goTo = useCallback(
    (next: ViewState) => {
      setState((current) => {
        if (current === next || isAnimating) return current;
        setIsAnimating(true);
        window.setTimeout(() => setIsAnimating(false), ROTATION_DURATION_MS);
        return next;
      });
    },
    [isAnimating]
  );

  const toggle = useCallback(() => {
    goTo(state === "splash" ? "index" : "splash");
  }, [state, goTo]);

  const value = useMemo(
    () => ({
      state,
      isIndex: state === "index",
      isAnimating,
      toggle,
      goTo,
    }),
    [state, isAnimating, toggle, goTo]
  );

  return (
    <RotationContext.Provider value={value}>
      {children}
    </RotationContext.Provider>
  );
}

export function useRotation() {
  const ctx = useContext(RotationContext);
  if (!ctx) {
    throw new Error("useRotation must be used within a RotationProvider");
  }
  return ctx;
}
