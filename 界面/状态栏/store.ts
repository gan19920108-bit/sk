import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import { z } from 'zod';

// MVU 变量 Schema 定义
export const StatDataSchema = z.object({
  世界: z.object({
    当前时间: z.string(),
    当前时空: z.string(),
    年号: z.string(),
    国祚: z.number(),
    民心: z.number(),
    国库: z.number(),
    军事: z.number(),
    腐败: z.number(),
  }),

  主角: z.object({
    名称: z.string(),
    身份: z.string(),
    性别: z.string(),
    年龄: z.number(),
    称号: z.string(),
    等级: z.string(),
    体力: z.object({
      当前: z.number(),
      最大: z.number(),
    }),
    饱食度: z.object({
      当前: z.number(),
      最大: z.number(),
    }),
    能量: z.object({
      当前: z.number(),
      最大: z.number(),
    }),
    属性: z.object({
      生命: z.number(),
      最大生命: z.number(),
      寿元: z.number(),
      力量: z.number(),
      智力: z.number(),
      魅力: z.number(),
      运气: z.number(),
      敏捷: z.number(),
      耐力: z.number(),
      帝王威仪: z.number(),
      因果值: z.number(),
      善恶度: z.number(),
      明昏度: z.number(),
      经验值: z.number(),
    }),
    天赋: z.string(),
    系统模板: z.string(),
    初始物品: z.array(z.string()),
    金币: z.number(),
    系统点数: z.number(),
  }),

  背包: z.record(z.string(), z.object({
    数量: z.number(),
    稀有度: z.enum(['普通', '稀有', '史诗', '传说', '神话']),
    描述: z.string(),
    已装备: z.boolean().default(false),
    可使用: z.boolean().default(false),
    效果: z.string().optional(),
    金币价值: z.number(),
  })),

  朝臣: z.record(z.string(), z.object({
    id: z.string(),
    姓名: z.string(),
    身份: z.string(),
    头像: z.string().optional(),
    年龄: z.number().optional(),
    生命: z.number().optional(),
    最大生命: z.number().optional(),
    攻击: z.number().optional(),
    防御: z.number().optional(),
    忠诚度: z.number().min(0).max(100),
    好感: z.number().min(0).max(100),
    派系: z.string(),
    状态: z.enum(['活跃', '已流放', '已处决', '隐退', '战死']),
    主要事迹: z.string(),
    内心想法: z.string().optional(),
    玩家记忆: z.string().optional(),
  })),

  省份: z.record(z.string(), z.object({
    id: z.string(),
    名称: z.string(),
    人口: z.number(),
    控制: z.enum(['保皇党', '起义军', '外族/外敌', '中立/自治']),
    控制度: z.number().min(0).max(100),
    税率: z.number().min(0).max(100),
    防御等级: z.number().min(0).max(100),
    民怨: z.number().min(0).max(100),
  })),

  任务: z.record(z.string(), z.object({
    id: z.string(),
    标题: z.string(),
    描述: z.string(),
    类型: z.enum(['主线羁绊', '模拟经营', '沙盒生存', '系统特派']),
    目标: z.string(),
    进度: z.number(),
    目标值: z.number(),
    奖励描述: z.string(),
    已完成: z.boolean().default(false),
    已领取: z.boolean().default(false),
    惩罚描述: z.string().optional(),
  })),

  编年史: z.array(z.object({
    id: z.string(),
    年份: z.string(),
    章节: z.string(),
    事件文本: z.string(),
    玩家决策: z.string(),
    影响描述: z.string(),
    时间戳: z.string(),
  })),

  世界事件: z.record(z.string(), z.object({
    id: z.string(),
    标题: z.string(),
    严重程度: z.enum(['常态', '严峻', '毁灭性', '祥瑞']),
    地点: z.string(),
    描述: z.string(),
    持续回合: z.number(),
  })),

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
    签到天数: z.number().default(0),
    最后签到日期: z.string().optional(),
    历史记录: z.array(z.string()).default([]),
  }),

  游戏进度: z.object({
    已开始: z.boolean().default(false),
    纪年: z.string(),
    天数: z.number().default(0),
    剧情日志: z.array(z.string()).default([]),
  }),
});

export type StatData = z.infer<typeof StatDataSchema>;

const getDefaultData = (): StatData => ({
  世界: {
    当前时间: '',
    当前时空: '明末遗恨',
    年号: '',
    国祚: 100,
    民心: 50,
    国库: 1000,
    军事: 50,
    腐败: 10,
  },
  主角: {
    名称: '',
    身份: '',
    性别: '',
    年龄: 0,
    称号: '',
    等级: '',
    体力: { 当前: 100, 最大: 100 },
    饱食度: { 当前: 100, 最大: 100 },
    能量: { 当前: 100, 最大: 100 },
    属性: {
      生命: 100,
      最大生命: 100,
      寿元: 50,
      力量: 10,
      智力: 10,
      魅力: 10,
      运气: 10,
      敏捷: 10,
      耐力: 10,
      帝王威仪: 0,
      因果值: 0,
      善恶度: 0,
      明昏度: 0,
      经验值: 0,
    },
    天赋: '无天赋',
    系统模板: '无系统',
    初始物品: [],
    金币: 100,
    系统点数: 0,
  },
  背包: {},
  朝臣: {},
  省份: {},
  任务: {},
  编年史: [],
  世界事件: {},
  系统: {
    已选择: false,
    卡池: [],
    签到天数: 0,
    最后签到日期: '',
    历史记录: [],
  },
  游戏进度: {
    已开始: false,
    纪年: '明末遗恨',
    天数: 0,
    剧情日志: [],
  },
});

export const useDataStore = defineStore('data', () => {
  // 从酒馆变量获取初始数据
  const getInitialData = (): StatData => {
    try {
      const vars = getVariables({ type: 'message' });
      const statData = (vars as any)?.stat_data;
      if (statData) {
        return StatDataSchema.parse(statData);
      }
    } catch (e) {
      console.warn('[天演] 变量解析失败，使用默认值', e);
    }
    return getDefaultData();
  };

  const statData = ref<StatData>(getInitialData());

  // 监听数据变化并同步到酒馆变量
  watch(
    statData,
    (newData) => {
      try {
        replaceVariables(
          { stat_data: klona(newData) },
          { type: 'message', message_id: getCurrentMessageId() }
        );
      } catch (e) {
        console.error('[天演] 保存变量失败', e);
      }
    },
    { deep: true }
  );

  return { statData };
});
