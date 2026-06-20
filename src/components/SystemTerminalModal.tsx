/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { SystemTemplateSpec, SystemCard, InventoryItem } from "../types";
import { ALL_ITEMS_STORE } from "../data/timelineEvents";
import { Terminal, Bot, Sparkles, Coins, ShoppingBag, TerminalSquare, Eye, Inbox, HelpCircle, Award, Coffee, Flame, ShieldAlert } from "lucide-react";

interface SystemTerminalModalProps {
  isOpen: boolean;
  onClose: () => void;
  templateSpec: SystemTemplateSpec;
  systemPoints: number;
  gold: number;
  ownedCards: SystemCard[];
  onDrawCard: (pointsCost: number) => void;
  onSignIn: () => void;
  onSlackAction: (pointsGained: number, hpGained: number, desc: string) => void;
  onIssueDecree: (decreeTitle: string, statMods: any, costGold: number, costPoints: number) => void;
  onBuyItem: (item: Omit<InventoryItem, "quantity" | "equipped">) => void;
}

export default function SystemTerminalModal({
  isOpen,
  onClose,
  templateSpec,
  systemPoints,
  gold,
  ownedCards,
  onDrawCard,
  onSignIn,
  onSlackAction,
  onIssueDecree,
  onBuyItem
}: SystemTerminalModalProps) {
  const [activeSubTab, setActiveSubTab] = useState<"control" | "mall">("control");
  const [selectedShopItem, setSelectedShopItem] = useState<any | null>(ALL_ITEMS_STORE[0] || null);
  const [pullGlow, setPullGlow] = useState<string | null>(null);
  const [signStatus, setSignStatus] = useState<boolean>(false);
  const [slackLog, setSlackLog] = useState<string>("宿主脑路神经连接稳定。摆烂电波已全周天发射。");

  if (!isOpen) return null;

  const getRarityClass = (rarity: string) => {
    switch(rarity) {
      case "神话": return "text-red-400 border-red-500/20 bg-red-500/5";
      case "传说": return "text-amber-400 border-amber-500/20 bg-amber-500/5";
      case "史诗": return "text-purple-400 border-purple-500/20 bg-purple-500/5";
      case "稀有": return "text-cyan-400 border-cyan-500/20 bg-cyan-500/5";
      default: return "text-slate-400 border-slate-800 bg-slate-900/40";
    }
  };

  const handleDraw = (cost: number) => {
    if (systemPoints < cost) {
      alert("系统积分不敷提取！请进行历练或完成日常任务。");
      return;
    }
    setPullGlow("drawing");
    setTimeout(() => {
      onDrawCard(cost);
      setPullGlow("complete");
      setTimeout(() => setPullGlow(null), 1500);
    }, 800);
  };

  const handleSignInBtn = () => {
    if (signStatus) {
      alert("今日天机气运已签到完结，请勿重复刷取系统！");
      return;
    }
    onSignIn();
    setSignStatus(true);
  };

  const handleSlack = (type: "sleep" | "cricket") => {
    if (type === "sleep") {
      onSlackAction(40, 15, "宿主在皇宫御花园躺椅上伸着懒腰晒了一下午太阳，耳听百灵唱曲，系统评定极度摆烂：生命气血恢复+15，摆烂积分+40点！");
      setSlackLog("执行完毕: 【深宫躺平】 获得了 40 摆烂积分与部分气血恢复。");
    } else {
      onSlackAction(60, -5, "宿主秘密换上微服偷偷跑到太康街斗了一下午蛐蛐，还给黑市小贩打赏了大批碎银。判定摆烂极致，玩物丧志：神魂愉悦积分+60，轻微跌落健康HP-5。");
      setSlackLog("执行完毕: 【斗蟋蟀之娱】 获得了 60 摆烂积分。");
    }
  };

  const handleDecreeBtn = (title: string, actionType: string) => {
    if (actionType === "foolish") {
      onIssueDecree(
        title, 
        { gold: -300, prestige: -15, strength: 5, karma: 10 },
        300,
        0
      );
    } else {
      onIssueDecree(
        title,
        { gold: -500, prestige: 25, intelligence: 10, karma: -15 },
        500,
        0
      );
    }
  };

  return (
    <div id="system-terminal-view-overlay" className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in select-none text-slate-100">
      <div id="terminal-modal-card" className="relative w-full max-w-4xl overflow-hidden border rounded-2xl bg-slate-950 border-emerald-500/30 shadow-2xl shadow-emerald-500/10 min-h-[65vh] flex flex-col h-[80vh]">
        
        {/* Glow boarder accent decoration */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-500"></div>

        {/* Header containing Sub-tab switchers */}
        <div className="flex flex-col sm:flex-row items-center justify-between p-5 border-b bg-slate-950 border-slate-900 shrink-0 gap-4">
          <div className="flex items-center gap-3">
            <h2 className="flex items-center gap-2 text-base font-extrabold tracking-widest text-transparent font-heading bg-gradient-to-r from-emerald-400 to-teal-200 bg-clip-text">
              <Terminal className="w-5 h-5 text-emerald-400" />
              量子系统控制大厅
            </h2>
            
            {/* Modal Navigation */}
            <div className="flex border border-slate-900 rounded-lg overflow-hidden text-[10.5px] bg-slate-900/60 font-mono">
              <button 
                onClick={() => setActiveSubTab("control")}
                className={`px-3 py-1.2 font-extrabold transition-colors cursor-pointer ${activeSubTab === "control" ? "bg-emerald-500 text-black font-black" : "text-slate-400 hover:text-slate-200"}`}
              >
                专属脑路系统
              </button>
              <button 
                onClick={() => setActiveSubTab("mall")}
                className={`px-3 py-1.2 font-extrabold transition-colors cursor-pointer ${activeSubTab === "mall" ? "bg-emerald-500 text-black font-black" : "text-slate-400 hover:text-slate-200"}`}
              >
                万象系统商城
              </button>
            </div>
          </div>

          <button 
            id="quit-terminal-top-btn"
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 transition-colors rounded-full text-slate-400 hover:text-rose-500 hover:bg-rose-500/10"
          >
            ✕
          </button>
        </div>

        {/* Top Points Ticker */}
        <div className="px-6 py-3 border-b border-slate-950/40 bg-slate-950/80 flex justify-between items-center text-xs shrink-0 font-mono">
          <span className="flex items-center gap-1.5 text-slate-400">
            <Bot className="w-4 h-4 text-emerald-400" />
            系统连接模组: <b className="text-emerald-300">{templateSpec}</b>
          </span>
          <div className="flex gap-4 font-bold">
            <div className="flex items-center gap-1">
              <span className="text-slate-500">行库白银:</span>
              <span className="text-yellow-500">{gold} 两</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-slate-500">神识积分:</span>
              <span className="text-emerald-400">{systemPoints} 点</span>
            </div>
          </div>
        </div>

        {/* Master Body */}
        <div className="p-6 overflow-y-auto flex-1 flex flex-col bg-slate-950">
          
          {/* TAB 1: SYSTEM CONTROLLERS */}
          {activeSubTab === "control" && (
            <div className="flex-1 flex flex-col">
              
              {/* SPEC: NONE (无系统) */}
              {templateSpec === SystemTemplateSpec.NONE && (
                <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 py-6">
                  <Award className="w-16 h-16 text-amber-500 animate-pulse" />
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-slate-100 font-heading">「无挂凡躯，天演本色」</h3>
                    <p className="text-xs text-slate-450 max-w-md leading-relaxed">
                      大德无相。您拒绝了搭载一切外骨骼或神魔挂载器，选择以一具普通的凡躯与天下雄杰博弈！
                    </p>
                  </div>
                  <div className="p-4 border border-slate-900 rounded-xl bg-slate-900/10 max-w-md text-xs text-left text-slate-350 space-y-1.5 leading-relaxed font-mono">
                    <div className="font-bold text-amber-400 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> 凡躯天命补偿加持已生效:
                    </div>
                    <div>• 最大气血生命上限 (MaxHP) 获得永久强化 <b>+80点</b></div>
                    <div>• 百武朝见中，所有帝国重臣忠诚下降阀值减少比率 <b>30%</b></div>
                    <div>• 所受神识或天灾因果致伤大减。</div>
                  </div>
                </div>
              )}

              {/* SPEC: CARD (诸天抽卡系统) */}
              {templateSpec === SystemTemplateSpec.CARD && (
                <div className="space-y-6 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-[10.5px] text-slate-500 font-mono">
                      <span>诸天万乘英灵池</span>
                      <span>每次抽卡索取 100 积分</span>
                    </div>

                    <div className="grid grid-cols-2 shadow-inner sm:grid-cols-3 gap-3 max-h-56 overflow-y-auto p-1">
                      {ownedCards.length === 0 ? (
                        <div className="col-span-full border border-dashed border-slate-900 p-8 rounded-xl text-center text-xs text-slate-600 italic flex flex-col items-center justify-center gap-2">
                          <Inbox className="w-8 h-8 text-slate-800" />
                          当前储客舱还没有召引任何诸天英灵，快点击底部抽取召唤吧！
                        </div>
                      ) : (
                        ownedCards.map((card) => {
                          const getRarColor = (rar: string) => {
                            if (rar === "神话") return "text-red-400 border-red-500/25 bg-red-950/15";
                            if (rar === "传说") return "text-amber-400 border-amber-500/25 bg-amber-955/15";
                            return "text-purple-400 border-purple-500/25 bg-purple-955/15";
                          };
                          return (
                            <div 
                              key={card.id}
                              className={`p-3 border rounded-xl flex flex-col bg-slate-900/50 border-slate-900 hover:border-slate-800 transition-all ${getRarColor(card.rarity)}`}
                            >
                              <div className="flex justify-between items-center text-[11px] font-mono">
                                <span className="font-extrabold text-slate-150">{card.name}</span>
                                <span className="text-[9px] font-bold uppercase">{card.rarity}</span>
                              </div>
                              <span className="text-[10px] text-slate-450 mt-2 line-clamp-2 leading-relaxed italic">{card.description}</span>
                              <div className="text-[9px] text-emerald-400 font-mono mt-2 pt-1.5 border-t border-slate-900">
                                加持: {card.effect}
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-slate-900 text-center space-y-4 shrink-0">
                    <div className="flex gap-4 justify-center font-heading">
                      <button
                        onClick={() => handleDraw(100)}
                        disabled={systemPoints < 100 || pullGlow === "drawing"}
                        className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-500 text-black font-extrabold rounded-xl shadow-lg hover:from-emerald-555 hover:to-teal-400 disabled:opacity-40 transition-all text-xs cursor-pointer"
                      >
                        招引一位英灵 (100积分)
                      </button>
                      <button
                        onClick={() => handleDraw(900)}
                        disabled={systemPoints < 900 || pullGlow === "drawing"}
                        className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-500 text-black font-extrabold rounded-xl shadow-lg hover:from-emerald-555 hover:to-teal-400 disabled:opacity-40 transition-all text-xs cursor-pointer"
                      >
                        十连天命祭坛 (900积分)
                      </button>
                    </div>
                    {pullGlow === "drawing" && (
                      <p className="text-xs text-amber-400 animate-pulse font-mono flex items-center justify-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 animate-spin" />
                        正在搅动虚空英灵海，链接意识节点数据...
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* SPEC: SIGNIN (最强签到系统) */}
              {templateSpec === SystemTemplateSpec.SIGNIN && (
                <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
                  <Coins className="w-14 h-14 text-yellow-500 animate-bounce" />
                  <div className="space-y-1.5">
                    <h3 className="text-base font-extrabold text-slate-200 font-heading">【每日天一签到神坛】</h3>
                    <p className="text-xs text-slate-450 max-w-sm leading-normal">
                      每日签到即可凭空汲取时空秘钥奖励，随机滚出流动饷银或高质储物物资！
                    </p>
                  </div>

                  <button
                    onClick={handleSignInBtn}
                    className={`px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-400 text-black font-extrabold rounded-xl shadow-xl hover:brightness-110 active:scale-95 transition-all text-xs cursor-pointer ${signStatus ? "opacity-40 line-through cursor-not-allowed" : "pulse-glow-gold"}`}
                  >
                    {signStatus ? "今日气核已注满" : "启动每日天机签到"}
                  </button>
                </div>
              )}

              {/* SPEC: MERCHANT (万象货栈系统) */}
              {templateSpec === SystemTemplateSpec.MERCHANT && (
                <div className="flex-1 flex flex-col justify-between py-2 space-y-4">
                  <div className="border border-slate-900 rounded-xl p-4 bg-slate-900/10 space-y-2 text-xs">
                    <div className="font-bold text-amber-400 flex items-center gap-1 font-mono">
                      <Bot className="w-4 h-4 text-amber-500" />
                      货栈能量回收熔炉:
                    </div>
                    <p className="text-slate-450 leading-relaxed font-sans">
                      极高纬度回收处。您不需要进入黑市，在这里只要拥有一种特定系统密钥，便可无限次向量子神坛兑换流动银两！
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono">
                    <div className="p-4 rounded-xl border border-slate-900 bg-slate-900/10 text-center space-y-3">
                      <span className="text-xs text-slate-350 block font-extrabold">【神力退换】</span>
                      <p className="text-[10px] text-slate-500">将50神力点数退返兑换白银</p>
                      <button
                        onClick={() => {
                          if(systemPoints < 50) { alert("神力积分余额不足！"); return; }
                          onIssueDecree("融化积分", { gold: 300, points: -50 }, 0, 50);
                        }}
                        className="w-full py-1.5 text-xs border border-emerald-500/30 text-emerald-400 rounded hover:bg-emerald-500/10 transition-colors"
                      >
                        积分换 300 银
                      </button>
                    </div>

                    <div className="p-4 rounded-xl border border-slate-900 bg-slate-900/10 text-center space-y-3">
                      <span className="text-xs text-slate-350 block font-extrabold">【银两购点】</span>
                      <p className="text-[10px] text-slate-500">将300两饷银转化为100点系统积分</p>
                      <button
                        onClick={() => {
                          if(gold < 300) { alert("饷眼存金不足折抵！"); return; }
                          onIssueDecree("购得神力", { gold: -300, points: 100 }, 300, 0);
                        }}
                        className="w-full py-1.5 text-xs border border-yellow-500/30 text-yellow-500 rounded hover:bg-yellow-500/10 transition-colors"
                      >
                        白银换 100 积分
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* SPEC: SLACK (摆烂系统) */}
              {templateSpec === SystemTemplateSpec.SLACK && (
                <div className="flex-1 flex flex-col justify-between py-2 space-y-6">
                  <div className="p-4 border rounded-xl border-dashed border-slate-900 bg-slate-950 font-mono text-[11px] text-slate-450 leading-relaxed">
                    <span className="text-amber-500 font-bold block mb-1">【摆烂神识传感器】</span>
                    {slackLog}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => handleSlack("sleep")}
                      className="p-4 border rounded-xl border-slate-900 bg-slate-900/10 hover:border-slate-800 transition-all text-center space-y-2 group cursor-pointer"
                    >
                      <Coffee className="w-8 h-8 text-cyan-400 mx-auto group-hover:scale-110 transition-transform" />
                      <span className="text-xs font-bold text-slate-200 block">白日深宫侧卧躺平</span>
                      <p className="text-[10px] text-slate-500 leading-normal">
                        不视政、不听疏、不视朝。恢复HP/气运并获得少许积分。
                      </p>
                    </button>

                    <button
                      onClick={() => handleSlack("cricket")}
                      className="p-4 border rounded-xl border-slate-900 bg-slate-900/10 hover:border-slate-800 transition-all text-center space-y-2 group cursor-pointer"
                    >
                      <Flame className="w-8 h-8 text-rose-400 mx-auto group-hover:scale-110 transition-transform" />
                      <span className="text-xs font-bold text-slate-200 block">便衣夜斗蟋蟀竞游</span>
                      <p className="text-[10px] text-slate-500 leading-normal">
                        消耗微额金钱，大增摆烂快感，生成大批点数奖励。
                      </p>
                    </button>
                  </div>
                </div>
              )}

              {/* SPEC: FOOLISH / TRAGIC (昏君 / 亡国明君系统) */}
              {(templateSpec === SystemTemplateSpec.FOOLISH || templateSpec === SystemTemplateSpec.TRAGIC) && (
                <div className="flex-1 flex flex-col justify-between py-2 space-y-6">
                  
                  <div className="p-4 border border-rose-500/10 rounded-xl bg-rose-500/5 text-xs text-slate-350 leading-relaxed">
                    <div className="font-bold text-rose-400 flex items-center gap-1 mb-1 font-mono">
                      <ShieldAlert className="w-4 h-4" />
                      {templateSpec === SystemTemplateSpec.FOOLISH ? "【荒淫无度·昏君大统系统】" : "【力挽狂澜·救世明君系统】"}
                    </div>
                    {templateSpec === SystemTemplateSpec.FOOLISH 
                      ? "进行越出人伦荒唐昏聩的暴举决定，反而会让系统积分倍增。损天下之饷，实宿之天灵！"
                      : "颁布精明强干、利在万民的救世国策。增加气运或提高帝王威仪值。"}
                  </div>

                  {/* Unique Decrees choices */}
                  {templateSpec === SystemTemplateSpec.FOOLISH ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono">
                      <div className="p-3.5 border rounded-xl border-slate-900 bg-slate-900/10 flex flex-col justify-between">
                        <div>
                          <span className="text-xs font-bold text-slate-200 block">【搜刮大内美女，扩修御苑】</span>
                          <p className="text-[10px] text-slate-500 mt-1 leading-normal">耗损流动金钱，降低威望，但激发暴逆。实力暴涨！</p>
                        </div>
                        <button
                          onClick={() => handleDecreeBtn("搜刮美女扩修御苑", "foolish")}
                          disabled={gold < 300}
                          className="mt-3 py-1.5 bg-rose-500/15 border border-rose-500/30 text-rose-350 rounded hover:bg-rose-500/25 text-xs disabled:opacity-40"
                        >
                          大兴土木 (-300金)
                        </button>
                      </div>

                      <div className="p-3.5 border rounded-xl border-slate-900 bg-slate-900/10 flex flex-col justify-between">
                        <div>
                          <span className="text-xs font-bold text-slate-200 block">【诛锄忤道御史，任用谗太监】</span>
                          <p className="text-[10px] text-slate-500 mt-1 leading-normal">屠戮谏臣。保皇臣属好感跌落，系统气运回聚！</p>
                        </div>
                        <button
                          onClick={() => handleDecreeBtn("诛除御史任用太监", "foolish")}
                          disabled={gold < 300}
                          className="mt-3 py-1.5 bg-rose-500/15 border border-rose-500/30 text-rose-350 rounded hover:bg-rose-500/25 text-xs disabled:opacity-40"
                        >
                          贬责诛剪 (-300金)
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono">
                      <div className="p-3.5 border rounded-xl border-slate-900 bg-slate-900/10 flex flex-col justify-between">
                        <div>
                          <span className="text-xs font-bold text-slate-200 block">【开放漕御平粜，减轻岁征】</span>
                          <p className="text-[10px] text-slate-500 mt-1 leading-normal">损金度日。减少民怨，宿主理政值上涨！</p>
                        </div>
                        <button
                          onClick={() => handleDecreeBtn("开漕平粜减免赋税", "tragic")}
                          disabled={gold < 500}
                          className="mt-3 py-1.5 bg-emerald-500/15 border border-emerald-500/30 text-emerald-350 rounded hover:bg-emerald-500/25 text-xs disabled:opacity-40"
                        >
                          救渡生民 (-500金)
                        </button>
                      </div>

                      <div className="p-3.5 border rounded-xl border-slate-900 bg-slate-900/10 flex flex-col justify-between">
                        <div>
                          <span className="text-xs font-bold text-slate-200 block">【调拨银两一万，整边备外患】</span>
                          <p className="text-[10px] text-slate-500 mt-1 leading-normal">高筑御防。重臣忠诚激增，挽救帝威！</p>
                        </div>
                        <button
                          onClick={() => handleDecreeBtn("整饬燕京九边防军", "tragic")}
                          disabled={gold < 500}
                          className="mt-3 py-1.5 bg-emerald-500/15 border border-emerald-500/30 text-emerald-350 rounded hover:bg-emerald-500/25 text-xs disabled:opacity-40"
                        >
                          坚筑堡镇 (-500金)
                        </button>
                      </div>
                    </div>
                  )}

                </div>
              )}

              {/* CUSTOM (自定义系统) */}
              {templateSpec === SystemTemplateSpec.CUSTOM && (
                <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
                  <Bot className="w-16 h-16 text-cyan-400 animate-spin" style={{ animationDuration: "12s" }} />
                  <div className="space-y-1.5">
                    <h3 className="text-base font-extrabold text-slate-200 font-heading">【自定义系统因果协议模组】</h3>
                    <p className="text-xs text-slate-450 max-w-sm leading-normal">
                      自主时基，因果分形！正在接收您设定的系统协议进行底层交互。
                    </p>
                  </div>
                  <div className="p-4 border border-cyan-500/20 bg-cyan-550/5 rounded-xl text-xs text-left max-w-md font-mono leading-relaxed text-slate-350">
                    此处可随着后续LLM指令对宿主设定的自定义功能进行智能代码演绎交互。可以随时通过输入法阵要求补充更复杂的指令面板！
                  </div>
                </div>
              )}

            </div>
          )}

          {/* TAB 2: SYSTEM MALL (万象商铺 moved here) */}
          {activeSubTab === "mall" && (
            <div className="flex-grow flex flex-col md:flex-row gap-5 h-full min-h-0">
              
              {/* Left Column: available item list */}
              <div className="w-full md:w-1/2 overflow-y-auto space-y-3 font-mono">
                <span className="text-[10px] text-slate-500 font-extrabold block uppercase tracking-wider">
                  SYSTEM MERCHANDISE // 货栈架上物资
                </span>
                
                <div className="grid grid-cols-1 gap-2">
                  {ALL_ITEMS_STORE.map((si) => (
                    <button
                      key={si.id}
                      onClick={() => setSelectedShopItem(si)}
                      className={`p-3 border rounded-xl flex justify-between items-center text-left transition-colors cursor-pointer ${selectedShopItem?.id === si.id ? "bg-emerald-550/10 border-emerald-500" : "bg-slate-900/25 border-slate-900 hover:border-slate-800"}`}
                    >
                      <div className="space-y-1">
                        <div className="text-xs font-bold text-slate-150">{si.name}</div>
                        <span className={`text-[9px] px-1.5 py-0.2 border rounded font-mono ${getRarityClass(si.rarity)}`}>
                          {si.rarity}
                        </span>
                      </div>
                      <div className="text-xs font-mono font-extrabold text-yellow-500 flex items-center gap-1">
                        <Coins className="w-3.5 h-3.5 text-yellow-500" />
                        <span>{si.goldValue} 两</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Right Column: checkout and information contract */}
              <div className="w-full md:w-1/2 p-5 rounded-xl border border-slate-900 bg-slate-900/10 flex flex-col justify-between overflow-y-auto max-h-[46vh]">
                {selectedShopItem ? (
                  <div className="space-y-4 flex-1">
                    <div className="space-y-1.5 pb-2.5 border-b border-slate-950 font-mono">
                      <span className="text-[9px] text-slate-500 font-bold tracking-widest block">CHAMBER OF COMMERCE SPEC // 万象契据</span>
                      <h4 className="text-base font-extrabold text-white">{selectedShopItem.name}</h4>
                      <div className="flex gap-2">
                        <span className={`text-[10px] px-2 py-0.5 border rounded-sm ${getRarityClass(selectedShopItem.rarity)}`}>
                          {selectedShopItem.rarity}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 border border-slate-800 rounded bg-slate-950 text-yellow-500 font-bold flex items-center gap-0.5">
                          <Coins className="w-3 h-3 text-yellow-500 animate-pulse" />
                          售价: {selectedShopItem.goldValue} 两
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2 font-sans">
                      <span className="text-[10.5px] text-slate-500 font-bold block uppercase font-mono">【物要密鉴】</span>
                      <p className="text-slate-350 italic text-xs leading-relaxed">{selectedShopItem.description}</p>
                    </div>

                    {selectedShopItem.effect && (
                      <div className="p-3 border border-emerald-500/15 rounded-lg bg-emerald-500/5 text-xs font-mono">
                        <span className="font-extrabold text-emerald-400 block pb-1 border-b border-slate-950 text-[10px]">购买/装备后宿主效益:</span>
                        <p className="text-slate-300 text-[10.5px] leading-relaxed pt-1.5">{selectedShopItem.effect}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-slate-600 space-y-2 pb-6">
                    <ShoppingBag className="w-8 h-8 text-slate-800" />
                    <span className="text-xs italic font-mono">请点选左侧特定时空物资</span>
                  </div>
                )}

                {selectedShopItem && (
                  <div className="pt-4 border-t border-slate-950 font-heading">
                    <button
                      onClick={() => onBuyItem(selectedShopItem)}
                      disabled={gold < selectedShopItem.goldValue}
                      className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-400 text-black font-extrabold rounded-xl text-xs text-center shadow-lg hover:brightness-110 active:scale-97 transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    >
                      {gold >= selectedShopItem.goldValue ? "确认兑购传输 (扣除国库银两)" : "行库白银不足"}
                    </button>
                  </div>
                )}
              </div>

            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-slate-950 border-slate-950 flex justify-end shrink-0">
          <button 
            id="close-terminal-modal-footer-btn"
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold rounded-lg border border-slate-850 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer font-heading"
          >
            断开系统
          </button>
        </div>
      </div>
    </div>
  );
}
