import { useEffect, useRef, useState } from "react";
import "./StoryDisplay.css";

interface Props {
  story: string;
  loading: boolean;
  onReset: () => void;
}

function getBestVoice(): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices();
  const preferred = [
    "Samantha",
    "Karen",
    "Moira",
    "Tessa",
    "Fiona",
    "Daniel",
    "Martha",
  ];
  for (const name of preferred) {
    const match = voices.find((v) => v.name.includes(name));
    if (match) return match;
  }
  // fall back to first English voice
  return voices.find((v) => v.lang.startsWith("en")) ?? null;
}

function speak(text: string) {
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.78;
  utterance.pitch = 1.15;
  const voice = getBestVoice();
  if (voice) utterance.voice = voice;
  window.speechSynthesis.speak(utterance);
}

export default function StoryDisplay({ story, loading, onReset }: Props) {
  const [speaking, setSpeaking] = useState(false);
  const hasAutoRead = useRef(false);

  // Auto-read when streaming finishes
  useEffect(() => {
    if (!loading && story && !hasAutoRead.current) {
      hasAutoRead.current = true;
      // voices may not be loaded yet — wait a tick
      setTimeout(() => {
        speak(story);
        setSpeaking(true);
      }, 400);
    }
  }, [loading, story]);

  // Keep speaking state in sync with the browser
  useEffect(() => {
    if (!speaking) return;
    const interval = setInterval(() => {
      if (!window.speechSynthesis.speaking) {
        setSpeaking(false);
      }
    }, 500);
    return () => clearInterval(interval);
  }, [speaking]);

  function handleSpeak() {
    speak(story);
    setSpeaking(true);
  }

  function handleStop() {
    window.speechSynthesis.cancel();
    setSpeaking(false);
  }

  function handleReset() {
    window.speechSynthesis.cancel();
    setSpeaking(false);
    hasAutoRead.current = false;
    onReset();
  }

  return (
    <div className="story-display">
      <div className="story-scroll">
        {loading && !story && (
          <p className="loading-text">Once upon a time...</p>
        )}
        {story && <p className="story-text">{story}</p>}
        {loading && story && <span className="cursor" />}
      </div>

      <div className="story-actions">
        {!loading && story && (
          <>
            {speaking ? (
              <button className="action-btn stop" onClick={handleStop}>
                Stop reading
              </button>
            ) : (
              <button className="action-btn speak" onClick={handleSpeak}>
                Read again
              </button>
            )}
          </>
        )}
        <button className="action-btn reset" onClick={handleReset}>
          New story
        </button>
      </div>
    </div>
  );
}
