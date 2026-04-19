# Storytime ✨

A bedtime story generator for young children, built by a dad who loves his daughter but doesn't always have a story ready at 8pm.

## The Problem

Every night my 5-year-old asks for a bedtime story — complete with specific characters, a setting, and a vibe. The imagination required isn't always there after a long day. Storytime solves that: she picks what she wants, and Claude generates a story written just for her in seconds.

## What It Does

- Pick a **character**, **setting**, **mood**, and **listen time** (2, 5, or 10 minutes)
- Claude Haiku generates a story using only simple 1–2 syllable words, short sentences, and gentle repetition — designed for early readers
- The story streams live to the screen word by word
- Hit **Read aloud** and the Web Speech API reads the story out loud

## Built With

- **React + Vite** — frontend
- **TypeScript** — end to end
- **Express** — lightweight backend API
- **Anthropic SDK** — Claude Haiku 4.5 with streaming
- **Web Speech API** — browser-native text-to-speech

## Run It Locally

```bash
git clone https://github.com/rpop11/storytime-app.git
cd storytime-app
npm install
```

Create a `.env` file in the root:

```
ANTHROPIC_API_KEY=your-key-here
```

Then start the app:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

> You'll need an [Anthropic API key](https://console.anthropic.com) to run this locally.

## What's Next

- Auto-read aloud as the story streams in
- Let kids type in their own custom characters
- Save favorite stories
- Deploy to the web so she can use it on her own

## Built By

Rich Poplawski — a dad, and a developer.
