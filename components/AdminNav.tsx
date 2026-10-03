"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

const menuItems = [
  {
    label: "Tổng quan",
    href: "/quan-tri",
  },
  {
    label: "Bài viết",
    href: "/quan-tri/bai-viet",
  },
  {
    label: "Thêm bài viết",
    href: "/quan-tri/bai-viet/them",
  },
  {
    label: "Thư viện ảnh",
    href: "/quan-tri/media",
  },
  {
    label: "Liên hệ",
    href: "/quan-tri/lien-he",
  },
];

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  const [unreadCount, setUnreadCount] = useState(0);
  const [loggingOut, setLoggingOut] = useState(false);

  async function loadUnreadCount() {
    try {
      const response = await fetch(
        "/api/contact/unread-count",
        {
          method: "GET",
          cache: "no-store",
        }
      );

      if (!response.ok) {
        return;
      }

      const data = await response.json();

      if (data.success) {
        setUnreadCount(Number(data.count) || 0);
      }
    } catch (error) {
      console.error(
        "Không thể tải số liên hệ chưa xem:",
        error
      );
    }
  }

  useEffect(() => {
    loadUnreadCount();

    const interval = setInterval(() => {
      loadUnreadCount();
    }, 30000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  async function handleLogout() {
    if (loggingOut) {
      return;
    }

    try {
      setLoggingOut(true);

      const { error } = await authClient.signOut();

      if (error) {
        throw new Error(
          error.message || "Đăng xuất không thành công."
        );
      }

      router.push("/quan-tri/dang-nhap");
      router.refresh();
    } catch (error) {
      console.error("LOGOUT ERROR:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Không thể đăng xuất."
      );

      setLoggingOut(false);
    }
  }

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-brand">
        <div className="admin-sidebar-logo">
          LM
        </div>

        <div>
          <div className="admin-sidebar-title">
            LIÊM MINH
          </div>

          <div className="admin-sidebar-subtitle">
            QUẢN TRỊ WEBSITE
          </div>
        </div>
      </div>

      <nav className="admin-sidebar-menu">
        {menuItems.map((item) => {
          const isActive =
            item.href === "/quan-tri"
              ? pathname === "/quan-tri"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`admin-sidebar-link ${
                isActive ? "active" : ""
              }`}
            >
              <span>{item.label}</span>

              {item.label === "Liên hệ" &&
                unreadCount > 0 && (
                  <span
                    style={{
                      marginLeft: "auto",
                      minWidth: "22px",
                      height: "22px",
                      padding: "0 6px",
                      borderRadius: "999px",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "rgba(255, 255, 255, 0.9)",
                      color: "#102a43",
                      fontSize: "12px",
                      fontWeight: 700,
                      lineHeight: 1,
                    }}
                  >
                    {unreadCount}
                  </span>
                )}
            </Link>
          );
        })}
      </nav>

      <div className="admin-sidebar-bottom">
        <Link
          href="/"
          target="_blank"
          className="admin-sidebar-link"
        >
          Xem website
        </Link>

        <button
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
          className="admin-sidebar-link"
          style={{
            width: "100%",
            border: "none",
            cursor: loggingOut
              ? "wait"
              : "pointer",
            textAlign: "left",
            background: "transparent",
            opacity: loggingOut ? 0.6 : 1,
          }}
        >
          {loggingOut
            ? "Đang đăng xuất..."
            : "Đăng xuất"}
        </button>
      </div>
    </aside>
  );
}