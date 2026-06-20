import _ from 'lodash';

export const Schema = z.object({
  世界: z.object({
    当前时间: z.string(),
    当前时空: z.string(),
    年号: z.string(),
    国祚: z.coerce.number().min(0).max(100),
    民心: z.coerce.number().min(0).max(100),
    国库: z.coerce.number().min(0),
    军事: z.coerce.number().min(0).max(100),
    腐败: z.coerce.number().min(0).max(100),
  }),

  主角: z.object({
    名称: z.string(),
    身份: z.string(),
    性别: z.string(),
    年龄: z.coerce.number(),
    称号: z.string(),
    等级: z.string(),
    体力: z.object({
      当前: z.coerce.number(),
      最大: z.coerce.number(),
    }),
    饱食度: z.object({
      当前: z.coerce.number(),
      最大: z.coerce.number(),
    }),
    能量: z.object({
      当前: z.coerce.number(),
      最大: z.coerce.number(),
    }),
    属性: z.object({
      生命: z.coerce.number(),
      最大生命: z.coerce.number(),
      寿元: z.coerce.number(),
      力量: z.coerce.number(),
      智力: z.coerce.number(),
      魅力: z.coerce.number(),
      运气: z.coerce.number(),
      敏捷: z.coerce.number(),
      耐力: z.coerce.number(),
      帝王威仪: z.coerce.number(),
      因果值: z.coerce.number(),
      善恶度: z.coerce.number().min(-100).max(100),
      明昏度: z.coerce.number().min(-100).max(100),
      经验值: z.coerce.number(),
    }),
    天赋: z.string(),
    系统模板: z.string(),
    初始物品: z.array(z.string()),
    金币: z.coerce.number(),
    系统点数: z.coerce.number(),
  }),

  背包: z.record(
    z.string().describe('物品名'),
    z.object({
      数量: z.coerce.number(),
      稀有度: z.enum(['普通', '稀有', '史诗', '传说', '神话']),
      描述: z.string(),
      已装备: z.boolean().default(false),
      可使用: z.boolean().default(false),
      效果: z.string().optional(),
      金币价值: z.coerce.number(),
    }),
  ).transform(data => _.pickBy(data, ({ 数量 }) => 数量 > 0)),

  朝臣: z.record(
    z.string().describe('角色ID'),
    z.object({
      id: z.string(),
      姓名: z.string(),
      身份: z.string(),
      头像: z.string().optional(),
      年龄: z.coerce.number().optional(),
      生命: z.coerce.number().optional(),
      最大生命: z.coerce.number().optional(),
      攻击: z.coerce.number().optional(),
      防御: z.coerce.number().optional(),
      忠诚度: z.coerce.number().min(0).max(100),
      好感: z.coerce.number().min(0).max(100),
      派系: z.string(),
      状态: z.enum(['活跃', '已流放', '已处决', '隐退', '战死']),
      主要事迹: z.string(),
      内心想法: z.string().optional(),
      玩家记忆: z.string().optional(),
    }),
  ),

  省份: z.record(
    z.string().describe('省份ID'),
    z.object({
      id: z.string(),
      名称: z.string(),
      人口: z.coerce.number(),
      控制: z.enum(['保皇党', '起义军', '外族/外敌', '中立/自治']),
      控制度: z.coerce.number().min(0).max(100),
      税率: z.coerce.number().min(0).max(100),
      防御等级: z.coerce.number().min(0).max(100),
      民怨: z.coerce.number().min(0).max(100),
    }),
  ),

  任务: z.record(
    z.string().describe('任务ID'),
    z.object({
      id: z.string(),
      标题: z.string(),
      描述: z.string(),
      类型: z.enum(['主线羁绊', '模拟经营', '沙盒生存', '系统特派']),
      目标: z.string(),
      进度: z.coerce.number(),
      目标值: z.coerce.number(),
      奖励描述: z.string(),
      已完成: z.boolean().default(false),
      已领取: z.boolean().default(false),
      惩罚描述: z.string().optional(),
    }),
  ),

  编年史: z.array(z.object({
    id: z.string(),
    年份: z.string(),
    章节: z.string(),
    事件文本: z.string(),
    玩家决策: z.string(),
    影响描述: z.string(),
    时间戳: z.string(),
  })),

  世界事件: z.record(
    z.string().describe('事件ID'),
    z.object({
      id: z.string(),
      标题: z.string(),
      严重程度: z.enum(['常态', '严峻', '毁灭性', '祥瑞']),
      地点: z.string(),
      描述: z.string(),
      持续回合: z.coerce.number(),
    }),
  ),

  系统: z.object({
    已选择: z.boolean().default(false),
    卡池: z.array(z.object({
      id: z.string(),
      名称: z.string(),
      稀有度: z.enum(['普通', '稀有', '史诗', '传说', '神话']),
      类型: z.enum(['英灵', '宝物', '神术', '气运']),
      描述: z.string(),
      效果: z.string(),
      已领取: z.boolean().default(false),
    })).default([]),
    签到天数: z.coerce.number().default(0),
    最后签到日期: z.string().optional(),
    历史记录: z.array(z.string()).default([]),
  }),

  游戏进度: z.object({
    已开始: z.boolean().default(false),
    纪年: z.string(),
    天数: z.coerce.number().default(0),
    剧情日志: z.array(z.string()).default([]),
  }),
});

export type Schema = z.output<typeof Schema>;
