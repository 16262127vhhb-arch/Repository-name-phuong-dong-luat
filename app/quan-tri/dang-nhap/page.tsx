"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function DangNhapPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    if (!email || !password) {
      setError("Vui lòng nhập đầy đủ email và mật khẩu.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/sign-in/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email,
          password,
          callbackURL: "/quan-tri",
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        setError(
          data?.message ||
            "Email hoặc mật khẩu không chính xác."
        );
        return;
      }

      router.push("/quan-tri");
      router.refresh();
    } catch (error) {
      console.error(error);

      setError(
        "Không thể kết nối đến hệ thống. Vui lòng thử lại."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f5f7fa] px-6 py-12">
      <div className="w-full max-w-md">
        {/* LOGO / THƯƠNG HIỆU */}
        <div className="mb-8 text-center">
          <a href="/" className="inline-block">
            <img
              src="/logo.png"
              alt="LIÊM MINH"
              className="mx-auto h-16 w-auto object-contain"
            />
          </a>

          <div className="mt-4 flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-[#d6b36a]" />

            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#b88d3b]">
              QUẢN TRỊ WEBSITE
            </span>

            <span className="h-px w-8 bg-[#d6b36a]" />
          </div>
        </div>

        {/* FORM */}
        <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm md:p-8">
          <h1 className="text-2xl font-bold text-[#0f2747]">
            Đăng nhập
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Đăng nhập để quản lý nội dung website LIÊM MINH.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-7 space-y-5"
          >
            {/* EMAIL */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-[#0f2747]"
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                placeholder="Nhập email quản trị"
                autoComplete="email"
                disabled={loading}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#b88d3b] focus:ring-2 focus:ring-[#d6b36a]/20 disabled:bg-slate-100"
              />
            </div>

            {/* MẬT KHẨU */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-semibold text-[#0f2747]"
              >
                Mật khẩu
              </label>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                placeholder="Nhập mật khẩu"
                autoComplete="current-password"
                disabled={loading}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#b88d3b] focus:ring-2 focus:ring-[#d6b36a]/20 disabled:bg-slate-100"
              />
            </div>

            {/* LỖI */}
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700">
                {error}
              </div>
            )}

            {/* ĐĂNG NHẬP */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-[#0f2747] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#17365f] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>
          </form>

          {/* QUAY LẠI WEBSITE */}
          <div className="mt-6 border-t border-slate-200 pt-5 text-center">
            <a
              href="/"
              className="text-sm font-medium text-slate-500 transition hover:text-[#b88d3b]"
            >
              ← Quay lại website
            </a>
          </div>
        </div>

        {/* FOOTER NHỎ */}
        <p className="mt-6 text-center text-xs text-slate-400">
          LIÊM CHÍNH · MINH BẠCH · CÔNG BẰNG
        </p>
      </div>
    </main>
  );
}