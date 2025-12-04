import type { EvaluationReport } from '@/types/evaluation';

export const mockEvaluationData: EvaluationReport = {
  teacherInfo: {
    name: '蒋若蓝',
    subject: '统编版三上《父亲、树林和鸟》第一课时',
    class: '三年级',
    date: '2025年11月21日',
    observationTime: '00:00:11-00:36:49',
    totalDuration: 36,
  },
  dimensions: [
    {
      name: '教学目标与设计',
      weight: 25,
      score: 24,
      maxScore: 25,
    },
    {
      name: '教学互动与过程',
      weight: 30,
      score: 28,
      maxScore: 30,
    },
    {
      name: '阅读素养培育',
      weight: 25,
      score: 23,
      maxScore: 25,
    },
    {
      name: '教师专业素养',
      weight: 20,
      score: 19,
      maxScore: 20,
    },
  ],
  timeSegments: [
    {
      activity: '导入与初读',
      duration: 5,
      percentage: 13.9,
    },
    {
      activity: '整体感知',
      duration: 3,
      percentage: 8.3,
    },
    {
      activity: '品读树林',
      duration: 8,
      percentage: 22.2,
    },
    {
      activity: '品读父亲',
      duration: 8,
      percentage: 22.2,
    },
    {
      activity: '积累运用',
      duration: 8,
      percentage: 22.2,
    },
    {
      activity: '写字指导',
      duration: 3,
      percentage: 8.3,
    },
    {
      activity: '总结留疑',
      duration: 1,
      percentage: 2.8,
    },
  ],
  bloomQuestions: [
    {
      level: '记忆',
      count: 5,
      percentage: 20.0,
    },
    {
      level: '理解',
      count: 9,
      percentage: 36.0,
    },
    {
      level: '应用',
      count: 7,
      percentage: 28.0,
    },
    {
      level: '分析',
      count: 3,
      percentage: 12.0,
    },
    {
      level: '评价',
      count: 1,
      percentage: 4.0,
    },
    {
      level: '创造',
      count: 0,
      percentage: 0,
    },
  ],
  knowledgePoints: [
    {
      category: '语言知识与技能',
      items: [
        '字词：认识"黎、蒙"等生字；理解并积累"黎明、幽深、雾蒙蒙、凝神静气"等词语',
        '写字：会写"蒙"字，掌握"平行等距"的书写要领',
        '朗读：通过范读、合作读、分角色读等多种形式训练朗读',
      ],
    },
    {
      category: '阅读策略与方法',
      items: [
        '信息获取与整合：通过"默读圈画"提取描写树林、父亲的句子；通过词语分类梳理文章脉络',
        '文本理解与赏析：通过想象画面、去词比较等方法，体会修饰词的作用，感受语言的形象与生动',
        '元认知策略：学习并运用"交流平台"提供的摘抄方法，形成积累语言的良好习惯',
      ],
    },
    {
      category: '人文内涵与思维发展',
      items: [
        '文本内涵：体会父亲对树林和鸟的熟悉与热爱，初步感悟人与自然和谐相处的主题',
        '思维发展：在仿说中训练应用能力，在分析修饰词作用时训练分析能力，在结尾悬念中激发评价性思维的萌芽',
      ],
    },
  ],
  advantages: [
    {
      title: '目标聚焦，设计精良',
      description: '本节课完美实现了"感受生动语言、积累词句"的单元要素，目标明确，层次清晰。',
    },
    {
      title: '互动高效，学生主体',
      description: '课堂氛围民主和谐，学生参与度高，在多种形式的语文实践活动中提升了素养。',
    },
    {
      title: '专业扎实，指导到位',
      description: '教师语文素养高，对重难点把握精准，特别是在修饰词的教学和书写指导上，效果显著。',
    },
    {
      title: '时间分配合理',
      description: '将超过65%的核心时间放在了品读语言和积累运用上，精准服务于本课教学重难点。',
    },
  ],
  suggestions: [
    {
      title: '深化高阶思维训练',
      description: '在保证主要目标达成的前提下，可尝试预留更充分的时间，对"父亲是不是猎人"这类评价性问题组织简短的小组讨论或自由发言，让批判性思维的培养"落地生根"。',
    },
    {
      title: '优化环节时间微调',
      description: '可考虑将课程结尾的总结与留疑环节延长1-2分钟，使课堂收束更显从容，学法总结和悬念设置的效果会更佳。',
    },
    {
      title: '增加开放性问题',
      description: '未来可设计更多开放性问题，并给予更充分的讨论时间，进一步激发学生的创造性思维。',
    },
    {
      title: '强化评价性思维',
      description: '评价与创造性问题的比例相对较低，建议在今后的教学中适当增加这类问题的设计。',
    },
  ],
  comparison: [
    {
      aspect: '教学目标',
      design: '感受生动语言，积累优美词句',
      actual: '目标达成度高，学生能够体会修饰词的作用并进行仿说',
      consistency: '高度一致',
    },
    {
      aspect: '教学方法',
      design: '默读圈画、去词比较、想象画面、仿说练习',
      actual: '实际运用了多种方法，特别是去词比较法效果显著',
      consistency: '完全一致',
    },
    {
      aspect: '时间安排',
      design: '导入5分钟、品读18分钟、积累8分钟、写字3分钟、总结2分钟',
      actual: '导入5分钟、品读16分钟、积累8分钟、写字3分钟、总结1分钟',
      consistency: '基本一致',
    },
    {
      aspect: '互动设计',
      design: '设计多层次问题，注重学生参与',
      actual: '问题设计有梯度，应用/分析性问题质量高',
      consistency: '高度一致',
    },
  ],
  overallComment:
    '蒋老师的这节课整体表现优秀，是一节目标明确、过程精彩、效果显著的优秀课例，充分体现了教师深厚的教学功力与新课程理念的深度融合。本节课完美实现了"感受生动语言、积累词句"的单元要素，目标明确，层次清晰。课堂氛围民主和谐，学生参与度高，在多种形式的语文实践活动中提升了素养。教师语文素养高，对重难点把握精准，特别是在修饰词的教学和书写指导上，效果显著。建议在今后的教学中，可尝试预留更充分的时间，对评价性问题组织简短的小组讨论，让批判性思维的培养"落地生根"；同时可考虑将课程结尾的总结与留疑环节延长1-2分钟，使课堂收束更显从容。',
  timelineAnalysis:
    '时间分配整体合理，重点突出。将超过65%的核心时间放在了品读语言（品读树林8分钟、品读父亲8分钟）和积累运用（8分钟）上，精准服务于本课教学重难点。各环节衔接流畅，节奏张弛有度。导入与初读环节（5分钟，13.9%）简洁高效，整体感知环节（3分钟，8.3%）快速梳理文章脉络。写字指导环节（3分钟，8.3%）安排合理，体现了语文教学的综合性。但课程结尾（总结与留疑）仅用1分钟（2.8%），略显匆忙。可考虑从品读环节略微压缩1-2分钟，让课堂收尾更从容，悬念设置更能激发学生思考。',
  questionAnalysis: {
    strengths: [
      '问题设计有清晰的梯度，从理解到分析，层层递进，有效支撑了学生的思维发展',
      '应用/分析性问题质量高，是本节课的亮点，占比达到40%',
      '问题表述清晰，学生理解准确，回答积极',
      '能够通过去词比较等方法，引导学生深入体会修饰词的作用',
    ],
    improvements: [
      '评价与创造性问题的比例相对较低，仅占4%，建议提升至10-15%',
      '最后一个评价性问题"父亲是不是猎人"未能充分展开讨论',
      '可以设计更多开放性问题，鼓励学生发表个性化见解',
      '建议给予评价性问题更充分的讨论时间，让批判性思维培养落地',
    ],
  },
  interactionAnalysis: {
    summary: '本报告基于弗兰德斯互动分析系统（FIAS）及课堂观察数据，对蒋若蓝老师执教的《父亲、树林和鸟》一课进行量化与质性相结合的分析。分析表明：本节课呈现出"教师主导讲授 + 高频问答 + 适度独立写作"的典型结构，师生互动质量较高，节奏张弛有度。课堂互动性优于传统语文课堂，学生获得了稳定的表达机会。主要改进空间在于进一步提升学生主动提问与合作探究的比例，以迈向更深度的学习。',
    fiasOverview: {
      teacherLanguage: 57,
      studentLanguage: 30,
      silentTime: 13,
      tsrRatio: 1.33,
      studentInitiativeRate: 4,
    },
    classroomPhases: [
      {
        timeRange: '0–15分钟',
        phase: '启学与探学初期：稳定输入期',
        characteristics: [
          '教师讲述（40-50%）与师生问答（40-50%）交织，形成"问—答—齐读"的稳定节奏',
          '此阶段侧重于情境导入、字词教学与整体感知',
          '教师通过清晰的指令和示范为学生搭建学习支架',
        ],
        studentBehavior: [
          '注意力维持在0.80–0.92的高位',
          '参与度稳步上升',
          '显示出良好的课堂预热效果',
        ],
        metrics: {
          teacherTalk: 45,
          studentResponse: 45,
          attention: 0.86,
          participation: 0.75,
          handRaising: 0.70,
        },
      },
      {
        timeRange: '15–20分钟',
        phase: '书写任务期：静默沉淀期（第一阶段）',
        characteristics: [
          '因"写字练习"任务',
          '安静/写作时间占据主导',
          '这是外显互动减少，但内化学习发生的阶段',
        ],
        studentBehavior: [
          '举手行为几乎降至为零',
          '参与度和注意力出现可预见的回落',
          '学生投入于独立的书写与积累，班级纪律稳定',
        ],
        metrics: {
          teacherTalk: 20,
          studentResponse: 10,
          attention: 0.75,
          participation: 0.50,
          handRaising: 0.10,
        },
      },
      {
        timeRange: '20–30分钟',
        phase: '探学中期：互动黄金期',
        characteristics: [
          '教师讲述比例下降，学生回答比例显著上升',
          '角色朗读、对话表演、"父亲是不是猎人"的判断等活动',
          '将课堂互动推向高潮',
        ],
        studentBehavior: [
          '举手率（0.90–1.00）与参与度（0.95–1.00）达到峰值',
          '注意力保持高位（0.88–0.92）',
          '情境化、表现性的任务有效激发了学生的表达欲和投入感',
        ],
        metrics: {
          teacherTalk: 35,
          studentResponse: 55,
          attention: 0.90,
          participation: 0.98,
          handRaising: 0.95,
        },
      },
      {
        timeRange: '35–40分钟',
        phase: '书写任务期：静默沉淀期（第二阶段）',
        characteristics: [
          '因"自然笔记摘抄"任务',
          '安静/写作时间占据主导',
          '这是外显互动减少，但内化学习发生的阶段',
        ],
        studentBehavior: [
          '举手行为几乎降至为零',
          '参与度和注意力出现可预见的回落',
          '学生投入于独立的书写与积累，班级纪律稳定',
        ],
        metrics: {
          teacherTalk: 15,
          studentResponse: 5,
          attention: 0.72,
          participation: 0.45,
          handRaising: 0.05,
        },
      },
    ],
    teacherInteraction: {
      advantages: [
        'TSR值为1.33，远优于传统"满堂灌"课堂（TSR常高于3），进入"中高互动区间"',
        '教师具备强烈的互动意识，通过高频、高质量的提问，有效地牵引着学生的思维',
        '保证了课堂的推进效率和基本参与面',
      ],
      improvements: [
        '互动模式略显单一，对教师的提问依赖度高',
        '可视为"牵引式互动"，学生主要在教师设定的框架内回应',
      ],
    },
    studentParticipation: {
      advantages: [
        '学生语言占比达30%，表明大部分学生有频繁的口头表达机会',
        '在互动黄金期，学生能积极、投入地参与文本品读和角色扮演',
      ],
      limitations: [
        '学生主动发言（自发提问、补充或挑战）比例较低（4%）',
        '课堂缺乏生生之间的直接对话（如小组讨论、同伴互评）',
        '未能充分激活学生作为学习共同体成员的互动潜能',
      ],
    },
    studentBehaviorAnalysis: {
      handRaising: {
        peaks: [
          { time: '5–10分钟', description: '字词教学、小组跟读：教师连续提问词语含义，互动密集' },
          { time: '20–30分钟', description: '父亲人物形象 & 修饰词分析：学生表达欲望被激发' },
          { time: '30–35分钟', description: '朗读+角色扮演：情境任务带来参与高潮' },
        ],
        valleys: [
          { time: '15–20分钟', description: '写字练习（"蒙"字）→ 动作任务，举手自然减少' },
          { time: '35–40分钟', description: '自然笔记摘抄 → 静态写作任务占比高，举手大幅降低' },
        ],
        conclusion: '课堂互动整体呈"前期热、中期稳、后期降"的规律。样本点 6–12（约课堂 12–24 分钟）出现最高举手峰值（接近 1.0），这是课堂互动的黄金时段：词语品味、句子理解、朗读互动频繁。样本点 0–2 与 15–19 举手较少，对应课堂开场与收尾阶段。',
        teachingImplication: [
          '教师在课堂中段的互动策略（提问、朗读示范、文本品读）明显促进学生举手参与',
          '后段活动若想提升举手率，可增加开放式提问',
          '使用"随机点名卡"等策略',
          '小组内先讨论再举手表达',
        ],
      },
      attention: {
        highPeriods: [
          { time: '20–30分钟', description: '朗读、对话表演、理解修饰词等活动吸引注意，专注度达到峰值（0.92）' },
        ],
        lowPeriods: [
          { time: '15–20分钟', description: '写字：动作单调，注意力略下降' },
          { time: '35–40分钟', description: '自然笔记：持续独立写作 → 专注度低至 0.75' },
        ],
        conclusion: '专注度整体较高（0.80–0.92）。学生在"阅读—分析—讨论"类任务中专注度最佳，在长时间写作中下降明显。注意力总体保持在稳定中高区间，中段（样本点 6–12，对应课堂 12–24 分钟）略有下降 → 与教师组织朗读和书写环节相关。',
        teachingImplication: [
          '整体注意力稳定，课堂管理良好',
          '书写任务时注意力下降正常，但后段能够回升，说明课堂节奏设计合理',
          '若要进一步提升专注度，可在书写后插入简短互动缓冲',
        ],
      },
      participation: {
        highPeriods: [
          { time: '20–30分钟', description: '参与度（0.80–0.85），最高峰出现在 25–30 分钟（0.85）' },
          { time: '25–30分钟', description: '伴随"父子对话角色扮演 + 想象画面朗读"，学生参与感显著提升' },
        ],
        lowPeriods: [
          { time: '15–20分钟', description: '书写任务导致参与形式变单一（0.60）' },
          { time: '35–40分钟', description: '自然笔记写作，学生投入在写作，而非口头参与（0.50）' },
        ],
        conclusion: '学生"参与度"与课堂任务类型直接相关：表达性任务越强，参与度越高。参与度在样本点 6–12 达到最高值（0.95–1.0），与举手行为同步高涨。样本点 12 之后出现短暂下降，但随后又在点 14–16 有较高提升。',
        teachingImplication: [
          '表达性任务（朗读、角色扮演、讨论）能显著提升学生参与度',
          '书写任务虽然参与度下降，但这是正常的学习形式转换',
          '可在长时间独立任务中插入短暂的分享环节，维持参与感',
        ],
      },
      detailedMetrics: [
        { time: '0-2分钟', handRaising: 0.30, attention: 0.85, participation: 0.60 },
        { time: '2-4分钟', handRaising: 0.35, attention: 0.88, participation: 0.62 },
        { time: '4-6分钟', handRaising: 0.40, attention: 0.90, participation: 0.65 },
        { time: '6-8分钟', handRaising: 0.80, attention: 0.92, participation: 0.85 },
        { time: '8-10分钟', handRaising: 0.85, attention: 0.90, participation: 0.88 },
        { time: '10-12分钟', handRaising: 0.90, attention: 0.88, participation: 0.90 },
        { time: '12-14分钟', handRaising: 0.95, attention: 0.86, participation: 0.93 },
        { time: '14-16分钟', handRaising: 0.60, attention: 0.84, participation: 0.78 },
        { time: '16-18分钟', handRaising: 0.40, attention: 0.82, participation: 0.70 },
        { time: '18-20分钟', handRaising: 0.35, attention: 0.80, participation: 0.68 },
        { time: '20-22分钟', handRaising: 0.75, attention: 0.82, participation: 0.80 },
        { time: '22-24分钟', handRaising: 0.88, attention: 0.85, participation: 0.82 },
        { time: '24-26分钟', handRaising: 0.92, attention: 0.90, participation: 0.95 },
        { time: '26-28分钟', handRaising: 0.85, attention: 0.88, participation: 0.90 },
        { time: '28-30分钟', handRaising: 0.80, attention: 0.86, participation: 0.88 },
        { time: '30-32分钟', handRaising: 0.55, attention: 0.84, participation: 0.75 },
        { time: '32-34分钟', handRaising: 0.40, attention: 0.82, participation: 0.70 },
        { time: '34-36分钟', handRaising: 0.20, attention: 0.80, participation: 0.60 },
        { time: '36-38分钟', handRaising: 0.15, attention: 0.78, participation: 0.55 },
        { time: '38-40分钟', handRaising: 0.10, attention: 0.76, participation: 0.50 },
      ],
    },
    recommendations: [
      {
        title: '推动互动模式从"牵引式"向"释放式"升级',
        strategy: '在黄金互动期（如探讨"父亲是不是猎人"时），引入一分钟的"同伴对话"环节。先让学生与邻座简短交流观点，再请代表发言。此举能将单一的师生IRE循环，升级为"教师提问—生生讨论—师生分享"的IRF模式，显著提升学生的思维深度和参与广度。',
      },
      {
        title: '优化静默时段，注入互动缓冲',
        strategy: '在长时间的书写任务（如自然笔记摘抄）中段，插入一个短暂的"分享与欣赏"环节。例如，让学生就近交换笔记，用一分钟时间找出同桌摘抄的一个好词并说说理由。这个小小的策略能有效打破沉寂，维持课堂能量，并使积累过程更具社交性和反思性。',
      },
      {
        title: '设计"元认知"提问，激发学生主动质疑',
        strategy: '在课堂中后段，有意识地提出诸如"学到这儿，你对于父亲、树林和鸟的关系，产生了什么新问题？"或"哪个词语的用法最让你感到意外？为什么？"此类问题无标准答案，旨在鼓励学生梳理、反思并表达自己的学习过程，从而将那4%的"学生主动发言"比例提升到一个新的水平。',
      },
    ],
  },
};
