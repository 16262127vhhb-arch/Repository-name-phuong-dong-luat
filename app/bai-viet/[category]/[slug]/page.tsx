import { sql } from "@/lib/db";
import { notFound } from "next/navigation";
import DOMPurify from "isomorphic-dompurify";

type ArticlePageProps = {
  params: Promise<{
    category: string;
    slug: string;
  }>;
};

function formatDate(date: string | Date | null) {
  if (!date) return "";

  return new Date(date).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

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

export default async function ArticlePage({
  params,
}: ArticlePageProps) {
  const { slug } = await params;

  const result = await sql`
    SELECT
      id,
      title,
      category,
      slug,
      excerpt,
      content,
      image_url,
      published_at,
      created_at
    FROM articles
    WHERE slug = ${slug}
      AND published = true
    LIMIT 1
  `;

  if (result.length === 0) {
    notFound();
  }

  const article = result[0];

  const imageUrl =
    typeof article.image_url === "string"
      ? article.image_url.trim()
      : "";

  /*
   * Làm sạch nội dung HTML được tạo từ Quill
   * trước khi hiển thị ra trình duyệt.
   */
  const cleanContent = DOMPurify.sanitize(
    typeof article.content === "string"
      ? article.content
      : ""
  );

  /*
   * Bài viết liên quan cùng lĩnh vực.
   */
  const relatedArticles = await sql`
    SELECT
      id,
      title,
      slug,
      category,
      image_url,
      published_at,
      created_at
    FROM articles
    WHERE published = true
      AND category = ${article.category}
      AND id <> ${article.id}
    ORDER BY COALESCE(published_at, created_at) DESC
    LIMIT 3
  `;

  return (
    <main className="min-h-screen bg-[#f6f8fa] text-[#172b45]">

      {/* =====================================================
          PHẦN ĐẦU BÀI VIẾT
      ===================================================== */}

      <article>

        <section className="border-b border-[#dfe5eb] bg-[#edf2f6]">
          <div className="mx-auto max-w-6xl px-5 py-8 md:px-8 md:py-12">

            {/* Breadcrumb */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <a
                href="/"
                className="font-medium transition hover:text-[#0f2747]"
              >
                Trang chủ
              </a>

              <span className="text-slate-300">/</span>

              <a
                href="/bai-viet"
                className="font-medium transition hover:text-[#0f2747]"
              >
                Bài viết pháp luật
              </a>

              <span className="text-slate-300">/</span>

              <span className="text-slate-500">
                {article.category}
              </span>
            </div>

            {/* Nhãn chuyên mục */}
            <div className="mt-8 flex items-center gap-3">
              <span className="h-px w-10 bg-[#c39a52]" />

              <a
                href={`/bai-viet?category=${slugify(
                  article.category
                )}`}
                className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#806322] transition hover:text-[#5f4818]"
              >
                {article.category}
              </a>
            </div>

            {/* Tiêu đề */}
            <h1 className="mt-4 max-w-5xl text-[28px] font-bold leading-[1.2] tracking-[-0.02em] text-[#0f2747] md:text-5xl lg:text-[52px]">
              {article.title}
            </h1>

            {/* Thông tin bài viết */}
            <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500">
              <span>
                Cập nhật ngày{" "}
                {formatDate(
                  article.published_at ||
                    article.created_at
                )}
              </span>

              <span className="h-1 w-1 rounded-full bg-[#c39a52]" />

              <span>{article.category}</span>
            </div>

          </div>
        </section>


        {/* =====================================================
            NỘI DUNG BÀI VIẾT
        ===================================================== */}

        <section className="bg-[#f6f8fa]">
          <div className="mx-auto max-w-6xl px-5 py-8 md:px-8 md:py-12">

            {/* Ảnh đại diện */}
            {imageUrl && (
              <figure className="mx-auto max-w-4xl overflow-hidden border border-[#dce2e8] bg-white shadow-sm">
                <img
                  src={imageUrl}
                  alt={article.title}
                  width={1200}
                  height={675}
                  className="block max-h-[400px] w-full object-cover"
                />
              </figure>
            )}


            {/* Khu vực đọc */}
            <div className="mx-auto mt-7 max-w-4xl">
  {article.excerpt && (
    <div className="border-l-[3px] border-[#c39a52] bg-white px-5 py-4 shadow-sm md:px-6 md:py-5">
      <p className="text-[15px] font-medium leading-7 text-[#46566a] md:text-[16px]">
        {article.excerpt}
      </p>
    </div>
  )}

              {/* SAPO */}
              {article.excerpt && (
                <div className="border-l-[3px] border-[#c39a52] bg-white px-5 py-4 shadow-sm md:px-6 md:py-5">
                  <p className="text-[16px] font-medium leading-7 text-[#46566a]">
                    {article.excerpt}
                  </p>
                </div>
              )}


              {/* ===================================================
                  NỘI DUNG QUILL
              =================================================== */}

              <div
                className="
                  article-content
                  mt-6
                  text-[20px]
                  leading-[1.95]
                  text-[#26384d]

                  [&_p]:mb-5
                  [&_p]:leading-[1.95]

                  [&_h1]:mb-5
                  [&_h1]:mt-10
                  [&_h1]:border-b
                  [&_h1]:border-[#e2e6eb]
                  [&_h1]:pb-3
                  [&_h1]:text-3xl
                  [&_h1]:font-bold
                  [&_h1]:leading-tight
                  [&_h1]:text-[#0f2747]

                  [&_h2]:mb-4
                  [&_h2]:mt-11
                  [&_h2]:border-l-[3px]
                  [&_h2]:border-[#c39a52]
                  [&_h2]:pl-4
                  [&_h2]:text-2xl
                  [&_h2]:font-bold
                  [&_h2]:leading-tight
                  [&_h2]:text-[#0f2747]

                  [&_h3]:mb-3
                  [&_h3]:mt-8
                  [&_h3]:text-xl
                  [&_h3]:font-bold
                  [&_h3]:leading-tight
                  [&_h3]:text-[#173454]

                  [&_strong]:font-bold
                  [&_strong]:text-[#0f2747]

                  [&_em]:italic

                  [&_ul]:mb-6
                  [&_ul]:list-disc
                  [&_ul]:pl-7

                  [&_ol]:mb-6
                  [&_ol]:list-decimal
                  [&_ol]:pl-7

                  [&_li]:mb-2
                  [&_li]:leading-[1.85]

                  [&_a]:font-medium
                  [&_a]:text-[#173454]
                  [&_a]:underline
                  [&_a]:decoration-[#c39a52]
                  [&_a]:underline-offset-4
                  [&_a]:transition
                  [&_a:hover]:text-[#806322]

                  [&_blockquote]:my-8
                  [&_blockquote]:border-l-[3px]
                  [&_blockquote]:border-[#c39a52]
                  [&_blockquote]:bg-white
                  [&_blockquote]:px-6
                  [&_blockquote]:py-5
                  [&_blockquote]:italic
                  [&_blockquote]:text-[#5c6978]
                  [&_blockquote]:shadow-sm

                  [&_img]:my-8
                  [&_img]:max-h-[650px]
                  [&_img]:w-full
                  [&_img]:border
                  [&_img]:border-[#dfe5eb]
                  [&_img]:object-contain
                  [&_img]:bg-white

                  [&_table]:my-8
                  [&_table]:w-full
                  [&_table]:border-collapse
                  [&_table]:overflow-hidden
                  [&_table]:text-[15px]

                  [&_th]:border
                  [&_th]:border-[#d8dee5]
                  [&_th]:bg-[#edf2f6]
                  [&_th]:px-4
                  [&_th]:py-3
                  [&_th]:text-left
                  [&_th]:font-bold
                  [&_th]:text-[#0f2747]

                  [&_td]:border
                  [&_td]:border-[#d8dee5]
                  [&_td]:px-4
                  [&_td]:py-3
                  [&_td]:align-top
                "
                dangerouslySetInnerHTML={{
                  __html: cleanContent,
                }}
              />


              {/* ===================================================
                  THÔNG TIN THAM KHẢO
              =================================================== */}

              <div className="mt-12 border border-[#dce2e8] bg-white px-6 py-6 shadow-sm md:px-7">

                <div className="flex items-start gap-4">

                  <div className="flex h-9 w-9 shrink-0 items-center justify-center border border-[#c39a52] text-[#0f2747]">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      className="h-5 w-5"
                    >
                      <circle cx="12" cy="12" r="9" />
                      <path d="M12 10v6" />
                      <path d="M12 7h.01" />
                    </svg>
                  </div>

                  <div>
                    <h2 className="text-sm font-bold text-[#0f2747]">
                      Miễn trừ trách nhiệm
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      Các thông tin được sử dụng trong bài viết được tác giả tổng hợp và trích dẫn từ nhiều nguồn khác nhau, nhằm mục đích cung cấp thông tin pháp luật phổ thông. Nội dung bài viết không mang tính chất tư vấn pháp lý đối với bất kỳ trường hợp cụ thể nào. Tác giả không chịu trách nhiệm đối với việc sử dụng thông tin trong bài viết để áp dụng cho từng trường hợp cụ thể, do các quy định pháp luật, chính sách và đường lối pháp luật có thể được sửa đổi, bổ sung hoặc cập nhật theo từng thời kỳ.
                      tham khảo, cung cấp thông tin pháp luật phổ
                      thông và không thay thế cho ý kiến tư vấn pháp
                      lý đối với từng vụ việc cụ thể.
                    </p>
                  </div>

                </div>

              </div>

            </div>

          </div>
        </section>

      </article>


      {/* =====================================================
          BÀI VIẾT LIÊN QUAN
      ===================================================== */}

      {relatedArticles.length > 0 && (
        <section className="border-t border-[#dce2e8] bg-[#edf2f6]">

          <div className="mx-auto max-w-6xl px-5 py-10 md:px-8 md:py-12">

            <div className="mb-7">

              <div className="flex items-center gap-3">
                <span className="h-px w-10 bg-[#c39a52]" />

                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#806322]">
                  Có thể bạn quan tâm
                </p>
              </div>

              <h2 className="mt-2 text-2xl font-bold text-[#0f2747] md:text-3xl">
                Bài viết liên quan
              </h2>

            </div>


            <div className="grid gap-6 md:grid-cols-3">

              {relatedArticles.map((related: any) => {
                const relatedHref = `/bai-viet/${slugify(
                  related.category
                )}/${related.slug}`;

                return (
                  <article
                    key={related.id}
                    className="group overflow-hidden border border-[#d9e0e7] bg-white shadow-sm transition duration-300 hover:border-[#c39a52] hover:shadow-md"
                  >

                    {/* Ảnh */}
                    {related.image_url ? (
                      <a
                        href={relatedHref}
                        className="block aspect-[16/9] overflow-hidden bg-[#e9eef4]"
                      >
                        <img
                          src={related.image_url}
                          alt={related.title}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                        />
                      </a>
                    ) : (
                      <a
                        href={relatedHref}
                        className="flex aspect-[16/9] items-center justify-center bg-[#e9eef4]"
                      >
                        <span className="text-sm font-bold tracking-[0.16em] text-[#0f2747]">
                          LIÊM MINH
                        </span>
                      </a>
                    )}


                    {/* Nội dung card */}
                    <div className="p-5">

                      <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#806322]">
                        {related.category}
                      </div>

                      <a href={relatedHref}>
                        <h3 className="mt-2 line-clamp-3 text-[16px] font-bold leading-6 text-[#0f2747] transition group-hover:text-[#806322]">
                          {related.title}
                        </h3>
                      </a>

                      <div className="mt-4 border-t border-[#edf0f3] pt-3 text-[11px] text-slate-400">
                        {formatDate(
                          related.published_at ||
                            related.created_at
                        )}
                      </div>

                    </div>

                  </article>
                );
              })}

            </div>

          </div>

        </section>
      )}

    </main>
  );
}