"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

interface AdminLead {
  id: string;
  full_name: string;
  whatsapp_number: string;
  email?: string;
  country: string;
  study_level: string;
  intended_major: string;
  preferred_language: string;
  max_budget: number;
  utm_source?: string;
  status: string;
  created_at: string;
}

export default function AdminLeads() {
  const [token, setToken] = useState<string>("");
  const [authorized, setAuthorized] = useState<boolean>(false);
  const [leads, setLeads] = useState<AdminLead[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const savedToken = localStorage.getItem("ci_admin_token");
    if (savedToken) {
      setToken(savedToken);
      fetchLeads(savedToken);
    }
  }, []);

  const fetchLeads = async (authToken: string) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const response = await fetch("http://localhost:8000/api/admin/leads", {
        headers: {
          "X-Admin-Token": authToken,
        },
      });
      if (response.status === 401) {
        setErrorMsg("Unauthorized: Invalid admin token.");
        setAuthorized(false);
        localStorage.removeItem("ci_admin_token");
      } else if (!response.ok) {
        throw new Error("Failed to fetch leads");
      } else {
        const data = await response.json();
        setLeads(data);
        setAuthorized(true);
        localStorage.setItem("ci_admin_token", authToken);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Network error. Make sure FastAPI backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (token.trim()) {
      fetchLeads(token.trim());
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("ci_admin_token");
    setToken("");
    setAuthorized(false);
    setLeads([]);
  };

  if (!authorized) {
    return (
      <main style={styles.main}>
        <div className="container" style={styles.loginContainer}>
          <div className="glass-card animate-fade-in" style={styles.loginCard}>
            <h1 style={styles.loginTitle}>Admin Portal</h1>
            <p style={styles.loginSubtitle}>Provide your admin token to view recent lead entries.</p>
            {errorMsg && <div style={styles.errorBanner}>{errorMsg}</div>}
            <form onSubmit={handleLoginSubmit} style={styles.loginForm}>
              <div style={styles.formGroup}>
                <label className="form-label" htmlFor="adminToken">Admin Token</label>
                <input
                  id="adminToken"
                  type="password"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="Enter X-Admin-Token"
                  className="form-input"
                  required
                />
              </div>
              <button className="btn btn-primary" type="submit" disabled={loading}>
                {loading ? "Authenticating..." : "Unlock Dashboard"}
              </button>
            </form>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main style={styles.main}>
      <header style={styles.header}>
        <div className="container" style={styles.headerInner}>
          <div style={styles.logo}>
            Campus <span style={styles.logoAccent}>Insider</span> <span style={styles.logoAdmin}>Admin</span>
          </div>
          <button className="btn btn-secondary" onClick={handleLogout} style={styles.logoutBtn}>
            Lock Dashboard
          </button>
        </div>
      </header>

      <div className="container" style={styles.adminContainer}>
        <div style={styles.dashboardHeader}>
          <h2>Lead Submissions ({leads.length})</h2>
          <button className="btn btn-secondary" onClick={() => fetchLeads(token)}>
            Refresh Data
          </button>
        </div>

        {errorMsg && <div style={styles.errorBanner}>{errorMsg}</div>}

        <div className="glass-card" style={styles.tableWrapper}>
          {loading ? (
            <div style={styles.tableLoader}>Loading lead entries...</div>
          ) : leads.length > 0 ? (
            <table style={styles.table}>
              <thead>
                <tr style={styles.thRow}>
                  <th>Submitted</th>
                  <th>Name</th>
                  <th>WhatsApp</th>
                  <th>Level / Major</th>
                  <th>Budget</th>
                  <th>Source</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr key={lead.id} style={styles.tr}>
                    <td style={styles.tdDate}>
                      {new Date(lead.created_at).toLocaleString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td style={styles.tdName}>{lead.full_name}</td>
                    <td>
                      <a
                        href={`https://wa.me/${lead.whatsapp_number.replace("+", "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={styles.phoneLink}
                      >
                        {lead.whatsapp_number} 📞
                      </a>
                    </td>
                    <td>
                      <div style={styles.levelMajor}>
                        <span style={styles.levelBadge}>{lead.study_level}</span>
                        <span>{lead.intended_major}</span>
                      </div>
                    </td>
                    <td style={styles.tdBudget}>${Number(lead.max_budget).toLocaleString()}</td>
                    <td style={styles.tdSource}>{lead.utm_source || "direct"}</td>
                    <td>
                      <span style={{ 
                        ...styles.statusBadge, 
                        backgroundColor: lead.status === "new" ? "rgba(16, 185, 129, 0.15)" : "rgba(255, 255, 255, 0.05)",
                        color: lead.status === "new" ? "var(--success)" : "var(--text-secondary)"
                      }}>
                        {lead.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div style={styles.emptyState}>No leads submitted yet.</div>
          )}
        </div>
      </div>
    </main>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  main: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
  },
  loginContainer: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px 0",
  },
  loginCard: {
    width: "100%",
    maxWidth: "460px",
    padding: "40px",
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },
  loginTitle: {
    fontSize: "1.8rem",
    fontWeight: "800",
    textAlign: "center",
  },
  loginSubtitle: {
    fontSize: "0.95rem",
    color: "var(--text-secondary)",
    textAlign: "center",
    marginBottom: "8px",
  },
  loginForm: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  errorBanner: {
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    border: "1px solid var(--error)",
    color: "#f87171",
    padding: "12px 16px",
    borderRadius: "var(--radius-sm)",
    fontSize: "0.88rem",
  },
  header: {
    borderBottom: "1px solid var(--border)",
    padding: "20px 0",
    backgroundColor: "rgba(10, 14, 26, 0.4)",
    backdropFilter: "blur(12px)",
  },
  headerInner: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: {
    fontFamily: "Outfit, sans-serif",
    fontSize: "1.4rem",
    fontWeight: "800",
    color: "var(--text-primary)",
  },
  logoAccent: {
    color: "var(--primary)",
  },
  logoAdmin: {
    fontSize: "0.85rem",
    color: "var(--accent)",
    border: "1px solid rgba(6, 182, 212, 0.3)",
    padding: "2px 8px",
    borderRadius: "6px",
    marginLeft: "8px",
    fontWeight: "600",
  },
  logoutBtn: {
    padding: "8px 18px",
    fontSize: "0.85rem",
  },
  adminContainer: {
    flex: 1,
    paddingTop: "40px",
    paddingBottom: "40px",
  },
  dashboardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
  },
  tableWrapper: {
    padding: "0",
    overflowX: "auto",
    borderRadius: "var(--radius-md)",
  },
  tableLoader: {
    padding: "48px",
    textAlign: "center",
    color: "var(--text-secondary)",
  },
  emptyState: {
    padding: "48px",
    textAlign: "center",
    color: "var(--text-muted)",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    textAlign: "left",
  },
  thRow: {
    borderBottom: "1px solid var(--border)",
    backgroundColor: "rgba(255, 255, 255, 0.02)",
  },
  tr: {
    borderBottom: "1px solid var(--border)",
    transition: "background-color 0.2s ease",
  },
  tdDate: {
    color: "var(--text-muted)",
    fontSize: "0.85rem",
  },
  tdName: {
    fontWeight: "600",
    color: "var(--text-primary)",
  },
  phoneLink: {
    color: "var(--accent)",
    textDecoration: "none",
    fontWeight: "500",
  },
  levelMajor: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  levelBadge: {
    alignSelf: "flex-start",
    fontSize: "0.72rem",
    fontWeight: "600",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    padding: "2px 6px",
    borderRadius: "4px",
    color: "var(--text-secondary)",
  },
  tdBudget: {
    fontWeight: "700",
    color: "var(--text-primary)",
  },
  tdSource: {
    color: "var(--text-muted)",
    fontSize: "0.85rem",
    fontFamily: "monospace",
  },
  statusBadge: {
    fontSize: "0.75rem",
    fontWeight: "600",
    textTransform: "uppercase",
    padding: "4px 8px",
    borderRadius: "6px",
  },
};

// Injected styles for table padding and alignments
if (typeof document !== "undefined") {
  const styleEl = document.createElement("style");
  styleEl.innerHTML = `
    table th, table td {
      padding: 16px 20px;
      font-size: 0.92rem;
    }
    table tbody tr:hover {
      background-color: rgba(255, 255, 255, 0.01);
    }
  `;
  document.head.appendChild(styleEl);
}
