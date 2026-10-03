export default function Logo() {
  return (
    <a href="/" className="group flex items-center gap-3">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#0f2747] text-[#d6b36a] shadow-sm transition group-hover:bg-[#193b68]">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          className="h-7 w-7"
        >
          <path d="M12 3v17" />
          <path d="M5 7h14" />
          <path d="M7 7 4 13h6L7 7Z" />
          <path d="m17 7-3 6h6l-3-6Z" />
          <path d="M8 20h8" />
        </svg>
      </div>

      <div className="leading-none">
        <div className="text-[22px] font-bold tracking-[0.14em] text-[#0f2747]">
          LIÊM MINH
        </div>

        <div className="mt-1.5 text-[9px] font-medium tracking-[0.16em] text-slate-500">
          LIÊM CHÍNH · MINH BẠCH · CÔNG BẰNG
        </div>
      </div>
    </a>
  );
}