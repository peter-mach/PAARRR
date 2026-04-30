import { CountUp } from "@/components/charts/count-up";

type StatProps = {
  label: string;
  value: number;
  suffix?: string;
};

export function Stat({ label, value, suffix = "" }: StatProps) {
  return (
    <div>
      <div className="num-display" style={{ fontSize: 28, color: "white" }}>
        <CountUp value={value} duration={1200} delay={400} />
        {suffix}
      </div>
      <div
        style={{
          fontSize: 11,
          color: "rgba(255,255,255,0.5)",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          fontWeight: 700,
          marginTop: 4,
        }}
      >
        {label}
      </div>
    </div>
  );
}
