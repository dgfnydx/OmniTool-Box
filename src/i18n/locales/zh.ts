export default {
  common: {
    search: '搜索工具...',
    home: '首页',
    categories: {
      developer: '开发者工具',
      daily: '日常工具',
      design: '设计工具'
    },
    actions: {
      format: '格式化',
      clear: '清空',
      copy: '复制',
      generate: '生成',
      copied: '已复制到剪贴板！',
      failed: '操作失败'
    },
    loading: '加载中...',
    notFound: '未找到该工具'
  },
  home: {
    heroTitle: 'OmniTool 全能工具箱',
    heroSubtitle: '为您提供开发者、日常生活及设计相关的一站式工具集。'
  },
  tools: {
    'json-formatter': {
      name: 'JSON 格式化',
      description: '美化并格式化您的 JSON 代码，使其清晰易读。',
      input: '输入 JSON',
      output: '格式化结果',
      inputPlaceholder: '请在此粘贴您的 JSON 代码...',
      outputPlaceholder: '格式化后的代码将在此显示...',
      invalidJson: '无效的 JSON'
    },
    'base64-converter': {
      name: 'Base64 转换器',
      description: '轻松进行 Base64 数据的编码与解码。',
      input: '源文本',
      output: '结果',
      encode: '编码',
      decode: '解码',
      inputPlaceholder: '输入普通文本或 Base64 字符串...',
      outputPlaceholder: '结果将在此显示...',
      encodeError: '编码错误',
      decodeError: '解码错误'
    },
    'timestamp-converter': {
      name: '时间戳转换',
      description: '在 Unix 时间戳与可读日期之间进行转换。',
      currentTs: '当前 Unix 时间戳',
      tsToDate: '时间戳转日期',
      dateToTs: '日期转时间戳',
      resultDate: '本地时间',
      resultTs: 'Unix 时间戳',
      invalidTs: '无效的时间戳',
      invalidDate: '无效的日期格式'
    },
    'password-generator': {
      name: '随机密码生成',
      description: '创建安全且随机的高强度密码。',
      length: '密码长度',
      uppercase: '包含大写字母',
      lowercase: '包含小写字母',
      numbers: '包含数字',
      symbols: '包含符号',
      weak: '弱',
      medium: '中等',
      strong: '强'
    },
    'unit-converter': {
      name: '单位换算',
      description: '在不同的物理单位之间进行快捷转换。',
      input: '输入数值',
      from: '从',
      to: '到',
      category: '分类',
      result: '换算结果',
      categories: {
        length: '长度',
        weight: '重量',
        temperature: '温度',
        volume: '体积',
        area: '面积',
        time: '时间',
        digital: '数字存储'
      },
      units: {
        meters: '米 (m)',
        kilometers: '千米 (km)',
        centimeters: '厘米 (cm)',
        millimeters: '毫米 (mm)',
        miles: '英里 (mi)',
        yards: '码 (yd)',
        feet: '英尺 (ft)',
        inches: '英寸 (in)',
        kilograms: '千克 (kg)',
        grams: '克 (g)',
        milligrams: '毫克 (mg)',
        pounds: '磅 (lb)',
        ounces: '盎司 (oz)',
        bytes: '字节 (B)',
        kilobytes: '千字节 (KB)',
        megabytes: '兆字节 (MB)',
        gigabytes: '吉字节 (GB)',
        terabytes: '太字节 (TB)',
        squareMeters: '平方米 (m²)',
        squareKilometers: '平方千米 (km²)',
        squareFeet: '平方英尺 (ft²)',
        acres: '英亩 (ac)',
        hectares: '公顷 (ha)',
        celsius: '摄氏度 (°C)',
        fahrenheit: '华氏度 (°F)',
        kelvin: '开尔文 (K)'
      }
    },
    'timer': {
      name: '计时器',
      description: '简单好用的倒计时工具。',
      hours: '小时',
      minutes: '分钟',
      seconds: '秒',
      start: '开始',
      pause: '暂停',
      resume: '继续',
      reset: '重置',
      stop: '停止',
      timesUp: "时间到！"
    },
    'word-counter': {
      name: '字数统计',
      description: '统计文本的单词数、字符数及句子数。',
      placeholder: '在此输入或粘贴您的文本...',
      words: '单词数',
      chars: '字符数',
      lines: '行数',
      sentences: '句子数',
      readingTime: '阅读时长',
      charsNoSpaces: '字符 (不含空格)',
      uppercase: '转大写',
      lowercase: '转小写',
      converted: '文本已转换！',
      definitions: {
        title: '统计规则说明',
        words: '单词数：连续的英文/数字序列计为一个词，每个汉字（及日韩文字）独立计为一个词。',
        chars: '字符数：包含空格、标点符号及换行符在内的字符总长度。',
        lines: '行数：基于文本中的换行符进行统计。',
        sentences: '句子数：以中英文终结标点（。 ！ ？ . ! ?）结尾的文本片段。',
        readingTime: '阅读时长：基于每分钟 200 个词的平均阅读速度估算。'
      }
    },
    'color-palette': {
      name: '调色盘',
      description: 'Hex/RGB/HSL 颜色值的转换与生成。',
      random: '随机颜色',
      analysis: '色彩分析',
      wcag: 'WCAG 对比度',
      whiteText: '白色文本效果',
      blackText: '黑色文本效果',
      fail: '不通过'
    },
    'markdown-previewer': {
      name: 'Markdown 预览',
      description: '实时的 Markdown 语法预览编辑。',
      editor: 'Markdown 编辑器',
      preview: '实时预览',
      placeholder: '在此输入 Markdown 内容...'
    }
  }
}
