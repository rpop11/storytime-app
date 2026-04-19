import "./Picker.css";

interface Props {
  value: string;
  onChange: (v: string) => void;
}

const OPTIONS = [
  { label: "A cozy forest", emoji: "🌲" },
  { label: "A cloud kingdom", emoji: "☁️" },
  { label: "An underwater cave", emoji: "🌊" },
  { label: "A snowy mountain", emoji: "🏔️" },
  { label: "A secret garden", emoji: "🌸" },
  { label: "A moonlit meadow", emoji: "🌙" },
];

export default function SettingPicker({ value, onChange }: Props) {
  return (
    <section className="picker-section">
      <h2 className="picker-label">Where does it happen?</h2>
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
