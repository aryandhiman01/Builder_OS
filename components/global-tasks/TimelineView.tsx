"use client";

import { useMemo, useRef } from "react";
import { ChevronLeft, ChevronRight, Flag, Calendar } from "lucide-react";
import type { GlobalTask } from "./GlobalTasksClient";

interface TimelineViewProps {
  tasks: GlobalTask[];
  allTasks: GlobalTask[];
  loading: boolean;
  onTaskClick: (task: GlobalTask) => void;
  onTaskUpdate: (taskId: string, updates: Partial<GlobalTask>) => void;
  onTaskDelete: (taskId: string) => void;
  onRefresh: () => void;
}

const PRIORITY_CONFIG: Record<string, { bar: string; dot: string }> = {
  high: { bar: "bg-orange-500/70 border-orange-500/40", dot: "bg-orange-400" },
  medium: { bar: "bg-yellow-500/70 border-yellow-500/40", dot: "bg-yellow-400" },
  low: { bar: "bg-green-500/70 border-green-500/40", dot: "bg-green-400" },
};

const DAY_WIDTH = 80; // px per day column
const DAYS_SHOWN = 14;

export default function TimelineView({ tasks, loading, onTaskClick }: TimelineViewProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const days = useMemo(() => {
    return Array.from({ length: DAYS_SHOWN }, (_, i) => {
      const d = new Date(today);
      d.setDate(d.getDate() + i - 2); // start 2 days before today
      return d;
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const tasksWithDates = useMemo(
    () =>
      tasks
        .filter((t) => t.dueDate)
        .map((t) => ({
          ...t,
          due: new Date(t.dueDate!),
          created: new Date(t.createdAt),
        }))
        .sort((a, b) => a.due.getTime() - b.due.getTime()),
    [tasks]
  );

  const getDayOffset = (d: Date) => {
    const target = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const firstDay = new Date(days[0].getFullYear(), days[0].getMonth(), days[0].getDate());
    const diffTime = target.getTime() - firstDay.getTime();
    return Math.round(diffTime / (1000 * 60 * 60 * 24));
  };

  const scroll = (dir: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir === "left" ? -DAY_WIDTH * 3 : DAY_WIDTH * 3, behavior: "smooth" });
    }
  };

  if (loading) {
    return <div className="h-64 rounded-2xl border border-white/[0.07] bg-white/[0.02] animate-pulse" />;
  }

  const MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const DAYS_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="space-y-4">
      {/* Nav */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => scroll("left")}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-[#8a8a93] transition hover:text-white hover:bg-white/[0.07]"
        >
          <ChevronLeft size={15} />
        </button>
        <span className="text-sm font-semibold text-white">
          {MONTHS_SHORT[days[2].getMonth()]} {days[2].getFullYear()}
        </span>
        <button
          onClick={() => scroll("right")}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-[#8a8a93] transition hover:text-white hover:bg-white/[0.07]"
        >
          <ChevronRight size={15} />
        </button>
      </div>

      <div className="rounded-2xl border border-white/[0.07] overflow-hidden bg-[#09090c]">
        {/* Header row */}
        <div
          ref={scrollRef}
          className="overflow-x-auto scrollbar-none"
        >
          <div style={{ minWidth: DAY_WIDTH * DAYS_SHOWN }}>
            {/* Day labels */}
            <div
              className="flex border-b border-white/[0.07] bg-white/[0.02]"
              style={{ minWidth: DAY_WIDTH * DAYS_SHOWN }}
            >
              {days.map((d, i) => {
                const isToday =
                  d.getDate() === new Date().getDate() &&
                  d.getMonth() === new Date().getMonth() &&
                  d.getFullYear() === new Date().getFullYear();
                return (
                  <div
                    key={i}
                    style={{ width: DAY_WIDTH }}
                    className={`shrink-0 border-r border-white/[0.04] py-3 text-center ${
                      isToday ? "bg-orange-500/[0.08]" : ""
                    }`}
                  >
                    <div className={`text-[10px] font-bold uppercase tracking-widest ${isToday ? "text-orange-400" : "text-[#8a8a93]"}`}>
                      {DAYS_SHORT[d.getDay()]}
                    </div>
                    <div
                      className={`mx-auto mt-1 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                        isToday ? "bg-orange-500 text-white shadow-md shadow-orange-500/30" : "text-white"
                      }`}
                    >
                      {d.getDate()}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Task rows */}
            <div
              className="relative"
              style={{ minWidth: DAY_WIDTH * DAYS_SHOWN, minHeight: 220 }}
            >
              {/* Vertical today line */}
              {(() => {
                const todayOffset = getDayOffset(today);
                if (todayOffset < 0 || todayOffset >= DAYS_SHOWN) return null;
                return (
                  <div
                    className="absolute top-0 bottom-0 w-px bg-orange-500/40 z-10 pointer-events-none"
                    style={{ left: todayOffset * DAY_WIDTH + DAY_WIDTH / 2 }}
                  />
                );
              })()}

              {/* Day column backgrounds */}
              <div className="absolute inset-0 flex pointer-events-none">
                {days.map((d, i) => {
                  const isToday =
                    d.getDate() === new Date().getDate() &&
                    d.getMonth() === new Date().getMonth() &&
                    d.getFullYear() === new Date().getFullYear();
                  return (
                    <div
                      key={i}
                      style={{ width: DAY_WIDTH }}
                      className={`shrink-0 border-r border-white/[0.04] ${isToday ? "bg-orange-500/[0.03]" : ""}`}
                    />
                  );
                })}
              </div>

              {/* Tasks */}
              <div className="relative p-3 space-y-2.5">
                {tasksWithDates.map((task) => {
                  const dueOffset = getDayOffset(task.due);
                  const createdOffset = getDayOffset(task.created);

                  const estimatedDays = task.estimatedHours ? Math.ceil(task.estimatedHours / 8) : 1;
                  const durationDays = Math.max(1, Math.min(7, estimatedDays));

                  // The bar MUST END on the Due Date (dueOffset column)
                  const endCol = Math.min(DAYS_SHOWN - 1, dueOffset);
                  // The bar starts at startCol (either created date or due date minus duration)
                  const startColRaw = createdOffset < dueOffset ? createdOffset : dueOffset - durationDays + 1;
                  const startCol = Math.max(0, Math.min(endCol, startColRaw));

                  if (endCol < 0 || startCol >= DAYS_SHOWN) return null;

                  const spanDays = Math.max(1, endCol - startCol + 1);
                  const pCfg = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium;

                  const leftPos = startCol * DAY_WIDTH + 4;
                  const widthPos = spanDays * DAY_WIDTH - 8;

                  return (
                    <div key={task.id} className="relative h-10">
                      <button
                        onClick={() => onTaskClick(task)}
                        style={{
                          position: "absolute",
                          left: leftPos,
                          width: Math.max(72, widthPos),
                        }}
                        className={`group flex h-9 items-center justify-between gap-2 rounded-xl px-3 text-left ${pCfg.bar} border shadow-md transition hover:brightness-125 cursor-pointer`}
                      >
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className="truncate text-[11px] font-semibold text-white">{task.title}</span>
                          <span
                            className="shrink-0 rounded px-1.5 py-0.5 text-[9px] font-bold text-white/80"
                            style={{ background: "rgba(255,255,255,0.12)" }}
                          >
                            {task.project.title}
                          </span>
                        </div>

                        {/* Due Date Indicator Flag at the END of the bar */}
                        <div className="flex items-center gap-1 shrink-0 bg-black/20 rounded px-1.5 py-0.5 text-[9px] font-bold text-white/90">
                          <Flag size={9} className="text-orange-300" />
                          <span>{task.due.getDate()} {MONTHS_SHORT[task.due.getMonth()]}</span>
                        </div>
                      </button>
                    </div>
                  );
                })}

                {tasksWithDates.length === 0 && (
                  <div className="flex h-32 items-center justify-center">
                    <p className="text-sm text-[#8a8a93]">No tasks with due dates in this timeline range.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-between gap-4 text-[10px] text-[#8a8a93]">
        <div className="flex items-center gap-4">
          {Object.entries(PRIORITY_CONFIG).map(([key, cfg]) => (
            <div key={key} className="flex items-center gap-1.5 capitalize">
              <span className={`h-2.5 w-4 rounded-sm ${cfg.bar}`} />
              {key}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-1.5">
          <Flag size={11} className="text-orange-400" />
          <span>Bar ENDS on Due Date (Deadline)</span>
        </div>
      </div>
    </div>
  );
}
