export default function GioiThieuPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      {/* HERO */}
      <section className="border-b border-slate-200 bg-[#f5f7fa]">
        <div className="mx-auto max-w-6xl px-6 py-14 md:py-20">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-[#d6b36a]" />

              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#b88d3b]">
                Về LIÊM MINH
              </span>
            </div>

            <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight text-[#0f2747] md:text-5xl">
              Kiến thức pháp luật
              <br />
              rõ ràng và thực tiễn
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 md:text-lg">
              LIÊM MINH là nền tảng cung cấp, hệ thống hóa và chia sẻ
              kiến thức pháp luật, hướng đến việc giúp mọi người tiếp cận
              các quy định pháp luật một cách rõ ràng, dễ hiểu và thực tiễn.
            </p>
          </div>
        </div>
      </section>

      {/* GIỚI THIỆU */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-6 py-12 md:py-16">
          <div className="grid gap-10 md:grid-cols-[1.1fr_0.9fr] md:items-start">
            <div>
              <div className="flex items-center gap-3">
                <span className="h-px w-9 bg-[#d6b36a]" />

                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#b88d3b]">
                  LIÊM MINH
                </span>
              </div>

              <h2 className="mt-3 text-2xl font-bold text-[#0f2747] md:text-3xl">
                Cung cấp kiến thức pháp luật
              </h2>

              <div className="mt-5 space-y-4 text-[16px] leading-7 text-slate-600">
                <p>
                  LIÊM MINH tập trung xây dựng và chia sẻ các nội dung pháp
                  luật theo từng lĩnh vực, giúp người đọc có thêm nguồn
                  thông tin để tìm hiểu và chủ động hơn khi gặp những vấn
                  đề pháp lý trong đời sống, công việc và hoạt động kinh
                  doanh.
                </p>

                <p>
                  Các bài viết được tổ chức theo từng nhóm lĩnh vực như
                  dân sự, hình sự, đất đai, hôn nhân và gia đình, doanh
                  nghiệp, lao động, kinh doanh thương mại, thi hành án và
                  các lĩnh vực pháp luật khác.
                </p>

                <p>
                  Mục tiêu của LIÊM MINH là trình bày các vấn đề pháp luật
                  theo hướng dễ tiếp cận, có hệ thống và gắn với những
                  tình huống thực tế.
                </p>
              </div>
            </div>

            {/* KHỐI NGUYÊN TẮC */}
            <div className="rounded-2xl border border-slate-200 bg-[#f8fafc] p-7">
              <div className="text-sm font-bold uppercase tracking-[0.15em] text-[#0f2747]">
                Giá trị hướng đến
              </div>

              <div className="mt-6 space-y-5">
                <div className="flex gap-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#e9eef4] text-sm font-bold text-[#0f2747]">
                    01
                  </div>

                  <div>
                    <h3 className="font-bold text-[#0f2747]">
                      Liêm chính
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      Tôn trọng sự chính xác, khách quan và trách nhiệm
                      trong việc cung cấp thông tin pháp luật.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#e9eef4] text-sm font-bold text-[#0f2747]">
                    02
                  </div>

                  <div>
                    <h3 className="font-bold text-[#0f2747]">
                      Minh bạch
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      Trình bày thông tin rõ ràng, dễ hiểu và phân biệt
                      giữa thông tin tham khảo với việc tư vấn cho từng
                      vụ việc cụ thể.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#e9eef4] text-sm font-bold text-[#0f2747]">
                    03
                  </div>

                  <div>
                    <h3 className="font-bold text-[#0f2747]">
                      Công bằng
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      Hướng đến việc giúp người đọc hiểu đúng quyền,
                      nghĩa vụ và các lựa chọn pháp lý của mình.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HỖ TRỢ PHÁP LÝ */}
      <section className="border-y border-slate-200 bg-[#f5f7fa]">
        <div className="mx-auto max-w-6xl px-6 py-12 md:py-16">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3">
              <span className="h-px w-9 bg-[#d6b36a]" />

              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#b88d3b]">
                Hỗ trợ pháp lý
              </span>
            </div>

            <h2 className="mt-3 text-2xl font-bold text-[#0f2747] md:text-3xl">
              Khi bạn cần hỗ trợ cho một vấn đề cụ thể
            </h2>

            <div className="mt-5 space-y-4 text-[16px] leading-7 text-slate-600">
              <p>
                Bên cạnh việc cung cấp kiến thức pháp luật, LIÊM MINH tiếp
                nhận nhu cầu trao đổi và hỗ trợ đối với các vấn đề pháp lý
                cụ thể.
              </p>

              <p>
                Trường hợp khách hàng có nhu cầu, LIÊM MINH có thể cung
                cấp dịch vụ pháp lý phù hợp với từng vụ việc, trên cơ sở
                trao đổi về nội dung, yêu cầu và phạm vi công việc.
              </p>

              <p>
                Nếu bạn đang gặp một vấn đề pháp lý hoặc cần tìm hiểu về
                một dịch vụ pháp lý cụ thể, hãy liên hệ với LIÊM MINH để
                được trao đổi và hướng dẫn.
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="/lien-he"
              className="inline-flex items-center justify-center rounded-lg bg-[#0f2747] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#17365f]"
            >
              Liên hệ với chúng tôi
              <span className="ml-2">→</span>
            </a>

            <a
              href="/bai-viet"
              className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-[#0f2747] transition hover:border-[#b88d3b] hover:text-[#b88d3b]"
            >
              Xem bài viết pháp luật
            </a>
          </div>
        </div>
      </section>

      {/* LƯU Ý */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-6 py-10 md:py-14">
          <div className="max-w-4xl rounded-xl border border-slate-200 bg-[#f8fafc] p-6 md:p-7">
            <div className="flex items-start gap-4">
              <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#e9eef4] text-[#0f2747]">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-5 w-5"
                >
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 10v6" />
                  <path d="M12 7h.01" />
                </svg>
              </div>

              <div>
                <h2 className="text-sm font-bold text-[#0f2747]">
                  Thông tin tham khảo
                </h2>

                <p className="mt-1.5 text-sm leading-6 text-slate-600">
                  Nội dung trên website được cung cấp nhằm mục đích tham
                  khảo và cung cấp thông tin pháp luật phổ thông. Nội dung
                  trên website không thay thế cho ý kiến tư vấn pháp lý
                  đối với từng vụ việc cụ thể.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}