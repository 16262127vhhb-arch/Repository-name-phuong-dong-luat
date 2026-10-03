export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-[#f8fafc]">
      <div className="mx-auto max-w-6xl px-5 py-5 md:px-6 md:py-10">

        {/* FOOTER CONTENT */}
        <div className="grid gap-5 md:grid-cols-[1.5fr_1fr_1fr] md:gap-8">

          {/* THƯƠNG HIỆU */}
          <div>
            <a href="/" className="inline-block">
              <img
                src="/logo.png"
                alt="LIÊM MINH"
                className="h-auto w-[105px] object-contain object-left md:w-[190px]"
              />
            </a>

            <p className="mt-3 max-w-md text-[11px] leading-4 text-slate-500 md:mt-4 md:text-sm md:leading-6">
              Website cung cấp thông tin, kiến thức và phân tích pháp luật
              nhằm hỗ trợ người đọc tìm hiểu pháp luật một cách dễ hiểu
              và thực tiễn.
            </p>
          </div>

          {/* ĐIỀU HƯỚNG */}
          <div>
            <h3 className="text-[11px] font-bold text-[#0f2747] md:text-sm">
              Điều hướng
            </h3>

            <div className="mt-2.5 flex flex-col gap-1.5 text-[11px] text-slate-500 md:mt-4 md:gap-2.5 md:text-sm">
              <a
                href="/"
                className="transition hover:text-[#0f2747]"
              >
                Trang chủ
              </a>

              <a
                href="/bai-viet"
                className="transition hover:text-[#0f2747]"
              >
                Bài viết pháp luật
              </a>

              <a
                href="/gioi-thieu"
                className="transition hover:text-[#0f2747]"
              >
                Giới thiệu
              </a>

              <a
                href="/lien-he"
                className="transition hover:text-[#0f2747]"
              >
                Liên hệ
              </a>
            </div>
          </div>

          {/* THÔNG TIN */}
          <div>
            <h3 className="text-[11px] font-bold text-[#0f2747] md:text-sm">
              Thông tin
            </h3>

            <div className="mt-2.5 flex flex-col gap-1.5 text-[11px] leading-4 text-slate-500 md:mt-4 md:gap-2.5 md:text-sm md:leading-6">
              <a
                href="/dieu-khoan-mien-tru"
                className="transition hover:text-[#0f2747]"
              >
                Điều khoản & Miễn trừ
              </a>

              <span>
                Thông tin trên website mang tính chất tham khảo.
              </span>
            </div>
          </div>
        </div>

        {/* COPYRIGHT */}
        <div className="mt-5 border-t border-slate-200 pt-4 md:mt-8 md:pt-5">
          <p className="text-[10px] leading-4 text-slate-400 md:text-[11px] md:leading-5">
            © 2026 LIÊM MINH. Thông tin trên website nhằm mục đích
            cung cấp kiến thức pháp luật và không thay thế ý kiến
            tư vấn pháp lý cho từng trường hợp cụ thể.
          </p>
        </div>

      </div>
    </footer>
  );
}