import { sql } from "@/lib/db";
import Hero from "@/components/Hero";

const categories = [
  {
    name: "Hôn nhân & gia đình",
    slug: "hon-nhan-gia-dinh",
    description:
      "Kết hôn, ly hôn, con chung, tài sản và quan hệ gia đình.",
  },
  {
    name: "Hình sự",
    slug: "hinh-su",
    description:
      "Pháp luật hình sự và các vấn đề tố tụng hình sự.",
  },
  {
    name: "Dân sự",
    slug: "dan-su",
    description:
      "Hợp đồng, nghĩa vụ, bồi thường, thừa kế và quan hệ dân sự.",
  },
  {
    name: "Đất đai",
    slug: "dat-dai",
    description:
      "Quyền sử dụng đất, thủ tục và tranh chấp đất đai.",
  },
  {
    name: "Doanh nghiệp",
    slug: "doanh-nghiep",
    description:
      "Thành lập, quản trị và hoạt động của doanh nghiệp.",
  },
  {
    name: "Kinh doanh & thương mại",
    slug: "kinh-doanh-thuong-mai",
    description:
      "Hợp đồng thương mại và tranh chấp kinh doanh.",
  },
  {
    name: "Lao động",
    slug: "lao-dong",
    description:
      "Hợp đồng lao động, tiền lương, bảo hiểm và quan hệ lao động.",
  },
  {
    name: "Thi hành án",
    slug: "thi-hanh-an",
    description:
      "Quy định và thủ tục thi hành án dân sự.",
  },
  {
    name: "Các lĩnh vực khác",
    slug: "cac-linh-vuc-khac",
    description:
      "Các vấn đề pháp luật khác được cập nhật.",
  },
];

function slugify(text: string) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function formatDate(date: string | Date | null) {
  if (!date) return "";

  return new Date(date).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default async function Home() {
  const articles = await sql`
    SELECT
      id,
      title,
      slug,
      category,
      excerpt,
      image_url,
      published_at,
      created_at,
      featured
    FROM articles
    WHERE published = true
    ORDER BY COALESCE(published_at, created_at) DESC
  `;

  const latestArticles = articles.slice(0, 6);

  const featuredArticles = articles
    .filter((article) => article.featured)
    .slice(0, 3);

  const displayFeatured =
    featuredArticles.length > 0
      ? featuredArticles
      : latestArticles.slice(0, 3);

  const mainFeatured = displayFeatured[0];
  const secondaryFeatured = displayFeatured.slice(1, 3);

  return (
    <main className="min-h-screen bg-white text-slate-900">

      {/* =========================================================
          HERO
      ========================================================= */}

      <Hero />

      {/* =========================================================
          LĨNH VỰC PHÁP LUẬT
      ========================================================= */}

      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-5 py-10 md:px-6 md:py-16">

          <div className="mb-7 flex flex-col justify-between gap-4 md:flex-row md:items-end">

            <div>
              <div className="flex items-center gap-3">
                <span className="h-px w-10 bg-[#d6b36a]" />

                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#b88d3b]">
                  Tra cứu theo lĩnh vực
                </p>
              </div>

              <h2 className="mt-3 text-[28px] font-bold leading-tight tracking-tight text-[#0f2747] md:text-[34px]">
                Lĩnh vực pháp luật
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Hệ thống kiến thức được phân loại theo từng nhóm vấn đề pháp lý.
              </p>
            </div>

            <a
              href="/bai-viet"
              className="inline-flex items-center text-sm font-semibold text-[#0f2747] transition hover:text-[#b88d3b]"
            >
              Xem tất cả bài viết
              <span className="ml-2">→</span>
            </a>

          </div>

          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">

            <div className="grid sm:grid-cols-2 lg:grid-cols-3">

              {categories.map((category, index) => (
                <a
                  key={category.slug}
                  href={`/bai-viet/${category.slug}`}
                  className="group relative border-b border-slate-200 p-4 transition-all duration-200 hover:bg-[#f7f9fb] sm:p-5 sm:[&:nth-child(odd)]:border-r lg:[&:nth-child(3n+1)]:border-r lg:[&:nth-child(3n+2)]:border-r"
                >

                  <span className="absolute bottom-0 left-0 top-0 w-[3px] origin-bottom scale-y-0 bg-[#d6b36a] transition-transform duration-200 group-hover:scale-y-100" />

                  <div className="flex min-h-[105px] gap-4">

                    <div className="flex shrink-0 flex-col items-center">
                      <span className="text-xs font-bold tracking-wider text-[#b88d3b]">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <span className="mt-3 h-8 w-px bg-slate-200 transition-colors group-hover:bg-[#d6b36a]" />
                    </div>

                    <div className="min-w-0 flex-1">

                      <div className="flex items-start justify-between gap-3">

                        <h3 className="text-[15px] font-bold leading-5 text-[#0f2747] transition-colors group-hover:text-[#b88d3b]">
                          {category.name}
                        </h3>

                        <span className="mt-0.5 shrink-0 text-base text-slate-300 transition-all duration-200 group-hover:translate-x-1 group-hover:text-[#b88d3b]">
                          →
                        </span>

                      </div>

                      <p className="mt-2 max-w-[270px] text-xs leading-5 text-slate-500">
                        {category.description}
                      </p>

                    </div>

                  </div>

                </a>
              ))}

            </div>

          </div>

        </div>
      </section>

      {/* =========================================================
          BÀI VIẾT NỔI BẬT
      ========================================================= */}

      {displayFeatured.length > 0 && (
        <section className="border-y border-slate-200 bg-[#f5f7fa]">

          <div className="mx-auto max-w-6xl px-5 py-10 md:px-6 md:py-16">

            <div className="mb-7 flex flex-col justify-between gap-4 md:flex-row md:items-end">

              <div>

                <div className="flex items-center gap-3">
                  <span className="h-px w-10 bg-[#d6b36a]" />

                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#b88d3b]">
                    Nội dung đáng chú ý
                  </p>
                </div>

                <h2 className="mt-3 text-[28px] font-bold leading-tight tracking-tight text-[#0f2747] md:text-[34px]">
                  Bài viết nổi bật
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Những nội dung được lựa chọn và đánh dấu nổi bật trên LIÊM MINH.
                </p>

              </div>

              <a
                href="/bai-viet"
                className="text-sm font-semibold text-[#0f2747] transition hover:text-[#b88d3b]"
              >
                Xem tất cả bài viết →
              </a>

            </div>

            <div className="grid gap-5 lg:grid-cols-[1.45fr_1fr]">

              {/* BÀI CHÍNH */}

              {mainFeatured && (
                <article className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:shadow-md">

                  {mainFeatured.image_url ? (
                    <a
                      href={`/bai-viet/${slugify(
                        mainFeatured.category
                      )}/${mainFeatured.slug}`}
                      className="block aspect-[16/9] overflow-hidden bg-slate-100"
                    >
                      <img
                        src={mainFeatured.image_url}
                        alt={mainFeatured.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                      />
                    </a>
                  ) : (
                    <a
                      href={`/bai-viet/${slugify(
                        mainFeatured.category
                      )}/${mainFeatured.slug}`}
                      className="flex aspect-[16/9] items-center justify-center bg-[#e9eef4]"
                    >
                      <div className="text-center">
                        <div className="text-2xl font-bold tracking-[0.12em] text-[#0f2747]">
                          LIÊM MINH
                        </div>

                        <div className="mt-2 text-[9px] font-bold uppercase tracking-[0.2em] text-[#b88d3b]">
                          Kiến thức pháp luật
                        </div>
                      </div>
                    </a>
                  )}

                  <div className="p-6">

                    <div className="flex flex-wrap items-center gap-3 text-xs">

                      <span className="font-bold text-[#806322]">
                        {mainFeatured.category}
                      </span>

                      <span className="h-1 w-1 rounded-full bg-slate-300" />

                      <span className="text-slate-400">
                        {formatDate(
                          mainFeatured.published_at ||
                            mainFeatured.created_at
                        )}
                      </span>

                    </div>

                    <a
                      href={`/bai-viet/${slugify(
                        mainFeatured.category
                      )}/${mainFeatured.slug}`}
                    >
                      <h3 className="mt-3 text-[18px] font-bold leading-6 text-[#0f2747] transition group-hover:text-[#b88d3b] md:text-2xl">
                        {mainFeatured.title}
                      </h3>
                    </a>

                    {mainFeatured.excerpt && (
                      <p className="mt-3 line-clamp-3 text-[13px] leading-5 text-slate-600">
                        {mainFeatured.excerpt}
                      </p>
                    )}

                    <a
                      href={`/bai-viet/${slugify(
                        mainFeatured.category
                      )}/${mainFeatured.slug}`}
                      className="mt-4 inline-flex items-center text-xs font-semibold text-[#0f2747] transition hover:text-[#b88d3b] sm:mt-5 sm:text-sm"
                    >
                      Đọc bài viết
                      <span className="ml-2">→</span>
                    </a>

                  </div>

                </article>
              )}

              {/* BÀI PHỤ */}

              <div className="grid gap-5">

                {secondaryFeatured.map((article: any) => (
                  <article
                    key={article.id}
                    className="group flex min-h-[170px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:shadow-md"
                  >

                    {article.image_url ? (
                      <a
                        href={`/bai-viet/${slugify(
                          article.category
                        )}/${article.slug}`}
                        className="block w-[38%] shrink-0 overflow-hidden bg-slate-100"
                      >
                        <img
                          src={article.image_url}
                          alt={article.title}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      </a>
                    ) : (
                      <a
                        href={`/bai-viet/${slugify(
                          article.category
                        )}/${article.slug}`}
                        className="flex w-[38%] shrink-0 items-center justify-center bg-[#e9eef4]"
                      >
                        <span className="text-sm font-bold tracking-[0.12em] text-[#0f2747]">
                          LM
                        </span>
                      </a>
                    )}

                    <div className="flex flex-1 flex-col justify-center p-4 sm:p-5">

                      <div className="text-[10px] font-bold uppercase tracking-wide text-[#806322]">
                        {article.category}
                      </div>

                      <a
                        href={`/bai-viet/${slugify(
                          article.category
                        )}/${article.slug}`}
                      >
                        <h3 className="mt-2 line-clamp-3 text-sm font-bold leading-5 text-[#0f2747] transition group-hover:text-[#b88d3b]">
                          {article.title}
                        </h3>
                      </a>

                      <div className="mt-2 text-[11px] text-slate-400">
                        {formatDate(
                          article.published_at ||
                            article.created_at
                        )}
                      </div>

                      <a
                        href={`/bai-viet/${slugify(
                          article.category
                        )}/${article.slug}`}
                        className="mt-4 text-xs font-semibold text-[#0f2747] transition hover:text-[#b88d3b]"
                      >
                        Đọc bài viết →
                      </a>

                    </div>

                  </article>
                ))}

              </div>

            </div>

          </div>

        </section>
      )}

      {/* =========================================================
          BÀI VIẾT MỚI NHẤT
      ========================================================= */}

      <section className="bg-white">

        <div className="mx-auto max-w-6xl px-5 py-10 md:px-6 md:py-16">

          <div className="mb-7 flex flex-col justify-between gap-4 md:flex-row md:items-end">

            <div>

              <div className="flex items-center gap-3">
                <span className="h-px w-10 bg-[#d6b36a]" />

                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#b88d3b]">
                  Cập nhật mới
                </p>
              </div>

              <h2 className="mt-3 text-[28px] font-bold leading-tight tracking-tight text-[#0f2747] md:text-[34px]">
                Bài viết mới nhất
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Những bài viết mới được cập nhật trên LIÊM MINH.
              </p>

            </div>

            <a
              href="/bai-viet"
              className="text-sm font-semibold text-[#0f2747] transition hover:text-[#b88d3b]"
            >
              Xem tất cả →
            </a>

          </div>

          {latestArticles.length > 0 ? (
            <div className="overflow-hidden rounded-xl border border-slate-200">

              {latestArticles.map((article: any) => (
                <article
                  key={article.id}
                  className="group border-b border-slate-200 bg-white px-4 py-4 last:border-b-0 transition hover:bg-[#f8fafc] sm:px-5 sm:py-5"
                >

                  <div className="grid gap-2 md:grid-cols-[120px_160px_1fr_auto] md:items-center md:gap-5">

                    <div className="text-xs text-slate-400">
                      {formatDate(
                        article.published_at ||
                          article.created_at
                      )}
                    </div>

                    <div className="text-xs font-semibold text-[#806322]">
                      {article.category}
                    </div>

                    <div>

                      <a
                        href={`/bai-viet/${slugify(
                          article.category
                        )}/${article.slug}`}
                      >
                        <h3 className="text-sm font-bold leading-6 text-[#0f2747] transition group-hover:text-[#b88d3b]">
                          {article.title}
                        </h3>
                      </a>

                      {article.excerpt && (
                        <p className="mt-1 line-clamp-1 text-xs text-slate-500">
                          {article.excerpt}
                        </p>
                      )}

                    </div>

                    <a
                      href={`/bai-viet/${slugify(
                        article.category
                      )}/${article.slug}`}
                      className="text-xs font-semibold text-[#0f2747] transition group-hover:text-[#b88d3b]"
                    >
                      Đọc →
                    </a>

                  </div>

                </article>
              ))}

            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-300 px-6 py-12 text-center">
              <p className="text-sm text-slate-500">
                Chưa có bài viết được xuất bản.
              </p>
            </div>
          )}

        </div>

      </section>

      {/* =========================================================
          LIÊN HỆ
      ========================================================= */}

      <section className="border-t border-slate-200 bg-[#f5f7fa]">

        <div className="mx-auto max-w-6xl px-5 py-10 md:px-6 md:py-16">

          <div className="relative overflow-hidden rounded-2xl bg-[#0f2747] px-5 py-8 text-white sm:px-7 sm:py-10 md:px-12 md:py-12">

            <div className="pointer-events-none absolute right-[-80px] top-[-100px] h-72 w-72 rounded-full bg-[#d6b36a]/10 blur-3xl" />

            <div className="relative max-w-2xl">

              <div className="flex items-center gap-3">
                <span className="h-px w-10 bg-[#d6b36a]" />

                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#d6b36a]">
                  Hỗ trợ pháp lý
                </p>
              </div>

              <h2 className="mt-3 text-2xl font-bold tracking-tight md:text-3xl">
                Bạn đang gặp một vấn đề pháp lý?
              </h2>

              <p className="mt-4 text-sm leading-6 text-slate-300 md:text-base">
                Nếu bạn đang cần tìm hiểu một vấn đề pháp luật cụ thể,
                có thể liên hệ để được trao đổi và hướng dẫn phù hợp.
              </p>

              <a
                href="/lien-he"
                className="mt-6 inline-flex items-center rounded-lg bg-white px-5 py-3 text-sm font-semibold text-[#0f2747] transition hover:bg-[#f5efe2]"
              >
                Liên hệ để được hướng dẫn
                <span className="ml-2">→</span>
              </a>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}