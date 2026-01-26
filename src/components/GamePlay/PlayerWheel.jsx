import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../../context/GameContext';

export default function PlayerWheel() {
  const { state, actions, checkGameEnd, getLeaderboard } = useGame();
  const [isSpinning, setIsSpinning] = useState(false);
  const [isSelected, setIsSelected] = useState(false); // 已选中等待跳转
  const [rotation, setRotation] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const spinTimeout = useRef(null);
  const jumpTimeout = useRef(null);

  const players = state.players;
  const segmentAngle = 360 / players.length;

  // SVG 参数
  const size = 256; // 转盘尺寸
  const center = size / 2;
  const radius = size / 2 - 4; // 留出边框空间
  const innerRadius = 32; // 中心圆半径

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
    // 指针在顶部，需要将被选中玩家的扇形中心旋转到顶部
    const extraSpins = 5 + Math.floor(Math.random() * 3); // 5-7圈
    // 玩家扇形中心角度（相对于初始位置）
    const segmentCenterAngle = randomIndex * segmentAngle + segmentAngle / 2;
    // 转盘需要旋转的角度：多转几圈 + 让扇形中心对准顶部
    const totalRotation = rotation + (extraSpins * 360) + (360 - segmentCenterAngle);
    
    setRotation(totalRotation);

    // 旋转结束后显示选中结果
    spinTimeout.current = setTimeout(() => {
      setIsSpinning(false);
      setIsSelected(true);
      setSelectedIndex(randomIndex);
      
      // 1.5秒后跳转到选题阶段
      jumpTimeout.current = setTimeout(() => {
        setIsSelected(false);
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
      if (jumpTimeout.current) {
        clearTimeout(jumpTimeout.current);
      }
    };
  }, []);

  // 生成扇形颜色
  const getColor = (index) => {
    const colors = [
      ['#fb7185', '#ec4899'], // rose-pink
      ['#fb923c', '#f59e0b'], // orange-amber
      ['#facc15', '#84cc16'], // yellow-lime
      ['#4ade80', '#10b981'], // green-emerald
      ['#2dd4bf', '#06b6d4'], // teal-cyan
      ['#60a5fa', '#6366f1'], // blue-indigo
      ['#a78bfa', '#8b5cf6'], // violet-purple
      ['#e879f9', '#ec4899'], // fuchsia-pink
      ['#f87171', '#fb7185'], // red-rose
      ['#38bdf8', '#3b82f6'], // sky-blue
    ];
    return colors[index % colors.length];
  };

  // 计算扇形路径
  const getSegmentPath = (index) => {
    const startAngle = (index * segmentAngle - 90) * (Math.PI / 180);
    const endAngle = ((index + 1) * segmentAngle - 90) * (Math.PI / 180);
    
    const x1 = center + radius * Math.cos(startAngle);
    const y1 = center + radius * Math.sin(startAngle);
    const x2 = center + radius * Math.cos(endAngle);
    const y2 = center + radius * Math.sin(endAngle);
    
    const largeArcFlag = segmentAngle > 180 ? 1 : 0;
    
    return `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
  };

  // 计算文字位置和旋转
  const getTextTransform = (index) => {
    const midAngle = (index * segmentAngle + segmentAngle / 2 - 90) * (Math.PI / 180);
    // 文字放在扇形中间偏外的位置
    const textRadius = (radius + innerRadius) / 2 + 15;
    const x = center + textRadius * Math.cos(midAngle);
    const y = center + textRadius * Math.sin(midAngle);
    // 文字旋转角度，使其沿径向排列
    const rotateAngle = index * segmentAngle + segmentAngle / 2;
    return { x, y, rotateAngle };
  };

  // 截断过长的名字
  const truncateName = (name, maxLen = 4) => {
    return name.length > maxLen ? name.slice(0, maxLen) + '..' : name;
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

          {/* SVG 转盘 */}
          <svg
            width={size}
            height={size}
            className="drop-shadow-2xl"
            style={{ 
              transform: `rotate(${rotation}deg)`,
              transition: isSpinning ? 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none'
            }}
          >
            {/* 外圈边框 */}
            <circle cx={center} cy={center} r={radius + 2} fill="white" />
            
            {/* 扇形区域 */}
            {players.map((player, index) => {
              const colors = getColor(index);
              const gradientId = `gradient-${index}`;
              const { x, y, rotateAngle } = getTextTransform(index);
              
              return (
                <g key={player.id}>
                  {/* 渐变定义 */}
                  <defs>
                    <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor={colors[0]} />
                      <stop offset="100%" stopColor={colors[1]} />
                    </linearGradient>
                  </defs>
                  
                  {/* 扇形 */}
                  <path
                    d={getSegmentPath(index)}
                    fill={`url(#${gradientId})`}
                    stroke="white"
                    strokeWidth="1"
                  />
                  
                  {/* 玩家名称 */}
                  <text
                    x={x}
                    y={y}
                    fill="white"
                    fontSize={players.length > 6 ? "11" : "13"}
                    fontWeight="bold"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    transform={`rotate(${rotateAngle}, ${x}, ${y})`}
                    style={{
                      textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                      pointerEvents: 'none'
                    }}
                  >
                    {truncateName(player.name, players.length > 6 ? 3 : 4)}
                  </text>
                </g>
              );
            })}
            
            {/* 中心圆 */}
            <circle cx={center} cy={center} r={innerRadius} fill="white" />
          </svg>

          {/* 中心图标 */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                          w-16 h-16 flex items-center justify-center pointer-events-none">
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
          whileHover={{ scale: (isSpinning || isSelected) ? 1 : 1.05 }}
          whileTap={{ scale: (isSpinning || isSelected) ? 1 : 0.95 }}
          onClick={startSpin}
          disabled={isSpinning || isSelected}
          className={`w-full py-4 font-bold text-xl rounded-2xl shadow-lg transition-all
                     ${(isSpinning || isSelected)
                       ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                       : 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'}`}
        >
          {isSpinning ? '🎲 转动中...' : isSelected ? '✨ 选中幸运儿' : '开始抽人 🚀'}
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
