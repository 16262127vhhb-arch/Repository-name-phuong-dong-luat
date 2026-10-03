import { sql } from "@/lib/db";
import { notFound } from "next/navigation";

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

type CategoryPageProps = {
  params: Promise<{
    category: string;
  }>;
};

function createCategorySlug(category: string) {
  return category
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default async function CategoryPage({
  params,
}: CategoryPageProps) {
  const { category } = await params;

  const currentCategory = categories.find(
    (item) => item.slug === category
  );

  if (!currentCategory) {
    notFound();
  }

  const articles = await sql`
    SELECT
      id,
      title,
      slug,
      category,
      excerpt,
      image_url,
      published_at,
      created_at
    FROM articles
    WHERE category = ${currentCategory.name}
      AND published = true
    ORDER BY COALESCE(published_at, created_at) DESC
  `;

  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* HEADER */}
      <header className="border-b border-gray-200">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <a
            href="/"
            className="text-xl font-bold tracking-tight"
          >
            LIÊM MINH
          </a>

          <a
            href="/bai-viet"
            className="text-sm text-blue-700 hover:text-blue-900"
          >
            ← Tất cả bài viết
          </a>
        </div>
      </header>

      {/* NỘI DUNG */}
      <section className="mx-auto max-w-6xl px-5 py-10 md:px-6 md:py-14">
        <p className="text-sm font-semibold uppercase tracking-[0.15em] text-blue-700">
          BÀI VIẾT PHÁP LUẬT
        </p>

        <h1 className="mt-3 text-[28px] font-bold leading-tight tracking-tight md:text-4xl">
          {currentCategory.name}
        </h1>

        <p className="mt-4 text-gray-600">
          Các bài viết pháp luật thuộc lĩnh vực{" "}
          {currentCategory.name.toLowerCase()}.
        </p>

        {/* DANH SÁCH BÀI VIẾT */}
        {articles.length === 0 ? (
          <div className="mt-12 rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-6 py-12 text-center">
            <p className="font-semibold text-gray-800">
              Chưa có bài viết
            </p>

            <p className="mt-2 text-sm text-gray-500">
              Các bài viết thuộc danh mục này sẽ được cập nhật tại đây.
            </p>
          </div>
        ) : (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => {
              const articleCategorySlug = createCategorySlug(
                article.category
              );

              return (
                <article
                  key={article.id}
                  className="overflow-hidden rounded-2xl border border-gray-200 bg-white transition hover:-translate-y-1 hover:shadow-lg"
                >
                  {/* ẢNH */}
                  {article.image_url ? (
                    <img
                      src={article.image_url}
                      alt={article.title}
                      className="h-48 w-full object-cover sm:h-52"
                    />
                  ) : (
                    <div className="flex h-52 items-center justify-center bg-gray-100 text-sm text-gray-400">
                      Không có hình ảnh
                    </div>
                  )}

                  <div className="p-6">
                    <p className="text-xs font-semibold uppercase tracking-wider text-blue-700">
                      {article.category}
                    </p>

                    <h2 className="mt-3 text-xl font-bold leading-snug">
                      {article.title}
                    </h2>

                    {article.excerpt && (
                      <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-600">
                        {article.excerpt}
                      </p>
                    )}

                    <p className="mt-4 text-xs text-gray-400">
                      {new Date(
                        article.published_at || article.created_at
                      ).toLocaleDateString("vi-VN")}
                    </p>

                    <a
                      href={`/bai-viet/${articleCategorySlug}/${article.slug}`}
                      className="mt-5 inline-block text-sm font-semibold text-blue-700 hover:text-blue-900"
                    >
                      Đọc bài viết →
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* FOOTER */}
      <footer className="border-t border-gray-200">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-8 text-sm text-gray-500">
          <p>© 2026 Liêm Minh</p>

          <a
            href="/dieu-khoan-mien-tru"
            className="hover:text-gray-900"
          >
            Điều khoản &amp; Miễn trừ
          </a>
        </div>
      </footer>
    </main>
  );
}