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
  const blocks = text.split(/\*\*Template \d+[^*]*\*\*/g).filter(Boolean);
  const titles = [...text.matchAll(/\*\*Template \d+[^*]*\*\*/g)].map(m => m[0].replace(/\*\*/g, ""));
  return blocks.map((body, i) => ({
    title: titles[i] || `Email ${i + 1}`,
    body: body.trim(),
  }));
}

function EmailCard({ title, body }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(body);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
        <button
          onClick={handleCopy}
          className="text-xs text-blue-600 hover:underline"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <pre className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed">{body}</pre>
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

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Cold Email Generator</h1>
          <p className="text-sm text-gray-500 mt-1">Get 3 ready-to-send cold emails in seconds.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
            <input name="name" placeholder="e.g. Vinay Sharma" onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Purpose</label>
            <select name="purpose" onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              {purposes.map(p => <option key={p}>{p}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{offerLabels[form.purpose]}</label>
            <input name="offer" placeholder="Be specific" onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Who are you targeting?</label>
            <input name="target" placeholder="e.g. YouTubers with 100k+ subscribers" onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">What problem do you solve for them?</label>
            <input name="painPoint" placeholder="e.g. they spend too much time editing" onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tone</label>
            <select name="tone" onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              {tones.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button onClick={handleSubmit} disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-2 rounded-lg text-sm transition">
            {loading ? "Generating..." : "Generate Emails"}
          </button>
        </div>

        {loading && (
          <div className="space-y-4">
            {[1,2,3].map(i => (
              <div key={i} className="bg-white border border-gray-200 rounded-xl p-5 animate-pulse">
                <div className="h-3 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="space-y-2">
                  <div className="h-2 bg-gray-100 rounded"></div>
                  <div className="h-2 bg-gray-100 rounded w-5/6"></div>
                  <div className="h-2 bg-gray-100 rounded w-4/6"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {emails.length > 0 && (
          <div className="space-y-4">
            {emails.map((email, i) => (
              <EmailCard key={i} title={email.title} body={email.body} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;