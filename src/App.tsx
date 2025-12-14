import { BackgroundSurface } from './components/shared/BackgroundSurface';
import { TopMenu } from './components/shared/TopMenu';

export default function App() {
  return (
    <div className="min-h-screen text-white">
      <BackgroundSurface />
      <TopMenu />

      <main className="relative mx-auto max-w-6xl px-6 pb-16 pt-10">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          <section className="space-y-6">
            <p className="text-xs font-semibold tracking-[0.2em] text-white/35">WORKFLOWS</p>
            <ul className="space-y-5 text-lg font-medium">
              <li className="flex items-center gap-3 text-white/85">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#2D7BFF]/20 ring-1 ring-white/10">
                  ⬆
                </span>
                Upload Contract
              </li>
              <li className="flex items-center gap-3 text-white/80">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-fuchsia-500/20 ring-1 ring-white/10">
                  📄
                </span>
                Choose Template
              </li>
              <li className="flex items-center gap-3 text-white/80">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/20 ring-1 ring-white/10">
                  ✅
                </span>
                Quick Compliance Scan
              </li>
            </ul>
          </section>

          <section className="space-y-6">
            <p className="text-xs font-semibold tracking-[0.2em] text-white/35">MODULES</p>
            <ul className="space-y-5 text-lg font-medium">
              <li className="flex items-center gap-3 text-white/85">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-blue-500/20 ring-1 ring-white/10">
                  📘
                </span>
                Contracts Only
              </li>
              <li className="flex items-center gap-3 text-white/80">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-violet-500/20 ring-1 ring-white/10">
                  🗂
                </span>
                Templates Hub
              </li>
              <li className="flex items-center gap-3 text-white/80">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/20 ring-1 ring-white/10">
                  🧩
                </span>
                Single Department Mode
              </li>
            </ul>
          </section>

          <section className="space-y-6">
            <p className="text-xs font-semibold tracking-[0.2em] text-white/35">INTEGRATIONS</p>
            <ul className="space-y-5 text-lg font-medium">
              <li className="flex items-center gap-3 text-white/85">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-sky-500/20 ring-1 ring-white/10">
                  ☁
                </span>
                Google Drive
              </li>
              <li className="flex items-center gap-3 text-white/80">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/10">
                  📝
                </span>
                Notion
              </li>
              <li className="flex items-center gap-3 text-white/80">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-red-500/20 ring-1 ring-white/10">
                  💬
                </span>
                Slack
              </li>
            </ul>
          </section>
        </div>
      </main>
    </div>
  );
}
