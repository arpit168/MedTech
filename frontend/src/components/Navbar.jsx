import  { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, LogOut, User, Menu, X, FileText, Activity, FileSpreadsheet } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const navLinks = [
    { label: "Prescription", to: "/prescription", icon: FileText },
    { label: "Symptoms", to: "/symptom-tracker", icon: Activity },
    { label: "Reports", to: "/reports", icon: FileSpreadsheet },
  ];

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@400;500&family=DM+Sans:wght@300;400;500;600;700&display=swap');

    * { box-sizing: border-box; }

    .nb-wrap {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      background: rgba(9, 13, 20, 0.72);
      backdrop-filter: blur(18px);
      border-bottom: 1px solid rgba(255,255,255,.08);
      box-shadow: 0 10px 30px rgba(0,0,0,.2);
      font-family: 'DM Sans', sans-serif;
    }

    .nb-wrap::before {
      content: '';
      position: absolute;
      inset: 0;
      pointer-events: none;
      background: linear-gradient(135deg, rgba(37,99,235,.12), rgba(124,58,237,.10));
      opacity: .8;
    }

    .nb-inner {
      position: relative;
      max-width: 1280px;
      margin: 0 auto;
      padding: 14px 18px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
    }

    .nb-logo {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      color: #f8fafc;
      text-decoration: none;
      font-family: 'Syne', sans-serif;
      font-weight: 800;
      letter-spacing: .4px;
      font-size: 20px;
      white-space: nowrap;
    }

    .nb-logo-badge {
      width: 40px;
      height: 40px;
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, rgba(37,99,235,.22), rgba(124,58,237,.22));
      border: 1px solid rgba(255,255,255,.08);
      box-shadow: 0 10px 24px rgba(0,0,0,.18);
      flex-shrink: 0;
    }

    .nb-desktop {
      display: none;
      align-items: center;
      gap: 12px;
    }

    .nb-link {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 14px;
      border-radius: 12px;
      text-decoration: none;
      color: #cbd5e1;
      font-size: 14px;
      font-weight: 600;
      transition: all .2s ease;
      border: 1px solid transparent;
    }

    .nb-link:hover {
      color: #fff;
      background: rgba(255,255,255,.05);
      border-color: rgba(255,255,255,.08);
    }

    .nb-user {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 8px 12px;
      border-radius: 999px;
      background: rgba(255,255,255,.05);
      border: 1px solid rgba(255,255,255,.08);
      color: #e2e8f0;
    }

    .nb-user-name {
      font-size: 14px;
      font-weight: 600;
      white-space: nowrap;
    }

    .nb-logout {
      border: none;
      background: gray;
      border: 1px solid red;
      width: 36px;
      height: 36px;
      border-radius: 12px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all .2s ease;
      flex-shrink: 0;
    }

    .nb-logout:hover {
      background: rgba(239,68,68,.12);
      border-color: rgba(239,68,68,.25);
    }

    .nb-menu-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 42px;
      height: 42px;
      border-radius: 14px;
      border: 1px solid rgba(255,255,255,.08);
      background: rgba(255,255,255,.05);
      color: #e2e8f0;
      cursor: pointer;
    }

    .nb-mobile {
      position: relative;
      z-index: 1;
      display: block;
      border-top: 1px solid rgba(255,255,255,.08);
      background: rgba(9,13,20,.92);
      backdrop-filter: blur(18px);
      padding: 12px 18px 18px;
    }

    .nb-mobile-panel {
      display: grid;
      gap: 10px;
    }

    .nb-mobile-link {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 14px;
      border-radius: 14px;
      text-decoration: none;
      color: #e2e8f0;
      background: rgba(255,255,255,.04);
      border: 1px solid rgba(255,255,255,.08);
      font-size: 14px;
      font-weight: 600;
    }

    .nb-mobile-user {
      margin-top: 10px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 14px;
      border-radius: 16px;
      background: rgba(255,255,255,.05);
      border: 1px solid rgba(255,255,255,.08);
      color: #e2e8f0;
    }

    @media (min-width: 768px) {
      .nb-desktop { display: flex; }
      .nb-menu-btn, .nb-mobile { display: none; }
      .nb-inner { padding: 14px 24px; }
    }
  `;

  return (
    <>
      <style>{css}</style>
      <nav className="nb-wrap">
        <div className="nb-inner">
          <Link to="/" className="nb-logo">
            <div className="nb-logo-badge">
              <Heart size={20} className="text-cyan-300" />
            </div>
            <span>MedTech</span>
          </Link>

          {token && (
            <>
              <div className="nb-desktop">
                {navLinks.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link key={item.to} to={item.to} className="nb-link">
                      <Icon size={16} />
                      {item.label}
                    </Link>
                  );
                })}

                <div className="nb-user">
                  <User size={18} className="text-cyan-300" />
                  <span className="nb-user-name">{user.name || "User"}</span>
                  <button onClick={handleLogout} className="nb-logout" aria-label="Logout">
                    <LogOut size={16} className="text-rose-300" />
                  </button>
                </div>
              </div>

              <button
                className="nb-menu-btn md:hidden"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Menu"
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </>
          )}
        </div>

        {token && mobileOpen && (
          <div className="nb-mobile md:hidden">
            <div className="nb-mobile-panel">
              {navLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="nb-mobile-link"
                    onClick={() => setMobileOpen(false)}
                  >
                    <Icon size={16} className="text-cyan-300" />
                    {item.label}
                  </Link>
                );
              })}

              <div className="nb-mobile-user">
                <div className="flex items-center gap-2">
                  <User size={18} className="text-cyan-300" />
                  <span>{user.name || "User"}</span>
                </div>
                <button onClick={handleLogout} className="nb-logout" aria-label="Logout">
                  <LogOut size={16} className="text-rose-300" />
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;