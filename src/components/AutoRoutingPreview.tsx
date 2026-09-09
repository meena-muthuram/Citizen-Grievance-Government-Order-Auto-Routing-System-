import React, { useMemo } from 'react';
import { routeTextToDepartments, DEPARTMENTS } from '../data/departmentsAndKeywords';
import { DepartmentId, KeywordMapping } from '../types';
import {
  Hammer,
  Droplets,
  Zap,
  Activity,
  Trash2,
  ShieldAlert,
  GraduationCap,
  FileText,
  Bus,
  Flame,
  CheckCircle2,
  Share2,
  AlertCircle,
  Tag,
  Clock,
  Sparkles,
} from 'lucide-react';

interface AutoRoutingPreviewProps {
  text: string;
  keywordsDatabase?: KeywordMapping[];
  mode?: 'compact' | 'full';
}

const DEPT_ICONS: Record<DepartmentId, React.ReactNode> = {
  PWD: <Hammer className="w-4 h-4" />,
  WATER: <Droplets className="w-4 h-4" />,
  ELECTRICITY: <Zap className="w-4 h-4" />,
  HEALTH: <Activity className="w-4 h-4" />,
  MUNICIPAL: <Trash2 className="w-4 h-4" />,
  POLICE: <ShieldAlert className="w-4 h-4" />,
  EDUCATION: <GraduationCap className="w-4 h-4" />,
  REVENUE: <FileText className="w-4 h-4" />,
  TRANSPORT: <Bus className="w-4 h-4" />,
  FIRE: <Flame className="w-4 h-4" />,
};

export const AutoRoutingPreview: React.FC<AutoRoutingPreviewProps> = ({
  text,
  keywordsDatabase,
  mode = 'full',
}) => {
  const routed = useMemo(() => {
    return routeTextToDepartments(text, keywordsDatabase);
  }, [text, keywordsDatabase]);

  const departmentsMap = useMemo(() => {
    return new Map(DEPARTMENTS.map((d) => [d.id, d]));
  }, []);

  return (
    <div className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm transition-all duration-200">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-stone-100">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            <Share2 className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
              Live Auto-Routing Preview
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <Sparkles className="w-3 h-3 text-emerald-600" />
                Active Scanner
              </span>
            </h4>
            <p className="text-xs text-stone-500">
              Scans 80+ keywords across 10 government departments in real-time
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs font-semibold text-stone-600">
            {routed.length === 0 ? (
              <span className="text-stone-400">Waiting for text...</span>
            ) : (
              <span className="text-emerald-700 font-bold">
                {routed.length} Department{routed.length > 1 ? 's' : ''} Matched
              </span>
            )}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="mt-3">
        {routed.length === 0 ? (
          <div className="py-4 px-3 bg-stone-50 rounded-lg border border-dashed border-stone-200 text-center">
            <AlertCircle className="w-5 h-5 text-stone-400 mx-auto mb-1.5" />
            <p className="text-xs font-medium text-stone-600">
              Type issues above to trigger live multi-department routing
            </p>
            <div className="mt-2 flex flex-wrap justify-center gap-1.5">
              <span className="text-[11px] px-2 py-0.5 rounded-md bg-stone-100 text-stone-500">
                Try: &quot;pothole and broken streetlight&quot;
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-md bg-stone-100 text-stone-500">
                &quot;garbage piling up and sewage leak&quot;
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-md bg-stone-100 text-stone-500">
                &quot;water tanker and school building&quot;
              </span>
            </div>
          </div>
        ) : (
          <div className="space-y-2.5">
            <div className="text-xs font-semibold text-stone-700 flex items-center justify-between">
              <span>This submission will automatically split and dispatch to:</span>
              <span className="text-[11px] text-stone-500">Simultaneous Multi-Routing</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {routed.map((item) => {
                const dept = departmentsMap.get(item.departmentId);
                if (!dept) return null;

                return (
                  <div
                    key={item.departmentId}
                    className={`rounded-lg border p-3 transition-all ${dept.bgColor} ${dept.borderColor}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        <div
                          className={`p-1.5 rounded-md bg-white shadow-xs ${dept.color}`}
                        >
                          {DEPT_ICONS[dept.id]}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-stone-900 leading-tight">
                            {dept.name}
                          </div>
                          <div className="text-[11px] text-stone-500 font-medium">
                            {dept.hindiName}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-white/80 px-2 py-0.5 rounded border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Routed
                      </div>
                    </div>

                    {/* Matched Keywords */}
                    <div className="mt-2.5 pt-2 border-t border-stone-200/60">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-1 flex items-center gap-1">
                        <Tag className="w-3 h-3 text-stone-400" />
                        Matched Keyword Triggers ({item.matchedKeywords.length}):
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {item.matchedKeywords.map((kw, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-white text-stone-800 border border-stone-300 shadow-2xs"
                          >
                            &quot;{kw}&quot;
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Department SLA & Contact */}
                    {mode === 'full' && (
                      <div className="mt-2 flex items-center justify-between text-[11px] text-stone-600 pt-1.5 border-t border-stone-200/50">
                        <span className="flex items-center gap-1 text-stone-500">
                          <Clock className="w-3 h-3 text-stone-400" />
                          Default SLA: <strong>{dept.slaDefaultHours}h</strong>
                        </span>
                        <span className="text-[10px] text-stone-500 font-mono">
                          {dept.headOfficer.split(',')[0]}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
