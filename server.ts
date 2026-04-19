import "dotenv/config";
import express from "express";
import Anthropic from "@anthropic-ai/sdk";

const app = express();
app.use(express.json());

const client = new Anthropic(); // reads ANTHROPIC_API_KEY from env

const SYSTEM_PROMPT = `You are a bedtime story teller for young children who are just learning to read.

STORY RULES:
- Use only simple words with 1-2 syllables. No complex vocabulary.
- Keep every sentence to 10 words or fewer.
- Use repetition — repeat key phrases to help early readers follow along.
- Write in a warm, gentle, engaging tone.
- Never include scary, violent, or adult content. No curse words ever.
- The story must always end with a moral — but weave it in naturally. Do not announce it with "The moral of the story is...". Let the characters discover it themselves.

LENGTH:
- 2 min = approximately 150 words
- 5 min = approximately 400 words
- 10 min = approximately 800 words

Write the story only. No titles, no preamble, no "here is your story". Just begin the story directly.`;

app.post("/api/generate-story", async (req, res) => {
  const { characters, setting, vibe, listenTime } = req.body as {
    characters: string;
    setting: string;
    vibe: string;
    listenTime: string;
  };

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const prompt = `Characters: ${characters}
Setting: ${setting}
Vibe: ${vibe}
Listen time: ${listenTime}`;

  const stream = client.messages.stream({
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

app.listen(3001, () => {
  console.log("Storytime API server running on http://localhost:3001");
});
