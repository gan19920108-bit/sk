/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Use standard enums as required
export enum TimelineType {
  MING = "明末遗恨",
  TUMU = "土木之变",
  JINGKANG = "靖康之耻",
  ANSHI = "安史之乱",
  WUHU = "五胡乱华",
  CUSTOM = "自定义时空"
}

export enum SystemTemplateSpec {
  NONE = "无系统",
  CARD = "诸天抽卡系统",
  MERCHANT = "万象货栈系统",
  SIGNIN = "最强签到系统",
  SLACK = "摆烂系统",
  FOOLISH = "昏君系统",
  TRAGIC = "亡国明君系统",
  CUSTOM = "自定义系统"
}

export enum TalentSpec {
  NONE = "无天赋",
  INSIGHT = "洞察术",
  STEALTH = "隐身术",
  ALCHEMY = "点石成金术",
  HYPNOSIS = "催眠术",
  EARTH_TUNNEL = "遁地术",
  DIVINATION = "算卜术",
  ENDURANCE = "金枪不倒术",
  CUSTOM = "自定义天赋"
}

export interface PlayerAttributes {
  hp: number;
  maxHp: number;
  lifespan: number;
  strength: number;
  intelligence: number;
  charisma: number;
  luck: number;
  emperorPrestige: number; // 帝王威仪
  karma: number; // 因果值/气运
  
  // Dynamic fields
  identity: string;
  age: number;
  title: string;
  energy: number;
  maxEnergy: number;
  satiety: number;
  maxSatiety: number;
  attack: number;
  defense: number;
  moralAlignment: number; // 善恶度: -100 ~ 100
  orderAlignment: number; // 明昏度: -100 ~ 100
  experience: number; // 经验值
  
  // Basic attributes
  agility: number;
  perseverance: number;
  endurance: number;
  
  // Skill attributes
  skillMelee: number;
  skillRanged: number;
  skillDriving: number;
  skillCommunication: number;
  skillCrafting: number;
  skillArt: number;
  skillAthletics: number;
  skillAcuteness: number;
  skillCamouflage: number;
}

export interface FactionStatus {
  id: string;
  name: string;
  favor: number; // 0 - 100
  power: number; // Influence level
  description: string;
}

export interface NPCCharacter {
  id: string;
  name: string;
  role: string;
  avatarId: string;
  loyalty: number; // 0 - 100
  affection: number; // 好感 0 - 100
  faction: string;
  status: "活耀" | "已流放" | "已处决" | "隐退" | "战死";
  notableDeeds: string;
  
  // Custom new attributes for extended court relations
  avatarUrl?: string;
  age?: number;
  hp?: number;
  maxHp?: number;
  attack?: number;
  defense?: number;
  
  // Basic attributes
  strength?: number;
  agility?: number;
  intelligence?: number;
  charisma?: number;
  perseverance?: number;
  endurance?: number;
  luck?: number;

  // Skill attributes
  skillMelee?: number;
  skillRanged?: number;
  skillDriving?: number;
  skillCommunication?: number;
  skillCrafting?: number;
  skillArt?: number;
  skillAthletics?: number;
  skillAcuteness?: number;
  skillCamouflage?: number;

  // Thoughts and memories
  innerThoughts?: string;
  playerMemory?: string;
}

export interface Province {
  id: string;
  name: string;
  population: number; // 在千万级
  control: "保皇党" | "起义军" | "外族/外敌" | "中立/自治";
  controlPercent: number; // 0 - 100
  taxRate: number; // 0 - 100
  defenseLevel: number; // 0 - 100
  unrest: number; // 民怨 0 - 100
}

export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  rarity: "普通" | "稀有" | "史诗" | "传说" | "神话";
  description: string;
  equipped: boolean;
  canUse: boolean;
  effect?: string;
  goldValue: number;
}

export interface Mission {
  id: string;
  title: string;
  desc: string;
  type: "主线羁绊" | "模拟经营" | "沙盒生存" | "系统特派";
  target: string;
  progress: number; // current progress
  targetValue: number; // maximum target
  rewardDesc: string;
  completed: boolean;
  claimed: boolean;
  penaltyDesc?: string;
}

export interface ChronicleRecord {
  id: string;
  year: string;
  chapter: string;
  eventText: string;
  playerDecision: string;
  dynamicPrompt?: string; // Saved LLM Prompt Context
  impactDesc: string;
  timestamp: string;
}

export interface WorldEvent {
  id: string;
  title: string;
  severity: "常态" | "严峻" | "毁灭性" | "祥瑞";
  location: string;
  desc: string;
  durationLeft: number; // turns left
}

export interface GameState {
  playerName: string;
  gender: string;
  isStarted: boolean;
  timeline: TimelineType;
  customTimelineText?: string;
  systemTemplate: SystemTemplateSpec;
  customSystemText?: string;
  talent: TalentSpec;
  customTalentText?: string;
  selectedItems: string[];
  
  // Attributes
  attributes: PlayerAttributes;
  gold: number;
  systemPoints: number;
  levelName: string; // Faction rank / Cultivation tier
  
  // Game simulation state
  currentYear: string;
  dayCount: number;
  mainStoryLog: string[];
}

export interface SystemCard {
  id: string;
  name: string;
  rarity: "普通" | "稀有" | "史诗" | "传说" | "神话";
  type: "英灵" | "宝物" | "神术" | "气运";
  description: string;
  effect: string;
  claimed: boolean;
}
