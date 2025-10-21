import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

interface StatCardProps {
  icon: LucideIcon;
  title: string;
  value: string;
  trend?: string;
  color?: "primary" | "accent" | "secondary" | "success";
}

export const StatCard = ({ icon: Icon, title, value, trend, color = "primary" }: StatCardProps) => {
  const colorClasses = {
    primary: "bg-primary/10 text-primary",
    accent: "bg-accent/10 text-accent",
    secondary: "bg-secondary/10 text-secondary-foreground",
    success: "bg-success/10 text-success",
  };

  return (
    <Card className="p-6 shadow-custom-md hover:shadow-custom-lg transition-smooth gradient-card">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-12 h-12 rounded-xl ${colorClasses[color]} flex items-center justify-center`}>
          <Icon className="w-6 h-6" />
        </div>
        {trend && (
          <span className="text-xs font-medium text-success bg-success/10 px-2 py-1 rounded">
            {trend}
          </span>
        )}
      </div>
      <p className="text-sm text-muted-foreground mb-1">{title}</p>
      <p className="text-2xl font-bold text-foreground">{value}</p>
    </Card>
  );
};
