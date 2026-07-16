"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { ProgramResult } from "./AssessmentWizard";
import { generateWhatsAppLink } from "../utils/whatsapp";
import { trackEvent } from "../utils/analytics";

interface ResultsDisplayProps {
  leadId: string;
  results: ProgramResult[];
  onRestart: () => void;
}

export default function ResultsDisplay({ leadId, results, onRestart }: ResultsDisplayProps) {
  const whatsappUrl = generateWhatsAppLink(leadId);

  useEffect(() => {
    trackEvent("results_viewed");
  }, []);

  const handleWhatsappClick = () => {
    trackEvent("whatsapp_clicked");
  };

  return (
    <div className="animate-fade-in" style={styles.container}>
      {/* Title Header */}
      <div style={styles.header}>
        <span style={styles.badge}>Assessment Complete</span>
        <h2 style={styles.title}>Your Best Matching Options</h2>
        <p style={styles.subtitle}>
          Based on your criteria, I have identified the following matching programs.
          Your Reference ID is <strong style={styles.refId}>{leadId}</strong>.
        </p>
      </div>

      {/* Program Results Grid */}
      {results.length > 0 ? (
        <div style={styles.resultsGrid}>
          {results.map((prog, idx) => (
            <div key={idx} className="glass-card" style={styles.card}>
              <div style={styles.cardHeader}>
                <h3 style={styles.programName}>{prog.program_name}</h3>
                <span style={styles.degreeTag}>{prog.degree}</span>
              </div>

              <div style={styles.detailsList}>
                <div style={styles.detailRow}>
                  <span style={styles.detailLabel}>University:</span>
                  <span style={styles.detailValue}>{prog.university_name}</span>
                </div>
                <div style={styles.detailRow}>
                  <span style={styles.detailLabel}>City & Location:</span>
                  <span style={styles.detailValue}>{prog.city || "Turkey"}</span>
                </div>
                <div style={styles.detailRow}>
                  <span style={styles.detailLabel}>Language:</span>
                  <span style={styles.detailValue}>{prog.language}</span>
                </div>
                {prog.semester && (
                  <div style={styles.detailRow}>
                    <span style={styles.detailLabel}>Semester/Status:</span>
                    <span style={{ 
                      ...styles.detailValue, 
                      color: prog.status === "Available" ? "var(--success)" : "var(--warning)"
                    }}>
                      {prog.semester} ({prog.status || "Unknown"})
                    </span>
                  </div>
                )}
              </div>

              <div style={styles.feeDivider} />

              <div style={styles.feesSection}>
                <div style={styles.feeBlock}>
                  <span style={styles.feeLabel}>Cash Tuition</span>
                  <span style={styles.feeAmount}>
                    {prog.cash_fee !== undefined ? `$${Number(prog.cash_fee).toLocaleString()}` : "Contact us"}
                  </span>
                </div>
                <div style={styles.feeBlock}>
                  <span style={styles.feeLabel}>Discounted Tuition</span>
                  <span style={{ ...styles.feeAmount, color: "var(--accent)" }}>
                    {prog.discounted_fee !== undefined ? `$${Number(prog.discounted_fee).toLocaleString()}` : "Contact us"}
                  </span>
                </div>
                <div style={styles.feeBlock}>
                  <span style={styles.feeLabel}>Deposit Fee</span>
                  <span style={styles.feeAmountSecondary}>
                    {prog.deposit_fee !== undefined ? `$${Number(prog.deposit_fee).toLocaleString()}` : "TBD"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-card" style={styles.noMatchCard}>
          <div style={styles.noMatchIcon}>🔍</div>
          <h3>No Exact Matches Found</h3>
          <p style={styles.noMatchText}>
            I couldn't find programs matching your exact tuition budget or language requirements. 
            However, there are other scholarship programs and private options available that might work!
          </p>
          <div style={styles.noMatchCtaContainer}>
            <p style={styles.noMatchActionHeader}>Next Recommended Step:</p>
            <p style={styles.noMatchActionText}>
              Send a request to Abdullah to check if there are newly added programs, local discount campaigns, or partial scholarship quotas that fit your profile.
            </p>
          </div>
        </div>
      )}

      {/* Warning/Disclaimer Box */}
      <div style={styles.disclaimerBox}>
        <h4 style={styles.disclaimerTitle}>⚠️ Important Information About These Matches</h4>
        <p style={styles.disclaimerText}>
          These results are **preliminary and dependent on current availability, documents, and final university approval**. 
          We do not claim official accreditation, recognition, scholarships, or immediate admission eligibility unless it has been verified with documents.
        </p>
      </div>

      {/* Main WhatsApp CTA */}
      <div style={styles.ctaSection}>
        <a 
          href={whatsappUrl} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="btn btn-primary" 
          style={styles.whatsappBtn}
          onClick={handleWhatsappClick}
          id="whatsappCTA"
        >
          <svg style={styles.whatsappIcon} viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.705 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          Review My Options with Abdullah
        </a>
        <button style={styles.restartBtn} onClick={onRestart}>
          Start New Search
        </button>
      </div>

      {/* Privacy Note */}
      <p style={styles.privacyNote}>
        **Privacy & Consent**: We respect your privacy. Your contact details are stored securely for direct communication 
        about this assessment and will not be shared with external third parties without your permission. See our <Link href="/privacy" style={styles.privacyLink}>Privacy Policy</Link> for details.
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
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "12px",
  },
  badge: {
    background: "var(--primary-glow)",
    border: "1px solid var(--primary)",
    color: "var(--primary)",
    padding: "6px 16px",
    borderRadius: "9999px",
    fontSize: "0.8rem",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  title: {
    fontSize: "2rem",
    fontWeight: "800",
  },
  subtitle: {
    fontSize: "1rem",
    color: "var(--text-secondary)",
  },
  refId: {
    color: "var(--accent)",
    fontWeight: "700",
    fontFamily: "monospace",
    fontSize: "1.1rem",
  },
  resultsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "24px",
  },
  card: {
    padding: "28px",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "12px",
  },
  programName: {
    fontSize: "1.2rem",
    fontWeight: "700",
  },
  degreeTag: {
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    border: "1px solid var(--border)",
    color: "var(--text-secondary)",
    fontSize: "0.75rem",
    padding: "4px 8px",
    borderRadius: "var(--radius-sm)",
    fontWeight: "600",
  },
  detailsList: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  detailRow: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "0.9rem",
  },
  detailLabel: {
    color: "var(--text-muted)",
  },
  detailValue: {
    color: "var(--text-primary)",
    fontWeight: "500",
  },
  feeDivider: {
    height: "1px",
    backgroundColor: "var(--border)",
  },
  feesSection: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "12px",
    textAlign: "center",
  },
  feeBlock: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  feeLabel: {
    fontSize: "0.72rem",
    color: "var(--text-muted)",
    textTransform: "uppercase",
    letterSpacing: "0.02em",
  },
  feeAmount: {
    fontSize: "1.1rem",
    fontWeight: "700",
    color: "var(--text-primary)",
  },
  feeAmountSecondary: {
    fontSize: "1rem",
    fontWeight: "600",
    color: "var(--text-secondary)",
  },
  noMatchCard: {
    padding: "40px",
    textAlign: "center",
    maxWidth: "560px",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "16px",
  },
  noMatchIcon: {
    fontSize: "3rem",
    marginBottom: "8px",
  },
  noMatchText: {
    fontSize: "0.95rem",
    lineHeight: "1.6",
    color: "var(--text-secondary)",
  },
  noMatchCtaContainer: {
    marginTop: "16px",
    padding: "16px",
    backgroundColor: "rgba(255, 255, 255, 0.02)",
    border: "1px dashed var(--border)",
    borderRadius: "var(--radius-sm)",
    textAlign: "left",
  },
  noMatchActionHeader: {
    fontWeight: "700",
    fontSize: "0.9rem",
    color: "var(--accent)",
    marginBottom: "4px",
  },
  noMatchActionText: {
    fontSize: "0.85rem",
    color: "var(--text-secondary)",
    lineHeight: "1.4",
  },
  disclaimerBox: {
    backgroundColor: "rgba(245, 158, 11, 0.03)",
    border: "1px solid rgba(245, 158, 11, 0.2)",
    borderRadius: "var(--radius-sm)",
    padding: "18px 24px",
    maxWidth: "800px",
    margin: "0 auto",
  },
  disclaimerTitle: {
    color: "var(--warning)",
    fontSize: "0.95rem",
    marginBottom: "6px",
  },
  disclaimerText: {
    fontSize: "0.85rem",
    color: "var(--text-secondary)",
    lineHeight: "1.4",
  },
  ctaSection: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "16px",
    marginTop: "12px",
  },
  whatsappBtn: {
    padding: "16px 36px",
    fontSize: "1.1rem",
    boxShadow: "0 4px 20px rgba(16, 185, 129, 0.3)",
    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
  },
  whatsappIcon: {
    width: "22px",
    height: "22px",
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
