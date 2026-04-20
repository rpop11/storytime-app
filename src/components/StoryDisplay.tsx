import { useEffect, useRef, useState } from "react";
import "./StoryDisplay.css";

interface Props {
  story: string;
  loading: boolean;
  onReset: () => void;
}

export default function StoryDisplay({ story, loading, onReset }: Props) {
  const [speaking, setSpeaking] = useState(false);
  const [currentWord, setCurrentWord] = useState(-1);
  const hasAutoRead = useRef(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  async function speak(text: string) {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setCurrentWord(-1);
    setSpeaking(true);

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
      audio.ontimeupdate = () => {
        const idx = Math.min(
          Math.floor(audio.currentTime / timePerWord),
          wordList.length - 1
        );
        setCurrentWord(idx);
      };
    };

    audio.onended = () => {
      setSpeaking(false);
      setCurrentWord(-1);
      URL.revokeObjectURL(url);
    };

    audio.play();
  }

  function stop() {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setSpeaking(false);
    setCurrentWord(-1);
  }

  useEffect(() => {
    if (!loading && story && !hasAutoRead.current) {
      hasAutoRead.current = true;
      speak(story);
    }
  }, [loading, story]);

  function handleReset() {
    stop();
    hasAutoRead.current = false;
    onReset();
  }

  function renderStory() {
    const tokens = story.split(/(\s+)/);
    let wordIdx = 0;
    return (
      <p className="story-text">
        {tokens.map((token, i) => {
          if (/^\s+$/.test(token)) return token;
          const thisIdx = wordIdx++;
          return (
            <span
              key={i}
              className={`word${thisIdx === currentWord ? " highlighted" : ""}`}
            >
              {token}
            </span>
          );
        })}
      </p>
    );
  }

  return (
    <div className="story-display">
      <div className="story-scroll">
        {loading && !story && (
          <p className="loading-text">Once upon a time...</p>
        )}
        {story && renderStory()}
        {loading && story && <span className="cursor" />}
      </div>

      <div className="story-actions">
        {!loading && story && (
          <>
            {speaking ? (
              <button className="action-btn stop" onClick={stop}>
                Stop reading
              </button>
            ) : (
              <button className="action-btn speak" onClick={() => speak(story)}>
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
