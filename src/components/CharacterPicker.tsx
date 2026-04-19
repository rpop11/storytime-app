import "./Picker.css";

interface Props {
  value: string;
  onChange: (v: string) => void;
}

const OPTIONS = [
  { label: "A brave little rabbit", emoji: "🐰" },
  { label: "A sleepy bear cub", emoji: "🐻" },
  { label: "A playful fox kit", emoji: "🦊" },
  { label: "A tiny dragon", emoji: "🐲" },
  { label: "A kind young witch", emoji: "🧙‍♀️" },
  { label: "Two best friends", emoji: "👫" },
];

export default function CharacterPicker({ value, onChange }: Props) {
  return (
    <section className="picker-section">
      <h2 className="picker-label">Who is in the story?</h2>
      <div className="picker-grid">
        {OPTIONS.map((opt) => (
          <button
            key={opt.label}
            className={`picker-chip ${value === opt.label ? "selected" : ""}`}
            onClick={() => onChange(opt.label)}
          >
            <span className="chip-emoji">{opt.emoji}</span>
            <span>{opt.label}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
