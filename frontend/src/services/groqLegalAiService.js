/**
 * NyayaSetu — Groq Llama-3 AI Legal Assistant Service
 * Powered by Groq Ultra-Fast Llama-3 70B Inference Engine.
 * Provides real-time Indian statutory rights breakdown & legal notice generation.
 */

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

/**
 * Sends legal query to Groq Llama-3 API
 * @param {string} userPrompt
 * @param {string} categoryTitle
 * @returns {Promise<string>} AI Legal Response
 */
export async function queryGroqLegalAI(userPrompt, categoryTitle = 'General Indian Law') {
  if (!GROQ_API_KEY) {
    throw new Error('Groq API Key missing');
  }

  const systemPrompt = `You are NyayaSetu AI, an expert AI Legal Assistant grounded strictly in Indian Law (Constitution of India, Bharatiya Nyaya Sanhita / IPC, BNSS / CrPC, Consumer Protection Act 2019, RBI Ombudsman Rules, IT Act 2000, Model Tenancy Act, MSMED Act 2006).
Your task is to provide clear, actionable legal advice for everyday Indian citizens facing legal issues in "${categoryTitle}".

Guidelines:
1. Specify exact Indian Acts, Sections, and statutory deadlines (e.g. 3-day RBI zero liability, 45-day MSME interest rule, 15-day notice response time).
2. Outline step-by-step legal recourse (e.g. Police Station / Cyber Portal / e-Daakhil / Banking Ombudsman).
3. Always include official helpline numbers (e.g. 1930 Cyber, 1915 Consumer, 14448 RBI, 15100 NALSA).
4. Maintain a reassuring, professional tone. Keep responses structured with headings and bullet points.`;

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.3,
        max_tokens: 1024,
      }),
    });

    if (!response.ok) {
      // Fallback to llama3-70b-8192 if model name varies
      const fallbackResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama3-70b-8192',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          temperature: 0.3,
          max_tokens: 1024,
        }),
      });

      if (!fallbackResponse.ok) {
        throw new Error(`Groq API returned HTTP ${response.status}`);
      }

      const fallbackData = await fallbackResponse.json();
      return fallbackData.choices[0]?.message?.content || 'No response generated.';
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || 'No response generated.';
  } catch (err) {
    console.error('Groq AI Service Error:', err);
    throw err;
  }
}
