import { useState } from "react";

const purposes = ["Freelance Outreach","Sell a Product","Collaboration","Job Application","Partnership"];

const offerLabels = {
  "Freelance Outreach": "Your Skill (e.g. video editing, web development)",
  "Sell a Product": "Your Product/Service",
  "Collaboration": "Your Channel or Brand",
  "Job Application": "Your Role/Field (e.g. Frontend Developer)",
  "Partnership": "What You Offer",
};

const tones = ["Professional", "Friendly", "Casual", "Bold"];

function parseEmails(text) {
  const parts = text.split(/\n(?=\d+\.)/);
  return parts
    .filter(p => p.trim().length > 20)
    .slice(0, 3)
    .map((body, i) => ({
      title: `Email ${i + 1}`,
      body: body.replace(/^\d+\.\s*/, "").trim(),
    }));
}

const cardStyles = [
  { border: "#1e3a5f", bg: "#0d1f35", badge: "#1e4080", badgeText: "#60a5fa", btn: "#60a5fa", label: "Direct" },
  { border: "#3b1f5e", bg: "#1a0d35", badge: "#4c1d95", badgeText: "#a78bfa", btn: "#a78bfa", label: "Personalized" },
  { border: "#0f3d2e", bg: "#0a2318", badge: "#065f46", badgeText: "#34d399", btn: "#34d399", label: "Problem-Solve" },
];

function EmailCard({ title, body, index }) {
  const [copied, setCopied] = useState(false);
  const s = cardStyles[index];

  const handleCopy = () => {
    navigator.clipboard.writeText(body);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: 16, padding: 20, display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <span style={{ background: s.badge, color: s.badgeText, fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 999 }}>{s.label}</span>
        <button onClick={handleCopy} style={{ color: s.btn, fontSize: 12, background: "none", border: "none", cursor: "pointer", fontWeight: 500 }}>
          {copied ? "✓ Copied" : "Copy"}
        </button>
      </div>
      <p style={{ color: "#6b7280", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>{title}</p>
      <pre style={{ color: "#d1d5db", fontSize: 13, whiteSpace: "pre-wrap", lineHeight: 1.7, flex: 1, margin: 0, fontFamily: "inherit" }}>{body}</pre>
    </div>
  );
}

export default function App() {
  const [form, setForm] = useState({ name: "", purpose: "Freelance Outreach", offer: "", target: "", painPoint: "", tone: "Professional" });
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copiedAll, setCopiedAll] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (!form.name || !form.offer || !form.target || !form.painPoint) { setError("Please fill in all fields."); return; }
    setError(""); setLoading(true); setEmails([]);
    try {
      const res = await fetch("/.netlify/functions/generate", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form),
      });
      const data = await res.json();
console.log("RAW:", data.email);
console.log("PARSED:", parseEmails(data.email));
setEmails(parseEmails(data.email));
    } catch { setError("Something went wrong. Please try again."); }
    setLoading(false);
  };

  const handleCopyAll = () => {
    navigator.clipboard.writeText(emails.map((e, i) => `--- Email ${i+1} ---\n${e.body}`).join("\n\n"));
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const inputStyle = { width: "100%", background: "#1a1d27", border: "1px solid #2d3148", borderRadius: 8, padding: "8px 12px", fontSize: 13, color: "#e5e7eb", outline: "none", boxSizing: "border-box" };
  const labelStyle = { display: "block", fontSize: 11, fontWeight: 500, color: "#9ca3af", marginBottom: 4 };

  return (
    <div style={{ minHeight: "100vh", background: "#0f1117", color: "white", padding: "48px 16px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>

        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <h1 style={{ fontSize: 36, fontWeight: 700, margin: 0 }}>Cold Email Generator</h1>
          <p style={{ color: "#6b7280", marginTop: 8, fontSize: 14 }}>Fill in your details. Get 3 ready-to-send emails instantly.</p>
        </div>

        <div style={{ background: "#161922", border: "1px solid #1f2335", borderRadius: 20, padding: 24, maxWidth: 680, margin: "0 auto 40px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <label style={labelStyle}>Your Name</label>
              <input name="name" placeholder="e.g. Vinay Sharma" onChange={handleChange} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Purpose</label>
              <select name="purpose" onChange={handleChange} style={inputStyle}>
                {purposes.map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>{offerLabels[form.purpose]}</label>
              <input name="offer" placeholder="Be specific" onChange={handleChange} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Who are you targeting?</label>
              <input name="target" placeholder="e.g. YouTubers with 100k+" onChange={handleChange} style={inputStyle} />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={labelStyle}>What problem do you solve?</label>
              <input name="painPoint" placeholder="e.g. they spend too much time editing" onChange={handleChange} style={inputStyle} />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={labelStyle}>Tone</label>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {tones.map(t => (
                  <button key={t} onClick={() => setForm({ ...form, tone: t })}
                    style={{ padding: "6px 16px", borderRadius: 999, fontSize: 12, fontWeight: 500, cursor: "pointer", border: form.tone === t ? "1px solid #3b82f6" : "1px solid #2d3148", background: form.tone === t ? "#3b82f6" : "#1a1d27", color: form.tone === t ? "white" : "#9ca3af", transition: "all 0.15s" }}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {error && <p style={{ color: "#f87171", fontSize: 12, marginTop: 12 }}>{error}</p>}

          <button onClick={handleSubmit} disabled={loading}
            style={{ width: "100%", marginTop: 20, background: loading ? "#1d4ed8" : "#3b82f6", color: "white", border: "none", borderRadius: 10, padding: "11px 0", fontSize: 14, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1 }}>
            {loading ? "Generating..." : "Generate Emails →"}
          </button>
        </div>

        {loading && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {[1,2,3].map(i => (
              <div key={i} style={{ background: "#161922", border: "1px solid #1f2335", borderRadius: 16, padding: 20, height: 200, opacity: 0.6 }}>
                <div style={{ height: 12, background: "#1f2335", borderRadius: 6, width: "40%", marginBottom: 16 }}></div>
                {[1,2,3,4].map(j => <div key={j} style={{ height: 8, background: "#1a1d27", borderRadius: 4, marginBottom: 8, width: j % 2 === 0 ? "80%" : "100%" }}></div>)}
              </div>
            ))}
          </div>
        )}

        {emails.length > 0 && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <p style={{ color: "#9ca3af", fontSize: 13, margin: 0 }}>Your 3 email templates</p>
              <button onClick={handleCopyAll} style={{ fontSize: 12, color: "#60a5fa", background: "none", border: "1px solid #1e3a5f", borderRadius: 999, padding: "5px 14px", cursor: "pointer" }}>
                {copiedAll ? "✓ All Copied" : "Copy All"}
              </button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
              {emails.map((email, i) => <EmailCard key={i} title={email.title} body={email.body} index={i} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}