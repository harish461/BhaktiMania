import React from "react";

interface DashboardErrorBannerProps {
  errors: Record<string, string | undefined>;
}

export function DashboardErrorBanner({ errors }: DashboardErrorBannerProps) {
  const activeErrors = Object.entries(errors)
    .filter(([, msg]) => Boolean(msg))
    .map(([section, msg]) => ({ section, msg: msg! }));

  if (activeErrors.length === 0) return null;

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 sm:p-5 text-amber-900 shadow-sm">
      <div className="flex items-start gap-3">
        <span className="text-xl shrink-0" aria-hidden="true">
          ⚠️
        </span>
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-amber-950">
            Some dashboard data could not be retrieved
          </h3>
          <p className="text-xs text-amber-800 leading-relaxed">
            The database connection experienced a temporary delay. The rest of the dashboard remains operational.
          </p>
          <ul className="text-xs text-amber-900/80 list-disc list-inside space-y-0.5 pt-1">
            {activeErrors.map(({ section, msg }) => (
              <li key={section}>{msg}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
