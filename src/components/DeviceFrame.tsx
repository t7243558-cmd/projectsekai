import React from 'react';
import { Wifi, Battery, Signal, Sparkles } from 'lucide-react';

interface DeviceFrameProps {
  deviceView: 'DESKTOP' | 'MOBILE_IOS' | 'MOBILE_ANDROID';
  children: React.ReactNode;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({ deviceView, children }) => {
  if (deviceView === 'DESKTOP') {
    return <>{children}</>;
  }

  const isIos = deviceView === 'MOBILE_IOS';

  return (
    <div className="flex flex-col items-center justify-center py-4">
      {/* Device Switcher Hint */}
      <div className="mb-3 text-xs text-slate-500 flex items-center gap-1.5">
        <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
        <span>
          กำลังจำลองมุมมองหน้าจอมือถือ: <strong>{isIos ? 'Apple iOS (iPhone 16 Pro)' : 'Google Android (Pixel Material 3)'}</strong>
        </span>
      </div>

      {/* Outer Phone Shell */}
      <div className={`w-full max-w-[420px] bg-slate-900 rounded-[50px] p-3 shadow-2xl border-4 ${
        isIos ? 'border-slate-800' : 'border-slate-700'
      }`}>
        {/* Screen Inner */}
        <div className="bg-slate-50 w-full min-h-[780px] max-h-[840px] overflow-y-auto rounded-[38px] relative flex flex-col">
          
          {/* Status Bar */}
          <div className="sticky top-0 z-40 bg-slate-50/90 backdrop-blur px-6 pt-3 pb-2 flex items-center justify-between text-xs font-semibold text-slate-900 border-b border-slate-100">
            <span>09:41</span>
            
            {/* Dynamic Island if iOS */}
            {isIos && (
              <div className="w-24 h-5 bg-black rounded-full mx-auto shadow-xs flex items-center justify-end px-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
            )}

            <div className="flex items-center gap-1.5 text-slate-700">
              <Signal className="w-3.5 h-3.5" />
              <Wifi className="w-3.5 h-3.5" />
              <Battery className="w-4 h-4" />
            </div>
          </div>

          {/* Child Feed Content */}
          <div className="p-4 flex-1">
            {children}
          </div>

          {/* Home Indicator Bar */}
          <div className="sticky bottom-0 bg-slate-50/80 backdrop-blur py-2 flex justify-center border-t border-slate-100">
            <div className="w-32 h-1 bg-slate-400 rounded-full" />
          </div>

        </div>
      </div>
    </div>
  );
};
