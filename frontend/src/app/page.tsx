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
      {/* 1. minimal editorial header */}
      <header style={styles.navbar}>
        <div style={styles.navLeft}>
          <div style={styles.logoContainer}>
            <div style={styles.logoPin}>📍</div>
            <div>
              <div style={styles.logoText}>CAMPUS INSIDER</div>
              <div style={styles.logoSubtext}>Study in Türkiye with clarity.</div>
            </div>
          </div>
        </div>
        <nav style={styles.navCenter}>
          <button onClick={() => scrollToSection("process-section")} style={styles.navLink}>How It Works</button>
          <button onClick={() => scrollToSection("stats-section")} style={styles.navLink}>Explore Programs</button>
          <button onClick={() => scrollToSection("about-section")} style={styles.navLink}>About Abdullah</button>
        </nav>
        <div style={styles.navRight}>
          <button onClick={handleStartWizard} style={styles.navCta}>Find My Options</button>
        </div>
      </header>

      {/* Main Body */}
      <div style={styles.bodyWrapper}>
        {!resultsData ? (
          <div style={styles.pageContent}>
            
            {/* 2. Asymmetrical hero with real photography */}
            <section style={styles.heroSection}>
              <div style={styles.heroGrid}>
                {/* Left Text */}
                <div style={styles.heroTextCol}>
                  <h1 style={styles.heroTitle}>
                    Find university options that fit <span style={styles.heroTitleAccent}>your life.</span>
                  </h1>
                  <p style={styles.heroSubtitle}>
                    Verified tuition, programs, and honest guidance for international students in Türkiye.
                  </p>

                  <div style={styles.heroCtaRow}>
                    <button onClick={handleStartWizard} style={styles.heroPrimaryBtn}>
                      Find My University Options
                    </button>
                    <button onClick={() => scrollToSection("process-section")} style={styles.heroSecondaryBtn}>
                      See how it works →
                    </button>
                  </div>

                  {/* Student Avatars and Trust badge */}
                  <div style={styles.trustBadgeRow}>
                    <div style={styles.avatarRow}>
                      <span style={{ ...styles.avatarDot, backgroundColor: "#d1d5db" }}>👨‍🎓</span>
                      <span style={{ ...styles.avatarDot, backgroundColor: "#9ca3af", marginLeft: "-8px" }}>👩‍🎓</span>
                      <span style={{ ...styles.avatarDot, backgroundColor: "#6b7280", marginLeft: "-8px" }}>👨‍💻</span>
                      <span style={{ ...styles.avatarDot, backgroundColor: "#4b5563", marginLeft: "-8px" }}>👩‍💻</span>
                    </div>
                    <div style={styles.trustStarsCol}>
                      <div style={styles.starsRow}>★★★★★</div>
                      <div style={styles.trustText}>Trusted by students from 40+ countries</div>
                    </div>
                  </div>
                </div>

                {/* Right Image Block */}
                <div style={styles.heroImageCol}>
                  <div style={styles.heroImageFrame}>
                    {/* Floating Data Sync Badge */}
                    <div style={styles.dataSyncBadge}>
                      <div style={styles.pulseContainer}>
                        <span className="pulse-dot"></span>
                        <span style={styles.syncBadgeTitle}>LIVE DATA SYNC</span>
                      </div>
                      <div style={styles.syncBadgeSubtitle}>Programs & tuition updated daily</div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 3. Three Traps Section */}
            <section style={styles.trapsSection}>
              <div style={styles.trapsGrid}>
                {/* Left title */}
                <div style={styles.trapsTitleCol}>
                  <span style={styles.giantTrapNumber}>3</span>
                  <h2 style={styles.trapsHeading}>traps most students face</h2>
                </div>

                {/* Traps columns */}
                <div style={styles.trapsContentCol}>
                  <div style={styles.trapItem}>
                    <span style={styles.trapItemNum}>01</span>
                    <div style={styles.trapItemBody}>
                      <h4 style={styles.trapItemTitle}>Hidden costs</h4>
                      <p style={styles.trapItemDesc}>Prep-school fees and installment differences are often not explained clearly.</p>
                    </div>
                  </div>
                  <div style={styles.trapItem}>
                    <span style={styles.trapItemNum}>02</span>
                    <div style={styles.trapItemBody}>
                      <h4 style={styles.trapItemTitle}>Biased recommendations</h4>
                      <p style={styles.trapItemDesc}>Some agencies prioritize commission rather than student fit.</p>
                    </div>
                  </div>
                  <div style={styles.trapItem}>
                    <span style={styles.trapItemNum}>03</span>
                    <div style={styles.trapItemBody}>
                      <h4 style={styles.trapItemTitle}>Misleading rankings</h4>
                      <p style={styles.trapItemDesc}>A familiar name does not always mean the best option for your degree or budget.</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 4. Abdullah Story Section */}
            <section id="about-section" style={styles.storySection}>
              <div style={styles.storyGrid}>
                {/* Left: Rounded Image */}
                <div style={styles.storyPhotoCol}>
                  <div style={styles.storyPhotoCircle} />
                </div>

                {/* Center: Quote & Bio */}
                <div style={styles.storyTextCol}>
                  <span style={styles.storyQuoteIcon}>“</span>
                  <h3 style={styles.storyQuoteHeading}>
                    I built Campus Insider because I wanted the information I did not have when I first arrived.
                  </h3>
                  <p style={styles.storyParagraph}>
                    As an international student in Türkiye, I know how confusing it can be to choose the right university. That's why I built Campus Insider—to give you transparent information and personal guidance, so you can make confident decisions.
                  </p>
                  <div style={styles.storySignature}>Abdullah Makashen</div>
                  <div style={styles.storySubtitleLabel}>Computer Engineering Student</div>
                  <div style={styles.storySubtitleLabel}>Istanbul, Türkiye</div>
                </div>

                {/* Right: Key Facts Container */}
                <div style={styles.storyFactsCol}>
                  <div style={styles.factsCard}>
                    <div style={styles.factItem}>
                      <span style={styles.factIcon}>🎓</span>
                      <div>
                        <div style={styles.factLabel}>Studying in Istanbul</div>
                        <div style={styles.factValue}>Computer Engineering</div>
                      </div>
                    </div>
                    <div style={styles.factItem}>
                      <span style={styles.factIcon}>👥</span>
                      <div>
                        <div style={styles.factLabel}>Helping students from</div>
                        <div style={styles.factValue}>40+ countries</div>
                      </div>
                    </div>
                    <div style={styles.factItem}>
                      <span style={styles.factIcon}>❤️</span>
                      <div>
                        <div style={styles.factLabel}>Independent advice</div>
                        <div style={styles.factValue}>Not affiliated with any university</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 5. Product Preview Section */}
            <section style={styles.previewSection}>
              <div style={styles.previewGrid}>
                {/* Left content list */}
                <div style={styles.previewTextCol}>
                  <span style={styles.previewLabel}>SEE IT IN ACTION</span>
                  <h2 style={styles.previewHeading}>Your journey, made <span style={styles.previewHeadingAccent}>simple.</span></h2>

                  <div style={styles.previewList}>
                    <div style={styles.previewListItem}>
                      <span style={styles.previewListIcon}>👤</span>
                      <div>
                        <h4 style={styles.previewListTitle}>Your profile</h4>
                        <p style={styles.previewListDesc}>We understand your goals</p>
                      </div>
                    </div>
                    <div style={styles.previewListItem}>
                      <span style={styles.previewListIcon}>🔀</span>
                      <div>
                        <h4 style={styles.previewListTitle}>Matched programs</h4>
                        <p style={styles.previewListDesc}>We filter thousands of options</p>
                      </div>
                    </div>
                    <div style={styles.previewListItem}>
                      <span style={styles.previewListIcon}>📋</span>
                      <div>
                        <h4 style={styles.previewListTitle}>Transparent tuition</h4>
                        <p style={styles.previewListDesc}>Cash, installment & prep fees</p>
                      </div>
                    </div>
                    <div style={styles.previewListItem}>
                      <span style={styles.previewListIcon}>💬</span>
                      <div>
                        <h4 style={styles.previewListTitle}>Personal explanation</h4>
                        <p style={styles.previewListDesc}>Why each option fits you</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Mockup */}
                <div style={styles.previewMockupCol}>
                  <div style={styles.browserMockup}>
                    {/* Browser Header Bar */}
                    <div style={styles.browserHeader}>
                      <div style={styles.browserDotRow}>
                        <span style={{ ...styles.browserDot, backgroundColor: "#ef4444" }} />
                        <span style={{ ...styles.browserDot, backgroundColor: "#eab308" }} />
                        <span style={{ ...styles.browserDot, backgroundColor: "#22c55e" }} />
                      </div>
                    </div>
                    <div style={styles.browserContent}>
                      {/* Left: Active Question Step Mock */}
                      <div style={styles.mockWizardCol}>
                        <div style={styles.mockStepCounter}>Assessment // Step 2 of 5</div>
                        <h4 style={styles.mockStepQuestion}>What level are you applying for?</h4>
                        <div style={styles.mockOptionsList}>
                          <div style={styles.mockOption}>Associate Degree</div>
                          <div style={styles.mockOptionActive}>Bachelor's Degree</div>
                          <div style={styles.mockOption}>Master's Degree</div>
                          <div style={styles.mockOption}>PhD</div>
                        </div>
                        <div style={styles.mockFooter}>
                          <span style={styles.mockBackLink}>Back</span>
                          <button style={styles.mockContinueBtn}>Continue</button>
                        </div>
                      </div>
                      {/* Right: Matches Cards Mock */}
                      <div style={styles.mockResultsCol}>
                        <div style={styles.mockResultsHeader}>Your Recommended Options</div>
                        <div style={styles.mockCardDominant}>
                          <div>
                            <span style={styles.mockCardBadge}>Best Overall Match</span>
                            <h5 style={styles.mockCardTitle}>Computer Engineering</h5>
                            <span style={styles.mockCardUni}>Beykent University - Istanbul</span>
                          </div>
                          <div style={styles.mockCostBlock}>
                            <span style={styles.mockCostLabel}>Annual Tuition (USD)</span>
                            <span style={styles.mockCostPrice}>$2,700</span>
                          </div>
                          <div style={styles.mockTableFrame}>
                            <table style={styles.mockItemTable}>
                              <tbody>
                                <tr>
                                  <td style={styles.mockItemTd}>Cash Payment (Upfront)</td>
                                  <td style={{ ...styles.mockItemTd, textAlign: "right", fontWeight: 700 }}>$2,700</td>
                                </tr>
                                <tr>
                                  <td style={styles.mockItemTd}>Prep School Fee (First Year)</td>
                                  <td style={{ ...styles.mockItemTd, textAlign: "right" }}>$2,565</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <div style={styles.mockCardCtaRow}>
                            <button style={styles.mockDetailsBtn}>View Details</button>
                            <button style={styles.mockWhatsappBtn}>💬 Discuss with Abdullah</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 6. Timeline section */}
            <section id="process-section" style={styles.sectionBlock}>
              <h2 style={styles.timelineHeading}>How your recommendations are built</h2>
              <div style={styles.timelineGrid}>
                {/* Step 1 */}
                <div style={styles.timelineStep}>
                  <div style={styles.timelineHeaderRow}>
                    <span style={styles.timelineIcon}>👤</span>
                    <span style={styles.timelineStepNum}>01</span>
                  </div>
                  <h4 style={styles.timelineStepTitle}>Your goals</h4>
                  <p style={styles.timelineStepDesc}>We start with your preferences, budget, and study plans.</p>
                </div>
                {/* Step 2 */}
                <div style={styles.timelineStep}>
                  <div style={styles.timelineHeaderRow}>
                    <span style={styles.timelineIcon}> Funnel </span>
                    <span style={styles.timelineStepNum}>02</span>
                  </div>
                  <h4 style={styles.timelineStepTitle}>Program filtering</h4>
                  <p style={styles.timelineStepDesc}>We match you with programs that meet your academic criteria.</p>
                </div>
                {/* Step 3 */}
                <div style={styles.timelineStep}>
                  <div style={styles.timelineHeaderRow}>
                    <span style={styles.timelineIcon}>🛡️</span>
                    <span style={styles.timelineStepNum}>03</span>
                  </div>
                  <h4 style={styles.timelineStepTitle}>Fee verification</h4>
                  <p style={styles.timelineStepDesc}>We verify tuition, installments, and prep-school fees.</p>
                </div>
                {/* Step 4 */}
                <div style={styles.timelineStep}>
                  <div style={styles.timelineHeaderRow}>
                    <span style={styles.timelineIcon}>💬</span>
                    <span style={styles.timelineStepNum}>04</span>
                  </div>
                  <h4 style={styles.timelineStepTitle}>Personal review</h4>
                  <p style={styles.timelineStepDesc}>I personally review the results and explain the best fits.</p>
                </div>
              </div>
            </section>

            {/* 7. Stats split section */}
            <section id="stats-section" style={styles.sectionBlock}>
              <div style={styles.statsGrid}>
                {/* Left columns list */}
                <div style={styles.statsListCol}>
                  <div style={styles.statsListItem}>
                    <span style={styles.statsListIcon}>📋</span>
                    <div>
                      <h4 style={styles.statsListTitle}>Verified program data</h4>
                      <p style={styles.statsListDesc}>Built from synchronized university records</p>
                    </div>
                  </div>
                  <div style={styles.statsListItem}>
                    <span style={styles.statsListIcon}>💵</span>
                    <div>
                      <h4 style={styles.statsListTitle}>Transparent pricing</h4>
                      <p style={styles.statsListDesc}>Cash, installment & prep fees clearly shown</p>
                    </div>
                  </div>
                  <div style={styles.statsListItem}>
                    <span style={styles.statsListIcon}>🤝</span>
                    <div>
                      <h4 style={styles.statsListTitle}>Student-first guidance</h4>
                      <p style={styles.statsListDesc}>No pressure to choose—just honest advice</p>
                    </div>
                  </div>
                  <div style={styles.statsListItem}>
                    <span style={styles.statsListIcon}>✓</span>
                    <div>
                      <h4 style={styles.statsListTitle}>Free assessment</h4>
                      <p style={styles.statsListDesc}>Clear options before any application</p>
                    </div>
                  </div>
                </div>

                {/* Center Stat counter */}
                <div style={styles.statsCounterCol}>
                  <div style={styles.counterTitle}>7,695</div>
                  <div style={styles.counterSubtitle}>programs indexed</div>
                  <div style={styles.smallStatsRow}>
                    <div style={styles.smallStatBlock}>
                      <span style={styles.smallStatVal}>39</span>
                      <span style={styles.smallStatLabel}>Universities</span>
                    </div>
                    <div style={styles.smallStatBlock}>
                      <span style={styles.smallStatVal}>English</span>
                      <span style={styles.smallStatLabel}>& Turkish</span>
                    </div>
                    <div style={styles.smallStatBlock}>
                      <span style={styles.smallStatVal}>Associate</span>
                      <span style={styles.smallStatLabel}>to PhD</span>
                    </div>
                    <div style={styles.smallStatBlock}>
                      <span style={styles.smallStatVal}>Multiple</span>
                      <span style={styles.smallStatLabel}>Cities</span>
                    </div>
                  </div>
                </div>

                {/* Right photo */}
                <div style={styles.statsPhotoCol}>
                  <div style={styles.statsPhotoMock} />
                </div>
              </div>
            </section>

            {/* 8. FAQ & CTA section */}
            <section style={styles.faqCtaSection}>
              <div style={styles.faqCtaGrid}>
                {/* Left FAQ */}
                <div style={styles.faqCol}>
                  <h2 style={styles.faqHeading}>Frequently asked questions</h2>
                  <div style={styles.faqList}>
                    {[
                      {
                        q: "Is Campus Insider free to use?",
                        a: "Yes. Campus Insider is a free assessment tool. We do not charge students for finding programs or consulting with Abdullah."
                      },
                      {
                        q: "How do you keep the tuition data accurate?",
                        a: "We pull directly from synchronized admissions portal data. Tuition limits, currency conversions, and installment handling fees are updated daily."
                      },
                      {
                        q: "Can you guarantee admission?",
                        a: "While we verify that you meet the official criteria before matching you, final admissions approvals are decided directly by the university admissions boards."
                      },
                      {
                        q: "How do I contact Abdullah?",
                        a: "After completing your assessment, you will get a direct WhatsApp consult link that contains your specific reference ID and matching study blueprint."
                      }
                    ].map((faq, idx) => (
                      <div key={idx} style={styles.faqItem}>
                        <button style={styles.faqBtn} onClick={() => toggleFaq(idx)}>
                          <span style={styles.faqItemQuestion}>{faq.q}</span>
                          <span style={styles.faqSymbol}>{activeFaq === idx ? "−" : "+"}</span>
                        </button>
                        {activeFaq === idx && (
                          <div style={styles.faqAnswerContainer}>
                            <p style={styles.faqAnswerText}>{faq.a}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <button onClick={() => scrollToSection("process-section")} style={styles.viewAllFaqBtn}>
                    View all questions →
                  </button>
                </div>

                {/* Right CTA Container Card */}
                <div style={styles.ctaCardCol}>
                  <div style={styles.ctaCard}>
                    <div style={styles.ctaCardTextContent}>
                      <h3 style={styles.ctaCardTitle}>You don't have to choose a university alone.</h3>
                      <p style={styles.ctaCardDesc}>
                        Answer a few questions and get personalized university options based on your real priorities.
                      </p>
                      <button onClick={handleStartWizard} style={styles.ctaCardBtn}>
                        Find My University Options
                      </button>
                      <div style={styles.ctaCardAvatarsRow}>
                        <div style={styles.avatarRow}>
                          <span style={{ ...styles.avatarDot, backgroundColor: "#fff", color: "#152238" }}>👨‍🎓</span>
                          <span style={{ ...styles.avatarDot, backgroundColor: "#e2e8f0", marginLeft: "-8px" }}>👩‍🎓</span>
                          <span style={{ ...styles.avatarDot, backgroundColor: "#cbd5e1", marginLeft: "-8px" }}>👨‍💻</span>
                        </div>
                        <span style={styles.ctaCardAvatarsText}>Join hundreds of students who started their journey today</span>
                      </div>
                    </div>
                    {/* Galata outline vector container */}
                    <div style={styles.galataGraphicsContainer}>
                      <div style={styles.galataTowerGraphic} />
                    </div>
                  </div>
                </div>
              </div>
            </section>

          </div>
        ) : (
          /* Results Display View */
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

      {/* Footer */}
      <footer style={styles.footer}>
        <p>© {new Date().getFullYear()} Campus Insider. Built independently for international student wayfinding.</p>
        <div>
          <Link href="/privacy" style={styles.footerLink}>Privacy Policy</Link>
        </div>
      </footer>
    </main>
  );
}

// Visual styles mapped precisely to the uploaded Concept Image layout
const styles: { [key: string]: React.CSSProperties } = {
  main: {
    backgroundColor: "var(--soft-white)", /* Soft White paper backdrop */
    minHeight: "100vh",
    color: "var(--ink-navy)",
    fontFamily: "'Inter', sans-serif",
  },
  navbar: {
    width: "100%",
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "24px 40px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  navLeft: {
    display: "flex",
    alignItems: "center",
  },
  logoContainer: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  logoPin: {
    fontSize: "2rem",
    color: "var(--cobalt-blue)",
  },
  logoText: {
    fontFamily: "'Sora', sans-serif",
    fontWeight: "800",
    fontSize: "1.2rem",
    color: "var(--ink-navy)",
    letterSpacing: "0.02em",
  },
  logoSubtext: {
    fontSize: "0.75rem",
    color: "var(--muted-slate)",
  },
  navCenter: {
    display: "flex",
    gap: "32px",
  },
  navLink: {
    background: "transparent",
    border: "none",
    fontFamily: "'Inter', sans-serif",
    fontWeight: "600",
    fontSize: "0.95rem",
    color: "var(--ink-navy)",
    cursor: "pointer",
    transition: "color 0.2s ease",
  },
  navRight: {},
  navCta: {
    backgroundColor: "var(--cobalt-blue)",
    color: "#fff",
    border: "none",
    borderRadius: "9999px",
    padding: "12px 28px",
    fontWeight: "700",
    fontSize: "0.95rem",
    cursor: "pointer",
  },
  bodyWrapper: {
    width: "100%",
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "20px 40px 100px 40px",
  },
  pageContent: {
    display: "flex",
    flexDirection: "column",
    gap: "96px",
  },
  heroSection: {
    padding: "40px 0 20px 0",
  },
  heroGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "60px",
    alignItems: "center",
  },
  heroTextCol: {
    display: "flex",
    flexDirection: "column",
    gap: "32px",
  },
  heroTitle: {
    fontSize: "4.8rem",
    fontWeight: "800",
    fontFamily: "'Sora', sans-serif",
    lineHeight: "1.05",
    color: "var(--ink-navy)",
    letterSpacing: "-0.04em",
  },
  heroTitleAccent: {
    color: "var(--terracotta)",
  },
  heroSubtitle: {
    fontSize: "1.2rem",
    lineHeight: "1.65",
    color: "var(--muted-slate)",
    maxWidth: "460px",
  },
  heroCtaRow: {
    display: "flex",
    alignItems: "center",
    gap: "24px",
    flexWrap: "wrap",
  },
  heroPrimaryBtn: {
    backgroundColor: "var(--cobalt-blue)",
    color: "#fff",
    border: "none",
    borderRadius: "9999px",
    padding: "16px 36px",
    fontWeight: "700",
    fontSize: "1rem",
    cursor: "pointer",
    boxShadow: "0 6px 20px rgba(49, 87, 213, 0.15)",
  },
  heroSecondaryBtn: {
    background: "transparent",
    border: "none",
    color: "var(--cobalt-blue)",
    fontWeight: "700",
    fontSize: "1rem",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
  },
  trustBadgeRow: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  avatarRow: {
    display: "flex",
    alignItems: "center",
  },
  avatarDot: {
    width: "36px",
    height: "36px",
    borderRadius: "9999px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "2px solid #fff",
    fontSize: "1.1rem",
  },
  trustStarsCol: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  starsRow: {
    color: "#f59e0b",
    fontSize: "1.1rem",
    letterSpacing: "0.1em",
  },
  trustText: {
    fontSize: "0.85rem",
    color: "var(--muted-slate)",
    fontWeight: "500",
  },
  heroImageCol: {},
  heroImageFrame: {
    width: "100%",
    height: "480px",
    backgroundColor: "rgba(21, 34, 56, 0.08)", /* Mock Istanbul student image representation */
    borderRadius: "4px",
    border: "2px solid var(--ink-navy)",
    position: "relative",
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "flex-end",
    padding: "24px",
  },
  dataSyncBadge: {
    backgroundColor: "var(--ink-navy)",
    color: "#fff",
    padding: "16px 20px",
    borderRadius: "4px",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    boxShadow: "0 10px 30px rgba(21, 34, 56, 0.15)",
  },
  pulseContainer: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  syncBadgeTitle: {
    fontSize: "0.75rem",
    fontWeight: "800",
    letterSpacing: "0.08em",
    color: "var(--accent-teal)",
  },
  syncBadgeSubtitle: {
    fontSize: "0.75rem",
    color: "var(--muted-slate)",
  },
  trapsSection: {
    padding: "20px 0",
  },
  trapsGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 2fr",
    gap: "48px",
    alignItems: "flex-start",
  },
  trapsTitleCol: {
    display: "flex",
    alignItems: "center",
    gap: "24px",
  },
  giantTrapNumber: {
    fontFamily: "'Source Serif 4', Georgia, serif",
    fontSize: "8.5rem",
    fontWeight: "600",
    color: "var(--terracotta)",
    lineHeight: "0.7",
  },
  trapsHeading: {
    fontFamily: "'Sora', sans-serif",
    fontSize: "2.8rem",
    fontWeight: "800",
    lineHeight: "1.15",
    maxWidth: "240px",
  },
  trapsContentCol: {
    display: "flex",
    flexDirection: "column",
    gap: "32px",
  },
  trapItem: {
    display: "flex",
    gap: "24px",
  },
  trapItemNum: {
    fontFamily: "monospace",
    fontSize: "1.2rem",
    fontWeight: "800",
    color: "var(--terracotta)",
    marginTop: "4px",
  },
  trapItemBody: {},
  trapItemTitle: {
    fontSize: "1.2rem",
    fontWeight: "700",
    fontFamily: "'Sora', sans-serif",
    marginBottom: "6px",
  },
  trapItemDesc: {
    fontSize: "1rem",
    color: "var(--muted-slate)",
    lineHeight: "1.5",
  },
  storySection: {
    padding: "20px 0",
  },
  storyGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1.5fr 1fr",
    gap: "40px",
    alignItems: "center",
  },
  storyPhotoCol: {},
  storyPhotoCircle: {
    width: "280px",
    height: "280px",
    borderRadius: "9999px",
    backgroundColor: "rgba(21, 34, 56, 0.08)", /* Mock portrait representation */
    border: "2px solid var(--ink-navy)",
  },
  storyTextCol: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  storyQuoteIcon: {
    fontFamily: "Georgia, serif",
    fontSize: "4.5rem",
    lineHeight: "0.5",
    color: "var(--terracotta)",
  },
  storyQuoteHeading: {
    fontFamily: "'Sora', sans-serif",
    fontSize: "1.8rem",
    fontWeight: "800",
    lineHeight: "1.35",
  },
  storyParagraph: {
    fontSize: "1rem",
    color: "var(--muted-slate)",
    lineHeight: "1.6",
  },
  storySignature: {
    fontFamily: "'Source Serif 4', Georgia, serif",
    fontSize: "1.6rem",
    fontStyle: "italic",
    fontWeight: "600",
    marginTop: "12px",
  },
  storySubtitleLabel: {
    fontSize: "0.85rem",
    color: "var(--muted-slate)",
    fontWeight: "500",
  },
  storyFactsCol: {},
  factsCard: {
    backgroundColor: "var(--warm-sand)",
    border: "1.5px solid var(--border)",
    borderRadius: "4px",
    padding: "32px",
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },
  factItem: {
    display: "flex",
    gap: "16px",
    alignItems: "flex-start",
  },
  factIcon: {
    fontSize: "1.5rem",
  },
  factLabel: {
    fontSize: "0.8rem",
    color: "var(--muted-slate)",
    fontWeight: "600",
  },
  factValue: {
    fontSize: "0.95rem",
    fontWeight: "700",
    color: "var(--ink-navy)",
  },
  previewSection: {
    backgroundColor: "var(--ink-navy)",
    color: "#fff",
    padding: "80px 40px",
    borderRadius: "4px",
    margin: "0 -40px",
  },
  previewGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1.8fr",
    gap: "60px",
    alignItems: "center",
    maxWidth: "1120px",
    margin: "0 auto",
  },
  previewTextCol: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },
  previewLabel: {
    fontFamily: "monospace",
    fontSize: "0.75rem",
    color: "var(--muted-slate)",
    letterSpacing: "0.08em",
  },
  previewHeading: {
    fontFamily: "'Sora', sans-serif",
    fontSize: "3.2rem",
    fontWeight: "800",
    color: "#fff",
  },
  previewHeadingAccent: {
    color: "var(--terracotta)",
  },
  previewList: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },
  previewListItem: {
    display: "flex",
    gap: "16px",
    alignItems: "flex-start",
  },
  previewListIcon: {
    fontSize: "1.3rem",
    color: "var(--terracotta)",
  },
  previewListTitle: {
    fontSize: "1.1rem",
    fontWeight: "700",
    color: "#fff",
  },
  previewListDesc: {
    fontSize: "0.9rem",
    color: "var(--muted-slate)",
  },
  previewMockupCol: {},
  browserMockup: {
    backgroundColor: "#fff",
    borderRadius: "4px",
    border: "2px solid rgba(255,255,255,0.15)",
    overflow: "hidden",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
  },
  browserHeader: {
    height: "36px",
    backgroundColor: "#f3f4f6",
    display: "flex",
    alignItems: "center",
    padding: "0 16px",
    borderBottom: "1px solid #e5e7eb",
  },
  browserDotRow: {
    display: "flex",
    gap: "6px",
  },
  browserDot: {
    width: "10px",
    height: "10px",
    borderRadius: "9999px",
  },
  browserContent: {
    display: "grid",
    gridTemplateColumns: "1fr 1.2fr",
    height: "440px",
    backgroundColor: "var(--bg-secondary)",
  },
  mockWizardCol: {
    borderRight: "1px solid var(--border)",
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  mockStepCounter: {
    fontFamily: "monospace",
    fontSize: "0.7rem",
    color: "var(--muted-slate)",
  },
  mockStepQuestion: {
    fontFamily: "'Sora', sans-serif",
    fontSize: "1.25rem",
    fontWeight: "700",
    color: "var(--ink-navy)",
  },
  mockOptionsList: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    flex: 1,
  },
  mockOption: {
    padding: "10px 14px",
    backgroundColor: "var(--soft-white)",
    border: "1px solid var(--border)",
    borderRadius: "4px",
    fontSize: "0.85rem",
    color: "var(--ink-navy)",
  },
  mockOptionActive: {
    padding: "10px 14px",
    backgroundColor: "var(--cobalt-blue)",
    border: "1.5px solid var(--cobalt-blue)",
    borderRadius: "4px",
    fontSize: "0.85rem",
    color: "#fff",
    fontWeight: "700",
  },
  mockFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  mockBackLink: {
    fontSize: "0.85rem",
    color: "var(--muted-slate)",
    cursor: "pointer",
  },
  mockContinueBtn: {
    backgroundColor: "var(--cobalt-blue)",
    color: "#fff",
    border: "none",
    borderRadius: "9999px",
    padding: "8px 18px",
    fontSize: "0.85rem",
    fontWeight: "700",
  },
  mockResultsCol: {
    padding: "24px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  mockResultsHeader: {
    fontSize: "0.85rem",
    fontWeight: "800",
    color: "var(--muted-slate)",
  },
  mockCardDominant: {
    backgroundColor: "var(--soft-white)",
    border: "2px solid var(--cobalt-blue)",
    borderRadius: "4px",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  mockCardBadge: {
    backgroundColor: "var(--terracotta)",
    color: "#fff",
    fontSize: "0.65rem",
    padding: "2px 6px",
    borderRadius: "2px",
    fontWeight: "700",
  },
  mockCardTitle: {
    fontSize: "1.1rem",
    fontWeight: "800",
    fontFamily: "'Sora', sans-serif",
    marginTop: "6px",
  },
  mockCardUni: {
    fontSize: "0.75rem",
    color: "var(--muted-slate)",
  },
  mockCostBlock: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  mockCostLabel: {
    fontSize: "0.75rem",
    color: "var(--muted-slate)",
  },
  mockCostPrice: {
    fontSize: "1.4rem",
    fontWeight: "800",
    color: "var(--cobalt-blue)",
  },
  mockTableFrame: {
    borderTop: "1px solid var(--border)",
    paddingTop: "8px",
  },
  mockItemTable: {
    width: "100%",
  },
  mockItemTd: {
    fontSize: "0.75rem",
    padding: "4px 0",
    color: "var(--ink-navy)",
  },
  mockCardCtaRow: {
    display: "flex",
    gap: "8px",
    marginTop: "8px",
  },
  mockDetailsBtn: {
    flex: 1,
    padding: "8px",
    fontSize: "0.75rem",
    border: "1px solid var(--border)",
    background: "transparent",
    borderRadius: "4px",
  },
  mockWhatsappBtn: {
    flex: 1.5,
    padding: "8px",
    fontSize: "0.75rem",
    border: "none",
    backgroundColor: "rgba(22, 139, 131, 0.08)",
    color: "var(--accent-teal)",
    borderRadius: "4px",
    fontWeight: "700",
  },
  timelineHeading: {
    fontSize: "2.4rem",
    fontWeight: "800",
    fontFamily: "'Sora', sans-serif",
    textAlign: "center",
    marginBottom: "24px",
  },
  timelineStep: {
    padding: "24px",
    backgroundColor: "var(--soft-white)",
    border: "1.5px solid var(--border)",
    borderRadius: "4px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  timelineHeaderRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  timelineStepNum: {
    fontSize: "1.2rem",
    fontWeight: "800",
    color: "var(--muted-slate)",
    fontFamily: "monospace",
  },
  timelineStepTitle: {
    fontSize: "1.2rem",
    fontWeight: "700",
    fontFamily: "'Sora', sans-serif",
    color: "var(--ink-navy)",
  },
  timelineStepDesc: {
    fontSize: "0.9rem",
    color: "var(--muted-slate)",
    lineHeight: "1.5",
  },
  sectionBlock: {
    display: "flex",
    flexDirection: "column",
    gap: "40px",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: "40px",
    alignItems: "center",
  },
  statsListCol: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },
  statsListItem: {
    display: "flex",
    gap: "16px",
    alignItems: "flex-start",
  },
  statsListIcon: {
    fontSize: "1.3rem",
    color: "var(--cobalt-blue)",
  },
  statsListTitle: {
    fontSize: "1.1rem",
    fontWeight: "700",
    color: "var(--ink-navy)",
  },
  statsListDesc: {
    fontSize: "0.9rem",
    color: "var(--muted-slate)",
  },
  statsCounterCol: {
    textAlign: "center",
    borderLeft: "1.5px solid var(--border)",
    borderRight: "1.5px solid var(--border)",
    padding: "0 24px",
  },
  counterTitle: {
    fontSize: "6.5rem",
    fontWeight: "800",
    fontFamily: "'Sora', sans-serif",
    color: "var(--ink-navy)",
    lineHeight: "0.95",
  },
  counterSubtitle: {
    fontSize: "1.2rem",
    color: "var(--terracotta)",
    fontWeight: "700",
    marginBottom: "32px",
  },
  smallStatsRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",
    textAlign: "left",
  },
  smallStatBlock: {
    display: "flex",
    flexDirection: "column",
  },
  smallStatVal: {
    fontSize: "1.05rem",
    fontWeight: "700",
    color: "var(--ink-navy)",
  },
  smallStatLabel: {
    fontSize: "0.75rem",
    color: "var(--muted-slate)",
  },
  statsPhotoCol: {},
  statsPhotoMock: {
    height: "280px",
    backgroundColor: "rgba(21, 34, 56, 0.08)", /* Mock Istanbul waterfront representation */
    border: "2px solid var(--ink-navy)",
    borderRadius: "4px",
  },
  faqCtaSection: {
    padding: "20px 0",
  },
  faqCtaGrid: {
    display: "grid",
    gridTemplateColumns: "1.2fr 1.8fr",
    gap: "60px",
    alignItems: "flex-start",
  },
  faqCol: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },
  faqHeading: {
    fontSize: "2.4rem",
    fontWeight: "800",
    fontFamily: "'Sora', sans-serif",
  },
  faqBtn: {
    width: "100%",
    padding: "20px 0",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "transparent",
    border: "none",
    cursor: "pointer",
    textAlign: "left",
  },
  faqItemQuestion: {
    fontSize: "1.1rem",
    fontWeight: "700",
    fontFamily: "'Sora', sans-serif",
    color: "var(--ink-navy)",
  },
  faqSymbol: {
    fontSize: "1.4rem",
    color: "var(--muted-slate)",
  },
  faqAnswerContainer: {
    paddingBottom: "20px",
  },
  faqAnswerText: {
    fontSize: "0.95rem",
    color: "var(--muted-slate)",
    lineHeight: "1.5",
  },
  viewAllFaqBtn: {
    background: "transparent",
    border: "none",
    color: "var(--cobalt-blue)",
    fontWeight: "700",
    fontSize: "0.95rem",
    cursor: "pointer",
    textAlign: "left",
    alignSelf: "flex-start",
  },
  ctaCardCol: {},
  ctaCard: {
    backgroundColor: "var(--cobalt-blue)",
    borderRadius: "4px",
    padding: "48px",
    color: "#fff",
    position: "relative",
    overflow: "hidden",
    display: "grid",
    gridTemplateColumns: "1.5fr 1fr",
    gap: "24px",
    alignItems: "center",
  },
  ctaCardTextContent: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    zIndex: 2,
  },
  ctaCardTitle: {
    fontSize: "2.2rem",
    fontWeight: "800",
    fontFamily: "'Sora', sans-serif",
    lineHeight: "1.15",
  },
  ctaCardDesc: {
    fontSize: "1rem",
    color: "rgba(255,255,255,0.8)",
    lineHeight: "1.5",
  },
  ctaCardBtn: {
    backgroundColor: "#fff",
    color: "var(--cobalt-blue)",
    border: "none",
    borderRadius: "9999px",
    padding: "14px 28px",
    fontWeight: "700",
    fontSize: "0.95rem",
    cursor: "pointer",
    alignSelf: "flex-start",
  },
  ctaCardAvatarsRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginTop: "8px",
  },
  ctaCardAvatarsText: {
    fontSize: "0.75rem",
    color: "rgba(255,255,255,0.7)",
  },
  galataGraphicsContainer: {
    display: "flex",
    justifyContent: "flex-end",
    zIndex: 1,
  },
  galataTowerGraphic: {
    width: "120px",
    height: "260px",
    backgroundColor: "rgba(255,255,255,0.06)", /* Galata outline illustration box representation */
    borderRadius: "2px",
  },
  footer: {
    borderTop: "2px solid var(--border)",
    padding: "40px 40px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "transparent",
    fontSize: "0.85rem",
    color: "var(--muted-slate)",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  footerLink: {
    color: "var(--muted-slate)",
    textDecoration: "underline",
  },
};
