import "./Picker.css";

interface Props {
  value: string;
  onChange: (v: string) => void;
}

const OPTIONS = [
  { label: "A brave rabbit", emoji: "🐰" },
  { label: "A sleepy bear", emoji: "🐻" },
  { label: "A playful fox", emoji: "🦊" },
  { label: "A tiny dragon", emoji: "🐲" },
  { label: "A friendly unicorn", emoji: "🦄" },
  { label: "A funny robot", emoji: "🤖" },
  { label: "A young witch", emoji: "🧙‍♀️" },
  { label: "A kid hero", emoji: "🦸" },
];

export default function CharacterPicker({ value, onChange }: Props) {
  return (
    <section className="picker-section">
      <h2 className="picker-label">Who is the story about?</h2>
      <div className="picker-grid four-col">
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
