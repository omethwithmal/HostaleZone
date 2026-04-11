import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Building2, Menu, X, LayoutDashboard, Home, List, PlusCircle, ArrowLeft } from "lucide-react";

const links = [
  { to: "/complaint/dashboard", label: "Complaint Home", icon: Home },
  { to: "/complaint/complaints", label: "My Complaints", icon: List },
  { to: "/complaint/new", label: "Raise Complaint", icon: PlusCircle },
];

const linkClass = ({ isActive }) =>
  `inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold transition-all duration-300 ${
    isActive
      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-[0_8px_20px_rgba(37,99,235,0.3)] shadow-blue-500/30 scale-[1.02]"
      : "text-slate-600 hover:bg-slate-100 hover:text-blue-700"
  }`;

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="fixed inset-x-0 top-0 z-50 transition-all duration-300">
      <div className="mt-4 w-full px-4 sm:px-6 lg:px-8 2xl:px-10">
        <div className="rounded-[32px] border border-white/50 bg-white/70 px-4 py-3 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] backdrop-blur-2xl transition-all duration-400">
          <div className="flex items-center justify-between gap-4">
            
            <div className="flex items-center gap-3">
              <button 
                onClick={() => navigate('/dashboard')}
                className="group flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-all hover:bg-blue-100 hover:text-blue-700 hover:shadow-lg hover:shadow-blue-200"
                title="Return to Main Dashboard"
              >
                <ArrowLeft size={20} className="transition-transform group-hover:-translate-x-1" />
              </button>

              <NavLink to="/complaint" className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-[20px] bg-gradient-to-br from-blue-600 via-indigo-600 to-sky-500 text-white shadow-[0_8px_24px_rgba(37,99,235,0.4)]">
                  <Building2 size={22} className="drop-shadow-md" />
                </div>
                <div className="hidden sm:block">
                  <p className="text-lg font-black tracking-tight text-slate-900 leading-tight">HostalZone</p>
                  <p className="text-[0.65rem] font-bold text-blue-600 uppercase tracking-widest">Maintenance</p>
                </div>
              </NavLink>
            </div>

            <nav className="hidden items-center gap-1.5 md:flex">
              {links.map((link) => (
                <NavLink key={link.to} to={link.to} className={linkClass}>
                  {({ isActive }) => (
                    <>
                      <link.icon size={16} className={isActive ? "text-indigo-100" : "text-slate-400"} />
                      {link.label}
                    </>
                  )}
                </NavLink>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/dashboard')}
                className="hidden lg:inline-flex items-center gap-2 rounded-full border-2 border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50"
              >
                <LayoutDashboard size={16} className="text-blue-600" />
                Main Dashboard
              </button>
              <button
                type="button"
                className="inline-flex rounded-2xl border border-slate-200 bg-white/50 p-2.5 text-slate-700 shadow-sm md:hidden"
                onClick={() => setOpen((value) => !value)}
                aria-label="Toggle navigation"
              >
                {open ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {open && (
            <div className="mt-4 space-y-2 border-t border-slate-200/60 pt-4 md:hidden">
              {links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) => 
                    `flex items-center gap-3 rounded-2xl px-5 py-3 text-sm font-bold transition-all ${
                      isActive ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50"
                    }`
                  }
                  onClick={() => setOpen(false)}
                >
                  <link.icon size={18} />
                  {link.label}
                </NavLink>
              ))}
              <div className="pt-2 border-t border-slate-100">
                <button
                  onClick={() => { setOpen(false); navigate('/dashboard'); }}
                  className="flex w-full items-center gap-3 rounded-2xl px-5 py-3 text-sm font-bold text-slate-700 transition-all hover:bg-slate-50"
                >
                  <LayoutDashboard size={18} className="text-blue-600" />
                  Main Dashboard
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}