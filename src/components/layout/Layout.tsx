import { Footer } from "./Footer";
import { Header } from "./Header";
import { Outlet } from "react-router-dom";
import { StatsBar } from "./StatsBar";

export function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-canvas text-ink">
      <a
        href="#content"
        className="sr-only rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-ink focus:not-sr-only focus:absolute focus:start-4 focus:top-3 focus:z-50"
      >
        Skip to content
      </a>
      <Header />
      <StatsBar />
      <div id="content" className="min-w-0 flex-1">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}
