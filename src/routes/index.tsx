import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  CalendarDays,
  Check,
  ChevronRight,
  CircleHelp,
  Eye,
  FileText,
  Globe,
  LayoutDashboard,
  Link2,
  Menu,
  MousePointer2,
  Plus,
  Printer,
  Search,
  Settings2,
  Sparkles,
  Target,
  Users,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import logo from "@/assets/seoklikk-logo.asset.json";
import { initialReports, trafficData, type Report, type ReportType } from "@/lib/report-data";
import {
  ContentSection,
  KeywordsSection,
  LinksSection,
  LlmSection,
  Overview,
  PlanSection,
  TrafficSection,
  type ReportTab,
} from "@/components/report-sections";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SEOKLIKK · SEO-riportkészítő" },
      {
        name: "description",
        content:
          "Havi és negyedéves SEO-riportok: keresőforgalom, kulcsszóhelyezések, AI-látogatások és az elvégzett munka közérthető elemzése.",
      },
      { property: "og:title", content: "SEOKLIKK · SEO-riportkészítő" },
      {
        property: "og:description",
        content:
          "Lásd a növekedést és a számok mögött végzett munkát. Átlátható, interaktív ügyfélriportok.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

type WorkspaceView = "report" | "library" | "clients" | "connections";
const tabItems: { id: ReportTab; name: string; icon: typeof Eye; count?: number }[] = [
  { id: "overview", name: "Áttekintés", icon: LayoutDashboard },
  { id: "traffic", name: "Google-forgalom", icon: MousePointer2 },
  { id: "keywords", name: "Kulcsszavak", icon: Search },
  { id: "llm", name: "AI-forgalom", icon: Sparkles },
  { id: "content", name: "Tartalmak", icon: FileText, count: 4 },
  { id: "links", name: "Linképítés", icon: Link2, count: 4 },
  { id: "plan", name: "Következő lépések", icon: ArrowRight },
];
function defaultSummary(report: Report) {
  const rows = trafficData(report.type, report.period.includes("augusztus"));
  const current = rows.reduce((s, r) => s + r.current, 0),
    before = rows.reduce((s, r) => s + r.previous, 0);
  const change = Math.round((current / before - 1) * 1000) / 10;
  return report.type === "quarterly"
    ? `Az elmúlt negyedévben ${change}%‑kal több organikus kattintás érkezett a weboldalra. A 12 új, releváns hivatkozás mellett 24 további kulcsszó került a Google első oldalára. Az „iskolatáska” 11 helyet javított. A kedvező tendencia mellett a visszaeső kifejezéseket is figyelemmel kísérjük.`
    : `Ebben a hónapban ${change}%‑kal több organikus kattintás érkezett a weboldalra, és 11 új kulcsszó került a Google első oldalára. A 4 elkészült tartalom és 4 minőségi link a fontos kategóriákat támogatja. Az AI-asszisztensekből érkező forgalom is nőtt. A szezonális hatásokat és a visszaeső kifejezéseket is figyelembe vesszük.`;
}
function Index() {
  const [reports, setReports] = useState<Report[]>(initialReports);
  const [selectedId, setSelectedId] = useState(initialReports[0].id);
  const report = reports.find((r) => r.id === selectedId) ?? initialReports[0];
  const [view, setView] = useState<WorkspaceView>("report");
  const [tab, setTab] = useState<ReportTab>("overview");
  const [clientMode, setClientMode] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [newOpen, setNewOpen] = useState(false);
  const [newClient, setNewClient] = useState("taskas.hu");
  const [newType, setNewType] = useState<ReportType>("monthly");
  const [newPeriod, setNewPeriod] = useState("2026. szeptember");
  const [customDomain, setCustomDomain] = useState("");
  const [customClient, setCustomClient] = useState("");
  const [summaries, setSummaries] = useState<Record<string, string>>({});
  const [editOpen, setEditOpen] = useState(false);
  const [editText, setEditText] = useState("");
  const [detail, setDetail] = useState<{ title: string; body: string } | null>(null);
  const [librarySearch, setLibrarySearch] = useState("");
  const summary = summaries[report.id] ?? defaultSummary(report);
  const quarterly = report.type === "quarterly";
  const tabs = tabItems.filter((t) => !quarterly || !["content", "llm"].includes(t.id));
  const clients = [
    ...new Map(reports.map((r) => [r.domain, { domain: r.domain, client: r.client }])).values(),
  ];
  const switchView = (v: WorkspaceView) => {
    setView(v);
    setMobileOpen(false);
  };
  const selectReport = (r: Report) => {
    setSelectedId(r.id);
    setTab("overview");
    setView("report");
  };
  const detailHandler = (title: string, body: string) => setDetail({ title, body });
  const createReport = (e: React.FormEvent) => {
    e.preventDefault();
    const domain =
      newClient === "custom"
        ? customDomain
            .trim()
            .replace(/^https?:\/\//, "")
            .replace(/\/$/, "")
        : newClient;
    if (!domain || !domain.includes(".") || domain.includes(" ")) {
      toast.error("Adj meg egy érvényes weboldalcímet.");
      return;
    }
    const client =
      newClient === "custom"
        ? customClient.trim()
        : clients.find((c) => c.domain === domain)?.client;
    if (!client) {
      toast.error("Add meg az ügyfél nevét.");
      return;
    }
    const period =
      newType === "quarterly" && !newPeriod.includes("negyedév")
        ? "2026. III. negyedév"
        : newType === "monthly" && newPeriod.includes("negyedév")
          ? "2026. szeptember"
          : newPeriod;
    const created: Report = {
      id: `report-${Date.now()}`,
      client,
      domain,
      type: newType,
      period,
      status: "draft",
    };
    setReports((prev) => [created, ...prev]);
    selectReport(created);
    setNewOpen(false);
    toast.success("A mintaadatokkal készült riport létrejött.");
  };
  const downloadData = () => {
    const data = JSON.stringify(
      {
        report,
        summary,
        source: "SEOKLIKK bemutató mintaadatok",
        traffic: trafficData(report.type, report.period.includes("augusztus")),
      },
      null,
      2,
    );
    const url = URL.createObjectURL(new Blob([data], { type: "application/json" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `seoklikk-${report.domain}-${report.period}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    toast.success("A riport adatai letöltve.");
  };
  const section = (id: ReportTab) => {
    switch (id) {
      case "overview":
        return (
          <Overview
            report={report}
            summary={summary}
            onEdit={() => {
              setEditText(summary);
              setEditOpen(true);
            }}
            onTab={setTab}
            clientMode={clientMode}
          />
        );
      case "traffic":
        return <TrafficSection report={report} />;
      case "keywords":
        return <KeywordsSection report={report} />;
      case "llm":
        return <LlmSection report={report} />;
      case "content":
        return <ContentSection onDetail={detailHandler} />;
      case "links":
        return <LinksSection report={report} onDetail={detailHandler} />;
      case "plan":
        return <PlanSection report={report} />;
    }
  };
  return (
    <div className={clientMode ? "app client-mode" : "app"}>
      {!clientMode && (
        <aside className={`sidebar ${mobileOpen ? "mobile-open" : ""}`}>
          <img className="brand" src={logo.url} alt="SEOKLIKK" />
          <div className="brand-caption">Ügyfélriportok</div>
          <div className="nav-label">Munkaterület</div>
          <nav>
            <Button
              variant={view === "report" ? "active" : "nav"}
              onClick={() => switchView("report")}
            >
              <LayoutDashboard />
              Riport áttekintése
            </Button>
            <Button
              variant={view === "library" ? "active" : "nav"}
              onClick={() => switchView("library")}
            >
              <FileText />
              Összes riport<span className="nav-count">{reports.length}</span>
            </Button>
            <Button
              variant={view === "clients" ? "active" : "nav"}
              onClick={() => switchView("clients")}
            >
              <Users />
              Ügyfelek<span className="nav-count">{clients.length}</span>
            </Button>
          </nav>
          <div className="nav-label">Beállítások</div>
          <nav>
            <Button
              variant={view === "connections" ? "active" : "nav"}
              onClick={() => switchView("connections")}
            >
              <Settings2 />
              Adatforrások
            </Button>
          </nav>
          <div className="sidebar-bottom">
            <div className="demo-note">
              <strong>
                <Sparkles size={13} className="text-brand-blue" />
                Bemutató munkaterület
              </strong>
              <p>
                A riportok mintaadatokat tartalmaznak. A valódi eredményekhez az adatforrások később
                kapcsolhatók.
              </p>
            </div>
            <div className="user">
              <span className="avatar">B</span>
              <div>
                <strong>Botond</strong>
                <small>SEOKLIKK</small>
              </div>
              <Button
                variant="ghost"
                size="icon"
                title="A bemutatóról"
                aria-label="A bemutatóról"
                onClick={() =>
                  detailHandler(
                    "SEOKLIKK bemutató",
                    "A riportok és a teljesítési tételek mintaadatok. A csatolt Táskás-riport a felépítéshez szolgált referenciaként; az itt látható növekedési adatok nem annak valós eredményei.\n\nA most létrehozott riportok és módosítások ebben a munkamenetben élnek; az oldal újratöltése visszaállítja a bemutatót. Tartós mentés és megosztható ügyféllink még nincs bekötve.",
                  )
                }
              >
                <CircleHelp size={16} />
              </Button>
            </div>
          </div>
        </aside>
      )}
      <div className="workspace">
        {clientMode ? (
          <div className="client-view-bar">
            <img className="brand" src={logo.url} alt="SEOKLIKK" />
            <Button variant="outline" onClick={() => setClientMode(false)}>
              <ArrowLeft size={14} />
              Vissza a riportkészítőhöz
            </Button>
          </div>
        ) : (
          <header className="topbar">
            <div className="breadcrumb">
              <Button
                className="mobile-menu"
                variant="ghost"
                size="icon"
                aria-label={mobileOpen ? "Menü bezárása" : "Menü megnyitása"}
                onClick={() => setMobileOpen((v) => !v)}
              >
                {mobileOpen ? <X /> : <Menu />}
              </Button>
              <BarChart3 size={14} />
              <span>Munkaterület</span>
              <ChevronRight size={12} />
              <strong>
                {view === "report"
                  ? "Riport áttekintése"
                  : view === "library"
                    ? "Összes riport"
                    : view === "clients"
                      ? "Ügyfelek"
                      : "Adatforrások"}
              </strong>
            </div>
            <div className="topbar-actions">
              <span className="demo-badge">Mintaadatok</span>
              <Button variant="brand" onClick={() => setNewOpen(true)}>
                <Plus size={14} />
                Új riport
              </Button>
            </div>
          </header>
        )}
        <main className="main-content">
          {view === "report" && (
            <>
              <div className="page-heading">
                <div>
                  <h1>{clientMode ? "A növekedésed, számokban." : "Riport áttekintése"}</h1>
                  <p>
                    {clientMode
                      ? "A számok mögött elvégzett munka. És a következő lépések."
                      : "Eredmények, elvégzett munka és a következő lépések. Egy helyen."}
                  </p>
                </div>
                <div className="heading-actions no-print">
                  {!clientMode && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setClientMode(true);
                        setTab("overview");
                      }}
                    >
                      <Eye size={14} />
                      Ügyfélnézet
                    </Button>
                  )}
                  <Button variant="outline" onClick={() => window.print()}>
                    <Printer size={14} />
                    Nyomtatás / PDF
                  </Button>
                </div>
              </div>
              <div className="report-toolbar">
                <div className="toolbar-selects">
                  <Globe className="select-icon" />
                  <Select
                    value={report.domain}
                    onValueChange={(value) => {
                      const selected = reports.find((r) => r.domain === value);
                      if (selected) selectReport(selected);
                    }}
                  >
                    <SelectTrigger className="client-select" aria-label="Ügyfél választása">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map((c) => (
                        <SelectItem value={c.domain} key={c.domain}>
                          {c.domain}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <span className="toolbar-divider" />
                  <CalendarDays className="select-icon" />
                  <Select
                    value={report.id}
                    onValueChange={(value) => {
                      const selected = reports.find((r) => r.id === value);
                      if (selected) selectReport(selected);
                    }}
                  >
                    <SelectTrigger className="period-select" aria-label="Riport időszaka">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {reports
                        .filter((r) => r.domain === report.domain)
                        .map((r) => (
                          <SelectItem key={r.id} value={r.id}>
                            {r.period}
                            {r.status === "draft" ? " · Piszkozat" : ""}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="report-meta">
                  <span className={`status ${report.status === "draft" ? "draft" : ""}`}>
                    <Check size={11} />
                    {report.status === "ready" ? "Riport kész" : "Piszkozat"}
                  </span>
                  <span>Mintaadatok · 2026. okt. 5.</span>
                </div>
              </div>
              <img className="print-only print-brand" src={logo.url} alt="SEOKLIKK" />
              <div className="report-heading">
                <span className="client-mark">
                  <Globe size={23} />
                </span>
                <div>
                  <h2>{report.domain}</h2>
                  <p>
                    {report.period} <span>·</span>{" "}
                    {quarterly ? "3 havi linképítési riport" : "Havi SEO-riport"}
                  </p>
                </div>
                <span className="report-type">{quarterly ? "Linképítés" : "Teljes körű SEO"}</span>
              </div>
              <nav className="report-tabs no-print" aria-label="Riport fejezetei">
                {tabs.map((t) => (
                  <Button
                    variant="ghost"
                    className={tab === t.id ? "selected" : ""}
                    key={t.id}
                    onClick={() => setTab(t.id)}
                    aria-current={tab === t.id ? "page" : undefined}
                  >
                    <t.icon size={13} />
                    {t.name}
                    {t.count && (
                      <span className="tab-count">
                        {t.id === "links" && quarterly ? 12 : t.count}
                      </span>
                    )}
                  </Button>
                ))}
              </nav>
              <div className="report-body" key={`${report.id}-${tab}`}>
                <div className="no-print">{section(tab)}</div>
                <div className="print-only">
                  {tabs.map((t) => (
                    <section className={t.id === "overview" ? "" : "print-section"} key={t.id}>
                      {section(t.id)}
                    </section>
                  ))}
                </div>
              </div>
              <footer className="report-footer">
                <span>SEOKLIKK · A számok mögött stratégia és munka.</span>
                <span>Bemutató riport · Nem valós ügyféleredmények</span>
              </footer>
            </>
          )}
          {view === "library" && (
            <>
              <div className="page-heading">
                <div>
                  <h1>Összes riport</h1>
                  <p>Havi SEO- és negyedéves linképítési riportok.</p>
                </div>
                <Input
                  className="max-w-60"
                  placeholder="Ügyfél vagy időszak keresése…"
                  aria-label="Riport keresése"
                  value={librarySearch}
                  onChange={(e) => setLibrarySearch(e.target.value)}
                />
              </div>
              <div className="library-grid">
                {reports
                  .filter((r) =>
                    `${r.client} ${r.domain} ${r.period}`
                      .toLowerCase()
                      .includes(librarySearch.toLowerCase()),
                  )
                  .map((r) => (
                    <article className="library-card" key={r.id}>
                      <span className={`status ${r.status === "draft" ? "draft" : ""}`}>
                        {r.status === "ready" ? "Riport kész" : "Piszkozat"}
                      </span>
                      <h3>{r.domain}</h3>
                      <p>{r.period}</p>
                      <p>
                        {r.type === "monthly" ? "Teljes körű SEO · havi" : "Linképítés · 3 havi"}
                      </p>
                      <div className="library-bottom">
                        <span>Mintaadatok</span>
                        <Button variant="outline" size="sm" onClick={() => selectReport(r)}>
                          Megnyitás
                          <ArrowRight size={13} />
                        </Button>
                      </div>
                    </article>
                  ))}
              </div>
              {!reports.some((r) =>
                `${r.client} ${r.domain} ${r.period}`
                  .toLowerCase()
                  .includes(librarySearch.toLowerCase()),
              ) && <div className="empty-state">Nincs a keresésnek megfelelő riport.</div>}
            </>
          )}
          {view === "clients" && (
            <>
              <div className="page-heading">
                <div>
                  <h1>Ügyfelek</h1>
                  <p>Ügyfeleid és a hozzájuk tartozó riportok.</p>
                </div>
                <Button
                  variant="brand"
                  onClick={() => {
                    setNewClient("custom");
                    setNewOpen(true);
                  }}
                >
                  <Plus />
                  Új ügyfélriport
                </Button>
              </div>
              <div className="client-list">
                {clients.map((c) => (
                  <article className="client-list-item" key={c.domain}>
                    <span className="client-mark">
                      <Globe />
                    </span>
                    <div>
                      <h3>{c.client}</h3>
                      <p>
                        {c.domain} · {reports.filter((r) => r.domain === c.domain).length} riport
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => {
                        const r = reports.find((r) => r.domain === c.domain);
                        if (r) selectReport(r);
                      }}
                    >
                      Riport megnyitása
                      <ArrowRight />
                    </Button>
                  </article>
                ))}
              </div>
            </>
          )}
          {view === "connections" && (
            <>
              <div className="page-heading">
                <div>
                  <h1>Adatforrások</h1>
                  <p>A riportok jelenleg mintaadatokból készülnek. Nincs élő adatkapcsolat.</p>
                </div>
              </div>
              <div className="connection-list">
                {[
                  {
                    name: "Google Search Console",
                    description:
                      "Google-megjelenések, kattintások, keresési kifejezések és céloldalak.",
                    icon: Search,
                  },
                  {
                    name: "Google Analytics 4",
                    description: "AI-asszisztensekből érkező forgalom, munkamenetek és konverziók.",
                    icon: BarChart3,
                  },
                  {
                    name: "Ahrefs",
                    description: "Kulcsszóhelyezések változása, hivatkozó domainek és linkprofil.",
                    icon: Target,
                  },
                ].map((c) => (
                  <article className="connection-item" key={c.name}>
                    <span className="work-row-icon">
                      <c.icon />
                    </span>
                    <div>
                      <h3>{c.name}</h3>
                      <p>{c.description}</p>
                    </div>
                    <span className="status">Még nincs csatlakoztatva</span>
                  </article>
                ))}
              </div>
              <div className="section-analysis">
                <h3>A következő lépés: valódi eredmények.</h3>
                <p>
                  A hozzáférések megadása után az ügyfelek saját adataival készülhetnek a riportok.
                  A GA4-ben külön figyeljük az LLM-forgalmat; az Ahrefsben az időszak eleji és végi
                  kulcsszóhelyezéseket hasonlítjuk össze.
                </p>
              </div>
              <Button variant="outline" onClick={downloadData}>
                <FileText />
                Aktuális mintaadatok letöltése
              </Button>
            </>
          )}
        </main>
      </div>
      <Dialog open={newOpen} onOpenChange={setNewOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Új ügyfélriport</DialogTitle>
            <DialogDescription>
              Havi teljes SEO- vagy 3 havi linképítési riport, egyelőre mintaadatokkal.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={createReport} className="form-grid">
            <label>
              Ügyfél
              <Select value={newClient} onValueChange={setNewClient}>
                <SelectTrigger aria-label="Új riport ügyfele">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((c) => (
                    <SelectItem key={c.domain} value={c.domain}>
                      {c.client} · {c.domain}
                    </SelectItem>
                  ))}
                  <SelectItem value="custom">Új ügyfél hozzáadása</SelectItem>
                </SelectContent>
              </Select>
            </label>
            {newClient === "custom" && (
              <>
                <label>
                  Ügyfél neve
                  <Input
                    required
                    placeholder="Ügyfél neve"
                    value={customClient}
                    onChange={(e) => setCustomClient(e.target.value)}
                  />
                </label>
                <label>
                  Weboldal
                  <Input
                    required
                    placeholder="pelda.hu"
                    value={customDomain}
                    onChange={(e) => setCustomDomain(e.target.value)}
                  />
                </label>
              </>
            )}
            <label>
              Riport típusa
              <Select
                value={newType}
                onValueChange={(v) => {
                  setNewType(v as ReportType);
                  setNewPeriod(v === "quarterly" ? "2026. III. negyedév" : "2026. szeptember");
                }}
              >
                <SelectTrigger aria-label="Riport típusa">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Havi · teljes SEO (tartalom + linképítés)</SelectItem>
                  <SelectItem value="quarterly">3 havi · csak linképítés</SelectItem>
                </SelectContent>
              </Select>
            </label>
            <label>
              Időszak
              <Select value={newPeriod} onValueChange={setNewPeriod}>
                <SelectTrigger aria-label="Új riport időszaka">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(newType === "monthly"
                    ? ["2026. szeptember", "2026. augusztus"]
                    : ["2026. III. negyedév"]
                  ).map((p) => (
                    <SelectItem value={p} key={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </label>
            <p className="field-note">
              Bemutató adatokkal készül. A létrehozott riport ebben a munkamenetben érhető el.
            </p>
            <div className="dialog-actions">
              <Button variant="outline" type="button" onClick={() => setNewOpen(false)}>
                Mégse
              </Button>
              <Button variant="brand" type="submit">
                <Plus />
                Riport létrehozása
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Az időszak összefoglalója</DialogTitle>
            <DialogDescription>
              Az ügyfélnek szánt elemzés és a legfontosabb megállapítások.
            </DialogDescription>
          </DialogHeader>
          <form
            className="form-grid"
            onSubmit={(e) => {
              e.preventDefault();
              if (!editText.trim()) return;
              setSummaries((s) => ({ ...s, [report.id]: editText.trim() }));
              setEditOpen(false);
              toast.success("Az összefoglaló frissült ebben a munkamenetben.");
            }}
          >
            <label>
              Elemzés
              <textarea value={editText} onChange={(e) => setEditText(e.target.value)} required />
            </label>
            <div className="dialog-actions">
              <Button type="button" variant="outline" onClick={() => setEditOpen(false)}>
                Mégse
              </Button>
              <Button variant="brand" type="submit">
                <Check />
                Összefoglaló mentése
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog
        open={!!detail}
        onOpenChange={(open) => {
          if (!open) setDetail(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{detail?.title}</DialogTitle>
            <DialogDescription>SEOKLIKK · Bemutató riport</DialogDescription>
          </DialogHeader>
          <p className="whitespace-pre-line text-xs leading-7 text-muted-foreground">
            {detail?.body}
          </p>
        </DialogContent>
      </Dialog>
    </div>
  );
}
