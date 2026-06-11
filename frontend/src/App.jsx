import { useState } from "react";

function App() {
  const [form, setForm] = useState({
    userEmail: "",
    company: "",
    product: "",
    tone: "professional",
  });
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  
const handleSubmit = async () => {
  setLoading(true);
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
    console.log(data);
    setResult(data.email);
  } catch (err) {
    console.log("Error:", err);
  }
  setLoading(false);
};

  return (
    <div style={{ maxWidth: "600px", margin: "40px auto", padding: "20px" }}>
      <h1>Cold Email Generator</h1>

      <input name="userEmail" placeholder="Your Email" onChange={handleChange} style={{ display: "block", width: "100%", marginBottom: "10px", padding: "8px" }} />
      <input name="company" placeholder="Target Company" onChange={handleChange} style={{ display: "block", width: "100%", marginBottom: "10px", padding: "8px" }} />
      <input name="product" placeholder="Your Product" onChange={handleChange} style={{ display: "block", width: "100%", marginBottom: "10px", padding: "8px" }} />
      <select name="tone" onChange={handleChange} style={{ display: "block", width: "100%", marginBottom: "10px", padding: "8px" }}>
        <option value="professional">Professional</option>
        <option value="friendly">Friendly</option>
        <option value="casual">Casual</option>
      </select>

      <button onClick={handleSubmit} style={{ padding: "10px 20px", cursor: "pointer" }}>
        {loading ? "Generating..." : "Generate Emails"}
      </button>

      {result && (
        <pre style={{ marginTop: "20px", whiteSpace: "pre-wrap", background: "#f4f4f4", padding: "15px" }}>
          {result}
        </pre>
      )}
    </div>
  );
}

export default App;