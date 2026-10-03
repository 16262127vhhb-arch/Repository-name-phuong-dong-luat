"use client";

import { FormEvent, useState } from "react";

export default function LienHePage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState("");
  const [statusType, setStatusType] = useState<
    "success" | "error" | ""
  >("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setStatus("");
    setStatusType("");

    if (!name.trim()) {
      setStatus("Vui lòng nhập họ và tên.");
      setStatusType("error");
      return;
    }

    if (!message.trim()) {
      setStatus(
        "Vui lòng nhập nội dung cần hỗ trợ."
      );
      setStatusType("error");
      return;
    }

    try {
      setSending(true);

      const response = await fetch(
        "/api/contact",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name.trim(),
            phone: phone.trim(),
            email: email.trim(),
            message: message.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Không thể gửi yêu cầu."
        );
      }

      setStatus(
        "Yêu cầu của bạn đã được gửi thành công. LIÊM MINH sẽ tiếp nhận và trao đổi lại khi phù hợp."
      );

      setStatusType("success");

      setName("");
      setPhone("");
      setEmail("");
      setMessage("");
    } catch (error) {
      console.error(error);

      setStatus(
        error instanceof Error
          ? error.message
          : "Không thể gửi yêu cầu. Vui lòng thử lại."
      );

      setStatusType("error");
    } finally {
      setSending(false);
    }
  }

  return (
    <main className="min-h-screen bg-white text-slate-900">

      {/* HERO */}

      <section className="border-b border-slate-200 bg-[#f5f7fa]">
        <div className="mx-auto max-w-6xl px-6 py-14 md:py-18">
          <div className="max-w-3xl">

            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-[#d6b36a]" />

              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#b88d3b]">
                Liên hệ
              </span>
            </div>

            <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight text-[#0f2747] md:text-5xl">
              Trao đổi về vấn đề pháp lý của bạn
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 md:text-lg">
              Nếu bạn đang gặp một vấn đề pháp lý hoặc có nhu cầu tìm hiểu
              và sử dụng dịch vụ pháp lý, hãy liên hệ với LIÊM MINH để
              trao đổi về vụ việc và nhu cầu cụ thể.
            </p>

          </div>
        </div>
      </section>

      {/* THÔNG TIN LIÊN HỆ */}

      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-6 py-12 md:py-16">

          <div className="grid gap-8 md:grid-cols-[0.85fr_1.15fr]">

            {/* THÔNG TIN */}

            <div className="rounded-2xl border border-slate-200 bg-[#f8fafc] p-7">

              <div className="flex items-center gap-3">
                <span className="h-px w-9 bg-[#d6b36a]" />

                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#b88d3b]">
                  LIÊM MINH
                </span>
              </div>

              <h2 className="mt-3 text-2xl font-bold text-[#0f2747]">
                Thông tin liên hệ
              </h2>

              <p className="mt-4 text-sm leading-6 text-slate-600">
                Bạn có thể liên hệ với LIÊM MINH để trao đổi về vấn đề pháp
                lý đang quan tâm hoặc nhu cầu sử dụng dịch vụ pháp lý.
              </p>

              <div className="mt-7 space-y-5">

                {/* ĐIỆN THOẠI */}

                <div className="flex gap-4">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e9eef4] text-[#0f2747]">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      className="h-5 w-5"
                    >
                      <path
                        d="M5 4h3l2 5-2 1.5a15 15 0 0 0 5.5 5.5L15 14l5 2v3c0 1.1-.9 2-2 2C10.3 21 3 13.7 3 5c0-1.1.9-2 2-2Z"
                      />
                    </svg>
                  </div>

                  <div>
                    <div className="text-xs font-bold uppercase tracking-wide text-slate-400">
                      Điện thoại
                    </div>

                    <a
                      href="tel:0379672225"
                      className="mt-1 block text-sm font-semibold text-[#0f2747] transition hover:text-[#b88d3b]"
                    >
                      0379 672 225
                    </a>
                  </div>

                </div>

                {/* EMAIL */}

                <div className="flex gap-4">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e9eef4] text-[#0f2747]">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      className="h-5 w-5"
                    >
                      <rect
                        x="3"
                        y="5"
                        width="18"
                        height="14"
                        rx="2"
                      />

                      <path d="m4 7 8 6 8-6" />
                    </svg>
                  </div>

                  <div>
                    <div className="text-xs font-bold uppercase tracking-wide text-slate-400">
                      Email
                    </div>

                    <a
                      href="mailto:liemminhlaw.vn@gmail.com"
                      className="mt-1 block text-sm font-semibold text-[#0f2747] transition hover:text-[#b88d3b]"
                    >
                      liemminhlaw.vn@gmail.com
                    </a>
                  </div>

                </div>

                {/* ĐỊA CHỈ */}

                <div className="flex gap-4">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e9eef4] text-[#0f2747]">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      className="h-5 w-5"
                    >
                      <path d="M12 21s7-6.1 7-12a7 7 0 1 0-14 0c0 5.9 7 12 7 12Z" />
                      <circle
                        cx="12"
                        cy="9"
                        r="2.3"
                      />
                    </svg>
                  </div>

                  <div>
                    <div className="text-xs font-bold uppercase tracking-wide text-slate-400">
                      Địa chỉ
                    </div>

                    <p className="mt-1 text-sm font-semibold text-[#0f2747]">
                      Cương Kiên, Đại Mỗ, Hà Nội
                    </p>
                  </div>

                </div>

              </div>
            </div>

            {/* FORM LIÊN HỆ */}

            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">

              <div className="flex items-center gap-3">
                <span className="h-px w-9 bg-[#d6b36a]" />

                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#b88d3b]">
                  Gửi yêu cầu
                </span>
              </div>

              <h2 className="mt-3 text-2xl font-bold text-[#0f2747]">
                Trao đổi với LIÊM MINH
              </h2>

              <p className="mt-4 text-sm leading-6 text-slate-600">
                Hãy để lại một số thông tin cơ bản. Nội dung bạn gửi sẽ được
                tiếp nhận để trao đổi về nhu cầu hỗ trợ phù hợp.
              </p>

              <form
                onSubmit={handleSubmit}
                className="mt-7 space-y-5"
              >

                {/* HỌ TÊN */}

                <div>
                  <label
                    htmlFor="contact-name"
                    className="block text-sm font-semibold text-[#0f2747]"
                  >
                    Họ và tên
                    <span className="ml-1 text-red-500">
                      *
                    </span>
                  </label>

                  <input
                    id="contact-name"
                    type="text"
                    value={name}
                    onChange={(event) =>
                      setName(
                        event.target.value
                      )
                    }
                    placeholder="Nhập họ và tên"
                    maxLength={200}
                    disabled={sending}
                    className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#0f2747] focus:ring-2 focus:ring-[#0f2747]/10 disabled:bg-slate-50"
                  />
                </div>

                {/* SỐ ĐIỆN THOẠI */}

                <div>
                  <label
                    htmlFor="contact-phone"
                    className="block text-sm font-semibold text-[#0f2747]"
                  >
                    Số điện thoại
                  </label>

                  <input
                    id="contact-phone"
                    type="tel"
                    value={phone}
                    onChange={(event) =>
                      setPhone(
                        event.target.value
                      )
                    }
                    placeholder="Nhập số điện thoại"
                    maxLength={50}
                    disabled={sending}
                    className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#0f2747] focus:ring-2 focus:ring-[#0f2747]/10 disabled:bg-slate-50"
                  />
                </div>

                {/* EMAIL */}

                <div>
                  <label
                    htmlFor="contact-email"
                    className="block text-sm font-semibold text-[#0f2747]"
                  >
                    Email
                  </label>

                  <input
                    id="contact-email"
                    type="email"
                    value={email}
                    onChange={(event) =>
                      setEmail(
                        event.target.value
                      )
                    }
                    placeholder="Nhập địa chỉ email"
                    maxLength={200}
                    disabled={sending}
                    className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#0f2747] focus:ring-2 focus:ring-[#0f2747]/10 disabled:bg-slate-50"
                  />
                </div>

                {/* NỘI DUNG */}

                <div>
                  <label
                    htmlFor="contact-message"
                    className="block text-sm font-semibold text-[#0f2747]"
                  >
                    Nội dung cần hỗ trợ
                    <span className="ml-1 text-red-500">
                      *
                    </span>
                  </label>

                  <textarea
                    id="contact-message"
                    value={message}
                    onChange={(event) =>
                      setMessage(
                        event.target.value
                      )
                    }
                    placeholder="Mô tả ngắn gọn vấn đề bạn đang quan tâm..."
                    maxLength={5000}
                    rows={6}
                    disabled={sending}
                    className="mt-2 w-full resize-y rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#0f2747] focus:ring-2 focus:ring-[#0f2747]/10 disabled:bg-slate-50"
                  />

                  <div className="mt-1 text-right text-xs text-slate-400">
                    {message.length}/5000
                  </div>
                </div>

                {/* THÔNG BÁO */}

                {status && (
                  <div
                    className={`rounded-xl border px-4 py-3 text-sm leading-6 ${
                      statusType === "success"
                        ? "border-green-200 bg-green-50 text-green-700"
                        : "border-red-200 bg-red-50 text-red-700"
                    }`}
                  >
                    {status}
                  </div>
                )}

                {/* NÚT GỬI */}

                <button
                  type="submit"
                  disabled={sending}
                  className="inline-flex w-full items-center justify-center rounded-xl bg-[#0f2747] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#17365f] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {sending
                    ? "Đang gửi..."
                    : "Gửi yêu cầu"}
                </button>

                <p className="text-xs leading-5 text-slate-400">
                  Thông tin được cung cấp nhằm phục vụ việc tiếp nhận và
                  trao đổi ban đầu về nhu cầu pháp lý của bạn.
                </p>

              </form>
            </div>

          </div>
        </div>
      </section>

      {/* HỖ TRỢ */}

      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-6 pb-12 md:pb-16">

          <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">

            <div className="flex items-center gap-3">
              <span className="h-px w-9 bg-[#d6b36a]" />

              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#b88d3b]">
                Hỗ trợ
              </span>
            </div>

            <h2 className="mt-3 text-2xl font-bold text-[#0f2747]">
              Bạn đang cần hỗ trợ vấn đề gì?
            </h2>

            <p className="mt-4 text-sm leading-6 text-slate-600">
              Hãy cung cấp một số thông tin cơ bản về vấn đề bạn đang
              gặp phải. Nội dung trao đổi sẽ giúp xác định phạm vi nhu
              cầu và phương thức hỗ trợ phù hợp.
            </p>

            <div className="mt-7 grid gap-4 sm:grid-cols-2">

              {/* TÌM HIỂU PHÁP LUẬT */}

              <div className="rounded-xl border border-slate-200 bg-[#f8fafc] p-5">
                <h3 className="font-bold text-[#0f2747]">
                  Tìm hiểu pháp luật
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Trao đổi về quy định pháp luật và những vấn đề pháp
                  lý bạn đang quan tâm.
                </p>
              </div>

              {/* HỖ TRỢ VỤ VIỆC */}

              <div className="rounded-xl border border-slate-200 bg-[#f8fafc] p-5">
                <h3 className="font-bold text-[#0f2747]">
                  Hỗ trợ vụ việc
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Trao đổi về vụ việc cụ thể và nhu cầu hỗ trợ pháp lý.
                </p>
              </div>

              {/* DỊCH VỤ PHÁP LÝ */}

              <div className="rounded-xl border border-slate-200 bg-[#f8fafc] p-5">
                <h3 className="font-bold text-[#0f2747]">
                  Dịch vụ pháp lý
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Liên hệ khi có nhu cầu sử dụng dịch vụ pháp lý phù
                  hợp với vụ việc.
                </p>
              </div>

              {/* YÊU CẦU KHÁC */}

              <div className="rounded-xl border border-slate-200 bg-[#f8fafc] p-5">
                <h3 className="font-bold text-[#0f2747]">
                  Yêu cầu khác
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Trao đổi các nhu cầu khác có liên quan đến pháp luật.
                </p>
              </div>

            </div>

            <div className="mt-7 rounded-xl border-l-4 border-[#d6b36a] bg-[#f8fafc] px-5 py-4">
              <p className="text-sm leading-6 text-slate-600">
                <span className="font-semibold text-[#0f2747]">
                  Lưu ý:
                </span>{" "}
                Việc trao đổi thông tin ban đầu không đồng nghĩa với
                việc hình thành quan hệ dịch vụ pháp lý. Phạm vi công
                việc và các nội dung liên quan sẽ được trao đổi cụ thể
                với khách hàng.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* CTA */}

      <section className="border-t border-slate-200 bg-[#f5f7fa]">
        <div className="mx-auto max-w-6xl px-6 py-10 md:py-12">

          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

            <div>
              <h2 className="text-xl font-bold text-[#0f2747]">
                Bạn đang có vấn đề pháp lý cần trao đổi?
              </h2>

              <p className="mt-1 text-sm text-slate-600">
                Hãy liên hệ với LIÊM MINH để trao đổi thêm về nhu cầu của
                bạn.
              </p>
            </div>

            <a
              href="tel:0379672225"
              className="inline-flex shrink-0 items-center justify-center rounded-lg bg-[#0f2747] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#17365f]"
            >
              Gọi cho LIÊM MINH
              <span className="ml-2">
                →
              </span>
            </a>

          </div>
        </div>
      </section>

    </main>
  );
}