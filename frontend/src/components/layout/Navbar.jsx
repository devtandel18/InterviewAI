import { Link } from "react-router-dom";
import Logo from "../ui/Logo";
import Button from "../ui/Button";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 dark:border-[#1f242e] bg-white/80 dark:bg-[#0b0e14]/80 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link to="/">
          <Logo />
        </Link>
        <div className="hidden items-center gap-8 text-sm text-slate-600 dark:text-slate-400 md:flex">
          <a href="#features" className="hover:text-slate-900 dark:hover:text-white">
            Features
          </a>
          <a href="#pipeline" className="hover:text-slate-900 dark:hover:text-white">
            How it works
          </a>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login">
            <Button variant="ghost" size="sm">
              Sign in
            </Button>
          </Link>
          <Link to="/register">
            <Button size="sm">Start Interview</Button>
          </Link>
        </div>
      </nav>
    </header>
  );
}