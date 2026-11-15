"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatDay, formatDayShort } from "@/lib/admin-analytics-dashboard";

export type DailyPoint = {
  day: string;
  value: number | null;
  previous?: number | null;
};

/** Grafico giornaliero (giorni di calendario Europe/Rome). Il periodo precedente e' allineato per indice. */
export default function DailyChart({
  title,
  data,
  hasPrevious,
}: {
  title: string;
  data: DailyPoint[];
  hasPrevious: boolean;
}) {
  const total = data.reduce((a, p) => a + (p.value ?? 0), 0);
  return (
    <figure style={{ margin: 0 }}>
      <div
        role="img"
        aria-label={`${title}: andamento giornaliero, ${data.length} giorni, totale ${total}`}
        style={{ width: "100%", height: 240 }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 8, right: 12, bottom: 0, left: -8 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="day"
              tickFormatter={formatDayShort}
              tick={{ fontSize: 11 }}
              interval="preserveStartEnd"
              minTickGap={24}
            />
            <YAxis allowDecimals={false} tick={{ fontSize: 11 }} width={44} />
            <Tooltip labelFormatter={(d) => formatDay(String(d))} />
            {hasPrevious ? <Legend /> : null}
            <Line
              type="monotone"
              dataKey="value"
              name="Periodo selezionato"
              stroke="#2563eb"
              strokeWidth={2}
              dot={data.length <= 31}
              connectNulls={false}
              isAnimationActive={false}
            />
            {hasPrevious ? (
              <Line
                type="monotone"
                dataKey="previous"
                name="Periodo precedente"
                stroke="#94a3b8"
                strokeWidth={2}
                strokeDasharray="5 4"
                dot={false}
                connectNulls={false}
                isAnimationActive={false}
              />
            ) : null}
          </LineChart>
        </ResponsiveContainer>
      </div>
      <figcaption style={{ fontSize: 12, color: "#475569", marginTop: 4 }}>
        Giorni di calendario Europe/Rome.{" "}
        {hasPrevious
          ? "Linea tratteggiata: periodo precedente di pari durata."
          : "Confronto col periodo precedente non disponibile per questa serie."}
      </figcaption>
    </figure>
  );
}
