/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { TalentSpec } from "../types";
import { Sparkles, Zap, Flame, Compass, RefreshCw, Eye, Wand2, ShieldCheck, HeartPulse } from "lucide-react";

interface SkillsModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTalent: TalentSpec;
  karma: number; // mapped to Spirit/Mana pool
  onTriggerSkill: (skillId: string, karmaCost: number) => void;
}

interface SkillItem {
  id: string;
  name: string;
  type: "active" | "passive";
  cost: number;
  specMatch?: TalentSpec;
  description: string;
  outcome: string;
}

export default function SkillsModal({
  isOpen,
  onClose,
  activeTalent,
  karma,
  onTriggerSkill
}: SkillsModalProps) {
  // Hardcoded active and passive talent pool listing
  const [skills] = useState<SkillItem[]>([
    {
      id: "spell_insight",
      name: "混沌两仪·洞察主术",
      type: "active",
      cost: 10,
      specMatch: TalentSpec.INSIGHT,
      description: "烛照乾坤内质。启用后可直入臣属百官神魂深处，查看其内心想法与真实好感，识破朝堂诡诈。",
      outcome: "随机锁定一位名臣重将，探查其忠心异同并大幅提高亲密度。"
    },
    {
      id: "spell_stealth",
      name: "太乙清风·隐形匿迹",
      type: "active",
      cost: 15,
      specMatch: TalentSpec.STEALTH,
      description: "形神匿于风云。每日能隐遁凡人耳目一炷香，使刺客无从近前，流民起义暴兵折冲在其外。",
      outcome: "使宿主进入绝对隐蔽状态，完全豁免下一次随机兵乱折冲。"
    },
    {
      id: "spell_alchemy",
      name: "紫微重排·点石成金",
      type: "active",
      cost: 15,
      specMatch: TalentSpec.ALCHEMY,
      description: "借造化之权能。将尘土沙石等凡态分子重排堆叠为晶亮银元，直接救治帝国之经济饥荒危机。",
      outcome: "熔铸大荒因果，凭空为行库中增解加铸 400 两流动白银！"
    },
    {
      id: "spell_hypnosis",
      name: "九梦弥罗·摄心催眠",
      type: "active",
      cost: 20,
      specMatch: TalentSpec.HYPNOSIS,
      description: "执神识之丝缕。对NPC凡人心念展开短时潜意识指令暗示，令刑罚叛逆之人当场倒戈归附。",
      outcome: "使一名在押或流放在外的叛徒名臣忠诚暴涨50点，当场称臣。"
    },
    {
      id: "spell_divination",
      name: "大衍演易·神识算卜",
      type: "active",
      cost: 5,
      specMatch: TalentSpec.DIVINATION,
      description: "损命数而占天天时。占算次月流氓、灾祸、雪雹等天害，预判各省府兵防并提前进行撤民。",
      outcome: "预演并削减近期即将出现的常模负面天灾发生几率。"
    },
    {
      id: "spell_endurance",
      name: "金刚伏魔·气穴大药术",
      type: "active",
      cost: 5,
      specMatch: TalentSpec.ENDURANCE,
      description: "疏通宿主气血两经，淬炼凡骨强兵。大增机能、敏锐和耐力，免除一切夜御百女导致的劳损。",
      outcome: "使最大HP上限永久提升 +40 点，恢复所有丧失的精力与饥饱阀值。"
    },
    {
      id: "passive_glow",
      name: "天命眷属·宿主光环",
      type: "passive",
      cost: 0,
      description: "高纬度灵机投射。每次流转或历练至荒郊险野时，偶遇偶发奇商、异士、美姬等事件的几率增高 30%。",
      outcome: "被动常驻生效中。探险触发高级金色因果事件概率永久上浮。"
    },
    {
      id: "passive_legacy",
      name: "朱明余晖·亡国社稷钟",
      type: "passive",
      cost: 0,
      description: "宿体天骨残留的帝皇烈气。在大明疆界内，流寇由于畏死神将，攻城进度与民乱狂怒度自然消解 10%。",
      outcome: "被动常驻生效中。江山社稷气数流失速度延缓，名臣对您的包容度提升。"
    },
    {
      id: "passive_immortal",
      name: "九重天护·不死锁血咒",
      type: "passive",
      cost: 0,
      description: "逆转生死天道之玄法。在遭遇致命重伤或暗算导致HP跌破10%极限时，神速将宿主意识退守保护，锁血至下一回合。",
      outcome: "被动常驻生效中。每局战斗或死劫面临暴跌时强制获得不死免伤豁免 1 次。"
    }
  ]);

  const [selectedSkill, setSelectedSkill] = useState<SkillItem>(skills[0]);
  const [cooldowns, setCooldowns] = useState<Record<string, boolean>>({});

  if (!isOpen) return null;

  // Active spec cost discount calculation
  const isActiveSpec = selectedSkill.specMatch === activeTalent;
  const finalCost = isActiveSpec ? Math.max(2, Math.floor(selectedSkill.cost / 2)) : selectedSkill.cost;

  const handleCastSkill = () => {
    if (selectedSkill.type === "passive") return;
    
    if (karma < finalCost) {
      alert("⚠️ 精神灵力值不足，无法凝神催动此法门！请通过每日摆烂或断宿恢复积攒。");
      return;
    }

    onTriggerSkill(selectedSkill.id, finalCost);
    
    // Set visual casting lock
    setCooldowns(prev => ({ ...prev, [selectedSkill.id]: true }));
    setTimeout(() => {
      setCooldowns(prev => ({ ...prev, [selectedSkill.id]: false }));
    }, 5000);
  };

  // Build simulated energy gauge block
  const maxSimulatedEnergy = 100;
  const karmaPercentage = Math.min(100, Math.max(0, (karma / maxSimulatedEnergy) * 100));

  return (
    <div id="skills-talents-modal-overlay" className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in select-none text-slate-100">
      <div id="skills-modal-board-card" className="relative w-full max-w-3xl overflow-hidden border rounded-2xl bg-slate-950 border-cyan-500/30 shadow-2xl shadow-cyan-500/10 flex flex-col h-[75vh]">
        
        {/* Glow boarder accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-indigo-600 to-teal-400"></div>

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b bg-slate-950 border-slate-900 shrink-0">
          <h2 className="flex items-center gap-2 text-base font-extrabold tracking-widest text-transparent font-heading bg-gradient-to-r from-cyan-400 to-indigo-200 bg-clip-text">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            天演法门与神通天赋 (SPELLS & LIFE TALENTS)
          </h2>
          <button 
            id="quit-skills-modal-top-btn"
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 transition-colors rounded-full text-slate-400 hover:text-rose-500 hover:bg-rose-500/10"
          >
            ✕
          </button>
        </div>

        {/* UPPER: SPIRIT / MANA ENERGY POOL */}
        <div className="mx-6 mt-4 p-4 rounded-xl border border-slate-900 bg-slate-900/10 shrink-0 space-y-2">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1">
              <Zap className="w-4 h-4 text-cyan-400 animate-pulse" />
              宿主精神灵力池容量 (Host Mana Reservoir)
            </span>
            <span className="text-cyan-400 font-bold">{karma} / {maxSimulatedEnergy} 精神灵力</span>
          </div>
          
          {/* Mana bar */}
          <div className="w-full h-3 bg-slate-950 border border-slate-900 rounded-full overflow-hidden p-[1px]">
            <div 
              className="h-full bg-gradient-to-r from-cyan-600 via-teal-500 to-emerald-400 rounded-full transition-all duration-500 shadow-lg shadow-cyan-500/40"
              style={{ width: `${karmaPercentage}%` }}
            ></div>
          </div>
          <div className="text-[9.5px] text-slate-500 font-mono flex justify-between">
            <span>天道荒无量子态 [NORMAL]</span>
            <span>回蓝效率: 摆烂/决断事件回复</span>
          </div>
        </div>

        {/* MASTER WORKSPACE: LEFT LIST, RIGHT DETAIL */}
        <div className="flex-1 flex min-h-0 overflow-hidden px-6 pb-4 pt-3 mt-1 bg-slate-950">
          
          {/* LEFT COLUMN: Skill items list */}
          <div className="w-2/5 border-r border-slate-900 pr-4 overflow-y-auto space-y-1.5 shrink-0">
            <span className="text-[10px] text-slate-650 font-bold block uppercase tracking-wider font-mono pb-2 border-b border-slate-950">
              神通品目 ({skills.length})
            </span>

            {skills.map((sk) => {
              const isSel = selectedSkill.id === sk.id;
              const isMatch = sk.specMatch === activeTalent;
              return (
                <div
                  key={sk.id}
                  onClick={() => setSelectedSkill(sk)}
                  className={`p-3 rounded-lg border text-left cursor-pointer transition-colors relative flex justify-between items-center ${isSel ? "bg-cyan-500/5 border-cyan-500" : "bg-slate-900/15 border-slate-900 hover:bg-slate-900/40"}`}
                >
                  <div className="space-y-1 truncate">
                    <span className={`text-[11.5px] font-extrabold block truncate ${isSel ? "text-cyan-300 font-black" : "text-slate-350"}`}>
                      {sk.name}
                    </span>
                    <span className="text-[8.5px] font-mono font-bold uppercase text-slate-550 flex items-center gap-1">
                      {sk.type === "active" ? (
                        <span className="text-sky-400 border border-sky-500/20 bg-sky-500/5 px-1 py-0.1 rounded-xs">主动仙术</span>
                      ) : (
                        <span className="text-purple-400 border border-purple-500/20 bg-purple-500/5 px-1 py-0.1 rounded-xs">被动天赋</span>
                      )}
                      {isMatch && <span className="text-emerald-400 font-black">【本命】</span>}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* RIGHT COLUMN: Specific Detail panel */}
          <div className="flex-1 pl-5 overflow-y-auto flex flex-col justify-between h-full min-h-0 bg-slate-950/20">
            
            <div className="space-y-4">
              <div className="flex justify-between items-start pb-2 border-b border-slate-900 font-mono">
                <div className="space-y-1">
                  <span className="text-[9px] text-slate-500 uppercase">神通鉴定考证 (Spell Specifications)</span>
                  <h3 className="text-base font-extrabold text-white">{selectedSkill.name}</h3>
                </div>
                <span className={`text-[10px] px-2 py-0.5 border rounded-sm font-bold uppercase ${selectedSkill.type === "active" ? "text-sky-400 border-sky-500/25 bg-sky-500/5" : "text-purple-400 border-purple-500/25 bg-purple-500/5"}`}>
                  {selectedSkill.type === "active" ? `耗蓝: ${finalCost} 灵力` : "物理被动"}
                </span>
              </div>

              {/* Story Spec */}
              <div className="p-4 border border-slate-900 bg-slate-900/10 rounded-xl space-y-2">
                <span className="text-[9.5px] text-slate-500 font-bold block uppercase font-mono">【法经玄密】:</span>
                <p className="text-xs text-slate-300 leading-relaxed italic">{selectedSkill.description}</p>
              </div>

              {/* Outcomes */}
              <div className="p-4 border border-teal-500/15 bg-teal-550/5 rounded-xl space-y-2">
                <span className="text-[9.5px] text-teal-400 block font-bold font-mono">【宿主加持气运功效】:</span>
                <p className="text-xs text-slate-200 leading-relaxed font-mono">{selectedSkill.outcome}</p>
              </div>
            </div>

            {/* Bottom buttons - passive skills have no activation */}
            <div className="pt-4 border-t border-slate-950 shrink-0 font-heading">
              {selectedSkill.type === "active" ? (
                <div className="space-y-3">
                  {karma < finalCost && (
                    <div className="flex items-center gap-1.5 p-2 bg-rose-500/10 border border-rose-500/20 rounded-lg text-[10px] text-rose-400 font-mono">
                      <span>⚠️ 精神灵力过低 (缺 {finalCost - karma} 点)，极易遭受上苍反噬劫难，禁制发动。</span>
                    </div>
                  )}
                  <button
                    onClick={handleCastSkill}
                    disabled={cooldowns[selectedSkill.id] || karma < finalCost}
                    className={`w-full py-2.5 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1 shadow-lg cursor-pointer transition-all active:scale-97 ${cooldowns[selectedSkill.id] ? "bg-slate-900 border border-slate-800 text-slate-500 cursor-not-allowed" : "bg-gradient-to-r from-cyan-600 to-teal-500 text-black font-black hover:brightness-110 disabled:opacity-35 disabled:cursor-not-allowed"}`}
                  >
                    {cooldowns[selectedSkill.id] ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>天机气脉调息中...</span>
                      </>
                    ) : (
                      <>
                        <Flame className="w-3.5 h-3.5 text-black" />
                        <span>唤醒并激活此主动神通</span>
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="p-3 border border-dashed border-purple-500/20 bg-purple-500/5 rounded-xl text-center text-[10px] text-purple-400 font-mono">
                  <ShieldCheck className="w-4 h-4 text-purple-400 mx-auto mb-1 animate-pulse" />
                  <span>[ 该神通为全时空被动天赋，进入新时态或战端自动运行，无须消耗精神灵力 ]</span>
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
