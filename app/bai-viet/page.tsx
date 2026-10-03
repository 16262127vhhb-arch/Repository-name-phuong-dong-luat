import { sql } from "@/lib/db";

const categories = [
  {
    name: "Hôn nhân & gia đình",
    slug: "hon-nhan-gia-dinh",
  },
  {
    name: "Hình sự",
    slug: "hinh-su",
  },
  {
    name: "Dân sự",
    slug: "dan-su",
  },
  {
    name: "Đất đai",
    slug: "dat-dai",
  },
  {
    name: "Doanh nghiệp",
    slug: "doanh-nghiep",
  },
  {
    name: "Kinh doanh & thương mại",
    slug: "kinh-doanh-thuong-mai",
  },
  {
    name: "Lao động",
    slug: "lao-dong",
  },
  {
    name: "Thi hành án",
    slug: "thi-hanh-an",
  },
  {
    name: "Các lĩnh vực khác",
    slug: "cac-linh-vuc-khac",
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

export default async function BaiVietPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    category?: string;
  }>;
}) {
  const params = await searchParams;

  const q = (params.q || "").trim();

  const selectedCategory = categories.find(
    (category) => category.slug === params.category
  );

  let articles;

  if (q && selectedCategory) {
    const keyword = `%${q}%`;

    articles = await sql`
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
        AND category = ${selectedCategory.name}
        AND (
          title ILIKE ${keyword}
          OR content ILIKE ${keyword}
          OR category ILIKE ${keyword}
        )
      ORDER BY COALESCE(published_at, created_at) DESC
    `;
  } else if (q) {
    const keyword = `%${q}%`;

    articles = await sql`
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
        AND (
          title ILIKE ${keyword}
          OR content ILIKE ${keyword}
          OR category ILIKE ${keyword}
        )
      ORDER BY COALESCE(published_at, created_at) DESC
    `;
  } else if (selectedCategory) {
    articles = await sql`
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
        AND category = ${selectedCategory.name}
      ORDER BY COALESCE(published_at, created_at) DESC
    `;
  } else {
    articles = await sql`
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
  }

  return (
    <main className="min-h-screen bg-white text-[#1b2d45]">

      {/* =========================================================
          TIÊU ĐỀ TRANG
         ========================================================= */}

      <section className="relative overflow-hidden border-b border-[#d6b36a] bg-[#eef2f6]">

        {/* Đường vàng phía trên */}
        <div className="pointer-events-none absolute left-0 right-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#c39a52] to-transparent" />

        {/* Đường vàng phía dưới */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-[#d6b36a]" />

        <div className="mx-auto max-w-6xl px-6 py-8 md:py-10">

          <div className="relative">

            {/* Nhãn thương hiệu */}
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-[#c39a52]" />

              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#806322]">
                LIÊM MINH
              </p>
            </div>

            {/* Tiêu đề */}
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-[#0f2747] md:text-4xl">
              Bài viết pháp luật
            </h1>

            {/* Mô tả */}
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#40536b] md:text-base">
              Tổng hợp kiến thức, phân tích và giải thích các vấn đề pháp luật
              thường gặp trong thực tế.
            </p>

            {/* Điểm nhấn */}
            <div className="mt-6 flex items-center gap-2">
              <span className="h-px w-16 bg-[#c39a52]" />

              <span className="relative flex h-3 w-3 rotate-45 items-center justify-center border border-[#c39a52] bg-[#eef2f6]">
                <span className="h-1 w-1 bg-[#c39a52]" />
              </span>

              <span className="h-px w-8 bg-[#c39a52]" />
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================
          TÌM KIẾM + LĨNH VỰC
         ========================================================= */}

      <section className="border-b border-[#dfe4ea] bg-white">

        <div className="mx-auto max-w-6xl px-6 py-8">

          {/* TÌM KIẾM */}

          <form
            action="/bai-viet"
            method="GET"
            className="flex max-w-3xl overflow-hidden rounded-lg border border-[#cfd6df] bg-white shadow-sm transition focus-within:border-[#c39a52] focus-within:ring-2 focus-within:ring-[#c39a52]/10"
          >

            <div className="flex flex-1 items-center">

              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="ml-4 h-5 w-5 shrink-0 text-[#7b8795]"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-4-4" />
              </svg>

              <input
                type="text"
                name="q"
                defaultValue={q}
                placeholder="Tìm kiếm theo tiêu đề, nội dung hoặc lĩnh vực..."
                className="min-w-0 flex-1 bg-transparent px-3 py-3.5 text-sm font-medium text-[#1b2d45] outline-none placeholder:text-[#8995a3]"
              />

            </div>

            {selectedCategory && (
              <input
                type="hidden"
                name="category"
                value={selectedCategory.slug}
              />
            )}

            <button
              type="submit"
              className="shrink-0 border-l border-[#c39a52] bg-[#0f2747] px-4 text-xs font-semibold text-white transition hover:bg-[#193b68] md:px-6 md:text-sm"
            >
              Tìm kiếm
            </button>

          </form>

          {/* LĨNH VỰC */}

          <div className="mt-7">

            <div className="mb-3 flex items-center gap-3">

              <span className="h-px w-8 bg-[#c39a52]" />

              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#806322]">
                Lọc theo lĩnh vực
              </p>

            </div>

            <div className="flex flex-wrap gap-2">

              <a
                href="/bai-viet"
                className={`rounded-md border px-4 py-2.5 text-xs font-semibold transition ${
                  !selectedCategory
                    ? "border-[#0f2747] bg-[#0f2747] !text-white shadow-sm"
                    : "border-[#d5dbe3] bg-white text-[#40536b] hover:border-[#c39a52] hover:text-[#0f2747]"
                }`}
              >
                Tất cả
              </a>

              {categories.map((category) => (
                <a
                  key={category.slug}
                  href={`/bai-viet?category=${category.slug}`}
                  className={`rounded-md border px-4 py-2.5 text-xs font-semibold transition ${
                    selectedCategory?.slug === category.slug
                      ? "border-[#0f2747] bg-[#0f2747] !text-white shadow-sm"
                      : "border-[#d5dbe3] bg-white text-[#40536b] hover:border-[#c39a52] hover:text-[#0f2747]"
                  }`}
                >
                  {category.name}
                </a>
              ))}

            </div>

          </div>

        </div>
      </section>

      {/* =========================================================
          DANH SÁCH BÀI VIẾT
         ========================================================= */}

      <section className="bg-[#f8fafc]">

        <div className="mx-auto max-w-6xl px-6 py-8 md:py-10">

          {/* TIÊU ĐỀ KẾT QUẢ */}

          <div className="mb-7 flex flex-col justify-between gap-3 md:flex-row md:items-end">

            <div>

              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#806322]">
                {selectedCategory
                  ? selectedCategory.name
                  : q
                    ? "Kết quả tìm kiếm"
                    : "Cập nhật mới"}
              </p>

              <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#0f2747] md:text-3xl">
                {q
                  ? `Kết quả cho "${q}"`
                  : selectedCategory
                    ? `Bài viết ${selectedCategory.name}`
                    : "Bài viết mới nhất"}
              </h2>

            </div>

            <p className="text-xs font-medium text-[#6f7c8c]">
              {articles.length} bài viết
            </p>

          </div>

          {/* BÀI VIẾT */}

          {articles.length > 0 ? (

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

              {articles.map((article: any) => (

                <article
                  key={article.id}
                  className="group overflow-hidden rounded-xl border border-[#dce2e8] bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-[#c39a52] hover:shadow-lg"
                >

                  {/* ẢNH */}

                  {article.image_url ? (

                    <a
                      href={`/bai-viet/${slugify(
                        article.category
                      )}/${article.slug}`}
                      className="relative block aspect-[16/9] overflow-hidden bg-[#e9eef4]"
                    >

                      <img
                        src={article.image_url}
                        alt={article.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                      />

                      {article.featured && (
                        <span className="absolute left-3 top-3 rounded border border-[#c39a52] bg-[#d6b36a] px-2.5 py-1 text-[9px] font-bold uppercase tracking-wide text-[#0f2747]">
                          Nổi bật
                        </span>
                      )}

                    </a>

                  ) : (

                    <a
                      href={`/bai-viet/${slugify(
                        article.category
                      )}/${article.slug}`}
                      className="relative flex aspect-[16/9] items-center justify-center border-b border-[#d6b36a] bg-[#e9eef4]"
                    >

                      <div className="text-center">

                        <div className="text-xl font-bold tracking-[0.12em] text-[#0f2747]">
                          LIÊM MINH
                        </div>

                        <div className="mt-1.5 text-[8px] font-bold uppercase tracking-[0.18em] text-[#806322]">
                          Kiến thức pháp luật
                        </div>

                      </div>

                      {article.featured && (
                        <span className="absolute left-3 top-3 rounded border border-[#c39a52] bg-[#d6b36a] px-2.5 py-1 text-[9px] font-bold uppercase tracking-wide text-[#0f2747]">
                          Nổi bật
                        </span>
                      )}

                    </a>

                  )}

                  {/* NỘI DUNG */}

                  <div className="p-5">

                    <div className="flex items-center gap-2 text-[10px]">

                      <span className="font-bold uppercase tracking-wide text-[#806322]">
                        {article.category}
                      </span>

                      <span className="h-1 w-1 rounded-full bg-[#c6cdd6]" />

                      <span className="font-medium text-[#7b8795]">
                        {formatDate(
                          article.published_at ||
                            article.created_at
                        )}
                      </span>

                    </div>

                    <a
                      href={`/bai-viet/${slugify(
                        article.category
                      )}/${article.slug}`}
                    >
                      <h3 className="mt-2.5 line-clamp-3 text-base font-bold leading-6 text-[#0f2747] transition group-hover:text-[#806322]">
                        {article.title}
                      </h3>
                    </a>

                    <p className="mt-2.5 line-clamp-3 text-xs leading-5 text-[#5d6b7c]">
                      {article.excerpt ||
                        "Phân tích quy định pháp luật và những vấn đề cần lưu ý trong thực tế."}
                    </p>

                    <a
                      href={`/bai-viet/${slugify(
                        article.category
                      )}/${article.slug}`}
                      className="mt-4 inline-flex items-center text-xs font-bold text-[#0f2747] transition hover:text-[#806322]"
                    >
                      Đọc bài viết
                      <span className="ml-2">→</span>
                    </a>

                  </div>

                </article>

              ))}

            </div>

          ) : (

            <div className="rounded-xl border border-dashed border-[#cfd6df] bg-white px-6 py-16 text-center">

              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-[#d6b36a] bg-[#eef2f6] text-[#0f2747]">

                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-5 w-5"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-4-4" />
                </svg>

              </div>

              <h3 className="mt-4 text-base font-bold text-[#0f2747]">
                Không tìm thấy bài viết
              </h3>

              <p className="mt-2 text-sm text-[#5d6b7c]">
                Hãy thử từ khóa khác hoặc chọn một lĩnh vực pháp luật.
              </p>

              <a
                href="/bai-viet"
                className="mt-5 inline-flex rounded-lg border border-[#c39a52] bg-[#0f2747] px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-[#193b68]"
              >
                Xem tất cả bài viết
              </a>

            </div>

          )}

        </div>

      </section>

    </main>
  );
}