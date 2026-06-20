/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Province, PlayerAttributes } from "../types";
import { 
  LayoutDashboard, Crown, Coins, Sprout, Shield, AlertTriangle, 
  ArrowUpRight, ArrowDownRight, Users2, ShieldAlert
} from "lucide-react";

interface OverviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  attributes: PlayerAttributes;
  provinces: Province[];
  gold: number;
}

export default function OverviewModal({
  isOpen,
  onClose,
  attributes,
  provinces,
  gold
}: OverviewModalProps) {
  if (!isOpen) return null;

  // Calculators grounded in simulator variables
  const fortune = Math.min(100, Math.max(10, attributes.emperorPrestige * 2 + 15));
  
  const avgUnrest = Math.floor(provinces.reduce((sum, p) => sum + (p.unrest || 0), 0) / (provinces.length || 1));
  const popularity = 100 - avgUnrest;

  const grain = gold * 18 + 48000;

  // Available Military Force calculation: based on state strength & provinces average defensive level
  const avgDefense = Math.floor(provinces.reduce((sum, p) => sum + (p.defenseLevel || 0), 0) / (provinces.length || 1));
  const totalMilitary = (avgDefense * 1400) + (attributes.strength * 250) + 25000;

  // Corruption level: higher charisma & prestige suppress corruption, lower intelligence increases it
  const corruptionLevel = Math.max(5, Math.min(98, Math.floor(82 - attributes.emperorPrestige * 0.8 - attributes.intelligence * 0.3)));

  // Cashflows for treasury
  const goldIncome = 350;
  const goldExpense = 130;
  const goldNet = goldIncome - goldExpense;

  // Cashflows for food reserves
  const grainIncome = 6300;
  const grainExpense = 2340;
  const grainNet = grainIncome - grainExpense;

  // Status assessments
  const getFortuneStatus = (val: number) => {
    if (val >= 80) return { label: "天命昭彰 · 宗社鼎盛", color: "text-amber-400" };
    if (val >= 50) return { label: "中兴维艰 · 因果摇曳", color: "text-yellow-400" };
    return { label: "社稷垂败 · 倾覆在即", color: "text-rose-400 font-bold" };
  };

  const getPopularityStatus = (val: number) => {
    if (val >= 70) return { label: "黎庶歌功 · 万民怀恩", color: "text-emerald-400" };
    if (val >= 40) return { label: "怨愤渐积 · 百姓蹙额", color: "text-orange-400" };
    return { label: "赤地千里 · 揭竿易子", color: "text-rose-455 font-bold animate-pulse" };
  };

  const getCorruptionStatus = (val: number) => {
    if (val <= 25) return { label: "纲纪肃然 · 吏治清白", color: "text-emerald-400" };
    if (val <= 55) return { label: "因循守旧 · 中饱私囊", color: "text-amber-400" };
    return { label: "贿赂公行 · 卖官鬻爵", color: "text-rose-400 font-bold" };
  };

  const fortuneStatus = getFortuneStatus(fortune);
  const popularityStatus = getPopularityStatus(popularity);
  const corruptionStatus = getCorruptionStatus(corruptionLevel);

  return (
    <div id="game-overview-modal-overlay" className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in select-none text-slate-100">
      <div id="game-overview-modal-board" className="relative w-full max-w-4xl overflow-hidden border rounded-2xl bg-slate-950 border-amber-500/30 shadow-2xl shadow-amber-500/10 h-[85vh] flex flex-col">
        
        {/* Glow border decorative line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-indigo-600 to-emerald-500"></div>

        {/* Header Block */}
        <div className="flex items-center justify-between p-5 border-b bg-slate-950 border-slate-900 shrink-0">
          <div className="flex items-center gap-3">
            <LayoutDashboard className="w-5 h-5 text-amber-500" />
            <h2 className="text-[15px] font-extrabold tracking-widest text-transparent font-heading bg-gradient-to-r from-amber-400 via-amber-200 to-indigo-300 bg-clip-text">
              大德社稷全局总览 (DYNASTY POWER GRID STATUS)
            </h2>
          </div>
          <button 
            id="overview-top-close-btn"
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 transition-colors rounded-full text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 cursor-pointer font-sans"
          >
            ✕
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto flex-1 min-h-0 bg-slate-950 space-y-6 scrollbar-thin">
          
          <p className="text-xs text-slate-400 leading-relaxed font-mono">
            提示：此处是由天演量子星系核心总线算力映射的朝堂全局指标。每一项指标均实时受到您在各省份的施政、和百官交互以及在特殊因果节点中下达圣旨的决断影响。
          </p>

          {/* KPI Dashboard grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* 1. 国祚气数 (国运) */}
            <div className="p-4 border border-slate-850 bg-slate-900/10 rounded-2xl space-y-3 font-mono">
              <div className="flex justify-between items-center">
                <span className="text-[12px] font-bold text-slate-300 flex items-center gap-1.5ClassName">
                  <Crown className="w-4 h-4 text-amber-500" />
                  国祚气数 (国运)
                </span>
                <span className="text-[10px] text-slate-500">【极权核心】</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold tracking-tight text-amber-400">{fortune}</span>
                <span className="text-slate-500 text-xs">/ 100</span>
              </div>
              <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-amber-600 to-amber-400 transition-all duration-505" 
                  style={{ width: `${fortune}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">社稷命途:</span>
                <span className={fortuneStatus.color}>{fortuneStatus.label}</span>
              </div>
            </div>

            {/* 2. 民心怨怒 (民心) */}
            <div className="p-4 border border-slate-850 bg-slate-900/10 rounded-2xl space-y-3 font-mono">
              <div className="flex justify-between items-center">
                <span className="text-[12px] font-bold text-slate-300 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-rose-450" />
                  生民拥戴 (民心)
                </span>
                <span className="text-[10px] text-slate-500">【黎庶宿命】</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold tracking-tight text-emerald-400">{popularity}%</span>
                <span className="text-slate-500 text-xs">(反衬民怨: {avgUnrest}%)</span>
              </div>
              <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 transition-all duration-505" 
                  style={{ width: `${popularity}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">世俗民意:</span>
                <span className={popularityStatus.color}>{popularityStatus.label}</span>
              </div>
            </div>

            {/* 3. 大定国库 (国库) - Shows Revenue/Expenses */}
            <div className="p-5 border border-slate-850 bg-slate-905/30 rounded-2xl flex flex-col justify-between font-mono space-y-3.5">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[12px] font-bold text-slate-300 flex items-center gap-1.5">
                    <Coins className="w-4 h-4 text-sky-400" />
                    大定饷国库 (国库)
                  </span>
                  <span className="text-[10px] text-sky-400/80 px-2 py-0.5 bg-sky-950/40 border border-sky-900/30 rounded-md">财政账册</span>
                </div>
                <div className="text-2xl font-extrabold text-sky-300 py-1.5">
                  {gold.toLocaleString()} <span className="text-sm font-normal text-slate-500">两金银白银</span>
                </div>
              </div>

              {/* Cashflow sheet */}
              <div className="p-3 bg-slate-950 rounded-xl space-y-2 border border-slate-900">
                <div className="flex justify-between text-[11px] items-center pb-1.5 border-b border-slate-900">
                  <span className="text-slate-400 font-bold">每季常规收支清单:</span>
                  <span className="text-slate-600 text-[10px]">账目对焦</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-500 flex items-center gap-1">
                    <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    季度征税与商课岁入
                  </span>
                  <span className="text-emerald-400 font-semibold">+{goldIncome} 两</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-500 flex items-center gap-1">
                    <ArrowDownRight className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    百官俸禄与九边卫防岁出
                  </span>
                  <span className="text-rose-400 font-semibold">-{goldExpense} 两</span>
                </div>
                <div className="flex justify-between text-[11px] pt-1.5 border-t border-slate-900/50">
                  <span className="text-slate-400">季度常规结存盈余</span>
                  <span className="text-sky-400 font-bold">+{goldNet} 两/季</span>
                </div>
              </div>
            </div>

            {/* 4. 太仓粮备 (存粮) - Shows Input/Consumption */}
            <div className="p-5 border border-slate-850 bg-slate-905/30 rounded-2xl flex flex-col justify-between font-mono space-y-3.5">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[12px] font-bold text-slate-300 flex items-center gap-1.5">
                    <Sprout className="w-4 h-4 text-teal-400" />
                    太仓粮食储备 (存粮)
                  </span>
                  <span className="text-[10px] text-teal-400/80 px-2 py-0.5 bg-teal-950/40 border border-teal-900/30 rounded-md">太仓储粮</span>
                </div>
                <div className="text-2xl font-extrabold text-teal-300 py-1.5">
                  {grain.toLocaleString()} <span className="text-sm font-normal text-slate-500">石古米陈谷</span>
                </div>
              </div>

              {/* Grain Cashflow sheet */}
              <div className="p-3 bg-slate-950 rounded-xl space-y-2 border border-slate-900">
                <div className="flex justify-between text-[11px] items-center pb-1.5 border-b border-slate-900">
                  <span className="text-slate-400 font-bold">每季太仓漕转消耗:</span>
                  <span className="text-slate-600 text-[10px]">太仓米册</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-500 flex items-center gap-1">
                    <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    各省麦漕及皇稻岁入
                  </span>
                  <span className="text-emerald-400 font-semibold">+{grainIncome.toLocaleString()} 石</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-500 flex items-center gap-1">
                    <ArrowDownRight className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    常驻卫营与民夫吃重岁消耗
                  </span>
                  <span className="text-rose-400 font-semibold">-{grainExpense.toLocaleString()} 石</span>
                </div>
                <div className="flex justify-between text-[11px] pt-1.5 border-t border-slate-900/50">
                  <span className="text-slate-400">季度常规储米净增</span>
                  <span className="text-teal-400 font-bold">+{grainNet.toLocaleString()} 石/季</span>
                </div>
              </div>
            </div>

            {/* 5. 可用军力 */}
            <div className="p-4 border border-slate-850 bg-slate-900/10 rounded-2xl space-y-3 font-mono">
              <div className="flex justify-between items-center">
                <span className="text-[12px] font-bold text-slate-300 flex items-center gap-1.5">
                  <Users2 className="w-4 h-4 text-rose-400" />
                  可用社稷军力 (Military Force)
                </span>
                <span className="text-[10px] text-slate-500">【大朝卫戍】</span>
              </div>
              
              <div className="text-2xl font-extrabold text-rose-400">
                {totalMilitary.toLocaleString()} <span className="text-xs font-normal text-slate-500">名在饷勤王甲士</span>
              </div>

              {/* Sub-breakdown details in code blocks style */}
              <div className="bg-slate-950 p-3 rounded-xl space-y-1.5 text-[11px] border border-slate-900 text-slate-400">
                <div className="flex justify-between text-[10.5px] pb-1 border-b border-slate-900/40 text-slate-500">
                  <span>勤王各军镇军力细账</span>
                  <span>标下士卒</span>
                </div>
                <div className="flex justify-between">
                  <span>京畿上三营内侍亲卫 (Royal Guard)</span>
                  <span className="text-slate-300">12,000人</span>
                </div>
                <div className="flex justify-between">
                  <span>直隶、中原折冲行中营省军 (Garrisons)</span>
                  <span className="text-slate-300">{(Math.floor(totalMilitary * 0.65)).toLocaleString()}人</span>
                </div>
                <div className="flex justify-between">
                  <span>关塞铁骑游骑勤王边客军 (Cavalry Force)</span>
                  <span className="text-slate-300">{(totalMilitary - 12000 - Math.floor(totalMilitary * 0.65)).toLocaleString()}人</span>
                </div>
              </div>
            </div>

            {/* 6. 朝野贪腐度 */}
            <div className="p-4 border border-slate-850 bg-slate-900/10 rounded-2xl space-y-3 font-mono">
              <div className="flex justify-between items-center">
                <span className="text-[12px] font-bold text-slate-200 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  百官贪腐成风度 (Corruption Level)
                </span>
                <span className="text-[10px] text-slate-500">【百僚秉性】</span>
              </div>
              
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-extrabold text-amber-500">{corruptionLevel}%</span>
                <span className="text-slate-500 text-xs">吏治风纪比重</span>
              </div>

              <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 via-amber-500 to-rose-500 transition-all duration-505" 
                  style={{ width: `${corruptionLevel}%` }}
                ></div>
              </div>

              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">朝纲风纪状况:</span>
                <span className={corruptionStatus.color}>{corruptionStatus.label}</span>
              </div>

              <p className="text-[10.2px] text-slate-500 leading-normal">
                策略：君王威严及英明政略有助于震慑百官降低贪腐。朝中魏藻德等奸臣执政会大幅提升贪腐水平，可在【重臣】下旨密命处决以肃官风。
              </p>
            </div>

          </div>

        </div>

        {/* Footer Area */}
        <div className="p-4 border-t border-slate-900 bg-slate-950 flex justify-end shrink-0">
          <button 
            id="overview-bottom-close-btn"
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold rounded-lg border border-slate-800 bg-slate-900 hover:bg-slate-850 hover:text-white text-slate-400 transition-all cursor-pointer font-heading"
          >
            退出国家总览
          </button>
        </div>

      </div>
    </div>
  );
}
