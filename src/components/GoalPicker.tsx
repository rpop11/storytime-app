import "./Picker.css";

interface Props {
  value: string;
  onChange: (v: string) => void;
}

const OPTIONS = [
  { label: "Find something lost", emoji: "🔍" },
  { label: "Help a friend", emoji: "🤝" },
  { label: "Go on an adventure", emoji: "🗺️" },
  { label: "Solve a mystery", emoji: "🕵️" },
  { label: "Save the day", emoji: "⭐" },
];

export default function GoalPicker({ value, onChange }: Props) {
  return (
    <section className="picker-section">
      <h2 className="picker-label">What are they trying to do?</h2>
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
