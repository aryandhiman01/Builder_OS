"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { GlobalTask } from "./GlobalTasksClient";

interface CalendarViewProps {
  tasks: GlobalTask[];
  allTasks: GlobalTask[];
  loading: boolean;
  onTaskClick: (task: GlobalTask) => void;
  onTaskUpdate: (taskId: string, updates: Partial<GlobalTask>) => void;
  onTaskDelete: (taskId: string) => void;
  onRefresh: () => void;
}

type CalendarMode = "month" | "week";

const PRIORITY_DOTS: Record<string, string> = {
  high: "bg-orange-400",
  medium: "bg-yellow-400",
  low: "bg-green-400",
};

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export default function CalendarView({ tasks, loading, onTaskClick }: CalendarViewProps) {
  const [mode, setMode] = useState<CalendarMode>("month");
  const [offset, setOffset] = useState(0);

  const today = new Date();

  // Build task map: dateKey -> tasks
  const tasksByDate = useMemo(() => {
    const map: Record<string, GlobalTask[]> = {};
    tasks.forEach((t) => {
      if (!t.dueDate) return;
      const d = new Date(t.dueDate);
      const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      if (!map[key]) map[key] = [];
      map[key].push(t);
    });
    return map;
  }, [tasks]);

  // Month view — build grid
  const monthGrid = useMemo(() => {
    const ref = new Date(today.getFullYear(), today.getMonth() + offset, 1);
    const year = ref.getFullYear();
    const month = ref.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrev = new Date(year, month, 0).getDate();

    const cells: { date: Date | null; isCurrentMonth: boolean }[] = [];
    // Prev month filler
    for (let i = firstDay - 1; i >= 0; i--) {
      cells.push({ date: new Date(year, month - 1, daysInPrev - i), isCurrentMonth: false });
    }
    // Current month
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push({ date: new Date(year, month, d), isCurrentMonth: true });
    }
    // Next month filler
    while (cells.length % 7 !== 0) {
      cells.push({ date: new Date(year, month + 1, cells.length - daysInMonth - firstDay + 1), isCurrentMonth: false });
    }
    return { cells, monthLabel: `${MONTHS[month]} ${year}` };
  }, [offset, today]);

  // Week view
  const weekGrid = useMemo(() => {
    const ref = new Date(today);
    ref.setDate(ref.getDate() + offset * 7);
    const dayOfWeek = ref.getDay();
    const weekStart = new Date(ref);
    weekStart.setDate(ref.getDate() - dayOfWeek);
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(weekStart);
      d.setDate(weekStart.getDate() + i);
      return d;
    });
    return {
      days,
      label: `${MONTHS[days[0].getMonth()]} ${days[0].getDate()} – ${
        days[0].getMonth() !== days[6].getMonth() ? MONTHS[days[6].getMonth()] + " " : ""
      }${days[6].getDate()}, ${days[6].getFullYear()}`,
    };
  }, [offset, today]);

  const isToday = (d: Date) =>
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear();

  const getDateTasks = (d: Date) =>
    tasksByDate[`${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`] || [];

  if (loading) {
    return <div className="h-96 rounded-2xl border border-white/[0.07] bg-white/[0.02] animate-pulse" />;
  }

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center justify-between sm:justify-start gap-1.5 sm:gap-2">
          <button
            onClick={() => setOffset((v) => v - 1)}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-[#8a8a93] transition hover:text-white hover:bg-white/[0.07]"
          >
            <ChevronLeft size={15} />
          </button>
          <span className="flex-1 sm:min-w-[170px] text-center text-xs sm:text-sm font-semibold text-white truncate px-1">
            {mode === "month" ? monthGrid.monthLabel : weekGrid.label}
          </span>
          <button
            onClick={() => setOffset((v) => v + 1)}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-[#8a8a93] transition hover:text-white hover:bg-white/[0.07]"
          >
            <ChevronRight size={15} />
          </button>
          <button
            onClick={() => setOffset(0)}
            className="ml-1 sm:ml-2 rounded-lg border border-white/10 bg-white/[0.03] px-2.5 sm:px-3 py-1.5 text-xs text-[#8a8a93] transition hover:text-white hover:bg-white/[0.07]"
          >
            Today
          </button>
        </div>

        <div className="flex rounded-xl border border-white/10 bg-white/[0.03] p-0.5 self-end sm:self-auto">
          {(["month", "week"] as CalendarMode[]).map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); setOffset(0); }}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition ${
                mode === m ? "bg-white/10 text-white" : "text-[#8a8a93] hover:text-white"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Month View */}
      {mode === "month" && (
        <div className="rounded-2xl border border-white/[0.07] overflow-hidden bg-[#09090c]">
          {/* Day headers */}
          <div className="grid grid-cols-7 border-b border-white/[0.07] bg-white/[0.02]">
            {WEEKDAYS.map((d) => (
              <div key={d} className="py-2 text-center text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-[#8a8a93]">
                {d}
              </div>
            ))}
          </div>

          {/* Cells */}
          <div className="grid grid-cols-7">
            {monthGrid.cells.map((cell, i) => {
              if (!cell.date) return <div key={i} />;
              const cellTasks = getDateTasks(cell.date);
              const isTodayCell = isToday(cell.date);

              return (
                <div
                  key={i}
                  className={`min-h-[55px] sm:min-h-[80px] border-b border-r border-white/[0.04] p-1 sm:p-2 transition ${
                    !cell.isCurrentMonth ? "opacity-30" : ""
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full text-[10px] sm:text-xs font-semibold ${
                        isTodayCell
                          ? "bg-orange-500 text-white font-bold"
                          : "text-[#8a8a93]"
                      }`}
                    >
                      {cell.date.getDate()}
                    </span>
                  </div>
                  <div className="mt-1 space-y-0.5">
                    {cellTasks.slice(0, 2).map((task) => (
                      <button
                        key={task.id}
                        onClick={() => onTaskClick(task)}
                        className="flex w-full items-center gap-1 rounded px-1 py-0.5 text-left text-[9px] sm:text-[10px] font-medium text-white transition hover:bg-white/[0.07] truncate"
                      >
                        <span
                          className={`h-1.5 w-1.5 shrink-0 rounded-full ${PRIORITY_DOTS[task.priority] || "bg-[#8a8a93]"}`}
                        />
                        <span className="truncate">{task.title}</span>
                      </button>
                    ))}
                    {cellTasks.length > 2 && (
                      <span className="text-[9px] sm:text-[10px] text-[#8a8a93] pl-1 font-medium">+{cellTasks.length - 2} more</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Week View */}
      {mode === "week" && (
        <div className="rounded-2xl border border-white/[0.07] overflow-hidden bg-[#09090c]">
          <div className="overflow-x-auto scrollbar-none">
            <div className="grid grid-cols-7 divide-x divide-white/[0.05] min-w-[550px] sm:min-w-0">
              {weekGrid.days.map((day) => {
                const dayTasks = getDateTasks(day);
                const isTodayDay = isToday(day);

                return (
                  <div key={day.toISOString()} className="min-h-[260px] sm:min-h-[300px] p-2 sm:p-3">
                    <div className="mb-2.5 sm:mb-3 text-center">
                      <div className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-[#8a8a93]">
                        {WEEKDAYS[day.getDay()]}
                      </div>
                      <div
                        className={`mx-auto mt-1 flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full text-xs sm:text-sm font-bold ${
                          isTodayDay ? "bg-orange-500 text-white" : "text-white"
                        }`}
                      >
                        {day.getDate()}
                      </div>
                    </div>
                    <div className="space-y-1">
                      {dayTasks.map((task) => (
                        <button
                          key={task.id}
                          onClick={() => onTaskClick(task)}
                          className="flex w-full items-center gap-1.5 rounded-lg border border-white/[0.07] bg-white/[0.03] px-1.5 sm:px-2 py-1 sm:py-1.5 text-left transition hover:border-white/15 hover:bg-white/[0.06]"
                        >
                          <span
                            className={`h-1.5 sm:h-2 w-1.5 sm:w-2 shrink-0 rounded-full ${PRIORITY_DOTS[task.priority] || "bg-[#8a8a93]"}`}
                          />
                          <span className="truncate text-[10px] font-medium text-white">{task.title}</span>
                        </button>
                      ))}
                      {dayTasks.length === 0 && (
                        <div className="flex h-14 sm:h-16 items-center justify-center rounded-lg border border-dashed border-white/[0.05]">
                          <span className="text-[10px] text-[#8a8a93]/40">No tasks</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
