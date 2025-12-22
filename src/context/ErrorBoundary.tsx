// ErrorBoundary.tsx
import React from "react";
import { Navigate } from "react-router-dom";

type State = {
  hasError: boolean;
};

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  State
> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown, info: unknown) {
    // log opcional (Sentry, LogRocket, etc.)
    console.error(error, info);
  }

  render() {
    if (this.state.hasError) {
      return <Navigate to="/manutencao" replace />;
    }

    return this.props.children;
  }
}