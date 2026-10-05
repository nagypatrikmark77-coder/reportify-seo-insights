export type ReportType = "monthly" | "quarterly";
export type Report = {
  id: string;
  client: string;
  domain: string;
  type: ReportType;
  period: string;
  status: "draft" | "ready";
};
export const initialReports: Report[] = [
  {
    id: "taskas-09",
    client: "Táskás",
    domain: "taskas.hu",
    type: "monthly",
    period: "2026. szeptember",
    status: "ready",
  },
  {
    id: "taskas-08",
    client: "Táskás",
    domain: "taskas.hu",
    type: "monthly",
    period: "2026. augusztus",
    status: "ready",
  },
  {
    id: "otthon-q3",
    client: "Otthon & Kert",
    domain: "otthonkert.example",
    type: "quarterly",
    period: "2026. III. negyedév",
    status: "draft",
  },
];
export const keywords = [
  { keyword: "iskolatáska", before: 18, after: 7, volume: 12100, clicks: 486 },
  { keyword: "női hátizsák", before: 14, after: 5, volume: 4400, clicks: 312 },
  { keyword: "ergonomikus iskolatáska", before: 22, after: 9, volume: 2400, clicks: 228 },
  { keyword: "gurulós iskolatáska", before: 11, after: 4, volume: 1900, clicks: 184 },
  { keyword: "férfi oldaltáska", before: 16, after: 10, volume: 2900, clicks: 146 },
  { keyword: "laptop hátizsák", before: 8, after: 11, volume: 3600, clicks: 97 },
  { keyword: "Nebulo iskolatáska", before: 9, after: 3, volume: 1300, clicks: 205 },
  { keyword: "Henney Bear táska", before: 13, after: 6, volume: 880, clicks: 132 },
];
export const contentItems = [
  {
    title: "Hogyan válassz iskolatáskát? A teljes útmutató",
    kind: "Blogcikk",
    date: "Szept. 05.",
    words: 1850,
    target: "iskolatáska",
    result: "+128 kattintás",
  },
  {
    title: "Ergonomikus iskolatáskák",
    kind: "Kategóriaoldal",
    date: "Szept. 12.",
    words: 920,
    target: "ergonomikus iskolatáska",
    result: "22. → 9. hely",
  },
  {
    title: "Női hátizsák: praktikus és stílusos",
    kind: "Blogcikk",
    date: "Szept. 19.",
    words: 1420,
    target: "női hátizsák",
    result: "+86 kattintás",
  },
  {
    title: "Gurulós iskolatáskák",
    kind: "Kategóriaoldal",
    date: "Szept. 25.",
    words: 780,
    target: "gurulós iskolatáska",
    result: "11. → 4. hely",
  },
];
export const linkItems = [
  {
    domain: "hetek.hu",
    title: "Iskolakezdés okosan: a megfelelő táska kiválasztása",
    dr: 61,
    target: "/iskolataskak",
    date: "Szept. 08.",
  },
  {
    domain: "noilap.hu",
    title: "A hétköznapok stílusos társa: női hátizsákok",
    dr: 48,
    target: "/noi-hatizsakok",
    date: "Szept. 15.",
  },
  {
    domain: "csaladinet.hu",
    title: "Mitől ergonomikus egy iskolatáska?",
    dr: 57,
    target: "/ergonomikus-iskolataskak",
    date: "Szept. 21.",
  },
  {
    domain: "egeszsegkalauz.hu",
    title: "Így óvd a gyermeked hátát az iskolában",
    dr: 64,
    target: "/iskolataskak",
    date: "Szept. 28.",
  },
];
export const llmSources = [
  { name: "ChatGPT", sessions: 186, before: 105, share: 66, initial: "C" },
  { name: "Perplexity", sessions: 54, before: 30, share: 19, initial: "P" },
  { name: "Gemini", sessions: 32, before: 18, share: 11, initial: "G" },
  { name: "Copilot", sessions: 12, before: 7, share: 4, initial: "M" },
];
export const number = (value: number) => new Intl.NumberFormat("hu-HU").format(value);
export function trafficData(type: ReportType, earlier = false) {
  const factor = earlier ? 0.8 : 1;
  if (type === "quarterly")
    return Array.from({ length: 13 }, (_, i) => ({
      label: [
        "Júl. 01.",
        "Júl. 08.",
        "Júl. 15.",
        "Júl. 22.",
        "Aug. 01.",
        "Aug. 08.",
        "Aug. 15.",
        "Aug. 22.",
        "Szept. 01.",
        "Szept. 08.",
        "Szept. 15.",
        "Szept. 22.",
        "Szept. 30.",
      ][i],
      current: Math.round((440 + i * 51 + Math.sin(i * 2) * 70) * factor),
      previous: Math.round((330 + i * 25 + Math.sin(i * 1.6) * 55) * factor),
    }));
  return Array.from({ length: 30 }, (_, i) => ({
    label: `${earlier ? "Aug." : "Szept."} ${String(i + 1).padStart(2, "0")}.`,
    current: Math.round((87 + i * 2.6 + Math.sin(i * 1.8) * 20 + Math.sin(i / 2) * 15) * factor),
    previous: Math.round((66 + i * 1.1 + Math.sin(i * 1.7) * 12) * factor),
  }));
}
