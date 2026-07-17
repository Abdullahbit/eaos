"use client";

import React from "react";
import Link from "next/link";

export default function DesignPlayground() {
  return (
    <main style={styles.main}>
      <header style={styles.header}>
        <div className="container" style={styles.headerInner}>
          <div style={styles.logo}>
            🎨 Campus <span style={styles.logoAccent}>Playground</span>
          </div>
          <Link href="/" style={styles.backLink}>← Back to Home</Link>
        </div>
      </header>

      <div className="container" style={styles.container}>
        <h1 className="gradient-text" style={{ fontSize: "3rem", marginBottom: "40px" }}>
          Design System Visual Playground
        </h1>

        <div className="hero-grid" style={{ gap: "40px" }}>
          {/* Left Column: UI Elements */}
          <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
            
            {/* 1. Color Swatches */}
            <section>
              <h2 style={styles.sectionTitle}>1. Color Palette</h2>
              <div style={styles.colorGrid}>
                <div style={{ ...styles.colorCard, backgroundColor: "var(--bg-primary)" }}>
                  <span style={styles.colorLabel}>Light Paper</span>
                  <span style={styles.colorValue}>hsl(40, 20%, 97%)</span>
                </div>
                <div style={{ ...styles.colorCard, backgroundColor: "var(--bg-dark-slate)", color: "#fff" }}>
                  <span style={styles.colorLabel}>Dark Slate</span>
                  <span style={styles.colorValue}>hsl(220, 25%, 9%)</span>
                </div>
                <div style={{ ...styles.colorCard, backgroundColor: "var(--primary)", color: "#fff" }}>
                  <span style={styles.colorLabel}>Primary Indigo</span>
                  <span style={styles.colorValue}>hsl(238, 70%, 54%)</span>
                </div>
                <div style={{ ...styles.colorCard, backgroundColor: "var(--accent-gold)" }}>
                  <span style={styles.colorLabel}>Accent Gold</span>
                  <span style={styles.colorValue}>hsl(38, 92%, 50%)</span>
                </div>
                <div style={{ ...styles.colorCard, backgroundColor: "var(--accent-teal)" }}>
                  <span style={styles.colorLabel}>Accent Teal</span>
                  <span style={styles.colorValue}>hsl(187, 85%, 38%)</span>
                </div>
              </div>
            </section>

            {/* 2. Typography Scale */}
            <section>
              <h2 style={styles.sectionTitle}>2. Typography Scale</h2>
              <div style={styles.demoBlock}>
                <div>
                  <span style={styles.metaLabel}>Display Heading (Outfit 800)</span>
                  <h1 style={{ fontSize: "3.5rem", lineHeight: "1.1", fontWeight: 800 }}>
                    Find Turkish university options that actually fit you.
                  </h1>
                </div>
                <hr style={styles.divider} />
                <div>
                  <span style={styles.metaLabel}>Section Heading (Outfit 700)</span>
                  <h2>Three traps international students fall into</h2>
                </div>
                <hr style={styles.divider} />
                <div>
                  <span style={styles.metaLabel}>Subsection Heading (Outfit 600)</span>
                  <h3>The Hidden Cost Trap</h3>
                </div>
                <hr style={styles.divider} />
                <div>
                  <span style={styles.metaLabel}>Editorial Quote (Playfair Display Italic)</span>
                  <blockquote className="signature" style={{ fontSize: "1.5rem", lineHeight: "1.5" }}>
                    “Let me help you avoid the mistakes I made.”
                  </blockquote>
                </div>
                <hr style={styles.divider} />
                <div>
                  <span style={styles.metaLabel}>Body Paragraph (Inter 400)</span>
                  <p>
                    I’m currently finishing my degree in Istanbul. When I first moved to Turkey as an international student, I made expensive mistakes because of outdated info.
                  </p>
                </div>
                <hr style={styles.divider} />
                <div>
                  <span style={styles.metaLabel}>Typewriter Coordinates Detail</span>
                  <div className="typewriter-coords">41.0082° N, 28.9784° E</div>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column: Components & Layout Primitives */}
          <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
            
            {/* 3. Interactive Components */}
            <section>
              <h2 style={styles.sectionTitle}>3. Buttons & Badges</h2>
              <div style={styles.demoBlock}>
                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                  <button className="btn btn-primary">Start My Free Assessment</button>
                  <button className="btn btn-secondary">How Recommendations Work</button>
                </div>
                <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
                  <span className="live-pulse-badge">
                    <span className="pulse-dot"></span>
                    Syncing now
                  </span>
                </div>
              </div>
            </section>

            {/* 4. Form Inputs */}
            <section>
              <h2 style={styles.sectionTitle}>4. Tactile Inputs</h2>
              <div style={styles.demoBlock}>
                <div style={{ maxWidth: "400px" }}>
                  <label className="form-label" htmlFor="demoInput">
                    Enter intended subject <span className="required-asterisk">*</span>
                  </label>
                  <input
                    className="form-input"
                    id="demoInput"
                    placeholder="e.g. Computer Engineering"
                    defaultValue="Computer Science"
                  />
                </div>
              </div>
            </section>

            {/* 5. Glassmorphism Card */}
            <section>
              <h2 style={styles.sectionTitle}>5. Glassmorphism Card</h2>
              <div className="glass-card" style={{ padding: "30px" }}>
                <h3 style={{ marginBottom: "12px" }}>Recommendation Preview</h3>
                <p style={{ fontSize: "0.95rem", marginBottom: "16px" }}>
                  Fits your $5,000 budget constraint. Central campus location.
                </p>
                <div style={{ color: "var(--accent-teal)", fontWeight: 600, fontSize: "0.85rem" }}>
                  ✓ verified admissions data
                </div>
              </div>
            </section>

            {/* 6. Route Line Metaphor */}
            <section>
              <h2 style={styles.sectionTitle}>6. Route Line Metaphor</h2>
              <div className="route-line-container" style={{ height: "160px", paddingLeft: "60px" }}>
                <div className="route-line"></div>
                <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", gap: "24px" }}>
                  <div>
                    <span style={{ fontWeight: 700, color: "var(--primary)" }}>✦ Waypoint 1</span>
                    <p style={{ fontSize: "0.9rem" }}>Share your budget limits</p>
                  </div>
                  <div>
                    <span style={{ fontWeight: 700, color: "var(--accent-gold)" }}>✦ Waypoint 2</span>
                    <p style={{ fontSize: "0.9rem" }}>Receive verified recommendations</p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  main: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    paddingBottom: "80px",
  },
  header: {
    borderBottom: "1px solid var(--border)",
    padding: "16px 0",
    backgroundColor: "rgba(255, 255, 255, 0.4)",
    backdropFilter: "blur(20px)",
    marginBottom: "40px",
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
  },
  logoAccent: {
    color: "var(--primary)",
  },
  backLink: {
    color: "var(--text-secondary)",
    textDecoration: "none",
    fontWeight: 600,
    fontSize: "0.9rem",
  },
  container: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: "1.25rem",
    fontWeight: 700,
    marginBottom: "16px",
    color: "var(--text-secondary)",
    borderBottom: "1px solid var(--border)",
    paddingBottom: "8px",
  },
  colorGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
    gap: "12px",
  },
  colorCard: {
    padding: "20px 16px",
    borderRadius: "12px",
    border: "1px solid var(--border)",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  colorLabel: {
    fontSize: "0.9rem",
    fontWeight: 700,
  },
  colorValue: {
    fontSize: "0.75rem",
    opacity: 0.8,
    fontFamily: "monospace",
  },
  demoBlock: {
    padding: "24px",
    background: "#fff",
    border: "1px solid var(--border)",
    borderRadius: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  metaLabel: {
    fontSize: "0.75rem",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    color: "var(--text-muted)",
    fontWeight: 700,
    display: "block",
    marginBottom: "8px",
  },
  divider: {
    border: "none",
    borderTop: "1px solid var(--border)",
    margin: "8px 0",
  },
};
