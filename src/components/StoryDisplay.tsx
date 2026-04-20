import { useEffect, useRef, useState } from "react";
import "./StoryDisplay.css";

interface Props {
  story: string;
  loading: boolean;
  onReset: () => void;
}

type AudioState = "idle" | "loading" | "playing" | "paused";

const LOADING_LINES = [
  "Clearing my throat... 🎤",
  "Warming up the storyteller... 📖",
  "Finding my best reading voice... 🎙️",
  "Summoning the narrator... ✨",
  "Getting cozy before we begin... 🕯️",
  "Putting on my storytelling hat... 🎩",
];

export default function StoryDisplay({ story, loading, onReset }: Props) {
  const [audioState, setAudioState] = useState<AudioState>("idle");
  const [currentWord, setCurrentWord] = useState(-1);
  const hasAutoRead = useRef(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const highlightRef = useRef<HTMLSpanElement | null>(null);
  const loadingLine = useRef(
    LOADING_LINES[Math.floor(Math.random() * LOADING_LINES.length)]
  );

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (highlightRef.current) {
      highlightRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [currentWord]);

  async function fetchAndPlay(text: string) {
    audioRef.current?.pause();
    audioRef.current = null;
    setCurrentWord(-1);
    setAudioState("loading");
    loadingLine.current =
      LOADING_LINES[Math.floor(Math.random() * LOADING_LINES.length)];

    const res = await fetch("/api/speak", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    audioRef.current = audio;

    const wordList = text.split(/\s+/);

    audio.onloadedmetadata = () => {
      const timePerWord = audio.duration / wordList.length;
      const LEAD = 0.25; // highlight slightly ahead of audio
      let rafId: number;
      const tick = () => {
        const idx = Math.min(
          Math.floor((audio.currentTime + LEAD) / timePerWord),
          wordList.length - 1
        );
        setCurrentWord(idx);
        rafId = requestAnimationFrame(tick);
      };
      audio.onplay = () => { rafId = requestAnimationFrame(tick); };
      audio.onpause = () => cancelAnimationFrame(rafId);
      audio.onended = () => cancelAnimationFrame(rafId);
    };

    audio.onended = () => {
      setAudioState("idle");
      setCurrentWord(-1);
      URL.revokeObjectURL(url);
    };

    audio.play();
    setAudioState("playing");
  }

  function pause() {
    audioRef.current?.pause();
    setAudioState("paused");
  }

  function resume() {
    audioRef.current?.play();
    setAudioState("playing");
  }

  function stop() {
    audioRef.current?.pause();
    audioRef.current = null;
    setAudioState("idle");
    setCurrentWord(-1);
  }

  useEffect(() => {
    if (!loading && story && !hasAutoRead.current) {
      hasAutoRead.current = true;
      fetchAndPlay(story);
    }
  }, [loading, story]);

  function handleReset() {
    stop();
    hasAutoRead.current = false;
    onReset();
  }

  function renderStory() {
    const paragraphs = story.split(/\n\n+/).filter((p) => p.trim());
    let wordIdx = 0;
    return (
      <>
        {paragraphs.map((para, pi) => {
          const tokens = para.split(/(\s+)/);
          return (
            <p key={pi} className="story-text">
              {tokens.map((token, i) => {
                if (/^\s+$/.test(token)) return token;
                const thisIdx = wordIdx++;
                const isHighlighted = thisIdx === currentWord;
                return (
                  <span
                    key={i}
                    ref={isHighlighted ? highlightRef : null}
                    className={`word${isHighlighted ? " highlighted" : ""}`}
                  >
                    {token}
                  </span>
                );
              })}
            </p>
          );
        })}
      </>
    );
  }

  const isReady = !loading && !!story;
  const busy = audioState === "loading";

  return (
    <div className="story-display">
      {isReady && (
        <div className="story-controls">
          {audioState === "playing" ? (
            <button className="ctrl-btn" onClick={pause}>⏸ Pause</button>
          ) : (
            <button
              className="ctrl-btn"
              onClick={audioState === "paused" ? resume : () => fetchAndPlay(story)}
              disabled={busy}
            >
              ▶ Play
            </button>
          )}
          <button className="ctrl-btn" onClick={stop} disabled={audioState === "idle" || busy}>
            ⏹ Stop
          </button>
          <button className="ctrl-btn" onClick={() => fetchAndPlay(story)} disabled={busy}>
            ↺ Restart
          </button>
          <button className="ctrl-btn new-story" onClick={handleReset}>
            ✦ New Story
          </button>
        </div>
      )}

      <div className="story-scroll">
        {audioState === "loading" && isReady && (
          <p className="audio-loading">{loadingLine.current}</p>
        )}
        {loading && !story && <p className="loading-text">Once upon a time...</p>}
        {story && renderStory()}
        {loading && story && <span className="cursor" />}
      </div>
    </div>
  );
}
