import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame, GAME_PHASES } from '../../context/GameContext';

export default function PlayerSetup() {
  const { state, actions } = useGame();
  const [newPlayerName, setNewPlayerName] = useState('');
  const [error, setError] = useState('');

  const handleAddPlayer = () => {
    const name = newPlayerName.trim();
    if (!name) {
      setError('请输入玩家名称');
      return;
    }
    if (state.players.some(p => p.name === name)) {
      setError('玩家名称已存在');
      return;
    }
    if (state.players.length >= 10) {
      setError('最多只能添加10名玩家');
      return;
    }
    actions.addPlayer(name);
    setNewPlayerName('');
    setError('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddPlayer();
    }
  };

  const canProceed = state.players.length >= 4;

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
          <h2 className="text-2xl font-bold text-gray-800">👥 添加玩家</h2>
          <p className="text-gray-500 mt-1">需要4-10名玩家参与游戏</p>
        </div>

        {/* 输入框 */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newPlayerName}
            onChange={(e) => setNewPlayerName(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="输入玩家名称..."
            maxLength={10}
            className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl
                       focus:border-indigo-500 focus:outline-none transition-colors"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddPlayer}
            disabled={state.players.length >= 10}
            className="px-6 py-3 bg-indigo-500 text-white font-semibold rounded-xl
                       disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            添加
          </motion.button>
        </div>

        {/* 错误提示 */}
        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-red-500 text-sm mb-4"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        {/* 玩家列表 */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600 font-medium">
              已添加玩家 ({state.players.length}/10)
            </span>
            {state.players.length < 4 && (
              <span className="text-amber-500 text-sm">
                还需 {4 - state.players.length} 人
              </span>
            )}
          </div>
          
          <div className="space-y-2 max-h-64 overflow-y-auto">
            <AnimatePresence>
              {state.players.map((player, index) => (
                <motion.div
                  key={player.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 flex items-center justify-center 
                                     bg-indigo-100 text-indigo-600 rounded-full font-semibold">
                      {index + 1}
                    </span>
                    <span className="font-medium text-gray-700">{player.name}</span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => actions.removePlayer(player.id)}
                    className="w-8 h-8 flex items-center justify-center 
                               text-gray-400 hover:text-red-500 hover:bg-red-50 
                               rounded-full transition-colors"
                  >
                    ✕
                  </motion.button>
                </motion.div>
              ))}
            </AnimatePresence>

            {state.players.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                <div className="text-4xl mb-2">🎭</div>
                <p>还没有玩家，快添加吧！</p>
              </div>
            )}
          </div>
        </div>

        {/* 快速添加按钮 */}
        <div className="mb-6">
          <p className="text-gray-500 text-sm mb-2">快速添加：</p>
          <div className="flex flex-wrap gap-2">
            {['玩家A', '玩家B', '玩家C', '玩家D', '玩家E'].map((name) => (
              <motion.button
                key={name}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  if (!state.players.some(p => p.name === name) && state.players.length < 10) {
                    actions.addPlayer(name);
                  }
                }}
                disabled={state.players.some(p => p.name === name) || state.players.length >= 10}
                className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full
                           hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                + {name}
              </motion.button>
            ))}
          </div>
        </div>

        {/* 导航按钮 */}
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => actions.setPhase(GAME_PHASES.WELCOME)}
            className="flex-1 py-3 border-2 border-gray-200 text-gray-600 
                       font-semibold rounded-xl hover:bg-gray-50"
          >
            返回
          </motion.button>
          <motion.button
            whileHover={{ scale: canProceed ? 1.02 : 1 }}
            whileTap={{ scale: canProceed ? 0.98 : 1 }}
            onClick={() => canProceed && actions.setPhase(GAME_PHASES.GAME_CONFIG)}
            disabled={!canProceed}
            className={`flex-1 py-3 font-semibold rounded-xl transition-all
                       ${canProceed 
                         ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg' 
                         : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
          >
            下一步 →
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
