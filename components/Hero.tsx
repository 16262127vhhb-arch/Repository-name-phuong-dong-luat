"use client";

import { useEffect, useState } from "react";

const slides = [
  {
    image: "/hero/hero-01.png",
    eyebrow: "LIÊM MINH",
    title: "KIẾN THỨC PHÁP LUẬT",
    description:
      "Thông tin pháp luật được hệ thống hóa rõ ràng, dễ hiểu và hướng đến những vấn đề thực tiễn.",
  },
  {
    image: "/hero/hero-02.jpg",
    eyebrow: "HIỂU ĐÚNG PHÁP LUẬT",
    title: "TÌM HIỂU · TRA CỨU · VẬN DỤNG",
    description:
      "Cập nhật kiến thức pháp luật theo từng lĩnh vực, hỗ trợ người đọc chủ động tìm hiểu quyền và nghĩa vụ của mình.",
  },
  {
    image: "/hero/hero-03.jpg",
    eyebrow: "LIÊM CHÍNH · MINH BẠCH · CÔNG BẰNG",
    title: "TIẾP CẬN PHÁP LUẬT DỄ DÀNG",
    description:
      "Một không gian thông tin pháp luật được xây dựng theo hướng khoa học, trực quan và thực tiễn.",
  },
];

export default function Hero() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="bg-[#eef1f4] px-0 py-0 md:px-4 md:py-5">
      <div className="relative mx-auto max-w-[1440px]">

        {/* KHUNG BÊN NGOÀI */}

        <div className="relative overflow-hidden border-y border-[#c9a85c] bg-[#0b223d] shadow-[0_8px_30px_rgba(15,39,71,0.12)] md:border-x">

          {/* KHUNG TRANG TRÍ BÊN TRÁI */}

          <div className="pointer-events-none absolute bottom-0 left-0 top-0 z-30 hidden w-14 border-r border-[#c9a85c] bg-[#0b223d] md:block">
            <div className="absolute inset-y-5 left-2 right-2 border border-[#c9a85c]/70" />

            <div className="absolute left-0 top-5 h-px w-6 bg-[#c9a85c]" />
            <div className="absolute bottom-5 left-0 h-px w-6 bg-[#c9a85c]" />
          </div>

          {/* KHUNG TRANG TRÍ BÊN PHẢI */}

          <div className="pointer-events-none absolute bottom-0 right-0 top-0 z-30 hidden w-14 border-l border-[#c9a85c] bg-[#0b223d] md:block">
            <div className="absolute inset-y-5 left-2 right-2 border border-[#c9a85c]/70" />

            <div className="absolute right-0 top-5 h-px w-6 bg-[#c9a85c]" />
            <div className="absolute bottom-5 right-0 h-px w-6 bg-[#c9a85c]" />
          </div>

          {/* NỘI DUNG SLIDESHOW */}

          <div className="relative h-[390px] md:h-[420px] lg:h-[450px]">

            {slides.map((slide, index) => (
              <div
                key={slide.image}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  index === current ? "opacity-100" : "opacity-0"
                }`}
              >
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="h-full w-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-r from-[#06172b]/90 via-[#0b2340]/55 to-[#0b2340]/10" />

                <div className="absolute inset-0 bg-black/10" />
              </div>
            ))}

            {/* NỘI DUNG CHỮ */}

            <div className="relative z-20 mx-auto flex h-full max-w-6xl items-center px-8 md:px-12 lg:px-16">
              <div className="max-w-2xl text-white">

                <div className="mb-5 flex items-center gap-3">
                  <span className="h-px w-12 bg-[#d6b36a]" />

                  <span className="text-xs font-bold uppercase tracking-[0.22em] text-[#e4c982]">
                    {slides[current].eyebrow}
                  </span>
                </div>

                <h1 className="max-w-2xl text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
                  {slides[current].title}
                </h1>

                <p className="mt-5 max-w-xl text-base leading-7 text-white/85">
                  {slides[current].description}
                </p>

                {/* TÌM KIẾM */}

                <form
                  action="/bai-viet"
                  method="GET"
                  className="mt-7 flex max-w-xl overflow-hidden rounded-lg border border-white/20 bg-white shadow-xl"
                >
                  <div className="flex flex-1 items-center">

                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="ml-4 h-5 w-5 shrink-0 text-slate-400"
                    >
                      <circle cx="11" cy="11" r="7" />
                      <path d="m20 20-4-4" />
                    </svg>

                    <input
                      type="text"
                      name="q"
                      placeholder="Tìm kiếm vấn đề pháp luật..."
                      className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400"
                    />
                  </div>

                  <button
                    type="submit"
                    className="bg-[#0f2747] px-5 text-sm font-semibold text-white transition hover:bg-[#193b68]"
                  >
                    Tìm kiếm
                  </button>
                </form>
              </div>
            </div>

            {/* CHẤM SLIDE */}

            <div className="absolute bottom-7 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2">
              {slides.map((slide, index) => (
                <button
                  key={slide.image}
                  type="button"
                  aria-label={`Chuyển đến ảnh ${index + 1}`}
                  onClick={() => setCurrent(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    current === index
                      ? "w-9 bg-[#d6b36a]"
                      : "w-2 bg-white/60 hover:bg-white"
                  }`}
                />
              ))}
            </div>

            {/* THANH TIẾN TRÌNH */}

            <div className="absolute bottom-0 left-14 right-14 z-30 h-[2px] bg-white/10">
              <div
                key={current}
                className="h-full bg-[#d6b36a]"
                style={{
                  animation: "heroProgress 6s linear",
                }}
              />
            </div>

          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes heroProgress {
          from {
            width: 0%;
          }

          to {
            width: 100%;
          }
        }
      `}</style>
    </section>
  );
}   