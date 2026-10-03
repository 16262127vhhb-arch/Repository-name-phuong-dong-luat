import Link from "next/link";
import { sql } from "@/lib/db";

export default async function AdminDashboard() {
  const statsResult = await sql`
    SELECT
      COUNT(*)::int AS total,
      COUNT(*) FILTER (WHERE published = true)::int AS published,
      COUNT(*) FILTER (WHERE published = false)::int AS drafts,
      COUNT(*) FILTER (WHERE featured = true)::int AS featured
    FROM articles
  `;

  const categoryResult = await sql`
    SELECT
      category,
      COUNT(*)::int AS count
    FROM articles
    GROUP BY category
    ORDER BY count DESC, category ASC
  `;

  const latestResult = await sql`
    SELECT
      id,
      title,
      category,
      published,
      featured,
      created_at
    FROM articles
    ORDER BY created_at DESC
    LIMIT 5
  `;

  const stats = statsResult[0];

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1>Quản trị website</h1>
          <p>
            Quản lý nội dung và hoạt động của website LIÊM MINH.
          </p>
        </div>

        <Link
          href="/quan-tri/bai-viet/them"
          className="admin-primary-button"
        >
          + Thêm bài viết
        </Link>
      </div>

      {/* THỐNG KÊ */}
      <section className="admin-stats-grid">
        <Link
          href="/quan-tri/bai-viet?filter=all"
          className="admin-stat-card"
        >
          <div className="admin-stat-label">Tổng bài viết</div>

          <div className="admin-stat-number">
            {stats.total}
          </div>

          <div className="admin-stat-description">
            Tất cả bài viết
          </div>
        </Link>

        <Link
          href="/quan-tri/bai-viet?filter=published"
          className="admin-stat-card"
        >
          <div className="admin-stat-label">Đã xuất bản</div>

          <div className="admin-stat-number">
            {stats.published}
          </div>

          <div className="admin-stat-description">
            Đang hiển thị trên website
          </div>
        </Link>

        <Link
          href="/quan-tri/bai-viet?filter=drafts"
          className="admin-stat-card"
        >
          <div className="admin-stat-label">Bản nháp</div>

          <div className="admin-stat-number">
            {stats.drafts}
          </div>

          <div className="admin-stat-description">
            Chưa xuất bản
          </div>
        </Link>

        <Link
          href="/quan-tri/bai-viet?filter=featured"
          className="admin-stat-card"
        >
          <div className="admin-stat-label">
            Bài viết nổi bật
          </div>

          <div className="admin-stat-number">
            {stats.featured}
          </div>

          <div className="admin-stat-description">
            Được đánh dấu nổi bật
          </div>
        </Link>
      </section>

      {/* NỘI DUNG */}
      <div className="admin-dashboard-grid">
        {/* BÀI VIẾT MỚI NHẤT */}
        <section className="admin-panel">
          <div className="admin-panel-header">
            <div>
              <h2>Bài viết mới nhất</h2>

              <p>
                Các bài viết được tạo gần đây.
              </p>
            </div>

            <Link
              href="/quan-tri/bai-viet"
              className="admin-panel-link"
            >
              Xem tất cả
            </Link>
          </div>

          <div className="admin-article-list">
            {latestResult.length === 0 ? (
              <div className="admin-empty">
                Chưa có bài viết nào.
              </div>
            ) : (
              latestResult.map((article) => (
                <div
                  key={article.id}
                  className="admin-article-row"
                >
                  <div className="admin-article-info">
                    <Link
                      href={`/quan-tri/bai-viet/${article.id}`}
                      className="admin-article-title"
                    >
                      {article.title}
                    </Link>

                    <div className="admin-article-meta">
                      <span>
                        {article.category}
                      </span>

                      <span>•</span>

                      <span>
                        {new Date(
                          article.created_at
                        ).toLocaleDateString("vi-VN")}
                      </span>
                    </div>
                  </div>

                  <div className="admin-article-status">
                    {article.published ? (
                      <span className="admin-status published">
                        Đã xuất bản
                      </span>
                    ) : (
                      <span className="admin-status draft">
                        Bản nháp
                      </span>
                    )}

                    {article.featured && (
                      <span className="admin-status featured">
                        Nổi bật
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* LĨNH VỰC PHÁP LUẬT */}
        <section className="admin-panel">
          <div className="admin-panel-header">
            <div>
              <h2>Lĩnh vực pháp luật</h2>

              <p>
                Số lượng bài viết theo từng lĩnh vực.
              </p>
            </div>
          </div>

          <div className="admin-category-list">
            {categoryResult.length === 0 ? (
              <div className="admin-empty">
                Chưa có dữ liệu.
              </div>
            ) : (
              categoryResult.map((item) => (
                <div
                  key={item.category}
                  className="admin-category-row"
                >
                  <span>{item.category}</span>

                  <strong>{item.count}</strong>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      {/* TRUY CẬP NHANH */}
      <section className="admin-panel admin-quick-panel">
        <div className="admin-panel-header">
          <div>
            <h2>Truy cập nhanh</h2>

            <p>
              Các chức năng quản trị thường sử dụng.
            </p>
          </div>
        </div>

        <div className="admin-quick-grid">
          <Link
            href="/quan-tri/bai-viet"
            className="admin-quick-card"
          >
            <strong>
              Quản lý bài viết
            </strong>

            <span>
              Xem, sửa, xóa và quản lý trạng thái bài viết.
            </span>
          </Link>

          <Link
            href="/quan-tri/bai-viet/them"
            className="admin-quick-card"
          >
            <strong>
              Thêm bài viết
            </strong>

            <span>
              Tạo bài viết mới và xuất bản lên website.
            </span>
          </Link>

          <Link
            href="/"
            target="_blank"
            className="admin-quick-card"
          >
            <strong>
              Xem website
            </strong>

            <span>
              Mở website LIÊM MINH ở một tab mới.
            </span>
          </Link>
        </div>
      </section>
    </>
  );
}