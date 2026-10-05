import { useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpRight,
  Check,
  ChevronRight,
  FileText,
  Link2,
  Search,
  Sparkles,
  TrendingUp,
  MousePointer2,
  Eye,
  Target,
  Pencil,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ReportChart } from "./report-chart";
import {
  keywords,
  contentItems,
  linkItems,
  llmSources,
  number,
  trafficData,
  type Report,
} from "@/lib/report-data";

export type ReportTab = "overview" | "traffic" | "keywords" | "llm" | "content" | "links" | "plan";
export function Change({ value, suffix = "%" }: { value: number; suffix?: string }) {
  return (
    <span className={`change ${value < 0 ? "negative" : ""}`}>
      {value < 0 ? <ArrowDown size={11} /> : <ArrowUp size={11} />} {Math.abs(value)}
      {suffix}
    </span>
  );
}
function Sparkline({ variant = 0 }: { variant?: number }) {
  const points = Array.from(
    { length: 14 },
    (_, i) => `${i * 4.6},${21 - i * 1.1 - Math.sin(i * 2 + variant) * 4}`,
  ).join(" ");
  return (
    <svg className="sparkline" viewBox="0 0 64 26" aria-hidden="true">
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
export function ReportMetrics({ report }: { report: Report }) {
  const earlier = report.period.includes("augusztus");
  const rows = trafficData(report.type, earlier);
  const clicks = rows.reduce((sum, r) => sum + r.current, 0);
  const previous = rows.reduce((sum, r) => sum + r.previous, 0);
  const quarterly = report.type === "quarterly";
  const metrics = [
    {
      label: "Organikus kattintások",
      value: number(clicks),
      change: Math.round((clicks / previous - 1) * 1000) / 10,
      icon: MousePointer2,
    },
    { label: "Google-megjelenések", value: number(clicks * 22), change: 28.6, icon: Eye },
    {
      label: "Kulcsszavak a TOP 10-ben",
      value: earlier ? "27" : quarterly ? "52" : "38",
      change: quarterly ? 24 : earlier ? 6 : 11,
      suffix: " db",
      icon: Target,
    },
    {
      label: quarterly ? "Új hivatkozó domainek" : "AI-ból érkező látogatások",
      value: quarterly ? "12" : earlier ? "160" : "284",
      change: quarterly ? 12 : 77.5,
      suffix: quarterly ? " db" : "%",
      icon: quarterly ? Link2 : Sparkles,
    },
  ];
  return (
    <div className="metrics-grid">
      {metrics.map((m, i) => (
        <div className="metric" key={m.label}>
          <div className="metric-top">
            <span className="metric-label">{m.label}</span>
            <m.icon className="metric-icon" />
          </div>
          <div className="metric-value">{m.value}</div>
          <Sparkline variant={i} />
          <div className="metric-bottom">
            <Change value={m.change} suffix={m.suffix} />
            <span>az előző időszakhoz képest</span>
          </div>
        </div>
      ))}
    </div>
  );
}
export function Overview({
  report,
  summary,
  onEdit,
  onTab,
  clientMode,
}: {
  report: Report;
  summary: string;
  onEdit: () => void;
  onTab: (tab: ReportTab) => void;
  clientMode: boolean;
}) {
  const quarterly = report.type === "quarterly";
  return (
    <>
      <section className="executive-summary">
        <TrendingUp className="summary-icon" size={21} />
        <div>
          <div className="summary-top">
            <h3>
              {quarterly
                ? "Erősödő weboldal, jobb helyezések."
                : "Több látogató. Jobb helyezések. Látható eredmények."}
            </h3>
            <span>Az időszak összefoglalója</span>
          </div>
          <p>{summary}</p>
        </div>
        {!clientMode && (
          <Button
            variant="ghost"
            size="icon"
            title="Összefoglaló szerkesztése"
            aria-label="Összefoglaló szerkesztése"
            className="edit-summary"
            onClick={onEdit}
          >
            <Pencil size={13} />
          </Button>
        )}
      </section>
      <ReportMetrics report={report} />
      <div className="overview-grid">
        <section className="chart-panel">
          <ReportChart type={report.type} earlier={report.period.includes("augusztus")} />
        </section>
        <section className="work-summary">
          <h2>Munka a számok mögött</h2>
          <p>{quarterly ? "Az elmúlt 3 hónapban elkészült" : "Ebben a hónapban elkészült"}</p>
          {!quarterly && (
            <div className="work-row">
              <span className="work-row-icon">
                <FileText />
              </span>
              <div>
                <strong>4 új tartalom</strong>
                <p>2 blogcikk · 2 kategóriaoldal</p>
              </div>
              <Check />
            </div>
          )}
          <div className="work-row">
            <span className="work-row-icon">
              <Link2 />
            </span>
            <div>
              <strong>{quarterly ? 12 : 4} minőségi link</strong>
              <p>Releváns, hazai weboldalakról</p>
            </div>
            <Check />
          </div>
          <div className="work-row">
            <span className="work-row-icon">
              <Search />
            </span>
            <div>
              <strong>{quarterly ? "52" : "38"} TOP 10 kulcsszó</strong>
              <p>{quarterly ? "24" : "11"} új kifejezés az első oldalon</p>
            </div>
            <Check />
          </div>
          <Button variant="ghost" onClick={() => onTab(quarterly ? "links" : "content")}>
            Elvégzett munka részletei
            <ArrowRight size={13} />
          </Button>
        </section>
      </div>
      <div className="lower-grid">
        <section className="insight-block">
          <div className="insight-heading">
            <h2>
              <TrendingUp />A legnagyobb előrelépések
            </h2>
            <Button variant="ghost" onClick={() => onTab("keywords")}>
              Összes kulcsszó
              <ChevronRight size={11} />
            </Button>
          </div>
          {keywords.slice(0, 3).map((k) => (
            <div className="small-keyword-row" key={k.keyword}>
              <span>{k.keyword}</span>
              <div className="rank-pair">
                <span className="rank-before">{k.before}.</span>
                <ArrowRight size={11} />
                <span className="rank-now">{k.after}.</span>
                <Change value={k.before - k.after} suffix="" />
              </div>
            </div>
          ))}
        </section>
        <section className="insight-block">
          <div className="insight-heading">
            <h2>
              {quarterly ? <Link2 /> : <Sparkles />}
              {quarterly ? "A linképítés eredménye" : "Már az AI is küld látogatókat"}
            </h2>
            <Button variant="ghost" onClick={() => onTab(quarterly ? "links" : "llm")}>
              Részletek
              <ChevronRight size={11} />
            </Button>
          </div>
          <div className="ai-highlight">
            <strong>
              {quarterly ? "12" : report.period.includes("augusztus") ? "160" : "284"}
            </strong>
            <div>
              <Change value={quarterly ? 12 : 77.5} suffix={quarterly ? " új domain" : "%"} />
              <p>
                {quarterly
                  ? "Új, releváns hivatkozás a weboldaladra"
                  : "látogatás AI-asszisztensekből"}
              </p>
            </div>
          </div>
          <div className="ai-source-summary">
            {quarterly ? (
              <span>
                <i />
                Átlagos domainérték: 57 DR
              </span>
            ) : (
              <>
                <span>
                  <i />
                  ChatGPT
                </span>
                <span>
                  <i />
                  Perplexity
                </span>
                <span>
                  <i />
                  Gemini
                </span>
              </>
            )}
          </div>
          <div className="mini-analysis">
            {quarterly ? (
              <>
                <strong>Erősebb alap a növekedéshez.</strong> A releváns hivatkozások támogatják a
                fontos kategóriaoldalak láthatóságát.
              </>
            ) : (
              <>
                <strong>Új csatorna, új lehetőség.</strong> A részletes útmutatók az AI-válaszokban
                is megjelenhetnek. A hivatkozási forgalom nem azonos az AI-említések számával.
              </>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
export function KeywordsSection({ report }: { report: Report }) {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState(false);
  const multiplier =
    report.type === "quarterly" ? 3 : report.period.includes("augusztus") ? 0.8 : 1;
  const rows = keywords
    .filter((k) => k.keyword.includes(search.toLowerCase()))
    .toSorted((a, b) => (sort ? b.before - b.after - (a.before - a.after) : 0));
  return (
    <>
      <div className="section-heading">
        <div>
          <h2>Kulcsszavak, amelyek előrébb jutottak</h2>
          <p>A kisebb helyezésszám jobb eredményt jelent. Forrás: Ahrefs · mintaadatok</p>
        </div>
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Kulcsszó keresése…"
          aria-label="Kulcsszó keresése"
        />
      </div>
      <div className="table-wrap">
        <table className="report-table">
          <thead>
            <tr>
              <th>Kulcsszó</th>
              <th>Előző helyezés</th>
              <th>Jelenlegi helyezés</th>
              <th>
                <Button variant="ghost" onClick={() => setSort((v) => !v)}>
                  Változás {sort ? <ArrowDown size={11} /> : <ArrowUp size={11} />}
                </Button>
              </th>
              <th>Havi keresés</th>
              <th>Kattintás</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((k) => (
              <tr key={k.keyword}>
                <td className="keyword-cell">{k.keyword}</td>
                <td className="text-muted-foreground">{k.before}.</td>
                <td>
                  <span className="rank-now">{k.after}.</span>
                </td>
                <td>
                  <Change value={k.before - k.after} suffix=" hely" />
                </td>
                <td>{number(k.volume)}</td>
                <td>{number(Math.round(k.clicks * multiplier))}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {!rows.length && <div className="empty-state">Nincs találat erre a kifejezésre.</div>}
      </div>
      <div className="section-analysis">
        <h3>Mit jelent ez a vállalkozásodnak?</h3>
        <p>
          Az „iskolatáska” a 18. helyről a 7. helyre lépett: a második oldal helyett már a Google
          első oldalán szerepel. A mintaidőszakban ez a kifejezés 486 kattintást hozott. A tartalmi
          fejlesztés és a releváns linkek együttesen támogathatják a láthatóságot; a helyezések
          változása önmagában nem bizonyít ok-okozati kapcsolatot.
        </p>
      </div>
      <div className="watch-note">
        <strong>Amire figyelünk:</strong> a „laptop hátizsák” 3 helyet visszaesett. A következő
        időszakban ellenőrizzük a keresési szándékot és az oldal tartalmát; az elmaradást nem
        hagyjuk magyarázat nélkül.
      </div>
    </>
  );
}
export function TrafficSection({ report }: { report: Report }) {
  return (
    <>
      <div className="section-heading">
        <div>
          <h2>Hogyan találnak rád a Google-ben?</h2>
          <p>Keresőből érkező forgalom, az előző azonos hosszúságú időszakhoz képest.</p>
        </div>
      </div>
      <ReportMetrics report={report} />
      <section className="chart-panel">
        <ReportChart type={report.type} earlier={report.period.includes("augusztus")} />
      </section>
      <div className="section-analysis">
        <h3>Nem csak többen látnak, többen választanak is.</h3>
        <p>
          A mintaadatokban a kattintások gyorsabban nőttek a megjelenéseknél. Ez arra utalhat, hogy
          a megjelenő találatok vonzóbbá váltak a keresők számára. Az iskolakezdés szezonális
          hatását is figyelembe kell venni; a havi összehasonlítás nem választja külön a szezon és
          az elvégzett munka hatását.
        </p>
      </div>
      <div className="section-heading">
        <h2>A legtöbb látogatót hozó oldalak</h2>
      </div>
      <div className="table-wrap">
        <table className="report-table">
          <thead>
            <tr>
              <th>Oldal</th>
              <th>Kattintás</th>
              <th>Változás</th>
              <th>Átlagos helyezés</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["/iskolataskak", 1248, 42.8, "7,2"],
              ["/noi-hatizsakok", 684, 31.4, "5,8"],
              ["/ergonomikus-iskolataskak", 428, 58.2, "9,1"],
              ["/blog/iskolataska-valasztas", 312, 24.6, "6,4"],
            ].map((row) => (
              <tr key={String(row[0])}>
                <td>{row[0]}</td>
                <td>
                  {number(
                    Math.round(
                      Number(row[1]) *
                        (report.type === "quarterly"
                          ? 3
                          : report.period.includes("augusztus")
                            ? 0.8
                            : 1),
                    ),
                  )}
                </td>
                <td>
                  <Change value={Number(row[2])} />
                </td>
                <td>{row[3]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
export function LlmSection({ report }: { report: Report }) {
  const earlier = report.period.includes("augusztus");
  return (
    <>
      <div className="section-heading">
        <div>
          <h2>AI-asszisztensekből érkező látogatók</h2>
          <p>GA4 hivatkozási forgalom · ChatGPT, Perplexity, Gemini és Copilot · mintaadatok</p>
        </div>
      </div>
      <div className="section-analysis">
        <h3>{earlier ? "160" : "284"} látogatás egy új forgalmi csatornából</h3>
        <p>
          Az AI-asszisztensek már nem csak válaszolnak: látogatókat is irányítanak a weboldaladra. A
          mintaidőszakban a ChatGPT adta a legtöbb látogatást. Ezek a számok a felismerhető
          hivatkozásokból érkező munkameneteket mutatják, nem a márkád összes AI-említését.
        </p>
      </div>
      <div className="llm-grid">
        {llmSources.map((s) => (
          <div className="llm-source" key={s.name}>
            <div className="source-name">
              <i>{s.initial}</i>
              {s.name}
            </div>
            <strong>{earlier ? s.before : s.sessions}</strong>
            <p>munkamenet</p>
            <meter min={0} max={100} value={s.share} />
            <p>{s.share}% az AI-forgalomból</p>
          </div>
        ))}
      </div>
      <div className="table-wrap">
        <table className="report-table">
          <thead>
            <tr>
              <th>Forrás</th>
              <th>Előző időszak</th>
              <th>Aktuális időszak</th>
              <th>Változás</th>
            </tr>
          </thead>
          <tbody>
            {llmSources.map((s) => (
              <tr key={s.name}>
                <td>{s.name}</td>
                <td>{earlier ? Math.round(s.before * 0.8) : s.before}</td>
                <td>{earlier ? s.before : s.sessions}</td>
                <td>
                  <Change
                    value={earlier ? 25 : Math.round((s.sessions / s.before - 1) * 1000) / 10}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="watch-note">
        <strong>Fontos értelmezés:</strong> a hivatkozás nélküli AI-látogatások a GA4-ben más
        csatornába kerülhetnek. A valódi csatlakoztatás után a források besorolását és a
        konverziókat is ellenőrizzük.
      </div>
    </>
  );
}
export function ContentSection({ onDetail }: { onDetail: (title: string, body: string) => void }) {
  return (
    <>
      <div className="section-heading">
        <div>
          <h2>Elkészült tartalmak</h2>
          <p>4 tartalom · 4 970 szó · minden anyag konkrét keresési igényre készült</p>
        </div>
        <span className="status">
          <Check size={12} />4 / 4 elkészült
        </span>
      </div>
      <div className="deliverable-list">
        {contentItems.map((c) => (
          <article className="deliverable" key={c.title}>
            <span className="work-row-icon">
              <FileText />
            </span>
            <div className="deliverable-body">
              <h3>{c.title}</h3>
              <p>
                {c.kind} · {c.date} · {number(c.words)} szó · Fókusz: {c.target}
              </p>
            </div>
            <span className="deliverable-result">{c.result}</span>
            <Button
              variant="ghost"
              size="icon"
              aria-label={`${c.title} részletei`}
              title="Tartalom részletei"
              onClick={() =>
                onDetail(
                  c.title,
                  `${c.kind} · ${c.date} · ${number(c.words)} szó\n\nCélkulcsszó: ${c.target}\n\nAz anyag célja a vásárlók konkrét kérdéseinek megválaszolása, a választás megkönnyítése és a releváns kategóriaoldalak támogatása. Tartalmaz keresési szándékhoz igazított címsorokat, belső hivatkozásokat és gyakori kérdéseket.\n\nEredmény a mintaidőszakban: ${c.result}. Az eredmény nem bizonyítja önmagában a tartalom közvetlen hatását.\n\nEz bemutató tartalom, nem tényleges teljesítési igazolás.`,
                )
              }
            >
              <ArrowUpRight />
            </Button>
          </article>
        ))}
      </div>
      <div className="section-analysis">
        <h3>A tartalom nem öncélú: a vásárláshoz vezető utat építjük.</h3>
        <p>
          A két blogcikk a választás előtt álló érdeklődőket éri el. A két kategóriaoldal a
          vásárláshoz közelebb lévő keresésekre ad választ. A belső hivatkozások összekötik az
          útmutatókat a releváns termékekkel.
        </p>
      </div>
    </>
  );
}
export function LinksSection({
  report,
  onDetail,
}: {
  report: Report;
  onDetail: (title: string, body: string) => void;
}) {
  const quarterly = report.type === "quarterly";
  const items = quarterly
    ? [
        ...linkItems.map((l) => ({ ...l, date: "Júl. 14." })),
        ...linkItems.map((l) => ({ ...l, date: "Aug. 18." })),
        ...linkItems,
      ]
    : linkItems;
  return (
    <>
      <div className="section-heading">
        <div>
          <h2>Linképítés: erősebb háttér a weboldaladnak</h2>
          <p>{quarterly ? 12 : 4} új megjelenés · 48–64 DR · releváns, hazai weboldalak</p>
        </div>
        <span className="status">
          <Check size={12} />
          {quarterly ? 12 : 4} / {quarterly ? 12 : 4} elkészült
        </span>
      </div>
      <div className="table-wrap">
        <table className="report-table">
          <thead>
            <tr>
              <th>Hivatkozó weboldal</th>
              <th>Domainérték (DR)</th>
              <th>Céloldal</th>
              <th>Megjelenés</th>
              <th>Részletek</th>
            </tr>
          </thead>
          <tbody>
            {items.map((l, i) => (
              <tr key={`${l.domain}-${i}`}>
                <td>
                  <span className="inline-flex items-center gap-2">
                    <Link2 size={12} className="text-brand-blue" />
                    {l.domain}
                  </span>
                </td>
                <td>
                  <span className="rank-now">{l.dr}</span>
                </td>
                <td>{l.target}</td>
                <td>{l.date}</td>
                <td>
                  <Button
                    variant="ghost"
                    size="icon"
                    title="Link részletei"
                    aria-label={`${l.domain} ${l.date} részletei`}
                    onClick={() =>
                      onDetail(
                        l.title,
                        `Hivatkozó oldal: ${l.domain}\nDomainérték (Ahrefs DR): ${l.dr}/100\nCéloldal: ${report.domain}${l.target}\nMegjelenés: ${l.date}\n\nA cikk témájába illeszkedő hivatkozás a céloldal tartalmát támogatja. A DR külső szolgáltató becslése, nem a Google rangsorolási pontszáma.\n\nMintaadat: ez a sor nem igazolja tényleges link közzétételét.`,
                      )
                    }
                  >
                    <ArrowUpRight size={13} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="section-analysis">
        <h3>Miért ezeken az oldalakon építettünk linket?</h3>
        <p>
          A mintában szereplő kiadványok témái illeszkednek a táskaválasztáshoz, családhoz és
          életmódhoz. Nem pusztán linkdarabszámot követünk: a témabeli relevanciát, a hivatkozás
          környezetét és a céloldalak egyensúlyát is vizsgáljuk. A DR egy kiegészítő mutató,
          önmagában nem jelent garantált helyezésjavulást.
        </p>
      </div>
    </>
  );
}
export function PlanSection({ report }: { report: Report }) {
  const plans =
    report.type === "quarterly"
      ? [
          [
            "A fontos kategóriaoldalak további erősítése",
            "A már javuló kulcsszavakhoz tartozó céloldalakra építünk releváns linkeket, változatos hivatkozási szövegekkel.",
            "Linképítés · következő negyedév",
          ],
          [
            "A linkprofil minőségének ellenőrzése",
            "Ellenőrizzük a megszerzett hivatkozások elérhetőségét, és áttekintjük a hivatkozó oldalak relevanciáját.",
            "Minőségellenőrzés · havonta",
          ],
          [
            "Visszaeső kulcsszavak kivizsgálása",
            "A laptop hátizsák helyezésének változását részletesen megvizsgáljuk, és tartalmi javaslatot adunk az ügyfélnek.",
            "Elemzés · következő időszak",
          ],
        ]
      : [
          [
            "A TOP 10-ből a TOP 3 felé",
            "Az iskolatáska és női hátizsák kategóriákat célzott belső hivatkozásokkal és további releváns linkekkel támogatjuk.",
            "Tartalom + linképítés · október",
          ],
          [
            "A laptop hátizsák oldalának felülvizsgálata",
            "Frissítjük a kategóriaoldalt a keresési szándék alapján, és összehasonlítjuk az előrébb rangsoroló oldalakkal.",
            "Tartalomfejlesztés · október",
          ],
          [
            "Az AI-forgalom tudatos építése",
            "Új, részletes kérdés-válasz tartalmakat készítünk, és figyeljük, mely oldalakra érkeznek látogatók AI-asszisztensekből.",
            "Tartalom + GA4 elemzés · október",
          ],
        ];
  return (
    <>
      <div className="section-heading">
        <div>
          <h2>Erre építünk a következő időszakban</h2>
          <p>Az eredményekből konkrét feladatok következnek.</p>
        </div>
      </div>
      <div className="plan-list">
        {plans.map((p, i) => (
          <article className="plan-item" key={p[0]}>
            <span className="plan-number">{i + 1}</span>
            <div>
              <h3>{p[0]}</h3>
              <p>{p[1]}</p>
              <small>{p[2]}</small>
            </div>
          </article>
        ))}
      </div>
      <div className="section-analysis">
        <h3>A növekedés folyamatos munka, nem egyszeri eredmény.</h3>
        <p>
          A célunk, hogy a javuló láthatóságból értékes látogatások és üzleti eredmények
          szülessenek. A következő riportban visszatérünk ezekre a feladatokra és a mérhető
          változásokra.
        </p>
      </div>
    </>
  );
}
