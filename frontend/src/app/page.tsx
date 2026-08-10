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
  const [activeFaq, setActiveFaq] = useState<number | null>(0); /* Default first item open for instant visual demonstration */

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

  const faqData = [
    {
      q: "Is Campus Insider free to use?",
      a: "Yes, the program assessment and recommendation generator are 100% free for students."
    },
    {
      q: "How accurate are the tuition figures?",
      a: "Tuition figures, cash discounts, and prep-school fees are synchronized daily directly from verified university admissions records."
    },
    {
      q: "Are you an education agency?",
      a: "No. Campus Insider is an independent wayfinding platform built by an international student to provide unbiased guidance and clear options without agency markup or hidden commissions."
    },
    {
      q: "What happens after I complete the assessment?",
      a: "You receive an immediate tailored breakdown of your top matching universities with program details, cash vs. installment tuition, and direct access to connect with Abdullah on WhatsApp."
    }
  ];

  return (
    <main style={styles.main}>
      {/* 1. Navbar */}
      <header style={styles.navbar}>
        <div style={styles.navLeft}>
          <div style={styles.logoContainer}>
            <span style={styles.logoIcon}>📍</span>
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

      {!resultsData ? (
        <div style={styles.pageContent}>
          
          {/* 2. Hero Section */}
          <section style={styles.heroSection}>
            <div style={styles.heroGrid}>
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

                <div style={styles.trustBadgeRow}>
                  <div style={styles.avatarRow}>
                    <span style={{ ...styles.avatarDot, backgroundColor: "#d1d5db" }}>👨‍🎓</span>
                    <span style={{ ...styles.avatarDot, backgroundColor: "#9ca3af", marginLeft: "-8px" }}>👩‍🎓</span>
                    <span style={{ ...styles.avatarDot, backgroundColor: "#6b7280", marginLeft: "-8px" }}>👨‍💻</span>
                    <span style={{ ...styles.avatarDot, backgroundColor: "#4b5563", marginLeft: "-8px" }}>👩‍💻</span>
                  </div>
                  <div style={styles.trustStarsCol}>
                    <span style={styles.starsRow}>★★★★★</span>
                    <span style={styles.trustText}>Trusted by students from 40+ countries</span>
                  </div>
                </div>
              </div>

              <div style={styles.heroImageCol}>
                <img 
                  src="/istanbul_hero_student.png" 
                  alt="Student looking at mosque" 
                  style={styles.heroImage}
                />
                <div style={styles.dataSyncBadge}>
                  <div style={styles.pulseRow}>
                    <span className="pulse-dot"></span>
                    <span style={styles.syncBadgeTitle}>LIVE DATA SYNC</span>
                  </div>
                  <div style={styles.syncBadgeSubtitle}>Programs & tuition updated daily</div>
                </div>
              </div>
            </div>
          </section>

          {/* 3. Traps Section */}
          <section style={styles.trapsSection}>
            <div style={styles.trapsGrid}>
              <div style={styles.trapsTitleCol}>
                <span style={styles.giantTrapNumber}>3</span>
                <h2 style={styles.trapsHeading}>
                  traps most <br /> students face
                </h2>
              </div>

              <div style={styles.trapsContentCol}>
                <div style={styles.trapItem}>
                  <span style={styles.trapItemNum}>01</span>
                  <div style={styles.trapItemBody}>
                    <h4 style={styles.trapItemTitle}>Hidden costs</h4>
                    <p style={styles.trapItemDesc}>
                      Prep-school fees and installment differences are often not explained clearly.
                    </p>
                  </div>
                </div>

                <div style={styles.trapItem}>
                  <span style={styles.trapItemNum}>02</span>
                  <div style={styles.trapItemBody}>
                    <h4 style={styles.trapItemTitle}>Biased recommendations</h4>
                    <p style={styles.trapItemDesc}>
                      Some agencies prioritize commission rather than student fit.
                    </p>
                  </div>
                </div>

                <div style={styles.trapItem}>
                  <span style={styles.trapItemNum}>03</span>
                  <div style={styles.trapItemBody}>
                    <h4 style={styles.trapItemTitle}>Misleading rankings</h4>
                    <p style={styles.trapItemDesc}>
                      A familiar name does not always mean the best option for your degree or budget.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 4. Abdullah Bio Section */}
          <section id="about-section" style={styles.storySection}>
            <div style={styles.storyGrid}>
              <div style={styles.storyPhotoCol}>
                <img 
                  src="/abdullah_portrait.png" 
                  alt="Portrait of Abdullah" 
                  style={styles.storyPhoto}
                />
              </div>

              <div style={styles.storyTextCol}>
                <span style={styles.storyQuoteIcon}>“</span>
                <h3 style={styles.storyQuoteHeading}>
                  I built Campus Insider because I wanted the information I did not have when I first arrived.
                </h3>
                <p style={styles.storyParagraph}>
                  As an international student in Türkiye, I know how confusing it can be to choose the right university. That's why I built Campus Insider—to give you transparent information and personal guidance, so you can make confident decisions.
                </p>
                
                <div style={styles.signatureRow}>
                  <div style={styles.storySignature}>Abdullah Makashen</div>
                  <div style={styles.storySubtitleLabel}>Computer Engineering Student</div>
                  <div style={styles.storySubtitleLabel}>Istanbul, Türkiye</div>
                </div>
              </div>

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
              <div style={styles.previewTextCol}>
                <span style={styles.previewLabel}>SEE IT IN ACTION</span>
                <h2 style={styles.previewHeading}>
                  Your journey, <br />
                  made <span style={styles.previewHeadingAccent}>simple.</span>
                </h2>

                <div style={styles.previewList}>
                  <div style={styles.previewListItem}>
                    <div style={styles.previewIconCircle}>👤</div>
                    <div>
                      <h4 style={styles.previewListTitle}>Your profile</h4>
                      <p style={styles.previewListDesc}>We understand your goals</p>
                    </div>
                  </div>

                  <div style={styles.previewListItem}>
                    <div style={styles.previewIconCircle}>🔀</div>
                    <div>
                      <h4 style={styles.previewListTitle}>Matched programs</h4>
                      <p style={styles.previewListDesc}>We filter thousands of options</p>
                    </div>
                  </div>

                  <div style={styles.previewListItem}>
                    <div style={styles.previewIconCircle}>📋</div>
                    <div>
                      <h4 style={styles.previewListTitle}>Transparent tuition</h4>
                      <p style={styles.previewListDesc}>Cash, installment & prep fees</p>
                    </div>
                  </div>

                  <div style={styles.previewListItem}>
                    <div style={styles.previewIconCircle}>🛡️</div>
                    <div>
                      <h4 style={styles.previewListTitle}>Personal explanation</h4>
                      <p style={styles.previewListDesc}>Why each option fits you</p>
                    </div>
                  </div>
                </div>
              </div>

              <div style={styles.previewMockupCol}>
                <div style={styles.browserMockup}>
                  <div style={styles.browserHeader}>
                    <div style={styles.browserDotRow}>
                      <span style={{ ...styles.browserDot, backgroundColor: "#ef4444" }} />
                      <span style={{ ...styles.browserDot, backgroundColor: "#eab308" }} />
                      <span style={{ ...styles.browserDot, backgroundColor: "#22c55e" }} />
                    </div>
                  </div>

                  <div style={styles.browserContent}>
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

                    <div style={styles.mockResultsCol}>
                      <div style={styles.mockResultsHeader}>Your Recommended Options</div>

                      <div style={styles.mockCardDominant}>
                        <div style={styles.mockCardTopRow}>
                          <div>
                            <span style={styles.mockCardBadge}>Best Overall Match</span>
                            <h5 style={styles.mockCardTitle}>Computer Engineering</h5>
                            <span style={styles.mockCardUni}>Beykent University - Istanbul</span>
                          </div>
                          <div style={styles.mockCostBlock}>
                            <span style={styles.mockCostLabel}>Annual Tuition (USD)</span>
                            <span style={styles.mockCostPrice}>$2,700</span>
                          </div>
                        </div>

                        <div style={styles.mockChecksList}>
                          <span style={styles.mockCheckItem}>✓ Taught in English</span>
                          <span style={styles.mockCheckItem}>✓ Within your budget</span>
                          <span style={styles.mockCheckItem}>✓ Bachelor's degree available</span>
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

          {/* 6. Section 4: Timeline */}
          <section id="process-section" style={styles.timelineSection}>
            <h2 style={styles.timelineHeading}>How your recommendations are built</h2>

            <div style={styles.timelineGrid}>
              <div style={styles.timelineStepCard}>
                <div style={styles.timelineHeaderRow}>
                  <div style={styles.timelineIconCircle}>👤</div>
                  <span style={styles.timelineStepNum}>01</span>
                </div>
                <h4 style={styles.timelineStepTitle}>Your goals</h4>
                <p style={styles.timelineStepDesc}>We start with your preferences, budget, and study plans.</p>
              </div>

              <div style={styles.timelineStepCard}>
                <div style={styles.timelineHeaderRow}>
                  <div style={styles.timelineIconCircle}>🔀</div>
                  <span style={styles.timelineStepNum}>02</span>
                </div>
                <h4 style={styles.timelineStepTitle}>Program filtering</h4>
                <p style={styles.timelineStepDesc}>We match you with programs that meet your academic criteria.</p>
              </div>

              <div style={styles.timelineStepCard}>
                <div style={styles.timelineHeaderRow}>
                  <div style={styles.timelineIconCircle}>🛡️</div>
                  <span style={styles.timelineStepNum}>03</span>
                </div>
                <h4 style={styles.timelineStepTitle}>Fee verification</h4>
                <p style={styles.timelineStepDesc}>We verify tuition, installments, and prep-school fees.</p>
              </div>

              <div style={styles.timelineStepCard}>
                <div style={styles.timelineHeaderRow}>
                  <div style={styles.timelineIconCircle}>💬</div>
                  <span style={styles.timelineStepNum}>04</span>
                </div>
                <h4 style={styles.timelineStepTitle}>Personal review</h4>
                <p style={styles.timelineStepDesc}>I personally review the results and explain the best fits.</p>
              </div>
            </div>
          </section>

          {/* 7. Section 5: Database Coverage Stats */}
          <section id="stats-section" style={styles.statsSection}>
            <div style={styles.statsGrid}>
              <div style={styles.statsListCol}>
                <div style={styles.statsListItem}>
                  <div style={styles.statsIconCircle}>📋</div>
                  <div>
                    <h4 style={styles.statsListTitle}>Verified program data</h4>
                    <p style={styles.statsListDesc}>Built from synchronized university records</p>
                  </div>
                </div>

                <div style={styles.statsListItem}>
                  <div style={styles.statsIconCircle}>💵</div>
                  <div>
                    <h4 style={styles.statsListTitle}>Transparent pricing</h4>
                    <p style={styles.statsListDesc}>Cash, installment & prep fees clearly shown</p>
                  </div>
                </div>

                <div style={styles.statsListItem}>
                  <div style={styles.statsIconCircle}>🤝</div>
                  <div>
                    <h4 style={styles.statsListTitle}>Student-first guidance</h4>
                    <p style={styles.statsListDesc}>No pressure to choose—just honest advice</p>
                  </div>
                </div>

                <div style={styles.statsListItem}>
                  <div style={styles.statsIconCircle}>✓</div>
                  <div>
                    <h4 style={styles.statsListTitle}>Free assessment</h4>
                    <p style={styles.statsListDesc}>Clear options before any application</p>
                  </div>
                </div>
              </div>

              <div style={styles.statsCounterCol}>
                <div style={styles.counterTitle}>7,695</div>
                <div style={styles.counterSubtitle}>programs indexed</div>
                
                <div style={styles.counterDivider} />

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

              <div style={styles.statsPhotoCol}>
                <img 
                  src="/istanbul_galata_waterfront.png" 
                  alt="Istanbul Waterfront and Galata Tower" 
                  style={styles.statsPhoto}
                />
              </div>
            </div>
          </section>

          {/* 8. Section 6: FAQ Accordion (Source of Truth: Screenshot 5) */}
          <section style={styles.faqSection}>
            <div style={styles.faqCenteredContainer}>
              <h2 style={styles.faqHeading}>Frequently Asked Questions</h2>

              <div style={styles.faqList}>
                {faqData.map((item, idx) => (
                  <div 
                    key={idx} 
                    style={activeFaq === idx ? styles.faqItemActive : styles.faqItem}
                    onClick={() => toggleFaq(idx)}
                  >
                    <div style={styles.faqQuestionRow}>
                      <span style={styles.faqQuestionText}>{item.q}</span>
                      <span style={styles.faqToggleIcon}>{activeFaq === idx ? "−" : "+"}</span>
                    </div>
                    {activeFaq === idx && (
                      <p style={styles.faqAnswerText}>{item.a}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 9. Final CTA Banner ("You don't have to choose a university alone") */}
          <section style={styles.ctaBannerSection}>
            <div style={styles.ctaBannerCard}>
              <h2 style={styles.ctaBannerHeading}>
                You don't have to choose a university alone.
              </h2>
              <p style={styles.ctaBannerSubtitle}>
                Get transparent tuition figures, verified program matches, and personal guidance for studying in Türkiye.
              </p>
              <div style={styles.ctaBannerBtnRow}>
                <button onClick={handleStartWizard} style={styles.ctaPrimaryBtn}>
                  Find My University Options
                </button>
                <a 
                  href="https://wa.me/905000000000" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  style={styles.ctaWhatsappBtn}
                >
                  💬 Speak with Abdullah on WhatsApp
                </a>
              </div>
            </div>
          </section>

        </div>
      ) : (
        /* Results Display View */
        <div style={styles.resultsCenteredWrapper}>
          <ResultsDisplay
            leadId={resultsData.leadId}
            results={resultsData.results}
            onRestart={handleRestart}
          />
        </div>
      )}

      {/* Main Wizard Overlay */}
      {showWizard && (
        <AssessmentWizard
          onComplete={handleAssessmentComplete}
          onCancel={() => setShowWizard(false)}
        />
      )}

      {/* Footer Wrapper */}
      <div style={styles.footerWrapper}>
        <footer style={styles.footer}>
          <p>© {new Date().getFullYear()} Campus Insider. Built independently for international student wayfinding.</p>
          <div>
            <Link href="/privacy" style={styles.footerLink}>Privacy Policy</Link>
          </div>
        </footer>
      </div>
    </main>
  );
}

// Styling system mapped directly to Section 6 & Final CTA concept image specifications
const styles: { [key: string]: React.CSSProperties } = {
  main: {
    backgroundColor: "#F9F6F0",
    minHeight: "100vh",
    color: "#152238",
    fontFamily: "'Inter', sans-serif",
    overflowX: "hidden",
  },
  navbar: {
    width: "100%",
    padding: "36px 6%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  navLeft: {
    display: "flex",
    alignItems: "center",
  },
  logoContainer: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  logoIcon: {
    fontSize: "2.4rem",
    color: "#3157D5",
  },
  logoText: {
    fontFamily: "'Sora', sans-serif",
    fontWeight: "800",
    fontSize: "1.3rem",
    color: "#152238",
    letterSpacing: "-0.01em",
  },
  logoSubtext: {
    fontSize: "0.75rem",
    color: "#667085",
    marginTop: "2px",
  },
  navCenter: {
    display: "flex",
    gap: "40px",
  },
  navLink: {
    background: "transparent",
    border: "none",
    fontFamily: "'Inter', sans-serif",
    fontWeight: "600",
    fontSize: "0.95rem",
    color: "#152238",
    cursor: "pointer",
  },
  navRight: {},
  navCta: {
    backgroundColor: "#3157D5",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "12px 28px",
    fontWeight: "700",
    fontSize: "0.95rem",
    cursor: "pointer",
  },
  pageContent: {
    display: "flex",
    flexDirection: "column",
    gap: "0",
  },
  heroSection: {
    width: "100%",
    backgroundColor: "#F9F6F0",
    borderBottom: "1.5px solid rgba(21, 34, 56, 0.08)",
  },
  heroGrid: {
    display: "grid",
    gridTemplateColumns: "1.05fr 0.95fr",
    width: "100%",
    alignItems: "stretch",
  },
  heroTextCol: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: "80px 8% 80px 12%",
    gap: "32px",
  },
  heroTitle: {
    fontSize: "4.6rem",
    fontWeight: "800",
    fontFamily: "'Sora', sans-serif",
    lineHeight: "1.08",
    color: "#152238",
    letterSpacing: "-0.04em",
  },
  heroTitleAccent: {
    color: "#D96C4A",
  },
  heroSubtitle: {
    fontSize: "1.2rem",
    lineHeight: "1.6",
    color: "#667085",
    maxWidth: "460px",
  },
  heroCtaRow: {
    display: "flex",
    alignItems: "center",
    gap: "24px",
  },
  heroPrimaryBtn: {
    backgroundColor: "#3157D5",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "16px 36px",
    fontWeight: "700",
    fontSize: "1rem",
    cursor: "pointer",
    boxShadow: "0 6px 20px rgba(49, 87, 213, 0.15)",
  },
  heroSecondaryBtn: {
    background: "transparent",
    border: "none",
    color: "#3157D5",
    fontWeight: "700",
    fontSize: "1rem",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
  },
  trustBadgeRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginTop: "8px",
  },
  avatarRow: {
    display: "flex",
    alignItems: "center",
  },
  avatarDot: {
    width: "32px",
    height: "32px",
    borderRadius: "9999px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "2px solid #F9F6F0",
    fontSize: "1rem",
  },
  trustStarsCol: {
    display: "flex",
    flexDirection: "column",
  },
  starsRow: {
    color: "#f59e0b",
    fontSize: "1rem",
    letterSpacing: "0.05em",
  },
  trustText: {
    fontSize: "0.78rem",
    color: "#667085",
    fontWeight: "500",
  },
  heroImageCol: {
    position: "relative",
    width: "100%",
    minHeight: "580px",
  },
  heroImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  dataSyncBadge: {
    position: "absolute",
    bottom: "40px",
    right: "40px",
    backgroundColor: "#152238",
    color: "#fff",
    padding: "14px 20px",
    borderRadius: "4px",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  pulseRow: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  syncBadgeTitle: {
    fontSize: "0.7rem",
    fontWeight: "800",
    letterSpacing: "0.08em",
    color: "#168B83",
  },
  syncBadgeSubtitle: {
    fontSize: "0.7rem",
    color: "#667085",
  },
  trapsSection: {
    width: "100%",
    padding: "80px 6%",
    backgroundColor: "#F9F6F0",
  },
  trapsGrid: {
    display: "grid",
    gridTemplateColumns: "1.1fr 2.9fr",
    gap: "60px",
    alignItems: "center",
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
    color: "#D96C4A",
    lineHeight: "0.7",
  },
  trapsHeading: {
    fontFamily: "'Sora', sans-serif",
    fontSize: "2.4rem",
    fontWeight: "800",
    lineHeight: "1.1",
    color: "#152238",
  },
  trapsContentCol: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "40px",
  },
  trapItem: {
    display: "flex",
    gap: "16px",
    alignItems: "flex-start",
  },
  trapItemNum: {
    fontFamily: "'Source Serif 4', Georgia, serif",
    fontSize: "2.2rem",
    fontWeight: "800",
    fontStyle: "italic",
    color: "#D96C4A",
    lineHeight: "1",
  },
  trapItemBody: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  trapItemTitle: {
    fontSize: "1.15rem",
    fontWeight: "700",
    fontFamily: "'Sora', sans-serif",
    color: "#152238",
    lineHeight: "1.2",
  },
  trapItemDesc: {
    fontSize: "0.88rem",
    color: "#667085",
    lineHeight: "1.45",
  },
  storySection: {
    width: "100%",
    backgroundColor: "#FAF8F5",
    borderTop: "1.5px solid rgba(21, 34, 56, 0.08)",
    borderBottom: "1.5px solid rgba(21, 34, 56, 0.08)",
    display: "grid",
  },
  storyGrid: {
    display: "grid",
    gridTemplateColumns: "1.1fr 1.7fr 1.2fr",
    width: "100%",
    alignItems: "stretch",
  },
  storyPhotoCol: {
    position: "relative",
    width: "100%",
  },
  storyPhoto: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  storyTextCol: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: "80px 48px",
    gap: "20px",
  },
  storyQuoteIcon: {
    fontFamily: "Georgia, serif",
    fontSize: "4rem",
    lineHeight: "0.3",
    color: "#D96C4A",
  },
  storyQuoteHeading: {
    fontFamily: "'Sora', sans-serif",
    fontSize: "1.9rem",
    fontWeight: "800",
    lineHeight: "1.35",
    color: "#152238",
  },
  storyParagraph: {
    fontSize: "0.95rem",
    color: "#667085",
    lineHeight: "1.6",
  },
  signatureRow: {
    marginTop: "8px",
  },
  storySignature: {
    fontFamily: "'Source Serif 4', Georgia, serif",
    fontSize: "1.8rem",
    fontStyle: "italic",
    fontWeight: "600",
    color: "#152238",
  },
  storySubtitleLabel: {
    fontSize: "0.85rem",
    color: "#667085",
    fontWeight: "500",
    marginTop: "2px",
  },
  storyFactsCol: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "80px 6% 80px 0",
  },
  factsCard: {
    width: "100%",
    backgroundColor: "#F9F6F0",
    border: "1px solid rgba(21, 34, 56, 0.08)",
    borderRadius: "12px",
    padding: "40px 32px",
    display: "flex",
    flexDirection: "column",
    gap: "32px",
  },
  factItem: {
    display: "flex",
    gap: "16px",
    alignItems: "center",
  },
  factIcon: {
    fontSize: "2rem",
    color: "#3157D5",
  },
  factLabel: {
    fontSize: "0.8rem",
    color: "#667085",
    fontWeight: "600",
  },
  factValue: {
    fontSize: "0.95rem",
    fontWeight: "700",
    color: "#152238",
    marginTop: "2px",
  },
  previewSection: {
    width: "100%",
    backgroundColor: "#152238",
    color: "#fff",
    padding: "96px 6%",
  },
  previewGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1.65fr",
    gap: "64px",
    alignItems: "center",
    width: "100%",
  },
  previewTextCol: {
    display: "flex",
    flexDirection: "column",
    gap: "28px",
  },
  previewLabel: {
    fontFamily: "monospace",
    fontSize: "0.75rem",
    color: "#94a3b8",
    letterSpacing: "0.08em",
  },
  previewHeading: {
    fontFamily: "'Sora', sans-serif",
    fontSize: "3.4rem",
    fontWeight: "800",
    lineHeight: "1.1",
    color: "#fff",
  },
  previewHeadingAccent: {
    color: "#D96C4A",
  },
  previewList: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
    marginTop: "12px",
  },
  previewListItem: {
    display: "flex",
    gap: "20px",
    alignItems: "center",
  },
  previewIconCircle: {
    width: "44px",
    height: "44px",
    borderRadius: "9999px",
    border: "1.5px solid rgba(255, 255, 255, 0.2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.2rem",
    color: "#fff",
    backgroundColor: "rgba(255, 255, 255, 0.04)",
  },
  previewListTitle: {
    fontSize: "1.1rem",
    fontWeight: "700",
    color: "#fff",
  },
  previewListDesc: {
    fontSize: "0.9rem",
    color: "#94a3b8",
    marginTop: "2px",
  },
  previewMockupCol: {
    width: "100%",
  },
  browserMockup: {
    backgroundColor: "#fff",
    borderRadius: "8px",
    border: "1px solid rgba(255, 255, 255, 0.15)",
    overflow: "hidden",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
  },
  browserHeader: {
    height: "40px",
    backgroundColor: "#1e293b",
    display: "flex",
    alignItems: "center",
    padding: "0 18px",
    borderBottom: "1px solid #334155",
  },
  browserDotRow: {
    display: "flex",
    gap: "8px",
  },
  browserDot: {
    width: "10px",
    height: "10px",
    borderRadius: "9999px",
  },
  browserContent: {
    display: "grid",
    gridTemplateColumns: "1fr 1.25fr",
    minHeight: "460px",
    backgroundColor: "#F9F6F0",
  },
  mockWizardCol: {
    borderRight: "1px solid rgba(21, 34, 56, 0.08)",
    padding: "28px",
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },
  mockStepCounter: {
    fontFamily: "monospace",
    fontSize: "0.75rem",
    color: "#667085",
  },
  mockStepQuestion: {
    fontFamily: "'Sora', sans-serif",
    fontSize: "1.35rem",
    fontWeight: "700",
    color: "#152238",
  },
  mockOptionsList: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    flex: 1,
    marginTop: "8px",
  },
  mockOption: {
    padding: "12px 16px",
    backgroundColor: "#fff",
    border: "1px solid rgba(21, 34, 56, 0.1)",
    borderRadius: "6px",
    fontSize: "0.9rem",
    color: "#152238",
  },
  mockOptionActive: {
    padding: "12px 16px",
    backgroundColor: "#3157D5",
    border: "1.5px solid #3157D5",
    borderRadius: "6px",
    fontSize: "0.9rem",
    color: "#fff",
    fontWeight: "700",
  },
  mockFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "12px",
  },
  mockBackLink: {
    fontSize: "0.85rem",
    color: "#667085",
    cursor: "pointer",
  },
  mockContinueBtn: {
    backgroundColor: "#3157D5",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    padding: "10px 22px",
    fontSize: "0.88rem",
    fontWeight: "700",
  },
  mockResultsCol: {
    padding: "28px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  mockResultsHeader: {
    fontSize: "0.85rem",
    fontWeight: "800",
    color: "#667085",
  },
  mockCardDominant: {
    backgroundColor: "#fff",
    border: "2px solid #3157D5",
    borderRadius: "8px",
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  mockCardTopRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  mockCardBadge: {
    backgroundColor: "#D96C4A",
    color: "#fff",
    fontSize: "0.65rem",
    padding: "3px 8px",
    borderRadius: "4px",
    fontWeight: "700",
  },
  mockCardTitle: {
    fontSize: "1.2rem",
    fontWeight: "800",
    fontFamily: "'Sora', sans-serif",
    color: "#152238",
    marginTop: "8px",
  },
  mockCardUni: {
    fontSize: "0.78rem",
    color: "#667085",
    marginTop: "2px",
    display: "block",
  },
  mockCostBlock: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
  },
  mockCostLabel: {
    fontSize: "0.7rem",
    color: "#667085",
  },
  mockCostPrice: {
    fontSize: "1.5rem",
    fontWeight: "800",
    color: "#3157D5",
  },
  mockChecksList: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  mockCheckItem: {
    fontSize: "0.78rem",
    color: "#168B83",
    fontWeight: "600",
  },
  mockTableFrame: {
    borderTop: "1px solid rgba(21, 34, 56, 0.08)",
    paddingTop: "12px",
  },
  mockItemTable: {
    width: "100%",
  },
  mockItemTd: {
    fontSize: "0.78rem",
    padding: "4px 0",
    color: "#152238",
  },
  mockCardCtaRow: {
    display: "flex",
    gap: "10px",
    marginTop: "8px",
  },
  mockDetailsBtn: {
    flex: 1,
    padding: "10px",
    fontSize: "0.78rem",
    border: "1px solid rgba(21, 34, 56, 0.15)",
    background: "transparent",
    borderRadius: "6px",
    color: "#152238",
    fontWeight: "600",
  },
  mockWhatsappBtn: {
    flex: 1.5,
    padding: "10px",
    fontSize: "0.78rem",
    border: "none",
    backgroundColor: "rgba(22, 139, 131, 0.1)",
    color: "#168B83",
    borderRadius: "6px",
    fontWeight: "700",
  },
  timelineSection: {
    width: "100%",
    backgroundColor: "#F9F6F0",
    padding: "96px 6%",
    borderBottom: "1.5px solid rgba(21, 34, 56, 0.08)",
  },
  timelineHeading: {
    fontFamily: "'Sora', sans-serif",
    fontSize: "2.6rem",
    fontWeight: "800",
    color: "#152238",
    textAlign: "center",
    marginBottom: "64px",
  },
  timelineGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "36px",
  },
  timelineStepCard: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  timelineHeaderRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  timelineIconCircle: {
    width: "48px",
    height: "48px",
    borderRadius: "9999px",
    border: "1.5px solid rgba(21, 34, 56, 0.15)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.2rem",
    backgroundColor: "#fff",
  },
  timelineStepNum: {
    fontFamily: "'Source Serif 4', Georgia, serif",
    fontSize: "1.5rem",
    fontWeight: "700",
    color: "#667085",
  },
  timelineStepTitle: {
    fontFamily: "'Sora', sans-serif",
    fontSize: "1.2rem",
    fontWeight: "700",
    color: "#152238",
  },
  timelineStepDesc: {
    fontSize: "0.9rem",
    color: "#667085",
    lineHeight: "1.5",
  },
  statsSection: {
    width: "100%",
    backgroundColor: "#FAF8F5",
    borderBottom: "1.5px solid rgba(21, 34, 56, 0.08)",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1.2fr 1fr",
    width: "100%",
    alignItems: "stretch",
  },
  statsListCol: {
    padding: "80px 48px 80px 6%",
    display: "flex",
    flexDirection: "column",
    gap: "28px",
    justifyContent: "center",
  },
  statsListItem: {
    display: "flex",
    gap: "18px",
    alignItems: "flex-start",
  },
  statsIconCircle: {
    width: "40px",
    height: "40px",
    borderRadius: "9999px",
    backgroundColor: "rgba(22, 139, 131, 0.1)",
    color: "#168B83",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.1rem",
    fontWeight: "700",
    flexShrink: 0,
  },
  statsListTitle: {
    fontFamily: "'Sora', sans-serif",
    fontSize: "1.1rem",
    fontWeight: "700",
    color: "#152238",
  },
  statsListDesc: {
    fontSize: "0.88rem",
    color: "#667085",
    marginTop: "2px",
  },
  statsCounterCol: {
    padding: "80px 40px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    borderLeft: "1.5px solid rgba(21, 34, 56, 0.08)",
    borderRight: "1.5px solid rgba(21, 34, 56, 0.08)",
  },
  counterTitle: {
    fontFamily: "'Sora', sans-serif",
    fontSize: "6.5rem",
    fontWeight: "800",
    lineHeight: "0.9",
    color: "#152238",
    letterSpacing: "-0.03em",
  },
  counterSubtitle: {
    fontFamily: "'Sora', sans-serif",
    fontSize: "1.25rem",
    fontWeight: "700",
    color: "#D96C4A",
    marginTop: "12px",
  },
  counterDivider: {
    width: "100%",
    borderTop: "1.5px solid rgba(21, 34, 56, 0.08)",
    margin: "36px 0 28px 0",
  },
  smallStatsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "16px",
    width: "100%",
    textAlign: "center",
  },
  smallStatBlock: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
  },
  smallStatVal: {
    fontFamily: "'Sora', sans-serif",
    fontSize: "1.1rem",
    fontWeight: "800",
    color: "#152238",
  },
  smallStatLabel: {
    fontSize: "0.75rem",
    color: "#667085",
  },
  statsPhotoCol: {
    position: "relative",
    width: "100%",
    minHeight: "480px",
  },
  statsPhoto: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  faqSection: {
    width: "100%",
    backgroundColor: "#F9F6F0",
    padding: "96px 6%",
    borderBottom: "1.5px solid rgba(21, 34, 56, 0.08)",
  },
  faqCenteredContainer: {
    maxWidth: "840px",
    margin: "0 auto",
  },
  faqHeading: {
    fontFamily: "'Sora', sans-serif",
    fontSize: "2.5rem",
    fontWeight: "800",
    color: "#152238",
    textAlign: "center",
    marginBottom: "48px",
  },
  faqList: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  faqItem: {
    backgroundColor: "#fff",
    border: "1px solid rgba(21, 34, 56, 0.1)",
    borderRadius: "8px",
    padding: "24px 32px",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  faqItemActive: {
    backgroundColor: "#fff",
    border: "1.5px solid #3157D5",
    borderRadius: "8px",
    padding: "24px 32px",
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(49, 87, 213, 0.06)",
  },
  faqQuestionRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  faqQuestionText: {
    fontFamily: "'Sora', sans-serif",
    fontSize: "1.15rem",
    fontWeight: "700",
    color: "#152238",
  },
  faqToggleIcon: {
    fontSize: "1.5rem",
    fontWeight: "700",
    color: "#3157D5",
  },
  faqAnswerText: {
    marginTop: "16px",
    fontSize: "0.95rem",
    color: "#667085",
    lineHeight: "1.6",
    borderTop: "1px solid rgba(21, 34, 56, 0.06)",
    paddingTop: "16px",
  },
  ctaBannerSection: {
    width: "100%",
    backgroundColor: "#152238",
    padding: "96px 6%",
    display: "flex",
    justifyContent: "center",
  },
  ctaBannerCard: {
    maxWidth: "840px",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "24px",
  },
  ctaBannerHeading: {
    fontFamily: "'Sora', sans-serif",
    fontSize: "3.2rem",
    fontWeight: "800",
    color: "#fff",
    lineHeight: "1.15",
  },
  ctaBannerSubtitle: {
    fontSize: "1.15rem",
    color: "#94a3b8",
    lineHeight: "1.6",
    maxWidth: "640px",
  },
  ctaBannerBtnRow: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
    marginTop: "12px",
  },
  ctaPrimaryBtn: {
    backgroundColor: "#3157D5",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "16px 36px",
    fontWeight: "700",
    fontSize: "1rem",
    cursor: "pointer",
    boxShadow: "0 6px 20px rgba(49, 87, 213, 0.3)",
  },
  ctaWhatsappBtn: {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    color: "#fff",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    borderRadius: "8px",
    padding: "16px 28px",
    fontWeight: "700",
    fontSize: "0.95rem",
    textDecoration: "none",
    display: "inline-flex",
    alignItems: "center",
  },
  resultsCenteredWrapper: {
    width: "100%",
    maxWidth: "1280px",
    margin: "0 auto",
    padding: "0 40px",
  },
  footerWrapper: {
    width: "100%",
    borderTop: "1.5px solid rgba(21, 34, 56, 0.08)",
    backgroundColor: "transparent",
  },
  footer: {
    padding: "36px 6%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "0.85rem",
    color: "#667085",
    width: "100%",
  },
  footerLink: {
    color: "#667085",
    textDecoration: "underline",
  },
};
