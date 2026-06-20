/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  TimelineType, 
  SystemTemplateSpec, 
  TalentSpec, 
  PlayerAttributes, 
  NPCCharacter, 
  Province, 
  InventoryItem, 
  Mission, 
  WorldEvent, 
  ChronicleRecord,
  SystemCard
} from "./types";

import { 
  TIMELINE_PRESETS, 
  INITIAL_ITEMS, 
  SYSTEM_CARDS_POOL, 
  ALL_ITEMS_STORE 
} from "./data/timelineEvents";

// Component Modals
import HostInfoModal from "./components/HostInfoModal";
import RelationsModal from "./components/RelationsModal";
import EmpireMapModal from "./components/EmpireMapModal";
import InventoryModal from "./components/InventoryModal";
import SkillsModal from "./components/SkillsModal";
import ChroniclesModal from "./components/ChroniclesModal";
import WorldEventsModal from "./components/WorldEventsModal";
import MissionsModal from "./components/MissionsModal";
import SystemTerminalModal from "./components/SystemTerminalModal";
import CustomSettingsModal from "./components/CustomSettingsModal";
import OverviewModal from "./components/OverviewModal";

// Icons & UI Items
import { 
  User, Group, Landmark, Briefcase, Sparkles, History, Earth, ListTodo, Terminal, Settings, 
  Send, HelpCircle, ChevronRight, ChevronUp, ChevronDown, Play, Award, RotateCcw, Import, Download, Trash2, Heart, Coins, 
  Sparkle, Eye, ShieldAlert, BadgeInfo, Calendar, MapPin, CloudSun, Crown, Sprout, LayoutDashboard, Maximize, Minimize
} from "lucide-react";

export default function App() {
  // --- Landing and Setup States ---
  const [isStarted, setIsStarted] = useState<boolean>(false);
  const [nonGameScreen, setNonGameScreen] = useState<"title" | "config">("title");
  const [selectedPresetTimeline, setSelectedPresetTimeline] = useState<TimelineType>(TimelineType.MING);
  const [selectedTemplate, setSelectedTemplate] = useState<SystemTemplateSpec>(SystemTemplateSpec.CARD);
  const [selectedTalent, setSelectedTalent] = useState<TalentSpec>(TalentSpec.INSIGHT);
  
  const [setupHostName, setSetupHostName] = useState<string>("");
  const [setupGender, setSetupGender] = useState<string>("男性");
  const [setupItems, setSetupItems] = useState<string[]>([]);
  
  // Custom timeline / system / talent input boxes
  const [customTime, setCustomTime] = useState<string>("");
  const [customIdentity, setCustomIdentity] = useState<string>("");
  const [customLocation, setCustomLocation] = useState<string>("");
  const [customSysName, setCustomSysName] = useState<string>("");
  const [customSysFunc, setCustomSysFunc] = useState<string>("");
  const [customTalentDesc, setCustomTalentDesc] = useState<string>("");
  const [customTalentName, setCustomTalentName] = useState<string>("");
  const [customTalentBonus, setCustomTalentBonus] = useState<string>("");
  const [customAvatarUrl, setCustomAvatarUrl] = useState<string>("https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=600&q=80");
  const [portraitDB, setPortraitDB] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem("chrono_custom_portraits_database");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      "朱由检": "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=600&q=80",
      "关羽": "https://images.unsplash.com/photo-1583089892943-e02e5b017b6a?auto=format&fit=crop&w=600&q=80",
      "王承恩": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
      "吴三桂": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
      "魏藻德": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80",
      "李自成": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80",
      "张皇后": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"
    };
  });

  // --- Dynamic Core Game States ---
  const [playerName, setPlayerName] = useState<string>("朱由检");
  const [gender, setGender] = useState<string>("男性");
  const [currentEraText, setCurrentEraText] = useState<string>("崇祯十七年三月十九日");
  const [timelineType, setTimelineType] = useState<TimelineType>(TimelineType.MING);
  const [systemSpec, setSystemSpec] = useState<SystemTemplateSpec>(SystemTemplateSpec.CARD);
  const [talentSpec, setTalentSpec] = useState<TalentSpec>(TalentSpec.INSIGHT);

  const [attributes, setAttributes] = useState<PlayerAttributes>({
    hp: 100,
    maxHp: 100,
    lifespan: 60,
    strength: 20,
    intelligence: 20,
    charisma: 20,
    luck: 50,
    emperorPrestige: 30,
    karma: 40
  });

  const [gold, setGold] = useState<number>(3000);
  const [systemPoints, setSystemPoints] = useState<number>(500);
  const [levelName, setLevelName] = useState<string>("普通皇嗣 凡人九阶");
  const [currentYear, setCurrentYear] = useState<number>(1);
  const [turnCount, setTurnCount] = useState<number>(1);

  // Lists in sandbox
  const [npcs, setNpcs] = useState<NPCCharacter[]>([]);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [worldEvents, setWorldEvents] = useState<WorldEvent[]>([]);
  const [chronicles, setChronicles] = useState<ChronicleRecord[]>([]);
  const [ownedSystemCards, setOwnedSystemCards] = useState<SystemCard[]>([]);

  // Story feed log arrays
  const [narrativeLogs, setNarrativeLogs] = useState<{ text: string; mode: "system" | "action" | "dialogue" | "warn"; id: string }[]>([]);
  const [actionInput, setActionInput] = useState<string>("");

  // Recommended choices (based on matching timeline currently)
  const [currentRecommendations, setCurrentRecommendations] = useState<string[]>([]);
  const [isRecommendationsExpanded, setIsRecommendationsExpanded] = useState<boolean>(true);

  const getFormattedStatusLine = () => {
    // Gregorian year
    let gregYear = 1644;
    let ancientEra = "";
    let dateStr = "三月十九日辰时 05:30";
    
    if (timelineType === TimelineType.MING) {
      gregYear = 1644 + currentYear - 1;
      const chongzhenYear = 17 + currentYear - 1;
      const yearCn = chongzhenYear === 1 ? "元" : chongzhenYear;
      ancientEra = `崇祯${yearCn}年`;
      dateStr = "三月十九日大行辰时 05:30";
    } else if (timelineType === TimelineType.TUMU) {
      gregYear = 1449 + currentYear - 1;
      const zhengtongYear = 14 + currentYear - 1;
      const yearCn = zhengtongYear === 1 ? "元" : zhengtongYear;
      ancientEra = `正统${yearCn}年`;
      dateStr = "八月十五日辰时 05:30";
    } else {
      gregYear = 1627 + currentYear - 1;
      const tianqiYear = 7 + currentYear - 1;
      const yearCn = tianqiYear === 1 ? "元" : tianqiYear;
      ancientEra = `天启${yearCn}年`;
      dateStr = "九月初七辰时 05:30";
    }

    // Location formatting: 一级地点+二级地点+三级地点
    let locStr = "北京紫禁城太和殿";
    if (customLocation.trim()) {
      locStr = customLocation.trim();
    } else {
      if (timelineType === TimelineType.MING) {
        locStr = "北京紫禁城太和殿";
      } else if (timelineType === TimelineType.TUMU) {
        locStr = "怀来土木堡大军行营";
      } else {
        locStr = "北京紫禁城太和殿";
      }
    }

    // Weather formatting
    const weatherArray = ["多云", "大风", "大雨", "小雪", "晴"];
    const weatherStr = weatherArray[currentYear % weatherArray.length];

    // Format: '公元1627年天启七年九月初七辰时 05:30 | 北京紫禁城太和殿 | 多云'
    return `公元${gregYear}年${ancientEra}${dateStr} | ${locStr} | ${weatherStr}`;
  };

  // Toasts notifications in game HUD
  const [toasts, setToasts] = useState<{ id: string; text: string; type: "gain" | "loss" | "alert" }[]>([]);

  // --- Open Modals ---
  const [isHostOpen, setIsHostOpen] = useState<boolean>(false);
  const [isRelationsOpen, setIsRelationsOpen] = useState<boolean>(false);
  const [isMapOpen, setIsMapOpen] = useState<boolean>(false);
  const [isInventoryOpen, setIsInventoryOpen] = useState<boolean>(false);
  const [isSkillsOpen, setIsSkillsOpen] = useState<boolean>(false);
  const [isChroniclesOpen, setIsChroniclesOpen] = useState<boolean>(false);
  const [isWorldEventsOpen, setIsWorldEventsOpen] = useState<boolean>(false);
  const [isMissionsOpen, setIsMissionsOpen] = useState<boolean>(false);
  const [isTerminalOpen, setIsTerminalOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isSavesOpen, setIsSavesOpen] = useState<boolean>(false);
  const [isOverviewOpen, setIsOverviewOpen] = useState<boolean>(false);

  // Custom message context menu and edit states
  const [contextMenu, setContextMenu] = useState<{
    visible: boolean;
    x: number;
    y: number;
    logId: string;
    logText: string;
  } | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isQuickMenuOpen, setIsQuickMenuOpen] = useState<boolean>(false);
  const [editingLogId, setEditingLogId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState<string>("");

  // --- Theme Configurations States ---
  const [presetTheme, setPresetTheme] = useState<"black-gold" | "green-white" | "red-white" | "gray-white" | "yellow-white">("black-gold");
  const [primaryColor, setPrimaryColor] = useState<string>("#090e1c");
  const [accentColor, setAccentColor] = useState<string>("#f59e0b");
  const [fontSize, setFontSize] = useState<number>(15);
  const [minorX, setMinorX] = useState<number>(5);
  const [majorY, setMajorY] = useState<number>(25);
  const [autoZ, setAutoZ] = useState<number>(20);

  // --- Save files lists ---
  const [savedGames, setSavedGames] = useState<{ id: string; name: string; date: string; info: string; data: any }[]>([]);

  // Initial setup loads
  useEffect(() => {
    // Load local archives lists
    const stored = localStorage.getItem("chrono_chronicles_saves_index");
    if (stored) {
      setSavedGames(JSON.parse(stored));
    } else {
      const demoSaves = [
        { 
          id: "save_demo_1", 
          name: "自动存档·大明甲申劫", 
          date: "2026-06-16 11:00", 
          info: "崇祯十七年·朱由检 - 保皇党高涨",
          data: null 
        }
      ];
      setSavedGames(demoSaves);
      localStorage.setItem("chrono_chronicles_saves_index", JSON.stringify(demoSaves));
    }

    // Dismiss context menu
    const handleDismissMenu = () => {
      setContextMenu(null);
      setIsQuickMenuOpen(false);
    };
    window.addEventListener("click", handleDismissMenu);

    // Watch fullscreen state changes
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      window.removeEventListener("click", handleDismissMenu);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  // Spawn visual notification toasts
  const triggerToast = (text: string, type: "gain" | "loss" | "alert") => {
    const id = "toast_" + Date.now() + Math.random();
    setToasts(prev => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  // Safe utilities to extract text copying to clipboard
  const handleCopyMessage = (text: string) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text)
        .then(() => triggerToast("📋 已成功复制消息到剪贴板！", "gain"))
        .catch(() => fallbackCopy(text));
    } else {
      fallbackCopy(text);
    }
  };

  const fallbackCopy = (text: string) => {
    try {
      const el = document.createElement("textarea");
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      triggerToast("📋 已成功复制消息！(兼容模式)", "gain");
    } catch (e) {
      triggerToast("⚠️ 复制失败，请手动选择复制", "loss");
    }
  };

  const handleLogContextMenu = (e: React.MouseEvent, logId: string, logText: string) => {
    e.preventDefault();
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      logId,
      logText
    });
  };

  const handleResend = () => {
    // Find the last player decision in the narrative logs where mode === "action"
    const actionLogs = narrativeLogs.filter(log => log.mode === "action");
    let textToResend = "";
    if (actionLogs.length > 0) {
      const lastLog = actionLogs[actionLogs.length - 1];
      // Try to extract text inside double quotes of style: 【您的决断】: "XXX"
      const match = lastLog.text.match(/【您的决断】:\s*"(.*)"/);
      if (match && match[1]) {
        textToResend = match[1];
      } else {
        textToResend = lastLog.text.replace(/^【您的决断】:?\s*"/, "").replace(/"$/, "");
      }
    }

    if (!textToResend && actionInput.trim()) {
      textToResend = actionInput.trim();
    }

    if (textToResend) {
      processTurnNext(textToResend);
      triggerToast(`✨ 重开演化，重新发送决策: "${textToResend}"`, "gain");
    } else {
      triggerToast("⚠️ 暂无上一回合决断可重新发送。", "alert");
    }
  };

  const handleContinue = () => {
    processTurnNext("继续面圣/推进时间");
    triggerToast("⏩ 时衍流转，因果顺利继续前行！", "gain");
  };

  const handleContinueWithVariants = () => {
    const variants = [
      "天演重置，时空涟漪起伏，各方边镇军响调派",
      "天候忽变，瑞气或风沙盘旋，京畿守卫振奋",
      "太仓夜来漕船，江南粮米抵临中堂",
      "朝阁议政，六部辅臣谏退谗臣，社稷之势微升",
      "御带亲军夜演火神机，京师内外严防守序",
      "星斗重整，天机回溯变数偶降"
    ];
    const randomVariant = variants[Math.floor(Math.random() * variants.length)];
    processTurnNext(`继续面圣（触发因果变数：${randomVariant}）`);
    triggerToast(`🔮 成功触发时空变数: "${randomVariant}"`, "gain");
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error("Error enabling fullscreen:", err);
        triggerToast("⚠️ 浏览器限制，全屏请求可能被阻止，可尝试在新窗口中打开", "alert");
      });
    } else {
      document.exitFullscreen().catch((err) => {
        console.error("Error exiting fullscreen:", err);
      });
    }
  };

  // --- Gameplay Simulation Functions ---

  const initSimulation = (timeline: TimelineType) => {
    let preset = TIMELINE_PRESETS[timeline || TimelineType.MING];
    
    if (timeline === TimelineType.CUSTOM) {
      preset = {
        ...preset,
        era: customTime.trim() || "建安二十四年麦城",
        hostName: customIdentity.trim() || "关羽",
        title: customIdentity.trim() ? `【自定】${customIdentity}` : "【自定】九皇创世契境",
        desc: "大江波澜，时空潮汐在此汇聚。",
        startingStory: `【时空注入】宿主意志成功载入 ${customTime.trim() || "建安二十四年麦城"} 的 ${customLocation.trim() || "重兵大围之景"}，化身为 【${customIdentity.trim() || "关羽"}】。灵魂接驳通道开启，头脑中载入了 【${selectedTemplate === SystemTemplateSpec.CUSTOM ? (customSysName || "定制因果神机总线") : selectedTemplate}】。宿命真元觉醒，至高天赋 【${selectedTalent === TalentSpec.CUSTOM ? (customTalentName || "天运自选至尊神异") : selectedTalent}】 （秉性：${selectedTalent === TalentSpec.CUSTOM ? (customTalentDesc || "凌驾乾坤因果律之秘") : "天衍造化"}） 凝聚眉心，誓打破一切凡宿，重铸神话江山！`,
        initialNpcs: [
          { id: "npc_custom_1", name: "王承恩", role: "大内伴同司礼监", avatarId: "ri-user-star-fill", loyalty: 95, affection: 90, faction: "保皇党", status: "活耀", notableDeeds: "终其一生追随于您。可解闷相谈，勤饷筹银、提升各省的保皇控制权重。" },
          { id: "npc_custom_2", name: "怀二心降卫", role: "叛贼密谋暗结哨将", avatarId: "ri-user-unfollow-fill", loyalty: 25, affection: 15, faction: "起义军", status: "活耀", notableDeeds: "怀二心。里通流盗。宿主可在文华殿或午门悍然处斩以行威，重塑朝仪！" }
        ],
        initialProvinces: [
          { id: "p_custom_1", name: customLocation.trim() || "自定行宫府", population: 1500, control: "保皇党", controlPercent: 80, taxRate: 15, defenseLevel: 70, unrest: 15 },
          { id: "p_custom_2", name: "中原边陲沦陷省", population: 1800, control: "起义军", controlPercent: 20, taxRate: 30, defenseLevel: 30, unrest: 85 }
        ],
        recommendedDecisions: [
          "派遣戍卫禁曲、行免赋除暴、打温关系提升官员好感",
          "修研典籍以增智政魅力，调用饷库充抵军机"
        ]
      };
    }
    
    // Assign stats based on choices
    let pName = setupHostName.trim() || preset.hostName.split(" ")[0];
    setPlayerName(pName);
    setGender(setupGender);
    setTimelineType(timeline);
    setSystemSpec(selectedTemplate === SystemTemplateSpec.CUSTOM ? (customSysName || "自定义因果机芯") : selectedTemplate);
    setTalentSpec(selectedTalent === TalentSpec.CUSTOM ? (customTalentName || "自定义至高命格") : selectedTalent);

    // Initial narrative configs
    setCurrentEraText(preset.era);
    setNpcs(JSON.parse(JSON.stringify(preset.initialNpcs)));
    setProvinces(JSON.parse(JSON.stringify(preset.initialProvinces)));
    setCurrentRecommendations(preset.recommendedDecisions);
    
    // Core inventory loading
    const defaultBackpack = [...INITIAL_ITEMS];
    // Push custom multi-selected items
    setupItems.forEach((itName, idx) => {
      // Find matching template in ALL_ITEMS_STORE to copy description
      const foundItem = ALL_ITEMS_STORE.find(store => store.name.includes(itName.replace(/【|】/g, '')));
      if (foundItem) {
        defaultBackpack.push({
          id: `custom_setup_${idx}_${foundItem.id}`,
          name: foundItem.name,
          quantity: 1,
          rarity: foundItem.rarity,
          description: foundItem.description,
          equipped: false,
          canUse: foundItem.canUse,
          effect: foundItem.effect,
          goldValue: foundItem.goldValue
        });
      }
    });
    setInventory(defaultBackpack);

    // Initial Attributes calibration
    const startingAttributes = {
      hp: 100,
      maxHp: 100,
      lifespan: selectedTalent === TalentSpec.ENDURANCE ? 90 : 60,
      strength: selectedTalent === TalentSpec.ALCHEMY ? 25 : 18,
      intelligence: selectedTalent === TalentSpec.INSIGHT ? 28 : 20,
      charisma: selectedTalent === TalentSpec.HYPNOSIS ? 24 : 18,
      luck: selectedTalent === TalentSpec.DIVINATION ? 75 : 50,
      emperorPrestige: selectedTemplate === SystemTemplateSpec.FOOLISH ? 15 : 40,
      karma: selectedTemplate === SystemTemplateSpec.NONE ? 65 : 40
    };

    if (selectedTemplate === SystemTemplateSpec.NONE) {
      startingAttributes.maxHp += 80;
      startingAttributes.hp = startingAttributes.maxHp;
    }

    setAttributes(startingAttributes);
    setGold(selectedTemplate === SystemTemplateSpec.MERCHANT ? 6000 : 3000);
    setSystemPoints(selectedTemplate === SystemTemplateSpec.SIGNIN ? 1000 : 500);
    setLevelName(selectedTemplate === SystemTemplateSpec.NONE ? "人间武侯 证德宗师" : "虚空接驳一阶 宿主初萌");

    // Clear logs and push starting narrative
    const pStory = preset.startingStory;
    const sysNameText = selectedTemplate === SystemTemplateSpec.CUSTOM ? (customSysName || "定制神机总线") : selectedTemplate;
    const talentText = selectedTalent === TalentSpec.CUSTOM ? (customTalentName || "天运自选") : selectedTalent;
    const itemsText = setupItems.length > 0 ? setupItems.join("、") : "无";

    setNarrativeLogs([
      { text: `【天演模拟·开场】${pStory}`, mode: "dialogue", id: "lg_s2" }
    ]);

    // Construct starting missions
    const initMissions: Mission[] = [
      { id: "m_1", title: "时空中枢整肃", desc: "提升宿主威严达到 60 点，以此震慑百官集团。", type: "主线羁绊", target: "emperorPrestige", progress: startingAttributes.emperorPrestige, targetValue: 60, rewardDesc: "800银 + 400积分", penaltyDesc: "国祚气数扣减 15 点，满朝文官忠诚度额外丧失 10 点，爆发不可逆的臣僚刺杀案", completed: false, claimed: false },
      { id: "m_2", title: "州郡安民敕令", desc: "使用『蠲税赈灾』或『民兵护卫』降低本省民怨至 50% 以下。", type: "模拟经营", target: "unrest", progress: Math.min(...preset.initialProvinces.map(p => p.unrest)), targetValue: 50, rewardDesc: "1200银 + 600积分", penaltyDesc: "全疆生民民怨暴乱增加 35%，引发各地刁民揭竿而起叛乱，州省防卫全面瘫痪", completed: false, claimed: false },
      { id: "m_3", title: "诸神觉醒神识", desc: "在系统控制或施展天赋神法中，累计耗费气运或消耗达 3 次以上。", type: "系统特派", target: "skillsCast", progress: 0, targetValue: 3, rewardDesc: "神话水稻种子 + 200银", penaltyDesc: "时空节点灵脉断裂反噬，扣减 20 点体力最大上限及 15 点精力值", completed: false, claimed: false }
    ];
    setMissions(initMissions);

    // Initial celestial threats
    const initEvents: WorldEvent[] = [
      { id: "we_1", title: "逆贼刘宗敏誓师攻门", severity: "毁灭性", location: "京畿顺天府", desc: "叛军前锋已抵达城东门。若掌控率归零，将诱使天下沦亡！耗废军兵戍守可抵挡围逼。", durationLeft: 5 }
    ];
    setWorldEvents(initEvents);

    setChronicles([]);
    setIsStarted(true);
    triggerToast("时空锚定接连成功！意识数据已注入宿体。", "gain");
  };

  // Turn Progression core loop (simulated LLM GM responses directly on the client!)
  const processTurnNext = (playerInputText: string) => {
    if (!playerInputText) return;

    // Push player's decision to logs
    const newLogId = "act_" + Date.now();
    setNarrativeLogs(prev => [...prev, { text: `【您的决断】: "${playerInputText}"`, mode: "action", id: newLogId }]);

    // Calculate simulated narrative and stat outcomes based on standard regex keywords!
    // This allows outstanding responsive, fun sandbox-RPG simulation running directly inside React!
    let outputNarrative = "";
    let goldAdjustment = 0;
    let pointsAdjustment = 30; // standard turn gain
    let damageHp = 0;
    
    // Core attributes adjustments multipliers
    let strengthGain = 0;
    let intelligenceGain = 0;
    let charismaGain = 0;
    let prestigeGain = 0;
    let karmaGain = 0;

    const lowerInput = playerInputText.toLowerCase();

    // Context analysis keywords
    if (lowerInput.includes("岳飞") || lowerInput.includes("岳家军") || lowerInput.includes("召集二路") || lowerInput.includes("勤王")) {
      outputNarrative = "「天降天将岳鹏举！」您在案桌前挥起御宝诏书宣照天下勤王。传令快马星夜驰往河北，岳字金戈白旗飞扬。天下忠魂之众听闻天子有令，士气大涨！京城兵部守城信心狂增，保皇党在京畿防线和关口的防卫等级暴涨 +25%。";
      prestigeGain += 15;
      goldAdjustment -= 400;
      karmaGain += 10;
      
      // Update provinces: Peking control rises
      setProvinces(prev => prev.map(p => p.name.includes("京师") || p.name.includes("汴梁") ? { ...p, controlPercent: Math.min(100, p.controlPercent + 20), unrest: Math.max(0, p.unrest - 15) } : p));
      triggerToast("防务加持：京师实控恢复 +20%", "gain");
    } 
    else if (lowerInput.includes("吴三桂") || lowerInput.includes("关宁铁骑") || lowerInput.includes("割地") || lowerInput.includes("入关")) {
      outputNarrative = "「三桂接旨，徘徊未前。」调动平西伯入燕京。使臣捧着金册入山海关辽东，吴三桂望着南方烽火，眼神明灭不定，虽领御赐大赏，但仍在窥查关外敌情。吴三桂好感小涨，但军事勤王大驾尚未整拔。";
      goldAdjustment -= 500;
      
      // Adjust NPC loyalty of Wu Sangui
      setNpcs(prev => prev.map(n => n.name.includes("吴三桂") ? { ...n, loyalty: Math.min(100, n.loyalty + 25) } : n));
      triggerToast("吴三桂忠心度上升了 +25", "gain");
    } 
    else if (lowerInput.includes("杀死") || lowerInput.includes("处决") || lowerInput.includes("斩杀") || lowerInput.includes("除害") || lowerInput.includes("魏藻德") || lowerInput.includes("王振")) {
      outputNarrative = "「天子法刀，雷霆诛绝！」您满脸寒霜，大殿上拍案宣召百官。殿前执鞭近卫齐出，如老鹰抓小鸡般将那些贪赃怀抱降大顺的权阉叛逆按押。法场刀斧手人头翻落！朝中正气凛然，保皇人心大悦，帝王威严飙升！其他权监的忠诚瞬间得到最大威慑锁死！";
      prestigeGain += 20;
      karmaGain += 5;
      goldAdjustment += 200; // seized estates
      
      // Execute match in NPCs
      setNpcs(prev => prev.map(n => n.name.includes("魏藻德") || n.name.includes("王振") ? { ...n, status: "已处决", loyalty: 0 } : n));
      triggerToast("震慑群属：帝王威望 +20", "gain");
    } 
    else if (lowerInput.includes("开仓") || lowerInput.includes("放粮") || lowerInput.includes("平粜") || lowerInput.includes("免税") || lowerInput.includes("蠲免")) {
      outputNarrative = "「天恩浩荡，百姓争颂。」您连下七道免税抚民圣旨，拨调江南皇家储备陈米百万，顺河漕运赈济本郡。各地饥肠辘辘的饿民伏地大哭，手持麦秸焚香祝福万岁。各地暴逆闯匪的流匪动员之势大减！地方民怨呈崩裂式下降。";
      goldAdjustment -= 600;
      intelligenceGain += 5;
      charismaGain += 10;
      
      // Decrease unrest globally
      setProvinces(prev => prev.map(p => ({ ...p, unrest: Math.max(10, p.unrest - 30) })));
      triggerToast("民生安泰：地方民怨急剧下降 -30%", "gain");
    } 
    else if (lowerInput.includes("开火") || lowerInput.includes("红夷大炮") || lowerInput.includes("大炮") || lowerInput.includes("加特林") || lowerInput.includes("厮杀")) {
      outputNarrative = "「神机开山，万弹齐发！」城墙之上，重重布设的火神武器咆哮破空。天星坠地，震耳欲聋。漫天火网夹着黑药硝烟瞬间将攻城先锋扫荡。叛军伤亡惨烈，不得不向外溃退十里！守备力量大稳！";
      strengthGain += 8;
      goldAdjustment -= 300;
      
      // Decrease enemies world event countdown
      setWorldEvents(prev => prev.map(we => we.title.includes("刘宗敏") ? { ...we, durationLeft: Math.max(0, we.durationLeft - 1) } : we));
      triggerToast("武力激扬：击溃攻城流军精锐！", "gain");
    }
    else {
      // Default sandbox progression AI response
      outputNarrative = `「宿运随指变易。」天演大帝诏令下达。时空中因果线丝缕重新排布。伴随着岁月的运转，周边势力对于宿主的变动做出了微调。有秘探报称北方侵寇或军阀动向正在紧锣密鼓整顿。请继续布防。`;
      intelligenceGain += 2;
      karmaGain += 2;
    }

    // Step turn values
    const nextTurn = turnCount + 1;
    const nextYear = currentYear + (nextTurn % 4 === 0 ? 1 : 0);
    setTurnCount(nextTurn);
    setCurrentYear(nextYear);

    // Apply incremental adjustments safely
    setGold(prev => Math.max(0, prev + goldAdjustment + 350)); // default turn taxes revenue +350
    setSystemPoints(prev => prev + pointsAdjustment);
    
    setAttributes(prev => {
      const updated = {
        ...prev,
        hp: Math.max(10, Math.min(prev.maxHp, prev.hp - damageHp)),
        strength: prev.strength + strengthGain,
        intelligence: prev.intelligence + intelligenceGain,
        charisma: prev.charisma + charismaGain,
        emperorPrestige: Math.max(0, prev.emperorPrestige + prestigeGain),
        karma: Math.max(0, prev.karma + karmaGain)
      };
      
      // Active check missions updates
      setMissions(mList => mList.map(m => {
        if (m.target === "emperorPrestige") {
          const currentVal = updated.emperorPrestige;
          return { ...m, progress: currentVal, completed: currentVal >= m.targetValue };
        }
        return m;
      }));

      return updated;
    });

    // Append to timelines chronicles log
    const indexChronicle: ChronicleRecord = {
      id: "ch_" + Date.now(),
      year: `第 ${nextYear} 年·孟秋巡回`,
      chapter: `流转演变`,
      eventText: outputNarrative,
      playerDecision: playerInputText,
      dynamicPrompt: `[天演协议V4.1] PlayerName=${playerName}, Gold=${gold + goldAdjustment}, Prestige=${attributes.emperorPrestige + prestigeGain}. SystemTemplate=${systemSpec}. Processing action: "${playerInputText}"`,
      impactDesc: `银两收支: ${goldAdjustment >= 0 ? "+" : ""}${goldAdjustment}, 气运威仪: ${prestigeGain >= 0 ? "+" : ""}${prestigeGain}`,
      timestamp: new Date().toLocaleTimeString("zh-CN", { hour: '2-digit', minute:'2-digit' })
    };
    setChronicles(prev => [indexChronicle, ...prev]);

    // Push GM speech output
    setNarrativeLogs(prev => [...prev, { text: outputNarrative, mode: "dialogue", id: "lg_narr_" + Date.now() }]);

    // Slowly tick down world events timer
    setWorldEvents(prev => prev.map(we => ({ ...we, durationLeft: we.durationLeft - 1 })).filter(we => we.durationLeft > 0));

    // Post turn cleanups and hints
    setActionInput("");
    triggerToast("时空推进：新一轮世景已装载", "gain");
  };

  // Triggering the custom decision card
  const handleRecommendationClick = (decisionText: string) => {
    processTurnNext(decisionText);
  };

  // --- Modal Events and Upgrades Interactions ---

  const handleUpgradeAttribute = (attr: keyof PlayerAttributes, cost: number, val: number, costType: "gold" | "points") => {
    if (costType === "gold") {
      if (gold < cost) return;
      setGold(prev => prev - cost);
    } else {
      if (systemPoints < cost) return;
      setSystemPoints(prev => prev - cost);
    }

    setAttributes(prev => ({
      ...prev,
      [attr]: (prev[attr] as number) + val,
      // If upgraded MaxHP, also increment current HP
      ...(attr === "maxHp" ? { hp: prev.hp + val } : {})
    }));

    triggerToast(`属性加温：${attr.toUpperCase()} 提升 +${val}`, "gain");
  };

  const handleInteractNPC = (npcId: string, action: "bribe" | "converse" | "execute", cost: number) => {
    if (action === "bribe") {
      if (gold < cost) return;
      setGold(prev => prev - cost);
      setNpcs(prev => prev.map(n => n.id === npcId ? { ...n, loyalty: Math.min(100, n.loyalty + 30) } : n));
      triggerToast("金银打通：忠诚度大幅提高 +30%", "gain");
    } 
    else if (action === "converse") {
      setNpcs(prev => prev.map(n => n.id === npcId ? { ...n, affection: Math.min(100, n.affection + 15) } : n));
      triggerToast("促膝长谈：私人好感上涨了 +15%", "gain");
    } 
    else if (action === "execute") {
      setNpcs(prev => prev.map(n => n.id === npcId ? { ...n, status: "已处决", loyalty: 0 } : n));
      setAttributes(prev => ({ ...prev, emperorPrestige: prev.emperorPrestige + 15 }));
      triggerToast("雷霆极刑：处斩大臣威慑百官，威严 +15", "loss");
    }
  };

  const handleUpdateProvince = (provinceId: string, action: "send_troops" | "reduce_tax" | "levy", goldCost: number) => {
    if (goldCost > 0 && gold < goldCost) return;
    
    setGold(prev => prev - goldCost);
    setProvinces(prev => prev.map(p => {
      if (p.id !== provinceId) return p;

      if (action === "send_troops") {
        return {
          ...p,
          controlPercent: Math.min(100, p.controlPercent + 20),
          unrest: Math.max(10, p.unrest - 15),
          defenseLevel: Math.min(100, p.defenseLevel + 25)
        };
      } 
      else if (action === "reduce_tax") {
        return {
          ...p,
          unrest: Math.max(10, p.unrest - 25),
          taxRate: Math.max(10, p.taxRate - 15)
        };
      }
      else if (action === "levy") {
        // Yield emergency gold
        setGold(g => g + 400);
        return {
          ...p,
          unrest: Math.min(100, p.unrest + 30),
          controlPercent: Math.max(10, p.controlPercent - 15)
        };
      }
      return p;
    }));

    if (action === "levy") {
      triggerToast("紧急搜刮：横征赋税！国库存金上升但民愤极大！", "loss");
    } else {
      triggerToast("州郡安抚：治理敕令下达成功！", "gain");
    }
  };

  const handleUseItemFromBag = (itemId: string) => {
    // Check item matching
    setInventory(prev => prev.map(i => {
      if (i.id !== itemId) return i;
      
      if (itemId.includes("rice")) {
        // Sowl seed
        setProvinces(provs => provs.map(p => ({ ...p, unrest: Math.max(10, p.unrest - 30) })));
        triggerToast("播撒杂交种子！治下省份民生物资饱足，民怨骤减 30%！", "gain");
        return { ...i, quantity: i.quantity - 1 };
      }
      else if (itemId.includes("bowl")) {
        setAttributes(a => ({ ...a, karma: a.karma + 50 }));
        triggerToast("执持祖龙丐碗！命盘感知大气重聚，气运暴增 +50！", "gain");
        return { ...i, quantity: i.quantity - 1 };
      }
      return i;
    }).filter(i => i.quantity > 0));
  };

  const handleDiscardItemFromBag = (itemId: string) => {
    setInventory(prev => prev.filter(i => i.id !== itemId));
    triggerToast("成功物理丢弃物品！数据回归荒无量子态。", "alert");
  };

  const handleToggleEquipFromBag = (itemId: string) => {
    let wasEquipped = false;
    setInventory(prev => prev.map(i => {
      if (i.id !== itemId) return i;
      wasEquipped = i.equipped;
      const willEquip = !i.equipped;
      
      // Dynamic adjustments based on is equipped
      if (itemId.includes("vest")) {
        setAttributes(a => ({
          ...a,
          maxHp: willEquip ? a.maxHp + 60 : Math.max(10, a.maxHp - 60),
          hp: willEquip ? a.hp + 60 : Math.max(5, a.hp - 60)
        }));
      } else if (itemId.includes("sword")) {
        setAttributes(a => ({
          ...a,
          strength: willEquip ? a.strength + 15 : Math.max(1, a.strength - 15)
        }));
      }

      return { ...i, equipped: willEquip };
    }));

    triggerToast(wasEquipped ? "装备已被成功卸下。" : "装备挂置已顺利完成！", "gain");
  };

  const handleBuyItemFromShop = (shopItem: Omit<InventoryItem, "quantity" | "equipped">) => {
    if (gold < shopItem.goldValue) return;
    setGold(prev => prev - shopItem.goldValue);

    // Add to backpack
    setInventory(prev => {
      const idx = prev.findIndex(i => i.id === shopItem.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx].quantity += 1;
        return copy;
      } else {
        return [...prev, {
          ...shopItem,
          quantity: 1,
          equipped: false
        }];
      }
    });

    triggerToast(`交易购得：【${shopItem.name}】已传输至您的量子储藏间！`, "gain");
  };

  const handleTriggerMagicSkill = (skillId: string, karmaCost: number) => {
    setAttributes(prev => ({ ...prev, karma: prev.karma - karmaCost }));

    if (skillId === "spell_alchemy") {
      setGold(prev => prev + 400);
      triggerToast("神术：发动点石成金！皇家银两瞬间飞升 +400！", "gain");
    } 
    else if (skillId === "spell_insight") {
      // Pick random NPC and maximize trust
      setNpcs(prev => prev.map((n, idx) => idx === 0 ? { ...n, loyalty: 100, notableDeeds: n.notableDeeds + " (已被宿主神识洞穿心防)" } : n));
      triggerToast("神术：洞察施展。成功降服重臣忠信归一！", "gain");
    }
    else if (skillId === "spell_endurance") {
      setAttributes(prev => ({ ...prev, maxHp: prev.maxHp + 40, hp: Math.min(prev.maxHp + 40, prev.hp + 40) }));
      triggerToast("神术：气血周天！最大HP持久获得 +40 锻体！", "gain");
    }
    else {
      triggerToast("神术发动顺利：天行变化，防线隐蔽完成！", "gain");
    }

    // Update quest counts
    setMissions(prev => prev.map(m => m.id === "m_3" ? { ...m, progress: Math.min(m.targetValue, m.progress + 1), completed: m.progress + 1 >= m.targetValue } : m));
  };

  const handleClaimQuest = (missionId: string) => {
    setMissions(prev => prev.map(m => {
      if (m.id !== missionId) return m;
      
      if (missionId === "m_1") {
        setGold(g => g + 800);
        setSystemPoints(p => p + 400);
      } else if (missionId === "m_2") {
        setGold(g => g + 1200);
        setSystemPoints(p => p + 600);
      } else {
        // Sowl seeds
        setInventory(inv => [...inv, {
          id: "item_claimed_seeds",
          name: "高产杂交水稻种子",
          quantity: 1,
          rarity: "史诗",
          description: "历练颁发的量子物资，高产防害种子。",
          equipped: false,
          canUse: true,
          goldValue: 4000
        }]);
      }
      return { ...m, claimed: true };
    }));
    triggerToast("法旨福赏领取完毕！物资奖励入库！", "gain");
  };

  const handleAbandonQuest = (missionId: string) => {
    setMissions(prev => prev.filter(m => m.id !== missionId));
    triggerToast("已物理放弃此项因果规诰契诺！", "alert");
  };

  const handleManualSubmitQuest = (missionId: string) => {
    setMissions(prev => prev.map(m => m.id === missionId ? { ...m, completed: true, progress: m.targetValue } : m));
    triggerToast("法旨手动交付成功！福赏已对现归位！", "gain");
  };

  // DRAW CARDS ACTION FOR SPECIAL CHOSEN SYSTEM
  const handleDrawSystemCard = (pointsCost: number) => {
    setSystemPoints(p => Math.max(0, p - pointsCost));
    // Spawn random hero card from preset cards
    const pool = SYSTEM_CARDS_POOL;
    const rolled = pool[Math.floor(Math.random() * pool.length)];

    // Put into owner list
    setOwnedSystemCards(prev => {
      if (prev.find(c => c.id === rolled.id)) {
        // Duplicate compensation points
        setSystemPoints(p => p + 50);
        triggerToast(`召唤到重复卡牌【${rolled.name}】，转换为 +50 补偿积分！`, "gain");
        return prev;
      }
      return [...prev, { ...rolled, claimed: true }];
    });

    triggerToast(`大命觉醒！金光一闪召引得：【${rolled.name}】！`, "gain");
  };

  const handleSignInRegistry = () => {
    setGold(g => g + 300);
    // Grant Gatling or sand Eagle randomly!
    const rollGatlingChance = Math.random() >= 0.5;
    const rewardItemName = rollGatlingChance ? "加特林重机枪" : "沙漠之鹰手枪";
    const shopRef = ALL_ITEMS_STORE.find(store => store.name.includes(rewardItemName))!;

    setInventory(prev => [...prev, {
      id: "signin_reward_" + Date.now(),
      name: shopRef.name,
      quantity: 1,
      rarity: shopRef.rarity,
      description: shopRef.description,
      equipped: false,
      canUse: shopRef.canUse,
      effect: shopRef.effect,
      goldValue: shopRef.goldValue
    }]);

    triggerToast(`签到大吉！获得银两 +300 及传说武器【${rewardItemName}】！`, "gain");
  };

  const handleSlackAction = (pointsGained: number, hpGained: number, textReport: string) => {
    setSystemPoints(p => p + pointsGained);
    setAttributes(prev => ({ ...prev, hp: Math.max(15, Math.min(prev.maxHp, prev.hp + hpGained)) }));
    setNarrativeLogs(prev => [...prev, { text: `[摆烂报告]: ${textReport}`, mode: "warn", id: "slack_" + Date.now() }]);
    triggerToast(`怠懈放歌：摆烂积分变动！健康气血恢复。`, "gain");
  };

  const handleIssueSystemDecree = (title: string, statMods: any, costGold: number, costPoints: number) => {
    // Immediate state adjustments
    setGold(prev => Math.max(0, prev + (statMods.gold || 0)));
    setSystemPoints(prev => Math.max(0, prev + (statMods.points || 0)));
    
    setAttributes(prev => ({
      ...prev,
      emperorPrestige: Math.max(10, prev.emperorPrestige + (statMods.prestige || 0)),
      strength: prev.strength + (statMods.strength || 0),
      intelligence: prev.intelligence + (statMods.intelligence || 0),
      karma: Math.max(5, prev.karma + (statMods.karma || 0))
    }));

    setNarrativeLogs(prev => [...prev, { text: `[系统行纪] 颁布行宪法旨：【${title}】。宿体与皇纲因果律发生了深度改变！`, mode: "system", id: "dec_" + Date.now() }]);
    triggerToast(`法旨颁布成功！属性发生了剧变。`, "gain");
  };

  // --- Local Database Archives Operations ---

  const handleSaveActiveGame = () => {
    const backupId = "save_" + Date.now();
    const backupName = `时空归降·${playerName}·${currentEraText}`;
    const descInfo = `${timelineType}·主攻第 ${turnCount} 载`;

    const fullPackage = {
      playerName, gender, timelineType, systemSpec, talentSpec,
      attributes, gold, systemPoints, levelName, currentYear, turnCount,
      npcs, provinces, inventory, missions, worldEvents, chronicles, ownedSystemCards
    };

    const newSaveRecord = {
      id: backupId,
      name: backupName,
      date: new Date().toLocaleString("zh-CN"),
      info: descInfo,
      data: fullPackage
    };

    const updatedIndex = [newSaveRecord, ...savedGames.filter(s => s.id !== "save_demo_1")];
    setSavedGames(updatedIndex);
    localStorage.setItem("chrono_chronicles_saves_index", JSON.stringify(updatedIndex));
    // Save state payloads
    localStorage.setItem(`chrono_payload_${backupId}`, JSON.stringify(fullPackage));

    triggerToast("时空锚点存档保存顺利！", "gain");
  };

  const handleLoadSelectedGame = (saveId: string) => {
    if (saveId === "save_demo_1") {
      alert("演示数据暂无法接种实体，请进行一键开局！");
      return;
    }

    const raw = localStorage.getItem(`chrono_payload_${saveId}`);
    if (!raw) {
      alert("归降电文残缺！读取失败。");
      return;
    }

    try {
      const state = JSON.parse(raw);
      setPlayerName(state.playerName || "旅行者");
      setGender(state.gender || "男性");
      setTimelineType(state.timelineType || TimelineType.MING);
      setSystemSpec(state.systemSpec || SystemTemplateSpec.CARD);
      setTalentSpec(state.talentSpec || TalentSpec.INSIGHT);
      setAttributes(state.attributes);
      setGold(state.gold);
      setSystemPoints(state.systemPoints);
      setLevelName(state.levelName);
      setCurrentYear(state.currentYear || 1);
      setTurnCount(state.turnCount || 1);
      setNpcs(state.npcs || []);
      setProvinces(state.provinces || []);
      setInventory(state.inventory || []);
      setMissions(state.missions || []);
      setWorldEvents(state.worldEvents || []);
      setChronicles(state.chronicles || []);
      setOwnedSystemCards(state.ownedSystemCards || []);

      setIsStarted(true);
      setIsSavesOpen(false);

      // Re-trigger starting narrations
      setNarrativeLogs([
        { text: `[系统日志] 提取意识归还。时空复位完成: "${state.playerName}" 降界。`, mode: "system", id: "lg_ld_a" }
      ]);

      triggerToast("量子溯源接通完成！时空完美复位。", "gain");
    } catch(err) {
      alert("量子解包错误，重构失败。");
    }
  };

  const handleDeleteGameSave = (saveId: string) => {
    const updated = savedGames.filter(s => s.id !== saveId);
    setSavedGames(updated);
    localStorage.setItem("chrono_chronicles_saves_index", JSON.stringify(updated));
    localStorage.removeItem(`chrono_payload_${saveId}`);
    triggerToast("指定备份已被量子粉碎抹除！", "loss");
  };

  // --- Export & Import Saves ---
  const handleExportAllSaves = () => {
    const records: Record<string, any> = {};
    savedGames.forEach(record => {
      if (record.id !== "save_demo_1") {
        const raw = localStorage.getItem(`chrono_payload_${record.id}`);
        if(raw) records[record.id] = JSON.parse(raw);
      }
    });

    const packageData = {
      index: savedGames,
      payloads: records
    };

    const blob = new Blob([JSON.stringify(packageData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `天演时空存档_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    triggerToast("时空谱图备份已下载导出！", "gain");
  };

  const handleImportSaves = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const gReader = new FileReader();
    gReader.onload = (evt) => {
      try {
        const pkg = JSON.parse(evt.target?.result as string);
        if (pkg && pkg.index && pkg.payloads) {
          setSavedGames(pkg.index);
          localStorage.setItem("chrono_chronicles_saves_index", JSON.stringify(pkg.index));
          Object.keys(pkg.payloads).forEach(key => {
            localStorage.setItem(`chrono_payload_${key}`, JSON.stringify(pkg.payloads[key]));
          });
          alert("时空谱图导入并合并完成！可以随时点按读取神识。");
        } else {
          alert("量子归降文件格式损坏，提取失败。");
        }
      } catch (err) {
        alert("打包重构解析遇阻！");
      }
    };
    gReader.readAsText(file);
    e.target.value = "";
  };

  // --- Custom Theme Setup functions ---
  const applyPresetTheme = (theme: "black-gold" | "green-white" | "red-white" | "gray-white" | "yellow-white") => {
    setPresetTheme(theme);
    if (theme === "black-gold") {
      setPrimaryColor("#030408");
      setAccentColor("#f59e0b");
    } else if (theme === "green-white") {
      setPrimaryColor("#061c0d");
      setAccentColor("#34d399");
    } else if (theme === "red-white") {
      setPrimaryColor("#1a0505");
      setAccentColor("#f43f5e");
    } else if (theme === "gray-white") {
      setPrimaryColor("#0f172a");
      setAccentColor("#94a3b8");
    } else if (theme === "yellow-white") {
      setPrimaryColor("#1c1605");
      setAccentColor("#eab308");
    }
  };

  // Setup options checkers
  const handleSetupItemToggle = (itemName: string) => {
    if (setupItems.includes(itemName)) {
      setSetupItems(prev => prev.filter(i => i !== itemName));
    } else {
      if (setupItems.length >= 3) {
        alert("量子装载负荷受限，初始物资最多带 3 项！");
        return;
      }
      setSetupItems(prev => [...prev, itemName]);
    }
  };

  const handleContinueGame = () => {
    const actualSaves = savedGames.filter(s => s.id !== "save_demo_1");
    if (actualSaves.length > 0) {
      const latestSave = actualSaves[0];
      handleLoadSelectedGame(latestSave.id);
    } else {
      triggerToast("未检测到历史神识存档，已自动为您一键启元明末险地！", "alert");
      initSimulation(TimelineType.MING);
    }
  };

  return (
    <div 
      className="relative w-full h-full text-slate-100 flex flex-col font-sans transition-colors duration-500 overflow-hidden"
      style={{ 
        backgroundColor: primaryColor,
        fontSize: `${fontSize}px`
      }}
    >
      
      {/* Dynamic Cyber Scanning Screen layers */}
      <div className="cyber-grid animate-grid"></div>
      <div className="scanlines"></div>

      {/* Spacers side panels glow lights */}
      <div 
        className="absolute top-0 bottom-0 left-0 w-2 pointer-events-none transition-colors duration-500"
        style={{ backgroundColor: `${accentColor}1A` }}
      ></div>

      {/* Floating Alert Toasts Container */}
      <div className="fixed top-20 right-6 z-150 flex flex-col gap-2 max-w-sm pointer-events-none">
        {toasts.map((t) => (
          <div 
            key={t.id}
            className={`p-3.5 rounded-xl border flex items-center gap-2 shadow-lg transition-all duration-300 pointer-events-auto bg-slate-950/95 animate-slide-in ${
              t.type === "gain" ? "border-emerald-500/30 text-emerald-400" :
              t.type === "loss" ? "border-rose-500/30 text-rose-400" : "border-amber-500/30 text-amber-500"
            }`}
          >
            <Sparkle className="w-4 h-4 shrink-0 animate-spin" style={{ animationDuration: "12s" }} />
            <span className="text-xs font-medium">{t.text}</span>
          </div>
        ))}
      </div>

      {/* ========================================== */}
      {/* SCREEN A: TITLE SCREEN - 标题界面 */}
      {/* ========================================== */}
      {!isStarted && nonGameScreen === "title" && (
        <div className="flex-1 flex flex-col items-center justify-center p-6 relative z-10 select-none max-w-2xl mx-auto w-full">
          
          {/* Main Display logo titles */}
          <div className="text-center space-y-4 cursor-default animate-fade-in">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-full text-[10px] font-mono tracking-widest uppercase">
              <Sparkle className="w-3 h-3 text-amber-400 animate-spin" style={{ animationDuration: "6s" }} />
              QUANTUM COGNITIVE BRIDGE
            </div>
            <h1 className="text-6.5xl font-extrabold tracking-widest font-heading text-transparent bg-gradient-to-r from-amber-400 via-yellow-250 to-red-400 bg-clip-text drop-shadow-[0_0_15px_rgba(245,158,11,0.25)] select-none">
              天演·时空万象
            </h1>
            <p className="text-xs uppercase font-mono tracking-[0.4em] text-slate-400">
              CHRONOS: QUANTUM DYNASTY SIMULATION TERMINAL
            </p>
          </div>

          <div className="h-10"></div>

          {/* Core Access menu lists */}
          <div className="w-full space-y-3.5 max-w-sm animate-fade-in-up">
            
            <button
              id="btn_start_game_config"
              onClick={() => {
                setNonGameScreen("config");
                triggerToast("时空阻断阀已调校，参数配置装载中...", "alert");
              }}
              className="w-full py-4 text-sm font-extrabold tracking-widest rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-400 text-black hover:brightness-110 shadow-xl shadow-amber-500/15 active:scale-98 transition-all font-heading cursor-pointer shimmer-trigger flex items-center justify-center gap-2 border border-amber-400/20"
            >
              <Play className="w-4 h-4 fill-black" />
              开始游戏
            </button>

            <button
              id="btn_continue_game"
              onClick={handleContinueGame}
              className="w-full py-3.5 text-sm font-semibold border rounded-xl border-slate-800 bg-slate-950/60 hover:bg-slate-900/60 hover:border-amber-500/30 text-slate-250 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4 text-amber-400" />
              继续游戏
            </button>

            <button
              id="btn_load_saves_list"
              onClick={() => setIsSavesOpen(true)}
              className="w-full py-3 text-xs font-semibold border rounded-xl border-slate-850 bg-slate-950/20 hover:bg-slate-900/10 text-slate-450 hover:text-slate-200 transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <History className="w-4 h-4" />
              读取存档
            </button>

            <button
              id="btn_system_settings_trigger"
              onClick={() => setIsSettingsOpen(true)}
              className="w-full py-3 text-xs font-semibold border rounded-xl border-slate-850 bg-slate-950/20 hover:bg-slate-900/10 text-slate-450 hover:text-slate-200 transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <Settings className="w-4 h-4" />
              系统设置
            </button>

          </div>

          <p className="absolute bottom-6 text-[10px] text-slate-650 font-mono">
            V4.1.2 PRO-MAX PREVIEW TERMINAL • OFFLINE CORE
          </p>

        </div>
      )}

      {/* ========================================== */}
      {/* SCREEN B: CONFIGURATION INTERFACE - 配置界面 */}
      {/* ========================================== */}
      {!isStarted && nonGameScreen === "config" && (
        <div className="flex-1 flex flex-col p-6 relative z-10 bg-slate-950/40 overflow-y-auto max-w-4xl mx-auto w-full">
          <div className="space-y-6 py-8">
            
            <div className="flex items-center justify-between border-b border-slate-850 pb-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-100 font-heading tracking-wide flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  多维因果·时空部署中枢
                </h2>
                <p className="text-xs text-slate-500 font-mono mt-0.5">Please customize deployment parameters for your host consciousness.</p>
              </div>
              <button
                onClick={() => setNonGameScreen("title")}
                className="px-4 py-2 text-xs border border-slate-800 hover:border-amber-500/40 rounded-xl text-slate-300 hover:text-amber-400 bg-slate-950/30 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                返回标题
              </button>
            </div>

            {/* Step 1: Host information */}
            <div className="p-5 rounded-2xl border border-slate-850 bg-slate-900/20 space-y-4 animate-fade-in">
              <h3 className="text-sm font-bold text-amber-400 flex items-center gap-1.5 font-heading">
                <User className="w-4 h-4" /> 1. 输入宿主基础体识
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-400 font-medium font-mono">SOVEREIGN NAME / 宿主识别代号</label>
                  <input 
                    type="text"
                    placeholder="留空则按时空默认载入 (例如: 朱由检、朱祁镇等)"
                    value={setupHostName}
                    onChange={(e) => setSetupHostName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950/80 text-slate-200 text-xs focus:border-amber-500 outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-400 font-medium font-mono">BIOLOGY MATRIX / 物理性别编码</label>
                  <div className="flex gap-4 pt-1">
                    {["男性", "女性", "未知/纯质神体"].map(g => (
                      <label key={g} className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                        <input 
                          type="radio" 
                          name="gender-setup" 
                          value={g}
                          checked={setupGender === g}
                          onChange={() => setSetupGender(g)}
                          className="w-4 h-4 rounded text-amber-500 accent-amber-500 bg-slate-950 border-slate-800"
                        />
                        {g}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2: Select temporal anchor */}
            <div className="p-5 rounded-2xl border border-slate-850 bg-slate-900/20 space-y-4 animate-fade-in">
              <h3 className="text-sm font-bold text-amber-400 flex items-center gap-1.5 font-heading">
                <Landmark className="w-4 h-4" /> 2. 定位时空纪元锚点（选择对应的时间、地点和预设身份）
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
                {[
                  { 
                    id: TimelineType.MING, 
                    name: "【明末遗恨】", 
                    time: "崇祯十七年三月十九日", 
                    place: "京师顺天府 / 金銮殿", 
                    roleName: "朱由检 (崇祯帝)",
                    desc: "大顺起义军重兵合围大燕京，明亡覆灭在即。吴三桂关外拥兵。" 
                  },
                  { 
                    id: TimelineType.TUMU, 
                    name: "【土木之变】", 
                    time: "正统十四年八月十五", 
                    place: "怀来县土木堡之野", 
                    roleName: "朱祁镇 (明英宗)",
                    desc: "怀来原野二十万丧尽。也先蒙古大将率魔铁骑包围帝帐。" 
                  },
                  { 
                    id: TimelineType.JINGKANG, 
                    name: "【靖康之耻】", 
                    time: "靖康元年闰十一月", 
                    place: "宋东京汴梁城 / 宣化门", 
                    roleName: "赵桓 (宋钦宗)", 
                    desc: "大雪合围。主投降派高涨，六甲邪术郭京哄骗大城门沦陷。" 
                  },
                  { 
                    id: TimelineType.ANSHI, 
                    name: "【安史之乱】", 
                    time: "天宝十五载六月十四", 
                    place: "咸阳马嵬驿 / 军帐中", 
                    roleName: "李隆基 (唐玄宗)",
                    desc: "潼关断。龙武军饥疲交加，将士按戈哗变，逼缢贵妃杨玉环。" 
                  },
                  { 
                    id: TimelineType.CUSTOM, 
                    name: "【自选神武时境】", 
                    time: "自由拟定开时", 
                    place: "自定义始发位置", 
                    roleName: "创世宿主自定义",
                    desc: "点击后在下方激活文本编辑器。自由设计您的出生时代、时空以及对应的人物主角。" 
                  }
                ].map((preset) => {
                  const isSel = selectedPresetTimeline === preset.id;
                  return (
                    <button
                      key={preset.id}
                      onClick={() => setSelectedPresetTimeline(preset.id)}
                      className={`p-3.5 border rounded-xl text-left flex flex-col justify-between min-h-48 relative select-none duration-250 cursor-pointer ${isSel ? "border-amber-500 bg-amber-500/10 scale-102 shadow-lg shadow-amber-500/10 animate-pulse" : "border-slate-800 bg-slate-950/40 hover:border-slate-700"}`}
                    >
                      <div className="space-y-3">
                        <span className="text-xs font-bold text-slate-100 block">{preset.name}</span>
                        <div className="space-y-1 font-mono text-[9px] text-amber-400">
                          <div><span className="text-slate-500 block">时:</span> {preset.time}</div>
                          <div><span className="text-slate-500 block">空:</span> {preset.place}</div>
                          <div><span className="text-slate-500 block">人:</span> {preset.roleName}</div>
                        </div>
                      </div>
                      <p className="text-[10px] text-slate-500 leading-relaxed mt-3 line-clamp-3 font-mono border-t border-slate-900 pt-2">{preset.desc}</p>
                    </button>
                  );
                })}
              </div>

              {/* Step 2 Sub Option Custom Temporal Anchor */}
              {selectedPresetTimeline === TimelineType.CUSTOM && (
                <div className="p-4 border border-dashed border-amber-500/30 rounded-xl bg-amber-500/5 space-y-3.5 animate-fade-in font-mono text-xs">
                  <span className="font-bold text-amber-400 block pb-1 border-b border-slate-900">【自定义时空锚定详细设定】</span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <span className="text-slate-400 block pb-0.5">时间节点 (如: 崇祯十七年三月):</span>
                      <input 
                        type="text" 
                        placeholder="崇祯十七年三月十九日"
                        value={customTime}
                        onChange={(e) => setCustomTime(e.target.value)}
                        className="w-full px-3 py-1.5 rounded bg-slate-950 border border-slate-900 focus:border-amber-500 text-slate-200 outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-slate-400 block pb-0.5">宿主身份 (如: 汉寿亭侯关羽):</span>
                      <input 
                        type="text" 
                        placeholder="关羽"
                        value={customIdentity}
                        onChange={(e) => setCustomIdentity(e.target.value)}
                        className="w-full px-3 py-1.5 rounded bg-slate-950 border border-slate-900 focus:border-amber-500 text-slate-200 outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-slate-400 block pb-0.5">出生地点 (如: 荆州南郡郭门):</span>
                      <input 
                        type="text" 
                        placeholder="荆州南郡"
                        value={customLocation}
                        onChange={(e) => setCustomLocation(e.target.value)}
                        className="w-full px-3 py-1.5 rounded bg-slate-950 border border-slate-900 focus:border-amber-500 text-slate-200 outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Step 3: Choose system template */}
            <div className="p-5 rounded-2xl border border-slate-850 bg-slate-900/20 space-y-4 animate-fade-in font-heading">
              <h3 className="text-sm font-bold text-amber-400 flex items-center gap-1.5">
                <Terminal className="w-4 h-4" /> 3. 挂载时空系统总线
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
                {[
                  { id: SystemTemplateSpec.CARD, name: "诸天抽卡系统", desc: "主打兵种将才抽取。消耗因果点数调取神力军魂与秘药。" },
                  { id: SystemTemplateSpec.SIGNIN, name: "最强签到系统", desc: "每日固定时辰定点签到，凭空折射高产农作物、白银和武器。" },
                  { id: SystemTemplateSpec.SLACK, name: "摆烂放松系统", desc: "无为而治。越是怠忽惰政玩蛐蛐，反而能够获得更多仙法点数。" },
                  { id: SystemTemplateSpec.NONE, name: "拒绝系统 (肉身成圣)", desc: "唯唯精诚。不借任何附带。气血上限额外激增1.5倍。" },
                  { id: SystemTemplateSpec.CUSTOM, name: "【自定因果神网】", desc: "自由接入专属于自己的外挂总线。允许自定义设定 any 黑科技特权体系！" }
                ].map((spec) => {
                  const isSel = selectedTemplate === spec.id;
                  return (
                    <button
                      key={spec.id}
                      onClick={() => setSelectedTemplate(spec.id)}
                      className={`p-3.5 border rounded-xl text-left flex flex-col justify-between min-h-32 relative select-none duration-250 cursor-pointer ${isSel ? "border-amber-500 bg-amber-500/10 scale-102 shadow-lg" : "border-slate-800 bg-slate-950/40 hover:border-slate-700"}`}
                    >
                      <span className="text-xs font-extrabold text-slate-200 block">{spec.name}</span>
                      <p className="text-[10px] text-slate-500 leading-relaxed font-mono mt-2">{spec.desc}</p>
                    </button>
                  );
                })}
              </div>

              {/* Step 3 Sub Option Custom System Template */}
              {selectedTemplate === SystemTemplateSpec.CUSTOM && (
                <div className="p-4 border border-dashed border-amber-500/30 rounded-xl bg-amber-500/5 space-y-3 animate-fade-in font-mono text-xs">
                  <span className="font-bold text-amber-400 block pb-1 border-b border-slate-900">【定做专属因果系统】</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <span className="text-slate-400 block pb-0.5">自定义系统外架名称 (如: 无双超时空核弹发射系统):</span>
                      <input 
                        type="text" 
                        placeholder="赛博仙秦兵种系统"
                        value={customSysName}
                        onChange={(e) => setCustomSysName(e.target.value)}
                        className="w-full px-3 py-1.5 rounded bg-slate-950 border border-slate-900 focus:border-amber-500 text-slate-200 outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-slate-400 block pb-0.5">该系统专属神异功能说明:</span>
                      <input 
                        type="text" 
                        placeholder="每天定时凭空掉落无限激光大戟与全自动御营骑兵精锐辅助..."
                        value={customSysFunc}
                        onChange={(e) => setCustomSysFunc(e.target.value)}
                        className="w-full px-3 py-1.5 rounded bg-slate-950 border border-slate-900 focus:border-amber-500 text-slate-200 outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Step 4: Choose Talent spec */}
            <div className="p-5 rounded-2xl border border-slate-850 bg-slate-900/20 space-y-4 animate-fade-in">
              <h3 className="text-sm font-bold text-amber-400 flex items-center gap-1.5 font-heading">
                <Sparkles className="w-4 h-4" /> 4. 融合至高天赋能力
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { id: TalentSpec.INSIGHT, name: "洞察术", bonus: "初始智略 +8", desc: "天目既开。宿主洞彻大趋势，思维智商悟性从根基处永久突变。" },
                  { id: TalentSpec.ENDURANCE, name: "金枪不倒术", bonus: "最大寿龄 90 岁", desc: "寿比南山。洗毛伐髓，身躯抗御剧毒和重疾。初始寿命翻倍。" },
                  { id: TalentSpec.ALCHEMY, name: "点石成金术", bonus: "体格膂力 +7", desc: "化力入微。激发筋骨和周身战斗潜能，提升战时个人攻击抗性。" },
                  { id: TalentSpec.HYPNOSIS, name: "催眠术", bonus: "魅力气宇 +6", desc: "九五龙章。自带无形皇气，极具摄人心魂之效，名臣亲和大幅攀升。" },
                  { id: TalentSpec.DIVINATION, name: "算卜术", bonus: "机缘气运 +25", desc: "卜筮阴阳。初始天地气运狂增，能够奇妙偏斜部分毁灭危机。" },
                  { id: TalentSpec.NONE, name: "凡体无执", bonus: "额外 HP上限 +80", desc: "朴实无华。不依仗任何术数。宿体凡人血气激发惊人的抵抗潜能。" },
                  { id: TalentSpec.CUSTOM, name: "【自定义天演玄功】", bonus: "自定增益", desc: "由宿主魂海由心显化的逆天玄学，激活修仙、物理定律改写特权。" }
                ].map((tal) => {
                  const isSel = selectedTalent === tal.id;
                  return (
                    <button
                      key={tal.id}
                      onClick={() => setSelectedTalent(tal.id)}
                      className={`p-3.5 border rounded-xl text-left flex flex-col justify-between min-h-28 relative select-none duration-250 cursor-pointer ${isSel ? "border-amber-500 bg-amber-500/10 scale-102 shadow-lg shadow-amber-500/10 animate-pulse" : "border-slate-800 bg-slate-950/40 hover:border-slate-700"}`}
                    >
                      <div>
                        <div className="flex justify-between items-center bg-slate-950/20 pb-1.5 border-b border-slate-900">
                          <span className="text-xs font-bold text-slate-200 block">{tal.name}</span>
                          <span className="text-[8px] px-1 bg-amber-500/10 border border-amber-500/20 text-amber-500 font-mono rounded font-semibold">{tal.bonus}</span>
                        </div>
                        <p className="text-[10px] text-slate-500 leading-relaxed mt-2 font-mono">{tal.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Step 4 Sub Option Custom Talent */}
              {selectedTalent === TalentSpec.CUSTOM && (
                <div className="p-4 border border-dashed border-amber-500/30 rounded-xl bg-amber-500/5 space-y-3.5 animate-fade-in font-mono text-xs">
                  <span className="font-bold text-amber-400 block pb-1 border-b border-slate-900">【定制专属玄武天赋】</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <span className="text-slate-400 block pb-0.5">天赋自命名称 (如: 九星辰华灭魔铠 / 乾坤逆转大悲功):</span>
                      <input 
                        type="text" 
                        placeholder="九转朱砂不灭皮"
                        value={customTalentName}
                        onChange={(e) => setCustomTalentName(e.target.value)}
                        className="w-full px-3 py-1.5 rounded bg-slate-950 border border-slate-900 focus:border-amber-500 text-slate-200 outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-slate-400 block pb-0.5 font-mono">增益属性加成标识 (例如: 寿命上限+40, 魅力上升+15):</span>
                      <input 
                        type="text" 
                        placeholder="生命上限提升60点"
                        value={customTalentBonus}
                        onChange={(e) => setCustomTalentBonus(e.target.value)}
                        className="w-full px-3 py-1.5 rounded bg-slate-950 border border-slate-900 focus:border-amber-500 text-slate-200 outline-none"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <textarea 
                      rows={2}
                      placeholder="宿主大醒觉。受到外敌致命刺杀时，必定触发九虚金光遁，豁免一切生命损失且机运值疯狂加持+30..."
                      value={customTalentDesc}
                      onChange={(e) => setCustomTalentDesc(e.target.value)}
                      className="w-full p-2.5 rounded bg-slate-950 border border-slate-900 focus:border-amber-500 text-slate-200 outline-none resize-none"
                    />
                  </div>
                </div>
              )}
            </div>


            {/* Step 5: Choose carried initial items */}
            <div className="p-5 rounded-2xl border border-slate-850 bg-slate-900/20 space-y-4 animate-fade-in">
              <h3 className="text-sm font-bold text-amber-400 flex items-center gap-1.5 font-heading">
                <Briefcase className="w-4 h-4" /> 5. 量子封装携带物品 (最多选 3 件)
                <span className="text-xs text-slate-500 font-mono ml-auto">已选: {setupItems.length}/3</span>
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
                {[
                  { name: "加特林重机枪", title: "【加特林重机枪】", desc: "诸天红尘火力神器，携带5000发爆弹，战场扫射万卒溃降。" },
                  { name: "沙漠之鹰手枪", title: "【沙漠之鹰手枪】", desc: "大能爆神枪，可于乱臣勤王，刺客死于百步袖中。" },
                  { name: "安妙依贴身肚兜", title: "【安妙依贴身肚兜】", desc: "带有芬芳体香之肚兜，带上延寿20载，化解美色及心魔。" },
                  { name: "岳武穆精忠画像", title: "【岳武穆精忠画像】", desc: "宋真忠臣遗烈凝聚，大幅提升守省边防战将之效劳与忠诚上限。" },
                  { name: "高产红薯种子", title: "【高产红薯种子】", desc: "耐旱耐寒超级番薯种，三年可活十万家口。民怨飞速下撤。" }
                ].map((item) => {
                  const itemKey = `【${item.name}】`;
                  const isSel = setupItems.includes(itemKey);
                  return (
                    <button
                      key={item.name}
                      onClick={() => handleSetupItemToggle(itemKey)}
                      className={`p-3.5 border rounded-xl text-left flex flex-col justify-between min-h-28 cursor-pointer transition-all duration-200 select-none ${isSel ? "border-amber-500 bg-amber-500/10 scale-102 shadow-md text-amber-400 animate-pulse" : "border-slate-850 bg-slate-950/50 text-slate-400 hover:border-slate-750 hover:text-slate-200"}`}
                    >
                      <div className="space-y-1.5">
                        <span className="font-extrabold text-xs block text-slate-200">{item.title}</span>
                        <p className="text-[9.5px] text-slate-500 font-mono leading-normal">{item.desc}</p>
                      </div>
                      <span className="text-[8px] font-mono mt-2 text-right block w-full text-slate-600">{isSel ? "● 已封装" : "○ 未装载"}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Actions Stepper Confirms */}
            <div className="flex justify-between items-center pt-6 border-t border-slate-850">
              <button
                onClick={() => setNonGameScreen("title")}
                className="text-xs text-slate-500 hover:text-slate-300 transition-colors cursor-pointer flex items-center gap-1"
              >
                ← 返回锚定大殿首页
              </button>

              <button
                id="btn_launch_simulation"
                onClick={() => {
                  initSimulation(selectedPresetTimeline);
                }}
                className="px-8 py-4 bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-400 text-black font-extrabold tracking-widest rounded-xl text-xs sm:text-sm shadow-xl hover:shadow-amber-500/10 hover:brightness-110 active:scale-95 transition-all font-heading cursor-pointer flex items-center gap-2"
              >
                确认接入！灵魂接驳注入 ➔
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* SCREEN C: MAIN APPLICATION RUNTIME GAMEPLAY */}
      {/* ========================================== */}
      {isStarted && (
        <div className="flex-1 flex flex-col min-h-0 relative z-10">
          
          {/* Top Sovereign status bar */}
          <header className="px-6 py-4.5 border-b border-slate-850 bg-slate-950/90 flex flex-col md:flex-row items-center justify-between shrink-0 select-none gap-4">
            
            {/* Left Side: Standardized Single Line Format */}
            <div className="text-xs text-slate-200 font-mono tracking-wide truncate whitespace-nowrap" title={getFormattedStatusLine()}>
              {getFormattedStatusLine()}
            </div>

            {/* Right Side: Dynasty National KPIs */}
            <div className="flex flex-wrap items-center gap-5 text-xs text-slate-400 font-mono">
              
              {/* 国运 */}
              <div className="flex items-center p-1.5 bg-slate-900/40 border border-slate-900 rounded-lg">
                <span className="text-slate-500">国运:</span>
                <b className="text-amber-400 font-extrabold ml-1">
                  {Math.min(100, Math.max(10, attributes.emperorPrestige * 2 + 15))}
                </b>
              </div>

              {/* 民心 */}
              {(() => {
                const avgUnrest = Math.floor(provinces.reduce((sum, p) => sum + (p.unrest || 0), 0) / (provinces.length || 1));
                const posPopularity = 105 - avgUnrest; // Calculate standard popularity metric
                const finalPopularity = Math.min(100, Math.max(0, posPopularity));
                const popularityColor = finalPopularity > 60 ? "text-emerald-400" : finalPopularity > 40 ? "text-orange-400" : "text-rose-450";
                return (
                  <div className="flex items-center p-1.5 bg-slate-900/40 border border-slate-900 rounded-lg">
                    <span className="text-slate-500">民心:</span>
                    <b className={`${popularityColor} font-extrabold ml-1`}>{finalPopularity}%</b>
                  </div>
                );
              })()}

              {/* 国库 */}
              <div className="flex items-center p-1.5 bg-slate-900/40 border border-slate-900 rounded-lg">
                <span className="text-slate-500">国库:</span>
                <b className="text-sky-300 font-extrabold ml-1">{gold.toLocaleString()}</b>
              </div>

              {/* 存粮 */}
              <div className="flex items-center p-1.5 bg-slate-900/40 border border-slate-900 rounded-lg">
                <span className="text-slate-500">存粮:</span>
                <b className="text-teal-300 font-extrabold ml-1">{(gold * 18 + 48000).toLocaleString()}</b>
              </div>

            </div>

          </header>

          {/* Main vertical core split frame */}
          <div className="flex-1 flex min-h-0 overflow-hidden">
            
            {/* Nav: Sidebar options (with slide-out menus) */}
            <nav className="w-20 border-r border-slate-850 bg-slate-950/40 flex flex-col items-center py-6 gap-3 select-none shrink-0 overflow-y-auto">
              
              <button 
                onClick={() => setIsOverviewOpen(true)}
                title="总览 / 国家状态"
                className="w-12 h-12 rounded-xl flex items-center justify-center transition-all bg-slate-900/50 border border-slate-800 text-slate-400 hover:text-amber-400 hover:border-amber-500/40 cursor-pointer active:scale-95 group relative"
              >
                <LayoutDashboard className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </button>

              <button 
                onClick={() => setIsHostOpen(true)}
                title="宿主体核 / 基础属性"
                className="w-12 h-12 rounded-xl flex items-center justify-center transition-all bg-slate-900/50 border border-slate-800 text-slate-400 hover:text-amber-400 hover:border-amber-500/40 cursor-pointer active:scale-95 group relative"
              >
                <User className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </button>

              <button 
                onClick={() => setIsRelationsOpen(true)}
                title="天平重臣 / 人际臣下"
                className="w-12 h-12 rounded-xl flex items-center justify-center transition-all bg-slate-900/50 border border-slate-800 text-slate-400 hover:text-amber-400 hover:border-amber-500/40 cursor-pointer active:scale-95 group relative"
              >
                <Group className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </button>

              <button 
                onClick={() => setIsMapOpen(true)}
                title="省政沙盘 / 州省防务"
                className="w-12 h-12 rounded-xl flex items-center justify-center transition-all bg-slate-900/50 border border-slate-800 text-slate-400 hover:text-amber-400 hover:border-amber-500/40 cursor-pointer active:scale-95 group relative"
              >
                <Landmark className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </button>

              <button 
                onClick={() => setIsInventoryOpen(true)}
                title="量子储物舱 / 装备武器"
                className="w-12 h-12 rounded-xl flex items-center justify-center transition-all bg-slate-900/50 border border-slate-800 text-slate-400 hover:text-amber-400 hover:border-amber-500/40 cursor-pointer active:scale-95 group relative"
              >
                <Briefcase className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </button>

              <button 
                onClick={() => setIsSkillsOpen(true)}
                title="神通天赋法术"
                className="w-12 h-12 rounded-xl flex items-center justify-center transition-all bg-slate-900/50 border border-slate-800 text-slate-400 hover:text-amber-400 hover:border-amber-500/40 cursor-pointer active:scale-95 group relative"
              >
                <Sparkles className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </button>

              <div className="w-8 h-[1px] bg-slate-800 my-1"></div>

              <button 
                onClick={() => setIsChroniclesOpen(true)}
                title="天记编年史"
                className="w-12 h-12 rounded-xl flex items-center justify-center transition-all bg-slate-900/50 border border-slate-800 text-slate-400 hover:text-amber-400 hover:border-amber-500/40 cursor-pointer active:scale-95 group relative"
              >
                <History className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </button>

              <button 
                onClick={() => setIsWorldEventsOpen(true)}
                title="天灾威胁和世界变局"
                className="w-12 h-12 rounded-xl flex items-center justify-center transition-all bg-slate-900/50 border border-slate-800 text-slate-400 hover:text-amber-400 hover:border-amber-500/40 cursor-pointer active:scale-95 group relative"
              >
                <Earth className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </button>

              <button 
                onClick={() => setIsMissionsOpen(true)}
                title="历史历练法旨"
                className="w-12 h-12 rounded-xl flex items-center justify-center transition-all bg-slate-900/50 border border-slate-800 text-slate-400 hover:text-amber-400 hover:border-amber-500/40 cursor-pointer active:scale-95 group relative"
              >
                <ListTodo className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </button>

              <div className="w-8 h-[1px] bg-slate-800 my-1"></div>

              <button 
                onClick={() => setIsTerminalOpen(true)}
                title="挂载系统主大厅"
                className="w-12 h-12 rounded-xl flex items-center justify-center transition-all bg-emerald-950/20 border border-emerald-900/40 text-emerald-400 hover:text-emerald-300 hover:border-emerald-500/40 cursor-pointer active:scale-95 group relative"
              >
                <Terminal className="w-5 h-5 group-hover:scale-110 transition-transform animate-pulse" />
              </button>

              <button 
                onClick={() => setIsSettingsOpen(true)}
                title="量子系统偏好设置"
                className="w-12 h-12 rounded-xl flex items-center justify-center transition-all bg-slate-900/50 border border-slate-800 text-slate-400 hover:text-amber-400 hover:border-amber-500/40 cursor-pointer active:scale-95 mt-auto group relative"
              >
                <Settings className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </button>

            </nav>

            {/* Core Narrative / Event feed box */}
            <main className="flex-1 flex flex-col p-6 min-h-0 overflow-hidden relative">
              <div className="absolute inset-0 bg-radial-at-center from-slate-900/20 to-transparent pointer-events-none"></div>

              {/* Narratives feed scroll container */}
              <div className="flex-1 overflow-y-auto space-y-4 pr-2" id="narratives_terminal_con">
                
                {narrativeLogs.map((log) => {
                  if (log.mode === "system") {
                    return (
                      <div 
                        key={log.id} 
                        onContextMenu={(e) => handleLogContextMenu(e, log.id, log.text)}
                        className="text-xs font-mono p-1 border border-dashed border-slate-800 text-slate-500 bg-slate-950/40 rounded flex items-center gap-1 animate-fade-in select-all cursor-context-menu"
                      >
                        <BadgeInfo className="w-3.5 h-3.5 shrink-0" />
                        <span>{log.text}</span>
                      </div>
                    );
                  }
                  if (log.mode === "action") {
                    return (
                      <div 
                        key={log.id} 
                        onContextMenu={(e) => handleLogContextMenu(e, log.id, log.text)}
                        className="flex justify-end animate-fade-in select-none cursor-context-menu"
                      >
                        <div className="p-3.5 rounded-xl max-w-lg border border-indigo-500/20 bg-indigo-500/5 font-mono text-xs text-indigo-300 flex items-center gap-1.5 shadow-lg shadow-indigo-500/5">
                          <span>{log.text}</span>
                        </div>
                      </div>
                    );
                  }
                  if (log.mode === "warn") {
                    return (
                      <div 
                        key={log.id} 
                        onContextMenu={(e) => handleLogContextMenu(e, log.id, log.text)}
                        className="text-xs p-3 border border-pink-500/20 bg-pink-500/5 text-pink-400 rounded-xl animate-fade-in leading-relaxed select-text cursor-context-menu"
                      >
                        {log.text}
                      </div>
                    );
                  }
                  // Otherwise: standard narrative dialogue text
                  return (
                    <div 
                      key={log.id} 
                      onContextMenu={(e) => handleLogContextMenu(e, log.id, log.text)}
                      className="p-5 rounded-2xl border border-slate-900 bg-slate-900/10 hover:border-slate-800 transition-colors duration-300 shadow-sm leading-relaxed text-xs sm:text-sm space-y-4 font-serif text-slate-200 select-text animate-fade-in cursor-context-menu"
                    >
                      <div className="border-l-2 border-amber-500 pl-4 py-1 italic">
                        {log.text}
                      </div>
                    </div>
                  );
                })}

                {/* Auto Scroll Anchor */}
                <div id="narrative-logs-end-anchor"></div>
              </div>

              {/* Recommendations mini shelf (Quick Cards) */}
              {currentRecommendations.length > 0 && (
                <div className="pt-4 pb-2 border-t border-slate-900 shrink-0 select-none">
                  {/* Header with Arrow fold button */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] text-slate-400 font-mono tracking-wider font-extrabold flex items-center gap-1">
                      <span>快捷回复选项</span>
                    </span>
                    <button
                      onClick={() => setIsRecommendationsExpanded(!isRecommendationsExpanded)}
                      className="p-1 rounded hover:bg-slate-900 text-slate-500 hover:text-amber-500 transition-all cursor-pointer"
                      title={isRecommendationsExpanded ? "点击收起" : "点击展开"}
                    >
                      {isRecommendationsExpanded ? (
                        <ChevronUp className="w-4 h-4 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      )}
                    </button>
                  </div>

                  {/* Vertically Aligned Items */}
                  {isRecommendationsExpanded && (
                    <div className="flex flex-col gap-2 shrink-0 animate-fade-in max-h-44 overflow-y-auto pr-1">
                      {currentRecommendations.map((choice, i) => (
                        <button
                          key={i}
                          onClick={() => handleRecommendationClick(choice)}
                          onContextMenu={(e) => {
                            e.preventDefault();
                            setActionInput(choice);
                            triggerToast("快捷回复已置入输入框！", "gain");
                          }}
                          className="w-full text-left py-2 px-3.5 border border-slate-800 hover:border-amber-500/40 bg-slate-950/60 hover:bg-amber-500/5 text-slate-300 hover:text-white rounded-xl text-xs sm:text-sm font-serif transition-colors cursor-pointer flex items-center justify-between gap-2 shadow-sm"
                        >
                          <span className="truncate">{choice}</span>
                          <span className="text-[10px] text-slate-600">▶</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Input Area block */}
              <div className="pt-4 border-t border-slate-850 shrink-0 flex flex-wrap sm:flex-nowrap gap-3 items-stretch select-none">
                
                {/* 衍生快捷操作按钮 */}
                <div className="relative shrink-0 flex items-stretch">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsQuickMenuOpen(!isQuickMenuOpen);
                    }}
                    className="px-3 bg-slate-900 border border-slate-800 hover:border-amber-500/45 hover:bg-amber-500/5 text-slate-300 hover:text-white rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-95 shadow-lg select-none min-h-[50px]"
                    title="点击展开快捷操作指令（重发/继续/变量）"
                  >
                    <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                    <span className="text-xs font-semibold">快捷</span>
                    <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isQuickMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isQuickMenuOpen && (
                    <div 
                      onClick={(e) => e.stopPropagation()}
                      className="absolute bottom-full left-0 mb-2 z-[200] bg-slate-950/95 backdrop-blur-md border border-slate-800 p-1.5 rounded-xl shadow-2xl flex flex-col gap-1 min-w-[130px] animate-fade-in text-xs font-mono text-slate-200"
                    >
                      <button
                        onClick={() => {
                          handleResend();
                          setIsQuickMenuOpen(false);
                        }}
                        className="w-full text-left px-3 py-2.5 hover:bg-amber-500/15 hover:text-amber-400 rounded-lg transition-colors cursor-pointer flex items-center gap-2"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span>重新发送</span>
                      </button>
                      <button
                        onClick={() => {
                          handleContinue();
                          setIsQuickMenuOpen(false);
                        }}
                        className="w-full text-left px-3 py-2.5 hover:bg-emerald-500/15 hover:text-emerald-400 rounded-lg transition-colors cursor-pointer flex items-center gap-2"
                      >
                        <Play className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>直接继续</span>
                      </button>
                      <button
                        onClick={() => {
                          handleContinueWithVariants();
                          setIsQuickMenuOpen(false);
                        }}
                        className="w-full text-left px-3 py-2.5 hover:bg-sky-500/15 hover:text-sky-400 rounded-lg transition-colors cursor-pointer flex items-center gap-2"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-sky-400 shrink-0 animate-pulse" />
                        <span>时空变量</span>
                      </button>
                    </div>
                  )}
                </div>

                <textarea
                  id="text_user_input_dec"
                  placeholder="请输入您的推演战略或选择快捷输入..."
                  value={actionInput}
                  onChange={(e) => setActionInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      if (actionInput.trim()) {
                        processTurnNext(actionInput);
                      }
                    }
                  }}
                  className="flex-1 bg-slate-950 text-slate-200 p-2 text-slate-300 placeholder-slate-600 border border-slate-800 focus:border-amber-500/80 outline-none rounded-xl text-xs sm:text-sm resize-none transition-all duration-300 min-w-[120px] focus:ring-1 focus:ring-amber-500/25"
                />
                
                <button
                  id="btn_send_decision"
                  onClick={() => {
                    if (actionInput.trim()) {
                      processTurnNext(actionInput);
                    } else {
                      triggerToast("💡 意念输入为空，可点击左侧「继续」或「继续变量」来快速推进历史天演！", "alert");
                    }
                  }}
                  className="px-5 bg-gradient-to-r from-amber-600 to-amber-500 text-black hover:brightness-110 active:scale-95 transition-all rounded-xl flex items-center justify-center shrink-0 cursor-pointer"
                  title="发送当前战略决断"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>

              {/* Status and Action Log bottom ticker */}
              <div className="pt-3 flex justify-between items-center text-[10px] text-slate-600 font-mono shrink-0 select-none">
                <span>意识总线: {turnCount} 回路稳定接种中</span>
                <span className="flex items-center gap-1 text-slate-500">
                  <HelpCircle className="w-3 h-3 text-slate-500 animate-pulse" />
                  回车发送，使用左侧按钮快捷触发「重发/继续/变量」来推进天演
                </span>
              </div>

            </main>

          </div>

        </div>
      )}

      {/* ========================================== */}
      {/* LOCAL SAVES PANEL MODAL (时空归藏档案阁) */}
      {/* ========================================== */}
      {isSavesOpen && (
        <div className="fixed inset-0 z-105 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in select-none">
          <div className="relative w-full max-w-2xl overflow-hidden border rounded-2xl bg-cyber-dark/95 border-cyber-gold/25 shadow-2xl flex flex-col h-[75vh]">
            
            <div className="absolute inset-0 pointer-events-none opacity-5 bg-linear-to-b from-amber-500/10 to-transparent"></div>
            
            <div className="flex items-center justify-between p-5 border-b bg-cyber-panel border-cyber-gold/15 shrink-0">
              <h2 className="flex items-center gap-2 text-xl font-semibold tracking-wide text-transparent font-heading bg-gradient-to-r from-amber-400 to-yellow-250 bg-clip-text">
                <History className="w-5 h-5 text-amber-500" />
                时空归藏·神识存储大殿
              </h2>
              <button 
                onClick={() => setIsSavesOpen(false)}
                className="flex items-center justify-center w-8 h-8 transition-colors rounded-full text-slate-400 hover:text-rose-500 hover:bg-rose-500/10"
              >
                ✕
              </button>
            </div>

            <p className="px-6 pt-4 text-xs text-slate-500 leading-normal shrink-0">
              在此调阅本自适应设备上的历史存储谱图。提供一键JSON导出备忘或跨端离线导入合并。
            </p>

            {/* List of archives */}
            <div className="p-6 overflow-y-auto flex-1 space-y-3 min-h-0">
              {savedGames.length === 0 ? (
                <div className="text-center text-slate-600 py-16 italic text-xs">暂无量子记忆，可前往中枢大殿保存进程。</div>
              ) : (
                savedGames.map((save) => {
                  const isDemoObj = save.id === "save_demo_1";
                  return (
                    <div 
                      key={save.id}
                      className="p-4 border rounded-xl border-slate-850 bg-slate-900/30 flex justify-between items-center hover:border-slate-700 transition-colors text-xs"
                    >
                      <div className="space-y-1">
                        <div className="font-bold text-slate-200">{save.name}</div>
                        <div className="text-[10px] text-slate-500 font-mono">备份期: {save.date} | {save.info}</div>
                      </div>

                      <div className="flex gap-2 shrink-0">
                        <button
                          onClick={() => handleLoadSelectedGame(save.id)}
                          disabled={isDemoObj}
                          className="px-3 py-1.5 bg-amber-500 disabled:opacity-40 hover:bg-amber-400 text-black font-semibold rounded-lg text-xs transition-colors cursor-pointer"
                        >
                          接驳神识
                        </button>
                        <button
                          onClick={() => handleDeleteGameSave(save.id)}
                          disabled={isDemoObj}
                          className="p-1.5 border border-slate-800 hover:border-rose-500/30 text-slate-500 hover:text-rose-400 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Actions for imports and exports */}
            <div className="p-4 border-t bg-cyber-panel border-cyber-gold/15 flex justify-between items-center shrink-0">
              <div className="flex gap-2">
                <button
                  onClick={handleExportAllSaves}
                  className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium border border-cyan-500/20 text-cyan-400 bg-cyan-500/5 hover:bg-cyan-500/15 hover:border-cyan-455 rounded-lg cursor-pointer transition-all"
                >
                  <Download className="w-3.5 h-3.5" /> 导出谱图
                </button>
                <button
                  onClick={() => {
                    const el = document.getElementById("saves_import_file_inp");
                    if (el) el.click();
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium border border-teal-500/20 text-teal-400 bg-teal-500/5 hover:bg-teal-500/15 hover:border-teal-455 rounded-lg cursor-pointer transition-all"
                >
                  <Import className="w-3.5 h-3.5" /> 导入谱图
                </button>
                <input 
                  type="file" 
                  id="saves_import_file_inp" 
                  accept=".json" 
                  onChange={handleImportSaves} 
                  className="hidden" 
                />
              </div>

              <div className="flex gap-2">
                {isStarted && (
                  <button
                    onClick={handleSaveActiveGame}
                    className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-500 text-black font-extrabold text-xs rounded-lg transition-all active:scale-95 cursor-pointer"
                  >
                    存入当前进度
                  </button>
                )}
                <button 
                  onClick={() => setIsSavesOpen(false)}
                  className="px-4 py-2 border rounded-lg border-slate-800 text-slate-400 hover:text-slate-200 text-xs cursor-pointer"
                >
                  关闭
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* FLOATING SUB-MODALS (REACTIVE HOOKED IN) */}
      {/* ========================================== */}
      
      {/* MODAL 1: Host information stats details */}
      <HostInfoModal 
        isOpen={isHostOpen}
        onClose={() => setIsHostOpen(false)}
        playerName={playerName}
        gender={gender}
        systemTemplate={systemSpec}
        talent={talentSpec}
        attributes={attributes}
        levelName={levelName}
        gold={gold}
        systemPoints={systemPoints}
        onUpgradeAttribute={handleUpgradeAttribute}
        customAvatarUrl={customAvatarUrl}
        portraitDB={portraitDB}
      />

      {/* MODAL 2: Subject relations figures details */}
      <RelationsModal 
        isOpen={isRelationsOpen}
        onClose={() => setIsRelationsOpen(false)}
        npcs={npcs}
        portraitDB={portraitDB}
        gold={gold}
        onInteract={handleInteractNPC}
      />

      {/* MODAL 3: Map and military dispatch parameters */}
      <EmpireMapModal 
        isOpen={isMapOpen}
        onClose={() => setIsMapOpen(false)}
        provinces={provinces}
        gold={gold}
      />

      {/* MODAL 4: Item backpack warehouses details */}
      <InventoryModal 
        isOpen={isInventoryOpen}
        onClose={() => setIsInventoryOpen(false)}
        items={inventory}
        gold={gold}
        onUseItem={handleUseItemFromBag}
        onDiscardItem={handleDiscardItemFromBag}
        onToggleEquipItem={handleToggleEquipFromBag}
      />

      {/* MODAL 5: Active talent magics casting details */}
      <SkillsModal 
        isOpen={isSkillsOpen}
        onClose={() => setIsSkillsOpen(false)}
        activeTalent={talentSpec}
        karma={attributes.karma}
        onTriggerSkill={handleTriggerMagicSkill}
      />

      {/* MODAL 6: Historical compiled chronicles timeline */}
      <ChroniclesModal 
        isOpen={isChroniclesOpen}
        onClose={() => setIsChroniclesOpen(false)}
        chronicles={chronicles}
      />

      {/* MODAL 7: Anomalies and world events list */}
      <WorldEventsModal 
        isOpen={isWorldEventsOpen}
        onClose={() => setIsWorldEventsOpen(false)}
        events={worldEvents}
      />

      {/* MODAL 8: Active quest milestones claimers */}
      <MissionsModal 
        isOpen={isMissionsOpen}
        onClose={() => setIsMissionsOpen(false)}
        missions={missions}
        onClaimMission={handleClaimQuest}
        onAbandonMission={handleAbandonQuest}
        onManualSubmitMission={handleManualSubmitQuest}
      />

      {/* MODAL 9: System operational control panels */}
      <SystemTerminalModal 
        isOpen={isTerminalOpen}
        onClose={() => setIsTerminalOpen(false)}
        templateSpec={systemSpec}
        systemPoints={systemPoints}
        gold={gold}
        ownedCards={ownedSystemCards}
        onDrawCard={handleDrawSystemCard}
        onSignIn={handleSignInRegistry}
        onSlackAction={handleSlackAction}
        onIssueDecree={handleIssueSystemDecree}
        onBuyItem={handleBuyItemFromShop}
      />

      {/* MODAL 10: Customizable settings profiles panels */}
      <CustomSettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        primaryColor={primaryColor}
        accentColor={accentColor}
        fontSize={fontSize}
        minorSummaryX={minorX}
        majorSummaryY={majorY}
        autoHideZ={autoZ}
        presetTheme={presetTheme}
        onApplyTheme={applyPresetTheme}
        onUpdateColors={(p, a) => {
          setPrimaryColor(p);
          setAccentColor(a);
        }}
        onUpdateFontSize={setFontSize}
        onUpdateSummaryXYZ={(x, y, z) => {
          setMinorX(x);
          setMajorY(y);
          setAutoZ(z);
        }}
        isGameplay={isStarted}
        onExitGame={() => {
          setIsStarted(false);
          setNonGameScreen("title");
          setIsSettingsOpen(false);
        }}
        savedGames={savedGames.map(s => ({
          id: s.id,
          timestamp: s.date,
          desc: `${s.name} - ${s.info}`
        }))}
        onLoadSelectedGame={handleLoadSelectedGame}
        onDeleteGameSave={handleDeleteGameSave}
        customAvatarUrl={customAvatarUrl}
        onUpdateAvatarUrl={setCustomAvatarUrl}
        portraitDB={portraitDB}
        onUpdatePortraitDB={setPortraitDB}
      />

      {/* MODAL 0: Overview Modal (National Status) */}
      <OverviewModal 
        isOpen={isOverviewOpen}
        onClose={() => setIsOverviewOpen(false)}
        attributes={attributes}
        provinces={provinces}
        gold={gold}
      />

      {/* Floating right-click context menu */}
      {contextMenu && contextMenu.visible && (
        <div 
          style={{ top: contextMenu.y, left: contextMenu.x }}
          className="fixed z-[999] bg-slate-900 border border-slate-800 p-1 rounded-xl shadow-2xl flex flex-col min-w-32 text-xs text-slate-300 font-mono select-none"
        >
          <button
            onClick={() => {
              setEditingLogId(contextMenu.logId);
              setEditingText(contextMenu.logText);
              setContextMenu(null);
            }}
            className="w-full text-left px-3 py-2 hover:bg-amber-500/15 hover:text-amber-400 rounded-lg transition-colors cursor-pointer"
          >
            编辑消息
          </button>
          <button
            onClick={() => {
              handleCopyMessage(contextMenu.logText);
              setContextMenu(null);
            }}
            className="w-full text-left px-3 py-2 hover:bg-amber-500/15 hover:text-amber-400 rounded-lg transition-colors cursor-pointer"
          >
            复制消息
          </button>
          <button
            onClick={() => {
              setNarrativeLogs(prev => prev.filter(log => log.id !== contextMenu.logId));
              triggerToast("💥 消息内容已被定点清理除名！", "loss");
              setContextMenu(null);
            }}
            className="w-full text-left px-3 py-2 hover:bg-rose-500/15 hover:text-rose-400 rounded-lg transition-colors cursor-pointer text-rose-400 font-semibold"
          >
            删除消息
          </button>
        </div>
      )}

      {/* Inline edit message dialog overlay */}
      {editingLogId && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in text-slate-100 font-mono">
          <div className="w-full max-w-lg border rounded-2xl bg-slate-950 border-slate-800 p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-900 pb-3">
              <span className="font-bold text-amber-400">进行消息重组重构</span>
              <button 
                onClick={() => setEditingLogId(null)}
                className="text-slate-500 hover:text-slate-300 transition-colors"
              >
                ✕
              </button>
            </div>
            <textarea
              value={editingText}
              onChange={(e) => setEditingText(e.target.value)}
              rows={5}
              className="w-full p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs sm:text-sm focus:border-amber-500 outline-none resize-none"
            />
            <div className="flex justify-end gap-2 text-xs">
              <button
                onClick={() => setEditingLogId(null)}
                className="px-4 py-2 rounded-lg border border-slate-800 hover:bg-slate-900 text-slate-400 cursor-pointer"
              >
                取消
              </button>
              <button
                onClick={() => {
                  setNarrativeLogs(prev => prev.map(log => log.id === editingLogId ? { ...log, text: editingText } : log));
                  setEditingLogId(null);
                  triggerToast("💾 消息重构已就绪！已更新更改。", "gain");
                }}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-amber-600 to-amber-500 text-black font-semibold hover:brightness-110 active:scale-95 transition-all cursor-pointer"
              >
                保存修改
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global Fullscreen Toggle Button */}
      <button
        onClick={toggleFullscreen}
        className="fixed top-4 left-1/2 -translate-x-1/2 z-[202] p-2 bg-slate-900/80 hover:bg-slate-850 text-slate-400 hover:text-amber-400 border border-slate-800 hover:border-amber-500/40 transition-all cursor-pointer shadow-xl active:scale-95 flex items-center justify-center gap-1.5 rounded-full"
        title={isFullscreen ? "退出全屏" : "全屏模式"}
      >
        {isFullscreen ? <Minimize className="w-3.5 h-3.5" /> : <Maximize className="w-3.5 h-3.5" />}
        <span className="text-[9px] font-bold font-sans uppercase hidden sm:inline px-1">
          {isFullscreen ? "退出全屏" : "全屏"}
        </span>
      </button>

    </div>
  );
}
