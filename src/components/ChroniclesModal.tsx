/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { ChronicleRecord } from "../types";
import { History, Milestone, Compass, Cpu, FileText, BarChart3, TrendingUp, AlertTriangle } from "lucide-react";

interface ChroniclesModalProps {
  isOpen: boolean;
  onClose: () => void;
  chronicles: ChronicleRecord[];
}

export default function ChroniclesModal({
  isOpen,
  onClose,
  chronicles
}: ChroniclesModalProps) {
  const [activeTab, setActiveTab] = useState<"history" | "summary">("history");

  if (!isOpen) return null;

  return (
    <div id="chronicles-timeline-view-overlay" className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in select-none text-slate-100">
      <div id="chronicles-modal-board" className="relative w-full max-w-2xl overflow-hidden border rounded-2xl bg-slate-950 border-indigo-500/30 shadow-2xl shadow-indigo-500/10 h-[80vh] flex flex-col">
        
        {/* Glow boarder accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-600 to-amber-500"></div>

        {/* Header with Custom Tabs Selector */}
        <div className="flex flex-col sm:flex-row items-center justify-between p-5 border-b bg-slate-950 border-slate-900 shrink-0 gap-4">
          <div className="flex items-center gap-4">
            <h2 className="flex items-center gap-2 text-[15px] font-extrabold tracking-widest text-transparent font-heading bg-gradient-to-r from-indigo-400 to-purple-200 bg-clip-text">
              <History className="w-5 h-5 text-indigo-400" />
              历史日志与生民总备录 (CHRONICLES & STATUS REPORT)
            </h2>
            
            {/* Nav Tabs */}
            <div className="flex border border-slate-900 rounded-lg overflow-hidden text-[10.5px] bg-slate-900/60 font-mono">
              <button 
                onClick={() => setActiveTab("history")}
                className={`px-3 py-1.2 font-extrabold transition-colors cursor-pointer ${activeTab === "history" ? "bg-indigo-500 text-white font-black" : "text-slate-400 hover:text-slate-200"}`}
              >
                历史日志
              </button>
              <button 
                onClick={() => setActiveTab("summary")}
                className={`px-3 py-1.2 font-extrabold transition-colors cursor-pointer ${activeTab === "summary" ? "bg-indigo-500 text-white font-black" : "text-slate-400 hover:text-slate-200"}`}
              >
                时空大/小总结
              </button>
            </div>
          </div>

          <button 
            id="quit-chronicles-top-close-btn"
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 transition-colors rounded-full text-slate-400 hover:text-rose-500 hover:bg-rose-500/10"
          >
            ✕
          </button>
        </div>

        {/* CORE CONTAINER */}
        <div className="p-6 overflow-y-auto flex-1 min-h-0 bg-slate-950">
          
          {/* TAB 1: HISTORISING CHRONICLE GRAPH */}
          {activeTab === "history" && (
            <div className="space-y-6">
              <p className="text-xs text-slate-450 leading-relaxed font-sans">
                此处记录了宿主在此历史模拟副本中所度过的光阴年华、颁布的核心大政、以及因果历史演化。
              </p>

              {chronicles.length === 0 ? (
                <div className="text-center text-slate-600 py-24 text-xs italic space-y-2 font-mono">
                  <Milestone className="w-8 h-8 text-slate-800 mx-auto animate-pulse" />
                  <div>暂无大衍纪事。请返回主阁推行决策以驱动命运前行。</div>
                </div>
              ) : (
                <div className="relative border-l border-indigo-500/20 pl-6 space-y-6 ml-2 text-xs font-mono">
                  {chronicles.map((rec) => (
                    <div key={rec.id} className="relative group">
                      {/* Bullet mark */}
                      <span className="absolute -left-[31px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-slate-950 border border-indigo-500 shadow-md group-hover:scale-110 transition-transform">
                        <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                      </span>

                      {/* Timeline Block Card */}
                      <div className="p-4 rounded-xl border border-slate-900 bg-slate-900/10 space-y-3 hover:border-indigo-500/20 hover:bg-slate-900/30 transition-all duration-200">
                        <div className="flex justify-between items-center text-[11px]">
                          <span className="font-extrabold text-indigo-400 tracking-wider">时轴: {rec.year}</span>
                          <span className="text-[9.5px] text-slate-600">{rec.timestamp}</span>
                        </div>

                        <div className="text-slate-150 leading-relaxed font-sans text-xs">
                          {rec.eventText}
                        </div>

                        {rec.playerDecision && (
                          <div className="p-2.5 rounded border-l-2 border-amber-500 bg-slate-950/80 text-[11px] text-slate-350">
                            <span className="text-amber-500 font-extrabold">宿主决裁:</span> {rec.playerDecision}
                          </div>
                        )}

                        <div className="text-[10px] text-emerald-400 flex items-center gap-1 pt-1.5 border-t border-slate-900/50">
                          <Compass className="w-3.5 h-3.5" />
                          <span>万象沙盒演变: {rec.impactDesc}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: POPULAR AFFAIRS SUMMARY LOG */}
          {activeTab === "summary" && (
            <div className="space-y-6 font-mono text-xs">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-900">
                <FileText className="w-4 h-4 text-indigo-400" />
                <span className="font-extrabold text-slate-300 uppercase tracking-widest text-[10.5px]">AI时空因果总评 (QUANTUM CHRONICLE SYNTHESIS)</span>
              </div>

              {chronicles.length === 0 ? (
                <div className="p-6 border border-slate-900 rounded-xl bg-slate-900/10 text-center text-slate-500 italic space-y-2">
                  <Cpu className="w-8 h-8 text-indigo-500/30 mx-auto animate-pulse" />
                  <div>暂无历史决议可供总结。大天演机正监听中，完成首个重大决策后即刻凝炼因果评估。</div>
                </div>
              ) : (
                <>
                  {/* Grand Summary (大总结) */}
                  <div className="p-4 border border-indigo-500/30 bg-indigo-950/20 rounded-xl space-y-3">
                    <h4 className="text-indigo-400 font-extrabold flex items-center gap-1.5 text-[11px] tracking-wider uppercase">
                      👑 AI时空宏观因子大总结 (Grand Timeline Synthesis)
                    </h4>
                    <p className="text-slate-200 leading-relaxed font-sans text-xs">
                      大天演机对宿主当前的乾坤重塑轨迹进行了深度复盘核验：当前时空重构已深度涉足 <b>{chronicles[0]?.chapter || "预定纪元"}</b> 节点。宿主累计推出决策 <b>{chronicles.length}</b> 次。从宏观推演模型来看，宿主的行事展现了强大的政治意志，通过这一系列在极高干涉力度下的重大决裁，有效撼动并重组了本模拟局势。本时空目前的宏观走向已脱离原有凡俗命运之轨，因果抗折性大增，时空稳定率处于 <b>{Math.min(100, 50 + chronicles.length * 6)}%</b> 的干涉变法良理常态。
                    </p>
                  </div>

                  {/* Small Summary (小总结) */}
                  <div className="p-4 border border-slate-900 bg-slate-900/20 rounded-xl space-y-3.5">
                    <h4 className="text-cyan-400 font-extrabold flex items-center gap-1.5 text-[11px] tracking-wider uppercase">
                      🎯 AI微观决议阶段小总结 (Micro Phase Evaluation / Bullet Summary)
                    </h4>
                    
                    <div className="space-y-3 text-[11.5px] leading-relaxed">
                      {/* Check if negative/ruthless tone applies based on events */}
                      {chronicles.some(c => c.playerDecision.includes("斩") || c.playerDecision.includes("杀") || c.playerDecision.includes("流放")) ? (
                        <div className="flex gap-2 items-start text-amber-300 font-sans">
                          <span className="text-amber-500 text-xs mt-0.5">●</span>
                          <div>
                            <b>威慑平叛强硬决裁</b>：微观操作手法偏向凌厉铁腕。数次杀伐斩决极其震慑朝野。这一决断短时间内有助于聚拢威势，消弭明面上的不臣；唯须当防怨怼深入深宅，演变为内部暗箭之失。
                          </div>
                        </div>
                      ) : (
                        <div className="flex gap-2 items-start text-emerald-350 font-sans">
                          <span className="text-emerald-500 text-xs mt-0.5">●</span>
                          <div>
                            <b>仁慈怀柔温和平衡</b>：决策倾向于仁柔平衡，注重拉拢群僚与抚平各省民情，并多予抚恤。虽然在安防社稷、调解争端上可获良性回馈，但也会导致国库压力突增，变法意志不够激进彻底。
                          </div>
                        </div>
                      )}

                      {/* Summarize last few decision impacts */}
                      <div className="border-t border-slate-900/50 pt-2.5 space-y-2 font-mono">
                        <span className="text-[10px] text-slate-500 uppercase block tracking-wider">最新因果演化印记：</span>
                        {chronicles.slice(-3).reverse().map((rec, idx) => (
                          <div key={rec.id} className="text-[10.5px] text-slate-400 flex items-start gap-1">
                            <span className="text-slate-600 font-bold">[{idx + 1}]</span>
                            <span>
                              在 <b className="text-slate-300">{rec.year}</b> 裁决之影响：
                              <span className="text-indigo-300 font-sans">{rec.impactDesc}</span>
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Quantum Warnings */}
                  <div className="p-4 border border-rose-500/15 bg-rose-500/5 rounded-xl space-y-1.5">
                    <h4 className="text-rose-450 font-extrabold flex items-center gap-1 text-[11px] uppercase tracking-wider">
                      ⚠️ 谶纬天书模型死结警告
                    </h4>
                    <p className="text-slate-300 leading-relaxed font-sans text-xs italic">
                      当前时空因果波形交叠，多项朝臣关系和全省民怨指标正受本次命运节点深度干涉。切忌在兵政与赋税两端反复横跳。微观上的局部折冲极易在大天演机量子推演下放大为系统性兵变！宿主须秉持“社稷为重，休养通商”的底物大行策略。
                    </p>
                  </div>
                </>
              )}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-slate-950 border-slate-950 flex justify-end shrink-0">
          <button 
            id="close-chronicles-modal-footer-btn"
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold rounded-lg border border-slate-800 bg-slate-900 hover:bg-slate-850 hover:text-white text-slate-400 transition-all cursor-pointer font-heading"
          >
            掩卷退息
          </button>
        </div>

      </div>
    </div>
  );
}
