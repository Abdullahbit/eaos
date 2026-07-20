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

  const getWhatsAppLink = (progNameName?: string, uniName?: string, rankLabel?: string) => {
    const phone = "905000000000";
    let message = "";
    
    if (progNameName && uniName && rankLabel) {
      message = `Hi Abdullah! My name is ${fullName}. I completed the assessment and got matched with ${progNameName} at ${uniName} as my "${rankLabel}". Let's discuss visa application and campus life!`;
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
        <div style={styles.coordinateLabel}>WAYPOINT 08 // RECOMMENDATIONS</div>
        <h2 style={styles.title}>Your Study Blueprints</h2>
        <p style={styles.subtitle}>
          Based on your criteria, I have identified the following matching programs in Istanbul. 
          Your reference code is <span style={styles.refId}>{leadId}</span>.
        </p>
      </div>

      {/* Program Results Ranked List */}
      {results.length > 0 ? (
        <div style={styles.resultsList}>
          {results.map((prog, idx) => {
            const cash = prog.cash_fee !== undefined ? Number(prog.cash_fee) : 0;
            const installment = prog.discounted_fee !== undefined ? Number(prog.discounted_fee) : Math.round(cash * 1.1);
            const prepFee = Math.round(cash * 0.95);

            // Set up Ranked Labels
            let rankLabel = "Strong Alternative";
            let isDominant = false;
            let cardStyle = styles.cardAlternative;

            if (idx === 0) {
              rankLabel = "Best Overall Match";
              isDominant = true;
              cardStyle = styles.cardDominant;
            } else if (idx === 1) {
              rankLabel = "Best Budget Option";
              cardStyle = styles.cardBudget;
            }

            return (
              <div key={idx} style={cardStyle}>
                <div style={styles.cardHeader}>
                  <div>
                    <span style={isDominant ? styles.badgeDominant : styles.badgeNormal}>
                      {rankLabel.toUpperCase()}
                    </span>
                    <h3 style={isDominant ? styles.programNameDominant : styles.programName}>
                      {prog.program_name}
                    </h3>
                    <span style={styles.uniSubtitle}>
                      {prog.university_name} • {prog.city || "Istanbul, Turkey"}
                    </span>
                  </div>
                  <span style={styles.degreeTag}>{prog.degree}</span>
                </div>

                {/* Why This Matches Section */}
                <div style={styles.matchFrame}>
                  <div style={styles.matchTitle}>Why This Matches:</div>
                  <ul style={styles.matchList}>
                    <li style={styles.matchItem}>✓ Taught fully in {prog.language}</li>
                    <li style={styles.matchItem}>✓ Annual tuition is within your maximum limit</li>
                    <li style={styles.matchItem}>✓ Standard academic criteria met</li>
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
                    href={getWhatsAppLink(prog.program_name, prog.university_name, rankLabel)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary"
                    style={isDominant ? styles.cardCtaDominant : styles.cardCta}
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
        <div style={styles.noMatchCard}>
          <div style={styles.noMatchIcon}>🧭</div>
          <h3 style={{ marginBottom: "12px", fontFamily: "'Sora', sans-serif" }}>No Exact Matches Found</h3>
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
    textAlign: "left",
    maxWidth: "800px",
    margin: "0 auto 20px 0",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  coordinateLabel: {
    fontFamily: "monospace",
    fontSize: "0.75rem",
    color: "var(--muted-slate)",
    letterSpacing: "0.08em",
  },
  title: {
    fontSize: "3rem",
    fontWeight: "800",
    fontFamily: "Sora, sans-serif",
  },
  subtitle: {
    fontSize: "1.1rem",
    color: "var(--text-secondary)",
    lineHeight: "1.6",
  },
  refId: {
    color: "var(--primary)",
    fontWeight: "700",
    fontFamily: "monospace",
    fontSize: "1.05rem",
  },
  resultsList: {
    display: "flex",
    flexDirection: "column",
    gap: "32px",
    maxWidth: "800px",
  },
  cardDominant: {
    padding: "36px",
    backgroundColor: "var(--warm-sand)", /* Dominant highlight color */
    border: "2.5px solid var(--cobalt-blue)", /* Primary dominant border */
    borderRadius: "4px",
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },
  cardBudget: {
    padding: "32px",
    backgroundColor: "var(--soft-white)",
    border: "1.5px solid var(--muted-slate)", /* Budget option border */
    borderRadius: "4px",
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },
  cardAlternative: {
    padding: "32px",
    backgroundColor: "var(--soft-white)",
    border: "1.5px solid var(--border)",
    borderRadius: "4px",
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
  programNameDominant: {
    fontSize: "1.8rem",
    fontWeight: "800",
    color: "var(--ink-navy)",
    fontFamily: "Sora, sans-serif",
    marginTop: "8px",
  },
  programName: {
    fontSize: "1.4rem",
    fontWeight: "700",
    color: "var(--ink-navy)",
    fontFamily: "Sora, sans-serif",
    marginTop: "8px",
  },
  uniSubtitle: {
    fontSize: "0.9rem",
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
    borderRadius: "2px",
    fontWeight: "600",
  },
  badgeDominant: {
    backgroundColor: "var(--cobalt-blue)",
    color: "#fff",
    fontSize: "0.7rem",
    fontWeight: "700",
    padding: "4px 8px",
    borderRadius: "2px",
    letterSpacing: "0.08em",
  },
  badgeNormal: {
    backgroundColor: "var(--ink-navy)",
    color: "#fff",
    fontSize: "0.7rem",
    fontWeight: "700",
    padding: "4px 8px",
    borderRadius: "2px",
    letterSpacing: "0.08em",
  },
  matchFrame: {
    backgroundColor: "rgba(217, 108, 74, 0.04)",
    border: "1.5px solid var(--border)",
    borderRadius: "4px",
    padding: "16px 20px",
  },
  matchTitle: {
    fontSize: "0.85rem",
    fontWeight: "700",
    color: "var(--ink-navy)",
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
    color: "var(--muted-slate)",
  },
  costTable: {
    width: "100%",
    borderCollapse: "collapse",
  },
  tableTh: {
    borderBottom: "2px solid var(--ink-navy)",
    padding: "8px 0",
    fontSize: "0.8rem",
    color: "var(--muted-slate)",
    textAlign: "left",
  },
  tableTd: {
    borderBottom: "1px solid var(--border)",
    padding: "12px 0",
    fontSize: "0.95rem",
    color: "var(--ink-navy)",
  },
  cardCtaDominant: {
    width: "100%",
    padding: "16px",
    fontSize: "1rem",
    backgroundColor: "var(--ink-navy)",
    color: "var(--soft-white)",
    border: "none",
    borderRadius: "4px",
  },
  cardCta: {
    width: "100%",
    padding: "14px",
    fontSize: "0.95rem",
    border: "1.5px solid var(--ink-navy)",
    backgroundColor: "transparent",
    color: "var(--ink-navy)",
    borderRadius: "4px",
  },
  noMatchCard: {
    padding: "48px 32px",
    textAlign: "center",
    maxWidth: "580px",
    backgroundColor: "var(--soft-white)",
    border: "1.5px solid var(--border)",
    borderRadius: "4px",
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
    backgroundColor: "var(--sea-green)",
    color: "#fff",
    borderRadius: "4px",
    boxShadow: "none",
  },
  disclaimerBox: {
    padding: "0",
    backgroundColor: "transparent",
    border: "none",
    maxWidth: "800px",
    textAlign: "left",
  },
  disclaimerText: {
    fontSize: "0.8rem",
    color: "var(--muted-slate)",
    lineHeight: "1.4",
  },
  restartBtn: {
    background: "transparent",
    border: "none",
    color: "var(--muted-slate)",
    fontSize: "0.9rem",
    textDecoration: "underline",
    cursor: "pointer",
    transition: "color 0.2s ease",
  },
  privacyNote: {
    fontSize: "0.78rem",
    color: "var(--muted-slate)",
    textAlign: "left",
    maxWidth: "800px",
    lineHeight: "1.4",
  },
  privacyLink: {
    color: "var(--primary)",
    textDecoration: "underline",
  },
};
