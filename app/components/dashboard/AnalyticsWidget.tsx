import React from "react";
import Card from "../ui/Card";
interface AnalyticsWidgetProps {
  title: string;
  value: string | number;
  change?: {
    value: string | number;
    positive: boolean;
  };
  icon?: React.ReactNode;
  className?: string;
}
const AnalyticsWidget = ({
  title,
  value,
  change,
  icon,
  className = "",
}: AnalyticsWidgetProps) => {
  return (
    <Card
      className={`p-6 hover:border-gold/30 transition-all duration-300 ${className}`}
      hover={true}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-neutral-light/70 text-sm font-medium mb-1">
            {title}
          </h3>
          <div className="text-2xl font-montserrat font-bold text-neutral-light">
            {value}
          </div>
          {change && (
            <div
              className={`mt-2 text-sm flex items-center font-medium ${
                change.positive ? "text-green-400" : "text-red-400"
              }`}
            >
              <span className="mr-1 text-lg">
                {change.positive ? "↑" : "↓"}
              </span>
              <span>{change.value}</span>
              <span className="ml-1 text-neutral-light/50 text-xs">
                vs last period
              </span>
            </div>
          )}
        </div>
        {icon && (
          <div className="p-3 rounded-full bg-gold/10 text-[#D4AF37] shadow-lg shadow-gold/5">
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
};
export default AnalyticsWidget;
