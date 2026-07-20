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
      {/* Editorial Header */}
      <header style={styles.header}>
        <div style={styles.headerLogo}>
          🧭 CAMPUS INSIDER
        </div>
        <div style={styles.headerStatusRight}>
          {syncStatus.is_syncing ? (
            <span style={styles.livePulseBadge}>
              <span className="pulse-dot"></span>
              DATABASE SYNCING NOW
            </span>
          ) : (
            <span style={styles.syncLabel}>
              DATABASE LIVE // UPDATED: {formatSyncTime(syncStatus.latest_sync_time).toUpperCase()}
            </span>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <div style={styles.container}>
        {!resultsData ? (
          <div style={styles.pageFlow}>
            
            {/* SECTION 2: HERO & PRIMARY PROBLEM MATCH (Asymmetrical Grid) */}
            <section style={styles.heroSection}>
              <div style={styles.heroGrid}>
                {/* Left Text Column */}
                <div style={styles.heroTextCol}>
                  <div style={styles.waypointLabel}>WAYPOINT 01 // OVERVIEW</div>
                  <h1 style={styles.heroTitle}>
                    Avoid Costly Mistakes Studying in Turkey
                  </h1>
                  <p style={styles.heroSubtitle}>
                    Compare current programs and tuition fees based on your budget, preferred language, and study level. Read verified reports directly from the admissions database.
                  </p>

                  {/* Hero CTAs */}
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
                </div>

                {/* Right Photo Column */}
                <div style={styles.heroPhotoCol}>
                  <div style={styles.photoFrame}>
                    {/* Mock student library photo with overlay coordinates */}
                    <div style={styles.studentPhotoMock}>
                      <span style={styles.photoOverlayCoords}>
                        41° 00' 49" N, 28° 57' 18" E
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <hr style={styles.sectionDivider} />

            {/* SECTION 3: THE PROBLEM (Three Trap Points) */}
            <section style={styles.sectionBlock}>
              <div style={styles.sectionHeader}>
                <div style={styles.waypointLabel}>WAYPOINT 02 // PROBLEM</div>
                <h2 style={styles.sectionTitle}>Three Traps International Students Fall Into</h2>
                <p style={styles.sectionSubtitle}>
                  Traditional study agencies often optimize for recruitment commissions rather than student success. Watch out for these traps:
                </p>
              </div>

              <div style={styles.trapsContainer}>
                {/* Trap 1 */}
                <div style={styles.trapRow}>
                  <div style={styles.trapNumber}>01</div>
                  <div style={styles.trapTextContainer}>
                    <h3 style={styles.trapTitle}>Hidden Prep-School Language Fees</h3>
                    <p style={styles.trapDesc}>
                      Many universities advertise low tuition rates but require a mandatory English or Turkish preparatory school year costing up to 90% of the initial annual tuition.
                    </p>
                  </div>
                </div>

                <div style={styles.trapDivider} />

                {/* Trap 2 */}
                <div style={styles.trapRow}>
                  <div style={styles.trapNumber}>02</div>
                  <div style={styles.trapTextContainer}>
                    <h3 style={styles.trapTitle}>Inflated Installment Payment Penalties</h3>
                    <p style={styles.trapDesc}>
                      Splitting tuition into semester installments often adds hidden handling charges, ballooning your total annual costs by thousands of dollars compared to the upfront cash price.
                    </p>
                  </div>
                </div>

                <div style={styles.trapDivider} />

                {/* Trap 3 */}
                <div style={styles.trapRow}>
                  <div style={styles.trapNumber}>03</div>
                  <div style={styles.trapTextContainer}>
                    <h3 style={styles.trapTitle}>Commission-Biased University Matches</h3>
                    <p style={styles.trapDesc}>
                      Free consulting agencies steer you toward specific private universities that pay them high affiliate bonuses, ignoring cheaper public options that fit your academic goals better.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <hr style={styles.sectionDivider} />

            {/* SECTION 4: MAGAZINE-STYLE ABDULLAH STORY */}
            <section style={styles.sectionBlock}>
              <div style={styles.storyGrid}>
                {/* Abdullah Portrait Left */}
                <div style={styles.storyPhotoCol}>
                  <div style={styles.portraitMock}>
                    <span style={styles.portraitLabel}>ABDULLAH // CO-FOUNDER</span>
                  </div>
                </div>

                {/* Story Quote Right */}
                <div style={styles.storyTextCol}>
                  <div style={styles.waypointLabel}>WAYPOINT 03 // STORY</div>
                  <h2 style={styles.sectionTitle}>"I arrived in Istanbul with a bag and a stack of unverified brochures."</h2>
                  <blockquote style={styles.blockquote}>
                    “When I first moved to Turkey to study computer engineering, I was overwhelmed by conflicting tuition rates on different forums. I built Campus Insider to synchronize verified admissions data in one place—giving students the honest roadmap I never had.”
                  </blockquote>
                  <p style={styles.authorSignature}>— Abdullah, Campus Insider Team</p>
                </div>
              </div>
            </section>

            {/* SECTION 5: DARK PRODUCT PREVIEW */}
            <section style={styles.darkSection}>
              <div style={styles.darkSectionInner}>
                <div style={styles.waypointLabelDark}>WAYPOINT 04 // PRODUCT</div>
                <h2 style={styles.darkSectionTitle}>Real-time Database Blueprint Preview</h2>
                <p style={styles.darkSectionSubtitle}>
                  This is how your final study options recommendations list will render. Each matched university prints detailed upfront cash vs installment cost rates.
                </p>

                {/* Mockup Card Frame */}
                <div style={styles.mockupContainer}>
                  <div style={styles.mockupHeader}>
                    <div>
                      <span style={styles.mockBadge}>BEST OVERALL MATCH</span>
                      <h4 style={styles.mockProgramName}>Software Engineering</h4>
                      <span style={styles.mockUniName}>Istanbul Topkapi University • Istanbul</span>
                    </div>
                    <span style={styles.mockDegree}>Bachelor</span>
                  </div>
                  <div style={styles.mockTableContainer}>
                    <table style={styles.mockTable}>
                      <thead>
                        <tr>
                          <th style={styles.mockTh}>Payment Method</th>
                          <th style={{ ...styles.mockTh, textAlign: "right" }}>Annual Fee</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td style={styles.mockTd}>Cash Price (Upfront)</td>
                          <td style={{ ...styles.mockTd, textAlign: "right", fontWeight: 700 }}>$2,500</td>
                        </tr>
                        <tr>
                          <td style={styles.mockTd}>Installments Price</td>
                          <td style={{ ...styles.mockTd, textAlign: "right" }}>$2,750</td>
                        </tr>
                        <tr>
                          <td style={styles.mockTd}>Prep School Fee</td>
                          <td style={{ ...styles.mockTd, textAlign: "right" }}>$2,375</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </section>

            <hr style={styles.sectionDivider} />

            {/* SECTION 6: RECOMMENDATION PROCESS TIMELINE */}
            <section id="process-section" style={styles.sectionBlock}>
              <div style={styles.sectionHeader}>
                <div style={styles.waypointLabel}>WAYPOINT 05 // METHOD</div>
                <h2 style={styles.sectionTitle}>The Waypoint Recommendation Process</h2>
                <p style={styles.sectionSubtitle}>
                  We guide you through the process of finding your ideal program in Turkey step-by-step:
                </p>
              </div>

              <div style={styles.timelineGrid}>
                {/* Step 1 */}
                <div style={styles.timelineCard}>
                  <div style={styles.timelineNumber}>01</div>
                  <h4 style={styles.timelineTitle}>Define Constraints</h4>
                  <p style={styles.timelineDesc}>
                    Specify your degree level, target language, and maximum yearly tuition budget.
                  </p>
                </div>

                {/* Step 2 */}
                <div style={styles.timelineCard}>
                  <div style={styles.timelineNumber}>02</div>
                  <h4 style={styles.timelineTitle}>Verify database matches</h4>
                  <p style={styles.timelineDesc}>
                    Our engine queries matching Turkish programs, filtering out options above your budget limits.
                  </p>
                </div>

                {/* Step 3 */}
                <div style={styles.timelineCard}>
                  <div style={styles.timelineNumber}>03</div>
                  <h4 style={styles.timelineTitle}>Print Cost Breakdown</h4>
                  <p style={styles.timelineDesc}>
                    We calculate cash pricing vs installments and prep school fees to prevent cost surprises.
                  </p>
                </div>

                {/* Step 4 */}
                <div style={styles.timelineCard}>
                  <div style={styles.timelineNumber}>04</div>
                  <h4 style={styles.timelineTitle}>Direct Consult</h4>
                  <p style={styles.timelineDesc}>
                    Connect directly on WhatsApp with Abdullah to verify admission quotas and coordinate visa paperwork.
                  </p>
                </div>
              </div>
            </section>

            <hr style={styles.sectionDivider} />

            {/* SECTION 7: TRUST PRINCIPLES Alternating Rows */}
            <section style={styles.sectionBlock}>
              <div style={styles.sectionHeader}>
                <div style={styles.waypointLabel}>WAYPOINT 06 // TRUST</div>
                <h2 style={styles.sectionTitle}>Our Core Principles</h2>
                <p style={styles.sectionSubtitle}>
                  We keep our advice independent, honest, and direct:
                </p>
              </div>

              <div style={styles.principlesContainer}>
                {/* Principle 1 */}
                <div style={styles.principleRow}>
                  <div style={styles.principleText}>
                    <h3 style={styles.principleTitle}>Free student assessment</h3>
                    <p style={styles.principleDesc}>
                      We never charge application entry fees or processing consultation fees. Our matching calculations and admissions assessments are 100% free for international students.
                    </p>
                  </div>
                  <div style={styles.principlePhotoMock1} />
                </div>

                <div style={styles.trapDivider} />

                {/* Principle 2 */}
                <div style={styles.principleRowReverse}>
                  <div style={styles.principleText}>
                    <h3 style={styles.principleTitle}>Verified admissions data</h3>
                    <p style={styles.principleDesc}>
                      Program and tuition information is regularly synchronized from our authorized admissions database, ensuring you see accurate details before beginning applications.
                    </p>
                  </div>
                  <div style={styles.principlePhotoMock2} />
                </div>
              </div>
            </section>

            <hr style={styles.sectionDivider} />

            {/* SECTION 8: DATABASE COVERAGE STATISTICS */}
            <section style={styles.statsSection}>
              <div style={styles.statsInner}>
                <div style={styles.waypointLabel}>WAYPOINT 07 // DATABASE</div>
                <div style={styles.giantStat}>7,695</div>
                <h3 style={styles.statsTitle}>Verified Programs Indexed</h3>
                <p style={styles.statsDesc}>
                  Across 39 Turkish universities, offering options from Associate to PhD degrees in both English and Turkish instruction.
                </p>
              </div>
            </section>

            <hr style={styles.sectionDivider} />

            {/* SECTION 9: FAQ Accordions */}
            <section style={styles.sectionBlock}>
              <div style={styles.sectionHeader}>
                <div style={styles.waypointLabel}>FAQ // DETAILS</div>
                <h2 style={styles.sectionTitle}>Common Student Questions</h2>
              </div>

              <div style={styles.faqList}>
                {[
                  {
                    q: "What is the difference between Cash Price and Installment Price?",
                    a: "Cash Price is the discounted tuition rate paid upfront during registration. Installment Price splits payments across semesters, but usually carries handling fees that increase the total annual cost."
                  },
                  {
                    q: "Are the preparatory school fees included in the annual tuition?",
                    a: "No. If a program requires a preparatory language year, the prep school fee is billed separately for the first year. We display this separately so you are prepared."
                  },
                  {
                    q: "Do I need a study visa before arriving in Turkey?",
                    a: "Yes. Once you receive your official admission acceptance, you must apply for an educational visa at the nearest Turkish embassy using your registration documents."
                  }
                ].map((faq, idx) => (
                  <div key={idx} style={styles.faqItem}>
                    <button style={styles.faqHeader} onClick={() => toggleFaq(idx)}>
                      <span style={styles.faqQuestion}>{faq.q}</span>
                      <span style={styles.faqToggleSymbol}>{activeFaq === idx ? "−" : "+"}</span>
                    </button>
                    {activeFaq === idx && (
                      <div style={styles.faqBody}>
                        <p style={styles.faqAnswer}>{faq.a}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* SECTION 10: FINAL CTA COLOR BLOCK */}
            <section style={styles.finalCtaSection}>
              <div style={styles.finalCtaContent}>
                <h2 style={styles.finalCtaTitle}>Ready to Find Your University Match?</h2>
                <p style={styles.finalCtaDesc}>
                  It takes less than 2 minutes to run your profile constraints through the Istanbul Student Atlas database.
                </p>
                <button
                  className="btn btn-primary"
                  style={styles.finalCtaBtn}
                  onClick={handleStartWizard}
                >
                  Start My Free Assessment
                </button>
              </div>
            </section>

          </div>
        ) : (
          /* Recommendation Results View */
          <ResultsDisplay
            leadId={resultsData.leadId}
            results={resultsData.results}
            onRestart={handleRestart}
          />
        )}
      </div>

      {/* Main Wizard Overlay */}
      {showWizard && (
        <AssessmentWizard
          onComplete={handleAssessmentComplete}
          onCancel={() => setShowWizard(false)}
        />
      )}

      {/* Editorial Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerInner}>
          <p>© {new Date().getFullYear()} Campus Insider. Built independently for international student wayfinding.</p>
          <div style={styles.footerLinks}>
            <Link href="/privacy" style={styles.footerLink}>Privacy Policy</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}

// V3 Styling matching "The Istanbul Student Atlas" editorial specs
const styles: { [key: string]: React.CSSProperties } = {
  main: {
    backgroundColor: "var(--soft-white)", /* Soft White paper feel */
    minHeight: "100vh",
    color: "var(--ink-navy)",
    fontFamily: "'Inter', sans-serif",
  },
  header: {
    width: "100%",
    borderBottom: "2px solid var(--border)",
    padding: "24px 40px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "var(--soft-white)",
  },
  headerLogo: {
    fontFamily: "'Sora', sans-serif",
    fontWeight: "800",
    fontSize: "1.1rem",
    color: "var(--ink-navy)",
    letterSpacing: "0.05em",
  },
  headerStatusRight: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  syncLabel: {
    fontFamily: "monospace",
    fontSize: "0.75rem",
    color: "var(--muted-slate)",
    letterSpacing: "0.05em",
  },
  livePulseBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    fontFamily: "monospace",
    fontSize: "0.75rem",
    color: "var(--accent-teal)",
    fontWeight: "700",
    letterSpacing: "0.05em",
  },
  container: {
    width: "100%",
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "40px 40px 100px 40px",
  },
  pageFlow: {
    display: "flex",
    flexDirection: "column",
    gap: "80px",
  },
  heroSection: {
    padding: "40px 0 20px 0",
  },
  heroGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "48px",
    alignItems: "center",
  },
  heroTextCol: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },
  waypointLabel: {
    fontFamily: "monospace",
    fontSize: "0.75rem",
    color: "var(--muted-slate)",
    letterSpacing: "0.08em",
  },
  heroTitle: {
    fontSize: "4.5rem",
    fontWeight: "800",
    fontFamily: "'Sora', sans-serif",
    lineHeight: "1.05",
    color: "var(--ink-navy)",
    letterSpacing: "-0.03em",
  },
  heroSubtitle: {
    fontSize: "1.15rem",
    lineHeight: "1.6",
    color: "var(--muted-slate)",
  },
  ctaRow: {
    display: "flex",
    gap: "16px",
    flexWrap: "wrap",
    marginTop: "12px",
  },
  heroCtaPrimary: {
    borderRadius: "4px",
    padding: "16px 32px",
    fontSize: "1.05rem",
    backgroundColor: "var(--cobalt-blue)",
    color: "#fff",
    border: "none",
  },
  heroCtaSecondary: {
    borderRadius: "4px",
    padding: "16px 32px",
    fontSize: "1.05rem",
    border: "1.5px solid var(--ink-navy)",
    backgroundColor: "transparent",
    color: "var(--ink-navy)",
  },
  heroPhotoCol: {
    display: "flex",
    justifyContent: "flex-end",
  },
  photoFrame: {
    width: "100%",
    maxWidth: "420px",
    border: "2px solid var(--ink-navy)",
    borderRadius: "4px",
    padding: "8px",
    backgroundColor: "#fff",
  },
  studentPhotoMock: {
    width: "100%",
    height: "460px",
    backgroundColor: "rgba(21, 34, 56, 0.08)", /* Monochrome mock student image background */
    borderRadius: "2px",
    position: "relative",
    display: "flex",
    alignItems: "flex-end",
    padding: "16px",
  },
  photoOverlayCoords: {
    fontFamily: "monospace",
    fontSize: "0.75rem",
    color: "#fff",
    backgroundColor: "var(--ink-navy)",
    padding: "6px 12px",
    borderRadius: "2px",
    letterSpacing: "0.05em",
  },
  sectionDivider: {
    border: "none",
    borderTop: "2px solid var(--border)",
  },
  sectionBlock: {
    display: "flex",
    flexDirection: "column",
    gap: "40px",
  },
  sectionHeader: {
    maxWidth: "700px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  sectionTitle: {
    fontSize: "2.8rem",
    fontWeight: "800",
    fontFamily: "'Sora', sans-serif",
    lineHeight: "1.15",
  },
  sectionSubtitle: {
    fontSize: "1.1rem",
    color: "var(--muted-slate)",
    lineHeight: "1.6",
  },
  trapsContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },
  trapRow: {
    display: "flex",
    gap: "32px",
    alignItems: "flex-start",
  },
  trapNumber: {
    fontFamily: "'Source Serif 4', Georgia, serif",
    fontSize: "5.5rem",
    fontWeight: "600",
    color: "var(--muted-slate)",
    lineHeight: "0.8",
  },
  trapTextContainer: {
    flex: 1,
  },
  trapTitle: {
    fontSize: "1.3rem",
    fontWeight: "700",
    fontFamily: "'Sora', sans-serif",
    color: "var(--ink-navy)",
    marginBottom: "8px",
  },
  trapDesc: {
    fontSize: "1rem",
    color: "var(--text-secondary)",
    lineHeight: "1.5",
  },
  trapDivider: {
    borderTop: "1px solid var(--border)",
  },
  storyGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "48px",
    alignItems: "center",
  },
  storyPhotoCol: {
    display: "flex",
    justifyContent: "flex-start",
  },
  portraitMock: {
    width: "100%",
    maxWidth: "360px",
    height: "400px",
    backgroundColor: "rgba(21, 34, 56, 0.08)",
    border: "2px solid var(--ink-navy)",
    borderRadius: "4px",
    position: "relative",
    display: "flex",
    alignItems: "flex-end",
    padding: "16px",
  },
  portraitLabel: {
    fontFamily: "monospace",
    fontSize: "0.75rem",
    color: "#fff",
    backgroundColor: "var(--accent-gold)",
    padding: "6px 12px",
    borderRadius: "2px",
  },
  storyTextCol: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },
  blockquote: {
    fontFamily: "'Source Serif 4', Georgia, serif",
    fontSize: "1.5rem",
    lineHeight: "1.6",
    fontStyle: "italic",
    color: "var(--ink-navy)",
  },
  authorSignature: {
    fontSize: "0.95rem",
    fontWeight: "600",
    color: "var(--muted-slate)",
  },
  darkSection: {
    backgroundColor: "var(--ink-navy)",
    color: "#fff",
    padding: "80px 40px",
    borderRadius: "4px",
    margin: "0 -40px",
  },
  darkSectionInner: {
    maxWidth: "1120px",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },
  waypointLabelDark: {
    fontFamily: "monospace",
    fontSize: "0.75rem",
    color: "var(--muted-slate)",
    letterSpacing: "0.08em",
  },
  darkSectionTitle: {
    fontSize: "2.8rem",
    fontWeight: "800",
    fontFamily: "'Sora', sans-serif",
    color: "#fff",
  },
  darkSectionSubtitle: {
    fontSize: "1.1rem",
    color: "var(--muted-slate)",
    lineHeight: "1.6",
    maxWidth: "700px",
  },
  mockupContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    border: "1.5px solid rgba(255, 255, 255, 0.15)",
    borderRadius: "4px",
    padding: "32px",
    marginTop: "24px",
    maxWidth: "800px",
  },
  mockupHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "24px",
  },
  mockBadge: {
    backgroundColor: "var(--cobalt-blue)",
    color: "#fff",
    fontSize: "0.7rem",
    fontWeight: "700",
    padding: "4px 8px",
    borderRadius: "2px",
    letterSpacing: "0.08em",
  },
  mockProgramName: {
    fontSize: "1.4rem",
    fontWeight: "700",
    fontFamily: "'Sora', sans-serif",
    marginTop: "8px",
    color: "#fff",
  },
  mockUniName: {
    fontSize: "0.85rem",
    color: "var(--muted-slate)",
    display: "block",
    marginTop: "4px",
  },
  mockDegree: {
    border: "1px solid rgba(255, 255, 255, 0.2)",
    color: "var(--muted-slate)",
    fontSize: "0.75rem",
    padding: "4px 8px",
    borderRadius: "2px",
  },
  mockTableContainer: {
    width: "100%",
  },
  mockTable: {
    width: "100%",
    borderCollapse: "collapse",
  },
  mockTh: {
    borderBottom: "2px solid rgba(255,255,255,0.2)",
    padding: "8px 0",
    fontSize: "0.8rem",
    color: "var(--muted-slate)",
    textAlign: "left",
  },
  mockTd: {
    borderBottom: "1px solid rgba(255,255,255,0.1)",
    padding: "12px 0",
    fontSize: "0.95rem",
    color: "#fff",
  },
  timelineGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "24px",
  },
  timelineCard: {
    padding: "24px",
    backgroundColor: "var(--bg-secondary)",
    border: "1.5px solid var(--border)",
    borderRadius: "4px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  timelineNumber: {
    fontFamily: "monospace",
    fontSize: "1.5rem",
    fontWeight: "700",
    color: "var(--primary)",
  },
  timelineTitle: {
    fontSize: "1.1rem",
    fontWeight: "700",
    fontFamily: "'Sora', sans-serif",
    color: "var(--ink-navy)",
  },
  timelineDesc: {
    fontSize: "0.9rem",
    color: "var(--text-secondary)",
    lineHeight: "1.5",
  },
  principlesContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "40px",
  },
  principleRow: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "48px",
    alignItems: "center",
  },
  principleRowReverse: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "48px",
    alignItems: "center",
    direction: "rtl",
  },
  principleText: {
    direction: "ltr",
  },
  principleTitle: {
    fontSize: "1.8rem",
    fontWeight: "800",
    fontFamily: "'Sora', sans-serif",
    color: "var(--ink-navy)",
    marginBottom: "12px",
  },
  principleDesc: {
    fontSize: "1rem",
    color: "var(--text-secondary)",
    lineHeight: "1.6",
  },
  principlePhotoMock1: {
    height: "280px",
    backgroundColor: "rgba(21, 34, 56, 0.08)",
    border: "1.5px solid var(--ink-navy)",
    borderRadius: "4px",
  },
  principlePhotoMock2: {
    height: "280px",
    backgroundColor: "rgba(21, 34, 56, 0.08)",
    border: "1.5px solid var(--ink-navy)",
    borderRadius: "4px",
  },
  statsSection: {
    padding: "80px 0",
    textAlign: "center",
  },
  statsInner: {
    maxWidth: "600px",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    alignItems: "center",
  },
  giantStat: {
    fontSize: "8rem",
    fontWeight: "800",
    fontFamily: "'Sora', sans-serif",
    lineHeight: "0.9",
    color: "var(--cobalt-blue)",
    letterSpacing: "-0.04em",
  },
  statsTitle: {
    fontSize: "1.8rem",
    fontWeight: "700",
    color: "var(--ink-navy)",
  },
  statsDesc: {
    fontSize: "1.1rem",
    color: "var(--text-secondary)",
    lineHeight: "1.6",
  },
  faqList: {
    display: "flex",
    flexDirection: "column",
  },
  faqItem: {
    borderBottom: "1.5px solid var(--border)",
  },
  faqHeader: {
    width: "100%",
    padding: "24px 0",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "transparent",
    border: "none",
    cursor: "pointer",
    textAlign: "left",
  },
  faqQuestion: {
    fontSize: "1.2rem",
    fontWeight: "700",
    fontFamily: "'Sora', sans-serif",
    color: "var(--ink-navy)",
  },
  faqToggleSymbol: {
    fontSize: "1.5rem",
    fontWeight: "400",
    color: "var(--muted-slate)",
  },
  faqBody: {
    paddingBottom: "24px",
  },
  faqAnswer: {
    fontFamily: "'Source Serif 4', Georgia, serif",
    fontSize: "1.1rem",
    color: "var(--ink-navy)",
    lineHeight: "1.6",
  },
  finalCtaSection: {
    backgroundColor: "var(--cobalt-blue)",
    color: "#fff",
    padding: "80px 40px",
    borderRadius: "4px",
    textAlign: "center",
  },
  finalCtaContent: {
    maxWidth: "600px",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    gap: "24px",
    alignItems: "center",
  },
  finalCtaTitle: {
    fontSize: "3rem",
    fontWeight: "800",
    fontFamily: "'Sora', sans-serif",
    lineHeight: "1.1",
    color: "#fff",
  },
  finalCtaDesc: {
    fontSize: "1.1rem",
    color: "rgba(255,255,255,0.8)",
    lineHeight: "1.6",
  },
  finalCtaBtn: {
    borderRadius: "4px",
    padding: "16px 36px",
    fontSize: "1.1rem",
    backgroundColor: "#fff",
    color: "var(--cobalt-blue)",
    fontWeight: "700",
    border: "none",
  },
  disclaimerBox: {
    padding: "0",
    backgroundColor: "transparent",
    border: "none",
  },
  disclaimerText: {
    fontSize: "0.8rem",
    color: "var(--muted-slate)",
    lineHeight: "1.4",
  },
  footer: {
    borderTop: "2px solid var(--border)",
    padding: "40px 40px",
    backgroundColor: "var(--soft-white)",
  },
  footerInner: {
    maxWidth: "1200px",
    margin: "0 auto",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "16px",
    fontSize: "0.85rem",
    color: "var(--muted-slate)",
  },
  footerLinks: {
    display: "flex",
    gap: "24px",
  },
  footerLink: {
    color: "var(--muted-slate)",
    textDecoration: "underline",
  },
};
