'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Star, ArrowRight, ArrowLeft, Check, Pointer } from 'lucide-react';

/**
 * Tap-to-copy Google-review carousel. The visitor picks the note that best
 * matches their experience; it's copied to the clipboard and they're sent to
 * Google's "write a review" page to paste & post. Recoloured to the Buy&Drive
 * brand (red on black) and using the site's fonts.
 *
 * Set NEXT_PUBLIC_GOOGLE_PLACE_ID to the business's real Google Place ID so the
 * "Post on Google" button deep-links to the correct review box.
 */

interface Review {
  chip: string;
  text: string;
}

const REVIEWS: Review[] = [
  {
    chip: 'Easy finance',
    text: 'Got my car on a monthly plan with zero stress. The team explained every number clearly, approval was fast, and the installments fit my budget perfectly. Highly recommend Buy&Drive.',
  },
  {
    chip: 'The team',
    text: 'The consultants are genuinely helpful and always available. They found me a car I love and a finance plan that actually made sense. No pressure, no hidden fees — just honest service.',
  },
  {
    chip: 'Fast approval',
    text: 'Walked in unsure I would qualify and drove out approved the same week. Smooth paperwork, transparent terms, and the lowest monthly EMI I could find in the UAE. Five stars.',
  },
  {
    chip: 'Great cars',
    text: 'Clean, well-maintained cars and exactly as described. The whole buying experience was relaxed and professional. Free insurance and registration sealed the deal for me.',
  },
  {
    chip: 'Worth it',
    text: 'Came on a friend’s recommendation and it lived up to the hype. Quality cars, fair prices, easy finance and a team that treats you right. This is the place to buy your next car.',
  },
];

const PLACE_ID = process.env.NEXT_PUBLIC_GOOGLE_PLACE_ID || '';
const REVIEW_URL = PLACE_ID
  ? `https://search.google.com/local/writereview?placeid=${PLACE_ID}`
  : 'https://www.google.com/maps/search/?api=1&query=Buy%26Drive+Cars+Dubai';

function copyToClipboard(text: string) {
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(text).catch(() => fallbackCopy(text));
  } else {
    fallbackCopy(text);
  }
}
function fallbackCopy(text: string) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.opacity = '0';
  document.body.appendChild(ta);
  ta.focus();
  ta.select();
  try {
    document.execCommand('copy');
  } catch {
    /* no-op */
  }
  document.body.removeChild(ta);
}

export function ReviewCarousel() {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(-1);
  const [showToast, setShowToast] = useState(false);

  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Drag/swipe state kept in a ref so handlers stay stable.
  const drag = useRef({
    active: false,
    moved: false,
    startX: 0,
    basePos: 0,
    lastX: 0,
    lastT: 0,
    vel: 0,
  });

  const count = REVIEWS.length;

  /** Position the cards in a 3D arc around the given (possibly fractional) index. */
  const renderAt = useCallback((p: number) => {
    cardRefs.current.forEach((c, i) => {
      if (!c) return;
      const o = i - p;
      const a = Math.abs(o);
      const clamp = Math.min(a, 3);
      c.style.transform = `translate(-50%,-50%) translateX(${o * 58}%) translateZ(${-clamp * 150}px) rotateY(${o * -9}deg) scale(${Math.max(0.55, 1 - clamp * 0.07)})`;
      c.style.opacity = a > 2.4 ? '0' : String(1 - Math.min(a, 2) * 0.22);
      c.style.filter = a > 1.15 ? `blur(${Math.min((a - 1.05) * 3, 4)}px)` : 'none';
      c.style.zIndex = String(100 - Math.round(a * 10));
      c.style.pointerEvents = a > 1.6 ? 'none' : 'auto';
    });
  }, []);

  // Re-layout whenever the active card changes (and on mount).
  useEffect(() => {
    renderAt(current);
  }, [current, renderAt]);

  useEffect(() => {
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  const triggerToast = useCallback(() => {
    setShowToast(true);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setShowToast(false), 4200);
  }, []);

  const selectCard = useCallback(
    (i: number) => {
      setSelected(i);
      copyToClipboard(REVIEWS[i].text);
      triggerToast();
    },
    [triggerToast],
  );

  const go = useCallback(
    (i: number) => setCurrent(Math.max(0, Math.min(count - 1, i))),
    [count],
  );

  // Keyboard arrows.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') setCurrent((c) => Math.max(0, c - 1));
      if (e.key === 'ArrowRight') setCurrent((c) => Math.min(count - 1, c + 1));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [count]);

  const pxPerCard = () => Math.min(window.innerWidth * 0.6, 340);

  const onPointerDown = (e: React.PointerEvent) => {
    const d = drag.current;
    d.active = true;
    d.moved = false;
    d.startX = e.clientX;
    d.basePos = current;
    d.lastX = e.clientX;
    d.lastT = performance.now();
    d.vel = 0;
    trackRef.current?.parentElement?.classList.add('cursor-grabbing');
  };

  // pointermove/up are bound on window so a drag continues outside the stage.
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const d = drag.current;
      if (!d.active) return;
      const dx = e.clientX - d.startX;
      if (Math.abs(dx) > 6) d.moved = true;
      const now = performance.now();
      const dt = now - d.lastT || 16;
      d.vel = (e.clientX - d.lastX) / dt;
      d.lastX = e.clientX;
      d.lastT = now;
      let p = d.basePos - dx / pxPerCard();
      p = Math.max(-0.6, Math.min(count - 0.4, p)); // rubber-band ends
      renderAt(p);
    };
    const onUp = (e: PointerEvent) => {
      const d = drag.current;
      if (!d.active) return;
      d.active = false;
      trackRef.current?.parentElement?.classList.remove('cursor-grabbing');
      const dx = (e?.clientX ?? d.lastX) - d.startX;
      const p = d.basePos - dx / pxPerCard();
      let target = Math.round(p);
      if (Math.abs(d.vel) > 0.45) target = d.vel < 0 ? Math.ceil(p) : Math.floor(p);
      setCurrent(Math.max(0, Math.min(count - 1, target)));
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
    };
  }, [count, renderAt]);

  const onCardClick = (i: number) => {
    if (drag.current.moved) {
      drag.current.moved = false;
      return;
    }
    if (current === i) selectCard(i);
    else setCurrent(i);
  };

  return (
    <>
      {/* Carousel stage */}
      <div
        className="relative flex min-h-[420px] flex-1 cursor-grab touch-pan-y select-none flex-col justify-center [perspective:1600px]"
        onPointerDown={onPointerDown}
      >
        <div
          ref={trackRef}
          className="relative flex h-[380px] items-center justify-center [transform-style:preserve-3d]"
        >
          {REVIEWS.map((r, i) => {
            const isSel = selected === i;
            return (
              <div
                key={r.chip}
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                role="button"
                tabIndex={0}
                aria-label={`Use review: ${r.chip}`}
                onClick={() => onCardClick(i)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setCurrent(i);
                    selectCard(i);
                  }
                }}
                className={`absolute left-1/2 top-1/2 flex h-[344px] w-[min(330px,82vw)] cursor-pointer flex-col rounded-[26px] border p-[26px_25px] text-left backdrop-blur-2xl [transform-style:preserve-3d] [transition:transform_.55s_cubic-bezier(.22,.62,.32,1),opacity_.5s_ease,filter_.5s_ease,box-shadow_.4s_ease,border-color_.4s_ease] ${
                  isSel
                    ? 'border-brand-red shadow-[0_0_0_1.5px_#E10600,0_0_44px_-6px_#E10600,0_30px_60px_-18px_rgba(0,0,0,.6)]'
                    : 'border-white/[0.12] shadow-[inset_0_1px_0_rgba(255,255,255,.18),0_30px_60px_-20px_rgba(0,0,0,.55)]'
                } bg-gradient-to-b from-white/[0.1] to-white/[0.04]`}
              >
                <div className="mb-4 flex items-center justify-between">
                  <span className="rounded-full border border-white/15 bg-white/10 px-[11px] py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.08em] text-white">
                    {r.chip}
                  </span>
                  <GoogleMark />
                </div>
                <div className="mb-3.5 flex gap-0.5 text-brand-red">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} className="h-[18px] w-[18px]" fill="currentColor" />
                  ))}
                </div>
                <p className="flex-1 text-[1.02rem] font-normal leading-relaxed text-white/95">
                  {r.text}
                </p>
                <div
                  className={`mt-4 flex items-center gap-2 text-[0.8rem] font-medium transition-opacity ${
                    isSel ? 'text-brand-red' : 'text-white/55'
                  }`}
                >
                  {isSel ? (
                    <>
                      <Check className="h-[15px] w-[15px]" /> Copied — ready to paste
                    </>
                  ) : (
                    <>
                      <Pointer className="h-[15px] w-[15px]" /> Tap to use this review
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dots */}
      <div className="mt-6 flex justify-center gap-2">
        {REVIEWS.map((r, i) => (
          <button
            key={r.chip}
            type="button"
            aria-label={`Go to review ${i + 1}`}
            onClick={() => go(i)}
            className={`h-[7px] rounded-full transition-all duration-300 ${
              i === current ? 'w-[22px] bg-brand-red' : 'w-[7px] bg-white/25'
            }`}
          />
        ))}
      </div>

      {/* Arrows */}
      <div className="mt-[18px] flex justify-center gap-3.5">
        <button
          type="button"
          aria-label="Previous review"
          onClick={() => go(current - 1)}
          className="grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-white/[0.06] text-white backdrop-blur-md transition-transform hover:scale-105 hover:bg-white/10 active:scale-95"
        >
          <ArrowLeft className="h-[19px] w-[19px]" />
        </button>
        <button
          type="button"
          aria-label="Next review"
          onClick={() => go(current + 1)}
          className="grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-white/[0.06] text-white backdrop-blur-md transition-transform hover:scale-105 hover:bg-white/10 active:scale-95"
        >
          <ArrowRight className="h-[19px] w-[19px]" />
        </button>
      </div>

      {/* Post on Google */}
      <div className="grid h-[104px] place-items-center px-[18px] py-2">
        <a
          href={REVIEW_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center gap-3 rounded-full bg-gradient-to-br from-brand-red to-brand-red-dark px-[30px] py-4 font-display text-[1.02rem] font-semibold text-white shadow-[0_14px_34px_-10px_#E10600] transition-all duration-500 ${
            selected >= 0
              ? 'translate-y-0 opacity-100'
              : 'pointer-events-none translate-y-[22px] opacity-0'
          } hover:-translate-y-0.5 hover:shadow-[0_18px_42px_-10px_#E10600] active:translate-y-0 active:scale-95`}
        >
          Post on Google
          <ArrowRight className="h-[18px] w-[18px]" />
        </a>
      </div>

      {/* Toast */}
      <div
        role="status"
        aria-live="polite"
        className={`fixed bottom-6 left-1/2 z-50 flex max-w-[min(420px,92vw)] -translate-x-1/2 items-center gap-3.5 rounded-[18px] border border-white/15 bg-brand-black-elevated/85 px-[18px] py-3.5 backdrop-blur-xl transition-transform duration-500 ${
          showToast ? 'translate-y-0' : 'translate-y-[200%]'
        }`}
        style={{ boxShadow: '0 22px 50px -14px rgba(0,0,0,.7)' }}
      >
        <div className="grid h-[34px] w-[34px] flex-none place-items-center rounded-full bg-brand-red text-white">
          <Check className="h-[18px] w-[18px]" />
        </div>
        <div className="text-[0.9rem] leading-snug">
          <b className="mb-0.5 block font-display font-semibold text-white">
            Copied to clipboard
          </b>
          <span className="text-white/60">
            Now paste it into the Google review box and post.
          </span>
        </div>
      </div>
    </>
  );
}

function GoogleMark() {
  return (
    <svg className="h-[22px] w-[22px] flex-none opacity-90" viewBox="0 0 24 24">
      <path
        fill="#fff"
        opacity=".9"
        d="M22.5 12.2c0-.7-.06-1.4-.18-2.05H12v3.88h5.9a5.05 5.05 0 0 1-2.19 3.32v2.75h3.54c2.07-1.9 3.25-4.72 3.25-7.9z"
      />
      <path
        fill="#fff"
        opacity=".55"
        d="M12 23c2.95 0 5.43-.98 7.24-2.65l-3.54-2.75c-.98.66-2.24 1.05-3.7 1.05-2.84 0-5.25-1.92-6.11-4.5H2.23v2.84A11 11 0 0 0 12 23z"
      />
      <path
        fill="#fff"
        opacity=".75"
        d="M5.89 14.15a6.6 6.6 0 0 1 0-4.3V7.01H2.23a11 11 0 0 0 0 9.98z"
      />
      <path
        fill="#fff"
        d="M12 5.38c1.6 0 3.04.55 4.17 1.63l3.13-3.13C17.43 2.1 14.95 1 12 1A11 11 0 0 0 2.23 7.01l3.66 2.84C6.75 7.3 9.16 5.38 12 5.38z"
      />
    </svg>
  );
}
