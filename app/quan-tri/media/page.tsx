"use client";

import { ChangeEvent, useEffect, useState } from "react";

type MediaFile = {
  key: string;
  url: string;
  size: number;
  lastModified: string | null;
  used: boolean;
  articleId: number | null;
};

function formatFileSize(bytes: number) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(date: string | null) {
  if (!date) {
    return "";
  }

  return new Date(date).toLocaleDateString("vi-VN");
}

export default function MediaPage() {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deletingKey, setDeletingKey] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadMedia() {
    try {
      setLoading(true);
      setError("");

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

      setFiles(data.files || []);
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Không thể tải thư viện ảnh."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMedia();
  }, []);

  async function handleUpload(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    event.target.value = "";

    if (!file) {
      return;
    }

    setMessage("");
    setError("");

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError(
        "Chỉ hỗ trợ ảnh JPG, PNG, WEBP hoặc GIF."
      );

      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Ảnh không được vượt quá 5MB.");

      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();

      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Không thể upload ảnh."
        );
      }

      setMessage("Upload ảnh thành công.");

      await loadMedia();
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Không thể upload ảnh."
      );
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(file: MediaFile) {
    if (file.used) {
      setError(
        `Ảnh đang được sử dụng trong bài viết ID ${file.articleId}.`
      );

      return;
    }

    const confirmed = window.confirm(
      "Anh có chắc muốn xóa ảnh này không?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingKey(file.key);
      setMessage("");
      setError("");

      const response = await fetch("/api/media", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          key: file.key,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Không thể xóa ảnh."
        );
      }

      setMessage("Xóa ảnh thành công.");

      await loadMedia();
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Không thể xóa ảnh."
      );
    } finally {
      setDeletingKey(null);
    }
  }

  return (
    <div>
      {/* HEADER */}
      <div className="admin-page-header">
        <div>
          <h1>Thư viện ảnh</h1>

          <p>
            Quản lý các ảnh đã tải lên website LIÊM MINH.
          </p>
        </div>

        <label className="admin-primary-button admin-upload-button">
          {uploading ? "Đang tải lên..." : "+ Tải ảnh lên"}

          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleUpload}
            disabled={uploading}
            hidden
          />
        </label>
      </div>

      {/* THÔNG BÁO */}
      {message && (
        <div className="admin-media-message success">
          {message}
        </div>
      )}

      {error && (
        <div className="admin-media-message error">
          {error}
        </div>
      )}

      {/* THÔNG TIN */}
      <div className="admin-media-toolbar">
        <div>
          <strong>{files.length}</strong>{" "}
          ảnh đã tải lên
        </div>

        <div className="admin-media-note">
          JPG, PNG, WEBP, GIF · Tối đa 5MB
        </div>
      </div>

      {/* THƯ VIỆN */}
      <section className="admin-media-panel">
        {loading ? (
          <div className="admin-media-empty">
            Đang tải thư viện ảnh...
          </div>
        ) : files.length === 0 ? (
          <div className="admin-media-empty">
            <div className="admin-media-empty-title">
              Chưa có ảnh nào
            </div>

            <p>
              Hãy tải ảnh đầu tiên lên thư viện.
            </p>

            <label className="admin-primary-button admin-upload-button">
              + Tải ảnh lên

              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleUpload}
                disabled={uploading}
                hidden
              />
            </label>
          </div>
        ) : (
          <div className="admin-media-grid">
            {files.map((file) => (
              <div
                key={file.key}
                className="admin-media-card"
              >
                {/* ẢNH */}
                <div className="admin-media-image-wrap">
                  <img
                    src={file.url}
                    alt="Ảnh thư viện LIÊM MINH"
                    className="admin-media-image"
                  />

                  {file.used && (
                    <span className="admin-media-used-badge">
                      Đang sử dụng
                    </span>
                  )}
                </div>

                {/* THÔNG TIN */}
                <div className="admin-media-info">
                  <div className="admin-media-size">
                    {formatFileSize(file.size)}
                  </div>

                  <div className="admin-media-date">
                    {formatDate(file.lastModified)}
                  </div>
                </div>

                {/* NÚT */}
                <div className="admin-media-actions">
                  <a
                    href={file.url}
                    target="_blank"
                    rel="noreferrer"
                    className="admin-media-view-button"
                  >
                    Xem
                  </a>

                  <button
                    type="button"
                    onClick={() => handleDelete(file)}
                    disabled={
                      file.used ||
                      deletingKey === file.key
                    }
                    className="admin-media-delete-button"
                    title={
                      file.used
                        ? "Ảnh đang được sử dụng"
                        : "Xóa ảnh"
                    }
                  >
                    {deletingKey === file.key
                      ? "..."
                      : "Xóa"}
                  </button>
                </div>

                {file.used && (
                  <div className="admin-media-warning">
                    Đang dùng trong bài viết ID{" "}
                    {file.articleId}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}