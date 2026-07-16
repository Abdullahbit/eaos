"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import AssessmentWizard, { ProgramResult } from "./components/AssessmentWizard";
import ResultsDisplay from "./components/ResultsDisplay";
import { trackEvent } from "./utils/analytics";

export default function Home() {
  const [showWizard, setShowWizard] = useState<boolean>(false);
  const [resultsData, setResultsData] = useState<{ leadId: string; results: ProgramResult[] } | null>(null);

  // Track landing page view event on initial mount
  useEffect(() => {
    trackEvent("landing_view");
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

  return (
    <main style={styles.main}>
      {/* Navbar / Header */}
      <header style={styles.header}>
        <div className="container" style={styles.headerInner}>
          <div style={styles.logo}>
            Campus <span style={styles.logoAccent}>Insider</span>
          </div>
          <span style={styles.headerStatus}>v0.1 MVP</span>
        </div>
      </header>

      {/* Main Body */}
      <div className="container" style={styles.container}>
        {!resultsData ? (
          /* Landing Page Hero View */
          <div style={styles.heroSection} className="animate-fade-in">
            <div style={styles.storyLetter} className="glass-card">
              <div style={styles.profileBadge}>
                <div style={styles.avatar}>🎓</div>
                <div>
                  <h4 style={styles.profileName}>Abdullah</h4>
                  <p style={styles.profileTitle}>Computer Engineering Student, Istanbul</p>
                </div>
              </div>

              <div style={styles.letterContent}>
                <p style={styles.letterParagraph}>Hi 👋 I’m Abdullah.</p>
                
                <p style={styles.letterParagraph}>
                  I’m a Computer Engineering student living and studying in Istanbul.
                </p>

                <p style={styles.letterParagraph}>
                  When I first started this journey, I had the same questions you’re probably asking now:
                </p>

                <ul style={styles.questionsList}>
                  <li>Which university is actually worth it?</li>
                  <li>How much will I really pay?</li>
                  <li>Is the degree recognized?</li>
                  <li>Can I afford the full journey, not just the first year?</li>
                  <li>Which scholarship offers are genuine?</li>
                  <li>What mistakes could cost me time or money?</li>
                </ul>

                <p style={styles.letterParagraph}>
                  I had to learn many of these answers the difficult way.
                </p>

                <p style={styles.letterParagraph}>
                  So I built <strong>Campus Insider</strong> — the tool I wish I had when I was making my own decisions.
                </p>

                <blockquote style={styles.quoteBlock}>
                  “Let me help you avoid the mistakes I made.”
                </blockquote>

                <p style={styles.letterParagraph}>
                  I’m not here to convince you to study in Turkey. I’m here to give you clear, current information so you can decide whether it’s the right choice for you.
                </p>

                <p style={styles.letterParagraph}>
                  And if it is, I’ll help you every step of the way.
                </p>
              </div>

              {/* CTAs */}
              <div style={styles.ctaContainer}>
                <button
                  className="btn btn-primary"
                  style={styles.ctaPrimary}
                  onClick={handleStartWizard}
                  id="findOptionsBtn"
                >
                  Find My Best Options
                </button>
                <button
                  className="btn btn-secondary"
                  style={styles.ctaSecondary}
                  onClick={handleStartWizard}
                  id="estimateCostsBtn"
                >
                  Estimate My Study Costs
                </button>
              </div>
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
    letterSpacing: "-0.01em",
  },
  logoAccent: {
    color: "var(--primary)",
  },
  headerStatus: {
    fontSize: "0.75rem",
    color: "var(--text-muted)",
    border: "1px solid var(--border)",
    padding: "4px 8px",
    borderRadius: "6px",
    fontWeight: "600",
  },
  container: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: "40px",
    paddingBottom: "40px",
  },
  heroSection: {
    width: "100%",
    maxWidth: "680px",
  },
  storyLetter: {
    padding: "40px",
    display: "flex",
    flexDirection: "column",
    gap: "32px",
  },
  profileBadge: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    borderBottom: "1px solid var(--border)",
    paddingBottom: "24px",
  },
  avatar: {
    fontSize: "2rem",
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
    fontSize: "1.1rem",
    fontWeight: "700",
  },
  profileTitle: {
    fontSize: "0.85rem",
    color: "var(--text-muted)",
  },
  letterContent: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },
  letterParagraph: {
    fontSize: "1.05rem",
    color: "var(--text-secondary)",
    lineHeight: "1.6",
  },
  questionsList: {
    listStyleType: "none",
    paddingLeft: "12px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  quoteBlock: {
    borderLeft: "4px solid var(--primary)",
    paddingLeft: "18px",
    margin: "12px 0",
    fontFamily: "Outfit, sans-serif",
    fontSize: "1.25rem",
    fontWeight: "600",
    fontStyle: "italic",
    color: "var(--text-primary)",
  },
  ctaContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    width: "100%",
    marginTop: "8px",
  },
  ctaPrimary: {
    width: "100%",
    padding: "16px",
    fontSize: "1.1rem",
  },
  ctaSecondary: {
    width: "100%",
    padding: "16px",
    fontSize: "1.1rem",
  },
  footer: {
    padding: "24px",
    textAlign: "center",
    borderTop: "1px solid var(--border)",
    fontSize: "0.8rem",
    color: "var(--text-muted)",
  },
  privacyLink: {
    color: "var(--primary)",
    textDecoration: "underline",
    marginLeft: "8px",
  },
};
// Add custom list items styles to document object on hydration (simulated via bullet style rendering)
if (typeof document !== "undefined") {
  const styleEl = document.createElement("style");
  styleEl.innerHTML = `
    ul {
      list-style-type: none;
    }
    ul li {
      position: relative;
      padding-left: 24px;
      color: var(--text-secondary);
      font-size: 1.05rem;
    }
    ul li::before {
      content: "•";
      color: var(--accent);
      font-weight: bold;
      display: inline-block;
      width: 1em;
      margin-left: -1em;
      position: absolute;
      left: 6px;
    }
  `;
  document.head.appendChild(styleEl);
}
