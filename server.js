const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/generate', async (req, res) => {
  const { userEmail, company, product, tone } = req.body;

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'user',
          content: `Write 3 cold email templates. Sender: ${userEmail}. Target company: ${company}. Product: ${product}. Tone: ${tone}. Keep each email under 150 words.`
        }
      ]
    })
  });
const data = await response.json();
  console.log(JSON.stringify(data, null, 2)); // add this line
  res.json({ email: data.choices[0].message.content });
});

app.listen(3000, () => console.log('Server running on port 3000'));