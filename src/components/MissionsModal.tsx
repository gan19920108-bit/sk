/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Mission } from "../types";
import { ListTodo, Award, CheckCircle2, Circle, Play, Sparkles, XCircle, AlertCircle } from "lucide-react";

interface MissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  missions: Mission[];
  onClaimMission: (missionId: string) => void;
  onAbandonMission?: (missionId: string) => void;
  onManualSubmitMission?: (missionId: string) => void;
}

export default function MissionsModal({
  isOpen,
  onClose,
  missions,
  onClaimMission,
  onAbandonMission,
  onManualSubmitMission
}: MissionsModalProps) {
  const [activeTab, setActiveTab] = useState<"incomplete" | "completed">("incomplete");
  const [selectedMissionId, setSelectedMissionId] = useState<string | null>(null);
  
  // Local warning indicator state
  const [submitWarning, setSubmitWarning] = useState<string | null>(null);

  if (!isOpen) return null;

  const filteredMissions = missions.filter((m) => {
    if (activeTab === "incomplete") {
      return !m.completed;
    } else {
      return m.completed;
    }
  });

  const activeMissions = filteredMissions;
  const selectedMission = activeMissions.find(m => m.id === selectedMissionId) || activeMissions[0];

  const handleManualSubmit = () => {
    if (!selectedMission) return;
    setSubmitWarning(null);

    if (selectedMission.progress < selectedMission.targetValue) {
      setSubmitWarning(`‼️ 目前数值为 [${selectedMission.progress}/${selectedMission.targetValue}] 不足交付契约指标要求！`);
      setTimeout(() => setSubmitWarning(null), 3500);
      return;
    }

    if (onManualSubmitMission) {
      onManualSubmitMission(selectedMission.id);
    }
  };

  const handleAbandon = () => {
    if (!selectedMission) return;
    if (confirm(`‼️ 确定要断绝并丢弃极宿天演因果法旨 【${selectedMission.title}】 吗？放弃后此世无法再度接引。`)) {
      if (onAbandonMission) {
        onAbandonMission(selectedMission.id);
        setSelectedMissionId(null);
      }
    }
  };

  return (
    <div id="missions-board-view-overlay" className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in select-none text-slate-100">
      <div id="missions-modal-board" className="relative w-full max-w-4xl overflow-hidden border rounded-2xl bg-slate-950 border-amber-500/30 shadow-2xl shadow-yellow-500/10 flex flex-col h-[75vh]">
        
        {/* Decorative lines */}
        <div className="absolute inset-0 pointer-events-none opacity-5 bg-linear-to-b from-yellow-500/10 to-transparent"></div>
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-amber-400 to-emerald-500"></div>

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b bg-slate-950 border-slate-900 shrink-0">
          <h2 className="flex items-center gap-2 text-base font-extrabold tracking-widest text-transparent font-heading bg-gradient-to-r from-amber-400 to-yellow-250 bg-clip-text">
            <ListTodo className="w-5 h-5 text-amber-500" />
            天演世相因果契约阁 (MISSIONS BOARD)
          </h2>
          <button 
            id="quit-missions-top-btn"
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 transition-colors rounded-full text-slate-400 hover:text-rose-500 hover:bg-rose-500/10"
          >
            ✕
          </button>
        </div>

        {/* Tab switcher */}
        <div className="p-4 bg-slate-900/40 border-b border-slate-900 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 shrink-0">
          <p className="text-xs text-slate-500 font-mono">
            TIMELINE CHALLENGES // 执行时空纪行规诰，获取天命金币与重装物资奖励。
          </p>
          
          <div className="flex bg-slate-950 border border-slate-900 p-1 rounded-xl font-mono text-[10.5px]">
            <button
              onClick={() => {
                setActiveTab("incomplete");
                setSelectedMissionId(null);
                setSubmitWarning(null);
              }}
              className={`px-4 py-1.5 rounded-lg font-bold transition-all duration-200 cursor-pointer ${activeTab === "incomplete" ? "bg-amber-500 text-black shadow-md" : "text-slate-400 hover:text-slate-200"}`}
            >
              修行中法旨 ({missions.filter(m => !m.completed).length})
            </button>
            <button
              onClick={() => {
                setActiveTab("completed");
                setSelectedMissionId(null);
                setSubmitWarning(null);
              }}
              className={`px-4 py-1.5 rounded-lg font-bold transition-all duration-200 cursor-pointer ${activeTab === "completed" ? "bg-emerald-500 text-black shadow-md" : "text-slate-400 hover:text-slate-200"}`}
            >
              功成圆满 ({missions.filter(m => m.completed).length})
            </button>
          </div>
        </div>

        {/* Dynamic Inner Split */}
        <div className="flex-grow flex min-h-0 overflow-hidden bg-slate-950">
          
          {/* Left panel index */}
          <div className="w-1/3 border-r border-slate-900 overflow-y-auto p-4 space-y-2 shrink-0">
            {activeMissions.length === 0 ? (
              <div className="text-center py-24 text-slate-600 italic text-xs font-mono">
                此契约品类下无对应法旨。
              </div>
            ) : (
              activeMissions.map((m) => {
                const isSelected = selectedMission?.id === m.id;
                const percent = Math.min(100, Math.floor((m.progress / m.targetValue) * 100));
                
                return (
                  <button
                    key={m.id}
                    onClick={() => {
                      setSelectedMissionId(m.id);
                      setSubmitWarning(null);
                    }}
                    className={`w-full p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col gap-1.5 ${isSelected ? "bg-amber-500/10 border-amber-500 shadow-sm" : "bg-slate-900/15 border-slate-900 hover:border-slate-800"}`}
                  >
                    <div className="flex items-center justify-between gap-1 w-full text-xs font-mono">
                      <span className="font-extrabold text-slate-200 truncate flex-1 leading-none">{m.title}</span>
                      <span className="text-[8px] px-1 py-0.2 bg-slate-950 border border-slate-900 rounded-sm text-slate-400 shrink-0 uppercase font-bold">{m.type}</span>
                    </div>

                    <div className="flex items-center justify-between text-[9px] text-slate-500 w-full font-mono mt-1">
                      <span>因果满足分值:</span>
                      <span className={m.completed ? "text-emerald-400 font-bold" : "text-amber-500 font-bold"}>
                        {m.completed ? "已完成" : `${percent}%`}
                      </span>
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Right panel details */}
          <div className="flex-grow overflow-y-auto p-6 relative bg-slate-950/20">
            {selectedMission ? (
              <div className="h-full flex flex-col justify-between">
                
                {/* Content Block */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-900 pb-3 font-mono">
                    <div className="space-y-1">
                      <span className="text-[9px] text-slate-500 uppercase">Mission specifications // 法旨契言</span>
                      <h3 className="text-base font-extrabold text-slate-100 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                        {selectedMission.title}
                      </h3>
                    </div>
                    <span className="px-3 py-1 bg-amber-500/5 border border-amber-500/20 text-amber-400 text-[10px] rounded-full font-bold">
                      {selectedMission.type}
                    </span>
                  </div>

                  {/* Context Narrative */}
                  <div className="p-4 border border-slate-900 bg-slate-900/10 rounded-2xl text-xs text-slate-350 leading-relaxed font-sans">
                    <span className="font-bold text-slate-500 block pb-1 border-b border-slate-950 mb-2 font-mono text-[10px]">【天命规诰誓词】</span>
                    <p className="italic">{selectedMission.desc}</p>
                  </div>

                  {/* Objective gauge */}
                  <div className="p-4 border border-slate-900 bg-slate-950 rounded-2xl space-y-3 font-mono text-xs">
                    <div className="flex justify-between items-center text-[10.5px]">
                      <span className="text-slate-500">时相满足指标进度:</span>
                      <b className="text-amber-400">
                        {selectedMission.progress} / {selectedMission.targetValue}
                      </b>
                    </div>

                    <div className="h-2 rounded-full bg-slate-900 overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-amber-500 via-amber-450 to-emerald-400 transition-all duration-300 shadow-md shadow-amber-500/25"
                        style={{ width: `${Math.min(100, (selectedMission.progress / selectedMission.targetValue) * 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Rewards */}
                  <div className="p-4 border border-emerald-500/15 bg-emerald-500/5 rounded-2xl flex items-center gap-3 font-mono">
                    <div className="w-9 h-9 rounded-xl border border-emerald-500/20 bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
                      <Award className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <span className="text-[9px] text-slate-500 block">REWARDS MATRIX // 功德福赐奖励</span>
                      <span className="text-xs font-bold text-emerald-300 block">{selectedMission.rewardDesc}</span>
                    </div>
                  </div>

                  {/* Failure Penalty */}
                  <div className="p-4 border border-rose-500/15 bg-rose-500/5 rounded-2xl flex items-center gap-3 font-mono">
                    <div className="w-9 h-9 rounded-xl border border-rose-500/20 bg-rose-500/10 flex items-center justify-center text-rose-455 shrink-0">
                      <XCircle className="w-4 h-4 text-rose-400" />
                    </div>
                    <div className="flex-1">
                      <span className="text-[9px] text-slate-500 block">FAILURE PENALTY // 时相失控惩罚</span>
                      <span className="text-xs font-bold text-rose-400 block p-0">
                        {selectedMission.penaltyDesc || "国祚气数重置衰退，该省治安严重失控，诱发不可撤回的乾坤崩坏天谴后果。"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Handlers and submits */}
                <div className="pt-4 border-t border-slate-950 space-y-3 font-heading">
                  {/* Warning overlay if submit fails */}
                  {submitWarning && (
                    <div className="p-2.5 bg-rose-500/10 border border-rose-500/25 rounded-xl text-[10px] text-rose-400 flex items-center gap-1.5 font-mono">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{submitWarning}</span>
                    </div>
                  )}

                  {selectedMission.claimed ? (
                    <div className="w-full py-3 bg-slate-900/15 border border-slate-950 text-slate-650 rounded-xl text-center text-xs font-extrabold flex items-center justify-center gap-1">
                      <CheckCircle2 className="w-4 h-4 text-slate-800" />
                      该契约法旨福赐已入库领毕，因果平息
                    </div>
                  ) : selectedMission.completed ? (
                    <button
                      onClick={() => onClaimMission(selectedMission.id)}
                      className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-400 text-black font-extrabold tracking-widest rounded-xl text-[10.5px] hover:brightness-110 shadow-lg active:scale-97 transition-all flex items-center justify-center gap-1 cursor-pointer animate-pulse"
                    >
                      <Award className="w-4.5 h-4.5" />
                      <span>领取天演对现封赏 ➔</span>
                    </button>
                  ) : (
                    <div className="grid grid-cols-2 gap-3 pb-1">
                      {/* Manual Submit button */}
                      <button
                        onClick={handleManualSubmit}
                        className="py-2.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-yellow-400 text-black font-extrabold rounded-xl text-xs text-center cursor-pointer transition-all active:scale-95 shadow-md flex items-center justify-center gap-1"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>手动交付契理</span>
                      </button>

                      {/* Abandon Task button */}
                      <button
                        onClick={handleAbandon}
                        className="py-2.5 bg-slate-900 border border-slate-850 hover:border-rose-505 text-slate-400 hover:text-rose-400 text-xs font-extrabold rounded-xl transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>中止放弃契诺</span>
                      </button>
                    </div>
                  )}
                </div>

              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-2 py-12">
                <Circle className="w-8 h-8 text-slate-800 animate-pulse" />
                <div className="text-xs text-slate-500 font-mono">请在左侧点选一个神印要领法旨。</div>
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-slate-950 border-slate-900 flex justify-end shrink-0">
          <button 
            id="close-missions-footer-btn"
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold rounded-lg border border-slate-800 bg-slate-900 hover:bg-slate-850 hover:text-white text-slate-400 transition-colors cursor-pointer font-heading"
          >
            收起契录
          </button>
        </div>

      </div>
    </div>
  );
}
