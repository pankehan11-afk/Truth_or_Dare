import { motion } from 'framer-motion';
import { useGame, GAME_PHASES } from '../../context/GameContext';

export default function WelcomePage() {
  const { actions } = useGame();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen flex items-center justify-center p-4"
    >
      <div className="game-card p-8 md:p-12 max-w-lg w-full text-center">
        {/* Logo/标题区域 */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.8 }}
          className="mb-8"
        >
          <div className="text-6xl md:text-7xl mb-4">🎲</div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            真心话大冒险
          </h1>
          <p className="text-gray-500 text-lg">
            和朋友们一起玩转派对游戏
          </p>
        </motion.div>

        {/* 特色介绍 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-3 gap-4 mb-8"
        >
          <div className="text-center">
            <div className="text-2xl mb-1">🎯</div>
            <div className="text-xs text-gray-600">多种主题</div>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-1">🏆</div>
            <div className="text-xs text-gray-600">积分排名</div>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-1">🎁</div>
            <div className="text-xs text-gray-600">趣味道具</div>
          </div>
        </motion.div>

        {/* 开始按钮 */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => actions.setPhase(GAME_PHASES.PLAYER_SETUP)}
          className="w-full py-4 px-8 bg-gradient-to-r from-indigo-500 to-purple-600 
                     text-white text-xl font-bold rounded-2xl shadow-lg
                     hover:shadow-xl transition-shadow"
        >
          开始游戏 🚀
        </motion.button>

        {/* 游戏说明 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 p-4 bg-gray-50 rounded-xl text-left"
        >
          <h3 className="font-semibold text-gray-700 mb-2">📖 游戏流程</h3>
          <ol className="text-sm text-gray-600 space-y-1">
            <li>1. 添加4-10名玩家</li>
            <li>2. 选择游戏主题和难度</li>
            <li>3. 转盘随机选人</li>
            <li>4. 选择真心话或大冒险</li>
            <li>5. 完成挑战获得积分</li>
          </ol>
        </motion.div>

        {/* 版本信息 */}
        <p className="mt-6 text-gray-400 text-xs">
          v3.0.0 · 本地聚会版
        </p>
      </div>
    </motion.div>
  );
}
