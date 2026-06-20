import { TimelineType, SystemTemplateSpec, TalentSpec, NPCCharacter, Province, InventoryItem, Mission, WorldEvent, SystemCard } from "../types";

export interface TimelineConfig {
  timeline: TimelineType;
  title: string;
  hostName: string;
  era: string;
  desc: string;
  startingStory: string;
  initialNpcs: NPCCharacter[];
  initialProvinces: Province[];
  recommendedDecisions: string[];
}

export const TIMELINE_PRESETS: Record<TimelineType, TimelineConfig> = {
  [TimelineType.MING]: {
    timeline: TimelineType.MING,
    title: "【明末遗恨】",
    hostName: "朱由检 (崇祯帝)",
    era: "崇祯十七年三月十九日",
    desc: "大顺叛军围攻京城，金銮殿上大臣溃逃。吴三桂关外拥兵，建州关外虎视，大明万劫不复之末路！",
    startingStory: "崇祯十七年三月十九日晨。京城外炮火连天，李自成部大将刘宗敏调高了攻城诸炮。内城已被叛党太监打开，太监王承恩随侍一侧。你坐在金銮紫禁之巅，面前杯盘狼藉。大明江山在此存亡一瞬！",
    initialNpcs: [
      { id: "npc_1", name: "王承恩", role: "司礼监秉笔太监", avatarId: "ri-user-star-line", loyalty: 100, affection: 95, faction: "保皇党", status: "活耀", notableDeeds: "常年服刑，深宫掌权，却死心效忠。" },
      { id: "npc_2", name: "吴三桂", role: "平西伯·山海关总兵", avatarId: "ri-sword-line", loyalty: 45, affection: 50, faction: "独立军阀", status: "活耀", notableDeeds: "佣兵自重，扼守辽东，手握全明最强关宁铁骑。" },
      { id: "npc_3", name: "魏藻德", role: "首辅内阁大学士", avatarId: "ri-user-voice-line", loyalty: 15, affection: 30, faction: "降党集团", status: "活耀", notableDeeds: "无才无能。正密谋大开皇城恭迎新闯王大驾。" },
      { id: "npc_4", name: "李自成", role: "大顺闯王", avatarId: "ri-skull-line", loyalty: 0, affection: 0, faction: "大顺起义军", status: "活耀", notableDeeds: "起于陇亩，横扫中原，率红军百万合围燕京。" }
    ],
    initialProvinces: [
      { id: "p_1", name: "京师顺天府", population: 120, control: "保皇党", controlPercent: 40, taxRate: 85, defenseLevel: 30, unrest: 90 },
      { id: "p_2", name: "山海关辽东", population: 80, control: "中立/自治", controlPercent: 85, taxRate: 30, defenseLevel: 95, unrest: 20 },
      { id: "p_3", name: "中原河南领", population: 640, control: "起义军", controlPercent: 95, taxRate: 40, defenseLevel: 10, unrest: 95 },
      { id: "p_4", name: "江南应天府", population: 1500, control: "保皇党", controlPercent: 90, taxRate: 50, defenseLevel: 60, unrest: 45 }
    ],
    recommendedDecisions: [
      "宣召勤王，急调吴三桂星夜入关",
      "斩杀降臣魏藻德，亲率神机营誓死守门",
      "起用火器大炮轰击大顺军中军大营",
      "转移金银前往金陵行在，暂避兵锋"
    ]
  },
  [TimelineType.TUMU]: {
    timeline: TimelineType.TUMU,
    title: "【土木之变】",
    hostName: "朱祁镇 (明英宗)",
    era: "正统十四年八月十五",
    desc: "怀来旷野血流漂橹，二十万精锐尽数覆没。也先的瓦剌先锋铁骑包围帝帐，哗兵痛哭刀指太监王振！",
    startingStory: "正统十四年八月十五夜。怀来土木堡之野，漫天烟火混着大明将士破碎的盔角。狂风肆虐处，大明英国公张辅等勋贵悉数战死。也先一翼瓦剌魔骑已突至天子黄金战车百米之内，兵校哗然痛哭，正手持战斧围杀佞臣王振！",
    initialNpcs: [
      { id: "npc_5", name: "樊忠", role: "护卫将军", avatarId: "ri-shield-user-line", loyalty: 95, affection: 90, faction: "保皇党", status: "活耀", notableDeeds: "体格魁梧，赤胆忠心，于乱军中愤斩奸臣王振。" },
      { id: "npc_6", name: "也先", role: "瓦剌大太师", avatarId: "ri-skull-fill", loyalty: 0, affection: 5, faction: "外族/外敌", status: "活耀", notableDeeds: "漠北一代雄主，率铁骑绕关包抄，意图活捉大明皇帝。" },
      { id: "npc_7", name: "王振", role: "司礼监掌印太监", avatarId: "ri-user-unfollow-line", loyalty: 60, affection: 90, faction: "保皇党", status: "活耀", notableDeeds: "挟天子巡游，葬送全军。此时已被军众逼上绝路。" }
    ],
    initialProvinces: [
      { id: "p_5", name: "土木堡突围点", population: 10, control: "外族/外敌", controlPercent: 90, taxRate: 0, defenseLevel: 5, unrest: 99 },
      { id: "p_6", name: "九边宣府口", population: 150, control: "保皇党", controlPercent: 75, taxRate: 40, defenseLevel: 80, unrest: 60 },
      { id: "p_7", name: "京师顺天", population: 200, control: "保皇党", controlPercent: 95, taxRate: 50, defenseLevel: 90, unrest: 30 }
    ],
    recommendedDecisions: [
      "借乱军手诛灭太监王振，安抚军心并收拢残部合围突围",
      "命令樊忠率精锐敢死骑，对瓦剌也先进行斩首行动",
      "退防宣府重镇，坚守待变，传檄两京守卫京师",
      "使用仙术/系统道具直接召唤天雷轰顶瓦剌狼旗"
    ]
  },
  [TimelineType.JINGKANG]: {
    timeline: TimelineType.JINGKANG,
    title: "【靖康之耻】",
    hostName: "赵桓 (宋钦宗)",
    era: "靖康元年闰十一月",
    desc: "大雪掩盖大宋东京。完颜宗望、宗翰金军架云梯百千封城。六甲妖兵郭京大开城门，繁华汴京泣血沦陷！",
    startingStory: "靖康元年闰十一月。覆雪满地。天降阴雹，风卷宋纛。城门外金国拐子马黑压压无边无沿。张邦昌等主和派官吏已在罗织贡女、岁贡单。钦宗赵桓坐困愁城，太上皇徽宗赵佶早已驾香车流亡江南。守城李纲正因御史台弹劾而闲置家中。宣化门已被打开！",
    initialNpcs: [
      { id: "npc_8", name: "李纲", role: "抗金保卫名臣", avatarId: "ri-user-star-line", loyalty: 95, affection: 85, faction: "保皇党", status: "活耀", notableDeeds: "守御东京有功，被割地投降派构陷降职。" },
      { id: "npc_9", name: "张邦昌", role: "太宰兼主和派首领", avatarId: "ri-user-shared-line", loyalty: 20, affection: 40, faction: "降党集团", status: "活耀", notableDeeds: "极力主张割让土地尊金国，暗中准备献上汴京。" },
      { id: "npc_10", name: "郭京", role: "『六甲神兵』术士", avatarId: "ri-magic-line", loyalty: 10, affection: 60, faction: "中立/自治", status: "活耀", notableDeeds: "召集流氓地痞自称六甲，声称法术能降金，在骗取百万赏钱中。" }
    ],
    initialProvinces: [
      { id: "p_8", name: "东京汴梁城", population: 150, control: "保皇党", controlPercent: 50, taxRate: 80, defenseLevel: 40, unrest: 85 },
      { id: "p_9", name: "两淮江南路", population: 2000, control: "保皇党", controlPercent: 95, taxRate: 35, defenseLevel: 70, unrest: 40 },
      { id: "p_10", name: "太原真定府", population: 250, control: "外族/外敌", controlPercent: 90, taxRate: 90, defenseLevel: 20, unrest: 95 }
    ],
    recommendedDecisions: [
      "立刻恢复抗金名臣李纲的防守大权，严惩主和派张邦昌",
      "揭破术士郭京欺世之谎言，处决骗子，急调岳飞等岳家骑勤王",
      "散尽内帑百万金，犒赏死守死士，死守汴河铁索",
      "使用搭载系统科技，强行兑换红夷大炮图纸阻隔大渡河"
    ]
  },
  [TimelineType.ANSHI]: {
    timeline: TimelineType.ANSHI,
    title: "【安史之乱】",
    hostName: "李隆基 (唐玄宗)",
    era: "天宝十五载六月十四",
    desc: "叛军卷中原，潼关崩坏。马嵬骤雨，护驾将士挥戈哗变。长剑血腥，逼立天子将红颜贵妃赐吊！",
    startingStory: "天宝十五载六月十四。骤雨如瀑。随驾将士行至马嵬驿，饥疲交迫，怨气塞天。龙武大将军陈玄礼带头策马横戈。宰相杨国忠已被哗变乱刀剁碎血洗。几千铠甲龙武骑怒拔钢刀，声称贵妃不除，三军一步不移！",
    initialNpcs: [
      { id: "npc_11", name: "杨玉环", role: "贵妃", avatarId: "ri-user-heart-line", loyalty: 100, affection: 99, faction: "保皇党", status: "活耀", notableDeeds: "红颜命薄，大唐极盛的活见证，随皇帝共至倾国之变。" },
      { id: "npc_12", name: "陈玄礼", role: "龙武大将军", avatarId: "ri-sword-line", loyalty: 75, affection: 60, faction: "保皇党", status: "活耀", notableDeeds: "掌御禁军龙武卫，为安抚群兵不惜逼驾杀妃。" },
      { id: "npc_13", name: "郭子仪", role: "朔方节度使", avatarId: "ri-shield-fill", loyalty: 90, affection: 75, faction: "保皇党", status: "活耀", notableDeeds: "手握精锐朔方军，正在河北与安禄山鏖兵抗击。" }
    ],
    initialProvinces: [
      { id: "p_11", name: "马嵬驿荒郊", population: 2, control: "中立/自治", controlPercent: 80, taxRate: 0, defenseLevel: 15, unrest: 85 },
      { id: "p_12", name: "长安及关中", population: 300, control: "起义军", controlPercent: 70, taxRate: 60, defenseLevel: 30, unrest: 90 },
      { id: "p_13", name: "西北朔方镇", population: 220, control: "保皇党", controlPercent: 99, taxRate: 30, defenseLevel: 90, unrest: 15 }
    ],
    recommendedDecisions: [
      "动用至高皇威夺下兵权，严辞斥责陈玄礼，利用遁地/催眠避开锋刃",
      "赏赐贵妃假死，秘密由保皇特卫护送前往蜀中安养",
      "传檄授命太子李亨与将军郭子仪，集结塞北兵马进行反政大攻防",
      "吞服神话大还丹，恢复巅峰宿主战力，御驾亲征迎击安史叛军"
    ]
  },
  [TimelineType.WUHU]: {
    timeline: TimelineType.WUHU,
    title: "【五胡乱华】",
    hostName: "司马衷 (晋惠宗)",
    era: "永熙元年四月二十",
    desc: "八王内乱、生民沦碳。五部胡蛮乘势牧马黄河。洛阳城内诸王夺嫡，你虽‘痴呆’，但能看到大祸降临！",
    startingStory: "永熙元年四月。西晋帝都洛阳。八王之相残已致千里百骨。东海王司马越把持乾坤，权倾朝野。匈奴刘渊等五部豪强已招兵买马自命单于。内廷里权皇后羊献容备受蹂躏，数起数落。你此时坐于御案，众人皆以为你是愚痴天子。危机四起，如何挽扶西晋大厦？",
    initialNpcs: [
      { id: "npc_14", name: "羊献容", role: "大晋皇后", avatarId: "ri-user-star-fill", loyalty: 85, affection: 80, faction: "保皇党", status: "活耀", notableDeeds: "一生惨淡，五失五立，饱受战火蹂躏却依然忠于丈夫。" },
      { id: "npc_15", name: "司马越", role: "东海王·西晋权臣", avatarId: "ri-user-shared-fill", loyalty: 30, affection: 25, faction: "降党集团", status: "活耀", notableDeeds: "司马氏残星之一，贪婪暴烈，裹挟朝廷，视皇帝如傀儡。" },
      { id: "npc_16", name: "祖逖", role: "中流击楫名将", avatarId: "ri-flight-takeoff-line", loyalty: 95, affection: 80, faction: "保皇党", status: "活耀", notableDeeds: "胸怀天下一统，闻鸡起舞，常年图谋北伐复我中原。" }
    ],
    initialProvinces: [
      { id: "p_14", name: "帝都洛阳城", population: 80, control: "保皇党", controlPercent: 45, taxRate: 90, defenseLevel: 40, unrest: 95 },
      { id: "p_15", name: "关中长安领", population: 130, control: "保皇党", controlPercent: 55, taxRate: 85, defenseLevel: 50, unrest: 90 },
      { id: "p_16", name: "并州匈奴野", population: 280, control: "外族/外敌", controlPercent: 95, taxRate: 10, defenseLevel: 30, unrest: 95 }
    ],
    recommendedDecisions: [
      "借『藏愚守拙』瞒过东海王司马越，私下授予祖逖密旨节度关陇大兵",
      "动用宿主降生附带的天生『洞察术』，清洗城内怀有二心的叛逆诸王",
      "降低赋税重赋，开仓济民安抚洛阳饥民，恢复军民凝聚力",
      "率精锐护卫自洛阳避敌，在江南招贤纳士建立偏安防卫圈"
    ]
  },
  [TimelineType.CUSTOM]: {
    timeline: TimelineType.CUSTOM,
    title: "【自定义时空】",
    hostName: "关羽 (假定例子)",
    era: "建安二十四年麦城",
    desc: "自由定制属于您的时空锚定节点、宿主身份与开场故事线！",
    startingStory: "时空中泛起青色涟漪。您的意识在强大的量子引擎调度下完成了重新装载。宿主感知觉醒！在这个属于您亲自定义的岁月中，天地万象的因果正随着您的决策与动作重新分形延展...",
    initialNpcs: [
      { id: "npc_17", name: "神秘客", role: "时空节点导引助理", avatarId: "ri-shield-star-line", loyalty: 100, affection: 90, faction: "保皇党", status: "活耀", notableDeeds: "天演模拟终端中自动生成的智能体，用以解答关于模拟的法则。" }
    ],
    initialProvinces: [
      { id: "p_17", name: "自定中央郡", population: 100, control: "保皇党", controlPercent: 80, taxRate: 30, defenseLevel: 50, unrest: 10 },
      { id: "p_18", name: "自定荆蛮野", population: 150, control: "外族/外敌", controlPercent: 20, taxRate: 50, defenseLevel: 30, unrest: 50 }
    ],
    recommendedDecisions: [
      "搜寻附近资源开展微观经营",
      "发掘当地名将贤士，进行人际会盟",
      "直接利用科技模板展开工业化演化"
    ]
  }
};

export const INITIAL_ITEMS: InventoryItem[] = [
  { id: "item_rice", name: "杂交水稻种子1吨", quantity: 1, rarity: "史诗", description: "拥有极限抗倒伏与抗虫害基因的世界顶尖种子。播种三年内可让十万人脱免饥荒之灾！", equipped: false, canUse: true, effect: "增加统治区域控制力+20%，民怨(未熟期)-25%", goldValue: 5000 },
  { id: "item_vest", name: "凯夫拉防弹衣", quantity: 1, rarity: "稀有", description: "采用24层超高分子芳纶纤维压制。能安然承受冷兵器斩击、强弓齐射，对轻火绳枪有绝对抗性。", equipped: true, canUse: false, effect: "宿主最大生命值(HP)上限提升 +60点", goldValue: 1200 },
  { id: "item_sword", name: "星宿新手剑", quantity: 1, rarity: "普通", description: "采用现代锰钢整体淬火打造，比普通唐刀明剑坚固十倍。刃口锋锐无双。", equipped: true, canUse: false, effect: "武力值 / 力量提升 +15点", goldValue: 150 },
  { id: "item_bowl", name: "老朱的破碗", quantity: 1, rarity: "神话", description: "带有绝地逢生、朱明祖龙一脉的混沌气运。执此碗行乞，路人必定施舍，绝无饥毙之日。", equipped: false, canUse: true, effect: "宿主气运/因果提升 +50点，化缘可抵扣1日粮草损耗", goldValue: 88888 }
];

export const ALL_ITEMS_STORE: Omit<InventoryItem, "quantity" | "equipped">[] = [
  { id: "item_gatling", name: "加特林重机枪", rarity: "传说", description: "配带5000发7.62毫米高热子弹，一旦扫射开火，在战场上宛如无上雷部正神降世！", canUse: true, effect: "守城或两军决战中，敌军战力和战意瞬间缩减90%", goldValue: 20000 },
  { id: "item_deserteagle", name: "沙漠之鹰手枪", rarity: "史诗", description: "配备高感能爆弹50发。在宿主袖中藏匿，可用于任何刺杀、护驾中，百步击杀强敌。", canUse: true, effect: "立刻击杀指定敌对NPC，不需要任何武力战力判断", goldValue: 6000 },
  { id: "item_panacea", name: "混元金九还丹", rarity: "传说", description: "金丹入口，宿主神光灌体，起死人肉白骨。可重构五脏六腑。", canUse: true, effect: "完全回复生命值，并让宿主气运上升15点", goldValue: 8000 },
  { id: "item_rice_seed", name: "高产超级水稻种", rarity: "史诗", description: "再获粮食，解决帝国各地叛乱生计。", canUse: true, effect: "立即降低全省民怨 30 点", goldValue: 4000 },
  { id: "item_potato", name: "超级红薯原原种", rarity: "传说", description: "耐旱抗涝抗贫瘠、可广泛在沙地荒野耕植。产量极大。", canUse: true, effect: "人口规模按每月15%自动增速，免役天下三秋赋税", goldValue: 12000 },
  { id: "item_scifi_drone", name: "量子多频谱侦察仪", rarity: "神话", description: "自带超视距红外光谱扫描和微弱卫星信号链接。能实时查看整个帝国战场的敌军动向。", canUse: true, effect: "彻底获知迷雾地图中所有军阀首脑动态及伏击路线", goldValue: 35000 },
  { id: "item_apron", name: "安妙依的肚兜", rarity: "神话", description: "带有淡淡月轮清香，佩戴能让持有者神志清亮，百毒不侵，百鬼不扰，极其邪门，具有奇特延寿效果。", canUse: true, effect: "宿主寿命上限延长 +20年，负面词条触发率削减99%", goldValue: 99999 }
];

export const SYSTEM_CARDS_POOL: SystemCard[] = [
  { id: "card_1", name: "杀神·白起", rarity: "神话", type: "英灵", description: "战国杀神，坑杀赵卒四十万，英灵临世散播极强修罗军魂气场。", effect: "军力战斗指数增加300%，对敌军自动施加恐慌削弱", claimed: false },
  { id: "card_2", name: "武侯·诸葛亮", rarity: "传说", type: "英灵", description: "鞠躬尽瘁，死而后已。运筹帷幄之中，决胜千里之外。通晓八阵图与超级粮草流转机制。", effect: "本省税金产值翻倍，治下各省民怨自然削减-10/月", claimed: false },
  { id: "card_3", name: "冠军侯·霍去病", rarity: "神话", type: "英灵", description: "匈奴未灭，无以家为。闪电奔袭突击之祖，大漠孤军狂飙猛插。", effect: "对『外族/外敌』的战斗胜绩率绝对锁定+50%，破城速度翻倍", claimed: false },
  { id: "card_4", name: "天雷正法卷", rarity: "史诗", type: "神术", description: "引无源天罡正雷，轰炸二十平方里，对异端及入侵甲兵有天诛功效。", effect: "战斗中对敌军精锐部曲造成60%巨量破甲毁灭", claimed: false },
  { id: "card_5", name: "国运福瑞光耀", rarity: "稀有", type: "气运", description: "祥瑞漫天降。各地麦穗一茎双实，祥瑞麒麟见于太庙。", effect: "大晋/大唐/大宋/大明 国运上升30点，流民大量遣归", claimed: false },
  { id: "card_6", name: "五毒赤砂蛊", rarity: "普通", type: "宝物", description: "古苗五毒炼造的无形蛊气。可无声无息融入茶汤中。", effect: "在刺杀敌对太傅首脑、总兵或乱贼头目时成功率提升50%", claimed: false }
];
