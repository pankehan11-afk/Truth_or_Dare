import { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame, GAME_PHASES, PROP_TYPES } from '../../context/GameContext';

export default function PropDraw() {
  const { state, actions, getCurrentPlayer } = useGame();
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [animationPhase, setAnimationPhase] = useState('idle'); // idle, center, flip, return, done
  
  const currentPlayer = getCurrentPlayer();
  const playerRef = useRef(currentPlayer);
  if (currentPlayer) {
    playerRef.current = currentPlayer;
  }
  
  // 随机打乱4张道具卡顺序
  const shuffledProps = useMemo(() => {
    const props = Object.values(PROP_TYPES);
    const shuffled = [...props];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }, []);
  
  // 处理卡片点击
  const handleCardClick = (index) => {
    if (selectedIndex !== -1) return;
    
    setSelectedIndex(index);
    setAnimationPhase('center');
    
    // 移动到中心后翻转
    setTimeout(() => setAnimationPhase('flip'), 600);
    // 翻转完成后返回
    setTimeout(() => setAnimationPhase('return'), 1800);
    // 返回完成后显示按钮
    setTimeout(() => setAnimationPhase('done'), 2500);
  };
  
  // 继续游戏
  const handleContinue = () => {
    const selectedProp = shuffledProps[selectedIndex];
    const player = playerRef.current;
    if (player && selectedProp) {
      actions.addProp(player.id, selectedProp.id);
    }
    actions.setPhase(GAME_PHASES.SPINNING);
  };
  
  // 卡片背面设计 - 支持自适应尺寸
  const CardBack = ({ scale = 1 }) => {
    // 再次缩减装饰大小
    const centerIconSize = scale >= 1.5 ? 'text-5xl' : 'text-4xl';
    const cornerStarSize = scale >= 1.5 ? 'text-xl' : 'text-lg';
    const cornerDecorSize = scale >= 1.5 ? 'w-8 h-8' : 'w-6 h-6';
    
    return (
      <div className="w-full h-full rounded-2xl relative overflow-hidden
                      bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600
                      shadow-[0_0_30px_rgba(139,92,246,0.4)]">
        {/* 光泽效果 */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent" />
        
        {/* 装饰纹理 */}
        <div className="absolute inset-0 opacity-30">
          <div className={`absolute top-3 left-3 ${cornerDecorSize} border-2 border-white/50 rounded-lg rotate-45`} />
          <div className={`absolute top-3 right-3 ${cornerDecorSize} border-2 border-white/50 rounded-lg rotate-45`} />
          <div className={`absolute bottom-3 left-3 ${cornerDecorSize} border-2 border-white/50 rounded-lg rotate-45`} />
          <div className={`absolute bottom-3 right-3 ${cornerDecorSize} border-2 border-white/50 rounded-lg rotate-45`} />
        </div>
        
        {/* 中心图案 */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            <div className={`${centerIconSize} animate-pulse`}>✨</div>
            <div className="absolute inset-0 blur-xl bg-white/30 rounded-full" />
          </div>
        </div>
        
        {/* 边框 */}
        <div className="absolute inset-3 border-2 border-white/30 rounded-xl" />
        
        {/* 角落星星 */}
        <div className={`absolute top-2 left-1/2 -translate-x-1/2 ${cornerStarSize} opacity-60`}>⭐</div>
        <div className={`absolute bottom-2 left-1/2 -translate-x-1/2 ${cornerStarSize} opacity-60`}>⭐</div>
      </div>
    );
  };
  
  // 卡片正面设计 - 支持自适应尺寸
  const CardFront = ({ prop, scale = 1 }) => {
    // 再次缩减字体大小
    const iconSize = scale >= 1.5 ? 'text-4xl' : 'text-3xl';
    const titleSize = scale >= 1.5 ? 'text-lg' : 'text-sm';
    const descSize = scale >= 1.5 ? 'text-xs' : 'text-[8px]';
    const padding = scale >= 1.5 ? 'p-3' : 'p-2';
    
    return (
      <div className="w-full h-full rounded-2xl relative overflow-hidden
                      bg-gradient-to-br from-amber-100 via-yellow-50 to-orange-100
                      shadow-[0_0_30px_rgba(251,191,36,0.4)]">
        {/* 光泽效果 */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-transparent to-transparent" />
        
        {/* 背景装饰 */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-200/50 rounded-full blur-2xl" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-orange-200/50 rounded-full blur-2xl" />
        
        {/* 内容 */}
        <div className={`absolute inset-0 flex flex-col items-center justify-center ${padding} z-10`}>
          <div className={`${iconSize} mb-2 drop-shadow-lg`}>{prop.icon}</div>
          <div className={`${titleSize} font-bold text-gray-800 mb-1 text-center`}>{prop.name}</div>
          <div className={`${descSize} text-gray-600 text-center leading-relaxed px-1`}>{prop.description}</div>
        </div>
        
        {/* 边框 */}
        <div className="absolute inset-2 border-2 border-amber-300/60 rounded-xl" />
        
        {/* 角落装饰 */}
        <div className="absolute top-1 left-1 text-sm opacity-40">🌟</div>
        <div className="absolute top-1 right-1 text-sm opacity-40">🌟</div>
        <div className="absolute bottom-1 left-1 text-sm opacity-40">🌟</div>
        <div className="absolute bottom-1 right-1 text-sm opacity-40">🌟</div>
      </div>
    );
  };

  const player = playerRef.current;
  if (!player) return null;

  // 卡片位置：2x2布局
  const cardPositions = [
    { x: 0, y: 0 },     // 左上
    { x: 1, y: 0 },     // 右上
    { x: 0, y: 1 },     // 左下
    { x: 1, y: 1 },     // 右下
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex items-center justify-center p-4
                 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"
    >
      {/* 背景星星效果 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            initial={{ opacity: 0.3 }}
            animate={{ 
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.5, 1],
            }}
            transition={{ 
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="game-card p-8 max-w-lg w-full bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl">
        {/* 标题 */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-8"
        >
          <h2 className="text-4xl font-bold text-transparent bg-clip-text 
                         bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-300 mb-3">
            🎁 道具抽取
          </h2>
          <p className="text-purple-200 text-lg">
            恭喜 <span className="text-amber-300 font-bold">{player.name}</span> 累计10分！
          </p>
          <p className="text-purple-300/70 text-sm mt-2">选择一张神秘卡片</p>
        </motion.div>

        {/* 卡片区域 - 2x2布局 */}
        <div className="relative mx-auto mb-8" style={{ width: '280px', height: '340px' }}>
          {shuffledProps.map((prop, index) => {
            const isSelected = selectedIndex === index;
            const isOther = selectedIndex !== -1 && !isSelected;
            const pos = cardPositions[index];
            
            // 基础尺寸
            const baseWidth = 120;
            const baseHeight = 150;
            const gap = 20;
            
            // 计算原始位置（居中对齐）
            const originX = pos.x * (baseWidth + gap);
            const originY = pos.y * (baseHeight + gap);
            
            // 计算中心位置
            const centerX = (280 - baseWidth) / 2;
            const centerY = (340 - baseHeight) / 2;
            
            // 根据动画阶段决定位置和大小
            const getAnimationState = () => {
              if (!isSelected) {
                return {
                  x: originX,
                  y: originY,
                  scale: 1,
                  opacity: isOther ? 0.25 : 1,
                  filter: isOther ? 'blur(4px)' : 'blur(0px)',
                  rotateY: 0,
                  zIndex: 0,
                };
              }
              
              switch (animationPhase) {
                case 'center':
                  return {
                    x: centerX,
                    y: centerY - 20,
                    scale: 1.6, // 放大1.6倍（比其他卡片大一倍多）
                    opacity: 1,
                    filter: 'blur(0px)',
                    rotateY: 0,
                    zIndex: 50,
                  };
                case 'flip':
                  return {
                    x: centerX,
                    y: centerY - 20,
                    scale: 1.6,
                    opacity: 1,
                    filter: 'blur(0px)',
                    rotateY: 180,
                    zIndex: 50,
                  };
                case 'return':
                case 'done':
                  return {
                    x: originX,
                    y: originY,
                    scale: 1.1, // 返回后保持1.1倍大小
                    opacity: 1,
                    filter: 'blur(0px)',
                    rotateY: 180,
                    zIndex: 10,
                  };
                default:
                  return {
                    x: originX,
                    y: originY,
                    scale: 1,
                    opacity: 1,
                    filter: 'blur(0px)',
                    rotateY: 0,
                    zIndex: 0,
                  };
              }
            };
            
            const animState = getAnimationState();
            
            return (
              <motion.div
                key={prop.id}
                initial={{ 
                  opacity: 0,
                  scale: 0.5,
                  y: 50,
                }}
                animate={{
                  opacity: animState.opacity,
                  scale: animState.scale,
                  x: animState.x,
                  y: animState.y,
                  filter: animState.filter,
                  zIndex: animState.zIndex,
                }}
                transition={{ 
                  type: 'spring',
                  stiffness: 100,
                  damping: 15,
                  delay: selectedIndex === -1 ? index * 0.1 : 0,
                }}
                onClick={() => selectedIndex === -1 && handleCardClick(index)}
                className={`absolute cursor-pointer
                           ${selectedIndex === -1 ? 'hover:scale-110 hover:-translate-y-2' : ''}`}
                style={{
                  width: `${baseWidth}px`,
                  height: `${baseHeight}px`,
                  perspective: '1000px',
                  transformOrigin: 'center center',
                }}
              >
                <motion.div
                  className="w-full h-full relative"
                  animate={{ rotateY: animState.rotateY }}
                  transition={{ 
                    duration: 0.8,
                    ease: 'easeInOut',
                  }}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {/* 背面 */}
                  <div 
                    className="absolute inset-0"
                    style={{ backfaceVisibility: 'hidden' }}
                  >
                    <CardBack scale={animState.scale} />
                  </div>
                  {/* 正面 */}
                  <div 
                    className="absolute inset-0"
                    style={{ 
                      backfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)',
                    }}
                  >
                    <CardFront prop={prop} scale={animState.scale} />
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* 结果提示和继续按钮 */}
        <AnimatePresence>
          {animationPhase === 'done' && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ type: 'spring', stiffness: 100 }}
            >
              <div className="text-center mb-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                  className="inline-block px-6 py-3 bg-gradient-to-r from-amber-500/20 to-orange-500/20 
                             rounded-full border border-amber-400/30 mb-2"
                >
                  <span className="text-2xl mr-2">{shuffledProps[selectedIndex]?.icon}</span>
                  <span className="text-xl font-bold text-amber-300">
                    {shuffledProps[selectedIndex]?.name}
                  </span>
                </motion.div>
                <p className="text-purple-200 text-lg mt-3">
                  🎉 恭喜 <span className="text-amber-300 font-semibold">{player.name}</span> 获得新道具！
                </p>
              </div>
              
              <motion.button
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.03, boxShadow: '0 0 40px rgba(139,92,246,0.5)' }}
                whileTap={{ scale: 0.97 }}
                onClick={handleContinue}
                className="w-full py-4 rounded-2xl font-bold text-lg text-white
                           bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600
                           shadow-[0_0_30px_rgba(139,92,246,0.3)]
                           border border-white/20 transition-all duration-300"
              >
                继续游戏 ✨
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
