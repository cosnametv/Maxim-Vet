import { useEffect, useRef, useState, ChangeEvent } from 'react';
import { Play, Pause, RotateCcw, Loader2 } from 'lucide-react';

interface LessonVideoPlayerProps {
  /** Full YouTube URL or 11-char video id. */
  video: string;
  /** Unique key used to persist the resume position (per member + lesson). */
  storageKey: string;
  /** Fired once when the video finishes playing. */
  onEnded?: () => void;
}

declare global {
  interface Window {
    YT?: any;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let apiPromise: Promise<void> | null = null;
function loadYouTubeApi(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();
  if (window.YT && window.YT.Player) return Promise.resolve();
  if (apiPromise) return apiPromise;
  apiPromise = new Promise<void>((resolve) => {
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prev?.();
      resolve();
    };
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.body.appendChild(tag);
  });
  return apiPromise;
}

function parseVideoId(input: string): string {
  if (/^[\w-]{11}$/.test(input)) return input;
  const m = input.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/);
  return m ? m[1] : '';
}

function formatTime(seconds: number): string {
  if (!seconds || !isFinite(seconds)) return '0:00';
  const s = Math.floor(seconds);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const mm = h > 0 ? String(m).padStart(2, '0') : String(m);
  return `${h > 0 ? h + ':' : ''}${mm}:${String(sec).padStart(2, '0')}`;
}

export default function LessonVideoPlayer({ video, storageKey, onEnded }: LessonVideoPlayerProps) {
  const targetRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const onEndedRef = useRef(onEnded);
  onEndedRef.current = onEnded;
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [current, setCurrent] = useState(0);
  const [resumedFrom, setResumedFrom] = useState(0);

  const videoId = parseVideoId(video);

  // Initialise the YouTube IFrame player + restore saved position.
  useEffect(() => {
    let destroyed = false;
    let tick: number | undefined;

    const savedRaw = Number(localStorage.getItem(storageKey) || '0');
    const saved = isFinite(savedRaw) ? savedRaw : 0;

    loadYouTubeApi().then(() => {
      if (destroyed || !targetRef.current || !window.YT) return;

      playerRef.current = new window.YT.Player(targetRef.current, {
        width: '100%',
        height: '100%',
        videoId,
        playerVars: {
          controls: 0,        // we provide our own controls
          disablekb: 1,
          modestbranding: 1,
          rel: 0,
          fs: 0,
          iv_load_policy: 3,
          playsinline: 1,
          origin: window.location.origin,
        },
        events: {
          onReady: (e: any) => {
            setReady(true);
            setDuration(e.target.getDuration() || 0);
            if (saved > 3) {
              e.target.seekTo(saved, true);
              e.target.pauseVideo();
              setCurrent(saved);
              setResumedFrom(saved);
            }
          },
          onStateChange: (e: any) => {
            const YT = window.YT;
            const state = e.data;
            setPlaying(state === YT.PlayerState.PLAYING);
            if (
              state === YT.PlayerState.PAUSED ||
              state === YT.PlayerState.ENDED
            ) {
              const p = playerRef.current;
              if (p?.getCurrentTime) {
                localStorage.setItem(storageKey, String(Math.floor(p.getCurrentTime())));
              }
            }
            if (state === YT.PlayerState.ENDED) {
              onEndedRef.current?.();
            }
          },
        },
      });
    });

    // Poll for time + continuously persist progress so a hard close still resumes.
    tick = window.setInterval(() => {
      const p = playerRef.current;
      if (p?.getCurrentTime) {
        const t = p.getCurrentTime() || 0;
        setCurrent(t);
        if (!duration && p.getDuration) setDuration(p.getDuration() || 0);
        if (t > 0) localStorage.setItem(storageKey, String(Math.floor(t)));
      }
    }, 1000);

    return () => {
      destroyed = true;
      if (tick) clearInterval(tick);
      // Persist one last time before tearing down.
      const p = playerRef.current;
      try {
        if (p?.getCurrentTime) {
          localStorage.setItem(storageKey, String(Math.floor(p.getCurrentTime())));
        }
        p?.destroy?.();
      } catch {
        /* noop */
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoId, storageKey]);

  const togglePlay = () => {
    const p = playerRef.current;
    if (!p) return;
    if (playing) p.pauseVideo();
    else p.playVideo();
  };

  const restart = () => {
    const p = playerRef.current;
    if (!p) return;
    p.seekTo(0, true);
    p.playVideo();
    setResumedFrom(0);
    localStorage.setItem(storageKey, '0');
  };

  const onSeek = (e: ChangeEvent<HTMLInputElement>) => {
    const p = playerRef.current;
    const t = Number(e.target.value);
    setCurrent(t);
    if (p?.seekTo) p.seekTo(t, true);
    localStorage.setItem(storageKey, String(Math.floor(t)));
  };

  const progressPct = duration > 0 ? Math.min(100, (current / duration) * 100) : 0;

  return (
    <div className="space-y-2.5">
      {/* Video stage */}
      <div className="relative rounded-2xl overflow-hidden bg-black aspect-video">
        <div ref={targetRef} className="absolute inset-0 w-full h-full" />

        {/* Click shield: captures clicks so the iframe never takes focus
            (prevents the protection overlay from firing on normal use) and
            blocks the native YouTube context menu / controls. */}
        <button
          type="button"
          onClick={togglePlay}
          onContextMenu={(e) => e.preventDefault()}
          aria-label={playing ? 'Pause video' : 'Play video'}
          className="absolute inset-0 z-10 flex items-center justify-center group cursor-pointer"
        >
          {!ready && (
            <Loader2 className="w-10 h-10 text-white/80 animate-spin" />
          )}
          {ready && !playing && (
            <span className="w-16 h-16 rounded-full bg-emerald-600/90 text-white flex items-center justify-center shadow-xl group-hover:scale-105 transition-transform">
              <Play className="w-7 h-7 translate-x-0.5" fill="currentColor" />
            </span>
          )}
        </button>
      </div>

      {/* Custom controls (kept outside the iframe so focus stays on the page) */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={togglePlay}
          disabled={!ready}
          aria-label={playing ? 'Pause' : 'Play'}
          className="w-9 h-9 rounded-full bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white flex items-center justify-center shrink-0 transition cursor-pointer disabled:cursor-not-allowed"
        >
          {playing ? <Pause className="w-4 h-4" fill="currentColor" /> : <Play className="w-4 h-4 translate-x-0.5" fill="currentColor" />}
        </button>

        <button
          type="button"
          onClick={restart}
          disabled={!ready}
          aria-label="Restart from beginning"
          className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-600 flex items-center justify-center shrink-0 transition cursor-pointer disabled:cursor-not-allowed"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <span className="text-[11px] font-mono text-slate-500 tabular-nums shrink-0">
          {formatTime(current)}
        </span>

        <input
          type="range"
          min={0}
          max={duration || 0}
          step={1}
          value={current}
          onChange={onSeek}
          disabled={!ready}
          className="flex-1 h-1.5 accent-emerald-700 cursor-pointer"
          style={{
            background: `linear-gradient(to right, #047857 ${progressPct}%, #e2e8f0 ${progressPct}%)`,
            borderRadius: 9999,
          }}
        />

        <span className="text-[11px] font-mono text-slate-400 tabular-nums shrink-0">
          {formatTime(duration)}
        </span>
      </div>

      {resumedFrom > 3 && (
        <p className="text-[11px] text-emerald-700 font-semibold">
          Resumed from where you left off ({formatTime(resumedFrom)}).
        </p>
      )}
    </div>
  );
}
