// HomePage.tsx
// Halaman utama blog — layout editorial dengan featured article besar
// Tema: industrial sci-fi, monospace, abu-abu & hitam, aksen kuning

function cx(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

interface Article {
  id: string;
  tag: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
}

const FEATURED: Article = {
  id: "f01",
  tag: "UNGGULAN",
  title: "Arsitektur Sistem Terdistribusi di Era Pasca-Cloud",
  excerpt:
    "Ketika infrastruktur terpusat mulai menunjukkan batasnya, paradigma baru komputasi tepi mendefinisikan ulang cara kita membangun sistem yang tangguh — dan apa artinya untuk engineer generasi berikutnya.",
  date: "18 MEI 2026",
  readTime: "12 MENIT",
};

const RECENTS: Article[] = [
  {
    id: "r01",
    tag: "SISTEM",
    title: "Kenapa Event Sourcing Bukan Silver Bullet",
    excerpt: "Analisis jujur tentang trade-off yang sering diabaikan.",
    date: "14 MEI 2026",
    readTime: "8 MENIT",
  },
  {
    id: "r02",
    tag: "BAHASA",
    title: "Rust di Produksi: 18 Bulan Kemudian",
    excerpt: "Laporan lapangan dari tim yang migrasi penuh ke Rust.",
    date: "09 MEI 2026",
    readTime: "15 MENIT",
  },
  {
    id: "r03",
    tag: "JARINGAN",
    title: "eBPF dan Masa Depan Observabilitas",
    excerpt: "Kernel programmability mengubah cara kita debug produksi.",
    date: "02 MEI 2026",
    readTime: "10 MENIT",
  },
];

const TICKER_ITEMS = [
  "SISTEM AKTIF",
  "NODE-04 // ONLINE",
  "BUILD 2026.05.18",
  "UPTIME 99.97%",
  "ARTIKEL TERBARU TERSEDIA",
  "INDEKS DIPERBARUI",
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#c9c9c9] font-mono relative overflow-hidden">

      {/* ── Grid texture background ── */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 opacity-[0.04] z-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg,transparent,transparent 40px,#000 40px,#000 41px)," +
            "repeating-linear-gradient(90deg,transparent,transparent 40px,#000 40px,#000 41px)",
        }}
      />

      {/* ── Ticker tape ── */}
      <div className="relative z-10 border-b border-[#aaa] bg-[#1a1a1a] overflow-hidden h-8 flex items-center">
        <div className="flex animate-[marquee_20s_linear_infinite] whitespace-nowrap gap-12">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((t, i) => (
            <span key={i} className="text-[10px] tracking-[0.3em] text-[#e8c830] uppercase">
              {i % 2 === 0 ? "◆" : "·"} {t}
            </span>
          ))}
        </div>
      </div>

      <div className="relative z-10 px-8 py-10 max-w-4xl">

        {/* ── Page header ── */}
        <div className="mb-10">
          <span className="text-[9px] tracking-[0.4em] text-[#777] uppercase">
            {"// INDEKS UTAMA"}
          </span>
          <h2 className="text-[11px] tracking-[0.5em] text-[#555] uppercase mt-1">
            TERMA//LOG — BERANDA
          </h2>
        </div>

        {/* ── Featured article ── */}
        <div className="mb-10 border border-[#aaa] bg-[#bebebe] relative group cursor-pointer">
          {/* yellow left bar */}
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#e8c830]" />
          {/* corner ticks */}
          <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-[#888]" />
          <div className="absolute bottom-2 left-6 w-3 h-3 border-b border-l border-[#888]" />

          <div className="px-8 py-8">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-[9px] tracking-[0.3em] bg-[#e8c830] text-[#1a1a1a] px-2 py-[2px] font-bold">
                {FEATURED.tag}
              </span>
              <span className="text-[9px] tracking-[0.2em] text-[#777]">
                {FEATURED.date}
              </span>
              <span className="text-[9px] tracking-[0.2em] text-[#999]">
                {"// "}{FEATURED.readTime}
              </span>
            </div>

            <h1 className="text-2xl font-black tracking-tight leading-tight text-[#1a1a1a] mb-4 max-w-xl">
              {FEATURED.title}
            </h1>

            <p className="text-[12px] leading-relaxed text-[#444] max-w-lg tracking-wide">
              {FEATURED.excerpt}
            </p>

            <div className="mt-6 flex items-center gap-3">
              <span className="text-[10px] tracking-[0.3em] text-[#1a1a1a] border-b border-[#e8c830] pb-[1px] uppercase group-hover:text-[#e8c830] transition-colors duration-150">
                BACA ARTIKEL
              </span>
              <span className="text-[#e8c830]">→</span>
            </div>
          </div>
        </div>

        {/* ── Divider ── */}
        <div className="flex items-center gap-3 mb-8">
          <span className="text-[9px] tracking-[0.4em] text-[#888] uppercase">TERBARU</span>
          <div className="flex-1 h-px bg-[#aaa]" />
          <div className="w-1 h-1 bg-[#e8c830]" />
        </div>

        {/* ── Recent articles ── */}
        <div className="flex flex-col gap-[3px]">
          {RECENTS.map((a, i) => (
            <div
              key={a.id}
              className="group flex items-start gap-6 px-5 py-4 bg-[#c1c1c1]/70 hover:bg-[#1a1a1a] border border-transparent hover:border-[#333] cursor-pointer transition-colors duration-200 relative overflow-hidden"
            >
              {/* index number */}
              <span className="text-[11px] text-[#aaa] group-hover:text-[#444] w-6 shrink-0 pt-[2px] transition-colors duration-200">
                {String(i + 1).padStart(2, "0")}
              </span>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-[8px] tracking-[0.3em] text-[#888] group-hover:text-[#666] transition-colors duration-200 uppercase">
                    [{a.tag}]
                  </span>
                  <span className="text-[8px] tracking-[0.15em] text-[#aaa] group-hover:text-[#555] transition-colors duration-200">
                    {a.date}
                  </span>
                </div>
                <h3 className="text-[13px] font-bold text-[#1a1a1a] group-hover:text-white leading-snug tracking-tight transition-colors duration-200">
                  {a.title}
                </h3>
                <p className="text-[11px] text-[#666] group-hover:text-[#999] mt-1 leading-relaxed transition-colors duration-200">
                  {a.excerpt}
                </p>
              </div>

              <span className="text-[9px] tracking-[0.2em] text-[#aaa] group-hover:text-[#555] shrink-0 pt-[2px] transition-colors duration-200">
                {a.readTime}
              </span>

              {/* hover accent */}
              <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#e8c830] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-200" />
            </div>
          ))}
        </div>

        {/* ── Footer note ── */}
        <div className="mt-12 flex items-center gap-3">
          <div className="h-px flex-1 bg-[#aaa]" />
          <span className="text-[8px] tracking-[0.3em] text-[#aaa] uppercase">
            EOF // INDEKS
          </span>
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}