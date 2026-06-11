import { useState } from "react";

const purposes = [
  "Freelance Outreach",
  "Sell a Product",
  "Collaboration",
  "Job Application",
  "Partnership",
];

const offerLabels = {
  "Freelance Outreach": "Your Skill (e.g. video editing, web development)",
  "Sell a Product": "Your Product/Service",
  "Collaboration": "Your Channel or Brand",
  "Job Application": "Your Role/Field (e.g. Frontend Developer)",
  "Partnership": "What You Offer",
};

const tones = ["Professional", "Friendly", "Casual", "Bold"];

function parseEmails(text) {
  const parts = text.split(/(?=\*\*Template \d+)/);
  return parts
    .filter(p => p.trim())
    .map((block, i) => ({
      title: `Email ${i + 1}`,
      body: block.replace(/\*\*Template \d+[^*]*\*\*/, "").trim(),
    }));
}

function EmailCard({ title, body, index }) {
  const [copied, setCopied] = useState(false);
  const colors = [
    "from-blue-50 to-white border-blue-100",
    "from-purple-50 to-white border-purple-100",
    "from-emerald-50 to-white border-emerald-100",
  ];
  const badgeColors = [
    "bg-blue-100 text-blue-700",
    "bg-purple-100 text-purple-700",
    "bg-emerald-100 text-emerald-700",
  ];
  const copyBtnColors = [
    "text-blue-600 hover:text-blue-800",
    "text-purple-600 hover:text-purple-800",
    "text-emerald-600 hover:text-emerald-800",
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText(body);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`flex flex-col bg-gradient-to-b ${colors[index]} border rounded-2xl p-5 shadow-sm h-full`}>
      <div className="flex justify-between items-start mb-3">
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${badgeColors[index]}`}>
          {index === 0 ? "Direct" : index === 1 ? "Personalized" : "Problem-Solve"}
        </span>
        <button onClick={handleCopy} className={`text-xs font-medium ${copyBtnColors[index]} transition`}>
          {copied ? "✓ Copied" : "Copy"}
        </button>
      </div>
      <h3 className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">
        {title}
      </h3>
      <pre className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed flex-1">
        {body}
      </pre>
    </div>
  );
}

function App() {
  const [form, setForm] = useState({
    name: "",
    purpose: "Freelance Outreach",
    offer: "",
    target: "",
    painPoint: "",
    tone: "Professional",
  });
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copiedAll, setCopiedAll] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.name || !form.offer || !form.target || !form.painPoint) {
      setError("Please fill in all fields.");
      return;
    }
    setError("");
    setLoading(true);
    setEmails([]);
    try {
      const response = await fetch("/.netlify/functions/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      setEmails(parseEmails(data.email));
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  const handleCopyAll = () => {
    const all = emails.map((e, i) => `--- Email ${i + 1} ---\n${e.body}`).join("\n\n");
    navigator.clipboard.writeText(all);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white px-4 py-12">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold tracking-tight">Cold Email Generator</h1>
          <p className="text-gray-400 mt-2 text-sm">Fill in your details. Get 3 ready-to-send emails instantly.</p>
        </div>

        {/* Form */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 max-w-2xl mx-auto mb-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Your Name</label>
              <input name="name" placeholder="e.g. Vinay Sharma" onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Purpose</label>
              <select name="purpose" onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                {purposes.map(p => <option key={p}>{p}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">{offerLabels[form.purpose]}</label>
              <input name="offer" placeholder="Be specific" onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Who are you targeting?</label>
              <input name="target" placeholder="e.g. YouTubers with 100k+" onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-gray-400 mb-1">What problem do you solve?</label>
              <input name="painPoint" placeholder="e.g. they spend too much time editing videos" onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-gray-400 mb-1">Tone</label>
              <div className="flex gap-2 flex-wrap">
                {tones.map(t => (
                  <button key={t} onClick={() => setForm({ ...form, tone: t })}
                    className={`px-4 py-1.5 rounded-full text-xs font-medium border transition ${form.tone === t ? "bg-blue-600 border-blue-600 text-white" : "bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-500"}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {error && <p className="text-red-400 text-xs mt-3">{error}</p>}

          <button onClick={handleSubmit} disabled={loading}
            className="w-full mt-5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-2.5 rounded-lg text-sm transition">
            {loading ? "Generating..." : "Generate Emails →"}
          </button>
        </div>

        {/* Skeletons */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl p-5 animate-pulse h-64">
                <div className="h-3 bg-gray-700 rounded w-1/3 mb-4"></div>
                <div className="space-y-2">
                  <div className="h-2 bg-gray-800 rounded"></div>
                  <div className="h-2 bg-gray-800 rounded w-5/6"></div>
                  <div className="h-2 bg-gray-800 rounded w-4/6"></div>
                  <div className="h-2 bg-gray-800 rounded w-5/6"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Email Cards */}
        {emails.length > 0 && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-sm font-semibold text-gray-300">Your 3 Email Templates</h2>
              <button onClick={handleCopyAll}
                className="text-xs font-medium text-blue-400 hover:text-blue-300 border border-blue-800 px-3 py-1.5 rounded-full transition">
                {copiedAll ? "✓ All Copied" : "Copy All"}
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {emails.map((email, i) => (
                <EmailCard key={i} title={email.title} body={email.body} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;