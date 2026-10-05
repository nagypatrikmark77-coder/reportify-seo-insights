import { createFileRoute } from '@tanstack/react-router'
import { BarChart3, TrendingUp, Search, Globe, ChevronRight } from 'lucide-react'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <img src="/logo.svg" alt="SEOKLIKK" className="h-8" />
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#" className="text-sm font-medium hover:text-brand-blue transition-colors">Audit</a>
            <a href="#" className="text-sm font-medium hover:text-brand-blue transition-colors">Reports</a>
            <a href="#" className="text-sm font-medium hover:text-brand-blue transition-colors">Settings</a>
          </nav>
          <div className="flex items-center gap-3">
            <button className="ds-button-primary px-6 py-2 text-sm">
              New Report
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-10 px-4">
        <div className="flex flex-col gap-8">
          {/* Hero / Welcome */}
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground">
              Reporting <span className="text-gradient-brand">Dashboard</span>
            </h1>
            <p className="mt-2 text-muted-foreground">
              Welcome back. Here's what's happening with your SEO performance today.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'Organic Traffic', value: '12.4k', change: '+14%', icon: TrendingUp },
              { label: 'Visibility Score', value: '68%', change: '+2%', icon: BarChart3 },
              { label: 'Keywords in Top 3', value: '452', change: '+12', icon: Search },
              { label: 'Domain Authority', value: '42', change: '0', icon: Globe },
            ].map((stat, i) => (
              <div key={i} className="ds-card p-6 flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                  <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                  <p className={`text-xs mt-1 font-semibold ${stat.change.startsWith('+') ? 'text-success' : 'text-muted-foreground'}`}>
                    {stat.change} vs last month
                  </p>
                </div>
                <div className="ds-icon w-10 h-10">
                  <stat.icon className="w-5 h-5" />
                </div>
              </div>
            ))}
          </div>

          {/* Main Content Area */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="ds-card overflow-hidden">
                <div className="p-6 border-b bg-surface-strong/50">
                  <h3 className="font-semibold text-lg">Performance Overview</h3>
                </div>
                <div className="p-6 h-[300px] flex items-center justify-center bg-muted/10">
                  <p className="text-muted-foreground italic">Chart visualization placeholder</p>
                </div>
              </div>

              <div className="ds-card">
                <div className="p-6 border-b bg-surface-strong/50 flex items-center justify-between">
                  <h3 className="font-semibold text-lg">Recent Audits</h3>
                  <button className="text-sm text-brand-blue font-medium hover:underline flex items-center gap-1">
                    View all <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="divide-y">
                  {[1, 2, 3].map((_, i) => (
                    <div key={i} className="p-4 hover:bg-muted/50 transition-colors flex items-center justify-between cursor-pointer">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-brand-cyan/10 flex items-center justify-center text-brand-cyan">
                          <Globe className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">example-site-${i + 1}.com</p>
                          <p className="text-xs text-muted-foreground">Audit completed 2 hours ago</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="px-2 py-1 rounded-full bg-success/10 text-success text-xs font-bold">88 / 100</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="ds-card bg-gradient-ink text-white p-8 relative overflow-hidden">
                <div className="relative z-10">
                  <h3 className="text-xl font-bold">Pro Plan Features</h3>
                  <p className="mt-2 text-white/80 text-sm">
                    Unlock advanced competitor analysis and daily tracking.
                  </p>
                  <button className="mt-6 w-full py-2 bg-white text-brand-indigo rounded-full font-bold text-sm hover:bg-white/90 transition-colors">
                    Upgrade Now
                  </button>
                </div>
                {/* Decorative circles */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-purple/20 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-brand-cyan/20 rounded-full blur-3xl"></div>
              </div>

              <div className="ds-card p-6">
                <h3 className="font-semibold mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button className="w-full text-left px-4 py-3 rounded-xl border hover:border-brand-blue hover:text-brand-blue transition-all flex items-center justify-between group">
                    <span className="text-sm font-medium">Export all reports</span>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-brand-blue" />
                  </button>
                  <button className="w-full text-left px-4 py-3 rounded-xl border hover:border-brand-blue hover:text-brand-blue transition-all flex items-center justify-between group">
                    <span className="text-sm font-medium">Schedule monthly audit</span>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-brand-blue" />
                  </button>
                  <button className="w-full text-left px-4 py-3 rounded-xl border hover:border-brand-blue hover:text-brand-blue transition-all flex items-center justify-between group">
                    <span className="text-sm font-medium">Manage notifications</span>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-brand-blue" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-20 border-t bg-background py-10">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <img src="/logo.svg" alt="SEOKLIKK" className="h-6 opacity-50 grayscale" />
          <p className="text-xs text-muted-foreground">
            © 2025 SEOKLIKK Business Intelligence. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
