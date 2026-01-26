import { motion } from 'framer-motion';
import { useGame, GAME_PHASES } from '../../context/GameContext';

export default function PlayerConfirm() {
  const { state, actions } = useGame();

  const handleStartGame = () => {
    actions.startGame();
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
          <h2 className="text-2xl font-bold text-gray-800">📋 参与须知</h2>
          <p className="text-gray-500 mt-1">开始前请确认以下内容</p>
        </div>

        {/* 须知内容 */}
        <div className="space-y-4 mb-6">
          {/* 安全词 */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-4 bg-amber-50 border border-amber-200 rounded-xl"
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl">🛡️</span>
              <div>
                <h3 className="font-semibold text-amber-800">安全词设定</h3>
                <p className="text-sm text-amber-700 mt-1">
                  感到不适时可以随时说<span className="font-bold">"跳过"</span>，
                  无需解释原因，其他玩家应尊重此选择。
                </p>
              </div>
            </div>
          </motion.div>

          {/* 隐私保护 */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-4 bg-blue-50 border border-blue-200 rounded-xl"
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl">🔒</span>
              <div>
                <h3 className="font-semibold text-blue-800">隐私保护</h3>
                <p className="text-sm text-blue-700 mt-1">
                  游戏中的内容仅限在场参与者知晓，请勿录屏或转发他人回答。
                </p>
              </div>
            </div>
          </motion.div>

          {/* 退出机制 */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-4 bg-green-50 border border-green-200 rounded-xl"
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl">🚪</span>
              <div>
                <h3 className="font-semibold text-green-800">退出机制</h3>
                <p className="text-sm text-green-700 mt-1">
                  每位玩家有3张跳过卡，可跳过不想回答的问题。游戏过程中也可选择暂时休息或退出。
                </p>
              </div>
            </div>
          </motion.div>

          {/* 游戏精神 */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="p-4 bg-purple-50 border border-purple-200 rounded-xl"
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl">🎉</span>
              <div>
                <h3 className="font-semibold text-purple-800">游戏精神</h3>
                <p className="text-sm text-purple-700 mt-1">
                  本游戏旨在增进友谊、带来欢乐，请保持尊重和友善，避免恶意或过分的问题。
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* 玩家确认列表 */}
        <div className="mb-6">
          <h3 className="font-semibold text-gray-700 mb-3">👥 参与玩家 ({state.players.length}人)</h3>
          <div className="flex flex-wrap gap-2">
            {state.players.map((player, index) => (
              <motion.div
                key={player.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * index }}
                className="px-3 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 
                           rounded-full text-indigo-700 font-medium text-sm"
              >
                {player.name}
              </motion.div>
            ))}
          </div>
        </div>

        {/* 游戏规则提示 */}
        <div className="mb-6 p-4 bg-gray-50 rounded-xl">
          <h3 className="font-semibold text-gray-700 mb-2">📖 计分规则</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• 真心话完成：+2分</li>
            <li>• 大冒险完成：+3分</li>
            <li>• 大冒险失败：-4分</li>
            <li>• 使用跳过卡：-2分（需积分≥5分）</li>
            <li>• 获得"有趣"投票：额外+1分</li>
            <li>• 累计10分可抽取道具卡</li>
          </ul>
        </div>

        {/* 导航按钮 */}
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => actions.setPhase(GAME_PHASES.GAME_CONFIG)}
            className="flex-1 py-3 border-2 border-gray-200 text-gray-600 
                       font-semibold rounded-xl hover:bg-gray-50"
          >
            ← 返回
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleStartGame}
            className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-600 
                       text-white font-semibold rounded-xl shadow-lg
                       animate-pulse-glow"
          >
            确认开始 🎮
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
