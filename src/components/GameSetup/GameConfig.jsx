import { motion } from 'framer-motion';
import { useGame, GAME_PHASES } from '../../context/GameContext';

const DURATION_OPTIONS = [
  { value: 30, label: '30分钟', desc: '快速体验' },
  { value: 45, label: '45分钟', desc: '标准时长' },
  { value: 60, label: '60分钟', desc: '深度畅玩' },
];

const DIFFICULTY_OPTIONS = [
  { value: 'easy', label: '轻松', desc: '适合初次玩', icon: '😊' },
  { value: 'standard', label: '标准', desc: '适度挑战', icon: '😎' },
  { value: 'hard', label: '挑战', desc: '勇敢者专属', icon: '🔥' },
];

const THEME_OPTIONS = [
  { value: 'mixed', label: '混合', icon: '🎲' },
  { value: 'emotion', label: '情感', icon: '💕' },
  { value: 'funny', label: '搞笑', icon: '😂' },
  { value: 'school', label: '校园', icon: '🎓' },
  { value: 'work', label: '职场', icon: '💼' },
];

const PUNISHMENT_OPTIONS = [
  { value: 'none', label: '无惩罚', desc: '纯粹好玩' },
  { value: 'light', label: '轻度', desc: '小小惩罚' },
  { value: 'medium', label: '中度', desc: '来点刺激' },
];

export default function GameConfig() {
  const { state, actions } = useGame();
  const { config } = state;

  const updateConfig = (key, value) => {
    actions.setConfig({ [key]: value });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="min-h-screen flex items-center justify-center p-4"
    >
      <div className="game-card p-6 md:p-8 max-w-md w-full">
        {/* 标题 */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">⚙️ 游戏设置</h2>
          <p className="text-gray-500 mt-1">自定义你的游戏体验</p>
        </div>

        {/* 游戏时长 */}
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">
            ⏱️ 游戏时长
          </label>
          <div className="grid grid-cols-3 gap-2">
            {DURATION_OPTIONS.map((option) => (
              <motion.button
                key={option.value}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => updateConfig('duration', option.value)}
                className={`p-3 rounded-xl text-center transition-all
                           ${config.duration === option.value
                             ? 'bg-indigo-500 text-white shadow-md'
                             : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                <div className="font-semibold">{option.label}</div>
                <div className="text-xs opacity-80">{option.desc}</div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* 难度级别 */}
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">
            🎯 难度级别
          </label>
          <div className="grid grid-cols-3 gap-2">
            {DIFFICULTY_OPTIONS.map((option) => (
              <motion.button
                key={option.value}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => updateConfig('difficulty', option.value)}
                className={`p-3 rounded-xl text-center transition-all
                           ${config.difficulty === option.value
                             ? 'bg-indigo-500 text-white shadow-md'
                             : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                <div className="text-xl mb-1">{option.icon}</div>
                <div className="font-semibold text-sm">{option.label}</div>
                <div className="text-xs opacity-80">{option.desc}</div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* 主题选择 */}
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">
            🎨 题目主题
          </label>
          <div className="flex flex-wrap gap-2">
            {THEME_OPTIONS.map((option) => (
              <motion.button
                key={option.value}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => updateConfig('theme', option.value)}
                className={`px-4 py-2 rounded-full transition-all
                           ${config.theme === option.value
                             ? 'bg-indigo-500 text-white shadow-md'
                             : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                <span className="mr-1">{option.icon}</span>
                {option.label}
              </motion.button>
            ))}
          </div>
        </div>

        {/* 惩罚机制 */}
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">
            ⚡ 惩罚机制
          </label>
          <div className="grid grid-cols-3 gap-2">
            {PUNISHMENT_OPTIONS.map((option) => (
              <motion.button
                key={option.value}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => updateConfig('punishment', option.value)}
                className={`p-3 rounded-xl text-center transition-all
                           ${config.punishment === option.value
                             ? 'bg-indigo-500 text-white shadow-md'
                             : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                <div className="font-semibold text-sm">{option.label}</div>
                <div className="text-xs opacity-80">{option.desc}</div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* 设置预览 */}
        <div className="mb-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl">
          <h3 className="font-semibold text-gray-700 mb-2">📋 当前设置</h3>
          <div className="text-sm text-gray-600 space-y-1">
            <p>• 玩家人数：{state.players.length}人</p>
            <p>• 游戏时长：{config.duration}分钟</p>
            <p>• 难度级别：{DIFFICULTY_OPTIONS.find(d => d.value === config.difficulty)?.label}</p>
            <p>• 题目主题：{THEME_OPTIONS.find(t => t.value === config.theme)?.label}</p>
          </div>
        </div>

        {/* 导航按钮 */}
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => actions.setPhase(GAME_PHASES.PLAYER_SETUP)}
            className="flex-1 py-3 border-2 border-gray-200 text-gray-600 
                       font-semibold rounded-xl hover:bg-gray-50"
          >
            ← 返回
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => actions.setPhase(GAME_PHASES.PLAYER_CONFIRM)}
            className="flex-1 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 
                       text-white font-semibold rounded-xl shadow-lg"
          >
            下一步 →
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
