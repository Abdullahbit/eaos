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
      turnstile_token: "dev-bypass-token", // bypass validated by backend
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
      <div className="glass-card" style={styles.modal}>
        {/* Close Button */}
        <button style={styles.closeBtn} onClick={onCancel} aria-label="Close modal">×</button>

        {/* Progress Bar */}
        <div style={styles.progressContainer}>
          <div style={styles.progressTrack}>
            <div style={{ ...styles.progressBar, width: `${(step / 6) * 100}%` }} />
          </div>
          <div style={styles.stepsIndicator}>
            {stepsList.map((s) => (
              <span
                key={s.num}
                style={{
                  ...styles.stepIndicatorItem,
                  color: step >= s.num ? "var(--primary)" : "var(--text-muted)",
                  fontWeight: step === s.num ? "700" : "400",
                }}
              >
                {s.label}
              </span>
            ))}
          </div>
        </div>

        {/* Step Contents */}
        <div style={styles.contentBody}>
          {errorMsg && <div style={styles.errorBanner}>{errorMsg}</div>}

          {step === 1 && (
            <div className="animate-fade-in">
              <h2 style={styles.stepTitle}>Where would you like to study?</h2>
              <p style={styles.stepSubtitle}>Istanbul offers universities with globally recognized degree programs.</p>
              <div style={styles.optionsList}>
                {["Turkey"].map((c) => (
                  <button
                    key={c}
                    onClick={() => { setCountry(c); handleNext(); }}
                    style={country === c ? styles.optionButtonActive : styles.optionButton}
                  >
                    {c} 🇹🇷
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-fade-in">
              <h2 style={styles.stepTitle}>Select your desired study level</h2>
              <p style={styles.stepSubtitle}>Which degree level are you aiming for?</p>
              <div style={styles.optionsList}>
                {["Associate", "Bachelor", "Master", "PhD"].map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => { setStudyLevel(lvl); handleNext(); }}
                    style={studyLevel === lvl ? styles.optionButtonActive : styles.optionButton}
                  >
                    {lvl} Degree
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-fade-in">
              <h2 style={styles.stepTitle}>What major do you intend to study?</h2>
              <p style={styles.stepSubtitle}>Examples: Computer Engineering, Business Administration, Architecture.</p>
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
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="animate-fade-in">
              <h2 style={styles.stepTitle}>Preferred instruction language</h2>
              <p style={styles.stepSubtitle}>Most top-tier universities offer fully English-taught programs.</p>
              <div style={styles.optionsList}>
                {["English", "Turkish"].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => { setPreferredLanguage(lang); handleNext(); }}
                    style={preferredLanguage === lang ? styles.optionButtonActive : styles.optionButton}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="animate-fade-in">
              <h2 style={styles.stepTitle}>Maximum yearly tuition budget</h2>
              <p style={styles.stepSubtitle}>Specify the maximum yearly tuition fee (in USD equivalent) you can afford.</p>
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
              </div>
            </div>
          )}

          {step === 6 && (
            <form onSubmit={handleSubmit} className="animate-fade-in">
              <h2 style={styles.stepTitle}>Almost there! Where should we send your matches?</h2>
              <p style={styles.stepSubtitle}>Enter your contact details to calculate your matched programs.</p>
              
              <div style={styles.formGroup}>
                <label className="form-label" htmlFor="fullName">Full Name</label>
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
                <label className="form-label" htmlFor="whatsapp">WhatsApp Number (with country code)</label>
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

              {/* Cloudflare Turnstile Mock widget */}
              <div style={styles.turnstileContainer}>
                <div style={styles.turnstileBadge}>
                  <input
                    id="turnstileMockCheckbox"
                    type="checkbox"
                    checked={turnstileChecked}
                    onChange={(e) => setTurnstileChecked(e.target.checked)}
                    style={styles.turnstileCheckbox}
                  />
                  <label htmlFor="turnstileMockCheckbox" style={styles.turnstileLabel}>
                    Verifying you are human (Secured by Cloudflare Turnstile)
                  </label>
                </div>
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
            <button className="btn btn-secondary" onClick={handlePrev} disabled={loading}>
              Back
            </button>
          ) : (
            <div />
          )}

          {step < 6 ? (
            <button className="btn btn-primary" onClick={handleNext}>
              Next Step
            </button>
          ) : (
            <button className="btn btn-primary" onClick={handleSubmit} id="submitWizardBtn" disabled={loading}>
              {loading ? "Calculating..." : "See Results"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// In-line styles for maximum portability and fast loading without Tailwind
const styles: { [key: string]: React.CSSProperties } = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(3, 7, 18, 0.8)",
    backdropFilter: "blur(8px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: "20px",
  },
  modal: {
    width: "100%",
    maxWidth: "620px",
    padding: "36px",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },
  closeBtn: {
    position: "absolute",
    top: "20px",
    right: "24px",
    background: "transparent",
    border: "none",
    color: "var(--text-secondary)",
    fontSize: "2rem",
    cursor: "pointer",
    lineHeight: "1",
    transition: "color 0.2s ease",
  },
  progressContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginTop: "12px",
  },
  progressTrack: {
    width: "100%",
    height: "6px",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: "3px",
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    background: "linear-gradient(90deg, var(--primary) 0%, var(--accent) 100%)",
    borderRadius: "3px",
    transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  },
  stepsIndicator: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "0.75rem",
    color: "var(--text-muted)",
  },
  stepIndicatorItem: {
    transition: "color 0.3s ease",
  },
  contentBody: {
    minHeight: "220px",
  },
  stepTitle: {
    fontSize: "1.6rem",
    marginBottom: "8px",
    background: "linear-gradient(135deg, #ffffff 0%, var(--text-secondary) 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  stepSubtitle: {
    fontSize: "0.95rem",
    color: "var(--text-secondary)",
    marginBottom: "24px",
  },
  optionsList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  optionButton: {
    width: "100%",
    padding: "16px 20px",
    backgroundColor: "rgba(255, 255, 255, 0.02)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-sm)",
    color: "var(--text-primary)",
    textAlign: "left",
    fontSize: "1rem",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  optionButtonActive: {
    width: "100%",
    padding: "16px 20px",
    backgroundColor: "var(--primary-glow)",
    border: "2px solid var(--primary)",
    borderRadius: "var(--radius-sm)",
    color: "var(--text-primary)",
    textAlign: "left",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
  },
  inputContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  textInput: {
    padding: "16px",
    fontSize: "1.1rem",
  },
  inputWithAddon: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "rgba(10, 14, 26, 0.6)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-sm)",
    overflow: "hidden",
  },
  inputAddon: {
    padding: "0 16px",
    color: "var(--text-muted)",
    fontWeight: "600",
    fontSize: "1rem",
  },
  numberInput: {
    border: "none",
    backgroundColor: "transparent",
    padding: "16px 8px",
    fontSize: "1.1rem",
    width: "100%",
  },
  formGroup: {
    marginBottom: "18px",
  },
  turnstileContainer: {
    marginBottom: "18px",
    padding: "12px",
    backgroundColor: "rgba(255, 255, 255, 0.01)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-sm)",
  },
  turnstileBadge: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  turnstileCheckbox: {
    width: "18px",
    height: "18px",
    cursor: "pointer",
  },
  turnstileLabel: {
    fontSize: "0.82rem",
    color: "var(--text-secondary)",
    cursor: "pointer",
  },
  consentCheckboxContainer: {
    display: "flex",
    alignItems: "flex-start",
    gap: "12px",
    marginTop: "20px",
    padding: "14px",
    backgroundColor: "rgba(255, 255, 255, 0.02)",
    borderRadius: "var(--radius-sm)",
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
    fontSize: "0.82rem",
    color: "var(--text-secondary)",
    cursor: "pointer",
    lineHeight: "1.4",
  },
  modalFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderTop: "1px solid var(--border)",
    paddingTop: "20px",
  },
  errorBanner: {
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    border: "1px solid var(--error)",
    color: "#f87171",
    padding: "12px 16px",
    borderRadius: "var(--radius-sm)",
    fontSize: "0.9rem",
    marginBottom: "16px",
  },
};
