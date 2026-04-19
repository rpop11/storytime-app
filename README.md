# ✨ Storytime

> A bedtime story generator for young children — built by a dad who loves his daughter but doesn't always have a story ready at 8pm.

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)
![Claude Haiku](https://img.shields.io/badge/Claude%20Haiku-4.5-orange?style=flat)

---

## The Problem

Every night my 5-year-old asks for a bedtime story — complete with specific characters, a setting, and a mood. Coming up with something creative after a long day isn't always easy. **Storytime** lets her pick exactly what she wants, and Claude generates a story written just for her in seconds.

---

## How It Works

1. **Pick a character** — a brave rabbit, a tiny dragon, two best friends, and more
2. **Choose a setting** — a cozy forest, a cloud kingdom, an underwater cave
3. **Set the mood** — silly, magical, brave, or cozy
4. **Pick a listen time** — 2, 5, or 10 minutes
5. Hit **Tell me a story** — Claude streams a custom story live to the screen
6. Tap **Read aloud** — the Web Speech API reads it out loud

All stories use simple 1–2 syllable words, short sentences, gentle repetition, and a moral woven naturally into the ending — designed for early readers age 4–6.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite |
| Language | TypeScript (end to end) |
| Backend | Express (API proxy) |
| AI | Claude Haiku 4.5 via Anthropic SDK (streaming) |
| Speech | Web Speech API (browser native) |

---

## Project Structure

```
storytime/
├── server.ts          # Express backend — handles Anthropic API calls
├── src/
│   ├── App.tsx        # Main canvas and story flow
│   └── components/
│       ├── CharacterPicker.tsx
│       ├── SettingPicker.tsx
│       ├── VibePicker.tsx
│       ├── ListenTimePicker.tsx
│       └── StoryDisplay.tsx   # Streams story + Web Speech controls
```

---

## Run Locally

```bash
git clone https://github.com/rpop11/storytime-app.git
cd storytime-app
npm install
```

Create a `.env` file in the root:

```
ANTHROPIC_API_KEY=your-key-here
```

Start the app:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

> You'll need a free [Anthropic API key](https://console.anthropic.com) to run this locally.

---

## What's Next

- [ ] Auto-read aloud as the story streams in
- [ ] Let kids type in their own custom characters
- [ ] Save and revisit favourite stories
- [ ] Deploy to the web

---

*Built by Rich Poplawski*
