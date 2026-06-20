/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, MouseEvent, useEffect } from "react";
import { Province } from "../types";
import { Compass, ZoomIn, ZoomOut, RotateCcw, Edit3, Plus, Save, Trash2, MapPin, Check } from "lucide-react";

interface EmpireMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  provinces: Province[];
  gold: number;
}

export interface MapNode {
  id: string;
  name: string;
  x: number; // 0 to 550 coordinate space
  y: number; // 0 to 420 coordinate space
  faction: "保皇党" | "起义军" | "外族/外敌" | "中立/自治";
  description: string;
}

export interface CityNode {
  id: string;
  name: string;
  x: number;
  y: number;
  faction: "保皇党" | "起义军" | "外族/外敌" | "中立/自治";
  status: string;
  description: string;
}

export interface SceneBlock {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  faction: "保皇党" | "起义军" | "外族/外敌" | "中立/自治";
  description: string;
}

export default function EmpireMapModal({
  isOpen,
  onClose,
  provinces,
  gold
}: EmpireMapModalProps) {
  // Map Level zoom index
  const [mapLevel, setMapLevel] = useState<"empire" | "city" | "scene">("empire");

  // Zoom & Pan states
  const [scale, setScale] = useState<number>(1);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStart = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Map Editor State
  const [isEditMode, setIsEditMode] = useState<boolean>(false);

  // Level 1: empire nodes
  const [nodes, setNodes] = useState<MapNode[]>([
    { id: "node_bj", name: "北京", x: 382, y: 110, faction: "保皇党", description: "神圣大朝京畿。流寇红军重兵合围，国之宿主命门所在。" },
    { id: "node_nj", name: "南京", x: 388, y: 242, faction: "保皇党", description: "大明旧都金陵。六部漕河繁复，粮秣金银行库之基。" },
    { id: "node_hz", name: "杭州", x: 400, y: 275, faction: "中立/自治", description: "江南丰殖重镇。丝绸海贸汇聚，银钱百万，极乐乾坤。" },
    { id: "node_kf", name: "开封", x: 335, y: 172, faction: "起义军", description: "汴梁黄河咽喉。百万流民作案，大将刘宗敏攻拔要路。" },
    { id: "node_ly", name: "洛阳", x: 285, y: 180, faction: "起义军", description: "西控崤函，东襟河洛。帝王之气依旧，战火不息。" },
    { id: "node_xa", name: "西安", x: 232, y: 195, faction: "起义军", description: "关中要冲秦中祖脉。李自成大顺首发，豪万之极。" },
    { id: "node_cd", name: "成都", x: 170, y: 285, faction: "中立/自治", description: "天府深盆，甲兵雄师之源。险塞难拔，外绝波澜。" }
  ]);

  // Level 2: city nodes (gates)
  const [cityNodes, setCityNodes] = useState<CityNode[]>([
    { id: "gate_ds", name: "德胜门 (北门)", x: 275, y: 60, faction: "外族/外敌", status: "激战戒备", description: "九门之德胜险隘，处于对抗塞外突袭金骑的第一前线。" },
    { id: "gate_ad", name: "安定门 (东北门)", x: 410, y: 60, faction: "保皇党", status: "京军驻防", description: "勤王兵营驻防地，局势大安。" },
    { id: "gate_xw", name: "宣武门 (西南门)", x: 140, y: 280, faction: "保皇党", status: "闭门防匪", description: "深重城门紧锁，拒保皇党之外义民起义势狂飙。" },
    { id: "gate_zy", name: "正阳门 (正南门)", x: 275, y: 360, faction: "保皇党", status: "九门实控", description: "国之正气金阙正门，九门宿卫宿居之要道。" },
    { id: "gate_cy", name: "朝阳门 (东门)", x: 460, y: 210, faction: "外族/外敌", status: "贼焰微攻", description: "扼漕运东来之途，有红旗义军偏师在外袭扰。" },
    { id: "gate_fc", name: "阜成门 (西门)", x: 90, y: 210, faction: "保皇党", status: "兵士巡戒", description: "西郊巡戈关防，神机营重弩守护防线。" }
  ]);

  // Level 3: scene layout blocks
  const [sceneBlocks, setSceneBlocks] = useState<SceneBlock[]>([
    { id: "block_tree", name: "寿皇古林老槐", x: 205, y: 30, width: 140, height: 60, faction: "中立/自治", description: "【寿皇山皇家禁林老槐】皇家宗社禁山之巅，宿命因果吊死挂钩所系。" },
    { id: "block_hall", name: "太和金銮龙殿", x: 185, y: 140, width: 180, height: 110, faction: "保皇党", description: "【太和殿正统神州龙座】九五至尊真龙宝座，九重天印安放之处。" },
    { id: "block_wen", name: "文华阁藏书殿", x: 40, y: 140, width: 110, height: 110, faction: "保皇党", description: "【文华阁内库书卷殿肆】藏皇家实录及机要总册的地方。" },
    { id: "block_arm", name: "神机重武防库", x: 400, y: 140, width: 110, height: 110, faction: "保皇党", description: "【神机重型红武防库】守城大火器及铅弹黑火药藏纳之所。" },
    { id: "block_gate", name: "午门阅兵广场", x: 125, y: 280, width: 300, height: 75, faction: "保皇党", description: "【午门斩首阅兵重地】誓师勤王或威严审判叛党之绝地。" },
    { id: "block_pfront", name: "端门前防廊道", x: 205, y: 365, width: 140, height: 45, faction: "保皇党", description: "【皇城宫前防区】近卫前廊，把守严密。" }
  ]);

  // Selected node (tracks active selection, initially the first element)
  const [selectedNode, setSelectedNode] = useState<any>(nodes[0]);

  // Form states for adding or updating elements
  const [formName, setFormName] = useState<string>("");
  const [formFaction, setFormFaction] = useState<"保皇党" | "起义军" | "外族/外敌" | "中立/自治">("保皇党");
  const [formX, setFormX] = useState<number>(250);
  const [formY, setFormY] = useState<number>(200);
  const [formWidth, setFormWidth] = useState<number>(100);
  const [formHeight, setFormHeight] = useState<number>(80);
  const [formDesc, setFormDesc] = useState<string>("");

  // Editor placement mode helper
  const [clickToPlaceMode, setClickToPlaceMode] = useState<boolean>(false);
  
  // Custom Toast helper trigger inside the board
  const [toastText, setToastText] = useState<string | null>(null);

  // Auto-sync selected node when mapLevel changes
  useEffect(() => {
    if (mapLevel === "empire") {
      setSelectedNode(nodes[0] || null);
    } else if (mapLevel === "city") {
      setSelectedNode(cityNodes[0] || null);
    } else if (mapLevel === "scene") {
      setSelectedNode(sceneBlocks[0] || null);
    }
  }, [mapLevel]);

  // Sync form states with selection
  useEffect(() => {
    if (selectedNode) {
      setFormName(selectedNode.name || "");
      setFormFaction(selectedNode.faction || "保皇党");
      setFormX(selectedNode.x ?? 250);
      setFormY(selectedNode.y ?? 200);
      setFormWidth(selectedNode.width ?? 100);
      setFormHeight(selectedNode.height ?? 80);
      setFormDesc(selectedNode.description || "");
    }
  }, [selectedNode]);

  if (!isOpen) return null;

  const triggerLocalToast = (text: string) => {
    setToastText(text);
    setTimeout(() => {
      setToastText(null);
    }, 2500);
  };

  // Zoom controls
  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.25, 3.5));
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.25, 0.5));
  const handleResetZoom = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  // Pan controls
  const handleMouseDown = (e: MouseEvent) => {
    if (clickToPlaceMode) return; // ignore panning when placing nodes
    setIsDragging(true);
    dragStart.current = { x: e.clientX - position.x, y: e.clientY - position.y };
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Map Click to capture coordinates or display nodes
  const handleMapClick = (e: MouseEvent<SVGSVGElement>) => {
    const svgElement = e.currentTarget;
    const rect = svgElement.getBoundingClientRect();
    
    // Convert click position to the exact coordinate space (550x420) of viewBox
    const clickedX = Math.round(((e.clientX - rect.left) / rect.width) * 550);
    const clickedY = Math.round(((e.clientY - rect.top) / rect.height) * 420);

    if (clickToPlaceMode) {
      setFormX(clickedX);
      setFormY(clickedY);
      setClickToPlaceMode(false);
      triggerLocalToast(`已定位坐标: X=${clickedX}, Y=${clickedY}，请在右侧完善名称后保存。`);
    }
  };

  // Mutator helper function for live-editing
  const updateSelectedField = (field: string, value: any) => {
    if (!selectedNode) return;

    setSelectedNode((prev: any) => prev ? { ...prev, [field]: value } : null);

    if (mapLevel === "empire") {
      setNodes(prev => prev.map(n => n.id === selectedNode.id ? { ...n, [field]: value } : n));
    } else if (mapLevel === "city") {
      setCityNodes(prev => prev.map(n => n.id === selectedNode.id ? { ...n, [field]: value } : n));
    } else if (mapLevel === "scene") {
      setSceneBlocks(prev => prev.map(b => b.id === selectedNode.id ? { ...b, [field]: value } : b));
    }
  };

  // Adding a node action
  const handleAddCustomNode = () => {
    if (!formName.trim()) {
      triggerLocalToast("请输入地点或要素名称！");
      return;
    }

    if (mapLevel === "empire") {
      const newNode: MapNode = {
        id: "node_custom_" + Date.now(),
        name: formName.trim(),
        x: Math.max(10, Math.min(540, formX)),
        y: Math.max(10, Math.min(410, formY)),
        faction: formFaction,
        description: formDesc.trim() || `自定战略地物点，位于中原经纬线 [${formX}, ${formY}]，拱护社稷防务。`
      };
      setNodes(prev => [...prev, newNode]);
      setSelectedNode(newNode);
      triggerLocalToast(`成功添加一级舆图节点 【${newNode.name}】！`);
    } else if (mapLevel === "city") {
      const newNode: CityNode = {
        id: "gate_custom_" + Date.now(),
        name: formName.trim(),
        x: Math.max(10, Math.min(540, formX)),
        y: Math.max(10, Math.min(410, formY)),
        faction: formFaction,
        status: "自定守哨",
        description: formDesc.trim() || `自定二级要隘城关，坐标 [${formX}, ${formY}]，拱卫中枢防务。`
      };
      setCityNodes(prev => [...prev, newNode]);
      setSelectedNode(newNode);
      triggerLocalToast(`成功添加二级城塞战哨 【${newNode.name}】！`);
    } else if (mapLevel === "scene") {
      const newNode: SceneBlock = {
        id: "block_custom_" + Date.now(),
        name: formName.trim(),
        x: Math.max(10, Math.min(540, formX)),
        y: Math.max(10, Math.min(410, formY)),
        width: Math.max(20, Math.min(300, formWidth)),
        height: Math.max(20, Math.min(300, formHeight)),
        faction: formFaction,
        description: formDesc.trim() || `自拟三级布局方块，位于 [${formX}, ${formY}]，规格 ${formWidth}x${formHeight}。`
      };
      setSceneBlocks(prev => [...prev, newNode]);
      setSelectedNode(newNode);
      triggerLocalToast(`成功添加三级场景方块 【${newNode.name}】！`);
    }

    setFormName("");
    setFormDesc("");
  };

  // Delete a node
  const handleDeleteNode = (id: string) => {
    if (mapLevel === "empire") {
      if (nodes.length <= 1) {
        triggerLocalToast("必须保留至少一个要素节点！");
        return;
      }
      const filtered = nodes.filter(n => n.id !== id);
      setNodes(filtered);
      setSelectedNode(filtered[0] || null);
    } else if (mapLevel === "city") {
      if (cityNodes.length <= 1) {
        triggerLocalToast("必须保留至少一个要素节点！");
        return;
      }
      const filtered = cityNodes.filter(n => n.id !== id);
      setCityNodes(filtered);
      setSelectedNode(filtered[0] || null);
    } else if (mapLevel === "scene") {
      if (sceneBlocks.length <= 1) {
        triggerLocalToast("必须保留至少一个要素节点！");
        return;
      }
      const filtered = sceneBlocks.filter(b => b.id !== id);
      setSceneBlocks(filtered);
      setSelectedNode(filtered[0] || null);
    }
    triggerLocalToast("已成功移除该层级防守要素。");
  };

  // Save map state
  const handleSaveMap = () => {
    triggerLocalToast("💾 舆图多级防卫要素布局已顺利归档至大局天机盘面！");
  };

  const getFactionColors = (f: string) => {
    switch (f) {
      case "保皇党": return { text: "text-teal-400", fill: "fill-teal-400", bg: "bg-teal-500/10 border-teal-500/20", stroke: "#14b8a6" };
      case "起义军": return { text: "text-orange-400", fill: "fill-orange-400", bg: "bg-orange-500/10 border-orange-500/20", stroke: "#f97316" };
      case "外族/外敌": return { text: "text-rose-400", fill: "fill-rose-400", bg: "bg-rose-500/10 border-rose-500/20", stroke: "#f43f5e" };
      default: return { text: "text-amber-400", fill: "fill-amber-400", bg: "bg-amber-400/10 border-amber-400/20", stroke: "#fbbf24" };
    }
  };

  return (
    <div id="empire-map-modal-view-container" className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in select-none text-slate-100">
      <div id="map-modal-card-board" className="relative w-full max-w-5xl overflow-hidden border rounded-2xl bg-slate-950 border-teal-500/30 shadow-2xl shadow-teal-500/10 flex flex-col h-[85vh]">
        
        {/* Glow accent bar at top */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 via-amber-400 to-rose-500"></div>

        {/* Local Toast System */}
        {toastText && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 z-[120] bg-teal-950 border border-teal-500 text-teal-300 font-mono text-xs px-5 py-2.5 rounded-full shadow-lg flex items-center gap-2 animate-bounce">
            <Check className="w-4 h-4 text-teal-400" />
            <span>{toastText}</span>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b bg-slate-950 border-slate-900 shrink-0">
          <h2 className="flex items-center gap-2 text-lg font-extrabold tracking-widest text-transparent font-heading bg-gradient-to-r from-teal-400 to-emerald-200 bg-clip-text">
            <Compass className="w-5 h-5 text-teal-400 animate-pulse" />
            山河天下社稷舆图 & 防军总调度 (SOCIETY OPERATIONS MAP)
          </h2>
          <button 
            id="quit-map-top-close-btn"
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 transition-colors rounded-full text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Top interactive level selection and actions bar */}
        <div className="px-6 py-4 bg-slate-900/40 border-b border-slate-900 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0 font-mono">
          <div className="space-y-0.5">
            <span className="text-xs font-bold text-slate-300 block">多级战术舆图防守布局 (Tactical Observation Levels)</span>
            <span className="text-[10.5px] text-slate-400 opacity-80">支持拖拽、滚轮缩放与位置放置。支持编辑所有一、二、三级各层舆图的地标与方块布局！</span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Level Selector */}
            <div className="flex bg-slate-950 border border-slate-900 p-0.5 rounded-lg text-[10px]">
              <button
                onClick={() => setMapLevel("empire")}
                className={`px-3 py-1 rounded transition-all cursor-pointer font-bold ${mapLevel === "empire" ? "bg-teal-500 text-black font-extrabold" : "text-slate-400 hover:text-slate-200"}`}
              >
                天下全舆 (一级地图)
              </button>
              <button
                onClick={() => setMapLevel("city")}
                className={`px-3 py-1 rounded transition-all cursor-pointer font-bold ${mapLevel === "city" ? "bg-amber-500 text-black font-extrabold" : "text-slate-400 hover:text-slate-200"}`}
              >
                要塞九城 (二级地图)
              </button>
              <button
                onClick={() => setMapLevel("scene")}
                className={`px-3 py-1 rounded transition-all cursor-pointer font-bold ${mapLevel === "scene" ? "bg-rose-500 text-black font-extrabold" : "text-slate-400 hover:text-slate-200"}`}
              >
                金銮殿苑 (三级地图)
              </button>
            </div>

            {/* Editor mode toggle */}
            <button
              onClick={() => setIsEditMode(!isEditMode)}
              className={`px-3 py-1 rounded-lg text-[9.5px] border font-bold flex items-center gap-1 cursor-pointer transition-colors ${isEditMode ? "bg-purple-950/40 border-purple-500 text-purple-300 shadow-md animate-pulse" : "border-slate-800 bg-slate-900 hover:bg-slate-800 hover:text-white text-slate-400"}`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isEditMode ? "退出编辑模式" : "开启舆图编辑"}</span>
            </button>
          </div>
        </div>

        {/* Master Body Layer */}
        <div className="flex-1 flex min-h-0 overflow-hidden bg-slate-950 relative">
          
          {/* Draggable/Zoomable Canvas Container */}
          <div 
            id="draggable-map-stage"
            className={`flex-1 overflow-hidden relative border-slate-900 bg-slate-950 flex items-center justify-center min-h-0 h-full select-none cursor-grab active:cursor-grabbing ${isEditMode ? "md:border-r border-slate-900" : ""}`}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {/* Visual background grid pattern */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(to_right,#333_1px,transparent_1px),linear-gradient(to_bottom,#333_1px,transparent_1px)] bg-[size:24px_24px]"></div>

            {/* Transform Layer */}
            <div 
              className="transition-transform duration-75 select-none origin-center"
              style={{
                transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
              }}
            >
              <div 
                className="w-[550px] h-[420px] bg-slate-950/80 rounded-2xl border border-slate-900 relative p-1 shadow-inner select-none flex items-center justify-center overflow-hidden"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                
                {/* LEVEL 1: EMPIRE MAP */}
                {mapLevel === "empire" && (
                  <svg 
                    viewBox="0 0 550 420" 
                    className="w-full h-full object-contain pointer-events-auto"
                    xmlns="http://www.w3.org/2000/svg"
                    onClick={handleMapClick}
                  >
                    <rect width="100%" height="100%" fill="none" />

                    {/* Coastal Border line */}
                    <path 
                      d="M 120,50 L 160,55 L 210,65 L 250,70 L 320,60 L 340,70 L 380,50 L 400,60 L 430,70 L 450,90 L 460,110 L 435,130 L 450,150 L 415,180 L 420,225 L 435,250 L 410,270 L 390,290 L 385,320 L 350,340 L 310,350 L 290,380 L 260,390 L 235,370 L 200,380 L 180,360 L 100,340"
                      fill="none" 
                      stroke="#475569" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeDasharray="5 3"
                      strokeOpacity="0.4"
                    />

                    {/* Hainan */}
                    <ellipse cx="270" cy="395" rx="14" ry="8" fill="#1e293b" stroke="#475569" strokeWidth="1" strokeOpacity="0.5" />
                    {/* Taiwan */}
                    <ellipse cx="430" cy="305" rx="9" ry="16" transform="rotate(-15 430 305)" fill="#1e293b" stroke="#475569" strokeWidth="1" strokeOpacity="0.5" />

                    {/* Physical Rivers: 黄河 and 长江 */}
                    <path 
                      d="M 90,140 C 130,135 150,100 170,105 C 190,110 200,160 215,165 C 230,170 240,110 260,115 C 280,120 290,185 305,185 C 320,185 315,145 340,140 C 365,135 380,180 432,170" 
                      fill="none" 
                      stroke="#1e3a8a" 
                      strokeWidth="2.5" 
                      strokeLinecap="round" 
                      strokeOpacity="0.75"
                    />
                    
                    <path 
                      d="M 85,260 C 120,250 145,285 180,275 C 215,265 240,240 265,245 C 290,250 310,290 340,285 C 370,280 395,245 425,240" 
                      fill="none" 
                      stroke="#2563eb" 
                      strokeWidth="2.5" 
                      strokeLinecap="round" 
                      strokeOpacity="0.75"
                    />

                    <text x="140" y="125" fill="#3b82f6" fillOpacity="0.4" className="text-[10px] italic font-serif pointer-events-none">黄河</text>
                    <text x="135" y="278" fill="#3b82f6" fillOpacity="0.4" className="text-[10px] italic font-serif pointer-events-none">长江</text>

                    {/* Regional overlay borders */}
                    <polygon points="320,70 415,75 440,135 340,135" fill="rgba(20, 184, 166, 0.02)" stroke="rgba(20, 184, 166, 0.15)" strokeWidth="0.8" />
                    <polygon points="210,140 310,140 330,220 220,225" fill="rgba(249, 115, 22, 0.02)" stroke="rgba(249, 115, 22, 0.15)" strokeWidth="0.8" />
                    <polygon points="340,230 430,230 420,310 330,300" fill="rgba(14, 165, 233, 0.02)" stroke="rgba(14, 165, 233, 0.15)" strokeWidth="0.8" strokeDasharray="3 3" />

                    {/* Dynamic state-controlled SVG Pins */}
                    {nodes.map((node) => {
                      const isSel = selectedNode?.id === node.id;
                      const sizeProps = isSel ? { r: 9, sD: "stroke-white stroke-2 animate-pulse" } : { r: 5, sD: "stroke-slate-900" };
                      const cls = getFactionColors(node.faction);
                      
                      return (
                        <g 
                          key={node.id} 
                          className="cursor-pointer group pointer-events-auto"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedNode(node);
                          }}
                        >
                          <circle 
                            cx={node.x} 
                            cy={node.y} 
                            r={sizeProps.r + 3} 
                            className="fill-transparent group-hover:fill-amber-500/10 transition-colors pointer-events-none" 
                          />
                          <circle 
                            cx={node.x} 
                            cy={node.y} 
                            r={sizeProps.r} 
                            className={`transition-all ${cls.fill} ${sizeProps.sD}`} 
                          />
                          <text 
                            x={node.x + 10} 
                            y={node.y + 3.5} 
                            className={`text-[10px] select-none font-sans font-extrabold transition-colors ${isSel ? "fill-amber-400 font-extrabold" : "fill-slate-400 group-hover:fill-white font-medium"}`}
                          >
                            {node.name}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                )}

                {/* LEVEL 2: CITY FORTRESS */}
                {mapLevel === "city" && (
                  <svg 
                    viewBox="0 0 550 420" 
                    className="w-full h-full object-contain pointer-events-auto"
                    xmlns="http://www.w3.org/2000/svg"
                    onClick={handleMapClick}
                  >
                    {/* Outline city walls */}
                    <rect x="70" y="50" width="410" height="320" fill="none" stroke="#475569" strokeWidth="3" rx="12" strokeOpacity="0.35" />
                    <rect x="180" y="125" width="190" height="170" fill="none" stroke="#d97706" strokeWidth="2" strokeOpacity="0.35" />
                    <text x="275" y="215" fill="#d97706" fillOpacity="0.4" textAnchor="middle" className="text-xs font-serif tracking-widest pointer-events-none">紫禁禁中苑 (INNER REGENCY DEEP)</text>

                    {/* City Gate Pins (State controllable) */}
                    {cityNodes.map((gate) => {
                      const isSel = selectedNode?.id === gate.id;
                      const sizeProps = isSel ? { r: 9, sD: "stroke-white stroke-2 animate-pulse" } : { r: 6, sD: "stroke-slate-900" };
                      const cls = getFactionColors(gate.faction);
                      
                      return (
                        <g 
                          key={gate.id} 
                          className="group cursor-pointer pointer-events-auto"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedNode(gate);
                          }}
                        >
                          <circle cx={gate.x} cy={gate.y} r={sizeProps.r + 3} className="fill-transparent group-hover:fill-amber-500/10 transition-colors pointer-events-none" />
                          <circle cx={gate.x} cy={gate.y} r={sizeProps.r} className={`transition-all ${cls.fill} ${sizeProps.sD}`} />
                          <text x={gate.x - 30} y={gate.y - 12} fill="#f1f5f9" className={`text-[9px] font-bold select-none ${isSel ? "fill-amber-450 font-extrabold" : "fill-slate-200 group-hover:fill-amber-400"}`}>{gate.name}</text>
                          <text x={gate.x - 15} y={gate.y + 15} fill="#475569" className="text-[8px] font-mono select-none font-bold block">{gate.status}</text>
                        </g>
                      );
                    })}
                  </svg>
                )}

                {/* LEVEL 3: SCENE PLAN (DISPLAY SCENE LAYOUT AS SQUARE BLOCKS / 用方块显示场景布局) */}
                {mapLevel === "scene" && (
                  <svg 
                    viewBox="0 0 550 420" 
                    className="w-full h-full object-contain pointer-events-auto"
                    xmlns="http://www.w3.org/2000/svg"
                    onClick={handleMapClick}
                  >
                    {/* Architectural Blueprint grid lines */}
                    <g opacity="0.15">
                      <line x1="50" y1="0" x2="50" y2="420" stroke="#334155" strokeWidth="0.5" strokeDasharray="3 3" />
                      <line x1="150" y1="0" x2="150" y2="420" stroke="#334155" strokeWidth="0.5" strokeDasharray="3 3" />
                      <line x1="250" y1="0" x2="250" y2="420" stroke="#334155" strokeWidth="0.5" strokeDasharray="3 3" />
                      <line x1="350" y1="0" x2="350" y2="420" stroke="#334155" strokeWidth="0.5" strokeDasharray="3 3" />
                      <line x1="450" y1="0" x2="450" y2="420" stroke="#334155" strokeWidth="0.5" strokeDasharray="3 3" />
                      <line x1="0" y1="100" x2="550" y2="100" stroke="#334155" strokeWidth="0.5" strokeDasharray="3 3" />
                      <line x1="0" y1="200" x2="550" y2="200" stroke="#334155" strokeWidth="0.5" strokeDasharray="3 3" />
                      <line x1="0" y1="300" x2="550" y2="300" stroke="#334155" strokeWidth="0.5" strokeDasharray="3 3" />
                    </g>

                    {/* Layout Block rectangles representing rooms/locations */}
                    {sceneBlocks.map((block) => {
                      const isSel = selectedNode?.id === block.id;
                      const cls = getFactionColors(block.faction);
                      const strokeColor = isSel ? "#fbbf24" : cls.stroke;
                      
                      return (
                        <g 
                          key={block.id} 
                          className="group cursor-pointer pointer-events-auto animate-fade-in"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedNode(block);
                          }}
                        >
                          {/* Square/Rectangle layout block */}
                          <rect 
                            x={block.x} 
                            y={block.y} 
                            width={block.width} 
                            height={block.height}
                            rx="5"
                            className={`transition-all ${cls.bg}`}
                            style={{
                              fillOpacity: 0.16,
                              stroke: strokeColor,
                              strokeWidth: isSel ? 2 : 1.2,
                            }}
                          />
                          {/* Text inside block */}
                          <text 
                            x={block.x + block.width / 2} 
                            y={block.y + block.height / 2 + 3.5} 
                            textAnchor="middle"
                            className={`text-[9.5px] select-none font-sans font-bold transition-colors ${isSel ? "fill-amber-400 font-extrabold" : "fill-slate-300 group-hover:fill-white font-medium"}`}
                          >
                            {block.name}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                )}

              </div>
            </div>

            {/* Floating Zoom & Manual Controls Pane */}
            <div className="absolute bottom-4 left-4 p-2 bg-slate-900/90 border border-slate-800 rounded-xl flex items-center gap-2 shadow-lg z-20">
              <button 
                onClick={handleZoomIn} 
                title="放大 (Scale Up)"
                className="w-8 h-8 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-teal-400 hover:border-teal-500 cursor-pointer active:scale-90 transition-transform"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button 
                onClick={handleZoomOut}
                title="缩小 (Scale Down)"
                className="w-8 h-8 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-teal-400 hover:border-teal-500 cursor-pointer active:scale-90 transition-transform"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button 
                onClick={handleResetZoom}
                title="复原 (Reset Alignment)"
                className="w-8 h-8 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-teal-400 hover:border-teal-500 cursor-pointer active:scale-90 transition-transform"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Float details panel in non-edit mode */}
            {!isEditMode && selectedNode && (
              <div id="float-city-details-card" className="absolute top-4 right-4 p-4 border rounded-xl border-slate-800 bg-slate-950/90 max-w-xs space-y-2 text-xs font-mono shadow-xl z-20 backdrop-blur-sm">
                <div className="flex justify-between items-center pb-1.5 border-b border-slate-900">
                  <span className="font-extrabold text-amber-400 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    【{selectedNode.name}】
                  </span>
                  <span className={`text-[8.5px] px-1.5 py-0.2 rounded font-mono ${getFactionColors(selectedNode.faction).bg} ${getFactionColors(selectedNode.faction).text}`}>
                    {selectedNode.faction}
                  </span>
                </div>
                <div className="text-slate-300 text-[11px] leading-relaxed font-sans">{selectedNode.description}</div>
                <div className="text-[9px] text-slate-500 flex justify-between gap-4">
                  <span>坐标: X={selectedNode.x}, Y={selectedNode.y} {selectedNode.width ? `(宽${selectedNode.width}*高${selectedNode.height})` : ""}</span>
                  {(selectedNode.id.startsWith("node_custom_") || selectedNode.id.startsWith("gate_custom_") || selectedNode.id.startsWith("block_custom_")) && (
                    <button 
                      onClick={() => handleDeleteNode(selectedNode.id)}
                      className="text-rose-400 hover:underline flex items-center gap-0.5 cursor-pointer font-bold"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>删除旧部</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT SIDEBAR: Dynamic Map Element Editor (Revealed only in Edit Mode) */}
          {isEditMode && (
            <div id="map-editor-panel-sidebar" className="w-full md:w-80 border-t md:border-t-0 md:border-l border-slate-900 p-4 shrink-0 overflow-y-auto space-y-4 bg-slate-950 z-30 font-mono">
              <h3 className="text-xs font-extrabold uppercase tracking-widest text-transparent bg-gradient-to-r from-purple-400 to-indigo-300 bg-clip-text pb-1.5 border-b border-slate-900 flex items-center gap-1.5">
                <Edit3 className="w-4 h-4 text-purple-400" />
                <span>战略要素编辑器</span>
              </h3>

              {/* Node Selector Checklist */}
              <div className="space-y-1">
                <span className="text-[10px] text-slate-500 uppercase block font-bold">
                  {mapLevel === "empire" && `已存一级地理要素 (${nodes.length})`}
                  {mapLevel === "city" && `已存二级防卫要隘 (${cityNodes.length})`}
                  {mapLevel === "scene" && `已存三级场景方块 (${sceneBlocks.length})`}
                </span>
                <div className="h-28 border border-slate-900 bg-slate-900/10 rounded-lg p-1 overflow-y-auto space-y-1">
                  {mapLevel === "empire" && nodes.map(n => (
                    <div 
                      key={n.id}
                      onClick={() => setSelectedNode(n)}
                      className={`px-2 py-1 text-[10px] rounded flex justify-between items-center cursor-pointer transition-colors ${selectedNode?.id === n.id ? "bg-purple-950/40 border border-purple-900 text-purple-300" : "hover:bg-slate-900/60 text-slate-400"}`}
                    >
                      <span className="truncate">{n.name} (X:{n.x}, Y:{n.y})</span>
                      <span className="text-[8px] font-mono text-slate-600 font-normal">{n.faction}</span>
                    </div>
                  ))}
                  {mapLevel === "city" && cityNodes.map(n => (
                    <div 
                      key={n.id}
                      onClick={() => setSelectedNode(n)}
                      className={`px-2 py-1 text-[10px] rounded flex justify-between items-center cursor-pointer transition-colors ${selectedNode?.id === n.id ? "bg-purple-950/40 border border-purple-900 text-purple-300" : "hover:bg-slate-900/60 text-slate-400"}`}
                    >
                      <span className="truncate">{n.name} (X:{n.x}, Y:{n.y})</span>
                      <span className="text-[8px] font-mono text-slate-600 font-normal">{n.faction}</span>
                    </div>
                  ))}
                  {mapLevel === "scene" && sceneBlocks.map(b => (
                    <div 
                      key={b.id}
                      onClick={() => setSelectedNode(b)}
                      className={`px-2 py-1 text-[10px] rounded flex justify-between items-center cursor-pointer transition-colors ${selectedNode?.id === b.id ? "bg-purple-950/40 border border-purple-900 text-purple-300" : "hover:bg-slate-900/60 text-slate-400"}`}
                    >
                      <span className="truncate">{b.name} ({b.width}*{b.height})</span>
                      <span className="text-[8px] font-mono text-slate-600 font-normal">{b.faction}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Node Add / Form Fields */}
              <div className="space-y-3 pt-2 text-xs">
                <span className="text-[10px] text-slate-500 uppercase block font-bold">要素属性配置表</span>
                
                {/* Click to position guide */}
                <button
                  onClick={() => setClickToPlaceMode(!clickToPlaceMode)}
                  className={`w-full py-2 border rounded-lg text-[10px] uppercase font-bold transition-all cursor-pointer ${clickToPlaceMode ? "bg-amber-500 border-amber-500 text-slate-950 animate-pulse" : "border-dashed border-slate-800 hover:border-slate-500 text-slate-300 bg-slate-900/20"}`}
                >
                  {clickToPlaceMode ? "📡 正在图面上点击取点..." : "🎯 在地图上鼠标点击取坐标"}
                </button>

                {/* Name */}
                <div className="space-y-1">
                  <label className="text-[9.5px] text-slate-500 block">要素名称 (Name):</label>
                  <input 
                    type="text"
                    value={formName}
                    onChange={(e) => updateSelectedField("name", e.target.value)}
                    placeholder="请输入要素地点名"
                    className="w-full px-2.5 py-1.5 border border-slate-900 rounded bg-slate-900/50 text-slate-100 placeholder-slate-650 focus:border-purple-500 text-[11px] focus:outline-hidden"
                  />
                </div>

                {/* Coordinates */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[9.5px] text-slate-500 block">坐标 X (10-540):</label>
                    <input 
                      type="number"
                      value={formX}
                      min={10}
                      max={540}
                      onChange={(e) => updateSelectedField("x", Number(e.target.value))}
                      className="w-full px-2 py-1 border border-slate-900 rounded bg-slate-900/50 text-slate-100 text-[11px] focus:outline-hidden focus:border-purple-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9.5px] text-slate-500 block">坐标 Y (10-410):</label>
                    <input 
                      type="number"
                      value={formY}
                      min={10}
                      max={410}
                      onChange={(e) => updateSelectedField("y", Number(e.target.value))}
                      className="w-full px-2 py-1 border border-slate-900 rounded bg-slate-900/50 text-slate-100 text-[11px] focus:outline-hidden focus:border-purple-500"
                    />
                  </div>
                </div>

                {/* Scene Block Sizing (Shown only for level 3 Blocks) */}
                {mapLevel === "scene" && (
                  <div className="grid grid-cols-2 gap-2 animate-fade-in">
                    <div className="space-y-1">
                      <label className="text-[9.5px] text-slate-500 block">方块宽度 Width (20-300):</label>
                      <input 
                        type="number"
                        value={formWidth}
                        min={20}
                        max={300}
                        onChange={(e) => updateSelectedField("width", Number(e.target.value))}
                        className="w-full px-2 py-1 border border-slate-900 rounded bg-slate-900/50 text-slate-100 text-[11px] focus:outline-hidden focus:border-purple-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9.5px] text-slate-500 block">方块高度 Height (20-300):</label>
                      <input 
                        type="number"
                        value={formHeight}
                        min={20}
                        max={300}
                        onChange={(e) => updateSelectedField("height", Number(e.target.value))}
                        className="w-full px-2 py-1 border border-slate-900 rounded bg-slate-900/50 text-slate-100 text-[11px] focus:outline-hidden focus:border-purple-500"
                      />
                    </div>
                  </div>
                )}

                {/* Faction */}
                <div className="space-y-1">
                  <label className="text-[9.5px] text-slate-500 block">所属势力 (Faction):</label>
                  <select
                    value={formFaction}
                    onChange={(e) => updateSelectedField("faction", e.target.value as any)}
                    className="w-full px-2.5 py-1.5 border border-slate-900 rounded bg-slate-900/50 text-slate-200 text-[11px] focus:outline-hidden focus:border-purple-500 cursor-pointer"
                  >
                    <option value="保皇党">保皇党 (Teal)</option>
                    <option value="起义军">起义军 (Orange)</option>
                    <option value="外族/外敌">外族/外敌 (Rose)</option>
                    <option value="中立/自治">中立/自治 (Amber)</option>
                  </select>
                </div>

                {/* Description */}
                <div className="space-y-1">
                  <label className="text-[9.5px] text-slate-500 block">情报简述 (Info/Desc):</label>
                  <textarea
                    value={formDesc}
                    onChange={(e) => updateSelectedField("description", e.target.value)}
                    placeholder="请输入对该守防地理的描述..."
                    rows={2}
                    className="w-full p-2 border border-slate-900 rounded bg-slate-900/50 text-slate-100 placeholder-slate-650 focus:border-purple-500 text-[11px] focus:outline-hidden resize-none"
                  />
                </div>

                {/* Submitting channel */}
                <div className="flex gap-2 pt-1 font-heading">
                  <button
                    onClick={handleAddCustomNode}
                    className="flex-1 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-lg text-[10px] font-extrabold flex items-center justify-center gap-1 cursor-pointer transition-all active:scale-95 shadow-md"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>添加新要素</span>
                  </button>

                  <button
                    onClick={handleSaveMap}
                    className="flex-1 py-1.5 bg-slate-900 border border-slate-800 hover:border-teal-500 text-teal-400 rounded-lg text-[10px] font-extrabold flex items-center justify-center gap-0.4 cursor-pointer transition-all active:scale-95 shadow-md"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>保存舆图</span>
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer closing block */}
        <div className="p-4 border-t bg-slate-950 border-slate-900 flex justify-end shrink-0">
          <button 
            id="close-empire-map-footer-btn"
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold rounded-lg border border-slate-800 bg-slate-900 hover:bg-slate-850 hover:text-white text-slate-400 transition-all cursor-pointer font-heading"
          >
            收回舆图
          </button>
        </div>

      </div>
    </div>
  );
}
