import "./Picker.css";

interface Props {
  value: string;
  onChange: (v: string) => void;
}

const OPTIONS = [
  { label: "Silly", emoji: "😄", desc: "laughs and giggles" },
  { label: "Magical", emoji: "✨", desc: "spells and wonder" },
  { label: "Brave", emoji: "🛡️", desc: "daring adventures" },
  { label: "Cozy", emoji: "🧸", desc: "warm and snuggly" },
];

export default function VibePicker({ value, onChange }: Props) {
  return (
    <section className="picker-section">
      <h2 className="picker-label">What kind of story is it?</h2>
      <div className="picker-grid vibe-grid">
        {OPTIONS.map((opt) => (
          <button
            key={opt.label}
            className={`picker-chip vibe-chip ${value === opt.label ? "selected" : ""}`}
            onClick={() => onChange(opt.label)}
          >
            <span className="chip-emoji big">{opt.emoji}</span>
            <span className="vibe-name">{opt.label}</span>
            <span className="vibe-desc">{opt.desc}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
