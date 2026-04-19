# Storytime

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)
![Claude Haiku](https://img.shields.io/badge/Claude%20Haiku-4.5-orange?style=flat)

My daughter asks for a bedtime story every night. She wants specific characters, a specific setting, a specific mood. Coming up with something good after a long day is hard. So I built this.

Storytime lets her pick what she wants. Claude Haiku generates a story that fits. The Web Speech API reads it out loud. She gets her story. I get to actually be present instead of stalling for time.

---

## How It Works

She picks four things: a character, a setting, a mood, and how long she wants the story. She hits the button. Claude streams a story to the screen in real time, written with words a 5-year-old can follow. Short sentences. Simple words. A lesson at the end that she figures out herself.

Then she hits Read aloud and the browser reads it to her.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite |
| Language | TypeScript |
| Backend | Express |
| AI | Claude Haiku 4.5, Anthropic SDK, streaming |
| Speech | Web Speech API |

---

## Project Structure

```
storytime/
├── server.ts          # Express backend, handles Anthropic API calls
├── src/
│   ├── App.tsx        # Main canvas and story flow
│   └── components/
│       ├── CharacterPicker.tsx
│       ├── SettingPicker.tsx
│       ├── VibePicker.tsx
│       ├── ListenTimePicker.tsx
│       └── StoryDisplay.tsx   # Streams story, Web Speech controls
```

---

## Run Locally

```bash
git clone https://github.com/rpop11/storytime-app.git
cd storytime-app
npm install
```

Add a `.env` file in the root:

```
ANTHROPIC_API_KEY=your-key-here
```

Start it:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). You'll need an [Anthropic API key](https://console.anthropic.com) to run it.

---

## What's Next

- Auto-read as the story streams, not after
- Let kids type in their own characters
- Save favourite stories
- Put it on the web

---

*Built by Rich Poplawski*
