"use client";

import "react-quill-new/dist/quill.snow.css";

import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useState,
} from "react";

import ReactQuill from "react-quill-new";

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

type MediaFile = {
  key: string;
  url: string;
  size: number;
  lastModified: string | null;
  used: boolean;
  articleId: number | null;
};

const categories = [
  "Hôn nhân & gia đình",
  "Hình sự",
  "Dân sự",
  "Đất đai",
  "Doanh nghiệp",
  "Kinh doanh & thương mại",
  "Lao động",
  "Thi hành án",
  "Các lĩnh vực khác",
];

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

function stripHtml(html: string) {
  if (typeof window === "undefined") {
    return html.replace(/<[^>]*>/g, " ").trim();
  }

  const div = document.createElement("div");
  div.innerHTML = html;

  return (div.textContent || div.innerText || "")
    .replace(/\s+/g, " ")
    .trim();
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const quillModules = {
  toolbar: {
    container: [
      [{ header: [2, 3, false] }],
      ["bold", "italic", "underline"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ align: [] }],
      ["link", "image"],
      ["clean"],
    ],

    handlers: {
      link: function (this: any) {
        const range = this.quill.getSelection();

        if (!range || range.length === 0) {
          window.alert(
            "Anh hãy bôi đen đoạn chữ muốn chèn liên kết trước."
          );
          return;
        }

        const currentFormat = this.quill.getFormat(range);
        const currentUrl = currentFormat.link || "";

        const url = window.prompt(
          "Nhập địa chỉ liên kết:",
          currentUrl || "https://"
        );

        if (!url) {
          return;
        }

        let finalUrl = url.trim();

        if (
          !/^https?:\/\//i.test(finalUrl) &&
          !/^mailto:/i.test(finalUrl)
        ) {
          finalUrl = `https://${finalUrl}`;
        }

        this.quill.format("link", finalUrl, "user");
      },
    },
  },
};

const quillFormats = [
  "header",
  "bold",
  "italic",
  "underline",
  "list",
  "bullet",
  "align",
  "link",
  "image",
];

export default function ThemBaiVietPage() {
  const [articles, setArticles] = useState<Article[]>([]);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Dân sự");

  const [image, setImage] = useState<File | null>(null);
  const [selectedLibraryImage, setSelectedLibraryImage] =
    useState<MediaFile | null>(null);

  const [content, setContent] = useState("");

  const [featured, setFeatured] = useState(false);
  const [published, setPublished] = useState(false);

  const [previewUrl, setPreviewUrl] = useState<string | null>(
    null
  );

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [showMediaLibrary, setShowMediaLibrary] =
    useState(false);

  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [mediaLoading, setMediaLoading] = useState(false);
  const [mediaError, setMediaError] = useState("");

  async function loadArticles() {
    try {
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
    }
  }

  useEffect(() => {
    loadArticles();
  }, []);

  function handleImageChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0] || null;

    if (!file) {
      return;
    }

    setImage(file);
    setSelectedLibraryImage(null);
    setMessage("");

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  }

  async function openMediaLibrary() {
    try {
      setShowMediaLibrary(true);
      setMediaLoading(true);
      setMediaError("");

      const response = await fetch("/api/media", {
        method: "GET",
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Không thể tải thư viện ảnh."
        );
      }

      setMediaFiles(data.files || []);
    } catch (error) {
      console.error(error);

      setMediaError(
        error instanceof Error
          ? error.message
          : "Không thể tải thư viện ảnh."
      );
    } finally {
      setMediaLoading(false);
    }
  }

  function selectLibraryImage(file: MediaFile) {
    setSelectedLibraryImage(file);
    setImage(null);
    setPreviewUrl(file.url);
    setShowMediaLibrary(false);
    setMessage("");
  }

  function removeSelectedImage() {
    setImage(null);
    setSelectedLibraryImage(null);
    setPreviewUrl(null);
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setMessage("");

    if (!title.trim()) {
      setMessage("Vui lòng nhập tiêu đề bài viết.");
      return;
    }

    if (!stripHtml(content)) {
      setMessage("Vui lòng nhập nội dung bài viết.");
      return;
    }

    try {
      setSaving(true);

      let imageUrl: string | null = null;

      /*
       * Nếu chọn ảnh từ thư viện:
       * dùng luôn URL hiện có.
       */
      if (selectedLibraryImage) {
        imageUrl = selectedLibraryImage.url;
      }

      /*
       * Nếu chọn ảnh mới từ máy:
       * upload lên Object Storage trước.
       */
      if (image) {
        const formData = new FormData();

        formData.append("file", image);

        const uploadResponse = await fetch(
          "/api/upload",
          {
            method: "POST",
            body: formData,
          }
        );

        const uploadData =
          await uploadResponse.json();

        if (
          !uploadResponse.ok ||
          !uploadData.success
        ) {
          throw new Error(
            uploadData.message ||
              "Không thể upload ảnh."
          );
        }

        imageUrl = uploadData.imageUrl;
      }

      const slug = createSlug(title);
      const plainContent = stripHtml(content);

      const response = await fetch(
        "/api/articles",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: title.trim(),
            slug,
            category,
            excerpt: plainContent.substring(0, 180),
            content,
            imageUrl,
            published,
            featured,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Không thể lưu bài viết."
        );
      }

      if (published) {
        setMessage(
          "Xuất bản bài viết thành công!"
        );
      } else {
        setMessage(
          "Đã lưu bài viết vào bản nháp."
        );
      }

      setTitle("");
      setCategory("Dân sự");
      setImage(null);
      setSelectedLibraryImage(null);
      setContent("");
      setFeatured(false);
      setPublished(false);
      setPreviewUrl(null);

      await loadArticles();
    } catch (error) {
      console.error(error);

      setMessage(
        error instanceof Error
          ? error.message
          : "Có lỗi xảy ra. Vui lòng thử lại."
      );
    } finally {
      setSaving(false);
    }
  }

  function handleClear() {
    setTitle("");
    setCategory("Dân sự");
    setImage(null);
    setSelectedLibraryImage(null);
    setContent("");
    setFeatured(false);
    setPublished(false);
    setPreviewUrl(null);
    setMessage("");
  }

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      <div className="mx-auto max-w-6xl px-6 py-12">

        {/* HEADER */}

        <div className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-widest text-gray-500">
            LIÊM MINH
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight">
            Thêm bài viết
          </h1>

          <p className="mt-3 text-gray-600">
            Tạo bài viết mới, lưu bản nháp hoặc xuất bản ngay.
          </p>
        </div>

        {/* FORM */}

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm"
        >
          <h2 className="text-2xl font-bold">
            Tạo bài viết mới
          </h2>

          {/* TIÊU ĐỀ */}

          <div className="mt-6">
            <label className="block text-sm font-semibold">
              Tiêu đề bài viết
            </label>

            <input
              type="text"
              value={title}
              onChange={(event) =>
                setTitle(event.target.value)
              }
              placeholder="Nhập tiêu đề bài viết"
              className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-gray-900"
            />
          </div>

          {/* DANH MỤC */}

          <div className="mt-6">
            <label className="block text-sm font-semibold">
              Danh mục
            </label>

            <select
              value={category}
              onChange={(event) =>
                setCategory(event.target.value)
              }
              className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-gray-900"
            >
              {categories.map((item) => (
                <option key={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          {/* TRẠNG THÁI */}

          <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-5">
            <p className="font-semibold">
              Trạng thái bài viết
            </p>

            <div className="mt-4 grid gap-3 md:grid-cols-2">

              <label
                className={`cursor-pointer rounded-xl border p-4 transition ${
                  !published
                    ? "border-yellow-400 bg-yellow-50"
                    : "border-gray-200 bg-white"
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="published"
                    checked={!published}
                    onChange={() =>
                      setPublished(false)
                    }
                    className="mt-1 h-5 w-5"
                  />

                  <div>
                    <span className="block font-semibold">
                      Lưu bản nháp
                    </span>

                    <span className="mt-1 block text-sm text-gray-500">
                      Bài viết được lưu lại nhưng chưa hiển thị công khai.
                    </span>
                  </div>
                </div>
              </label>

              <label
                className={`cursor-pointer rounded-xl border p-4 transition ${
                  published
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200 bg-white"
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="published"
                    checked={published}
                    onChange={() =>
                      setPublished(true)
                    }
                    className="mt-1 h-5 w-5"
                  />

                  <div>
                    <span className="block font-semibold">
                      Xuất bản ngay
                    </span>

                    <span className="mt-1 block text-sm text-gray-500">
                      Bài viết sẽ được hiển thị công khai trên website.
                    </span>
                  </div>
                </div>
              </label>

            </div>
          </div>

          {/* BÀI VIẾT NỔI BẬT */}

          <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-4">
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={featured}
                onChange={(event) =>
                  setFeatured(event.target.checked)
                }
                className="mt-1 h-5 w-5 rounded border-gray-300"
              />

              <span>
                <span className="block font-semibold">
                  Bài viết nổi bật
                </span>

                <span className="mt-1 block text-sm text-gray-500">
                  Đánh dấu bài viết này để hiển thị
                  trong khu vực “Bài viết nổi bật”
                  trên trang chủ.
                </span>
              </span>
            </label>
          </div>

          {/* ẢNH ĐẠI DIỆN */}

          <div className="mt-6">
            <label className="block text-sm font-semibold">
              Ảnh đại diện bài viết
            </label>

            <div className="mt-3 flex flex-wrap gap-3">

              {/* UPLOAD TỪ MÁY */}

              <label className="cursor-pointer rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50">
                Tải ảnh từ máy

                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>

              {/* CHỌN TỪ THƯ VIỆN */}

              <button
                type="button"
                onClick={openMediaLibrary}
                className="rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                📁 Chọn từ thư viện
              </button>

            </div>

            <p className="mt-2 text-xs text-gray-500">
              Có thể tải ảnh mới từ máy hoặc sử dụng ảnh đã có trong Thư viện ảnh.
            </p>

            {/* ẢNH ĐÃ CHỌN */}

            {previewUrl && (
              <div className="mt-5 overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3">
                  <div>
                    <div className="text-sm font-semibold">
                      Ảnh đại diện đã chọn
                    </div>

                    {selectedLibraryImage && (
                      <div className="mt-1 text-xs text-green-600">
                        ✓ Ảnh từ Thư viện ảnh
                      </div>
                    )}

                    {image && (
                      <div className="mt-1 text-xs text-gray-500">
                        Ảnh mới từ máy tính
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={removeSelectedImage}
                    className="text-sm font-semibold text-red-600 hover:text-red-700"
                  >
                    Bỏ ảnh
                  </button>
                </div>

                <img
                  src={previewUrl}
                  alt="Ảnh bài viết"
                  className="max-h-[400px] w-full object-cover"
                />
              </div>
            )}
          </div>

          {/* NỘI DUNG */}

          <div className="mt-6">
            <label className="block text-sm font-semibold">
              Nội dung bài viết
            </label>

            <div className="mt-2 overflow-hidden rounded-xl border border-gray-300 bg-white">
              <ReactQuill
                theme="snow"
                value={content}
                onChange={setContent}
                modules={quillModules}
                formats={quillFormats}
                placeholder="Bắt đầu viết nội dung bài viết..."
              />
            </div>

            <p className="mt-3 text-xs text-gray-500">
              Có thể định dạng văn bản, tạo tiêu đề,
              danh sách, chèn link và chèn ảnh bằng URL.
            </p>
          </div>

          {/* THÔNG BÁO */}

          {message && (
            <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm">
              {message}
            </div>
          )}

          {/* NÚT */}

          <div className="mt-8 flex flex-wrap gap-4">
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-gray-900 px-6 py-3 font-semibold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving
                ? "Đang lưu..."
                : published
                ? "Xuất bản bài viết"
                : "Lưu bản nháp"}
            </button>

            <button
              type="button"
              onClick={handleClear}
              disabled={saving}
              className="rounded-xl border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
            >
              Xóa nội dung
            </button>
          </div>
        </form>

        {/* DANH SÁCH */}

        <section className="mt-12">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-gray-500">
                QUẢN LÝ
              </p>

              <h2 className="mt-2 text-2xl font-bold">
                Danh sách bài viết
              </h2>
            </div>

            <p className="text-sm text-gray-500">
              {articles.length} bài viết
            </p>
          </div>

          {articles.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center text-gray-500">
              Chưa có bài viết nào.
            </div>
          ) : (
            <div className="space-y-4">
              {articles.map((article) => (
                <div
                  key={article.id}
                  className="flex flex-col gap-5 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:flex-row md:items-center"
                >
                  {article.image_url ? (
                    <img
                      src={article.image_url}
                      alt={article.title}
                      className="h-28 w-full rounded-xl object-cover md:w-44"
                    />
                  ) : (
                    <div className="flex h-28 w-full items-center justify-center rounded-xl bg-gray-100 text-xs text-gray-400 md:w-44">
                      Không có ảnh
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-xs font-semibold uppercase tracking-wider text-blue-700">
                        {article.category}
                      </p>

                      {article.published ? (
                        <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700">
                          Đã xuất bản
                        </span>
                      ) : (
                        <span className="rounded-full bg-yellow-100 px-2.5 py-1 text-xs font-semibold text-yellow-800">
                          Bản nháp
                        </span>
                      )}

                      {article.featured && (
                        <span className="rounded-full bg-yellow-100 px-2.5 py-1 text-xs font-semibold text-yellow-800">
                          Nổi bật
                        </span>
                      )}
                    </div>

                    <h3 className="mt-2 text-lg font-bold">
                      {article.title}
                    </h3>

                    <p className="mt-2 text-sm text-gray-500">
                      {new Date(
                        article.published_at ||
                          article.created_at
                      ).toLocaleDateString("vi-VN")}
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      ID: {article.id}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* ========================= */}
      {/* MODAL THƯ VIỆN ẢNH */}
      {/* ========================= */}

      {showMediaLibrary && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setShowMediaLibrary(false);
            }
          }}
        >
          <div className="flex max-h-[90vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">

            {/* HEADER MODAL */}

            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <div>
                <h2 className="text-xl font-bold">
                  Chọn ảnh từ thư viện
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Chọn một ảnh đã được tải lên trước đó.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowMediaLibrary(false)
                }
                className="rounded-lg px-3 py-2 text-xl text-gray-500 hover:bg-gray-100 hover:text-gray-900"
              >
                ×
              </button>
            </div>

            {/* NỘI DUNG MODAL */}

            <div className="min-h-0 flex-1 overflow-y-auto p-6">

              {mediaLoading ? (
                <div className="flex min-h-[300px] items-center justify-center text-sm text-gray-500">
                  Đang tải thư viện ảnh...
                </div>
              ) : mediaError ? (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700">
                  {mediaError}
                </div>
              ) : mediaFiles.length === 0 ? (
                <div className="flex min-h-[300px] flex-col items-center justify-center text-center">
                  <div className="text-lg font-semibold">
                    Thư viện chưa có ảnh
                  </div>

                  <p className="mt-2 text-sm text-gray-500">
                    Hãy tải ảnh lên trong mục Thư viện ảnh trước.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                  {mediaFiles.map((file) => (
                    <button
                      key={file.key}
                      type="button"
                      onClick={() =>
                        selectLibraryImage(file)
                      }
                      className="group overflow-hidden rounded-xl border border-gray-200 bg-white text-left transition hover:border-gray-900 hover:shadow-lg"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                        <img
                          src={file.url}
                          alt="Ảnh thư viện"
                          className="h-full w-full object-cover transition duration-200 group-hover:scale-105"
                        />

                        {file.used && (
                          <span className="absolute left-2 top-2 rounded-md bg-gray-900/90 px-2 py-1 text-[10px] font-semibold text-white">
                            Đang sử dụng
                          </span>
                        )}
                      </div>

                      <div className="px-3 py-2">
                        <div className="text-xs font-semibold text-gray-700">
                          {formatFileSize(file.size)}
                        </div>

                        <div className="mt-1 text-[11px] text-gray-400">
                          {file.lastModified
                            ? new Date(
                                file.lastModified
                              ).toLocaleDateString("vi-VN")
                            : ""}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* FOOTER MODAL */}

            <div className="flex justify-end border-t border-gray-200 bg-gray-50 px-6 py-4">
              <button
                type="button"
                onClick={() =>
                  setShowMediaLibrary(false)
                }
                className="rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-100"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}