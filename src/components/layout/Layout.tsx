import { Footer } from "./Footer";
import { Header } from "./Header";
import { Outlet } from "react-router-dom";
import { StatsBar } from "./StatsBar";

export function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-canvas text-ink">
      <Header />
      <StatsBar />
      <div className="min-w-0 flex-1">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}
