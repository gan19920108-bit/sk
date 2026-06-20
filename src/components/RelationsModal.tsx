/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { NPCCharacter } from "../types";
import { Group, Heart, Shield, Swords, Sparkles, Brain, Scale, Eye, HelpCircle, FileText, User, Coins } from "lucide-react";

interface RelationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  npcs: NPCCharacter[];
  portraitDB?: Record<string, string>;
  gold: number;
  onInteract: (npcId: string, action: "bribe" | "converse" | "execute", cost: number) => void;
}

// Map historical figures to exquisite fallback attributes to provide a high-fidelity simulator experience
const getNPCDetailsWithFallbacks = (npc: NPCCharacter, portraitDB?: Record<string, string>) => {
  const name = npc.name;

  let age = npc.age ?? 45;
  let hp = npc.hp ?? 100;
  let attack = npc.attack ?? 40;
  let defense = npc.defense ?? 35;
  
  // Basic properties
  let str = npc.strength ?? 30;
  let agi = npc.agility ?? 40;
  let int = npc.intelligence ?? 50;
  let cha = npc.charisma ?? 40;
  let per = npc.perseverance ?? 50;
  let end = npc.endurance ?? 45;
  let luc = npc.luck ?? 50;

  // Skills
  let melee = npc.skillMelee ?? 30;
  let ranged = npc.skillRanged ?? 25;
  let driving = npc.skillDriving ?? 35;
  let comm = npc.skillCommunication ?? 50;
  let craft = npc.skillCrafting ?? 20;
  let art = npc.skillArt ?? 30;
  let ath = npc.skillAthletics ?? 35;
  let acut = npc.skillAcuteness ?? 45;
  let camo = npc.skillCamouflage ?? 30;

  // Thoughts and memories
  let thoughts = npc.innerThoughts ?? "社稷崩漏，未知天颜可能逆转九五风浪。";
  let memory = npc.playerMemory ?? "曾蒙宿主温颜召见，对宿主的心机深不可测抱着敬畏。";

  let avatarUrl = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80";

  // Detailed calibration based on their roles
  if (name.includes("王承恩")) {
    age = 51; hp = 90; attack = 35; defense = 42;
    str = 25; agi = 45; int = 72; cha = 60; per = 95; end = 70; luc = 40;
    melee = 40; ranged = 30; driving = 55; comm = 84; craft = 45; art = 50; ath = 48; acut = 82; camo = 75;
    thoughts = "皇上今日行止莫测、神异万千，仿佛有域外神明加持。奴才唯有舍命追随，护驾左右。";
    memory = "铭记着大行皇帝在紫禁宫阙中，曾拍着其肩嘱托内务托付之重。";
    avatarUrl = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80";
  } else if (name.includes("吴三桂")) {
    age = 32; hp = 100; attack = 92; defense = 86;
    str = 88; agi = 84; int = 68; cha = 75; per = 80; end = 85; luc = 65;
    melee = 90; ranged = 85; driving = 80; comm = 55; craft = 40; art = 35; ath = 88; acut = 78; camo = 60;
    thoughts = "关外清军犯边甚急，关内叛党大兵围困。若朝廷给不出三军安米高饷，休怪我三桂投大顺或剃发！";
    memory = "记挂着崇祯十五年，辽东大捷之后，天子特赏赐御带金甲的隆恩。";
    avatarUrl = "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80";
  } else if (name.includes("魏藻德")) {
    age = 48; hp = 75; attack = 15; defense = 20;
    str = 18; agi = 25; int = 55; cha = 68; per = 20; end = 30; luc = 70;
    melee = 10; ranged = 12; driving = 25; comm = 92; craft = 15; art = 75; ath = 20; acut = 50; camo = 85;
    thoughts = "李自成的大顺红军百万合围。识时务者为俊阶，此时当偷偷联络攻城太监，预备降表。";
    memory = "常因宿主频繁清洗首辅而战战兢兢，在内廷里总是低头唯唯诺诺应承。";
    avatarUrl = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80";
  } else if (name.includes("李自成")) {
    age = 38; hp = 100; attack = 88; defense = 78;
    str = 82; agi = 78; int = 70; cha = 90; per = 92; end = 90; luc = 85;
    melee = 85; ranged = 80; driving = 75; comm = 78; craft = 30; art = 25; ath = 82; acut = 75; camo = 65;
    thoughts = "崇祯倒行逆施。江南富庶，我直捣燕京以成至尊霸业，犒劳百万陇亩弟兄！";
    memory = "对玩家的坚守意志有极高评价，但誓要踏碎明阙。";
    avatarUrl = "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80";
  } else if (name.includes("杨玉环")) {
    age = 27; hp = 80; attack = 10; defense = 15;
    str = 15; agi = 50; int = 65; cha = 99; per = 45; end = 35; luc = 80;
    melee = 5; ranged = 5; driving = 30; comm = 88; craft = 10; art = 98; ath = 60; acut = 70; camo = 40;
    thoughts = "马嵬驿山风冷冽，护驾三军皆执刀戈。陛下，臣妾只求与圣上同死，不连累大唐山河。";
    memory = "永远记着天宝十载，开元华清池里华灯齐奏，执手许下长生殿之誓。";
    avatarUrl = "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80";
  } else if (name.includes("樊忠")) {
    age = 36; hp = 100; attack = 95; defense = 90;
    str = 95; agi = 72; int = 40; cha = 65; per = 98; end = 95; luc = 50;
    melee = 96; ranged = 70; driving = 65; comm = 35; craft = 50; art = 15; ath = 92; acut = 75; camo = 40;
    thoughts = "太监王振擅权误国。拼舍此身，于乱军血泊中拼死砸烂佞臣头颅，誓保圣上突围！";
    memory = "牢记受天子提拔为神机宿卫神将的御旨，立誓马革裹尸。";
    avatarUrl = "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80";
  } else if (name.includes("也先")) {
    age = 42; hp = 100; attack = 94; defense = 82;
    str = 90; agi = 85; int = 78; cha = 88; per = 88; end = 86; luc = 80;
    melee = 92; ranged = 95; driving = 95; comm = 65; craft = 35; art = 20; ath = 88; acut = 82; camo = 72;
    thoughts = "明军昏聩可笑。怀来野旷正是一举将这黄龙天子生擒的绝世赐赐！";
    memory = "蔑视张皇失措的明军首脑，但惊叹于有系统宿主意志醒觉之天兆。";
    avatarUrl = "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&w=400&q=80";
  } else if (name.includes("李纲")) {
    age = 52; hp = 88; attack = 45; defense = 65;
    str = 40; agi = 35; int = 86; cha = 78; per = 95; end = 80; luc = 50;
    melee = 45; ranged = 40; driving = 50; comm = 82; craft = 60; art = 75; ath = 42; acut = 80; camo = 50;
    thoughts = "靖康汴梁沦于大雪。割地求和乃是饮鸠止渴！只要陛下许我总领九门，金贼必丧于城下！";
    memory = "念及上疏《抗金十议》时，君臣相顾泣血的慷慨。";
    avatarUrl = "https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?auto=format&fit=crop&w=400&q=80";
  } else if (name.includes("约逖") || name.includes("祖逖")) {
    age = 44; hp = 100; attack = 90; defense = 82;
    str = 85; agi = 82; int = 82; cha = 80; per = 99; end = 92; luc = 60;
    melee = 88; ranged = 82; driving = 84; comm = 75; craft = 45; art = 60; ath = 85; acut = 88; camo = 68;
    thoughts = "中流击楫，不复中原，誓不起此舟！蛮胡狂卷，唯有铁血可铸汉青！";
    memory = "感激宿主中宵赐予的北伐督统金印。";
    avatarUrl = "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80";
  }

  // Override by master portrait database if name matches!
  if (portraitDB && portraitDB[name]) {
    avatarUrl = portraitDB[name];
  }

  return { age, hp, attack, defense, str, agi, int, cha, per, end, luc, melee, ranged, driving, comm, craft, art, ath, acut, camo, thoughts, memory, avatarUrl };
};

export default function RelationsModal({
  isOpen,
  onClose,
  npcs,
  portraitDB,
  gold,
  onInteract
}: RelationsModalProps) {
  const [selectedNpcId, setSelectedNpcId] = useState<string | null>(null);

  if (!isOpen) return null;

  // Pre-select the first NPC if none selected
  const selectedNpc = npcs.find((n) => n.id === selectedNpcId) || npcs[0];

  const getStatusColor = (status: string) => {
    switch(status) {
      case "活耀": return "bg-emerald-500/10 border-emerald-500/20 text-emerald-400";
      case "已处决": return "bg-rose-500/10 border-rose-500/20 text-rose-400 font-bold";
      default: return "bg-slate-500/10 border-slate-500/20 text-slate-400";
    }
  };

  const getLoyaltyColor = (val: number) => {
    if (val >= 80) return "text-emerald-400 border-emerald-500/20 bg-emerald-500/5";
    if (val >= 40) return "text-amber-400 border-amber-500/20 bg-amber-500/5";
    return "text-rose-400 border-rose-500/20 bg-rose-500/5 animate-pulse";
  };

  const getAffectionColor = (val: number) => {
    if (val >= 75) return "text-pink-400 border-pink-500/20 bg-pink-500/5";
    if (val >= 40) return "text-indigo-400 border-indigo-500/20 bg-indigo-500/5";
    return "text-slate-400 border-slate-700/20 bg-slate-900/5";
  };

  const npcStats = selectedNpc ? getNPCDetailsWithFallbacks(selectedNpc) : null;

  return (
    <div id="court-relations-modal-container" className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in select-none">
      <div id="relations-card-board" className="relative w-full max-w-5xl overflow-hidden border rounded-2xl bg-slate-950 border-rose-500/30 shadow-2xl shadow-rose-500/10 flex flex-col h-[85vh]">
        
        {/* Screening grid & decorative accent */}
        <div className="absolute inset-0 pointer-events-none opacity-5 bg-gradient-to-b from-rose-500/10 to-transparent"></div>
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 via-amber-400 to-indigo-500"></div>

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b bg-slate-950 border-slate-900 shrink-0">
          <h2 className="flex items-center gap-2 text-lg font-extrabold tracking-widest text-transparent font-heading bg-gradient-to-r from-amber-400 to-rose-300 bg-clip-text">
            <Group className="w-5 h-5 text-amber-500" />
            国朝社稷·文华将臣星相谱 (COURT RELATIONS)
          </h2>
          <button 
            id="quit-relations-top-btn"
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 transition-colors rounded-full text-slate-400 hover:text-rose-500 hover:bg-rose-500/10"
          >
            ✕
          </button>
        </div>

        {/* Prompt line */}
        <div className="p-4 bg-slate-900/40 border-b border-slate-900 flex justify-between items-center text-xs text-slate-500 font-mono shrink-0">
          <span>COUNCIL OF MINISTERS // 察纳雅言，深研文武秉性、其意图想法。不可妄行欺。</span>
        </div>

        {/* Core Multi-Split Layout */}
        <div className="flex-1 flex min-h-0 overflow-hidden bg-slate-950">
          
          {/* Left panel: Vertical courtiers roster list */}
          <div className="w-1/3 border-r border-slate-900 overflow-y-auto p-4 space-y-2.5 shrink-0">
            {npcs.length === 0 ? (
              <div className="text-center py-20 text-slate-600 italic text-[10px]">
                朝野寂寥，无核心将臣公卿记录
              </div>
            ) : (
              npcs.map((n) => {
                const isSelected = selectedNpc?.id === n.id;
                const isDead = n.status === "已处决";
                
                return (
                  <button
                    key={n.id}
                    onClick={() => setSelectedNpcId(n.id)}
                    className={`w-full p-3 rounded-xl border text-left flex flex-col gap-1 cursor-pointer transition-all duration-200 ${isSelected ? "bg-rose-500/10 border-rose-500 shadow-md" : "bg-slate-900/20 border-slate-900 hover:border-slate-800"} ${isDead ? "opacity-45 scale-98" : ""}`}
                  >
                    <div className="flex items-center justify-between gap-1 w-full">
                      <span className={`text-xs font-extrabold text-slate-200 block truncate ${isDead ? "line-through text-slate-600" : ""}`}>
                        {n.name}
                      </span>
                      <span className={`text-[8px] px-1 rounded font-mono ${getStatusColor(n.status)}`}>
                        {n.status}
                      </span>
                    </div>

                    <div className="flex justify-between text-[10px] text-slate-500 w-full mt-0.5">
                      <span className="truncate max-w-[70%] text-slate-400">{n.role}</span>
                      {!isDead && (
                        <span className="font-mono text-slate-400">
                          忠 <b className="text-emerald-400">{n.loyalty}%</b>
                        </span>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Right panel: Grand detailed dossiers card */}
          <div id="relations-dossiers-right" className="flex-1 overflow-y-auto p-6 flex flex-col min-h-0 bg-slate-950">
            {selectedNpc && npcStats ? (
              <div className="space-y-5 flex-1 max-w-full">
                
                {/* 1. Basic Bio Banner (including custom portrait) */}
                <div className="flex flex-col sm:flex-row gap-4 p-4 border rounded-2xl bg-slate-900/10 border-slate-900 items-start">
                  
                  {/* Portrait frame */}
                  <div className="w-24 h-32 border border-slate-800 rounded-xl bg-slate-900 flex flex-col items-center justify-center text-slate-600 shrink-0 relative overflow-hidden">
                    <img 
                      src={npcStats.avatarUrl} 
                      alt={selectedNpc.name}
                      referrerPolicy="no-referrer"
                      className="absolute inset-0 w-full h-full object-cover rounded-xl pointer-events-none"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent"></div>
                    <span className="absolute bottom-1.5 left-0 right-0 text-[8px] font-mono text-center text-slate-400 uppercase tracking-widest bg-black/55 py-0.5">Dossier</span>
                    
                    {/* Dead stamp overlay */}
                    {selectedNpc.status === "已处决" && (
                      <div className="absolute inset-0 bg-rose-950/85 flex items-center justify-center z-10">
                        <span className="text-[10px] font-bold text-rose-400 rotate-12 border border-rose-500 px-1 py-0.5 rounded uppercase tracking-wider">
                          已明刑
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Character general descriptions */}
                  <div className="space-y-2 flex-grow min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span id="relations-npc-name" className="text-base font-extrabold text-white">{selectedNpc.name}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded border border-slate-800 bg-slate-900 text-slate-400 font-mono">
                        {selectedNpc.role}
                      </span>
                      <span className={`text-[9px] px-1.5 py-0.5 border rounded-full font-mono ${getStatusColor(selectedNpc.status)}`}>
                        {selectedNpc.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pt-1">
                      <div className="text-[10px] text-slate-500 font-mono">
                        阵营隶属: <b className="text-amber-400 block truncate">{selectedNpc.faction}</b>
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        将臣年龄: <b className="text-slate-300 block">{npcStats.age} 岁</b>
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        本初元寿: <b className="text-rose-400 block">生命值 {npcStats.hp}/100</b>
                      </div>
                    </div>

                    {/* Combat statistics */}
                    <div className="grid grid-cols-2 gap-2 pt-1.5 border-t border-slate-900">
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-mono">
                        <Swords className="w-3.5 h-3.5 text-rose-500" />
                        <span>武功攻击: <b className="text-rose-400">{npcStats.attack}</b></span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-mono">
                        <Shield className="w-3.5 h-3.5 text-cyan-400" />
                        <span>防盾御守: <b className="text-cyan-400">{npcStats.defense}</b></span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Core Vitals Badges */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Loyalty progress */}
                  <div className={`p-3.5 border rounded-xl font-mono text-xs ${getLoyaltyColor(selectedNpc.loyalty)}`}>
                    <div className="flex justify-between items-center mb-1 font-bold">
                      <span>将臣效忠度 (Loyalty)</span>
                      <span>{selectedNpc.loyalty}%</span>
                    </div>
                    <div className="h-1 rounded-full bg-slate-950 overflow-hidden">
                      <div className="h-full bg-emerald-500" style={{ width: `${selectedNpc.loyalty}%` }}></div>
                    </div>
                  </div>

                  {/* Affection progress */}
                  <div className={`p-3.5 border rounded-xl font-mono text-xs ${getAffectionColor(selectedNpc.affection)}`}>
                    <div className="flex justify-between items-center mb-1 font-bold">
                      <span>同尘好感度 (Affection)</span>
                      <span>{selectedNpc.affection}%</span>
                    </div>
                    <div className="h-1 rounded-full bg-slate-950 overflow-hidden">
                      <div className="h-full bg-pink-500" style={{ width: `${selectedNpc.affection}%` }}></div>
                    </div>
                  </div>
                </div>

                {/* 3. Thought and Memories drawers */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-xl bg-slate-900/10 border-slate-900 text-xs font-mono">
                    <span className="font-extrabold text-transparent bg-gradient-to-r from-teal-400 to-indigo-300 bg-clip-text flex items-center gap-1.5 pb-1 border-b border-slate-900 mb-2">
                      <Brain className="w-3.5 h-3.5 text-teal-400" />
                      内心深处之想法
                    </span>
                    <p className="text-slate-300 leading-relaxed italic">“ {npcStats.thoughts} ”</p>
                  </div>

                  <div className="p-4 border rounded-xl bg-slate-900/10 border-slate-900 text-xs font-mono">
                    <span className="font-extrabold text-transparent bg-gradient-to-r from-amber-400 to-rose-300 bg-clip-text flex items-center gap-1.5 pb-1 border-b border-slate-900 mb-2">
                      <FileText className="w-3.5 h-3.5 text-amber-500" />
                      对玩家执念记忆
                    </span>
                    <p className="text-slate-300 leading-relaxed">“ {npcStats.memory} ”</p>
                  </div>
                </div>

                {/* 4. Attribute grids */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Basic attrs */}
                  <div className="p-4 border rounded-xl bg-slate-950 border-slate-900 text-xs font-mono space-y-2">
                    <span className="text-[10px] text-slate-500 block pb-1 border-b border-slate-900 font-bold">将臣基础属性 (Attributes)</span>
                    <div className="space-y-1.5 text-[11px]">
                      {[
                        { label: "力量 (Strength)", value: npcStats.str, color: "text-orange-400" },
                        { label: "敏捷 (Agility)", value: npcStats.agi, color: "text-emerald-400" },
                        { label: "智力 (Intelligence)", value: npcStats.int, color: "text-cyan-400" },
                        { label: "魅力 (Charisma)", value: npcStats.cha, color: "text-pink-400" },
                        { label: "毅力 (Perseverance)", value: npcStats.per, color: "text-indigo-400" },
                        { label: "耐力 (Endurance)", value: npcStats.end, color: "text-teal-400" },
                        { label: "运气 (Luck)", value: npcStats.luc, color: "text-yellow-400" }
                      ].map((item) => (
                        <div key={item.label} className="flex justify-between items-center">
                          <span className="text-slate-500">{item.label}</span>
                          <span className={`font-bold ${item.color}`}>{item.value} / 100</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Skills attrs */}
                  <div className="p-4 border rounded-xl bg-slate-950 border-slate-900 text-xs font-mono space-y-2">
                    <span className="text-[10px] text-slate-500 block pb-1 border-b border-slate-900 font-bold">将臣专业技能 (Professional Skills)</span>
                    <div className="space-y-1.5 text-[11px]">
                      {[
                        { label: "近战 (Melee Combat)", value: npcStats.melee, color: "text-rose-400" },
                        { label: "远程 (Ranged Combat)", value: npcStats.ranged, color: "text-amber-400" },
                        { label: "驾驶 (Driving)", value: npcStats.driving, color: "text-purple-400" },
                        { label: "交流 (Communication)", value: npcStats.comm, color: "text-blue-400" },
                        { label: "制作 (Crafting)", value: npcStats.craft, color: "text-lime-400" },
                        { label: "艺术 (Artistry)", value: npcStats.art, color: "text-violet-400" },
                        { label: "运动 (Athletics)", value: npcStats.ath, color: "text-green-400" },
                        { label: "敏锐 (Perception)", value: npcStats.acut, color: "text-yellow-400" },
                        { label: "伪装 (Camouflage)", value: npcStats.camo, color: "text-indigo-400" }
                      ].map((item) => (
                        <div key={item.label} className="flex justify-between items-center">
                          <span className="text-slate-500">{item.label}</span>
                          <span className={`font-bold ${item.color}`}>{item.value} / 100</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                 {/* 5. Biography Description */}
                <div className="p-4 border rounded-2xl border-slate-900 bg-slate-900/10 text-xs text-slate-305 leading-relaxed font-mono">
                  <span className="font-bold text-slate-500 block pb-1 border-b border-slate-900 mb-2">【生平列传与秉性】</span>
                  {selectedNpc.notableDeeds}
                </div>

                {/* 6. Sovereign Authority Interactions (Secret Decrees) */}
                {selectedNpc.status !== "已处决" && (
                  <div className="p-4 border border-rose-500/20 bg-rose-500/5 rounded-2xl space-y-3 font-mono">
                    <span className="text-[10px] text-rose-450 font-bold block uppercase tracking-wider">
                      👑 宿主圣旨极权权柄 (Sovereign Authority Actions)
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 font-sans">
                      <button
                        onClick={() => onInteract(selectedNpc.id, "converse", 0)}
                        className="py-2.5 px-3 bg-indigo-500/10 hover:bg-indigo-500/20 active:scale-97 text-indigo-300 border border-indigo-500/20 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <User className="w-4 h-4" />
                        <span>私恩特见话家常</span>
                      </button>

                      <button
                        onClick={() => onInteract(selectedNpc.id, "bribe", 300)}
                        disabled={gold < 300}
                        className="py-2.5 px-3 bg-yellow-500/10 hover:bg-yellow-500/20 active:scale-97 disabled:opacity-20 text-yellow-500 border border-yellow-500/20 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <Coins className="w-4 h-4 text-yellow-400" />
                        <span>重赏恩结 (300两)</span>
                      </button>

                      <button
                        onClick={() => {
                          if (confirm(`⚠️ 您确定要向下旨密裁重臣【${selectedNpc.name}】吗？此举虽威慑朝野百官显著增加威严，但也可能导致民意不稳。`)) {
                            onInteract(selectedNpc.id, "execute", 0);
                          }
                        }}
                        className="py-2.5 px-3 bg-rose-600/10 hover:bg-rose-600/20 active:scale-97 text-rose-500 border border-rose-600/20 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <Swords className="w-4 h-4" />
                        <span>密令处斩威诸曹</span>
                      </button>
                    </div>
                  </div>
                )}

              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center text-slate-550 py-10">
                <span className="text-xs font-mono text-slate-500">请在左侧点击官员档案以调阅朝臣卷宗。</span>
              </div>
            )}
          </div>

        </div>

        {/* Footer closing block */}
        <div className="p-4 border-t bg-slate-950 border-slate-900 flex justify-end shrink-0">
          <button 
            id="close-relations-footer-btn"
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold rounded-lg border border-slate-800 bg-slate-900 hover:bg-slate-850 hover:text-white text-slate-400 transition-all cursor-pointer font-heading"
          >
            退出内务
          </button>
        </div>

      </div>
    </div>
  );
}
