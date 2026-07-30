import Link from "next/link";
import {
  Sparkles,
  FolderKanban,
  CheckCircle2,
  Brain,
  FileText,
  LayoutTemplate,
  ArrowRight,
  Activity,
} from "lucide-react";

export interface ActivityItemData {
  id: string;
  title: string;
  description: string;
  time: string;
  iconType?: "FolderKanban" | "Brain" | "CheckCircle2" | "Sparkles" | "FileText" | "LayoutTemplate";
}

interface RecentActivityProps {
  activities?: ActivityItemData[];
  loading?: boolean;
}

const ICON_MAP = {
  FolderKanban,
  Brain,
  CheckCircle2,
  Sparkles,
  FileText,
  LayoutTemplate,
};

export default function RecentActivity({ activities = [], loading = false }: RecentActivityProps) {
  return (
    <div
      className="
      rounded-3xl
      border
      border-white/10
      bg-white/[0.03]
      p-6
      "
    >
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">
            Recent Activity
          </h2>
          <p className="mt-1 text-sm text-zinc-500">
            Your latest BuilderOS updates.
          </p>
        </div>

        <Link
          href="/projects"
          className="
          flex
          items-center
          gap-2
          text-sm
          font-medium
          text-white
          transition
          hover:text-zinc-300
          "
        >
          View All
          <ArrowRight size={16} />
        </Link>
      </div>

      {/* Timeline */}
      <div className="space-y-6">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4 animate-pulse">
                <div className="h-11 w-11 rounded-2xl bg-white/5 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-1/3 rounded bg-white/5" />
                  <div className="h-3 w-1/2 rounded bg-white/5" />
                </div>
              </div>
            ))}
          </div>
        ) : activities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]">
              <Activity size={20} className="text-zinc-500" />
            </div>
            <p className="mt-3 text-sm font-medium text-zinc-400">
              No recent activity recorded yet.
            </p>
            <p className="mt-1 text-xs text-zinc-600">
              Create a project or generate AI assets to see activity here.
            </p>
          </div>
        ) : (
          activities.map((activity) => {
            const Icon = (activity.iconType && ICON_MAP[activity.iconType]) || Sparkles;

            return (
              <div
                key={activity.id}
                className="
                flex
                items-start
                gap-4
                "
              >
                {/* Icon */}
                <div
                  className="
                  flex
                  h-11
                  w-11
                  shrink-0
                  items-center
                  justify-center
                  rounded-2xl
                  border
                  border-white/10
                  bg-white/[0.04]
                  "
                >
                  <Icon
                    size={20}
                    className="text-white"
                  />
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="font-medium text-white">
                    {activity.title}
                  </h3>

                  <p className="mt-1 text-sm text-zinc-500">
                    {activity.description}
                  </p>
                </div>

                {/* Time */}
                <span className="text-xs text-zinc-600">
                  {activity.time}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}