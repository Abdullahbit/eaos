"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import AssessmentWizard, { ProgramResult } from "./components/AssessmentWizard";
import ResultsDisplay from "./components/ResultsDisplay";
import { trackEvent } from "./utils/analytics";

interface SyncStatus {
  is_syncing: boolean;
  latest_sync_time: string | null;
}

export default function Home() {
  const [showWizard, setShowWizard] = useState<boolean>(false);
  const [resultsData, setResultsData] = useState<{ leadId: string; results: ProgramResult[] } | null>(null);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({ is_syncing: false, latest_sync_time: null });
  const [showHowItWorks, setShowHowItWorks] = useState<boolean>(false);

  // Track landing page view event on initial mount
  useEffect(() => {
    trackEvent("landing_view");
    
    // Fetch latest sync status from API
    fetch("http://localhost:8000/api/sync/status")
      .then((res) => res.json())
      .then((data: SyncStatus) => {
        setSyncStatus(data);
      })
      .catch((err) => {
        console.error("Failed to fetch sync status:", err);
      });
  }, []);

  const handleAssessmentComplete = (leadId: string, results: ProgramResult[]) => {
    setResultsData({ leadId, results });
    setShowWizard(false);
  };

  const handleStartWizard = () => {
    setShowWizard(true);
  };

  const handleRestart = () => {
    setResultsData(null);
    setShowWizard(true);
  };

  const formatSyncTime = (isoString: string | null) => {
    if (!isoString) return "recently";
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "recently";
    }
  };

  return (
    <main style={styles.main}>
      {/* Navbar / Header */}
      <header style={styles.header}>
        <div className="container" style={styles.headerInner}>
          <div style={styles.logo}>
            🎓 Campus <span style={styles.logoAccent}>Insider</span>
          </div>
          <div style={styles.navRight}>
            {syncStatus.is_syncing ? (
              <span className="live-pulse-badge" style={{ backgroundColor: "rgba(16, 185, 129, 0.12)", color: "#10b981" }}>
                <span className="pulse-dot"></span>
                Syncing now
              </span>
            ) : (
              <span style={styles.syncStatusBadge}>
                ✓ Data updated: {formatSyncTime(syncStatus.latest_sync_time)}
              </span>
            )}
            <span style={styles.headerStatus}>Beta v0.2</span>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <div className="container" style={styles.container}>
        {!resultsData ? (
          <div style={styles.contentLayout} className="animate-fade-in">
            {/* 1. ABOVE THE FOLD: Student Problem & Call to Action (Hero Card) */}
            <section style={styles.heroSection} className="glass-card">
              <h1 className="gradient-text" style={styles.heroTitle}>
                Find Turkish university options that actually fit you.
              </h1>
              <p style={styles.heroSubtitle}>
                Compare current programs and tuition fees based on your budget, preferred language and study level.
              </p>

              <div style={styles.disclaimerBox}>
                ⚠️ <span style={styles.disclaimerText}>Results are preliminary. Final tuition, availability and admission decisions are confirmed before application.</span>
              </div>

              {/* Main CTAs */}
              <div style={styles.ctaRow}>
                <button
                  className="btn btn-primary"
                  style={styles.heroCtaPrimary}
                  onClick={handleStartWizard}
                  id="findOptionsBtn"
                >
                  Start My Free Assessment
                </button>
                <button
                  className="btn btn-secondary"
                  style={styles.heroCtaSecondary}
                  onClick={() => setShowHowItWorks(!showHowItWorks)}
                  id="howItWorksBtn"
                >
                  {showHowItWorks ? "Hide Info" : "How Recommendations Work"}
                </button>
              </div>

              {showHowItWorks && (
                <div style={styles.howItWorksCard} className="glass-card animate-fade-in">
                  <h4 style={{ marginBottom: "8px", color: "var(--accent-teal)" }}>How Recommendations Work:</h4>
                  <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>
                    We match your budget limits, language preferences, and academic goals against our verified program database. 
                    Recommended options are tailored for your profile without affiliate bias, and pricing is confirmed directly before application.
                  </p>
                </div>
              )}
            </section>

            {/* Two-Column Grid: Abdullah's Story & Supporting Proof */}
            <div className="hero-grid" style={{ marginTop: "24px" }}>
              {/* Left Column: Abdullah's Student Narrative (Story Letter Card) */}
              <section style={styles.storyCard} className="glass-card">
                <div style={styles.profileBadge}>
                  <div style={styles.avatar} className="animate-float">👨‍💻</div>
                  <div>
                    <h4 style={styles.profileName}>Abdullah</h4>
                    <p style={styles.profileTitle}>Senior Computer Engineering Student • Istanbul</p>
                  </div>
                </div>

                <div style={styles.letterContent}>
                  <p style={styles.letterParagraph}>
                    Hi 👋 I’m Abdullah.
                  </p>
                  
                  <p style={styles.letterParagraph}>
                    I’m currently finishing my degree in Istanbul. When I first moved to Turkey as an international student, I made expensive mistakes because of outdated info and affiliate agencies.
                  </p>

                  <blockquote style={styles.quoteBlock}>
                    “Let me help you avoid the mistakes I made.”
                  </blockquote>

                  <p style={styles.letterParagraph}>
                    I built **Campus Insider** to provide future international students with direct access to verified program and fee options. I'm here to give you clear information so you can decide if studying in Turkey is the right choice for you.
                  </p>
                </div>
              </section>

              {/* Right Column: Database Coverage & Supporting Proof (Stats Card) */}
              <section className="visual-showcase">
                <div style={styles.showcaseCard} className="glass-card">
                  <div style={styles.showcaseHeader}>
                    <h3 className="gradient-text">Verified Database Coverage</h3>
                    <p style={styles.showcaseSubtitle}>Regularly updated university details</p>
                  </div>
                  
                  {/* Generic badges list */}
                  <div style={styles.badgeList}>
                    <div style={styles.coverageBadge}>🏢 39 universities</div>
                    <div style={styles.coverageBadge}>📚 7,695 programs</div>
                    <div style={styles.coverageBadge}>🎓 Associate to PhD options</div>
                    <div style={styles.coverageBadge}>🗣️ English and Turkish programs</div>
                    <div style={styles.coverageBadge}>📍 Multiple Turkish cities</div>
                  </div>

                  <hr style={{ borderColor: "var(--border)", margin: "16px 0" }} />

                  {/* Supporting proof list */}
                  <div style={styles.proofItem}>
                    <span style={styles.proofTitle}>⭐ Free student assessment</span>
                    <p style={styles.proofText}>No application entry charges or consultation fees.</p>
                  </div>

                  <div style={styles.proofItem}>
                    <span style={styles.proofTitle}>🔍 Verified admissions data</span>
                    <p style={styles.proofText}>
                      Program and tuition information is regularly synchronized from our authorized admissions database. Availability and final pricing are confirmed before application.
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        ) : (
          /* Results View */
          <ResultsDisplay
            leadId={resultsData.leadId}
            results={resultsData.results}
            onRestart={handleRestart}
          />
        )}
      </div>

      {/* Assessment Modal Overlay */}
      {showWizard && (
        <AssessmentWizard
          onComplete={handleAssessmentComplete}
          onCancel={() => setShowWizard(false)}
        />
      )}

      {/* Footer */}
      <footer style={styles.footer}>
        <p>© {new Date().getFullYear()} Campus Insider. Built by a student, for students. <Link href="/privacy" style={styles.privacyLink}>Privacy Policy</Link></p>
      </footer>
    </main>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  main: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
  },
  header: {
    borderBottom: "1px solid var(--border)",
    padding: "16px 0",
    backgroundColor: "rgba(7, 10, 19, 0.6)",
    backdropFilter: "blur(20px)",
    position: "sticky",
    top: 0,
    zIndex: 10,
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
    letterSpacing: "-0.01em",
  },
  logoAccent: {
    color: "var(--accent-teal)",
  },
  navRight: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  headerStatus: {
    fontSize: "0.75rem",
    color: "var(--text-muted)",
    border: "1px solid var(--border)",
    padding: "4px 10px",
    borderRadius: "6px",
    fontWeight: "600",
  },
  syncStatusBadge: {
    fontSize: "0.75rem",
    color: "var(--text-secondary)",
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    border: "1px solid var(--border)",
    padding: "4px 10px",
    borderRadius: "20px",
    fontWeight: "600",
  },
  container: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: "24px",
    paddingBottom: "40px",
  },
  contentLayout: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },
  heroSection: {
    padding: "40px",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "20px",
  },
  heroTitle: {
    fontSize: "2.4rem",
    lineHeight: "1.2",
    fontWeight: "800",
    maxWidth: "800px",
  },
  heroSubtitle: {
    fontSize: "1.15rem",
    color: "var(--text-secondary)",
    maxWidth: "640px",
  },
  disclaimerBox: {
    backgroundColor: "rgba(245, 158, 11, 0.08)",
    border: "1px solid rgba(245, 158, 11, 0.2)",
    borderRadius: "8px",
    padding: "12px 18px",
    maxWidth: "700px",
    textAlign: "left",
  },
  disclaimerText: {
    fontSize: "0.85rem",
    color: "var(--accent)",
    fontWeight: "500",
  },
  ctaRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "16px",
    justifyContent: "center",
    width: "100%",
    marginTop: "8px",
  },
  heroCtaPrimary: {
    minWidth: "220px",
    padding: "16px 32px",
    fontSize: "1.05rem",
  },
  heroCtaSecondary: {
    minWidth: "220px",
    padding: "16px 32px",
    fontSize: "1.05rem",
  },
  howItWorksCard: {
    marginTop: "16px",
    padding: "20px",
    textAlign: "left",
    maxWidth: "600px",
  },
  storyCard: {
    padding: "36px",
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },
  profileBadge: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    borderBottom: "1px solid var(--border)",
    paddingBottom: "20px",
  },
  avatar: {
    fontSize: "1.8rem",
    backgroundColor: "var(--primary-glow)",
    width: "56px",
    height: "56px",
    borderRadius: "9999px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid rgba(139, 92, 246, 0.3)",
  },
  profileName: {
    fontSize: "1.15rem",
    fontWeight: "700",
  },
  profileTitle: {
    fontSize: "0.85rem",
    color: "var(--text-muted)",
    marginTop: "2px",
  },
  letterContent: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  letterParagraph: {
    fontSize: "1.02rem",
    color: "var(--text-secondary)",
    lineHeight: "1.6",
  },
  quoteBlock: {
    borderLeft: "4px solid var(--accent)",
    paddingLeft: "16px",
    margin: "8px 0",
    fontFamily: "Outfit, sans-serif",
    fontSize: "1.15rem",
    fontWeight: "600",
    fontStyle: "italic",
    color: "var(--text-primary)",
    lineHeight: "1.5",
  },
  showcaseCard: {
    padding: "28px",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  showcaseHeader: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  showcaseSubtitle: {
    fontSize: "0.85rem",
    color: "var(--text-muted)",
  },
  badgeList: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginTop: "8px",
  },
  coverageBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    border: "1px solid var(--border)",
    borderRadius: "8px",
    padding: "10px 14px",
    fontSize: "0.95rem",
    fontWeight: "500",
    color: "var(--text-secondary)",
  },
  proofItem: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    marginBottom: "12px",
  },
  proofTitle: {
    fontSize: "0.95rem",
    fontWeight: "700",
    color: "var(--accent-teal)",
  },
  proofText: {
    fontSize: "0.85rem",
    color: "var(--text-secondary)",
    lineHeight: "1.4",
  },
  footer: {
    padding: "24px",
    textAlign: "center",
    borderTop: "1px solid var(--border)",
    fontSize: "0.8rem",
    color: "var(--text-muted)",
  },
  privacyLink: {
    color: "var(--accent-teal)",
    textDecoration: "underline",
    marginLeft: "8px",
  },
};
