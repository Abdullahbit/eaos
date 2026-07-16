/**
 * Funnel Analytics Event tracking helper.
 * Generates an anonymous session ID and records events to the backend.
 */

// Retrieve or generate anonymous session ID
export function getSessionId(): string {
  if (typeof window === "undefined") return "";
  let sessionId = sessionStorage.getItem("ci_session_id");
  if (!sessionId) {
    sessionId = "anon_" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    sessionStorage.setItem("ci_session_id", sessionId);
  }
  return sessionId;
}

export async function trackEvent(eventName: string): Promise<void> {
  if (typeof window === "undefined") return;

  const sessionId = getSessionId();

  // Extract UTM parameters from URL query string
  const urlParams = new URLSearchParams(window.location.search);
  const utm_source = urlParams.get("utm_source") || undefined;
  const utm_medium = urlParams.get("utm_medium") || undefined;
  const utm_campaign = urlParams.get("utm_campaign") || undefined;

  const payload = {
    session_id: sessionId,
    event_name: eventName,
    utm_source,
    utm_medium,
    utm_campaign,
  };

  try {
    await fetch("http://localhost:8000/api/analytics/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    // Fail silently in frontend to ensure analytics outages do not interrupt user journey
    console.warn("Analytics event tracking failed:", error);
  }
}
