'use client';

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Loader2, ArrowRight } from 'lucide-react';
import { formatEMI, cn } from '@/lib/utils';
import type { CarSearchHit } from '@/app/api/cars/search/route';

const DEBOUNCE_MS = 550;

interface CarSearchProps {
  /** Real published-car count, shown on the submit button (e.g. "Search 240 cars"). */
  total?: number;
  className?: string;
  /**
   * Fired when the user starts (true) or stops (false) interacting with the
   * search. The hero uses it to pause its auto-advancing slideshow so the
   * search isn't swapped out mid-use.
   */
  onActiveChange?: (active: boolean) => void;
}

export function CarSearch({ total, className, onActiveChange }: CarSearchProps) {
  const router = useRouter();
  const listboxId = useId();

  const [query, setQuery] = useState('');
  const [hits, setHits] = useState<CarSearchHit[]>([]);
  const [count, setCount] = useState<number | undefined>(total);
  const [matched, setMatched] = useState(0);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const [highlight, setHighlight] = useState(-1);

  // The user is "engaged" while the field is focused, has text, or the results
  // dropdown is open. Report transitions up so the hero can pause its slideshow.
  const active = focused || open || query.trim().length > 0;
  useEffect(() => {
    onActiveChange?.(active);
  }, [active, onActiveChange]);

  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  // Track the in-flight request so a slow earlier response can't overwrite a
  // newer one, and so we can cancel on unmount / new keystroke.
  const abortRef = useRef<AbortController | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const runSearch = useCallback(async (q: string) => {
    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    setLoading(true);
    try {
      const res = await fetch(`/api/cars/search?q=${encodeURIComponent(q)}`, {
        signal: ctrl.signal,
      });
      if (!res.ok) throw new Error('search failed');
      const data = (await res.json()) as {
        total: number;
        matched?: number;
        hits: CarSearchHit[];
      };
      // Ignore if a newer request superseded this one.
      if (ctrl.signal.aborted) return;
      setHits(data.hits);
      setMatched(data.matched ?? data.hits.length);
      if (typeof data.total === 'number') setCount(data.total);
      setHighlight(-1);
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        setHits([]);
        setMatched(0);
      }
    } finally {
      // Only the latest controller clears the spinner.
      if (abortRef.current === ctrl) setLoading(false);
    }
  }, []);

  // Debounced fetch on every query change.
  useEffect(() => {
    const q = query.trim();
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!q) {
      abortRef.current?.abort();
      setHits([]);
      setMatched(0);
      setLoading(false);
      return;
    }
    setLoading(true);
    debounceRef.current = setTimeout(() => runSearch(q), DEBOUNCE_MS);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, runSearch]);

  // Cancel any in-flight request when the component unmounts.
  useEffect(() => () => abortRef.current?.abort(), []);

  // Close the dropdown (and drop focus) on outside click.
  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
        setFocused(false);
      }
    }
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, []);

  // Resume the slideshow if the search unmounts while still "active".
  useEffect(() => () => onActiveChange?.(false), [onActiveChange]);

  const goToResults = useCallback(
    (q: string) => {
      const trimmed = q.trim();
      router.push(trimmed ? `/cars?q=${encodeURIComponent(trimmed)}` : '/cars');
    },
    [router],
  );

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setOpen(true);
      setHighlight((h) => Math.min(h + 1, hits.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlight((h) => Math.max(h - 1, -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (open && highlight >= 0 && hits[highlight]) {
        router.push(`/cars/${hits[highlight].slug}`);
      } else {
        goToResults(query);
      }
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  const showDropdown = open && query.trim().length > 0;
  const countLabel =
    typeof count === 'number'
      ? `Search ${count.toLocaleString('en-AE')} car${count === 1 ? '' : 's'}`
      : 'Search cars';

  return (
    <div
      ref={rootRef}
      className={cn('relative z-50 w-full max-w-2xl', className)}
    >
      {/* Glassy panel */}
      <div className="rounded-[28px] border border-white/15 bg-[#191919]/90 p-3 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.8)] backdrop-blur-2xl sm:p-4">
        <p className="mb-2.5 text-center text-sm font-semibold tracking-wide text-white/85 sm:mb-3">
          Find your perfect car
        </p>

        <div className="flex items-stretch gap-2 rounded-2xl border border-white/12 bg-white/[0.07] p-1.5 transition-colors focus-within:border-white/30 sm:gap-3 sm:rounded-full">
          <div className="relative flex flex-1 items-center">
            <Search className="pointer-events-none absolute left-4 h-4 w-4 text-white/45" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setOpen(true);
              }}
              onFocus={() => {
                setFocused(true);
                if (query.trim()) setOpen(true);
              }}
              onBlur={() => setFocused(false)}
              onKeyDown={onKeyDown}
              placeholder="Make, model, or keyword"
              aria-label="Search cars by make, model or keyword"
              role="combobox"
              aria-expanded={showDropdown}
              aria-controls={listboxId}
              aria-autocomplete="list"
              autoComplete="off"
              className="min-w-0 w-full bg-transparent py-2.5 pl-11 pr-3 text-sm text-white placeholder:text-white/45 focus:outline-none sm:text-base"
            />
            {loading && (
              <Loader2 className="absolute right-2 h-4 w-4 animate-spin text-white/40" />
            )}
          </div>

          <button
            type="button"
            onClick={() => goToResults(query)}
            className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-xl bg-brand-red px-4 py-2.5 text-sm font-semibold text-white shadow-[0_12px_24px_-14px_rgba(225,6,0,0.9)] transition-colors hover:bg-brand-red/90 sm:rounded-full sm:px-6"
          >
            <span className="hidden sm:inline">{countLabel}</span>
            <span className="sm:hidden">Search</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Live results dropdown */}
      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
            className="absolute left-0 right-0 z-[100] mt-3 overflow-hidden rounded-2xl border border-white/15 bg-[#080808]/98 shadow-[0_34px_90px_-18px_rgba(0,0,0,0.98)] ring-1 ring-black/30 backdrop-blur-2xl"
          >
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5">
              <span className="text-[11px] font-semibold uppercase tracking-widest text-white/45">
                Matching cars
              </span>
              {loading ? (
                <span className="text-[11px] text-white/40">Searching...</span>
              ) : (
                <span className="text-[11px] text-white/40">
                  {matched.toLocaleString('en-AE')} found
                </span>
              )}
            </div>

            <ul
              id={listboxId}
              role="listbox"
              className="max-h-[min(360px,calc(100vh-18rem))] overflow-y-auto overscroll-contain py-1.5"
            >
              {hits.length === 0 && !loading ? (
                <li className="px-4 py-6 text-center text-sm text-white/50">
                  No cars match{' '}
                  <span className="text-white/80">&quot;{query.trim()}&quot;</span>
                </li>
              ) : (
                hits.map((hit, i) => (
                  <li key={hit.slug} role="option" aria-selected={i === highlight}>
                    <button
                      type="button"
                      onMouseEnter={() => setHighlight(i)}
                      onClick={() => router.push(`/cars/${hit.slug}`)}
                      className={cn(
                        'flex w-full items-center gap-3 px-3 py-3 text-left transition-colors sm:px-4',
                        i === highlight ? 'bg-white/[0.08]' : 'hover:bg-white/[0.05]',
                      )}
                    >
                      <span className="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg bg-white/5">
                        {hit.image && (
                          <Image
                            src={hit.image}
                            alt=""
                            fill
                            sizes="64px"
                            className={cn(
                              'object-cover',
                              hit.status === 'sold' && 'opacity-50 grayscale',
                            )}
                          />
                        )}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-2">
                          <span className="truncate text-sm font-semibold text-white">
                            {hit.name}
                          </span>
                          {hit.status === 'sold' && (
                            <span className="shrink-0 rounded-full bg-white/10 px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wide text-white/60">
                              Sold
                            </span>
                          )}
                        </span>
                        <span className="mt-0.5 block truncate text-[11px] text-white/45">
                          {hit.brand} &middot; {hit.category} &middot; {hit.year}
                        </span>
                      </span>
                      <span className="hidden shrink-0 text-right sm:block">
                        <span className="block text-[10px] uppercase tracking-wide text-white/40">
                          EMI from
                        </span>
                        <span className="block text-xs font-semibold text-white">
                          {formatEMI(hit.emiFrom)}
                          <span className="font-normal text-white/45">/mo</span>
                        </span>
                      </span>
                    </button>
                  </li>
                ))
              )}
            </ul>

            {matched > hits.length && (
              <button
                type="button"
                onClick={() => goToResults(query)}
                className="flex w-full items-center justify-center gap-1.5 border-t border-white/10 bg-white/[0.03] px-4 py-3 text-xs font-semibold text-brand-red transition-colors hover:bg-white/[0.06]"
              >
                See all {matched.toLocaleString('en-AE')} results
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
