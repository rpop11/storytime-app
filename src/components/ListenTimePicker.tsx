import "./Picker.css";

interface Props {
  value: string;
  onChange: (v: string) => void;
}

const OPTIONS = [
  { label: "2 minutes", emoji: "⚡", desc: "a quick tale" },
  { label: "5 minutes", emoji: "🌟", desc: "just right" },
  { label: "10 minutes", emoji: "🌙", desc: "a long adventure" },
];

export default function ListenTimePicker({ value, onChange }: Props) {
  return (
    <section className="picker-section">
      <h2 className="picker-label">How long is the story?</h2>
      <div className="picker-grid time-grid">
        {OPTIONS.map((opt) => (
          <button
            key={opt.label}
            className={`picker-chip time-chip ${value === opt.label ? "selected" : ""}`}
            onClick={() => onChange(opt.label)}
          >
            <span className="chip-emoji big">{opt.emoji}</span>
            <span className="time-label">{opt.label}</span>
            <span className="vibe-desc">{opt.desc}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
