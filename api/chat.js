import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  try {
    const { message, context } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Missing user message." });
    }

    const response = await client.chat.completions.create({
      model: "gpt-5-mini", // Cheap + fast for chatbots
      messages: [
        {
          role: "system",
          content: `
You are the official AI Assistant for 545 Online, a friendly, helpful representative that guides small business owners about services, pricing, and how to get started. 
Always speak like a local expert — warm, confident, and professional. 
Never mention you're AI unless asked. 
If you’re unsure, say: “I might not have that info handy, but I can ask the team! Can I get your name and number so we can follow up?”
Keep replies concise and offer a clear next step (book, call, or message).
          `,
        },
        { role: "user", content: message },
      ],
    });

    const botReply = response.choices[0].message.content.trim();
    return res.status(200).json({ reply: botReply });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}
