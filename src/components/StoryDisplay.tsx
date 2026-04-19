import "./StoryDisplay.css";

interface Props {
  story: string;
  loading: boolean;
  onReset: () => void;
}

export default function StoryDisplay({ story, loading, onReset }: Props) {
  function handleSpeak() {
    if (!story || loading) return;
    const utterance = new SpeechSynthesisUtterance(story);
    utterance.rate = 0.85;
    utterance.pitch = 1.1;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }

  function handleStop() {
    window.speechSynthesis.cancel();
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
            <button className="action-btn speak" onClick={handleSpeak}>
              Read aloud
            </button>
            <button className="action-btn stop" onClick={handleStop}>
              Stop
            </button>
          </>
        )}
        <button className="action-btn reset" onClick={onReset}>
          New story
        </button>
      </div>
    </div>
  );
}
