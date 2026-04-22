import "dotenv/config";
import express from "express";
import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(express.json());

const anthropic = new Anthropic();
const openai = new OpenAI();

const SYSTEM_PROMPT = `You are a bedtime story teller for young children who are just learning to read.

STORY RULES:
- Use only simple words with 1-2 syllables. No complex vocabulary.
- Keep every sentence to 10 words or fewer.
- Use repetition — repeat key phrases to help early readers follow along.
- Write in a warm, gentle, engaging tone.
- Never include scary, violent, or adult content. No curse words ever.
- The story must always end with a moral — but weave it in naturally. Do not announce it with "The moral of the story is...". Let the characters discover it themselves.
- Give characters fresh, imaginative names every story. Never reuse names like Lily, Max, Sam, or Benny. Invent new ones each time.

LENGTH:
- Short = approximately 150 words
- Medium = approximately 400 words
- Long = approximately 800 words

FORMAT:
- Break the story into short paragraphs of 3-5 sentences each.
- Leave a blank line between paragraphs.

Write the story only. No titles, no preamble, no "here is your story". Just begin the story directly.`;

app.post("/api/generate-story", async (req, res) => {
  const { characters, goal, setting, vibe, listenTime } = req.body as {
    characters: string;
    goal: string;
    setting: string;
    vibe: string;
    listenTime: string;
  };

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const prompt = `Characters: ${characters}
Goal: ${goal}
Setting: ${setting}
Vibe: ${vibe}
Listen time: ${listenTime}`;

  const stream = anthropic.messages.stream({
    model: "claude-haiku-4-5",
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: prompt }],
  });

  for await (const event of stream) {
    if (
      event.type === "content_block_delta" &&
      event.delta.type === "text_delta"
    ) {
      res.write(`data: ${JSON.stringify({ text: event.delta.text })}\n\n`);
    }
  }

  res.write("data: [DONE]\n\n");
  res.end();
});

app.post("/api/speak", async (req, res) => {
  const { text } = req.body as { text: string };

  const mp3 = await openai.audio.speech.create({
    model: "tts-1",
    voice: "nova",
    input: text,
    speed: 0.79,
  });

  const buffer = Buffer.from(await mp3.arrayBuffer());
  res.setHeader("Content-Type", "audio/mpeg");
  res.setHeader("Content-Length", buffer.length);
  res.send(buffer);
});

// Serve built React app in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "dist")));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(__dirname, "dist", "index.html"));
  });
}

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Storytime server running on port ${port}`);
});
