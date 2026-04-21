import { useRef, useState } from "react";
import CharacterPicker from "./components/CharacterPicker";
import GoalPicker from "./components/GoalPicker";
import SettingPicker from "./components/SettingPicker";
import VibePicker from "./components/VibePicker";
import ListenTimePicker from "./components/ListenTimePicker";
import StoryDisplay from "./components/StoryDisplay";
import "./App.css";

export interface StoryConfig {
  characters: string;
  goal: string;
  setting: string;
  vibe: string;
  listenTime: string;
}

const DEFAULT_CONFIG: StoryConfig = {
  characters: "",
  goal: "",
  setting: "",
  vibe: "",
  listenTime: "",
};

export default function App() {
  const [config, setConfig] = useState<StoryConfig>(DEFAULT_CONFIG);
  const [story, setStory] = useState("");
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const unlockedAudioRef = useRef<HTMLAudioElement | null>(null);

  const update = (key: keyof StoryConfig, value: string) =>
    setConfig((c) => ({ ...c, [key]: value }));

  const isReady =
    config.characters &&
    config.goal &&
    config.setting &&
    config.vibe &&
    config.listenTime;

  async function handleGenerate() {
    if (!isReady) return;
    // Pre-unlock HTMLAudioElement for iOS — must be called inside a user gesture
    const silent = new Audio("data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA");
    silent.play().catch(() => {});
    unlockedAudioRef.current = silent;
    setLoading(true);
    setStory("");
    setStarted(true);

    const res = await fetch("/api/generate-story", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(config),
    });

    const reader = res.body!.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const lines = decoder.decode(value).split("\n");
      for (const line of lines) {
        if (!line.startsWith("data: ")) continue;
        const data = line.slice(6);
        if (data === "[DONE]") break;
        try {
          const { text } = JSON.parse(data);
          setStory((s) => s + text);
        } catch {
          // ignore parse errors
        }
      }
    }

    setLoading(false);
  }

  function handleReset() {
    setConfig(DEFAULT_CONFIG);
    setStory("");
    setStarted(false);
    setLoading(false);
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Storytime</h1>
        <p className="tagline">Let's make your story! 📖</p>
      </header>

      {!started ? (
        <main className="picker-canvas">
          <CharacterPicker
            value={config.characters}
            onChange={(v) => update("characters", v)}
          />
          <GoalPicker
            value={config.goal}
            onChange={(v) => update("goal", v)}
          />
          <SettingPicker
            value={config.setting}
            onChange={(v) => update("setting", v)}
          />
          <VibePicker
            value={config.vibe}
            onChange={(v) => update("vibe", v)}
          />
          <ListenTimePicker
            value={config.listenTime}
            onChange={(v) => update("listenTime", v)}
          />

          <button
            className={`generate-btn ${isReady ? "ready" : "disabled"}`}
            onClick={handleGenerate}
            disabled={!isReady}
          >
            {isReady ? "Start the adventure! 🚀" : "Pick all 5 to begin..."}
          </button>
        </main>
      ) : (
        <StoryDisplay
          story={story}
          loading={loading}
          onReset={handleReset}
          unlockedAudioRef={unlockedAudioRef}
        />
      )}
    </div>
  );
}
