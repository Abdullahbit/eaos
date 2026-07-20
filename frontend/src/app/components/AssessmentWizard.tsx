"use client";

import React, { useState, useEffect } from "react";
import { trackEvent } from "../utils/analytics";

export interface ProgramResult {
  program_name: string;
  university_name: string;
  degree: string;
  language: string;
  city: string;
  semester?: string;
  status?: string;
  cash_fee?: number;
  discounted_fee?: number;
  deposit_fee?: number;
}

interface AssessmentWizardProps {
  onComplete: (leadId: string, results: ProgramResult[]) => void;
  onCancel: () => void;
}

export default function AssessmentWizard({ onComplete, onCancel }: AssessmentWizardProps) {
  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form states
  const [country, setCountry] = useState<string>("Turkey");
  const [studyLevel, setStudyLevel] = useState<string>("Bachelor");
  const [intendedMajor, setIntendedMajor] = useState<string>("");
  const [preferredLanguage, setPreferredLanguage] = useState<string>("English");
  const [maxBudget, setMaxBudget] = useState<string>("");
  
  const [fullName, setFullName] = useState<string>("");
  const [whatsappNumber, setWhatsappNumber] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [consent, setConsent] = useState<boolean>(false);
  const [assessmentSessionId, setAssessmentSessionId] = useState<string>("");
  const [turnstileChecked, setTurnstileChecked] = useState<boolean>(false);
  const [turnstileToken, setTurnstileToken] = useState<string>("");

  // Custom styling for active wizard steps
  const stepsList = [
    { num: 1, label: "Country" },
    { num: 2, label: "Level" },
    { num: 3, label: "Major" },
    { num: 4, label: "Language" },
    { num: 5, label: "Budget" },
    { num: 6, label: "Contact" },
  ];

  // Hydrate states from sessionStorage on mount
  useEffect(() => {
    // Generate or fetch assessment session ID
    let sessId = sessionStorage.getItem("ci_assessment_session_id");
    if (!sessId) {
      sessId = "assess_" + Math.random().toString(36).substring(2, 15);
      sessionStorage.setItem("ci_assessment_session_id", sessId);
    }
    setAssessmentSessionId(sessId);

    const savedStep = sessionStorage.getItem("ci_step");
    if (savedStep) setStep(Number(savedStep));

    const savedCountry = sessionStorage.getItem("ci_country");
    if (savedCountry) setCountry(savedCountry);

    const savedStudyLevel = sessionStorage.getItem("ci_study_level");
    if (savedStudyLevel) setStudyLevel(savedStudyLevel);

    const savedIntendedMajor = sessionStorage.getItem("ci_intended_major");
    if (savedIntendedMajor) setIntendedMajor(savedIntendedMajor);

    const savedPreferredLanguage = sessionStorage.getItem("ci_preferred_language");
    if (savedPreferredLanguage) setPreferredLanguage(savedPreferredLanguage);

    const savedMaxBudget = sessionStorage.getItem("ci_max_budget");
    if (savedMaxBudget) setMaxBudget(savedMaxBudget);

    const savedFullName = sessionStorage.getItem("ci_full_name");
    if (savedFullName) setFullName(savedFullName);

    const savedWhatsapp = sessionStorage.getItem("ci_whatsapp_number");
    if (savedWhatsapp) setWhatsappNumber(savedWhatsapp);

    const savedEmail = sessionStorage.getItem("ci_email");
    if (savedEmail) setEmail(savedEmail);

    const savedConsent = sessionStorage.getItem("ci_consent");
    if (savedConsent) setConsent(savedConsent === "true");

    trackEvent("assessment_started");
  }, []);

  // Production Turnstile Widget Loader
  useEffect(() => {
    if (step === 6) {
      const script = document.createElement("script");
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);

      (window as any).onTurnstileSuccess = (token: string) => {
        setTurnstileChecked(true);
        setTurnstileToken(token);
      };

      (window as any).onTurnstileExpired = () => {
        setTurnstileChecked(false);
        setTurnstileToken("");
      };

      return () => {
        try {
          document.body.removeChild(script);
        } catch (e) {}
        delete (window as any).onTurnstileSuccess;
        delete (window as any).onTurnstileExpired;
      };
    }
  }, [step]);

  // Save changes to sessionStorage
  useEffect(() => {
    if (step > 1) sessionStorage.setItem("ci_step", String(step));
  }, [step]);

  useEffect(() => {
    sessionStorage.setItem("ci_country", country);
  }, [country]);

  useEffect(() => {
    sessionStorage.setItem("ci_study_level", studyLevel);
  }, [studyLevel]);

  useEffect(() => {
    sessionStorage.setItem("ci_intended_major", intendedMajor);
  }, [intendedMajor]);

  useEffect(() => {
    sessionStorage.setItem("ci_preferred_language", preferredLanguage);
  }, [preferredLanguage]);

  useEffect(() => {
    sessionStorage.setItem("ci_max_budget", maxBudget);
  }, [maxBudget]);

  useEffect(() => {
    sessionStorage.setItem("ci_full_name", fullName);
  }, [fullName]);

  useEffect(() => {
    sessionStorage.setItem("ci_whatsapp_number", whatsappNumber);
  }, [whatsappNumber]);

  useEffect(() => {
    sessionStorage.setItem("ci_email", email);
  }, [email]);

  useEffect(() => {
    sessionStorage.setItem("ci_consent", String(consent));
  }, [consent]);

  // Keyboard Shortcuts (Design System Requirement)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onCancel();
        return;
      }
      
      // Numerical selectors for multi-choice steps
      if (step === 1) {
        if (e.key === "1") { setCountry("Turkey"); handleNext(); }
      } else if (step === 2) {
        const lvls = ["Associate", "Bachelor", "Master", "PhD"];
        const idx = parseInt(e.key) - 1;
        if (idx >= 0 && idx < lvls.length) {
          setStudyLevel(lvls[idx]);
          handleNext();
        }
      } else if (step === 4) {
        const langs = ["English", "Turkish"];
        const idx = parseInt(e.key) - 1;
        if (idx >= 0 && idx < langs.length) {
          setPreferredLanguage(langs[idx]);
          handleNext();
        }
      } else if (step === 3 || step === 5) {
        if (e.key === "Enter") {
          e.preventDefault();
          handleNext();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [step, country, studyLevel, intendedMajor, preferredLanguage, maxBudget]);

  const handleNext = () => {
    setErrorMsg(null);
    if (step === 3 && !intendedMajor.trim()) {
      setErrorMsg("Please specify your intended major.");
      return;
    }
    if (step === 5 && (!maxBudget.trim() || isNaN(Number(maxBudget)) || Number(maxBudget) <= 0)) {
      setErrorMsg("Please enter a valid tuition budget greater than 0.");
      return;
    }
    setStep(step + 1);
    trackEvent("assessment_step_completed");
  };

  const handlePrev = () => {
    setErrorMsg(null);
    setStep(step - 1);
  };

  const clearSessionStorage = () => {
    sessionStorage.removeItem("ci_step");
    sessionStorage.removeItem("ci_country");
    sessionStorage.removeItem("ci_study_level");
    sessionStorage.removeItem("ci_intended_major");
    sessionStorage.removeItem("ci_preferred_language");
    sessionStorage.removeItem("ci_max_budget");
    sessionStorage.removeItem("ci_full_name");
    sessionStorage.removeItem("ci_whatsapp_number");
    sessionStorage.removeItem("ci_email");
    sessionStorage.removeItem("ci_consent");
    sessionStorage.removeItem("ci_assessment_session_id");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!fullName.trim()) {
      setErrorMsg("Full name is required.");
      return;
    }
    if (!whatsappNumber.trim()) {
      setErrorMsg("WhatsApp number is required.");
      return;
    }
    if (!consent) {
      setErrorMsg("You must consent to be contacted to receive your assessment results.");
      return;
    }
    if (!turnstileChecked) {
      setErrorMsg("Please verify that you are human via Turnstile verification.");
      return;
    }

    setLoading(true);
    trackEvent("assessment_submitted");

    const getUtmParam = (param: string) => {
      if (typeof window === "undefined") return undefined;
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get(param) || undefined;
    };

    const payload = {
      full_name: fullName.trim(),
      whatsapp_number: whatsappNumber.trim(),
      email: email.trim() || undefined,
      consent,
      country,
      study_level: studyLevel,
      intended_major: intendedMajor.trim(),
      preferred_language: preferredLanguage,
      max_budget: parseFloat(maxBudget),
      assessment_session_id: assessmentSessionId,
      turnstile_token: turnstileToken,
      utm_source: getUtmParam("utm_source"),
      utm_medium: getUtmParam("utm_medium"),
      utm_campaign: getUtmParam("utm_campaign"),
      referring_url: typeof document !== "undefined" ? document.referrer || undefined : undefined,
    };

    try {
      const response = await fetch("http://localhost:8000/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || "Submission failed. Please check inputs.");
      }

      const responseData = await response.json();
      clearSessionStorage();
      onComplete(responseData.lead_id, responseData.results);
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.overlay}>
      {/* Editorial Header */}
      <header style={styles.header}>
        <div style={styles.headerLogo} onClick={onCancel}>
          🧭 CAMPUS INSIDER
        </div>
        <div style={styles.headerStatus}>
          STEP {step} OF 6 // {stepsList[step - 1].label.toUpperCase()}
        </div>
      </header>

      <div style={styles.modal}>
        {/* Progress Line */}
        <div style={styles.progressTrack}>
          <div style={{ ...styles.progressBar, width: `${(step / 6) * 100}%` }} />
        </div>

        {/* Guided Conversation Avatars & Dialogue Bubble */}
        <div style={styles.conversationHeader}>
          <div style={styles.avatarMini}>👨‍💻</div>
          <div style={styles.bubble}>
            <span style={styles.avatarLabel}>Abdullah</span>
            {step === 1 && "“Where would you like to study? I currently index verified programs in Turkey.”"}
            {step === 2 && `“Excellent. What level of degree are we looking at for ${country}?”`}
            {step === 3 && "“What major or subject field do you want to study? Be as specific as you like.”"}
            {step === 4 && "“Got it. What is your preferred language of instruction for the program?”"}
            {step === 5 && `“What is the maximum yearly tuition budget you can comfortably afford for a ${studyLevel} program?”`}
            {step === 6 && "“Almost there! Enter your contact details and I will search the database for options matching your profile.”"}
          </div>
        </div>

        {/* Step Contents */}
        <div style={styles.contentBody}>
          {errorMsg && <div style={styles.errorBanner}>{errorMsg}</div>}

          {step === 1 && (
            <div className="animate-fade-in" style={styles.stepBlock}>
              <h2 style={styles.stepTitle}>Select Destination Country</h2>
              <div style={styles.optionsList}>
                {["Turkey"].map((c, idx) => (
                  <button
                    key={c}
                    onClick={() => { setCountry(c); handleNext(); }}
                    style={country === c ? styles.optionButtonActive : styles.optionButton}
                  >
                    <span style={styles.optionKeyNum}>{idx + 1}</span> {c} 🇹🇷
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-fade-in" style={styles.stepBlock}>
              <h2 style={styles.stepTitle}>Select Study Level</h2>
              <div style={styles.optionsList}>
                {["Associate", "Bachelor", "Master", "PhD"].map((lvl, idx) => (
                  <button
                    key={lvl}
                    onClick={() => { setStudyLevel(lvl); handleNext(); }}
                    style={studyLevel === lvl ? styles.optionButtonActive : styles.optionButton}
                  >
                    <span style={styles.optionKeyNum}>{idx + 1}</span> {lvl} Degree
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-fade-in" style={styles.stepBlock}>
              <h2 style={styles.stepTitle}>Intended Study Major</h2>
              <div style={styles.inputContainer}>
                <input
                  type="text"
                  placeholder="e.g. Computer Engineering"
                  value={intendedMajor}
                  onChange={(e) => setIntendedMajor(e.target.value)}
                  className="form-input"
                  style={styles.textInput}
                  autoFocus
                />
                <span style={styles.fieldTip}>* Tip: Press Enter to save and continue.</span>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="animate-fade-in" style={styles.stepBlock}>
              <h2 style={styles.stepTitle}>Preferred Instruction Language</h2>
              <div style={styles.optionsList}>
                {["English", "Turkish"].map((lang, idx) => (
                  <button
                    key={lang}
                    onClick={() => { setPreferredLanguage(lang); handleNext(); }}
                    style={preferredLanguage === lang ? styles.optionButtonActive : styles.optionButton}
                  >
                    <span style={styles.optionKeyNum}>{idx + 1}</span> {lang} Instruction
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="animate-fade-in" style={styles.stepBlock}>
              <h2 style={styles.stepTitle}>Maximum Yearly Tuition</h2>
              <div style={styles.inputContainer}>
                <div style={styles.inputWithAddon}>
                  <span style={styles.inputAddon}>$</span>
                  <input
                    type="number"
                    placeholder="e.g. 5000"
                    value={maxBudget}
                    onChange={(e) => setMaxBudget(e.target.value)}
                    className="form-input"
                    style={styles.numberInput}
                    autoFocus
                  />
                  <span style={styles.inputAddon}>/ year</span>
                </div>
                <span style={styles.fieldTip}>* Tip: Enter in USD equivalent. Press Enter to submit.</span>
              </div>
            </div>
          )}

          {step === 6 && (
            <form onSubmit={handleSubmit} className="animate-fade-in" style={styles.stepBlock}>
              <h2 style={styles.stepTitle}>Contact Verification</h2>
              
              <div style={styles.formGroup}>
                <label className="form-label" htmlFor="fullName">Full Name <span className="required-asterisk">*</span></label>
                <input
                  id="fullName"
                  type="text"
                  placeholder="e.g. Jane Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="form-input"
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label className="form-label" htmlFor="whatsapp">WhatsApp Number (with country prefix) <span className="required-asterisk">*</span></label>
                <input
                  id="whatsapp"
                  type="tel"
                  placeholder="e.g. +905001234567"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  className="form-input"
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label className="form-label" htmlFor="email">Email Address (Optional)</label>
                <input
                  id="email"
                  type="email"
                  placeholder="e.g. jane@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input"
                />
              </div>

              {/* Production Cloudflare Turnstile Widget */}
              <div style={styles.turnstileContainer}>
                <div 
                  className="cf-turnstile" 
                  data-sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "1x00000000000000000000AA"}
                  data-callback="onTurnstileSuccess"
                  data-expired-callback="onTurnstileExpired"
                ></div>
              </div>

              <div style={styles.consentCheckboxContainer}>
                <input
                  id="consentCheckbox"
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  style={styles.checkbox}
                />
                <label htmlFor="consentCheckbox" style={styles.checkboxLabel}>
                  I consent to receive my customized study options report, pricing guides, and follow-up consultation info from Abdullah via WhatsApp and Email.
                </label>
              </div>
            </form>
          )}
        </div>

        {/* Footer Navigation Buttons */}
        <div style={styles.modalFooter}>
          {step > 1 ? (
            <button className="btn btn-secondary" onClick={handlePrev} disabled={loading} style={styles.footerBtn}>
              ← Go Back
            </button>
          ) : (
            <div />
          )}

          {step < 6 ? (
            <button className="btn btn-primary" onClick={handleNext} style={styles.footerBtn}>
              Continue →
            </button>
          ) : (
            <button className="btn btn-primary" onClick={handleSubmit} id="submitWizardBtn" disabled={loading} style={styles.footerBtn}>
              {loading ? "Calculating..." : "See Results →"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// V3 Styling matching "The Istanbul Student Atlas" full-screen layout
const styles: { [key: string]: React.CSSProperties } = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "var(--bg-secondary)", /* Warm Sand */
    display: "flex",
    flexDirection: "column",
    zIndex: 1000,
    overflowY: "auto",
    padding: "32px",
  },
  header: {
    width: "100%",
    maxWidth: "800px",
    margin: "0 auto 24px auto",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "2px solid var(--border)",
    paddingBottom: "16px",
  },
  headerLogo: {
    fontFamily: "'Sora', sans-serif",
    fontWeight: "800",
    fontSize: "1.1rem",
    color: "var(--ink-navy)",
    cursor: "pointer",
    letterSpacing: "0.05em",
  },
  headerStatus: {
    fontFamily: "monospace",
    fontSize: "0.75rem",
    color: "var(--muted-slate)",
    letterSpacing: "0.08em",
  },
  modal: {
    width: "100%",
    maxWidth: "800px",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    gap: "32px",
    paddingBottom: "60px",
  },
  progressTrack: {
    width: "100%",
    height: "2px",
    backgroundColor: "var(--border)",
  },
  progressBar: {
    height: "100%",
    background: "var(--primary)",
    transition: "width 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
  },
  conversationHeader: {
    display: "flex",
    alignItems: "flex-start",
    gap: "24px",
    padding: "0",
  },
  avatarMini: {
    fontSize: "2rem",
    width: "48px",
    height: "48px",
    borderRadius: "4px",
    background: "var(--bg-primary)",
    border: "2px solid var(--ink-navy)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarLabel: {
    fontWeight: 700,
    color: "var(--accent-gold)",
    display: "block",
    fontSize: "0.75rem",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    marginBottom: "8px",
  },
  bubble: {
    flex: 1,
    fontFamily: "'Source Serif 4', Georgia, serif",
    fontSize: "1.8rem",
    lineHeight: "1.4",
    color: "var(--ink-navy)",
  },
  contentBody: {
    minHeight: "220px",
  },
  stepBlock: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  stepTitle: {
    fontSize: "1.1rem",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    color: "var(--muted-slate)",
  },
  optionsList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  optionButton: {
    width: "100%",
    padding: "18px 24px",
    backgroundColor: "var(--bg-primary)", /* Soft White */
    border: "1.5px solid var(--border)",
    borderRadius: "4px",
    color: "var(--ink-navy)",
    textAlign: "left",
    fontSize: "1.1rem",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  optionButtonActive: {
    width: "100%",
    padding: "18px 24px",
    backgroundColor: "var(--bg-primary)",
    border: "2.5px solid var(--primary)", /* Cobalt Blue */
    borderRadius: "4px",
    color: "var(--ink-navy)",
    textAlign: "left",
    fontSize: "1.1rem",
    fontWeight: "700",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  optionKeyNum: {
    width: "24px",
    height: "24px",
    borderRadius: "2px",
    background: "rgba(0,0,0,0.06)",
    color: "var(--muted-slate)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "0.8rem",
    fontWeight: 700,
  },
  inputContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  textInput: {
    padding: "16px 0",
    fontSize: "2rem",
    border: "none",
    borderBottom: "2px solid var(--ink-navy)",
    borderRadius: "0",
    backgroundColor: "transparent",
  },
  fieldTip: {
    fontSize: "0.8rem",
    color: "var(--muted-slate)",
    fontStyle: "italic",
  },
  inputWithAddon: {
    display: "flex",
    alignItems: "center",
    borderBottom: "2px solid var(--ink-navy)",
    backgroundColor: "transparent",
  },
  inputAddon: {
    padding: "0 12px 0 0",
    color: "var(--ink-navy)",
    fontWeight: "700",
    fontSize: "2rem",
  },
  numberInput: {
    border: "none",
    backgroundColor: "transparent",
    padding: "16px 0",
    fontSize: "2rem",
    width: "100%",
    borderRadius: "0",
  },
  formGroup: {
    marginBottom: "20px",
    display: "flex",
    flexDirection: "column",
  },
  turnstileContainer: {
    marginBottom: "20px",
    padding: "16px",
    backgroundColor: "var(--bg-primary)",
    border: "1.5px solid var(--border)",
    borderRadius: "4px",
    display: "inline-flex",
  },
  consentCheckboxContainer: {
    display: "flex",
    alignItems: "flex-start",
    gap: "12px",
    marginTop: "20px",
    padding: "16px",
    backgroundColor: "rgba(0, 0, 0, 0.02)",
    borderRadius: "4px",
    border: "1px dashed var(--border)",
  },
  checkbox: {
    marginTop: "4px",
    width: "18px",
    height: "18px",
    cursor: "pointer",
    accentColor: "var(--primary)",
  },
  checkboxLabel: {
    fontSize: "0.85rem",
    color: "var(--muted-slate)",
    cursor: "pointer",
    lineHeight: "1.5",
  },
  modalFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderTop: "2px solid var(--ink-navy)",
    paddingTop: "24px",
    marginTop: "24px",
  },
  footerBtn: {
    borderRadius: "4px",
    padding: "14px 28px",
    fontSize: "1rem",
  },
  errorBanner: {
    backgroundColor: "rgba(217, 108, 74, 0.05)",
    border: "1px solid var(--terracotta)",
    color: "var(--terracotta)",
    padding: "14px 20px",
    borderRadius: "4px",
    fontSize: "0.95rem",
    marginBottom: "20px",
  },
};
