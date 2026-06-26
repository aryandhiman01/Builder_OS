import Link from "next/link";

import {
  Sparkles,
  FolderKanban,
  CheckCircle2,
  Brain,
  ArrowRight,
} from "lucide-react";

const activities = [
  {
    id: 1,
    title: "Created a new project",
    description: "Food Delivery Platform",
    time: "10 minutes ago",
    icon: FolderKanban,
  },

  {
    id: 2,
    title: "AI generated roadmap",
    description: "BuilderOS Product Roadmap",
    time: "1 hour ago",
    icon: Brain,
  },

  {
    id: 3,
    title: "Completed a task",
    description: "Authentication Module",
    time: "Yesterday",
    icon: CheckCircle2,
  },

  {
    id: 4,
    title: "Generated AI Research",
    description: "Competitor Analysis",
    time: "2 days ago",
    icon: Sparkles,
  },
];

export default function RecentActivity() {
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
          href="/activity"
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

        {activities.map((activity) => {
          const Icon = activity.icon;

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
        })}

      </div>
    </div>
  );
}