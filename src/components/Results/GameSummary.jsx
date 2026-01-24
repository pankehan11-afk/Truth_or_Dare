import { motion } from 'framer-motion';
import { useGame, GAME_PHASES } from '../../context/GameContext';

export default function GameSummary() {
  const { state, actions, getLeaderboard } = useGame();
  const leaderboard = getLeaderboard();

  // 计算奖项
  const awards = {
    // 勇气之星 - 回答最多敏感题
    courage: leaderboard.reduce((max, p) => 
      p.completedChallenges > (max?.completedChallenges || 0) ? p : max, null),
    // 幽默之王 - 获赞最多
    humor: leaderboard.reduce((max, p) => 
      p.funnyVotes > (max?.funnyVotes || 0) ? p : max, null),
    // 挑战达人 - 总分最高
    champion: leaderboard[0],
  };

  // 游戏统计
  const stats = {
    totalRounds: state.currentRound - 1,
    totalChallenges: state.roundHistory.length,
    truthCount: state.roundHistory.filter(r => r.type === 'truth').length,
    dareCount: state.roundHistory.filter(r => r.type === 'dare').length,
    skipCount: state.roundHistory.filter(r => r.skipped).length,
  };

  const handlePlayAgain = () => {
    actions.resetGame();
    actions.setPhase(GAME_PHASES.PLAYER_SETUP);
  };

  const handleNewGame = () => {
    actions.resetGame();
    actions.setPhase(GAME_PHASES.WELCOME);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex items-center justify-center p-4"
    >
      <div className="game-card p-6 md:p-8 max-w-md w-full">
        {/* 标题 */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.8 }}
          className="text-center mb-6"
        >
          <div className="text-6xl mb-3">🎉</div>
          <h2 className="text-2xl font-bold text-gray-800">游戏结束！</h2>
          <p className="text-gray-500 mt-1">感谢参与，精彩回顾</p>
        </motion.div>

        {/* 冠军展示 */}
        {awards.champion && awards.champion.score > 0 && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-6 p-6 bg-gradient-to-r from-amber-100 to-yellow-100 
                       rounded-2xl border-2 border-amber-200"
          >
            <div className="text-4xl mb-2">👑</div>
            <div className="text-lg text-amber-800">本场冠军</div>
            <div className="text-3xl font-bold text-amber-900 mt-2">
              {awards.champion.name}
            </div>
            <div className="text-amber-700 mt-1">{awards.champion.score} 分</div>
          </motion.div>
        )}

        {/* 排行榜 */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <h3 className="font-semibold text-gray-700 mb-3">🏆 最终排名</h3>
          <div className="space-y-2">
            {leaderboard.map((player, index) => (
              <motion.div
                key={player.id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 * index }}
                className={`flex items-center justify-between p-3 rounded-xl
                           ${index === 0 ? 'bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200' :
                             index === 1 ? 'bg-gradient-to-r from-gray-50 to-slate-50 border border-gray-200' :
                             index === 2 ? 'bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200' :
                             'bg-gray-50'}`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}`}
                  </span>
                  <span className="font-medium text-gray-700">{player.name}</span>
                </div>
                <span className="font-bold text-indigo-600">{player.score}分</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* 特别奖项 */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-6"
        >
          <h3 className="font-semibold text-gray-700 mb-3">🏅 特别奖项</h3>
          <div className="grid grid-cols-2 gap-3">
            {awards.courage && awards.courage.completedChallenges > 0 && (
              <div className="p-3 bg-rose-50 rounded-xl text-center border border-rose-200">
                <div className="text-2xl mb-1">💪</div>
                <div className="text-xs text-rose-600">勇气之星</div>
                <div className="font-semibold text-rose-800">{awards.courage.name}</div>
                <div className="text-xs text-rose-500">{awards.courage.completedChallenges}次挑战</div>
              </div>
            )}
            {awards.humor && awards.humor.funnyVotes > 0 && (
              <div className="p-3 bg-amber-50 rounded-xl text-center border border-amber-200">
                <div className="text-2xl mb-1">😂</div>
                <div className="text-xs text-amber-600">幽默之王</div>
                <div className="font-semibold text-amber-800">{awards.humor.name}</div>
                <div className="text-xs text-amber-500">{awards.humor.funnyVotes}次有趣</div>
              </div>
            )}
          </div>
        </motion.div>

        {/* 游戏统计 */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mb-6 p-4 bg-gray-50 rounded-xl"
        >
          <h3 className="font-semibold text-gray-700 mb-3">📊 游戏统计</h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">总轮数</span>
              <span className="font-semibold">{stats.totalRounds}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">完成挑战</span>
              <span className="font-semibold">{stats.totalChallenges - stats.skipCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">真心话</span>
              <span className="font-semibold text-pink-600">{stats.truthCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">大冒险</span>
              <span className="font-semibold text-orange-600">{stats.dareCount}</span>
            </div>
          </div>
        </motion.div>

        {/* 精彩瞬间 */}
        {state.roundHistory.length > 0 && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mb-6"
          >
            <h3 className="font-semibold text-gray-700 mb-3">✨ 精彩回顾</h3>
            <div className="max-h-40 overflow-y-auto space-y-2">
              {state.roundHistory.slice(-5).reverse().map((round, index) => (
                <div key={index} className="p-2 bg-gray-50 rounded-lg text-sm">
                  <span className="text-gray-500">第{round.round}轮 </span>
                  <span className="font-medium text-indigo-600">{round.player}</span>
                  <span className="text-gray-500">
                    {round.skipped ? ' 跳过了' : ' 完成了'}
                    {round.type === 'truth' ? '真心话' : '大冒险'}
                  </span>
                  {round.points > 0 && (
                    <span className="text-green-600"> +{round.points}分</span>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* 操作按钮 */}
        <div className="space-y-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handlePlayAgain}
            className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-600 
                       text-white font-bold text-lg rounded-2xl shadow-lg"
          >
            🔄 原班人马再来一局
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleNewGame}
            className="w-full py-3 border-2 border-gray-200 text-gray-600 
                       font-semibold rounded-xl hover:bg-gray-50"
          >
            🏠 返回首页
          </motion.button>
        </div>

        {/* 感谢语 */}
        <p className="text-center text-gray-400 text-xs mt-6">
          感谢游玩！希望你们玩得开心 🎮
        </p>
      </div>
    </motion.div>
  );
}
