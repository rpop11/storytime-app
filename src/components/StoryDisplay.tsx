import { useEffect, useRef, useState } from "react";
import "./StoryDisplay.css";

interface Props {
  story: string;
  loading: boolean;
  onReset: () => void;
}

export default function StoryDisplay({ story, loading, onReset }: Props) {
  const [speaking, setSpeaking] = useState(false);
  const hasAutoRead = useRef(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  async function speak(text: string) {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

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

    audio.onended = () => {
      setSpeaking(false);
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
