import AnalyticsClient from "@/components/analytics/AnalyticsClient";

export const metadata = {
  title: "Analytics — BuilderOS",
  description: "Real-time analytics across all your projects, tasks, and AI activity",
};

export default function AnalyticsPage() {
  return <AnalyticsClient />;
}
