import OpenAI from "openai";
import { env } from "../../config/env.js";

let client = null;
function getClient() {
  if (!client) client = new OpenAI({ apiKey: env.llm.apiKey });
  return client;
}

export async function generateQuestions({ interviewType, role, difficulty, count }) {
  const prompt = `Generate ${count} ${difficulty.toLowerCase()} ${interviewType.toLowerCase()} interview questions for a ${role} candidate. Return ONLY a JSON array of strings, no other text.`;

  const completion = await getClient().chat.completions.create({
    model: env.llm.model || "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
  });

  const parsed = JSON.parse(completion.choices[0].message.content);
  return Array.isArray(parsed) ? parsed : parsed.questions || [];
}

export async function scoreAnswer({ question, answer }) {
  const prompt = `You are evaluating a technical interview answer.
Question: ${question}
Answer: ${answer || "(no answer provided)"}

Score it 0-100 on correctness, technicalDepth, and clarity. Return ONLY JSON: {"correctness": number, "technicalDepth": number, "clarity": number, "notes": "one sentence"}`;

  const completion = await getClient().chat.completions.create({
    model: env.llm.model || "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
  });

  return JSON.parse(completion.choices[0].message.content);
}