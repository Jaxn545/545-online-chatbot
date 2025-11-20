// api/chat.js

import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `
You are the 545 Online Assistant — a friendly, knowledgeable chatbot for 545 Online.
Use this behavior:

- Explain clearly what 545 Online does: fast, affordable, AI-assisted websites for small businesses.
- Help visitors pick between Basic / Plus / Premium based on their needs.
- Offer to schedule a free consultation or fill out the intake form.
- Keep answers short first; offer more detail only if asked.
- When unsure, say you’ll have the team follow up and collect name + email + phone.
- Only talk about 545 Online. Don’t answer legal/medical/tax/unrelated coding questions.
- Always end with a clear next step: “See plans”, “Book a call”, or “Send your details”.
`;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const completion = await client.chat.completions.create({
      model: "gpt-5-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: message },
      ],
      max_tokens: 400,
    });

    const reply =
      completion.choices?.[0]?.message?.content?.trim() ||
      "Sorry, I couldn’t generate a response.";

    return res.status(200).json({ reply });
  } catch (err) {
    console.error("Chat API error:", err);
    return res
      .status(500)
      .json({ error: "Something went wrong. Please try again later." });
  }
}
