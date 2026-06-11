exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
      body: '',
    };
  }

  const { name, purpose, offer, target, painPoint, tone } = JSON.parse(event.body);

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
          content: `You are a cold email expert. Write 3 cold email templates for the following situation:
- Sender name: ${name}
- Purpose: ${purpose}
- What they offer: ${offer}
- Who they are targeting: ${target}
- Problem they solve: ${painPoint}
- Tone: ${tone}

Each email should have a subject line, be under 150 words, and feel human. Number them clearly.`
        }
      ]
    })
  });

  const data = await response.json();

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
    body: JSON.stringify({ email: data.choices[0].message.content })
  };
};