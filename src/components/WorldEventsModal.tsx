/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { WorldEvent } from "../types";
import { Earth, ShieldAlert, Sparkles, AlertTriangle, CloudRain, Flame, Bell, MapPin, Milestone } from "lucide-react";

interface WorldEventsModalProps {
  isOpen: boolean;
  onClose: () => void;
  events: WorldEvent[];
}

interface SandboxNews {
  id: string;
  category: "军武" | "官廷" | "江湖" | "外荒";
  title: string;
  context: string;
  severity: "常规" | "警戒" | "宏大";
}

export default function WorldEventsModal({
  isOpen,
  onClose,
  events
}: WorldEventsModalProps) {
  // Atmospheric world news bulletins representing macro simulated details
  const [sandboxNews] = useState<SandboxNews[]>([
    { id: "news_1", category: "军武", title: "山海总兵吴三桂校阅关宁铁骑", context: "宁远军民备边。清军哨骑探路喜峰口，吴三桂按兵不动，向崇祯索要饷银十万两银叶。", severity: "常规" },
    { id: "news_2", category: "官廷", title: "凤阳祖陵惊现野狐啼哭", context: "守陵军宣称暴雨中听闻陵地古道下隐有长号，言极不祥，百官私议大帝天数有变。", severity: "警戒" },
    { id: "news_3", category: "军武", title: "白杆巾帼秦良玉誓师据守夔门", context: "四川流民复炽，秦良玉率三千石砫儿女修筑连环坞，誓保蜀中命门。献王八大王屡攻不遂。", severity: "宏大" },
    { id: "news_4", category: "江湖", title: "江北运河漕兵拦截漕运粮舟", context: "漕运拖欠饷米半年之久，上千漕工绝食静坐通州。南北商客行期延误，江南盐引大跌。", severity: "常规" },
    { id: "news_5", category: "外荒", title: "西洋利玛窦门派精研大炮红夷", context: "西洋教士传授汤若望等精射红衣火器大阵，声称若肯出资二千两白银，可试射三尊攻城神机。", severity: "常规" },
    { id: "news_6", category: "官廷", title: "南京督堂大掠民财遭群情弹劾", context: "南京户部被指结党私分太仓储备。言官清流朱大典上疏痛陈。神州大厦隐有梁摧之兆。", severity: "警戒" }
  ]);

  if (!isOpen) return null;

  const getSeverityBadge = (sev: string) => {
    switch(sev) {
      case "毁灭性": return "bg-rose-500/10 border-rose-500/20 text-rose-400 animate-pulse font-bold";
      case "严峻": return "bg-orange-500/10 border-orange-500/20 text-orange-400 font-semibold";
      case "祥瑞": return "bg-amber-500/10 border-amber-500/20 text-amber-300 font-bold flex items-center gap-1";
      default: return "bg-slate-800 border-slate-700 text-slate-400";
    }
  };

  const getNewsBadgeColor = (cat: string) => {
    switch (cat) {
      case "军武": return "text-orange-400 border-orange-500/20 bg-orange-500/5";
      case "官廷": return "text-rose-400 border-rose-500/20 bg-rose-500/5";
      case "外荒": return "text-cyan-400 border-cyan-500/20 bg-cyan-500/5";
      default: return "text-slate-400 border-slate-800 bg-slate-905";
    }
  };

  return (
    <div id="world-events-view-overlay" className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in select-none text-slate-100">
      <div id="world-events-modal-card" className="relative w-full max-w-4xl overflow-hidden border rounded-2xl bg-slate-950 border-emerald-500/30 shadow-2xl shadow-emerald-500/10 h-[75vh] flex flex-col">
        
        {/* Glow boarder accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500"></div>

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b bg-slate-950 border-slate-900 shrink-0">
          <h2 className="flex items-center gap-2 text-base font-extrabold tracking-widest text-transparent font-heading bg-gradient-to-r from-emerald-400 to-cyan-200 bg-clip-text">
            <Earth className="w-5 h-5 text-emerald-400 animate-spin" style={{ animationDuration: "20s" }} />
            时空中枢线剧变与天机异动 (WORLD EVENTS PANORAMA)
          </h2>
          <button 
            id="quit-events-top-btn"
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 transition-colors rounded-full text-slate-400 hover:text-rose-500 hover:bg-rose-500/10"
          >
            ✕
          </button>
        </div>

        {/* Workspace descriptor */}
        <p className="px-6 pt-4 text-[11px] text-slate-500 leading-relaxed shrink-0">
          观察眼通：左侧呈现天道运转的大荒各处群豪简报；右侧呈列当前因果沙盒内正在发生的微观危机事件（将会直接改变税赋及安稳度指数）。
        </p>

        {/* MAIN BODY: LEFT COLUMN (BULLETINS), RIGHT COLUMN (PARALLEL TIMELINES) */}
        <div className="flex-grow flex flex-col md:flex-row min-h-0 overflow-hidden px-6 pb-5 pt-3 bg-slate-950 gap-5">
          
          {/* LEFT COLUMN: 大荒简讯 (Sandbox news) */}
          <div className="w-full md:w-1/2 overflow-y-auto space-y-3 border-r border-slate-900 pr-5 select-none shrink-0">
            <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider font-mono pb-2 border-b border-slate-950 block flex items-center gap-1.5 text-orange-400">
              <Bell className="w-3.5 h-3.5 text-orange-400 animate-bounce" />
              天下大荒风物简讯 (Macro Bulletins)
            </span>

            <div className="space-y-3">
              {sandboxNews.map((news) => (
                <div 
                  key={news.id}
                  className="p-3 border rounded-xl border-slate-900 bg-slate-900/10 flex flex-col gap-2 hover:border-slate-800 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2 items-center">
                      <span className={`text-[9px] px-1.5 py-0.2 border rounded-md font-mono font-bold ${getNewsBadgeColor(news.category)}`}>
                        {news.category}
                      </span>
                      <span className="text-xs font-bold text-slate-200 leading-tight">{news.title}</span>
                    </div>
                    {news.severity === "宏大" && (
                      <span className="text-[8px] bg-amber-500/10 border border-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded-xs font-mono font-bold">国史</span>
                    )}
                  </div>
                  <p className="text-[10.5px] text-slate-450 leading-relaxed font-sans">{news.context}</p>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN: 并列时空灾防 (Active simulated events) */}
          <div className="flex-grow overflow-y-auto space-y-3">
            <span className="text-[10px] text-zinc-400 font-extrabold uppercase tracking-wider font-mono pb-2 border-b border-slate-950 block flex items-center gap-1.5 text-cyan-400">
              <Milestone className="w-3.5 h-3.5 text-cyan-400" />
              并列因果天数灾害 (Chronicle Hazards)
            </span>

            {events.length === 0 ? (
              <div className="text-center text-slate-650 py-24 text-xs italic font-mono">
                四海无惊。当前因果时空内并无天火流散灾咎。
              </div>
            ) : (
              <div className="space-y-3 font-mono">
                {events.map((ev) => (
                  <div 
                    key={ev.id}
                    className="p-3.5 border rounded-xl border-slate-900 bg-slate-900/10 flex flex-col gap-2 hover:border-slate-800 transition-colors"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-1 text-[11px]">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-slate-150">{ev.title}</span>
                        <span className={`text-[8.5px] px-1.5 py-0.2 rounded border font-extrabold ${getSeverityBadge(ev.severity)}`}>
                          {ev.severity}
                        </span>
                      </div>
                      <span className="text-[9.5px] text-slate-550 flex items-center gap-0.5">
                        <MapPin className="w-3 h-3 text-slate-605" />
                        {ev.location}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-400 leading-relaxed font-sans">{ev.desc}</p>

                    <div className="flex justify-between items-center text-[9px] text-slate-500 pt-2 border-t border-slate-950/40">
                      <span>天界折损机制: 主动化解或任其腐化</span>
                      {ev.durationLeft > 0 ? (
                        <span className="text-amber-500 font-bold shrink-0">倒卷耗损: {ev.durationLeft} 回合</span>
                      ) : (
                        <span className="text-emerald-400 font-bold shrink-0">已归平息态</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-slate-950 border-slate-950 flex justify-end shrink-0">
          <button 
            id="close-events-modal-footer-btn"
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold rounded-lg border border-slate-800 bg-slate-900 hover:bg-slate-850 hover:text-white text-slate-400 transition-colors cursor-pointer font-heading"
          >
            回避天机
          </button>
        </div>

      </div>
    </div>
  );
}
