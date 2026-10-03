export default function Header() {
  return (
    <header className="relative z-50 overflow-hidden border-[1.5px] border-[#c39a52] bg-white">

      {/* =========================================
          KHUNG TRANG TRÍ PHÍA TRÊN
         ========================================= */}

      <div className="pointer-events-none absolute left-0 right-0 top-[3px] flex items-center justify-center">
        <div className="absolute left-5 right-5 h-px bg-[#e1c98f]" />

        <div className="absolute left-0 top-0 h-[10px] w-[70px] border-l-[1.5px] border-t-[1.5px] border-[#c39a52]" />
        <div className="absolute right-0 top-0 h-[10px] w-[70px] border-r-[1.5px] border-t-[1.5px] border-[#c39a52]" />
      </div>

      {/* =========================================
          KHUNG TRANG TRÍ PHÍA DƯỚI
         ========================================= */}

      <div className="pointer-events-none absolute bottom-0 left-0 right-0 flex items-center justify-center">

        {/* Đường ngoài */}
        <div className="absolute left-0 right-0 h-[1.5px] bg-[#c39a52]" />

        {/* Đường trong */}
        <div className="absolute left-5 right-5 h-px bg-[#e1c98f]" />

        {/* Hoa văn trung tâm */}
        <div className="relative z-10 flex items-center gap-2 bg-white px-5">

          <span className="h-px w-12 bg-[#c39a52]" />

          <span className="relative flex h-4 w-4 rotate-45 items-center justify-center border-[1.5px] border-[#c39a52] bg-white">
            <span className="h-1.5 w-1.5 bg-[#c39a52]" />
          </span>

          <span className="h-px w-12 bg-[#c39a52]" />

        </div>
      </div>

      {/* =========================================
          GÓC KHUNG KIỂU CHÂU ÂU
         ========================================= */}

      {/* Góc trên trái */}
      <div className="pointer-events-none absolute left-2 top-2 h-5 w-5 border-l-[1.5px] border-t-[1.5px] border-[#c39a52]" />
      <div className="pointer-events-none absolute left-[7px] top-[7px] h-2.5 w-2.5 border-l border-t border-[#e1c98f]" />

      {/* Góc trên phải */}
      <div className="pointer-events-none absolute right-2 top-2 h-5 w-5 border-r-[1.5px] border-t-[1.5px] border-[#c39a52]" />
      <div className="pointer-events-none absolute right-[7px] top-[7px] h-2.5 w-2.5 border-r border-t border-[#e1c98f]" />

      {/* Góc dưới trái */}
      <div className="pointer-events-none absolute bottom-2 left-2 h-5 w-5 border-b-[1.5px] border-l-[1.5px] border-[#c39a52]" />
      <div className="pointer-events-none absolute bottom-[7px] left-[7px] h-2.5 w-2.5 border-b border-l border-[#e1c98f]" />

      {/* Góc dưới phải */}
      <div className="pointer-events-none absolute bottom-2 right-2 h-5 w-5 border-b-[1.5px] border-r-[1.5px] border-[#c39a52]" />
      <div className="pointer-events-none absolute bottom-[7px] right-[7px] h-2.5 w-2.5 border-b border-r border-[#e1c98f]" />

      {/* =========================================
          NỘI DUNG HEADER
         ========================================= */}

      <div className="mx-auto flex min-h-[72px] max-w-6xl items-center justify-between px-4 md:min-h-[88px] md:px-6">

        {/* LOGO */}
        <a
          href="/"
          className="flex items-center"
          aria-label="LIÊM MINH - Trang chủ"
        >
          <img
            src="/logo.png"
            alt="LIÊM MINH"
            className="h-auto w-[125px] object-contain object-left md:w-[205px]"
          />
        </a>

        {/* MENU */}
        <nav className="hidden items-center md:flex">

          <a
            href="/"
            className="group relative px-5 py-8 text-[15px] font-bold text-[#0f2747]"
          >
            Trang chủ

            <span className="absolute bottom-[1px] left-5 right-5 h-[2px] bg-[#c39a52]" />
          </a>

          <a
            href="/bai-viet"
            className="group relative px-5 py-8 text-[15px] font-semibold text-[#1b2d45] transition hover:text-[#0f2747]"
          >
            Bài viết pháp luật

            <span className="absolute bottom-[1px] left-5 right-5 h-[2px] origin-left scale-x-0 bg-[#c39a52] transition-transform group-hover:scale-x-100" />
          </a>

          <a
            href="/gioi-thieu"
            className="group relative px-5 py-8 text-[15px] font-semibold text-[#1b2d45] transition hover:text-[#0f2747]"
          >
            Giới thiệu

            <span className="absolute bottom-[1px] left-5 right-5 h-[2px] origin-left scale-x-0 bg-[#c39a52] transition-transform group-hover:scale-x-100" />
          </a>

          <a
            href="/lien-he"
            className="ml-4 rounded-md border-[1.5px] border-[#c39a52] bg-[#0f2747] px-6 py-3 text-[15px] font-bold !text-white transition hover:bg-[#193b68]"
          >
            Liên hệ
          </a>

          <a
            href="/quan-tri/dang-nhap"
            className="ml-3 rounded-md border border-[#c39a52] px-4 py-2.5 text-sm font-semibold text-[#0f2747] transition hover:bg-[#faf7ef]"
          >
            Đăng nhập
          </a>

        </nav>

        {/* MOBILE */}
        <button
          type="button"
          aria-label="Mở menu"
          className="flex h-10 w-10 items-center justify-center rounded-md border-[1.5px] border-[#c39a52] text-[#0f2747] transition hover:bg-[#faf7ef] md:hidden"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-5 w-5"
          >
            <path d="M4 6h16" />
            <path d="M4 12h16" />
            <path d="M4 18h16" />
          </svg>
        </button>

      </div>
    </header>
  );
}