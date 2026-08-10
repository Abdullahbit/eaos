"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ProgramResult } from "./AssessmentWizard";
import { trackEvent } from "../utils/analytics";
import { getUniversityLogoPath, getUniversityInitials } from "../utils/logoMap";

interface ResultsDisplayProps {
  leadId: string;
  results: ProgramResult[];
  onRestart: () => void;
}

export default function ResultsDisplay({ leadId, results, onRestart }: ResultsDisplayProps) {
  const [fullName, setFullName] = useState<string>("Student");
  const [degreeFilter, setDegreeFilter] = useState<string>("All");
  const [sortOrder, setSortOrder] = useState<string>("best");
  const [tuitionFilter, setTuitionFilter] = useState<string>("All");

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

  /**
   * Render dynamic local SVG logo or clean initials vector seal inside 72x72 container
   */
  const renderUniversityLogo = (uniName: string) => {
    const logoPath = getUniversityLogoPath(uniName);

    if (logoPath) {
      return (
        <div style={styles.logoFrame}>
          <img 
            src={logoPath} 
            alt={`${uniName} Logo`} 
            style={styles.logoImage} 
          />
        </div>
      );
    }

    // Clean placeholder seal with initials if SVG is not mapped
    const initials = getUniversityInitials(uniName);

    return (
      <div style={styles.logoFrame}>
        <svg width="72" height="72" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="46" stroke="#152238" strokeWidth="3" fill="#FAF8F5" />
          <circle cx="50" cy="50" r="38" stroke="#152238" strokeWidth="1" strokeDasharray="4 2" />
          <text x="50" y="58" fontSize="24" fontWeight="800" fill="#152238" textAnchor="middle" fontFamily="'Sora', sans-serif">{initials}</text>
        </svg>
      </div>
    );
  };

  // Filter & sort logic
  let filteredResults = [...results];
  if (degreeFilter !== "All") {
    filteredResults = filteredResults.filter(r => r.degree && r.degree.toLowerCase().includes(degreeFilter.toLowerCase()));
  }

  const uniqueUniCount = new Set(filteredResults.map(r => r.university_name)).size;

  return (
    <div className="results-outer-container" style={styles.outerContainer}>
      {/* 1. Result Header Hero Block */}
      <section className="results-header-hero" style={styles.headerHeroSection}>
        <div className="results-header-grid" style={styles.headerHeroGrid}>
          {/* Left Text */}
          <div style={styles.headerLeftCol}>
            <span style={styles.waypointLabel}>WAYPOINT 08 // RECOMMENDATIONS</span>
            <h1 style={styles.heroTitle}>
              Your Study <br />
              <span style={styles.heroTitleAccent}>Blueprints.</span>
            </h1>
            <p style={styles.heroDesc}>
              Based on your criteria, I have identified the following matching programs in Istanbul. Your reference code is{" "}
              <span style={styles.refCodeText}>{leadId}</span>.
            </p>
          </div>

          {/* Right Stats Box */}
          <div style={styles.headerRightCol}>
            <div style={styles.statsCardFrame}>
              {/* Stat 1 */}
              <div style={styles.statBlock}>
                <span style={styles.statIcon}>🎓</span>
                <div>
                  <div style={styles.statNum}>{results.length}</div>
                  <div style={styles.statLabel}>Programs matched</div>
                  <div style={styles.statSublabel}>in Istanbul</div>
                </div>
              </div>

              <div style={styles.statDivider} />

              {/* Stat 2 */}
              <div style={styles.statBlock}>
                <span style={styles.statIcon}>🏛️</span>
                <div>
                  <div style={styles.statNum}>{uniqueUniCount || 3}</div>
                  <div style={styles.statLabel}>Universities</div>
                  <div style={styles.statSublabel}>in Istanbul</div>
                </div>
              </div>

              <div style={styles.statDivider} />

              {/* Stat 3 */}
              <div style={styles.statBlock}>
                <span style={styles.statIcon}>⭐</span>
                <div>
                  <div style={styles.statNum}>98%</div>
                  <div style={styles.statLabel}>Match quality</div>
                  <div style={styles.statSublabel}>on average</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Subline WhatsApp Helper Link */}
        <div className="no-print" style={styles.sublineRow}>
          <span style={styles.sublineIcon}>💬</span>
          <span style={styles.sublineText}>
            Want help choosing?{" "}
            <a 
              href={getWhatsAppLink()} 
              target="_blank" 
              rel="noopener noreferrer" 
              style={styles.sublineLink}
              onClick={handleWhatsappClick}
            >
              Discuss your options with Abdullah on WhatsApp.
            </a>
          </span>
        </div>
      </section>

      {/* 2. Filter Bar Row */}
      <section className="no-print" style={styles.filterBarSection}>
        <div style={styles.filterBarRow}>
          <div style={styles.filterGroup}>
            <span style={styles.filterLabel}>SORT BY</span>
            <select 
              value={sortOrder} 
              onChange={(e) => setSortOrder(e.target.value)}
              style={styles.filterSelect}
            >
              <option value="best">Best Match</option>
              <option value="tuition_asc">Tuition: Low to High</option>
              <option value="tuition_desc">Tuition: High to Low</option>
            </select>
          </div>

          <div style={styles.filterDivider}>|</div>

          <div style={styles.filterGroup}>
            <span style={styles.filterLabel}>DEGREE LEVEL</span>
            <select 
              value={degreeFilter} 
              onChange={(e) => setDegreeFilter(e.target.value)}
              style={styles.filterSelect}
            >
              <option value="All">All Levels</option>
              <option value="Bachelor">Bachelor's Degree</option>
              <option value="Master">Master's Degree</option>
              <option value="Associate">Associate Degree</option>
            </select>
          </div>

          <div style={styles.filterDivider}>|</div>

          <div style={styles.filterGroup}>
            <span style={styles.filterLabel}>TUITION TYPE</span>
            <select 
              value={tuitionFilter} 
              onChange={(e) => setTuitionFilter(e.target.value)}
              style={styles.filterSelect}
            >
              <option value="All">All Tuition Types</option>
              <option value="Cash">Cash Discount</option>
              <option value="Installments">Installment Plans</option>
            </select>
          </div>

          {/* Right Action: Download Summary */}
          <button style={styles.downloadBtn} onClick={() => window.print()}>
            <span style={{ fontSize: "1rem" }}>📥</span> Download Summary
          </button>
        </div>
      </section>

      {/* 3. Result Cards Grid (3 Columns Baseline Grid) */}
      <section style={styles.cardsGridSection}>
        {filteredResults.length > 0 ? (
          <div className="results-cards-grid" style={styles.cardsGrid}>
            {filteredResults.map((prog, idx) => {
              const cash = prog.cash_fee !== undefined ? Number(prog.cash_fee) : 0;
              const installment = prog.discounted_fee !== undefined ? Number(prog.discounted_fee) : Math.round(cash * 1.1);
              const prepFee = Math.round(cash * 0.95);

              // Set up Ranked Labels & Theme Styles
              let rankNum = `0${idx + 1}`;
              let rankLabel = "STRONG ALTERNATIVE";
              let badgeBg = "#D96C4A"; /* Orange */
              let borderTopColor = "#D96C4A";
              let matchPanelBg = "rgba(217, 108, 74, 0.05)";
              let primaryBtnBg = "#D96C4A";

              if (idx === 0) {
                rankLabel = "BEST OVERALL MATCH";
                badgeBg = "#3157D5"; /* Blue */
                borderTopColor = "#3157D5";
                matchPanelBg = "rgba(49, 87, 213, 0.05)";
                primaryBtnBg = "#152238";
              } else if (idx === 1) {
                rankLabel = "BEST BUDGET OPTION";
                badgeBg = "#059669"; /* Green */
                borderTopColor = "#059669";
                matchPanelBg = "rgba(5, 150, 105, 0.05)";
                primaryBtnBg = "#059669";
              }

              return (
                <div key={idx} className="results-card-item" style={{ ...styles.card, borderTop: `4px solid ${borderTopColor}` }}>
                  {/* Top Bar with Badges */}
                  <div style={styles.cardTopBadgeRow}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <span style={{ ...styles.rankNumBadge, backgroundColor: borderTopColor }}>
                        {rankNum}
                      </span>
                      <span style={{ ...styles.rankLabelBadge, backgroundColor: badgeBg }}>
                        {rankLabel}
                      </span>
                    </div>

                    <span style={styles.degreePillBadge}>
                      {prog.degree || "Bachelor"}
                    </span>
                  </div>

                  {/* University Logo & Titles Row */}
                  <div style={styles.cardHeaderRow}>
                    {renderUniversityLogo(prog.university_name)}
                    <div style={styles.cardTitleBlock}>
                      <h3 style={styles.cardProgramTitle}>{prog.program_name}</h3>
                      <span style={styles.cardUniSubtext}>
                        {prog.university_name.toUpperCase()} • {prog.city || "Istanbul"}
                      </span>
                    </div>
                  </div>

                  {/* "Why this matches:" Soft Panel */}
                  <div style={{ ...styles.matchPanel, backgroundColor: matchPanelBg }}>
                    <div style={styles.matchPanelTitle}>Why this matches:</div>
                    <div style={styles.matchList}>
                      <div style={styles.matchListItem}>✓ Taught fully in {prog.language}</div>
                      <div style={styles.matchListItem}>✓ Annual tuition within your maximum limit</div>
                      <div style={styles.matchListItem}>✓ Standard academic criteria met</div>
                    </div>
                  </div>

                  {/* Tuition Breakdown Table */}
                  <div style={styles.tuitionTableFrame}>
                    <div style={styles.tuitionRow}>
                      <span style={styles.tuitionLabel}>
                        <span style={styles.tuitionIcon}>🧮</span> Cash Price (Upfront)
                      </span>
                      <span style={styles.tuitionValue}>
                        {cash > 0 ? `$${cash.toLocaleString()}` : "TBD"}
                      </span>
                    </div>
                    <div style={styles.tuitionRow}>
                      <span style={styles.tuitionLabel}>
                        <span style={styles.tuitionIcon}>💳</span> Installments Price
                      </span>
                      <span style={styles.tuitionValue}>
                        {installment > 0 ? `$${installment.toLocaleString()}` : "TBD"}
                      </span>
                    </div>
                    <div style={styles.tuitionRow}>
                      <span style={styles.tuitionLabel}>
                        <span style={styles.tuitionIcon}>🎓</span> Prep School Fee
                      </span>
                      <span style={styles.tuitionValue}>
                        {prepFee > 0 ? `$${prepFee.toLocaleString()}` : "TBD"}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons Row */}
                  <div style={styles.cardActionsRow}>
                    <a
                      href={getWhatsAppLink(prog.program_name, prog.university_name, rankLabel)}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ ...styles.primaryCardBtn, backgroundColor: primaryBtnBg }}
                      onClick={handleWhatsappClick}
                    >
                      💬 Ask Abdullah on WhatsApp
                    </a>
                    <button style={styles.secondaryCardBtn}>
                      View Details ↗
                    </button>
                  </div>

                  {/* Bottom Metadata Baseline */}
                  <div style={styles.cardMetadataRow}>
                    <span style={styles.metaItem}>🏛️ EST. 1996</span>
                    <span style={styles.metaDot}>•</span>
                    <span style={styles.metaItem}>🏛️ Private University</span>
                    <span style={styles.metaDot}>•</span>
                    <span style={styles.metaItem}>👥 6,500+ Students</span>
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
              I couldn’t find a program matching your exact criteria. Turkey's tuition fees change frequently. 
              Let me know what you are looking for on WhatsApp, and I will manually check my database for you.
            </p>
            <div style={{ marginTop: "24px" }}>
              <a
                href={getWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                style={styles.noMatchWhatsappBtn}
                onClick={handleWhatsappClick}
              >
                💬 Check Manual Options with Abdullah
              </a>
            </div>
          </div>
        )}
      </section>

      {/* 4. Bottom Refine Options Banner */}
      <section className="no-print" style={styles.bottomBannerSection}>
        <div style={styles.bottomBannerCard}>
          <div style={styles.bottomBannerLeft}>
            <div style={styles.lightbulbCircle}>💡</div>
            <div>
              <h4 style={styles.bottomBannerTitle}>These are your best matches.</h4>
              <p style={styles.bottomBannerDesc}>
                Would you like me to adjust the results based on other priorities like location, budget or career goals?
              </p>
            </div>
          </div>

          <div style={styles.bottomBannerRight}>
            <button onClick={onRestart} style={styles.refineBtn}>
              🎛️ Refine My Options
            </button>
            <span onClick={onRestart} style={styles.startNewLink}>
              Start a new search
            </span>
          </div>
        </div>
      </section>

      {/* Floating Chat Button (Bottom Right) */}
      <div className="no-print" style={styles.floatingChatWidget} title="Speak with Abdullah">
        💬
      </div>
    </div>
  );
}

// Styling system mapped directly to design specification
const styles: { [key: string]: React.CSSProperties } = {
  outerContainer: {
    width: "100%",
    maxWidth: "1380px",
    margin: "0 auto",
    padding: "40px 6%",
    display: "flex",
    flexDirection: "column",
    gap: "36px",
    backgroundColor: "#F9F6F0",
  },
  headerHeroSection: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: "28px",
  },
  headerHeroGrid: {
    display: "grid",
    gridTemplateColumns: "1.2fr 1fr",
    gap: "48px",
    alignItems: "center",
  },
  headerLeftCol: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  waypointLabel: {
    fontFamily: "monospace",
    fontSize: "0.75rem",
    color: "#667085",
    letterSpacing: "0.08em",
  },
  heroTitle: {
    fontFamily: "'Sora', sans-serif",
    fontSize: "3.6rem",
    fontWeight: "800",
    lineHeight: "1.08",
    color: "#152238",
    letterSpacing: "-0.03em",
  },
  heroTitleAccent: {
    color: "#D96C4A",
  },
  heroDesc: {
    fontSize: "1.05rem",
    color: "#667085",
    lineHeight: "1.6",
    maxWidth: "520px",
  },
  refCodeText: {
    color: "#3157D5",
    fontWeight: "700",
    fontFamily: "monospace",
    fontSize: "0.95rem",
  },
  headerRightCol: {},
  statsCardFrame: {
    backgroundColor: "#FAF8F5",
    border: "1px solid rgba(21, 34, 56, 0.08)",
    borderRadius: "12px",
    padding: "28px 32px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statBlock: {
    display: "flex",
    gap: "14px",
    alignItems: "center",
  },
  statIcon: {
    fontSize: "2rem",
    color: "#3157D5",
  },
  statNum: {
    fontFamily: "'Sora', sans-serif",
    fontSize: "1.8rem",
    fontWeight: "800",
    color: "#152238",
    lineHeight: "1.1",
  },
  statLabel: {
    fontSize: "0.78rem",
    fontWeight: "700",
    color: "#152238",
    marginTop: "2px",
  },
  statSublabel: {
    fontSize: "0.7rem",
    color: "#667085",
  },
  statDivider: {
    width: "1px",
    height: "48px",
    backgroundColor: "rgba(21, 34, 56, 0.1)",
  },
  sublineRow: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "0.92rem",
    color: "#152238",
  },
  sublineIcon: {
    fontSize: "1.1rem",
  },
  sublineText: {
    color: "#152238",
  },
  sublineLink: {
    color: "#3157D5",
    fontWeight: "700",
    textDecoration: "underline",
  },
  filterBarSection: {
    width: "100%",
    padding: "16px 24px",
    backgroundColor: "#FAF8F5",
    border: "1px solid rgba(21, 34, 56, 0.08)",
    borderRadius: "8px",
  },
  filterBarRow: {
    display: "flex",
    alignItems: "center",
    gap: "24px",
    justifyContent: "flex-start",
  },
  filterGroup: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  filterLabel: {
    fontFamily: "monospace",
    fontSize: "0.72rem",
    fontWeight: "700",
    color: "#667085",
    letterSpacing: "0.05em",
  },
  filterSelect: {
    backgroundColor: "#fff",
    border: "1px solid rgba(21, 34, 56, 0.12)",
    borderRadius: "6px",
    padding: "8px 14px",
    fontSize: "0.88rem",
    color: "#152238",
    fontWeight: "600",
    outline: "none",
    cursor: "pointer",
  },
  filterDivider: {
    color: "rgba(21, 34, 56, 0.2)",
  },
  downloadBtn: {
    marginLeft: "auto",
    backgroundColor: "transparent",
    border: "1.5px solid #3157D5",
    borderRadius: "6px",
    color: "#3157D5",
    padding: "8px 20px",
    fontWeight: "700",
    fontSize: "0.88rem",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  cardsGridSection: {
    width: "100%",
  },
  cardsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "28px",
    alignItems: "stretch",
  },
  card: {
    backgroundColor: "#fff",
    borderLeft: "1px solid rgba(21, 34, 56, 0.08)",
    borderRight: "1px solid rgba(21, 34, 56, 0.08)",
    borderBottom: "1px solid rgba(21, 34, 56, 0.08)",
    borderRadius: "8px",
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.03)",
  },
  cardTopBadgeRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rankNumBadge: {
    color: "#fff",
    fontWeight: "800",
    fontSize: "0.8rem",
    padding: "4px 10px",
    borderRadius: "4px 0 0 4px",
    fontFamily: "monospace",
  },
  rankLabelBadge: {
    color: "#fff",
    fontWeight: "700",
    fontSize: "0.68rem",
    padding: "4px 10px",
    borderRadius: "0 4px 4px 0",
    letterSpacing: "0.05em",
  },
  degreePillBadge: {
    backgroundColor: "rgba(21, 34, 56, 0.04)",
    border: "1px solid rgba(21, 34, 56, 0.1)",
    borderRadius: "4px",
    padding: "3px 8px",
    fontSize: "0.72rem",
    color: "#667085",
    fontWeight: "600",
  },
  cardHeaderRow: {
    display: "flex",
    gap: "16px",
    alignItems: "center",
  },
  logoFrame: {
    width: "72px",
    height: "72px",
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "4px",
    backgroundColor: "transparent",
  },
  logoImage: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },
  cardTitleBlock: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  cardProgramTitle: {
    fontFamily: "'Sora', sans-serif",
    fontSize: "1.25rem",
    fontWeight: "800",
    color: "#152238",
    lineHeight: "1.2",
  },
  cardUniSubtext: {
    fontSize: "0.75rem",
    color: "#667085",
    fontWeight: "700",
    letterSpacing: "0.04em",
  },
  matchPanel: {
    borderRadius: "6px",
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  matchPanelTitle: {
    fontSize: "0.8rem",
    fontWeight: "800",
    color: "#152238",
  },
  matchList: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  matchListItem: {
    fontSize: "0.78rem",
    color: "#152238",
    fontWeight: "500",
  },
  tuitionTableFrame: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    padding: "8px 0",
    borderTop: "1px solid rgba(21, 34, 56, 0.06)",
    borderBottom: "1px solid rgba(21, 34, 56, 0.06)",
  },
  tuitionRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "0.82rem",
  },
  tuitionLabel: {
    color: "#667085",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  tuitionIcon: {
    fontSize: "0.85rem",
  },
  tuitionValue: {
    fontWeight: "800",
    color: "#152238",
  },
  cardActionsRow: {
    display: "flex",
    gap: "10px",
  },
  primaryCardBtn: {
    flex: 1.8,
    color: "#fff",
    padding: "12px",
    borderRadius: "6px",
    fontSize: "0.82rem",
    fontWeight: "700",
    textAlign: "center",
    textDecoration: "none",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryCardBtn: {
    flex: 1,
    backgroundColor: "#fff",
    border: "1px solid rgba(21, 34, 56, 0.15)",
    borderRadius: "6px",
    color: "#152238",
    fontWeight: "700",
    fontSize: "0.8rem",
    cursor: "pointer",
  },
  cardMetadataRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "0.7rem",
    color: "#667085",
    marginTop: "auto",
    paddingTop: "12px",
    borderTop: "1px solid rgba(21, 34, 56, 0.06)",
  },
  metaItem: {
    fontWeight: "500",
  },
  metaDot: {
    color: "rgba(21, 34, 56, 0.2)",
  },
  bottomBannerSection: {
    width: "100%",
    marginTop: "16px",
  },
  bottomBannerCard: {
    backgroundColor: "rgba(49, 87, 213, 0.04)",
    border: "1.5px solid rgba(49, 87, 213, 0.15)",
    borderRadius: "10px",
    padding: "28px 36px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  bottomBannerLeft: {
    display: "flex",
    gap: "20px",
    alignItems: "center",
  },
  lightbulbCircle: {
    width: "48px",
    height: "48px",
    borderRadius: "9999px",
    backgroundColor: "#fff",
    border: "1px solid rgba(49, 87, 213, 0.2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.4rem",
    flexShrink: 0,
  },
  bottomBannerTitle: {
    fontFamily: "'Sora', sans-serif",
    fontSize: "1.25rem",
    fontWeight: "800",
    color: "#3157D5",
  },
  bottomBannerDesc: {
    fontSize: "0.9rem",
    color: "#667085",
    marginTop: "4px",
  },
  bottomBannerRight: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px",
  },
  refineBtn: {
    backgroundColor: "#3157D5",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    padding: "14px 28px",
    fontWeight: "700",
    fontSize: "0.95rem",
    cursor: "pointer",
    boxShadow: "0 4px 14px rgba(49, 87, 213, 0.25)",
  },
  startNewLink: {
    fontSize: "0.82rem",
    color: "#3157D5",
    textDecoration: "underline",
    cursor: "pointer",
    fontWeight: "600",
  },
  noMatchCard: {
    padding: "48px 32px",
    textAlign: "center",
    maxWidth: "580px",
    margin: "0 auto",
    backgroundColor: "#fff",
    border: "1.5px solid rgba(21, 34, 56, 0.1)",
    borderRadius: "8px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "16px",
  },
  noMatchIcon: {
    fontSize: "3rem",
    color: "#D96C4A",
  },
  noMatchText: {
    fontSize: "1rem",
    lineHeight: "1.6",
    color: "#667085",
  },
  noMatchWhatsappBtn: {
    padding: "16px 32px",
    backgroundColor: "#168B83",
    color: "#fff",
    borderRadius: "6px",
    textDecoration: "none",
    fontWeight: "700",
  },
  floatingChatWidget: {
    position: "fixed",
    bottom: "32px",
    right: "32px",
    width: "56px",
    height: "56px",
    borderRadius: "9999px",
    backgroundColor: "#152238",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.5rem",
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.25)",
    cursor: "pointer",
    zIndex: 999,
  },
};
