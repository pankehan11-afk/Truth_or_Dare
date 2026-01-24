// 大冒险题库
// 所有任务都是线上/面对面可完成的
// 难度: 1-5星

export const dareQuestions = [
  // 表演类 - 轻松
  { id: 'd001', content: '用一种动物的叫声喊出自己的名字', category: 'perform', difficulty: 1, duration: 30 },
  { id: 'd002', content: '做出你最自信的pose，保持10秒', category: 'perform', difficulty: 1, duration: 20 },
  { id: 'd003', content: '用方言说"我爱你"', category: 'perform', difficulty: 1, duration: 15 },
  { id: 'd004', content: '即兴唱一首歌的副歌部分', category: 'perform', difficulty: 1, duration: 30 },
  { id: 'd005', content: '做5个深蹲', category: 'perform', difficulty: 1, duration: 20 },
  
  // 表演类 - 中等
  { id: 'd006', content: '用肢体语言表演一部电影，让其他人猜', category: 'perform', difficulty: 2, duration: 60 },
  { id: 'd007', content: '模仿在场一个人的说话方式和习惯动作', category: 'perform', difficulty: 2, duration: 30 },
  { id: 'd008', content: '跳一段15秒的即兴舞蹈', category: 'perform', difficulty: 2, duration: 20 },
  { id: 'd009', content: '用京剧腔调朗读一段广告词', category: 'perform', difficulty: 2, duration: 30 },
  { id: 'd010', content: '表演一个你常用的表情包', category: 'perform', difficulty: 2, duration: 20 },
  
  // 表演类 - 挑战
  { id: 'd011', content: '对着镜头/大家大声说"我是世界上最可爱的人"', category: 'perform', difficulty: 3, duration: 10 },
  { id: 'd012', content: '模仿一个网红的标志性动作和口头禅', category: 'perform', difficulty: 3, duration: 30 },
  { id: 'd013', content: '即兴rap介绍你自己（至少30秒）', category: 'perform', difficulty: 4, duration: 45 },
  { id: 'd014', content: '表演一段感人的哭戏', category: 'perform', difficulty: 4, duration: 30 },
  { id: 'd015', content: '用一分钟时间讲一个冷笑话，要让至少一个人笑', category: 'perform', difficulty: 3, duration: 60 },
  
  // 互动类 - 轻松
  { id: 'd016', content: '给你左边的人一个拥抱（或隔空拥抱）', category: 'interact', difficulty: 1, duration: 10 },
  { id: 'd017', content: '夸奖在场每个人一句话', category: 'interact', difficulty: 1, duration: 60 },
  { id: 'd018', content: '和一个人玩一局石头剪刀布，输了要做鬼脸', category: 'interact', difficulty: 1, duration: 20 },
  { id: 'd019', content: '让在场的人给你取一个新外号，接受它', category: 'interact', difficulty: 1, duration: 30 },
  { id: 'd020', content: '选一个人，盯着对方的眼睛10秒不许笑', category: 'interact', difficulty: 1, duration: 15 },
  
  // 互动类 - 中等
  { id: 'd021', content: '给你右边的人按摩肩膀30秒（或模拟动作）', category: 'interact', difficulty: 2, duration: 35 },
  { id: 'd022', content: '说出在场每个人的一个优点', category: 'interact', difficulty: 2, duration: 60 },
  { id: 'd023', content: '选一个人，用土味情话向TA表白', category: 'interact', difficulty: 2, duration: 20 },
  { id: 'd024', content: '打电话/发语音给一个好友说"我想你了"', category: 'interact', difficulty: 2, duration: 30 },
  { id: 'd025', content: '让在场的人投票选出你最明显的特点', category: 'interact', difficulty: 2, duration: 45 },
  
  // 互动类 - 挑战
  { id: 'd026', content: '给你暗恋过/喜欢过的人发一条问候消息', category: 'interact', difficulty: 3, duration: 30 },
  { id: 'd027', content: '打电话给父母说"爸妈我爱你"', category: 'interact', difficulty: 3, duration: 45 },
  { id: 'd028', content: '让在场的人轮流用一个词形容你', category: 'interact', difficulty: 3, duration: 60 },
  { id: 'd029', content: '选一个人，认真地看着TA的眼睛说"你很特别"', category: 'interact', difficulty: 4, duration: 15 },
  { id: 'd030', content: '在朋友圈发一条夸自己的状态（可设分组）', category: 'interact', difficulty: 4, duration: 60 },
  
  // 搞笑类 - 轻松
  { id: 'd031', content: '用慢动作表演喝水', category: 'funny', difficulty: 1, duration: 20 },
  { id: 'd032', content: '做出最难看的表情自拍一张', category: 'funny', difficulty: 1, duration: 15 },
  { id: 'd033', content: '学企鹅走路走10步', category: 'funny', difficulty: 1, duration: 20 },
  { id: 'd034', content: '用婴儿语说一句"我好饿"', category: 'funny', difficulty: 1, duration: 10 },
  { id: 'd035', content: '做出你认为最性感的表情', category: 'funny', difficulty: 1, duration: 10 },
  
  // 搞笑类 - 中等
  { id: 'd036', content: '用屁股写出你的名字', category: 'funny', difficulty: 2, duration: 30 },
  { id: 'd037', content: '模仿一种动物吃东西的样子', category: 'funny', difficulty: 2, duration: 20 },
  { id: 'd038', content: '把脸贴在桌子/墙上，保持10秒', category: 'funny', difficulty: 2, duration: 15 },
  { id: 'd039', content: '学机器人走路绕场一圈', category: 'funny', difficulty: 2, duration: 30 },
  { id: 'd040', content: '用只有元音的方式说一句话', category: 'funny', difficulty: 2, duration: 20 },
  
  // 搞笑类 - 挑战
  { id: 'd041', content: '做出最夸张的打喷嚏表演', category: 'funny', difficulty: 3, duration: 15 },
  { id: 'd042', content: '用最骚气的方式走一段猫步', category: 'funny', difficulty: 3, duration: 20 },
  { id: 'd043', content: '挑战一分钟不眨眼', category: 'funny', difficulty: 3, duration: 65 },
  { id: 'd044', content: '模仿你妈妈/爸爸生气的样子', category: 'funny', difficulty: 4, duration: 30 },
  { id: 'd045', content: '用最浮夸的演技说"这是我这辈子吃过最好吃的东西"', category: 'funny', difficulty: 3, duration: 20 },
  
  // 才艺类 - 轻松
  { id: 'd046', content: '展示一个你会的小技能', category: 'talent', difficulty: 1, duration: 30 },
  { id: 'd047', content: '画一幅自画像给大家看', category: 'talent', difficulty: 1, duration: 60 },
  { id: 'd048', content: '说一句你会的外语', category: 'talent', difficulty: 1, duration: 10 },
  { id: 'd049', content: '展示你手机里拍的最好看的照片', category: 'talent', difficulty: 1, duration: 15 },
  { id: 'd050', content: '用手指打响指10下', category: 'talent', difficulty: 1, duration: 20 },
  
  // 才艺类 - 中等
  { id: 'd051', content: '倒着说一句完整的话', category: 'talent', difficulty: 2, duration: 30 },
  { id: 'd052', content: '唱一首歌但只能用"啦"', category: 'talent', difficulty: 2, duration: 30 },
  { id: 'd053', content: '背诵一首古诗', category: 'talent', difficulty: 2, duration: 30 },
  { id: 'd054', content: '说出10个以同一个字开头的词语', category: 'talent', difficulty: 2, duration: 30 },
  { id: 'd055', content: '用手比划一个数学公式让别人猜', category: 'talent', difficulty: 2, duration: 45 },
  
  // 才艺类 - 挑战
  { id: 'd056', content: '一口气说完一段绕口令', category: 'talent', difficulty: 3, duration: 30 },
  { id: 'd057', content: '30秒内说出20种水果', category: 'talent', difficulty: 3, duration: 35 },
  { id: 'd058', content: '用B-box节奏打一段beat', category: 'talent', difficulty: 4, duration: 30 },
  { id: 'd059', content: '背诵圆周率小数点后尽可能多的位数', category: 'talent', difficulty: 4, duration: 30 },
  { id: 'd060', content: '即兴创作一首四句诗，主题是"今天的游戏"', category: 'talent', difficulty: 4, duration: 60 },
  
  // 惩罚类 - 轻度
  { id: 'd061', content: '下一轮不能说"我"字', category: 'punishment', difficulty: 2, duration: 0 },
  { id: 'd062', content: '接下来三轮只能用点头或摇头回应', category: 'punishment', difficulty: 2, duration: 0 },
  { id: 'd063', content: '给下一个被选中的人出一道题', category: 'punishment', difficulty: 2, duration: 30 },
  { id: 'd064', content: '分享你手机壁纸的故事', category: 'punishment', difficulty: 2, duration: 30 },
  { id: 'd065', content: '展示你手机里最近删除的照片（如果有的话）', category: 'punishment', difficulty: 3, duration: 20 },
  
  // 特殊任务
  { id: 'd066', content: '选择一个人和你一起完成一个双人pose', category: 'special', difficulty: 2, duration: 20 },
  { id: 'd067', content: '说出你对在场一个人的第一印象', category: 'special', difficulty: 2, duration: 30 },
  { id: 'd068', content: '用三个词描述你的人生', category: 'special', difficulty: 2, duration: 20 },
  { id: 'd069', content: '分享一件今天发生的开心的事', category: 'special', difficulty: 1, duration: 30 },
  { id: 'd070', content: '给在场的人排一个你觉得的颜值排名', category: 'special', difficulty: 5, duration: 45 },
];

// 根据难度和主题获取大冒险任务
export function getDareQuestion(options = {}) {
  const { difficulty = 'standard', usedIds = [] } = options;
  
  let filtered = dareQuestions.filter(q => !usedIds.includes(q.id));
  
  // 难度过滤
  const difficultyMap = {
    easy: [1, 2],
    standard: [1, 2, 3],
    hard: [2, 3, 4, 5],
  };
  const allowedDifficulties = difficultyMap[difficulty] || [1, 2, 3];
  filtered = filtered.filter(q => allowedDifficulties.includes(q.difficulty));
  
  if (filtered.length === 0) {
    // 如果没有可用任务，重置使用记录
    filtered = dareQuestions.filter(q => allowedDifficulties.includes(q.difficulty));
  }
  
  // 随机选择
  const randomIndex = Math.floor(Math.random() * filtered.length);
  return filtered[randomIndex];
}

// 隐藏任务
export const hiddenTasks = [
  { id: 'h001', content: '全员挑战：每个人用一句话夸奖自己', type: 'all_participate' },
  { id: 'h002', content: '积分翻倍轮！本轮所有人的投票分数×2', type: 'double_points' },
  { id: 'h003', content: '连环挑战：当前玩家完成后，指定下一个人继续', type: 'chain' },
  { id: 'h004', content: '团队合作：两两组队完成一个双人任务', type: 'team' },
  { id: 'h005', content: '真心话时刻：所有人轮流说一件今天发生的事', type: 'all_truth' },
];

export function getHiddenTask() {
  const randomIndex = Math.floor(Math.random() * hiddenTasks.length);
  return hiddenTasks[randomIndex];
}
