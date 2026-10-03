"use client";

import "react-quill-new/dist/quill.snow.css";

import {
  ChangeEvent,
  useEffect,
  useState,
} from "react";

import { useParams, useRouter } from "next/navigation";
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

        this.quill.format(
          "link",
          finalUrl,
          "user"
        );
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

export default function EditArticlePage() {
  const params = useParams();
  const router = useRouter();

  const id = Number(params.id);

  const [article, setArticle] =
    useState<Article | null>(null);

  const [title, setTitle] = useState("");
  const [category, setCategory] =
    useState("Dân sự");
  const [content, setContent] = useState("");

  const [featured, setFeatured] =
    useState(false);

  const [published, setPublished] =
    useState(false);

  const [image, setImage] =
    useState<File | null>(null);

  const [selectedLibraryImage, setSelectedLibraryImage] =
    useState<MediaFile | null>(null);

  const [previewUrl, setPreviewUrl] =
    useState<string | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [showMediaLibrary, setShowMediaLibrary] =
    useState(false);

  const [mediaFiles, setMediaFiles] =
    useState<MediaFile[]>([]);

  const [mediaLoading, setMediaLoading] =
    useState(false);

  const [mediaError, setMediaError] =
    useState("");

  // =========================
  // LẤY BÀI VIẾT
  // =========================

  useEffect(() => {
    async function loadArticle() {
      try {
        const response = await fetch(
          "/api/articles",
          {
            method: "GET",
            cache: "no-store",
          }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message ||
              "Không thể lấy danh sách bài viết."
          );
        }

        const found = data.articles.find(
          (item: Article) =>
            item.id === id
        );

        if (!found) {
          throw new Error(
            "Không tìm thấy bài viết."
          );
        }

        setArticle(found);

        setTitle(found.title);
        setCategory(found.category);
        setContent(found.content);

        setFeatured(found.featured);
        setPublished(found.published);

        setPreviewUrl(found.image_url);
      } catch (error) {
        console.error(error);

        setMessage(
          error instanceof Error
            ? error.message
            : "Không thể tải bài viết."
        );
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadArticle();
    }
  }, [id]);

  // =========================
  // CHỌN ẢNH TỪ MÁY
  // =========================

  function handleImageChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file =
      event.target.files?.[0] || null;

    if (!file) {
      return;
    }

    setImage(file);
    setSelectedLibraryImage(null);
    setMessage("");

    const url = URL.createObjectURL(file);

    setPreviewUrl(url);
  }

  // =========================
  // MỞ THƯ VIỆN ẢNH
  // =========================

  async function openMediaLibrary() {
    try {
      setShowMediaLibrary(true);
      setMediaLoading(true);
      setMediaError("");

      const response = await fetch(
        "/api/media",
        {
          method: "GET",
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Không thể tải thư viện ảnh."
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

  // =========================
  // CHỌN ẢNH THƯ VIỆN
  // =========================

  function selectLibraryImage(
    file: MediaFile
  ) {
    setSelectedLibraryImage(file);
    setImage(null);
    setPreviewUrl(file.url);
    setShowMediaLibrary(false);
    setMessage("");
  }

  // =========================
  // BỎ ẢNH ĐANG CHỌN
  // =========================

  function removeSelectedImage() {
    setImage(null);
    setSelectedLibraryImage(null);

    setPreviewUrl(
      article?.image_url || null
    );
  }

  // =========================
  // CẬP NHẬT BÀI VIẾT
  // =========================

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setMessage("");

    if (!title.trim()) {
      setMessage(
        "Vui lòng nhập tiêu đề bài viết."
      );
      return;
    }

    if (!stripHtml(content)) {
      setMessage(
        "Vui lòng nhập nội dung bài viết."
      );
      return;
    }

    try {
      setSaving(true);

      /*
       * Mặc định giữ ảnh hiện tại.
       */
      let imageUrl =
        article?.image_url || null;

      /*
       * Nếu chọn ảnh từ thư viện:
       * dùng trực tiếp URL của ảnh đó.
       */
      if (selectedLibraryImage) {
        imageUrl =
          selectedLibraryImage.url;
      }

      /*
       * Nếu chọn ảnh mới từ máy:
       * upload ảnh mới trước.
       */
      if (image) {
        const formData =
          new FormData();

        formData.append(
          "file",
          image
        );

        const uploadResponse =
          await fetch(
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

        imageUrl =
          uploadData.imageUrl;
      }

      const slug =
        createSlug(title);

      const plainContent =
        stripHtml(content);

      const response =
        await fetch(
          "/api/articles",
          {
            method: "PUT",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              id,

              title: title.trim(),

              slug,

              category,

              excerpt:
                plainContent.substring(
                  0,
                  180
                ),

              content,

              imageUrl,

              published,

              featured,
            }),
          }
        );

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Không thể cập nhật bài viết."
        );
      }

      setArticle(data.article);

      setImage(null);
      setSelectedLibraryImage(null);

      setPreviewUrl(
        data.article.image_url
      );

      setMessage(
        published
          ? "Đã cập nhật và xuất bản bài viết thành công!"
          : "Đã cập nhật bài viết và lưu vào bản nháp."
      );
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

  // =========================
  // ĐANG TẢI
  // =========================

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 px-6 py-16">
        <div className="mx-auto max-w-5xl text-center">
          Đang tải bài viết...
        </div>
      </main>
    );
  }

  // =========================
  // KHÔNG CÓ BÀI
  // =========================

  if (!article) {
    return (
      <main className="min-h-screen bg-gray-50 px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-2xl border border-red-200 bg-white p-8 text-center">
            <p className="text-red-600">
              {message ||
                "Không tìm thấy bài viết."}
            </p>

            <button
              onClick={() =>
                router.push(
                  "/quan-tri/bai-viet"
                )
              }
              className="mt-5 rounded-xl bg-gray-900 px-5 py-3 font-semibold text-white"
            >
              Quay lại danh sách
            </button>
          </div>
        </div>
      </main>
    );
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
            Sửa bài viết
          </h1>

          <p className="mt-3 text-gray-600">
            Chỉnh sửa nội dung và trạng thái bài viết.
          </p>
        </div>

        {/* FORM */}

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm"
        >

          {/* TIÊU ĐỀ */}

          <div>
            <label className="block text-sm font-semibold">
              Tiêu đề bài viết
            </label>

            <input
              type="text"
              value={title}
              onChange={(event) =>
                setTitle(
                  event.target.value
                )
              }
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
                setCategory(
                  event.target.value
                )
              }
              className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-gray-900"
            >
              {categories.map(
                (item) => (
                  <option
                    key={item}
                  >
                    {item}
                  </option>
                )
              )}
            </select>
          </div>

          {/* TRẠNG THÁI */}

          <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-5">
            <p className="font-semibold">
              Trạng thái bài viết
            </p>

            <div className="mt-4 grid gap-3 md:grid-cols-2">

              {/* NHÁP */}

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
                      Bài viết được lưu nhưng không hiển thị công khai.
                    </span>
                  </div>
                </div>
              </label>

              {/* XUẤT BẢN */}

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
                      Xuất bản
                    </span>

                    <span className="mt-1 block text-sm text-gray-500">
                      Bài viết được hiển thị công khai trên website.
                    </span>
                  </div>
                </div>
              </label>

            </div>
          </div>

          {/* NỔI BẬT */}

          <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-4">
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={featured}
                onChange={(event) =>
                  setFeatured(
                    event.target.checked
                  )
                }
                className="mt-1 h-5 w-5 rounded border-gray-300"
              />

              <span>
                <span className="block font-semibold">
                  Bài viết nổi bật
                </span>

                <span className="mt-1 block text-sm text-gray-500">
                  Đánh dấu để bài viết có thể xuất hiện trong khu vực bài viết nổi bật.
                </span>
              </span>
            </label>
          </div>

          {/* ẢNH */}

          <div className="mt-6">

            <label className="block text-sm font-semibold">
              Ảnh đại diện
            </label>

            <div className="mt-3 flex flex-wrap gap-3">

              {/* TẢI ẢNH TỪ MÁY */}

              <label className="cursor-pointer rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50">
                Tải ảnh từ máy

                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={
                    handleImageChange
                  }
                  className="hidden"
                />
              </label>

              {/* CHỌN TỪ THƯ VIỆN */}

              <button
                type="button"
                onClick={
                  openMediaLibrary
                }
                className="rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                📁 Chọn từ thư viện
              </button>

            </div>

            <p className="mt-2 text-xs text-gray-500">
              Nếu không chọn ảnh mới, ảnh hiện tại sẽ được giữ nguyên.
            </p>

            {/* ẢNH ĐANG CHỌN */}

            {previewUrl && (
              <div className="mt-5 overflow-hidden rounded-xl border border-gray-200">

                <div className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3">

                  <div>
                    <div className="text-sm font-semibold">
                      Ảnh đại diện
                    </div>

                    {selectedLibraryImage && (
                      <div className="mt-1 text-xs font-medium text-green-600">
                        ✓ Ảnh được chọn từ Thư viện
                      </div>
                    )}

                    {image && (
                      <div className="mt-1 text-xs text-blue-600">
                        Ảnh mới từ máy tính
                      </div>
                    )}

                    {!selectedLibraryImage &&
                      !image &&
                      article.image_url && (
                        <div className="mt-1 text-xs text-gray-500">
                          Ảnh hiện tại
                        </div>
                      )}
                  </div>

                  {(image ||
                    selectedLibraryImage) && (
                    <button
                      type="button"
                      onClick={
                        removeSelectedImage
                      }
                      className="text-sm font-semibold text-red-600 hover:text-red-700"
                    >
                      Bỏ thay đổi
                    </button>
                  )}

                </div>

                <img
                  src={previewUrl}
                  alt={title}
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
                placeholder="Nhập nội dung bài viết..."
              />
            </div>
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
                ? "Cập nhật & xuất bản"
                : "Lưu bản nháp"}
            </button>

            <button
              type="button"
              onClick={() =>
                router.push(
                  "/quan-tri/bai-viet"
                )
              }
              disabled={saving}
              className="rounded-xl border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
            >
              Quay lại
            </button>

          </div>

        </form>
      </div>

      {/* ========================= */}
      {/* MODAL THƯ VIỆN ẢNH */}
      {/* ========================= */}

      {showMediaLibrary && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 p-4"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              setShowMediaLibrary(false);
            }
          }}
        >
          <div className="flex max-h-[90vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">

            {/* HEADER */}

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

            {/* NỘI DUNG */}

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

                  {mediaFiles.map(
                    (file) => (
                      <button
                        key={file.key}
                        type="button"
                        onClick={() =>
                          selectLibraryImage(
                            file
                          )
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
                            {formatFileSize(
                              file.size
                            )}
                          </div>

                          <div className="mt-1 text-[11px] text-gray-400">
                            {file.lastModified
                              ? new Date(
                                  file.lastModified
                                ).toLocaleDateString(
                                  "vi-VN"
                                )
                              : ""}
                          </div>

                        </div>

                      </button>
                    )
                  )}

                </div>
              )}

            </div>

            {/* FOOTER */}

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