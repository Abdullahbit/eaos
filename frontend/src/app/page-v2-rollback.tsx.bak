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
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

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

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
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
              <span className="live-pulse-badge">
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
          <div style={styles.pageFlow}>
            
            {/* SECTION 1: HERO & PRIMARY PROBLEM MATCH (Above the fold) */}
            <section style={styles.heroSection} className="animate-fade-in">
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
                  onClick={() => scrollToSection("process-section")}
                  id="howItWorksBtn"
                >
                  How Recommendations Work
                </button>
              </div>
            </section>

            {/* Dotted Route Line connecting narrative sections */}
            <div className="route-line-container">
              <div className="route-line" style={{ left: "50%", transform: "translateX(-50%)" }}></div>

              <div style={styles.routeContent}>
                
                {/* SECTION 2: THE PROBLEM (Three Trap Points) */}
                <section style={styles.sectionBlock}>
                  <div style={styles.sectionHeaderCentered}>
                    <div className="typewriter-coords" style={{ marginBottom: "8px" }}>WAYPOINT 01 // ADMISSIONS CRITERIA</div>
                    <h2>Three traps international students fall into</h2>
                    <p style={{ maxWidth: "600px", margin: "8px auto 0 auto" }}>Traditional study agencies often optimize for commissions rather than student success. Watch out for these traps:</p>
                  </div>

                  <div style={styles.problemGrid}>
                    <div className="glass-card" style={styles.problemCard}>
                      <div style={styles.iconCircle}>💸</div>
                      <h3 style={{ marginBottom: "8px" }}>The Hidden Cost Trap</h3>
                      <p style={{ fontSize: "0.95rem" }}>Marketing only the first-year discount while hiding subsequently rising tuition rates or mandatory preparatory school language fees.</p>
                    </div>
                    <div className="glass-card" style={styles.problemCard}>
                      <div style={styles.iconCircle}>🤝</div>
                      <h3 style={{ marginBottom: "8px" }}>The Commission Trap</h3>
                      <p style={{ fontSize: "0.95rem" }}>Directing students to low-tier private colleges that offer the highest commission payout to agents, regardless of academic fit.</p>
                    </div>
                    <div className="glass-card" style={styles.problemCard}>
                      <div style={styles.iconCircle}>📊</div>
                      <h3 style={{ marginBottom: "8px" }}>The Fake Ranking Trap</h3>
                      <p style={{ fontSize: "0.95rem" }}>Publishing modified or legacy ranking tables to inflate the global recognition and accreditation values of certain departments.</p>
                    </div>
                  </div>
                </section>

                {/* SECTION 3: ABDULLAH'S NARRATIVE (Concise Story) */}
                <section style={styles.sectionBlock}>
                  <div className="hero-grid" style={{ alignItems: "center" }}>
                    <div className="story-col">
                      <div className="typewriter-coords" style={{ marginBottom: "8px" }}>WAYPOINT 02 // PERSONAL STORY</div>
                      <h2 style={{ marginBottom: "16px" }}>"I want to help you avoid the mistakes I made."</h2>
                      <p style={styles.narrativeParagraph}>
                        Hi 👋 I’m Abdullah. I'm a senior Computer Engineering student living and studying in Istanbul.
                      </p>
                      <p style={styles.narrativeParagraph}>
                        When I first moved to Turkey as an international student, I fell into expensive tuition traps because I trusted commercial sales agencies that hid true costs.
                      </p>
                      <p style={styles.narrativeParagraph}>
                        I built <strong>Campus Insider</strong> to index verified university programs directly. I'm here to give you honest, current data so you can decide whether studying in Turkey is the right choice for you.
                      </p>
                    </div>
                    <div className="glass-card" style={styles.letterCard}>
                      <div style={styles.avatarLarge}>🎓</div>
                      <h4 style={{ marginBottom: "4px" }}>Abdullah</h4>
                      <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "16px" }}>Computer Engineering, Istanbul</p>
                      <blockquote className="signature" style={{ fontSize: "1.1rem", lineHeight: "1.4" }}>
                        “I will recommend the option I would choose myself if I were spending my own money.”
                      </blockquote>
                    </div>
                  </div>
                </section>

                {/* SECTION 4: SHOWING THE PRODUCT (Early Visual Previews) */}
                <section style={styles.sectionBlock}>
                  <div style={styles.sectionHeaderCentered}>
                    <div className="typewriter-coords" style={{ marginBottom: "8px" }}>WAYPOINT 03 // PRODUCT PREVIEW</div>
                    <h2>See what you will receive</h2>
                    <p style={{ maxWidth: "600px", margin: "8px auto 0 auto" }}>Get matching programs and transparent tuition costs instantly without calling sales agents.</p>
                  </div>

                  <div className="hero-grid" style={{ gap: "24px", marginTop: "32px" }}>
                    {/* Left: Questionnaire Preview */}
                    <div className="glass-card" style={styles.previewCard}>
                      <span style={styles.previewTag}>Interactive Assessment</span>
                      <h4 style={{ margin: "8px 0" }}>What is your maximum annual budget?</h4>
                      <div style={styles.previewOptions}>
                        <div style={styles.previewOption}>$2,000 / year</div>
                        <div style={{ ...styles.previewOption, borderColor: "var(--primary)", background: "var(--primary-glow)" }}>$4,000 / year ✓</div>
                        <div style={styles.previewOption}>$6,000 / year</div>
                      </div>
                    </div>

                    {/* Right: Recommendation Preview */}
                    <div className="glass-card" style={styles.previewCard}>
                      <span style={styles.previewTag}>Program Match</span>
                      <h4 style={{ margin: "8px 0" }}>Computer Engineering (English)</h4>
                      <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Bahçeşehir University • Istanbul</p>
                      <div style={styles.previewRationales}>
                        <div style={styles.previewRationale}>✓ Fits your $4k budget limit</div>
                        <div style={styles.previewRationale}>✓ 100% English medium instruction</div>
                      </div>
                      <div style={styles.previewPrice}>Cash Tuition: $4,500/yr</div>
                    </div>
                  </div>
                </section>

                {/* SECTION 5: RECOMMENDATION PROCESS */}
                <section style={styles.sectionBlock} id="process-section">
                  <div style={styles.sectionHeaderCentered}>
                    <div className="typewriter-coords" style={{ marginBottom: "8px" }}>WAYPOINT 04 // THE PROCESS</div>
                    <h2>How recommendations work</h2>
                    <p style={{ maxWidth: "600px", margin: "8px auto 0 auto" }}>A transparent matching process with verified admissions data.</p>
                  </div>

                  <div style={styles.processFlow}>
                    <div style={styles.processStep}>
                      <div style={styles.stepNum}>1</div>
                      <h4 style={{ marginBottom: "4px" }}>Your Answers</h4>
                      <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Input your language, study level, and maximum budget limits.</p>
                    </div>
                    <div style={styles.processArrow}>➔</div>
                    <div style={styles.processStep}>
                      <div style={styles.stepNum}>2</div>
                      <h4 style={{ marginBottom: "4px" }}>Filter Matching</h4>
                      <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>The engine filters through 7,695 options dynamically in real-time.</p>
                    </div>
                    <div style={styles.processArrow}>➔</div>
                    <div style={styles.processStep}>
                      <div style={styles.stepNum}>3</div>
                      <h4 style={{ marginBottom: "4px" }}>Verified Data</h4>
                      <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Pricing structures are verified directly against authorized registers.</p>
                    </div>
                    <div style={styles.processArrow}>➔</div>
                    <div style={styles.processStep}>
                      <div style={styles.stepNum}>4</div>
                      <h4 style={{ marginBottom: "4px" }}>Personal Options</h4>
                      <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Get a detailed comparison sheet showing total cash and installment costs.</p>
                    </div>
                  </div>
                </section>

                {/* SECTION 6: WHY TRUST CAMPUS INSIDER */}
                <section style={styles.sectionBlock}>
                  <div className="hero-grid" style={{ gap: "40px" }}>
                    <div>
                      <div className="typewriter-coords" style={{ marginBottom: "8px" }}>WAYPOINT 05 // OUR PROMISE</div>
                      <h2 style={{ marginBottom: "16px" }}>Our student-first design principles</h2>
                      <p style={styles.narrativeParagraph}>
                        We are not an education agency. We do not sell courses. We help you make the decision we would make if we were spending our own money.
                      </p>
                    </div>
                    <div style={styles.trustGrid}>
                      <div style={styles.trustBox}>
                        <div style={{ fontWeight: 700, color: "var(--accent-teal)", marginBottom: "4px" }}>✓ Built by a student</div>
                        <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Created by Abdullah, a senior engineering student in Istanbul who went through this journey.</p>
                      </div>
                      <div style={styles.trustBox}>
                        <div style={{ fontWeight: 700, color: "var(--accent-teal)", marginBottom: "4px" }}>✓ Verified admissions data</div>
                        <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Program details are regularly synchronized from our authorized database.</p>
                      </div>
                      <div style={styles.trustBox}>
                        <div style={{ fontWeight: 700, color: "var(--accent-teal)", marginBottom: "4px" }}>✓ Transparent breakdowns</div>
                        <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Displays cash rates, semester installments, and mandatory prep school fees.</p>
                      </div>
                      <div style={styles.trustBox}>
                        <div style={{ fontWeight: 700, color: "var(--accent-teal)", marginBottom: "4px" }}>✓ Free assessment</div>
                        <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>No consultation fees or hidden sales commissions.</p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* SECTION 7: DATABASE COVERAGE */}
                <section style={styles.sectionBlock}>
                  <div style={styles.sectionHeaderCentered}>
                    <div className="typewriter-coords" style={{ marginBottom: "8px" }}>WAYPOINT 06 // DATA SCOPE</div>
                    <h2>Program database coverage</h2>
                    <p style={{ maxWidth: "600px", margin: "8px auto 0 auto" }}>Verified options mapped across primary Turkish university networks.</p>
                  </div>

                  <div style={styles.statsGrid}>
                    <div className="glass-card" style={styles.statBox}>
                      <div style={styles.statNumBig}>39</div>
                      <div style={styles.statLabel}>Universities</div>
                    </div>
                    <div className="glass-card" style={styles.statBox}>
                      <div style={styles.statNumBig}>7,695</div>
                      <div style={styles.statLabel}>Programs</div>
                    </div>
                    <div className="glass-card" style={styles.statBox}>
                      <div style={styles.statNumBig}>Multi-Level</div>
                      <div style={styles.statLabel}>Associate to PhD</div>
                    </div>
                    <div className="glass-card" style={styles.statBox}>
                      <div style={styles.statNumBig}>Bilingual</div>
                      <div style={styles.statLabel}>English & Turkish</div>
                    </div>
                  </div>
                </section>

                {/* SECTION 8: FAQ & ANSWERS */}
                <section style={styles.sectionBlock}>
                  <div style={styles.sectionHeaderCentered}>
                    <div className="typewriter-coords" style={{ marginBottom: "8px" }}>WAYPOINT 07 // FREQUENT QUESTIONS</div>
                    <h2>Frequently asked questions</h2>
                  </div>

                  <div style={styles.faqList}>
                    {[
                      {
                        q: "How is the program tuition data updated?",
                        a: "We synchronize tuition rates, semester fees, and available course lists directly from authorized university portals on a recurring cycle to ensure pricing is current."
                      },
                      {
                        q: "Does Campus Insider charge any consultation fees?",
                        a: "No. The search service and matching assessment wizard are 100% free for students. We receive standard commission support directly from universities for processing admissions."
                      },
                      {
                        q: "Are the displayed tuition numbers final?",
                        a: "Tuition structures are preliminary. Final prices, exact discount terms, and specific program availability must be verified directly with the institution before submitting applications."
                      }
                    ].map((item, idx) => (
                      <div key={idx} style={styles.faqItem} onClick={() => toggleFaq(idx)}>
                        <div style={styles.faqHeader}>
                          <span style={{ fontWeight: 600 }}>{item.q}</span>
                          <span>{activeFaq === idx ? "−" : "+"}</span>
                        </div>
                        {activeFaq === idx && (
                          <div style={styles.faqBody} className="animate-fade-in">
                            <p style={{ fontSize: "0.95rem" }}>{item.a}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>

                {/* SECTION 9: FINAL WAYPOINT CTA */}
                <section style={{ ...styles.sectionBlock, textAlign: "center", border: "none" }}>
                  <div className="typewriter-coords" style={{ marginBottom: "8px" }}>WAYPOINT 08 // START JOURNEY</div>
                  <h2 style={{ fontSize: "2.2rem", marginBottom: "12px" }}>Find options matching your budget today</h2>
                  <p style={{ color: "var(--text-secondary)", marginBottom: "24px" }}>Takes less than 3 minutes. Results are saved to your local session.</p>
                  <button
                    className="btn btn-primary"
                    style={{ padding: "16px 40px", fontSize: "1.1rem" }}
                    onClick={handleStartWizard}
                  >
                    Start My Free Assessment Now
                  </button>
                </section>

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
    padding: "16px 0",
    backgroundColor: "rgba(249, 248, 246, 0.6)",
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
    color: "var(--primary)",
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
    backgroundColor: "rgba(0, 0, 0, 0.03)",
    border: "1px solid var(--border)",
    padding: "4px 10px",
    borderRadius: "20px",
    fontWeight: "600",
  },
  container: {
    flex: 1,
    paddingTop: "40px",
    paddingBottom: "80px",
  },
  pageFlow: {
    display: "flex",
    flexDirection: "column",
    gap: "60px",
    width: "100%",
  },
  heroSection: {
    padding: "60px 40px",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "24px",
    maxWidth: "1000px",
    margin: "0 auto",
  },
  heroTitle: {
    fontSize: "3.5rem",
    lineHeight: "1.1",
    fontWeight: 800,
    maxWidth: "850px",
  },
  heroSubtitle: {
    fontSize: "1.2rem",
    color: "var(--text-secondary)",
    maxWidth: "680px",
  },
  disclaimerBox: {
    backgroundColor: "rgba(238, 175, 42, 0.06)",
    border: "1px solid rgba(238, 175, 42, 0.2)",
    borderRadius: "12px",
    padding: "12px 20px",
    maxWidth: "750px",
    textAlign: "left",
  },
  disclaimerText: {
    fontSize: "0.85rem",
    color: "var(--accent-gold)",
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
    minWidth: "240px",
    padding: "16px 36px",
    fontSize: "1.05rem",
  },
  heroCtaSecondary: {
    minWidth: "240px",
    padding: "16px 36px",
    fontSize: "1.05rem",
  },
  routeContent: {
    display: "flex",
    flexDirection: "column",
    gap: "120px",
    paddingTop: "60px",
  },
  sectionBlock: {
    position: "relative",
    zIndex: 1,
    padding: "20px 0",
    borderBottom: "1px solid var(--border)",
    paddingBottom: "80px",
  },
  sectionHeaderCentered: {
    textAlign: "center",
    marginBottom: "40px",
  },
  problemGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "24px",
  },
  problemCard: {
    padding: "32px 24px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  iconCircle: {
    width: "48px",
    height: "48px",
    borderRadius: "9999px",
    background: "var(--primary-glow)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.4rem",
    marginBottom: "8px",
  },
  narrativeParagraph: {
    fontSize: "1.05rem",
    color: "var(--text-secondary)",
    lineHeight: "1.7",
    marginBottom: "16px",
  },
  letterCard: {
    padding: "40px",
    textAlign: "center",
    maxWidth: "380px",
    margin: "0 auto",
  },
  avatarLarge: {
    fontSize: "3rem",
    width: "80px",
    height: "80px",
    borderRadius: "9999px",
    background: "var(--primary-glow)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 16px auto",
    border: "1px solid var(--border)",
  },
  previewCard: {
    padding: "30px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  previewTag: {
    fontSize: "0.75rem",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    color: "var(--text-muted)",
    fontWeight: 700,
  },
  previewOptions: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  previewOption: {
    padding: "12px",
    border: "1px solid var(--border)",
    borderRadius: "8px",
    fontSize: "0.9rem",
    fontWeight: 500,
  },
  previewRationales: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  previewRationale: {
    fontSize: "0.85rem",
    color: "var(--accent-teal)",
    fontWeight: 600,
  },
  previewPrice: {
    fontSize: "1.1rem",
    fontWeight: 700,
    color: "var(--text-charcoal)",
    marginTop: "8px",
    borderTop: "1px solid var(--border)",
    paddingTop: "12px",
  },
  processFlow: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "24px",
    marginTop: "24px",
  },
  processStep: {
    flex: "1 1 200px",
    textAlign: "center",
  },
  stepNum: {
    width: "40px",
    height: "40px",
    borderRadius: "9999px",
    background: "var(--primary)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.1rem",
    fontWeight: 700,
    margin: "0 auto 12px auto",
  },
  processArrow: {
    fontSize: "1.5rem",
    color: "var(--text-muted)",
    alignSelf: "center",
    display: "none",
  },
  trustGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "24px",
  },
  trustBox: {
    padding: "8px 0",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "24px",
    marginTop: "24px",
  },
  statBox: {
    padding: "30px 20px",
    textAlign: "center",
  },
  statNumBig: {
    fontSize: "2.5rem",
    fontWeight: 800,
    fontFamily: "Outfit, sans-serif",
    color: "var(--primary)",
    marginBottom: "6px",
  },
  statLabel: {
    fontSize: "0.8rem",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    color: "var(--text-secondary)",
    fontWeight: 700,
  },
  faqList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    maxWidth: "700px",
    margin: "0 auto",
  },
  faqItem: {
    background: "#fff",
    border: "1px solid var(--border)",
    borderRadius: "12px",
    cursor: "pointer",
    padding: "18px 24px",
  },
  faqHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  faqBody: {
    marginTop: "12px",
    borderTop: "1px solid var(--border)",
    paddingTop: "12px",
    color: "var(--text-secondary)",
  },
  footer: {
    padding: "24px",
    textAlign: "center",
    borderTop: "1px solid var(--border)",
    fontSize: "0.8rem",
    color: "var(--text-muted)",
    backgroundColor: "var(--bg-secondary)",
  },
  privacyLink: {
    color: "var(--accent-teal)",
    textDecoration: "underline",
    marginLeft: "8px",
  },
};
