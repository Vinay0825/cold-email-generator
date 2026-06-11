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

function App() {
  const [form, setForm] = useState({
    name: "",
    purpose: "Freelance Outreach",
    offer: "",
    target: "",
    painPoint: "",
    tone: "Professional",
  });
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setResult("");
    try {
      const response = await fetch(
        "https://soft-truffle-8bf9dd.netlify.app/.netlify/functions/generate",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );
      const data = await response.json();
      setResult(data.email);
    } catch (err) {
      setResult("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
      <div className="bg-white rounded-2xl shadow-md w-full max-w-xl p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Cold Email Generator</h1>
        <p className="text-sm text-gray-500 mb-6">Fill in the details and get 3 ready-to-send cold emails.</p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
            <input
              name="name"
              placeholder="e.g. Vinay Sharma"
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Purpose</label>
            <select
              name="purpose"
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {purposes.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {offerLabels[form.purpose]}
            </label>
            <input
              name="offer"
              placeholder="Be specific"
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Who are you targeting?</label>
            <input
              name="target"
              placeholder="e.g. YouTubers with 100k+ subscribers"
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">What problem do you solve for them?</label>
            <input
              name="painPoint"
              placeholder="e.g. they spend too much time editing videos"
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tone</label>
            <select
              name="tone"
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {tones.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg text-sm transition"
          >
            {loading ? "Generating..." : "Generate Emails"}
          </button>
        </div>

        {result && (
          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-sm font-semibold text-gray-700">Generated Emails</h2>
              <button
                onClick={handleCopy}
                className="text-xs text-blue-600 hover:underline"
              >
                {copied ? "Copied!" : "Copy All"}
              </button>
            </div>
            <pre className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-700 whitespace-pre-wrap">
              {result}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;