/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { InventoryItem } from "../types";
import { Briefcase, Coins, Shield, Sparkles, AlertCircle, Trash2, Heart, Backpack } from "lucide-react";

interface InventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: InventoryItem[];
  gold: number;
  onUseItem: (itemId: string) => void;
  onDiscardItem?: (itemId: string) => void;
  onToggleEquipItem?: (itemId: string) => void;
}

export default function InventoryModal({
  isOpen,
  onClose,
  items,
  gold,
  onUseItem,
  onDiscardItem,
  onToggleEquipItem
}: InventoryModalProps) {
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false);

  if (!isOpen) return null;

  // Categorize equipped items into slots
  const getEquippedItemBySlot = (slot: "head" | "body" | "accessory" | "hand" | "foot" | "handheld") => {
    return items.find((i) => {
      if (!i.equipped) return false;
      const lower = i.name.toLowerCase();
      if (slot === "handheld") {
        return lower.includes("剑") || lower.includes("刀") || lower.includes("枪") || lower.includes("杖") || lower.includes("符");
      }
      if (slot === "body") {
        return lower.includes("衣") || lower.includes("甲") || lower.includes("袍") || lower.includes("服");
      }
      if (slot === "head") {
        return lower.includes("盔") || lower.includes("帽") || lower.includes("头冠") || lower.includes("发簪");
      }
      if (slot === "hand") {
        return lower.includes("套") || lower.includes("戒指") || lower.includes("护手") || lower.includes("镯");
      }
      if (slot === "foot") {
        return lower.includes("靴") || lower.includes("鞋") || lower.includes("履");
      }
      if (slot === "accessory") {
        return lower.includes("碗") || lower.includes("镜") || lower.includes("佩") || lower.includes("珠") || lower.includes("戒") || (!lower.includes("剑") && !lower.includes("刀") && !lower.includes("甲") && !lower.includes("衣"));
      }
      return false;
    });
  };

  const equippedHead = getEquippedItemBySlot("head");
  const equippedBody = getEquippedItemBySlot("body");
  const equippedAccessory = getEquippedItemBySlot("accessory");
  const equippedHand = getEquippedItemBySlot("hand");
  const equippedFoot = getEquippedItemBySlot("foot");
  const equippedHandheld = getEquippedItemBySlot("handheld");

  const getRarityStyle = (rarity: string) => {
    switch (rarity) {
      case "神话": return "text-red-400 border-red-500/20 bg-red-500/5";
      case "传说": return "text-amber-400 border-amber-500/20 bg-amber-500/5";
      case "史诗": return "text-purple-400 border-purple-500/20 bg-purple-500/5";
      case "稀有": return "text-cyan-400 border-cyan-500/20 bg-cyan-500/5";
      default: return "text-slate-400 border-slate-800 bg-slate-900/40";
    }
  };

  // Click on a item block
  const handleItemBlockClick = (item: InventoryItem) => {
    setSelectedItem(item);
    setIsDetailOpen(true);
  };

  // Trigger usage or equipping
  const handleUseAction = () => {
    if (!selectedItem) return;
    if (selectedItem.canUse) {
      onUseItem(selectedItem.id);
      setIsDetailOpen(false);
      setSelectedItem(null);
    } else {
      // It is an equippable item, toggles equip state
      if (onToggleEquipItem) {
        onToggleEquipItem(selectedItem.id);
        setIsDetailOpen(false);
        setSelectedItem(null);
      }
    }
  };

  // Discard action
  const handleDiscardAction = () => {
    if (!selectedItem) return;
    if (onDiscardItem) {
      onDiscardItem(selectedItem.id);
      setIsDetailOpen(false);
      setSelectedItem(null);
    }
  };

  return (
    <div id="storage-backpack-view-container" className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in select-none text-slate-100">
      <div id="backpack-modal-card" className="relative w-full max-w-4xl overflow-hidden border rounded-2xl bg-slate-950 border-amber-500/30 shadow-2xl shadow-yellow-500/10 flex flex-col h-[80vh]">
        
        {/* Glow boarder accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-500 via-amber-400 to-rose-500"></div>

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b bg-slate-950 border-slate-900 shrink-0">
          <h2 className="flex items-center gap-2 text-lg font-extrabold tracking-widest text-transparent font-heading bg-gradient-to-r from-amber-400 to-yellow-250 bg-clip-text">
            <Backpack className="w-5 h-5 text-amber-500" />
            天演量子储物空间 (HOST INVENTORY)
          </h2>
          <button 
            id="quit-backpack-top-btn"
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 transition-colors rounded-full text-slate-400 hover:text-rose-500 hover:bg-rose-500/10"
          >
            ✕
          </button>
        </div>

        {/* Core Screen Body split */}
        <div className="flex-1 flex min-h-0 overflow-hidden bg-slate-950">
          
          {/* LEFT COLUMN: Character's Equipment Slots */}
          <div className="w-2/5 border-r border-slate-900 p-5 flex flex-col justify-start gap-4 shrink-0 overflow-y-auto">
            <span className="text-[10px] text-slate-500 font-bold tracking-wider uppercase font-mono block border-b border-slate-900 pb-1.5 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-teal-400" />
              宿体装备槽 (EQUIPPED SLOTS)
            </span>

            <div className="space-y-2 font-mono">
              {[
                { label: "头部 (Helmet)", item: equippedHead, key: "head" },
                { label: "身体 (Armor)", item: equippedBody, key: "body" },
                { label: "饰品 (Accessory)", item: equippedAccessory, key: "accessory" },
                { label: "手部 (Bracer)", item: equippedHand, key: "hand" },
                { label: "足部 (Boots)", item: equippedFoot, key: "foot" },
                { label: "手持 (Handheld)", item: equippedHandheld, key: "handheld" }
              ].map((slot) => (
                <div 
                  key={slot.key}
                  onClick={() => {
                    if (slot.item) handleItemBlockClick(slot.item);
                  }}
                  className={`p-3 rounded-xl border flex flex-col justify-center transition-all ${slot.item ? "bg-amber-500/5 border-amber-500/30 cursor-pointer hover:border-amber-500" : "bg-slate-900/10 border-slate-900 text-slate-650"}`}
                >
                  <div className="flex justify-between text-[9px] text-slate-500 mb-0.5">
                    <span>{slot.label}</span>
                    {slot.item && <span className="text-emerald-400 font-bold uppercase shrink-0">已装配</span>}
                  </div>
                  {slot.item ? (
                    <span className="text-xs font-bold text-slate-200 truncate">{slot.item.name}</span>
                  ) : (
                    <span className="text-xs text-slate-600 tracking-wide italic">[ 暂无挂置 ]</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN: Grid list of items as blocks */}
          <div className="flex-grow p-5 overflow-y-auto space-y-4">
            <span className="text-[10px] text-slate-500 font-bold tracking-wider uppercase font-mono block border-b border-slate-900 pb-1.5 flex items-center gap-1.5">
              <Backpack className="w-3.5 h-3.5 text-amber-500" />
              随身储物格子 (BACKPACK BLOCKS)
            </span>

            {items.length === 0 ? (
              <div className="text-center text-slate-600 py-24 text-xs italic font-mono">
                储藏格子空空如也，前往系统终端或探索获取物资。
              </div>
            ) : (
              <div id="backpack-item-grid-blocks" className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {items.map((it) => (
                  <button
                    key={it.id}
                    onClick={() => handleItemBlockClick(it)}
                    className={`p-3.5 rounded-xl border text-left flex flex-col justify-between h-24 relative overflow-hidden transition-all hover:scale-102 cursor-pointer duration-205 group ${selectedItem?.id === it.id ? "bg-amber-500/10 border-amber-500 select-none shadow-lg" : "bg-slate-900/15 border-slate-900 hover:border-slate-800"}`}
                  >
                    <div className="absolute top-0 right-0 w-8 h-8 pointer-events-none opacity-5 bg-radial-at-tr from-white to-transparent"></div>
                    
                    <div className="flex justify-between items-start gap-1 w-full text-xs">
                      <span className="font-extrabold text-slate-250 line-clamp-2 leading-tight group-hover:text-amber-400 transition-colors uppercase">
                        {it.name}
                      </span>
                      <span className="text-[9.5px] font-bold font-mono px-1 rounded-sm border border-slate-900 bg-slate-950 text-slate-400 shrink-0">
                        x{it.quantity}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-[8.5px] font-mono mt-2 w-full pt-1.5 border-t border-slate-900/50">
                      <span className={`px-1.5 py-0.2 rounded border font-bold uppercase ${getRarityStyle(it.rarity)}`}>
                        {it.rarity}
                      </span>
                      {it.equipped && (
                        <span className="text-emerald-400 font-bold shrink-0">已配衣</span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* BOTTOM ACTION BAR (Silver Balance, Use, and Discard controls) */}
        <div className="p-4 border-t bg-slate-950 border-slate-950 flex flex-col sm:flex-row justify-between items-center gap-3 shrink-0">
          {/* Current Wealth */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
            <Coins className="w-4 h-4 text-yellow-500 animate-spin" style={{ animationDuration: "12s" }} />
            <span>行库可用饷银余额: <b id="backpack-footer-gold" className="text-slate-150 font-black">{gold} 两</b></span>
          </div>

          {/* Core controls */}
          <div className="flex items-center gap-2 w-full sm:w-auto font-heading">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold rounded-lg border border-slate-800 bg-slate-900 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              收存背包
            </button>
          </div>
        </div>

      </div>

      {/* DETAILED INTERACTIVE POPUP MODAL ON SELECTED BLOCK */}
      {isDetailOpen && selectedItem && (
        <div id="backpack-detail-picker-popup" className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in text-slate-100">
          <div className="w-full max-w-md border rounded-2xl bg-slate-950 border-amber-500/30 p-6 space-y-5 shadow-2xl shadow-yellow-500/5">
            
            {/* Upper specs */}
            <div className="space-y-2">
              <span className="text-[9px] text-slate-500 font-bold tracking-widest block uppercase font-mono">Item specifications // 物资量子谱</span>
              <h3 className="text-base font-extrabold text-white">{selectedItem.name}</h3>
              <div className="flex gap-2">
                <span className={`text-[10px] px-2 py-0.5 border rounded-md font-mono ${getRarityStyle(selectedItem.rarity)}`}>
                  级别: {selectedItem.rarity}
                </span>
                <span className="text-[10px] px-2 py-0.5 border border-slate-800 rounded bg-slate-950 font-mono font-bold text-slate-400">
                  拥有数量: x{selectedItem.quantity}
                </span>
              </div>
            </div>

            {/* Desc contract */}
            <div className="p-4 border rounded-xl bg-slate-900/30 border-slate-900 space-y-2 text-xs leading-normal">
              <span className="font-bold text-slate-500 block pb-1 border-b border-slate-950 font-mono text-[10px]">【物要简介】:</span>
              <p className="text-slate-350 italic text-[11px]">{selectedItem.description}</p>
            </div>

            {/* Effects */}
            {selectedItem.effect && (
              <div className="p-3.5 border border-teal-500/15 rounded-xl bg-teal-500/5 space-y-1 text-xs">
                <span className="font-bold text-teal-400 block font-mono text-[10px]">加持增补功效:</span>
                <p className="text-slate-200 font-mono text-[10.5px] leading-relaxed">{selectedItem.effect}</p>
              </div>
            )}

            {/* Silver trade pricing info */}
            <div className="text-[10px] text-slate-500 font-mono border-t border-slate-900 pt-3 flex justify-between">
              <span>兑换白银估价:</span>
              <span className="text-yellow-500">{selectedItem.goldValue} 两</span>
            </div>

            {/* Actions floor: Only allow Use/Equip & Discard if NOT equipped or if standard bag item */}
            <div className="grid grid-cols-2 gap-2 pt-1 font-heading">
              
              {/* Usable / Equippable handle */}
              <button
                onClick={handleUseAction}
                className="py-2.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-yellow-400 text-black font-extrabold rounded-xl text-xs text-center cursor-pointer transition-all active:scale-95 shadow-md flex items-center justify-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>
                  {selectedItem.canUse 
                    ? "吞服使用" 
                    : (selectedItem.equipped ? "卸下装备" : "装配该件")}
                </span>
              </button>

              {/* Discard item */}
              <button
                onClick={handleDiscardAction}
                disabled={selectedItem.equipped}
                title={selectedItem.equipped ? "处于装备状态，严禁丢弃！" : "丢弃该件物资到虚空"}
                className="py-2.5 bg-slate-900 border border-slate-850 hover:border-rose-500 text-slate-400 hover:text-rose-400 text-xs font-extrabold rounded-xl transition-all active:scale-95 cursor-pointer disabled:opacity-25 disabled:cursor-not-allowed flex items-center justify-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>物理丢弃</span>
              </button>

            </div>

            {/* Close details popup button */}
            <button
              onClick={() => setIsDetailOpen(false)}
              className="w-full py-2 border border-slate-900 bg-slate-900 hover:bg-slate-850 rounded-lg text-slate-400 font-bold text-xs transition-colors cursor-pointer text-center block font-heading"
            >
              返回储藏格
            </button>

          </div>
        </div>
      )}

    </div>
  );
}
