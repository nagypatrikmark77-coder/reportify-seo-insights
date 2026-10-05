import { useState } from 'react';
import { Area, CartesianGrid, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Button } from '@/components/ui/button';
import { number, trafficData, type ReportType } from '@/lib/report-data';

export function ReportChart({ type, earlier }: { type: ReportType; earlier: boolean }) {
  const [metric, setMetric] = useState<'clicks' | 'impressions'>('clicks');
  const multiplier = metric === 'impressions' ? 22 : 1;
  const data = trafficData(type, earlier).map(row => ({ ...row, current: row.current * multiplier, previous: row.previous * multiplier }));
  return <>
    <div className="chart-heading"><div><h2>Organikus forgalom</h2><p>Ennyien találtak rád a Google keresőből.</p></div><div className="segment"><Button size="sm" variant={metric === 'clicks' ? 'active' : 'ghost'} onClick={() => setMetric('clicks')}>Kattintások</Button><Button size="sm" variant={metric === 'impressions' ? 'active' : 'ghost'} onClick={() => setMetric('impressions')}>Megjelenések</Button></div></div>
    <div className="chart-legend"><span><i className="legend-current" />Aktuális időszak</span><span><i className="legend-previous" />Előző időszak</span></div>
    <div className="traffic-chart" role="img" aria-label={`${metric === 'clicks' ? 'Kattintások' : 'Megjelenések'} összehasonlítása az előző időszakkal`}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 10, right: 14, bottom: 0, left: -16 }}>
          <defs><linearGradient id="traffic-fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--brand-blue)" stopOpacity={0.16}/><stop offset="100%" stopColor="var(--brand-blue)" stopOpacity={0.01}/></linearGradient></defs>
          <CartesianGrid stroke="var(--border)" strokeDasharray="3 5" vertical={false}/>
          <XAxis dataKey="label" axisLine={false} tickLine={false} minTickGap={55} tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }} dy={9}/>
          <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }} tickFormatter={v => number(v)}/>
          <Tooltip content={({ active, payload, label }) => active && payload?.length ? <div className="chart-tooltip"><strong>{label}</strong>{payload.map(p => <span key={p.dataKey}>{p.dataKey === 'current' ? 'Aktuális' : 'Előző'}: <b>{number(Number(p.value))}</b></span>)}</div> : null}/>
          <Line type="monotone" dataKey="previous" stroke="var(--chart-previous)" strokeWidth={2} strokeDasharray="5 5" dot={false} activeDot={{ r: 4 }}/>
          <Area type="monotone" dataKey="current" stroke="var(--brand-blue)" strokeWidth={2.5} fill="url(#traffic-fill)" dot={false} activeDot={{ r: 5 }}/>
        </ComposedChart>
      </ResponsiveContainer>
    </div>
    <div className="chart-footer"><span className="source-dot"/>Google Search Console <span>Mintaadatok · előző azonos hosszúságú időszakhoz képest</span></div>
  </>;
}