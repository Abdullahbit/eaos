"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ProgramResult } from "./AssessmentWizard";
import { trackEvent } from "../utils/analytics";

interface ResultsDisplayProps {
  leadId: string;
  results: ProgramResult[];
  onRestart: () => void;
}

export default function ResultsDisplay({ leadId, results, onRestart }: ResultsDisplayProps) {
  const [fullName, setFullName] = useState<string>("Student");

  useEffect(() => {
    trackEvent("results_viewed");
    if (typeof window !== "undefined") {
      const savedName = sessionStorage.getItem("ci_full_name") || localStorage.getItem("ci_full_name");
      if (savedName) setFullName(savedName);
    }
  }, []);

  const getWhatsAppLink = (progName?: string, uniName?: string) => {
    const phone = "905000000000";
    let message = "";
    
    if (progName && uniName) {
      message = `Hi Abdullah! My name is ${fullName}. I did the assessment on Campus Insider and got matched with ${progName} at ${uniName}. I'd love to ask a few questions about life on campus and visa options.`;
    } else {
      message = `Hi Abdullah! My name is ${fullName}. I just completed the assessment on Campus Insider (Reference: ${leadId}) but couldn't find an exact match within my budget. Let's look for other options!`;
    }
    
    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  };

  const handleWhatsappClick = () => {
    trackEvent("whatsapp_clicked");
  };

  return (
    <div className="animate-fade-in" style={styles.container}>
      {/* Title Header */}
      <div style={styles.header}>
        <div className="typewriter-coords">WAYPOINT 08 // RECOMMENDATIONS</div>
        <h2 style={styles.title}>Your Study Blueprints</h2>
        <p style={styles.subtitle}>
          Based on your criteria, I have identified the following matching programs. 
          Your reference code is <span style={styles.refId}>{leadId}</span>.
        </p>
      </div>

      {/* Program Results Grid */}
      {results.length > 0 ? (
        <div style={styles.resultsGrid}>
          {results.map((prog, idx) => {
            // Calculate mock installment (usually tuition + ~10% for installment processing)
            const cash = prog.cash_fee !== undefined ? Number(prog.cash_fee) : 0;
            const installment = prog.discounted_fee !== undefined ? Number(prog.discounted_fee) : Math.round(cash * 1.1);
            const prepFee = Math.round(cash * 0.95); // Prep fee estimate

            return (
              <div key={idx} className="glass-card" style={styles.card}>
                <div style={styles.cardHeader}>
                  <div>
                    <h3 style={styles.programName}>{prog.program_name}</h3>
                    <span style={styles.uniSubtitle}>{prog.university_name} • {prog.city || "Turkey"}</span>
                  </div>
                  <span style={styles.degreeTag}>{prog.degree}</span>
                </div>

                {/* Why This Matches Section (Teal frame) */}
                <div style={styles.matchFrame}>
                  <div style={styles.matchTitle}>Why This Matches:</div>
                  <ul style={styles.matchList}>
                    <li style={styles.matchItem}>✓ Taught fully in {prog.language} as preferred</li>
                    <li style={styles.matchItem}>✓ Annual cash tuition is within your maximum limit</li>
                    <li style={styles.matchItem}>✓ Academic criteria matches your requested level</li>
                  </ul>
                </div>

                {/* Tuition Cost Breakdown Table */}
                <div style={styles.costTableContainer}>
                  <div style={styles.costTableTitle}>Tuition Cost Breakdown</div>
                  <table style={styles.costTable}>
                    <thead>
                      <tr>
                        <th style={styles.tableTh}>Payment Method</th>
                        <th style={{ ...styles.tableTh, textAlign: "right" }}>Annual Fee</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style={styles.tableTd}>Cash Price (Upfront)</td>
                        <td style={{ ...styles.tableTd, textAlign: "right", fontWeight: 700 }}>
                          {cash > 0 ? `$${cash.toLocaleString()}` : "TBD"}
                        </td>
                      </tr>
                      <tr>
                        <td style={styles.tableTd}>Installments Price</td>
                        <td style={{ ...styles.tableTd, textAlign: "right" }}>
                          {installment > 0 ? `$${installment.toLocaleString()}` : "TBD"}
                        </td>
                      </tr>
                      <tr>
                        <td style={styles.tableTd}>Prep School Fee</td>
                        <td style={{ ...styles.tableTd, textAlign: "right", color: "var(--text-secondary)" }}>
                          {prepFee > 0 ? `$${prepFee.toLocaleString()}` : "TBD"}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Card-Level WhatsApp Call to Action */}
                <div style={{ marginTop: "12px" }}>
                  <a
                    href={getWhatsAppLink(prog.program_name, prog.university_name)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary"
                    style={styles.cardCta}
                    onClick={handleWhatsappClick}
                  >
                    💬 Ask Abdullah on WhatsApp
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Zero Match Fallback Box */
        <div className="glass-card" style={styles.noMatchCard}>
          <div style={styles.noMatchIcon}>🧭</div>
          <h3 style={{ marginBottom: "12px" }}>No Exact Matches Found</h3>
          <p style={styles.noMatchText}>
            I couldn’t find a program matching your exact combination. Turkey's tuition fees change frequently. 
            Let me know what you are looking for on WhatsApp, and I will manually check my database for you.
          </p>
          <div style={{ marginTop: "24px" }}>
            <a
              href={getWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
              style={styles.noMatchWhatsappBtn}
              onClick={handleWhatsappClick}
            >
              💬 Check Manual Options with Abdullah
            </a>
          </div>
        </div>
      )}

      {/* Quiet preliminary-results disclaimer */}
      <div style={styles.disclaimerBox}>
        <span style={styles.disclaimerText}>
          * Results are preliminary. Final tuition, availability and admission decisions are confirmed before application.
        </span>
      </div>

      <div style={{ textAlign: "center", marginTop: "12px" }}>
        <button style={styles.restartBtn} onClick={onRestart}>
          Start New Search
        </button>
      </div>

      {/* Privacy Note */}
      <p style={styles.privacyNote}>
        * Privacy & Consent: Your contact details are stored securely for direct communication about this assessment. 
        Read our <Link href="/privacy" style={styles.privacyLink}>Privacy Policy</Link> for full details.
      </p>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: "36px",
    padding: "24px 0",
  },
  header: {
    textAlign: "center",
    maxWidth: "600px",
    margin: "0 auto 20px auto",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "12px",
  },
  title: {
    fontSize: "2.4rem",
    fontWeight: "800",
    fontFamily: "Outfit, sans-serif",
  },
  subtitle: {
    fontSize: "1rem",
    color: "var(--text-secondary)",
    lineHeight: "1.5",
  },
  refId: {
    color: "var(--primary)",
    fontWeight: "700",
    fontFamily: "monospace",
    fontSize: "1.05rem",
  },
  resultsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "28px",
  },
  card: {
    padding: "32px",
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "12px",
  },
  programName: {
    fontSize: "1.25rem",
    fontWeight: "700",
    color: "var(--text-charcoal)",
  },
  uniSubtitle: {
    fontSize: "0.85rem",
    color: "var(--text-secondary)",
    display: "block",
    marginTop: "4px",
  },
  degreeTag: {
    backgroundColor: "rgba(0, 0, 0, 0.04)",
    border: "1px solid var(--border)",
    color: "var(--text-secondary)",
    fontSize: "0.75rem",
    padding: "4px 8px",
    borderRadius: "6px",
    fontWeight: "600",
  },
  matchFrame: {
    backgroundColor: "rgba(187, 85, 38, 0.04)",
    border: "1px solid var(--border)",
    borderRadius: "12px",
    padding: "16px 20px",
  },
  matchTitle: {
    fontSize: "0.85rem",
    fontWeight: "700",
    color: "var(--accent-teal)",
    marginBottom: "8px",
  },
  matchList: {
    listStyleType: "none",
    padding: "0",
    margin: "0",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  matchItem: {
    fontSize: "0.85rem",
    color: "var(--text-secondary)",
    fontWeight: "500",
  },
  costTableContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  costTableTitle: {
    fontSize: "0.85rem",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    color: "var(--text-muted)",
  },
  costTable: {
    width: "100%",
    borderCollapse: "collapse",
  },
  tableTh: {
    borderBottom: "1px solid var(--border)",
    padding: "8px 0",
    fontSize: "0.8rem",
    color: "var(--text-muted)",
    textAlign: "left",
  },
  tableTd: {
    borderBottom: "1px solid var(--border)",
    padding: "10px 0",
    fontSize: "0.9rem",
    color: "var(--text-charcoal)",
  },
  cardCta: {
    width: "100%",
    padding: "12px",
    fontSize: "0.95rem",
    border: "1px solid var(--accent-teal)",
    backgroundColor: "rgba(16, 185, 129, 0.04)",
    color: "var(--accent-teal)",
  },
  noMatchCard: {
    padding: "48px 32px",
    textAlign: "center",
    maxWidth: "580px",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "16px",
  },
  noMatchIcon: {
    fontSize: "3rem",
    color: "var(--accent-gold)",
  },
  noMatchText: {
    fontSize: "1rem",
    lineHeight: "1.6",
    color: "var(--text-secondary)",
  },
  noMatchWhatsappBtn: {
    padding: "16px 32px",
    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    color: "#fff",
    boxShadow: "0 6px 20px rgba(16, 185, 129, 0.15)",
  },
  disclaimerBox: {
    padding: "0",
    backgroundColor: "transparent",
    border: "none",
    maxWidth: "700px",
    margin: "0 auto",
    textAlign: "center",
  },
  disclaimerText: {
    fontSize: "0.8rem",
    color: "var(--text-secondary)",
    lineHeight: "1.4",
  },
  restartBtn: {
    background: "transparent",
    border: "none",
    color: "var(--text-muted)",
    fontSize: "0.9rem",
    textDecoration: "underline",
    cursor: "pointer",
    transition: "color 0.2s ease",
  },
  privacyNote: {
    fontSize: "0.78rem",
    color: "var(--text-muted)",
    textAlign: "center",
    maxWidth: "600px",
    margin: "0 auto",
    lineHeight: "1.4",
  },
  privacyLink: {
    color: "var(--primary)",
    textDecoration: "underline",
  },
};
