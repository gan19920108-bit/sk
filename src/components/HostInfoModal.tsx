/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { PlayerAttributes, SystemTemplateSpec, TalentSpec } from "../types";
import { User, ShieldAlert, Cpu, Award, Zap, Heart, Sparkles, Brain, Flame, Sparkle, Swords, Eye, Hand, Smile, Scale } from "lucide-react";

interface HostInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  attributes: PlayerAttributes;
  playerName: string;
  gender: string;
  systemTemplate: SystemTemplateSpec;
  talent: TalentSpec;
  levelName: string;
  gold: number;
  systemPoints: number;
  onUpgradeAttribute: (attr: keyof PlayerAttributes, cost: number, val: number, costType: "gold" | "points") => void;
  customAvatarUrl?: string;
  portraitDB?: Record<string, string>;
}

export default function HostInfoModal({
  isOpen,
  onClose,
  attributes,
  playerName,
  gender,
  systemTemplate,
  talent,
  levelName,
  gold,
  systemPoints,
  onUpgradeAttribute,
  customAvatarUrl = "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=600&q=80",
  portraitDB
}: HostInfoModalProps) {
  if (!isOpen) return null;

  const displayAvatarUrl = (portraitDB && portraitDB[playerName]) || customAvatarUrl;

  const handleTrain = (attr: keyof PlayerAttributes, amount: number, cost: number, type: "gold" | "points") => {
    onUpgradeAttribute(attr, cost, amount, type);
  };

  // Helper to render dual-axis alignment sliders
  const renderAlignmentBar = (title: string, value: number, leftLabel: string, rightLabel: string, colorClass: string) => {
    // value is from -100 to 100
    // convert value to a percentage from 0 to 100: (value + 100) / 2
    const percentage = ((value + 100) / 2);
    return (
      <div className="space-y-1 p-2 bg-slate-950/40 border border-slate-900 rounded-lg">
        <div className="flex justify-between text-[11px] font-mono font-bold text-slate-400">
          <span>{title}</span>
          <span className={colorClass}>{value > 0 ? `+${value}` : value}</span>
        </div>
        <div className="relative h-2 rounded bg-slate-900 overflow-hidden border border-slate-800">
          {/* Middle marker */}
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-slate-700/80 z-0"></div>
          {/* Current position */}
          <div 
            className={`absolute top-0 bottom-0 w-2.5 -ml-1 rounded-full ${colorClass} shadow-[0_0_8px_currentColor] z-10 transition-all duration-500`}
            style={{ left: `${percentage}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-[9px] text-slate-500 font-mono">
          <span>{leftLabel}</span>
          <span>中庸</span>
          <span>{rightLabel}</span>
        </div>
      </div>
    );
  };

  return (
    <div id="host-info-modal-container" className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in select-none">
      <div id="host-info-card" className="relative w-full max-w-5xl overflow-hidden border rounded-2xl bg-slate-950 border-amber-500/30 shadow-2xl shadow-amber-500/10 flex flex-col h-[90vh]">
        
        {/* Decorative elements */}
        <div className="absolute inset-0 pointer-events-none opacity-5 bg-gradient-to-b from-amber-500/10 to-transparent"></div>
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-yellow-400 to-rose-500"></div>

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b bg-slate-950 border-slate-900 shrink-0">
          <h2 className="flex items-center gap-2 text-lg font-extrabold tracking-widest text-transparent font-heading bg-gradient-to-r from-amber-400 to-yellow-250 bg-clip-text">
            <User className="w-5 h-5 text-amber-500 animate-pulse" />
            时空宿主神识本元星图 (HOST DOSSIER)
          </h2>
          <button 
            id="quit-host-modal-btn"
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 transition-colors rounded-full text-slate-400 hover:text-rose-500 hover:bg-rose-500/10"
          >
            ✕
          </button>
        </div>

        {/* Scrollable multi-columns Body */}
        <div className="p-6 overflow-y-auto flex-1 flex flex-col lg:flex-row gap-6">
          
          {/* LEFT COLUMN: Character Portrait, Identity, Age, Title, and gauges */}
          <div className="w-full lg:w-1/3 flex flex-col gap-4 shrink-0">
            <div className="relative border border-slate-800 rounded-2xl overflow-hidden bg-slate-900 aspect-3/4 shadow-lg flex flex-col justify-end">
              
              <img 
                src={displayAvatarUrl} 
                alt="宿主时空立绘"
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
                onError={(e) => {
                  (e.target as any).src = "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=600&q=80";
                }}
              />

              {/* Black Gradient overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>

              {/* Status and Title tag at upper-left corner */}
              <div className="absolute top-3 left-3 px-2.5 py-1 bg-black/75 border border-amber-500/30 rounded-full text-[8.5px] font-mono text-amber-400 font-bold shadow-md tracking-wider">
                👑 {attributes.title || "天命帝君"}
              </div>

              {/* Basic Details layout at bottom */}
              <div className="p-4 z-10 space-y-1 bg-gradient-to-t from-slate-950 to-transparent pt-8">
                <span className="text-[9px] text-amber-400 font-bold tracking-widest block uppercase font-mono">AUTHORIZED HOST // 降界真灵</span>
                <div className="flex items-baseline gap-2 font-heading">
                  <h3 id="player-fullname" className="text-lg font-extrabold text-white text-shadow">{playerName}</h3>
                  <span className="text-[9px] px-1.5 py-0.2 bg-amber-500/15 border border-amber-500/30 text-amber-300 rounded uppercase font-bold">{gender}</span>
                  <span className="text-[10px] text-slate-300 font-mono font-bold">({attributes.age || 33} 岁)</span>
                </div>
                
                <div className="text-[9.5px] text-slate-400 font-mono leading-relaxed pt-1 flex items-center gap-1.5">
                  <Sparkle className="w-3.5 h-3.5 text-amber-500 animate-spin" style={{ animationDuration: "10s" }} />
                  <span>身份：{attributes.identity || "大明宗室天子"}</span>
                </div>
                <div className="text-[9.5px] text-slate-400 font-mono flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-cyan-400" />
                  <span>命格境界：{levelName}</span>
                </div>
              </div>
            </div>
          </div>

          {/* MAIN CENTER/RIGHT COLUMN: Extended stats sheets */}
          <div className="flex-1 space-y-5">

            {/* Character Vitals Panels */}
            <div className="p-4 border rounded-xl border-slate-900 bg-slate-950/30 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 font-mono border-b border-slate-900 pb-1.5">
                Vitals & Alignments / 生命状态与心怀立场
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* HP Gauge */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold font-mono">
                    <span className="flex items-center gap-1.5 text-slate-300">
                      <Heart className="w-3.5 h-3.5 text-rose-500" />
                      <span>生命值</span>
                    </span>
                    <span className="text-rose-400">{attributes.hp} / {attributes.maxHp}</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
                    <div 
                      className="h-full bg-gradient-to-r from-rose-600 to-red-400 transition-all duration-500"
                      style={{ width: `${Math.min(100, (attributes.hp / attributes.maxHp) * 100)}%` }}
                    ></div>
                  </div>
                </div>

                {/* Energy Gauge */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold font-mono">
                    <span className="flex items-center gap-1.5 text-slate-300">
                      <Zap className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                      <span>精力值</span>
                    </span>
                    <span className="text-cyan-400">{attributes.energy ?? 100} / {attributes.maxEnergy ?? 100}</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
                    <div 
                      className="h-full bg-gradient-to-r from-cyan-600 to-teal-400 transition-all duration-500"
                      style={{ width: `${Math.min(100, ((attributes.energy ?? 100) / (attributes.maxEnergy ?? 100)) * 100)}%` }}
                    ></div>
                  </div>
                </div>

                {/* Satiety Gauge */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold font-mono">
                    <span className="flex items-center gap-1.5 text-slate-300">
                      <Flame className="w-3.5 h-3.5 text-amber-500" />
                      <span>饱食度</span>
                    </span>
                    <span className="text-amber-400">{attributes.satiety ?? 100} / {attributes.maxSatiety ?? 100}</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
                    <div 
                      className="h-full bg-gradient-to-r from-amber-600 to-yellow-400 transition-all duration-500"
                      style={{ width: `${Math.min(100, ((attributes.satiety ?? 100) / (attributes.maxSatiety ?? 100)) * 100)}%` }}
                    ></div>
                  </div>
                </div>

              </div>

              {/* Alignments Sliders: Good / Evil & Clear / Dim */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                {renderAlignmentBar(
                  "善恶度 (Good / Evil Alignment)", 
                  attributes.moralAlignment ?? 10, 
                  "极恶 (-100)", 
                  "极善 (+100)", 
                  (attributes.moralAlignment ?? 10) >= 0 ? "text-emerald-400" : "text-rose-400"
                )}
                
                {renderAlignmentBar(
                  "明昏度 (Illumination Alignment)", 
                  attributes.orderAlignment ?? 20, 
                  "昏庸 (-100)", 
                  "圣明 (+100)", 
                  (attributes.orderAlignment ?? 20) >= 0 ? "text-cyan-400" : "text-purple-400"
                )}
              </div>
            </div>

            {/* Combat Power stats banner */}
            <div className="grid grid-cols-2 gap-4 p-3.5 border rounded-xl border-dashed border-red-500/20 bg-red-500/5">
              <div className="text-center font-mono py-1">
                <span className="text-[10px] text-slate-500 uppercase block">⚔️ 攻击力 (AP)</span>
                <span id="player-combat-attack" className="text-lg font-black text-rose-400 tracking-wider font-heading">{attributes.attack ?? 25}</span>
              </div>
              <div className="text-center font-mono py-1 border-l border-slate-900">
                <span className="text-[10px] text-slate-500 uppercase block">🛡️ 防御力 (DP)</span>
                <span id="player-combat-defense" className="text-lg font-black text-cyan-400 tracking-wider font-heading">{attributes.defense ?? 20}</span>
              </div>
            </div>

            {/* 经验值 (Experience Value) */}
            <div className="p-4 rounded-xl border border-cyan-500/15 bg-cyan-500/5 space-y-1.5 font-mono">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-extrabold flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-cyan-400 animate-pulse" />
                  因果修行经验值 (Experience Points)
                </span>
                <span className="text-cyan-300 font-extrabold text-sm">{attributes.experience ?? 350} EXP</span>
              </div>
              <div className="text-[10px] text-slate-500">
                // EXPERIENCE SYSTEM / 经验值无限制上限，可供给基础及技能属性加点
              </div>
            </div>

            {/* Attributes Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* PRIMARY ATTRIBUTES SHEET */}
              <div className="p-4 border rounded-xl bg-slate-900/10 border-slate-900 space-y-3">
                <h4 className="text-xs font-extrabold text-slate-300 font-heading border-b border-slate-900 pb-1.5 flex justify-between items-center">
                  <span>💪 基础属性面板 (Base Attributes)</span>
                  <span className="text-[9px] text-slate-500 font-mono uppercase font-normal">Limits: 100</span>
                </h4>
                
                <div className="space-y-2.5 font-mono text-[11px]">
                  {[
                    { key: "strength" as const, name: "力量 (Strength)", val: attributes.strength, color: "text-orange-400" },
                    { key: "agility" as const, name: "敏捷 (Agility)", val: attributes.agility ?? 20, color: "text-emerald-400" },
                    { key: "intelligence" as const, name: "智力 (Intelligence)", val: attributes.intelligence, color: "text-cyan-400" },
                    { key: "charisma" as const, name: "魅力 (Charisma)", val: attributes.charisma, color: "text-pink-400" },
                    { key: "perseverance" as const, name: "毅力 (Perseverance)", val: attributes.perseverance ?? 20, color: "text-indigo-400" },
                    { key: "endurance" as const, name: "耐力 (Endurance)", val: attributes.endurance ?? 20, color: "text-teal-400" },
                    { key: "luck" as const, name: "运气 (Luck)", val: attributes.luck, color: "text-yellow-400" },
                  ].map((attr) => (
                    <div key={attr.name} className="flex justify-between items-center py-1 border-b border-slate-900/50">
                      <span className="text-slate-450 text-[10px] sm:text-[10.5px]">{attr.name}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-1 bg-slate-950 rounded-full overflow-hidden hidden xl:block">
                          <div className={`h-full ${attr.color} bg-current`} style={{ width: `${attr.val}%` }}></div>
                        </div>
                        <span className={`font-black ${attr.color} w-6 text-right text-[11px]`}>{attr.val}</span>
                        <div className="flex gap-1 pl-1">
                          <button
                            onClick={() => handleTrain(attr.key, 5, 200, "gold")}
                            disabled={gold < 200 || attr.val >= 100}
                            title="花费200两训练该属性+5"
                            className="px-1.5 py-0.5 bg-yellow-500/10 hover:bg-yellow-500/20 active:scale-95 disabled:opacity-20 text-yellow-500 border border-yellow-500/20 rounded text-[9px] cursor-pointer transition-all shrink-0 font-sans"
                          >
                            🪙+5
                          </button>
                          <button
                            onClick={() => handleTrain(attr.key, 5, 55, "points")}
                            disabled={systemPoints < 55 || attr.val >= 100}
                            title="花费55神识积分修炼该属性+5"
                            className="px-1.5 py-0.5 bg-emerald-500/10 hover:bg-emerald-500/20 active:scale-95 disabled:opacity-20 text-emerald-400 border border-emerald-500/20 rounded text-[9px] cursor-pointer transition-all shrink-0 font-sans"
                          >
                            🧪+5
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SKILLS ATTRIBUTES SHEET */}
              <div className="p-4 border rounded-xl bg-slate-900/10 border-slate-900 space-y-3">
                <h4 className="text-xs font-extrabold text-slate-300 font-heading border-b border-slate-900 pb-1.5 flex justify-between items-center">
                  <span>🎯 技能属性面板 (Professional Skills)</span>
                  <span className="text-[9px] text-slate-500 font-mono uppercase font-normal">Limits: 100</span>
                </h4>

                <div className="space-y-2.5 font-mono text-[11px]">
                  {[
                    { key: "skillMelee" as const, name: "近战 (Melee)", val: attributes.skillMelee ?? 20, color: "text-rose-400" },
                    { key: "skillRanged" as const, name: "远程 (Ranged)", val: attributes.skillRanged ?? 20, color: "text-amber-400" },
                    { key: "skillDriving" as const, name: "驾驶 (Driving)", val: attributes.skillDriving ?? 20, color: "text-purple-400" },
                    { key: "skillCommunication" as const, name: "交流 (Communication)", val: attributes.skillCommunication ?? 20, color: "text-blue-400" },
                    { key: "skillCrafting" as const, name: "制作 (Crafting)", val: attributes.skillCrafting ?? 20, color: "text-lime-400" },
                    { key: "skillArt" as const, name: "艺术 (Artistry)", val: attributes.skillArt ?? 20, color: "text-violet-400" },
                    { key: "skillAthletics" as const, name: "运动 (Athletics)", val: attributes.skillAthletics ?? 20, color: "text-green-400" },
                    { key: "skillAcuteness" as const, name: "敏锐 (Perception)", val: attributes.skillAcuteness ?? 20, color: "text-yellow-400" },
                    { key: "skillCamouflage" as const, name: "伪装 (Camouflage)", val: attributes.skillCamouflage ?? 20, color: "text-indigo-400" },
                  ].map((skill) => (
                    <div key={skill.name} className="flex justify-between items-center py-1 border-b border-slate-900/50">
                      <span className="text-slate-450 text-[10px] sm:text-[10.5px]">{skill.name}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-1 bg-slate-950 rounded-full overflow-hidden hidden xl:block">
                          <div className={`h-full ${skill.color} bg-current`} style={{ width: `${skill.val}%` }}></div>
                        </div>
                        <span className={`font-black ${skill.color} w-6 text-right text-[11px]`}>{skill.val}</span>
                        <div className="flex gap-1 pl-1">
                          <button
                            onClick={() => handleTrain(skill.key, 5, 200, "gold")}
                            disabled={gold < 200 || skill.val >= 100}
                            title="花费200两训练该技能+5"
                            className="px-1.5 py-0.5 bg-yellow-500/10 hover:bg-yellow-500/20 active:scale-95 disabled:opacity-20 text-yellow-500 border border-yellow-500/20 rounded text-[9px] cursor-pointer transition-all shrink-0 font-sans"
                          >
                            🪙+5
                          </button>
                          <button
                            onClick={() => handleTrain(skill.key, 5, 55, "points")}
                            disabled={systemPoints < 55 || skill.val >= 100}
                            title="花费55神识积分修习该技能+5"
                            className="px-1.5 py-0.5 bg-emerald-500/10 hover:bg-emerald-500/20 active:scale-95 disabled:opacity-20 text-emerald-400 border border-emerald-500/20 rounded text-[9px] cursor-pointer transition-all shrink-0 font-sans"
                          >
                            🧪+5
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Attributes Bento Grid lower margin fill */}
            <div className="h-2"></div>

          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-slate-950 border-slate-900 flex justify-end shrink-0">
          <button 
            id="close-host-modal-footer-btn"
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold rounded-lg border border-slate-800 bg-slate-900 hover:bg-slate-850 hover:text-white text-slate-300 transition-all shadow-md active:scale-95 cursor-pointer font-heading"
          >
            退出宿主大堂
          </button>
        </div>

      </div>
    </div>
  );
}
