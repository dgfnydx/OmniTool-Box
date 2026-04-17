export default {
  name: 'BMR 基础代谢率',
      description: '使用 Mifflin-St Jeor 公式计算您在静息状态下消耗的热量。',
      gender: '性别',
      male: '男',
      female: '女',
      age: '年龄',
      weight: '体重 (kg)',
      height: '身高 (cm)',
      result: '您的 BMR',
      calories: '千卡/天',
      activity: {
        sedentary: '久坐不动（几乎不运动）',
        light: '轻度活跃（每周运动 1-3 次）',
        moderate: '中度活跃（每周运动 3-5 次）',
        active: '高度活跃（每周运动 6-7 次）',
        extra: '极度活跃（高强度运动及体力劳动）'
      },
      tip: '基础代谢率 (BMR) 是指人体在清醒而又极端安静的状态下，不受肌肉活动、环境温度、食物及精神紧张等影响时的能量代谢率。'
};