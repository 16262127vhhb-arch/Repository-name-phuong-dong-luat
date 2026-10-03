"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

type Article = {
  id: number;
  title: string;
  slug: string;
  category: string;
  excerpt: string | null;
  content: string;
  image_url: string | null;
  published: boolean;
  featured: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

function createSlug(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function formatDate(date: string | null) {
  if (!date) return "";

  return new Date(date).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function QuanTriBaiVietContent() {
  const searchParams = useSearchParams();

  const filter = searchParams.get("filter") || "all";

  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [message, setMessage] = useState("");

  async function loadArticles() {
    try {
      setLoading(true);

      const response = await fetch("/api/articles", {
        method: "GET",
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Không thể lấy danh sách bài viết."
        );
      }

      setArticles(data.articles);
    } catch (error) {
      console.error(error);

      setMessage(
        error instanceof Error
          ? error.message
          : "Không thể tải danh sách bài viết."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadArticles();
  }, []);

  const filteredArticles = useMemo(() => {
    switch (filter) {
      case "published":
        return articles.filter((article) => article.published);

      case "drafts":
        return articles.filter((article) => !article.published);

      case "featured":
        return articles.filter((article) => article.featured);

      default:
        return articles;
    }
  }, [articles, filter]);

  const filterTitle =
    filter === "published"
      ? "Bài viết đã xuất bản"
      : filter === "drafts"
        ? "Bản nháp"
        : filter === "featured"
          ? "Bài viết nổi bật"
          : "Tất cả bài viết";

  async function handleDelete(article: Article) {
    const confirmed = window.confirm(
      `Anh có chắc muốn xóa bài:\n\n"${article.title}"\n\nBài viết và ảnh của bài sẽ bị xóa.`
    );

    if (!confirmed) return;

    try {
      setDeletingId(article.id);
      setMessage("");

      const response = await fetch("/api/articles", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: article.id,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Không thể xóa bài viết."
        );
      }

      setArticles((current) =>
        current.filter((item) => item.id !== article.id)
      );

      setMessage("Xóa bài viết thành công!");
    } catch (error) {
      console.error(error);

      setMessage(
        error instanceof Error
          ? error.message
          : "Không thể xóa bài viết."
      );
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <main className="min-h-screen bg-[#f5f7fa] text-slate-900">
      <div className="mx-auto max-w-7xl px-6 py-8 md:px-8 md:py-10">

        {/* HEADER */}
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-px w-9 bg-[#d6b36a]" />

              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#b88d3b]">
                QUẢN TRỊ
              </span>
            </div>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#0f2747]">
              {filterTitle}
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Quản lý nội dung pháp luật trên website LIÊM MINH.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href="/quan-tri"
              className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-[#0f2747] transition hover:border-[#b88d3b]"
            >
              ← Dashboard
            </a>

            <a
              href="/quan-tri/bai-viet/them"
              className="rounded-lg bg-[#0f2747] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#17365f]"
            >
              + Viết bài mới
            </a>
          </div>
        </div>

        {/* BỘ LỌC */}
        <div className="mt-7 flex flex-wrap gap-2">
          <a
            href="/quan-tri/bai-viet?filter=all"
            className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
              filter === "all"
                ? "bg-[#0f2747] text-white"
                : "border border-slate-300 bg-white text-slate-600 hover:border-[#b88d3b]"
            }`}
          >
            Tất cả ({articles.length})
          </a>

          <a
            href="/quan-tri/bai-viet?filter=published"
            className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
              filter === "published"
                ? "bg-[#0f2747] text-white"
                : "border border-slate-300 bg-white text-slate-600 hover:border-[#b88d3b]"
            }`}
          >
            Đã xuất bản (
            {articles.filter((item) => item.published).length})
          </a>

          <a
            href="/quan-tri/bai-viet?filter=drafts"
            className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
              filter === "drafts"
                ? "bg-[#0f2747] text-white"
                : "border border-slate-300 bg-white text-slate-600 hover:border-[#b88d3b]"
            }`}
          >
            Nháp (
            {articles.filter((item) => !item.published).length})
          </a>

          <a
            href="/quan-tri/bai-viet?filter=featured"
            className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
              filter === "featured"
                ? "bg-[#0f2747] text-white"
                : "border border-slate-300 bg-white text-slate-600 hover:border-[#b88d3b]"
            }`}
          >
            Nổi bật (
            {articles.filter((item) => item.featured).length})
          </a>
        </div>

        {/* THÔNG BÁO */}
        {message && (
          <div className="mt-5 rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm text-slate-700 shadow-sm">
            {message}
          </div>
        )}

        {/* SỐ LƯỢNG */}
        <div className="mt-7 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#0f2747]">
              {filterTitle}
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Hiển thị {filteredArticles.length} bài viết.
            </p>
          </div>
        </div>

        {/* DANH SÁCH */}
        <section className="mt-5">
          {loading ? (
            <div className="rounded-xl border border-slate-200 bg-white px-6 py-12 text-center text-sm text-slate-500">
              Đang tải danh sách bài viết...
            </div>
          ) : filteredArticles.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
              <p className="text-sm text-slate-500">
                Không có bài viết nào trong nhóm này.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredArticles.map((article) => (
                <article
                  key={article.id}
                  className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center">

                    {article.image_url ? (
                      <img
                        src={article.image_url}
                        alt={article.title}
                        className="h-32 w-full shrink-0 rounded-lg object-cover lg:w-52"
                      />
                    ) : (
                      <div className="flex h-32 w-full shrink-0 items-center justify-center rounded-lg bg-[#e9eef4] text-sm font-bold tracking-widest text-[#0f2747] lg:w-52">
                        LM
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#b88d3b]">
                          {article.category}
                        </span>

                        {article.featured && (
                          <span className="rounded-full bg-[#f8f1df] px-2.5 py-1 text-[10px] font-bold text-[#806322]">
                            Nổi bật
                          </span>
                        )}

                        {article.published ? (
                          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
                            Đã đăng
                          </span>
                        ) : (
                          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-500">
                            Nháp
                          </span>
                        )}
                      </div>

                      <h3 className="mt-2 text-lg font-bold leading-7 text-[#0f2747]">
                        {article.title}
                      </h3>

                      <p className="mt-2 text-xs text-slate-400">
                        Cập nhật:{" "}
                        {formatDate(
                          article.published_at ||
                            article.created_at
                        )}
                      </p>
                    </div>

                    <div className="flex shrink-0 flex-wrap gap-2">
                      <a
                        href={`/bai-viet/${createSlug(
                          article.category
                        )}/${article.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                      >
                        Xem
                      </a>

                      <a
                        href={`/quan-tri/bai-viet/${article.id}`}
                        className="rounded-lg bg-[#0f2747] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#17365f]"
                      >
                        Sửa
                      </a>

                      <button
                        type="button"
                        onClick={() => handleDelete(article)}
                        disabled={deletingId === article.id}
                        className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {deletingId === article.id
                          ? "Đang xóa..."
                          : "Xóa"}
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <div className="mt-10 border-t border-slate-200 pt-5 text-center text-xs text-slate-400">
          LIÊM CHÍNH · MINH BẠCH · CÔNG BẰNG
        </div>
      </div>
    </main>
  );
}

export default function QuanTriBaiVietPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#f5f7fa] px-6 py-10 text-center text-sm text-slate-500">
          Đang tải...
        </main>
      }
    >
      <QuanTriBaiVietContent />
    </Suspense>
  );
}