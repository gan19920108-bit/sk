import { useState } from 'react';
import { useDataStore } from './store';
import type { StatData, InventoryItem } from './store';

// 枚举类型定义
const TimelineType = {
  MING: '明末遗恨',
  TUMU: '土木之变',
  JINGKANG: '靖康之耻',
  ANSHI: '安史之乱',
  WUHU: '五胡乱华',
  CUSTOM: '自定义时空'
} as const;

const SystemTemplateSpec = {
  NONE: '无系统',
  CARD: '诸天抽卡系统',
  MERCHANT: '万象货栈系统',
  SIGNIN: '最强签到系统',
  SLACK: '摆烂系统',
  FOOLISH: '昏君系统',
  TRAGIC: '亡国明君系统',
  CUSTOM: '自定义系统'
} as const;

const TalentSpec = {
  NONE: '无天赋',
  INSIGHT: '洞察术',
  STEALTH: '隐身术',
  ALCHEMY: '点石成金术',
  HYPNOSIS: '催眠术',
  EARTH_TUNNEL: '遁地术',
  DIVINATION: '算卜术',
  ENDURANCE: '金枪不倒术',
  CUSTOM: '自定义天赋'
} as const;

// 主应用组件 - 适配酒馆 iframe 环境
export default function App() {
  const { statData } = useDataStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'inventory' | 'missions' | 'events'>('overview');

  // 获取游戏状态
  const gameState = {
    playerName: statData.主角.名称 || '未命名',
    gender: statData.主角.性别 || '未知',
    isStarted: statData.游戏进度.已开始,
    timeline: statData.世界.当前时空,
    systemTemplate: statData.主角.系统模板,
    talent: statData.主角.天赋,
    attributes: statData.主角.属性,
    gold: statData.主角.金币,
    systemPoints: statData.主角.系统点数,
    levelName: statData.主角.等级 || '凡人',
    currentYear: statData.世界.年号 || '未定',
    dayCount: statData.游戏进度.天数,
  };

  // 获取背包物品
  const inventoryItems: InventoryItem[] = Object.entries(statData.背包 || {}).map(([name, item]) => ({
    id: name,
    name,
    quantity: item.数量,
    rarity: item.稀有度,
    description: item.描述,
    equipped: item.已装备,
    canUse: item.可使用,
    effect: item.效果,
    goldValue: item.金币价值,
  }));

  // 统计
  const nationalWealth = Math.max(0, Math.min(100, statData.世界.国祚));
  const popularSupport = statData.世界.民心;
  const military = statData.世界.军事;
  const corruption = statData.世界.腐败;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white p-4 font-sans">
      {/* 顶部状态条 */}
      <div className="flex items-center justify-between mb-4 p-3 bg-slate-800/80 rounded-lg border border-slate-600">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center font-bold text-lg">
            {gameState.playerName.charAt(0) || '?'}
          </div>
          <div>
            <div className="font-bold text-amber-400">{gameState.playerName}</div>
            <div className="text-xs text-slate-400">{gameState.levelName} · {gameState.timeline}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-amber-400 font-bold">{gameState.gold} 💰</div>
          <div className="text-xs text-slate-400">第 {gameState.dayCount} 天</div>
        </div>
      </div>

      {/* 标签页导航 */}
      <div className="flex gap-2 mb-4">
        {(['overview', 'inventory', 'missions', 'events'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab
                ? 'bg-amber-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            {tab === 'overview' && '📊 总览'}
            {tab === 'inventory' && '🎒 背包'}
            {tab === 'missions' && '📜 任务'}
            {tab === 'events' && '⚡ 事件'}
          </button>
        ))}
      </div>

      {/* 标签页内容 */}
      <div className="bg-slate-800/80 rounded-lg border border-slate-600 p-4 min-h-[300px]">
        {activeTab === 'overview' && (
          <div className="space-y-4">
            {/* 核心指标 */}
            <div className="grid grid-cols-2 gap-3">
              <StatBar label="国祚" value={nationalWealth} color="from-green-500 to-emerald-600" />
              <StatBar label="民心" value={popularSupport} color="from-blue-500 to-cyan-600" />
              <StatBar label="军事" value={military} color="from-red-500 to-rose-600" />
              <StatBar label="腐败" value={corruption} color="from-purple-500 to-violet-600" inverse />
            </div>

            {/* 主角属性 */}
            <div className="border-t border-slate-600 pt-4">
              <h3 className="text-sm font-bold text-amber-400 mb-2">主角属性</h3>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="bg-slate-700/50 p-2 rounded">
                  <span className="text-slate-400">生命</span>
                  <div className="text-white font-bold">{gameState.attributes.生命}/{gameState.attributes.最大生命}</div>
                </div>
                <div className="bg-slate-700/50 p-2 rounded">
                  <span className="text-slate-400">体力</span>
                  <div className="text-white font-bold">{statData.主角.体力.当前}/{statData.主角.体力.最大}</div>
                </div>
                <div className="bg-slate-700/50 p-2 rounded">
                  <span className="text-slate-400">金币</span>
                  <div className="text-amber-400 font-bold">{gameState.gold}</div>
                </div>
              </div>
            </div>

            {/* 系统信息 */}
            <div className="border-t border-slate-600 pt-4">
              <h3 className="text-sm font-bold text-amber-400 mb-2">系统模板 & 天赋</h3>
              <div className="flex gap-2 flex-wrap">
                <span className="px-2 py-1 bg-cyan-600/30 text-cyan-300 rounded text-xs">
                  {gameState.systemTemplate}
                </span>
                <span className="px-2 py-1 bg-purple-600/30 text-purple-300 rounded text-xs">
                  {gameState.talent}
                </span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'inventory' && (
          <div className="space-y-2">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-bold text-amber-400">背包物品</h3>
              <span className="text-xs text-slate-400">{inventoryItems.length} 件物品</span>
            </div>
            {inventoryItems.length === 0 ? (
              <div className="text-center text-slate-500 py-8">背包空空如也</div>
            ) : (
              inventoryItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-2 bg-slate-700/50 rounded">
                  <div className="flex items-center gap-2">
                    <RarityDot rarity={item.rarity} />
                    <span className="text-sm">{item.name}</span>
                    <span className="text-xs text-slate-500">×{item.quantity}</span>
                  </div>
                  {item.equipped && (
                    <span className="px-1 py-0.5 bg-green-600/30 text-green-300 text-xs rounded">已装备</span>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'missions' && (
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-amber-400 mb-3">任务列表</h3>
            {Object.keys(statData.任务 || {}).length === 0 ? (
              <div className="text-center text-slate-500 py-8">暂无任务</div>
            ) : (
              Object.entries(statData.任务).map(([id, mission]) => (
                <div key={id} className="p-3 bg-slate-700/50 rounded">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium">{mission.标题}</span>
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      mission.类型 === '主线羁绊' ? 'bg-red-600/30 text-red-300' :
                      mission.类型 === '模拟经营' ? 'bg-blue-600/30 text-blue-300' :
                      mission.类型 === '沙盒生存' ? 'bg-green-600/30 text-green-300' :
                      'bg-purple-600/30 text-purple-300'
                    }`}>
                      {mission.类型}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mb-2">{mission.描述}</div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-slate-600 rounded overflow-hidden">
                      <div
                        className="h-full bg-amber-500"
                        style={{ width: `${(mission.进度 / mission.目标值) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-slate-400">{mission.进度}/{mission.目标值}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'events' && (
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-amber-400 mb-3">世界事件</h3>
            {Object.keys(statData.世界事件 || {}).length === 0 ? (
              <div className="text-center text-slate-500 py-8">暂无事件</div>
            ) : (
              Object.entries(statData.世界事件).map(([id, event]) => (
                <div key={id} className="p-3 bg-slate-700/50 rounded">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-medium">{event.标题}</span>
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      event.严重程度 === '常态' ? 'bg-slate-600 text-slate-300' :
                      event.严重程度 === '严峻' ? 'bg-yellow-600/30 text-yellow-300' :
                      event.严重程度 === '毁灭性' ? 'bg-red-600/30 text-red-300' :
                      'bg-green-600/30 text-green-300'
                    }`}>
                      {event.严重程度}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400">{event.地点}</div>
                  <div className="text-sm text-slate-300 mt-2">{event.描述}</div>
                  <div className="text-xs text-amber-500 mt-2">剩余 {event.持续回合} 回合</div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// 属性条组件
function StatBar({ label, value, color, inverse = false }: {
  label: string;
  value: number;
  color: string;
  inverse?: boolean;
}) {
  const displayValue = inverse ? 100 - value : value;
  const displayColor = inverse ? 'from-purple-500 to-violet-600' : color;

  return (
    <div className="bg-slate-700/50 p-2 rounded">
      <div className="flex justify-between text-xs mb-1">
        <span className="text-slate-400">{label}</span>
        <span className={displayValue < 30 ? 'text-red-400' : displayValue > 70 ? 'text-green-400' : 'text-slate-300'}>
          {Math.round(value)}
        </span>
      </div>
      <div className="h-2 bg-slate-600 rounded overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r ${displayColor} transition-all`}
          style={{ width: `${displayValue}%` }}
        />
      </div>
    </div>
  );
}

// 稀有度点组件
function RarityDot({ rarity }: { rarity: string }) {
  const colors: Record<string, string> = {
    '普通': 'bg-slate-400',
    '稀有': 'bg-blue-400',
    '史诗': 'bg-purple-400',
    '传说': 'bg-orange-400',
    '神话': 'bg-pink-400',
  };

  return <div className={`w-2 h-2 rounded-full ${colors[rarity] || 'bg-slate-400'}`} />;
}
