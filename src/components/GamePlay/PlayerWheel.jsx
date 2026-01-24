import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../../context/GameContext';

export default function PlayerWheel() {
  const { state, actions, checkGameEnd, getLeaderboard } = useGame();
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const spinTimeout = useRef(null);

  const players = state.players;
  const segmentAngle = 360 / players.length;

  // 检查游戏是否应该结束
  useEffect(() => {
    if (checkGameEnd()) {
      actions.endGame();
    }
  }, [state.currentRound]);

  // 开始旋转
  const startSpin = () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    setSelectedIndex(-1);

    // 随机选择一个玩家
    const randomIndex = Math.floor(Math.random() * players.length);
    
    // 计算旋转角度 (多转几圈 + 目标角度)
    const extraSpins = 5 + Math.floor(Math.random() * 3); // 5-7圈
    const targetAngle = randomIndex * segmentAngle;
    const totalRotation = rotation + (extraSpins * 360) + (360 - targetAngle) + (segmentAngle / 2);
    
    setRotation(totalRotation);

    // 旋转结束后
    spinTimeout.current = setTimeout(() => {
      setIsSpinning(false);
      setSelectedIndex(randomIndex);
      
      // 短暂延迟后进入下一阶段
      setTimeout(() => {
        actions.setCurrentPlayer(randomIndex);
      }, 1500);
    }, 4000);
  };

  // 清理定时器
  useEffect(() => {
    return () => {
      if (spinTimeout.current) {
        clearTimeout(spinTimeout.current);
      }
    };
  }, []);

  // 生成颜色
  const getColor = (index) => {
    const colors = [
      'from-rose-400 to-pink-500',
      'from-orange-400 to-amber-500',
      'from-yellow-400 to-lime-500',
      'from-green-400 to-emerald-500',
      'from-teal-400 to-cyan-500',
      'from-blue-400 to-indigo-500',
      'from-violet-400 to-purple-500',
      'from-fuchsia-400 to-pink-500',
      'from-red-400 to-rose-500',
      'from-sky-400 to-blue-500',
    ];
    return colors[index % colors.length];
  };

  // 计算游戏进度
  const gameProgress = state.gameStartTime 
    ? Math.min(100, ((Date.now() - state.gameStartTime) / 1000 / 60 / state.config.duration) * 100)
    : 0;

  const leaderboard = getLeaderboard().slice(0, 3);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex flex-col items-center justify-center p-4"
    >
      <div className="game-card p-6 md:p-8 max-w-lg w-full">
        {/* 顶部信息 */}
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm text-gray-500">
            第 {state.currentRound} 轮
          </div>
          <div className="flex items-center gap-2">
            <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                initial={{ width: 0 }}
                animate={{ width: `${gameProgress}%` }}
              />
            </div>
            <span className="text-xs text-gray-500">{Math.round(gameProgress)}%</span>
          </div>
        </div>

        {/* 标题 */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">🎯 转盘抽人</h2>
          <p className="text-gray-500 mt-1">
            {isSpinning ? '转动中...' : selectedIndex >= 0 ? `恭喜 ${players[selectedIndex].name}！` : '点击按钮开始'}
          </p>
        </div>

        {/* 转盘容器 */}
        <div className="relative w-64 h-64 mx-auto mb-6">
          {/* 指针 */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-10">
            <div className="w-0 h-0 border-l-[12px] border-l-transparent 
                            border-r-[12px] border-r-transparent border-t-[20px] 
                            border-t-indigo-600 drop-shadow-lg" />
          </div>

          {/* 转盘 */}
          <motion.div
            className="w-full h-full rounded-full overflow-hidden shadow-2xl border-4 border-white"
            style={{ 
              transform: `rotate(${rotation}deg)`,
              transition: isSpinning ? 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none'
            }}
          >
            {players.map((player, index) => {
              const startAngle = index * segmentAngle;
              const endAngle = (index + 1) * segmentAngle;
              
              return (
                <div
                  key={player.id}
                  className={`absolute w-full h-full origin-center`}
                  style={{
                    clipPath: `polygon(50% 50%, ${50 + 50 * Math.cos((startAngle - 90) * Math.PI / 180)}% ${50 + 50 * Math.sin((startAngle - 90) * Math.PI / 180)}%, ${50 + 50 * Math.cos((endAngle - 90) * Math.PI / 180)}% ${50 + 50 * Math.sin((endAngle - 90) * Math.PI / 180)}%)`
                  }}
                >
                  <div className={`w-full h-full bg-gradient-to-br ${getColor(index)}`} />
                  <div
                    className="absolute top-1/4 left-1/2 -translate-x-1/2 text-white font-bold text-sm drop-shadow"
                    style={{
                      transform: `rotate(${startAngle + segmentAngle / 2}deg) translateY(-20px)`,
                      transformOrigin: 'center 128px'
                    }}
                  >
                    {player.name}
                  </div>
                </div>
              );
            })}
          </motion.div>

          {/* 中心圆 */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                          w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center">
            <span className="text-2xl">{isSpinning ? '🎲' : '🎯'}</span>
          </div>
        </div>

        {/* 选中动画 */}
        {selectedIndex >= 0 && !isSpinning && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center mb-4"
          >
            <div className="inline-block px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 
                            text-white text-xl font-bold rounded-2xl shadow-lg animate-bounce-in">
              🎉 {players[selectedIndex].name} 被选中！
            </div>
          </motion.div>
        )}

        {/* 开始按钮 */}
        <motion.button
          whileHover={{ scale: isSpinning ? 1 : 1.05 }}
          whileTap={{ scale: isSpinning ? 1 : 0.95 }}
          onClick={startSpin}
          disabled={isSpinning}
          className={`w-full py-4 font-bold text-xl rounded-2xl shadow-lg transition-all
                     ${isSpinning 
                       ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                       : 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'}`}
        >
          {isSpinning ? '🎲 转动中...' : '开始抽人 🚀'}
        </motion.button>

        {/* 积分榜预览 */}
        {leaderboard.length > 0 && leaderboard[0].score > 0 && (
          <div className="mt-6 p-4 bg-gray-50 rounded-xl">
            <h3 className="font-semibold text-gray-700 mb-2">🏆 当前排名</h3>
            <div className="space-y-1">
              {leaderboard.map((player, index) => (
                <div key={player.id} className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'} {player.name}
                  </span>
                  <span className="font-semibold text-indigo-600">{player.score}分</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 结束游戏按钮 */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => actions.endGame()}
          className="w-full mt-4 py-2 text-gray-500 text-sm hover:text-gray-700"
        >
          提前结束游戏
        </motion.button>
      </div>
    </motion.div>
  );
}
