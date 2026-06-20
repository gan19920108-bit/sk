/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  Settings, Palette, FileText, Braces, Sliders, Check, 
  HelpCircle, RefreshCw, Save, History, Image, LogOut, 
  Trash2, Play, Sparkles, CheckSquare, Key
} from "lucide-react";

interface CustomSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  primaryColor: string;
  accentColor: string;
  fontSize: number;
  minorSummaryX: number;
  majorSummaryY: number;
  autoHideZ: number;
  presetTheme: "black-gold" | "green-white" | "red-white" | "gray-white" | "yellow-white";
  onApplyTheme: (preset: "black-gold" | "green-white" | "red-white" | "gray-white" | "yellow-white") => void;
  onUpdateColors: (primary: string, accent: string) => void;
  onUpdateFontSize: (size: number) => void;
  onUpdateSummaryXYZ: (x: number, y: number, z: number) => void;
  
  // Added properties for enhanced game operations
  isGameplay?: boolean;
  onExitGame?: () => void;
  savedGames?: { id: string; name: string; date: string; info: string; data: any }[];
  onLoadSelectedGame?: (saveId: string) => void;
  onDeleteGameSave?: (saveId: string) => void;
  customAvatarUrl?: string;
  onUpdateAvatarUrl?: (url: string) => void;
  portraitDB?: Record<string, string>;
  onUpdatePortraitDB?: (db: Record<string, string>) => void;
}

export default function CustomSettingsModal({
  isOpen,
  onClose,
  primaryColor,
  accentColor,
  fontSize,
  minorSummaryX,
  majorSummaryY,
  autoHideZ,
  presetTheme,
  onApplyTheme,
  onUpdateColors,
  onUpdateFontSize,
  onUpdateSummaryXYZ,
  isGameplay = false,
  onExitGame,
  savedGames = [],
  onLoadSelectedGame,
  onDeleteGameSave,
  customAvatarUrl = "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=600&q=80",
  onUpdateAvatarUrl,
  portraitDB = {},
  onUpdatePortraitDB
}: CustomSettingsModalProps) {
  
  // Sub-modal open states
  const [activeSubModal, setActiveSubModal] = useState<"ui" | "chronicle" | "api" | "portrait" | "saves" | null>(null);

  // Local state for Manual Portrait Register
  const [manualPortraitName, setManualPortraitName] = useState<string>("");
  const [manualPortraitUrl, setManualPortraitUrl] = useState<string>("");
  const [localPortraitDB, setLocalPortraitDB] = useState<Record<string, string>>(portraitDB);

  useEffect(() => {
    if (portraitDB) {
      setLocalPortraitDB(portraitDB);
    }
  }, [portraitDB, isOpen]);

  // --- Sub-modal Local states to support Save and Reset ---
  
  // Tab 1: UI Visuals
  const [localTheme, setLocalTheme] = useState<typeof presetTheme>(presetTheme);
  const [localPrimaryColor, setLocalPrimaryColor] = useState<string>(primaryColor);
  const [localAccentColor, setLocalAccentColor] = useState<string>(accentColor);
  const [localFontSize, setLocalFontSize] = useState<number>(fontSize);

  // Tab 2: Chronicle Thresholds
  const [localX, setLocalX] = useState<number>(minorSummaryX);
  const [localY, setLocalY] = useState<number>(majorSummaryY);
  const [localZ, setLocalZ] = useState<number>(autoHideZ);

  // Tab 3: API Settings
  const [apiEndpoint, setApiEndpoint] = useState<string>(() => {
    return localStorage.getItem("chrono_settings_api_endpoint") || "https://generativelanguage.googleapis.com";
  });
  const [apiKey, setApiKey] = useState<string>(() => {
    return localStorage.getItem("chrono_settings_api_key") || "";
  });
  const [modelOptions, setModelOptions] = useState<string[]>([
    "gemini-2.5-flash",
    "gemini-2.5-pro",
    "gemini-1.5-flash",
    "gemini-1.5-pro",
    "custom-model"
  ]);
  const [selectedModel, setSelectedModel] = useState<string>(() => {
    return localStorage.getItem("chrono_settings_api_selected_model") || "gemini-2.5-flash";
  });
  const [isFetchingModels, setIsFetchingModels] = useState<boolean>(false);

  // Tab 4: Character Portrait
  const [localAvatarUrl, setLocalAvatarUrl] = useState<string>(customAvatarUrl);

  // Fetch models if endpoint and API key are updated
  const fetchAvailableModels = async (targetEndpoint: string, targetKey: string) => {
    if (!targetKey) {
      // Return beautiful default fallback if no key is entered
      setModelOptions([
        "gemini-2.5-flash",
        "gemini-2.5-pro",
        "gemini-1.5-flash",
        "gemini-1.5-pro",
        "text-embedding-004"
      ]);
      return;
    }
    
    setIsFetchingModels(true);
    try {
      // Dynamic call to the specified Gemini Endpoint or proxy
      const cleanEndpoint = targetEndpoint.replace(/\/$/, "");
      const fetchUrl = `${cleanEndpoint}/v1beta/models?key=${targetKey}`;
      
      const response = await fetch(fetchUrl);
      if (response.ok) {
        const data = await response.json();
        if (data && data.models && Array.isArray(data.models)) {
          const names = data.models
            .map((m: any) => m.name.replace("models/", ""))
            .filter((name: string) => name.toLowerCase().includes("gemini") || name.toLowerCase().includes("generate"));
          if (names.length > 0) {
            setModelOptions(names);
            setSelectedModel(names[0]);
            return;
          }
        }
      }
      throw new Error("Unable to parse models list");
    } catch (err) {
      console.warn("API list models fetch error, using robust available fallback: ", err);
      // Fallback with a helpful toast simulator
      setModelOptions([
        "gemini-2.5-flash",
        "gemini-2.5-pro",
        "gemini-1.5-flash",
        "gemini-1.5-pro",
        "gemma-2-27b-it"
      ]);
    } finally {
      setIsFetchingModels(false);
    }
  };

  // Sync settings when main props change
  useEffect(() => {
    setLocalTheme(presetTheme);
    setLocalPrimaryColor(primaryColor);
    setLocalAccentColor(accentColor);
    setLocalFontSize(fontSize);
  }, [presetTheme, primaryColor, accentColor, fontSize, isOpen]);

  useEffect(() => {
    setLocalX(minorSummaryX);
    setLocalY(majorSummaryY);
    setLocalZ(autoHideZ);
  }, [minorSummaryX, majorSummaryY, autoHideZ, isOpen]);

  useEffect(() => {
    setLocalAvatarUrl(customAvatarUrl);
  }, [customAvatarUrl, isOpen]);

  // Handle Model population on key/endpoint input changes
  useEffect(() => {
    if (apiKey) {
      fetchAvailableModels(apiEndpoint, apiKey);
    }
  }, [apiEndpoint, apiKey]);

  if (!isOpen) return null;

  // --- SAVE AND RESET ACTIONS ---

  // UI Setup Actions
  const handleResetUI = () => {
    setLocalTheme("black-gold");
    setLocalPrimaryColor("#030408");
    setLocalAccentColor("#f59e0b");
    setLocalFontSize(15);
  };

  const handleSaveUI = () => {
    onApplyTheme(localTheme);
    onUpdateColors(localPrimaryColor, localAccentColor);
    onUpdateFontSize(localFontSize);
    setActiveSubModal(null);
  };

  // Chronicle Setup Actions
  const handleResetChronicle = () => {
    setLocalX(5);
    setLocalY(25);
    setLocalZ(20);
  };

  const handleSaveChronicle = () => {
    onUpdateSummaryXYZ(localX, localY, localZ);
    setActiveSubModal(null);
  };

  // API Setup Actions
  const handleResetAPI = () => {
    setApiEndpoint("https://generativelanguage.googleapis.com");
    setApiKey("");
    setSelectedModel("gemini-2.5-flash");
    localStorage.removeItem("chrono_settings_api_endpoint");
    localStorage.removeItem("chrono_settings_api_key");
    localStorage.removeItem("chrono_settings_api_selected_model");
  };

  const handleSaveAPI = () => {
    localStorage.setItem("chrono_settings_api_endpoint", apiEndpoint);
    localStorage.setItem("chrono_settings_api_key", apiKey);
    localStorage.setItem("chrono_settings_api_selected_model", selectedModel);
    setActiveSubModal(null);
  };

  // Portrait Setup Actions
  const handlePortraitFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Extract filename without suffix
    const fileName = file.name;
    const nameWithoutExt = fileName.substring(0, fileName.lastIndexOf('.')) || fileName;

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setLocalPortraitDB(prev => {
        const next = { ...prev, [nameWithoutExt]: dataUrl };
        return next;
      });
    };
    reader.readAsDataURL(file);
  };

  const handleAddManualPortrait = () => {
    if (!manualPortraitName.trim()) {
      alert("请输入对应的人物姓名！");
      return;
    }
    if (!manualPortraitUrl.trim()) {
      alert("请输入有效的立绘图片链接！");
      return;
    }
    setLocalPortraitDB(prev => ({
      ...prev,
      [manualPortraitName.trim()]: manualPortraitUrl.trim()
    }));
    setManualPortraitName("");
    setManualPortraitUrl("");
  };

  const handleDeletePortrait = (nameKey: string) => {
    setLocalPortraitDB(prev => {
      const next = { ...prev };
      delete next[nameKey];
      return next;
    });
  };

  const handleResetPortrait = () => {
    setLocalPortraitDB({
      "朱由检": "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=600&q=80",
      "关羽": "https://images.unsplash.com/photo-1583089892943-e02e5b017b6a?auto=format&fit=crop&w=600&q=80",
      "王承恩": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
      "吴三桂": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
      "魏藻德": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80",
      "李自成": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80",
      "张皇后": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"
    });
  };

  const handleSavePortrait = () => {
    if (onUpdatePortraitDB) {
      onUpdatePortraitDB(localPortraitDB);
      localStorage.setItem("chrono_custom_portraits_database", JSON.stringify(localPortraitDB));
    }
    setActiveSubModal(null);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in text-slate-100 font-sans select-none">
      <div className="relative w-full max-w-lg overflow-hidden border rounded-2xl bg-slate-950 border-amber-500/30 shadow-2xl flex flex-col h-auto max-h-[85vh]">
        
        {/* Glowing accents */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-400"></div>
        <div className="absolute inset-0 bg-radial-at-center from-amber-500/5 to-transparent pointer-events-none"></div>

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-900 shrink-0">
          <h2 className="flex items-center gap-2 text-lg font-extrabold tracking-widest text-transparent font-heading bg-gradient-to-r from-amber-400 to-yellow-100 bg-clip-text">
            <Settings className="w-5 h-5 text-amber-500 animate-spin" style={{ animationDuration: "12s" }} />
            系统控制大殿 (SETTINGS)
          </h2>
          <button 
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 transition-colors rounded-full text-slate-400 hover:text-amber-500 hover:bg-amber-500/10"
          >
            ✕
          </button>
        </div>

        {/* Overview Panel */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          <p className="text-xs text-slate-500 leading-relaxed font-mono">
            SYS CONFIG CONSOLE // 请选择对应的调控面板加载神识设置。
          </p>

          <div className="grid grid-cols-1 gap-3">
            
            {/* Button 1: Visual Theme Settings */}
            <button
              onClick={() => setActiveSubModal("ui")}
              className="flex items-center justify-between p-4 rounded-xl border border-slate-900 bg-slate-900/20 hover:border-amber-500/30 hover:bg-amber-500/5 text-left transition-all duration-200 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg border border-amber-500/15 bg-amber-500/10 flex items-center justify-center text-amber-400">
                  <Palette className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-200 block">界面主视觉调谐 (UI Theme Core)</span>
                  <span className="text-[10px] text-slate-500 block">配色模板、系统字号比例</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-600" />
            </button>

            {/* Button 2: Chronicle parameter Settings */}
            <button
              onClick={() => setActiveSubModal("chronicle")}
              className="flex items-center justify-between p-4 rounded-xl border border-slate-900 bg-slate-900/20 hover:border-amber-500/30 hover:bg-amber-500/5 text-left transition-all duration-200 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg border border-teal-500/15 bg-teal-500/10 flex items-center justify-center text-teal-400">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-200 block">时空编年纪算 (Timeline XYZ)</span>
                  <span className="text-[10px] text-slate-500 block">小总结频次、过虑裁切阈值</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-600" />
            </button>

            {/* Button 3: AI model linkage Settings */}
            <button
              onClick={() => setActiveSubModal("api")}
              className="flex items-center justify-between p-4 rounded-xl border border-slate-900 bg-slate-900/20 hover:border-amber-500/30 hover:bg-amber-500/5 text-left transition-all duration-200 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg border border-indigo-500/15 bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                  <Braces className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-200 block">时空大模型通道 (Gemini LLM link)</span>
                  <span className="text-[10px] text-slate-500 block">配置 API Key、通信端点模型选择</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-600" />
            </button>

            {/* IN-GAME SPECIFIC MODALS */}
            {isGameplay && (
              <>
                <div className="border-t border-slate-900 my-2 pt-2">
                  <div className="text-[10px] text-slate-600 font-mono tracking-widest uppercase">Gameplay Controls / 战时附加面板</div>
                </div>

                {/* Button 4: Character Portrait Settings */}
                <button
                  onClick={() => setActiveSubModal("portrait")}
                  className="flex items-center justify-between p-4 rounded-xl border border-slate-900 bg-slate-900/20 hover:border-amber-500/30 hover:bg-amber-500/5 text-left transition-all duration-200 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg border border-rose-500/15 bg-rose-500/10 flex items-center justify-center text-rose-400">
                      <Image className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-200 block">随身皇嗣立绘管理 (Illustrations)</span>
                      <span className="text-[10px] text-slate-500 block">自定义更换或编辑宿主艺术形象</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-600" />
                </button>

                {/* Button 5: Local Save management */}
                <button
                  onClick={() => setActiveSubModal("saves")}
                  className="flex items-center justify-between p-4 rounded-xl border border-slate-900 bg-slate-900/20 hover:border-amber-500/30 hover:bg-amber-500/5 text-left transition-all duration-200 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg border border-yellow-500/15 bg-yellow-500/10 flex items-center justify-center text-yellow-400">
                      <History className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-200 block">天演神识存档管理 (Saves Archive)</span>
                      <span className="text-[10px] text-slate-500 block">回溯加载、多维因果链粉碎</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-600" />
                </button>
              </>
            )}

          </div>
        </div>

        {/* Footer Area with Return to Title */}
        <div className="p-4 border-t border-slate-900 bg-slate-950 flex flex-col gap-3 shrink-0">
          
          {isGameplay && onExitGame && (
            <button
              onClick={() => {
                onExitGame();
                onClose();
              }}
              className="w-full py-2.5 bg-rose-950/40 text-rose-400 border border-rose-900/40 hover:bg-rose-950 hover:text-rose-300 font-bold text-xs tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              返回主标题界面 (RETURN TO CHRONOS)
            </button>
          )}

          <div className="flex justify-end">
            <button 
              onClick={onClose}
              className="px-5 py-2 text-xs font-bold rounded-lg border border-slate-800 bg-slate-900 hover:bg-slate-850 hover:text-white text-slate-400 transition-all cursor-pointer font-heading"
            >
              退出控制台
            </button>
          </div>
        </div>

      </div>

      {/* ========================================================= */}
      {/* 2. SUB-MODALS OVERLAYS (Each has Reset Option & Save Option) */}
      {/* ========================================================= */}
      {activeSubModal !== null && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-md overflow-hidden border rounded-2xl bg-slate-950 border-amber-500/40 shadow-2xl shadow-amber-500/5 flex flex-col max-h-[85vh]">
            
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-900 bg-slate-950/80 shrink-0">
              <span className="text-xs font-extrabold text-amber-500 tracking-wider flex items-center gap-1.5 uppercase">
                <Sparkles className="w-4 h-4 animate-bounce" />
                {activeSubModal === "ui" && "界面视觉精密调解"}
                {activeSubModal === "chronicle" && "时空编年纪算指标"}
                {activeSubModal === "api" && "星空大模型量子总线"}
                {activeSubModal === "portrait" && "宿主容姿绘像调节"}
                {activeSubModal === "saves" && "神识归藏档案局"}
              </span>
              <button 
                onClick={() => setActiveSubModal(null)}
                className="text-xs px-2.5 py-1 text-slate-500 hover:text-slate-300 border border-slate-900 rounded-md bg-slate-950"
              >
                返回
              </button>
            </div>

            {/* Scrollable Sub-modal content */}
            <div className="p-5 overflow-y-auto space-y-5 flex-1 text-xs">
              
              {/* SUB-TAB 1: UI SETTINGS */}
              {activeSubModal === "ui" && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-slate-500 tracking-wider block">THEME PRESETS / 御用视觉色泽</label>
                    <div className="grid grid-cols-2 gap-2.5">
                      {[
                        { id: "black-gold", name: "黑金古道", bg: "bg-[#030408]", accent: "bg-amber-500" },
                        { id: "green-white", name: "绿野竹白", bg: "bg-emerald-950", accent: "bg-emerald-400" },
                        { id: "red-white", name: "朱墙白玉", bg: "bg-rose-950", accent: "bg-rose-500" },
                        { id: "gray-white", name: "水墨灰绢", bg: "bg-slate-900", accent: "bg-slate-400" },
                        { id: "yellow-white", name: "大明姜黄", bg: "bg-[#1c180a]", accent: "bg-yellow-500" }
                      ].map((theme) => {
                        const isSel = localTheme === theme.id;
                        return (
                          <button
                            key={theme.id}
                            onClick={() => {
                              setLocalTheme(theme.id as any);
                              // Auto sync colors based on choice
                              if (theme.id === "black-gold") {
                                setLocalPrimaryColor("#030408");
                                setLocalAccentColor("#f59e0b");
                              } else if (theme.id === "green-white") {
                                setLocalPrimaryColor("#061c0d");
                                setLocalAccentColor("#34d399");
                              } else if (theme.id === "red-white") {
                                setLocalPrimaryColor("#1a0505");
                                setLocalAccentColor("#f43f5e");
                              } else if (theme.id === "gray-white") {
                                setLocalPrimaryColor("#0f172a");
                                setLocalAccentColor("#94a3b8");
                              } else if (theme.id === "yellow-white") {
                                setLocalPrimaryColor("#1c1605");
                                setLocalAccentColor("#eab308");
                              }
                            }}
                            className={`p-2.5 border rounded-xl text-left transition-all flex items-center justify-between cursor-pointer ${isSel ? "bg-amber-500/10 border-amber-500" : "bg-slate-900/40 border-slate-900 hover:border-slate-800"}`}
                          >
                            <span className="font-bold text-slate-200">{theme.name}</span>
                            <div className="flex gap-1">
                              <span className={`${theme.bg} w-3.5 h-3.5 rounded-full border border-slate-800`}></span>
                              <span className={`${theme.accent} w-3.5 h-3.5 rounded-full border border-slate-800`}></span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="p-3.5 border rounded-xl bg-slate-900/30 border-slate-900 space-y-3.5">
                    <label className="text-[10px] font-semibold text-slate-500 tracking-wider block">CUSTOM METAPHYSICAL COLORS / 自由调色相板</label>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] text-slate-400">暗室底色 (Primary)</span>
                        <div className="flex items-center gap-2">
                          <input 
                            type="color" 
                            value={localPrimaryColor}
                            onChange={(e) => setLocalPrimaryColor(e.target.value)}
                            className="w-8 h-8 rounded border-0 bg-transparent cursor-pointer"
                          />
                          <span className="font-mono text-[9px] text-slate-400">{localPrimaryColor}</span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] text-slate-400">霓虹高亮 (Accent)</span>
                        <div className="flex items-center gap-2">
                          <input 
                            type="color" 
                            value={localAccentColor}
                            onChange={(e) => setLocalAccentColor(e.target.value)}
                            className="w-8 h-8 rounded border-0 bg-transparent cursor-pointer"
                          />
                          <span className="font-mono text-[9px] text-slate-400">{localAccentColor}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-3.5 border border-slate-900 rounded-xl bg-slate-900/10 space-y-2">
                    <div className="flex justify-between font-mono">
                      <span className="text-slate-400">文字基础识别字号:</span>
                      <span className="text-amber-500 font-bold">{localFontSize} px</span>
                    </div>
                    <input 
                      type="range"
                      min="12"
                      max="24"
                      value={localFontSize}
                      onChange={(e) => setLocalFontSize(parseInt(e.target.value))}
                      className="w-full h-1 bg-slate-900 cursor-pointer accent-amber-500 rounded-full"
                    />
                    <p className="text-[9px] text-slate-600 leading-normal">
                      调节此长规滑片，字号将自适应于剧情叙事面板，改善任何小屏阅读模糊。
                    </p>
                  </div>
                </div>
              )}

              {/* SUB-TAB 2: CHRONICLE LIMITS */}
              {activeSubModal === "chronicle" && (
                <div className="space-y-4">
                  <p className="text-[10px] text-slate-400 leading-relaxed font-mono">
                    CHRONO DECAY LIMITATIONS / 量子溯因参数谱，防范过度上下文挤占造成的崩溃：
                  </p>

                  <div className="space-y-3.5">
                    
                    {/* Param X */}
                    <div className="p-3.5 border rounded-xl border-slate-900 bg-slate-900/30 space-y-1">
                      <div className="flex justify-between items-center bg-slate-950/20 pb-1">
                        <span className="font-bold text-slate-300">小总结触发回合数 (X)</span>
                        <div className="flex items-center gap-1.5">
                          <input 
                            type="number" 
                            min="2"
                            max="15"
                            value={localX}
                            onChange={(e) => setLocalX(parseInt(e.target.value) || 5)}
                            className="w-12 py-1 px-1.5 rounded bg-slate-900 border border-slate-800 text-center font-mono text-amber-400 font-bold"
                          />
                          <span className="text-slate-550 text-[10px]">回</span>
                        </div>
                      </div>
                      <p className="text-[9px] text-slate-500">达到 X 会合后进行剧情合枝，防范重复碎碎碎。</p>
                    </div>

                    {/* Param Y */}
                    <div className="p-3.5 border rounded-xl border-slate-900 bg-slate-900/30 space-y-1">
                      <div className="flex justify-between items-center bg-slate-950/20 pb-1">
                        <span className="font-bold text-slate-300">大格局归并层级回数 (Y)</span>
                        <div className="flex items-center gap-1.5">
                          <input 
                            type="number" 
                            min="10"
                            max="80"
                            value={localY}
                            onChange={(e) => setLocalY(parseInt(e.target.value) || 25)}
                            className="w-12 py-1 px-1.5 rounded bg-slate-900 border border-slate-800 text-center font-mono text-amber-400 font-bold"
                          />
                          <span className="text-slate-550 text-[10px]">回</span>
                        </div>
                      </div>
                      <p className="text-[9px] text-slate-500">周期性更新世界大战各政治藩镇割据板块并并归正史。</p>
                    </div>

                    {/* Param Z */}
                    <div className="p-3.5 border rounded-xl border-slate-900 bg-slate-900/30 space-y-1">
                      <div className="flex justify-between items-center bg-slate-950/20 pb-1">
                        <span className="font-bold text-slate-300">旧日志隐藏裁度阈 (Z)</span>
                        <div className="flex items-center gap-1.5">
                          <input 
                            type="number" 
                            min="5"
                            max="45"
                            value={localZ}
                            onChange={(e) => setLocalZ(parseInt(e.target.value) || 20)}
                            className="w-12 py-1 px-1.5 rounded bg-slate-900 border border-slate-800 text-center font-mono text-amber-400 font-bold"
                          />
                          <span className="text-slate-550 text-[10px]">回</span>
                        </div>
                      </div>
                      <p className="text-[9px] text-slate-500">超出 Z 的历史流水记录将被剪折并隐藏，保留极核精力。</p>
                    </div>

                  </div>
                </div>
              )}

              {/* SUB-TAB 3: AI LLM GATEWAY */}
              {activeSubModal === "api" && (
                <div className="space-y-4">
                  <div className="p-3 bg-indigo-950/20 border border-indigo-900/40 rounded-xl space-y-1.5">
                    <span className="font-bold text-indigo-400 flex items-center gap-1 shrink-0">
                      <Key className="w-3.5 h-3.5" /> 星河大脑通信接入口
                    </span>
                    <p className="text-[9px] text-slate-500 leading-loose">
                      输入对应的端点与API-Secret-Key。大明、大宋天下沙盒内的政治推演将真正接驳您调和的大语言模型（如 Gemini），实现完全非线性的离奇史诗级沙盒！
                    </p>
                  </div>

                  <div className="space-y-3 font-mono">
                    
                    <div className="space-y-1">
                      <span className="text-slate-500 block">通信服务器端点 (API Endpoint URL)</span>
                      <input 
                        type="text"
                        placeholder="https://generativelanguage.googleapis.com"
                        value={apiEndpoint}
                        onChange={(e) => setApiEndpoint(e.target.value)}
                        className="w-full px-3 py-2 border rounded-xl bg-slate-900 border-slate-800 text-slate-200 outline-none focus:border-amber-500 text-[10px]"
                      />
                    </div>

                    <div className="space-y-1">
                      <span className="text-slate-500 block">API密钥密锁 (API Key)</span>
                      <input 
                        type="password"
                        placeholder="请输入您的 Gemini 专属密钥 (留空使用本地模拟器)"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        className="w-full px-3 py-2 border rounded-xl bg-slate-900 border-slate-800 text-slate-200 outline-none focus:border-amber-500 text-[10px]"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500 block">可用大模型名单 (Available Models)</span>
                        {isFetchingModels && (
                          <span className="text-[9px] text-amber-500 flex items-center gap-1">
                            <RefreshCw className="w-3 h-3 animate-spin" />
                            通信拉取中...
                          </span>
                        )}
                      </div>
                      
                      <div className="flex gap-2">
                        <select
                          value={selectedModel}
                          onChange={(e) => setSelectedModel(e.target.value)}
                          className="flex-1 px-3 py-2 border rounded-xl bg-slate-900 border-slate-800 text-slate-200 outline-none focus:border-amber-500 text-[10px] cursor-pointer"
                        >
                          {modelOptions.map((v) => (
                            <option key={v} value={v}>{v}</option>
                          ))}
                        </select>

                        <button
                          onClick={() => fetchAvailableModels(apiEndpoint, apiKey)}
                          className="px-3 bg-slate-900 border border-slate-800 hover:border-amber-500 hover:text-white rounded-xl text-slate-400 transition-colors cursor-pointer"
                          title="强制重新通信获取最新模型"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {/* SUB-TAB 4: IN-GAME PORTRAIT */}
              {activeSubModal === "portrait" && (
                <div className="space-y-4 font-mono text-[11px] h-[55vh] overflow-y-auto pr-1">
                  <div className="p-3 bg-slate-900/40 border border-slate-900 rounded-xl space-y-1">
                    <span className="font-extrabold text-amber-400 block pb-1">👑 帝国立绘数据库规则说明</span>
                    <p className="text-[10px] text-slate-450 leading-relaxed font-sans">
                      1. 支持拖拽或点击下方按钮上传本地立绘图片文件。系统将<b>自动解析文件名作为人物姓名</b>（如上传“魏忠贤.png”，系统会将其对应注册为“魏忠贤”的立绘）。
                      <br />
                      2. 个人信息和人际关系中的立绘都会从此处自动匹配获取。
                    </p>
                  </div>

                  {/* File Uploader area */}
                  <div className="p-4 border-2 border-dashed border-slate-800 hover:border-amber-500/50 rounded-xl bg-slate-900/10 transition-all flex flex-col items-center justify-center gap-2 relative cursor-pointer group">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handlePortraitFileUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    />
                    <Image className="w-8 h-8 text-slate-600 group-hover:text-amber-500 transition-colors" />
                    <span className="text-[10px] text-slate-400">拖拽立绘图片到此处，或 <b className="text-amber-400">点击上传文件</b></span>
                    <span className="text-[8.5px] text-slate-600">支持 *.png, *.jpg, *.gif 格式图片</span>
                  </div>

                  {/* URL-based Manual Add */}
                  <div className="p-3 bg-slate-900/20 border border-slate-900 rounded-xl space-y-3">
                    <span className="text-[10px] text-slate-400 font-bold block">网页网络图片手动注册 (手动键入)</span>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input 
                        type="text"
                        placeholder="人物姓名(如: 朱由检)"
                        value={manualPortraitName}
                        onChange={(e) => setManualPortraitName(e.target.value)}
                        className="flex-1 px-2.5 py-1.5 rounded border bg-slate-950 border-slate-800 text-slate-300 text-[10.5px] outline-none"
                      />
                      <input 
                        type="text"
                        placeholder="立绘图片网址 (https://...)"
                        value={manualPortraitUrl}
                        onChange={(e) => setManualPortraitUrl(e.target.value)}
                        className="flex-1.5 px-2.5 py-1.5 rounded border bg-slate-950 border-slate-800 text-slate-300 text-[10.5px] outline-none"
                      />
                    </div>
                    <button
                      onClick={handleAddManualPortrait}
                      className="w-full py-1.5 bg-amber-500 text-black font-extrabold text-[10px] tracking-widest rounded-lg hover:brightness-110 cursor-pointer active:scale-97 transition-all"
                    >
                      + 拼合添加新立绘
                    </button>
                  </div>

                  {/* Portrait Database Listing (List View with clear visual table rows) */}
                  <div className="space-y-2.5 pt-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">🏰 当前已注册立绘索引库 ({Object.keys(localPortraitDB).length} 件)</span>
                    
                    <div className="border border-slate-900 rounded-xl overflow-hidden bg-slate-950 max-h-[220px] overflow-y-auto divide-y divide-slate-900">
                      {Object.keys(localPortraitDB).length === 0 ? (
                        <div className="p-8 text-center text-slate-600 italic text-[10px]">立绘库为空，请上传本地文件或注册立绘。</div>
                      ) : (
                        Object.entries(localPortraitDB).map(([pName, pUrl]) => (
                          <div key={pName} className="p-2 flex items-center justify-between gap-3 text-[10.5px] hover:bg-slate-900/10">
                            <div className="flex items-center gap-3 min-w-0">
                              <img 
                                src={pUrl} 
                                alt={pName}
                                className="w-8 h-10 object-cover rounded bg-slate-900 border border-slate-800 shrink-0"
                                onError={(e) => {
                                  (e.target as any).src = "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=600&q=80";
                                }}
                              />
                              <div className="truncate">
                                <span className="font-extrabold text-slate-200 block truncate">{pName}</span>
                                <span className="text-[8.5px] text-slate-600 block font-mono truncate">{pUrl}</span>
                              </div>
                            </div>
                            
                            <button
                              onClick={() => handleDeletePortrait(pName)}
                              className="px-2.5 py-1 text-[9.5px] font-bold text-rose-455 hover:text-white border border-rose-900/60 hover:border-rose-600 hover:bg-rose-950 bg-slate-900 rounded-lg cursor-pointer transition-colors shrink-0"
                            >
                              删除
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* SUB-TAB 5: SAVES ARCHIVE MANAGER */}
              {activeSubModal === "saves" && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-900 pb-2">
                    <p className="text-[10px] text-slate-400 leading-normal font-mono">
                      调阅或加载由宿主天演时空折射的备存因果链卷。
                    </p>
                  </div>

                  <div className="space-y-2 max-h-[45vh] overflow-y-auto">
                    {savedGames.length === 0 ? (
                      <div className="text-center py-10 italic text-slate-600 text-[10px]">暂无本地神识储存，请在游戏中按需创造。</div>
                    ) : (
                      savedGames.map((save) => {
                        const isDemo = save.id === "save_demo_1";
                        return (
                          <div 
                            key={save.id}
                            className="p-3 border rounded-xl border-slate-900 bg-slate-900/20 text-[10px] space-y-2"
                          >
                            <div className="flex justify-between items-start">
                              <div className="space-y-0.5">
                                <span className="font-bold text-slate-250 block">{save.name}</span>
                                <span className="text-[9px] text-slate-550 block font-mono">{save.date} | {save.info}</span>
                              </div>
                              <span className="px-1.5 py-0.2 bg-slate-900 border border-slate-800 text-slate-400 rounded-sm font-mono text-[8px] uppercase">
                                {isDemo ? "系统演示" : "宿主存档"}
                              </span>
                            </div>

                            <div className="flex justify-end gap-1.5 pt-1 border-t border-slate-950">
                              <button
                                onClick={() => {
                                  if (onLoadSelectedGame) {
                                    if(confirm(`确定要执行神识逆变，重置大千世界至以下位置吗？\n"${save.name}"`)) {
                                      onLoadSelectedGame(save.id);
                                      setActiveSubModal(null);
                                      onClose(); // Close general settings
                                    }
                                  }
                                }}
                                disabled={isDemo}
                                className="px-2.5 py-1 bg-amber-500 disabled:opacity-40 hover:bg-amber-400 text-black font-extrabold rounded-md text-[9px] transition-colors cursor-pointer"
                              >
                                回溯神识
                              </button>
                              
                              <button
                                onClick={() => {
                                  if (onDeleteGameSave) {
                                    if(confirm(`警告：此项量子因果链将被粉碎成尘，无法还原！\n"${save.name}"`)) {
                                      onDeleteGameSave(save.id);
                                    }
                                  }
                                }}
                                disabled={isDemo}
                                className="p-1 border border-slate-850 hover:border-rose-500/30 text-slate-500 hover:text-rose-400 rounded-md transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}

            </div>

            {/* Sub-modal Action Footer Buttons */}
            {activeSubModal !== "saves" && (
              <div className="p-4 border-t border-slate-900 bg-slate-950 flex items-center justify-between shrink-0 font-heading">
                <button
                  onClick={() => {
                    if (activeSubModal === "ui") handleResetUI();
                    if (activeSubModal === "chronicle") handleResetChronicle();
                    if (activeSubModal === "api") handleResetAPI();
                    if (activeSubModal === "portrait") handleResetPortrait();
                  }}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-400 hover:text-slate-200 text-[10px] font-extrabold tracking-wider rounded-lg transition-all cursor-pointer flex items-center gap-1"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                  恢复初始设置
                </button>

                <button
                  onClick={() => {
                    if (activeSubModal === "ui") handleSaveUI();
                    if (activeSubModal === "chronicle") handleSaveChronicle();
                    if (activeSubModal === "api") handleSaveAPI();
                    if (activeSubModal === "portrait") handleSavePortrait();
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-500 text-black font-extrabold text-[10px] tracking-wider rounded-lg transition-all hover:brightness-110 active:scale-95 cursor-pointer flex items-center gap-1"
                >
                  <Save className="w-3.5 h-3.5 text-black" />
                  保存设置
                </button>
              </div>
            )}

            {activeSubModal === "saves" && (
              <div className="p-4 border-t border-slate-900 bg-slate-950 flex justify-end shrink-0">
                <button 
                  onClick={() => setActiveSubModal(null)}
                  className="px-4 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white text-[10px] font-extrabold cursor-pointer"
                >
                  关闭存档局
                </button>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}

// Inline fallback ChevronRight representer to satisfy styling imports in simple component
function ChevronRight({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m9 18 6-6-6-6"/>
    </svg>
  );
}
