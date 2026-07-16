"use client";

import React from "react";
import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <main style={styles.main}>
      <header style={styles.header}>
        <div className="container" style={styles.headerInner}>
          <Link href="/" style={styles.logo}>
            Campus <span style={styles.logoAccent}>Insider</span>
          </Link>
          <Link href="/" style={styles.backLink}>← Back to Home</Link>
        </div>
      </header>

      <div className="container" style={styles.container}>
        <div className="glass-card" style={styles.contentCard} className="animate-fade-in glass-card">
          <span style={styles.badge}>Compliance</span>
          <h1 style={styles.title}>Privacy Policy</h1>
          <p style={styles.version}>Version 1.0 (Effective July 2026)</p>

          <div style={styles.section}>
            <h2>1. What Information We Collect</h2>
            <p>
              When you use Campus Insider to run study costs estimations or find matching programs, we collect details to customize the result report:
            </p>
            <ul>
              <li><strong>Contact Details:</strong> Your full name, WhatsApp number, and email address (optional).</li>
              <li><strong>Study Preferences:</strong> Desired level of study, intended major, preferred instruction language, and maximum tuition budget.</li>
              <li><strong>Campaign Data:</strong> UTM attribution parameters (e.g. source, medium, campaign) and referring URLs, used exclusively to understand which channels students come from.</li>
              <li><strong>Session Identifiers:</strong> A randomly generated anonymous session key to track progress throughout the assessment funnel.</li>
            </ul>
          </div>

          <div style={styles.section}>
            <h2>2. Why We Collect It & How It's Used</h2>
            <p>
              We collect this information with your explicit consent for the following purposes:
            </p>
            <ul>
              <li>To filter our database of synchronized Turkish university programs and select options fitting your parameters.</li>
              <li>To allow Abdullah (a Computer Engineering student in Istanbul) to review your results, prepare direct consultation guides, and reach out to you via WhatsApp or Email to help you review options.</li>
              <li>To monitor application performance, prevent spam/abuse, and track conversion funnel steps anonymously.</li>
            </ul>
          </div>

          <div style={styles.section}>
            <h2>3. Consent and Data Retention</h2>
            <p>
              By completing the assessment wizard, you agree to this privacy policy and consent to receive follow-up info from Abdullah. Your data is stored securely in our private Supabase PostgreSQL database. We do not sell or share your contact details with external third-party agencies or brokers.
            </p>
          </div>

          <div style={styles.section}>
            <h2>4. Your Rights</h2>
            <p>
              If you wish to request the deletion or correction of your recorded contact information or delete your lead reference, you can contact Abdullah directly via the WhatsApp CTA on the matches results screen or by starting a new query.
            </p>
          </div>
        </div>
      </div>

      <footer style={styles.footer}>
        <p>© 2026 Campus Insider. Built by a student, for students.</p>
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
    textDecoration: "none",
    color: "var(--text-primary)",
  },
  logoAccent: {
    color: "var(--primary)",
  },
  backLink: {
    color: "var(--text-secondary)",
    textDecoration: "none",
    fontSize: "0.9rem",
    fontWeight: "500",
  },
  container: {
    flex: 1,
    paddingTop: "40px",
    paddingBottom: "40px",
    maxWidth: "800px",
    margin: "0 auto",
  },
  contentCard: {
    padding: "40px",
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },
  badge: {
    alignSelf: "flex-start",
    background: "var(--primary-glow)",
    border: "1px solid var(--primary)",
    color: "var(--primary)",
    padding: "4px 12px",
    borderRadius: "9999px",
    fontSize: "0.75rem",
    fontWeight: "600",
    textTransform: "uppercase",
  },
  title: {
    fontSize: "2.2rem",
    fontWeight: "800",
  },
  version: {
    fontSize: "0.85rem",
    color: "var(--text-muted)",
    marginTop: "-12px",
    borderBottom: "1px solid var(--border)",
    paddingBottom: "16px",
  },
  section: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  footer: {
    padding: "24px",
    textAlign: "center",
    borderTop: "1px solid var(--border)",
    fontSize: "0.8rem",
    color: "var(--text-muted)",
  },
};
// Client side styling for bullet items
if (typeof document !== "undefined") {
  const styleEl = document.createElement("style");
  styleEl.innerHTML = `
    .glass-card ul {
      padding-left: 20px;
    }
    .glass-card ul li {
      margin-bottom: 8px;
      color: var(--text-secondary);
      font-size: 0.95rem;
    }
  `;
  document.head.appendChild(styleEl);
}
