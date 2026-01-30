import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame, GAME_PHASES, PROP_TYPES } from '../../context/GameContext';

export default function ChallengeDisplay() {
  const { state, actions, getCurrentPlayer } = useGame();
  const [timeLeft, setTimeLeft] = useState(null);
  const [showVoting, setShowVoting] = useState(false);
  const [votes, setVotes] = useState({});
  const [showPropMenu, setShowPropMenu] = useState(false);
  
  const currentPlayer = getCurrentPlayer();
  const challenge = state.currentChallenge;
  const isHiddenTask = challenge?.isHidden;
  const currentType = state.challengeType; // 'truth' 或 'dare'
  
  // 检查当前题目是否已被喜欢（根据类型分开查询）
  const typeQuestions = state.likedQuestions[currentType] || [];
  const isLiked = challenge && typeQuestions.some(q => q.id === challenge.id);
  const likedCount = typeQuestions.length;
  const threshold = currentType === 'truth' ? 20 : 10;
  const isAIEnabled = state.aiQuestionsEnabled[currentType];
  
  // 初始化计时器
  useEffect(() => {
    if (challenge) {
      const duration = state.challengeType === 'truth' ? 180 : (challenge.duration || 120);
      setTimeLeft(duration);
    }
  }, [challenge]);

  // 倒计时
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0 || showVoting) return;
    
    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [timeLeft, showVoting]);

  // 格式化时间
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // 使用跳过卡
  const handleSkip = () => {
    if (currentPlayer.skipCards > 0 && currentPlayer.score >= 5) {
      actions.useSkipCard();
      actions.completeRound({ skipped: true, points: -2, funnyBonus: false });
    }
  };

  // 使用道具
  const handleUseProp = (propType) => {
    actions.useProp(currentPlayer.id, propType);
    setShowPropMenu(false);
    
    if (propType === 'protect') {
      // 保护卡直接跳过
      actions.completeRound({ skipped: true, points: 0, funnyBonus: false });
    }
  };

  // 完成挑战，进入投票
  const handleComplete = () => {
    setShowVoting(true);
  };

  // 提交投票
  const handleVote = (vote) => {
    const newVotes = { ...votes };
    // 模拟其他玩家投票（单设备模式下由当前操作者决定）
    state.players.forEach(p => {
      if (p.id !== currentPlayer.id) {
        newVotes[p.id] = vote;
      }
    });
    setVotes(newVotes);
  };

  // 确认结果
  const handleConfirmResult = () => {
    const voteValues = Object.values(votes);
    const passVotes = voteValues.filter(v => v === 'pass' || v === 'funny').length;
    const funnyVotes = voteValues.filter(v => v === 'funny').length;
    
    // 如果没有投票，默认通过
    const passed = voteValues.length === 0 || passVotes > 0;
    
    if (passed) {
      const basePoints = state.challengeType === 'truth' ? 2 : 3;
      const funnyBonus = funnyVotes > 0;
      actions.completeRound({ 
        skipped: false, 
        points: basePoints + (funnyBonus ? 1 : 0),
        funnyBonus 
      });
    } else {
      // 需要解释，不得分
      actions.completeRound({ skipped: false, points: 0, funnyBonus: false });
    }
  };

  if (!challenge || !currentPlayer) return null;

  // 难度星级
  const difficultyStars = '⭐'.repeat(challenge.difficulty || 1);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex items-center justify-center p-4"
    >
      <div className="game-card p-6 md:p-8 max-w-md w-full">
        {/* 隐藏任务标识 */}
        {isHiddenTask && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-center mb-4"
          >
            <span className="inline-block px-4 py-2 bg-gradient-to-r from-amber-400 to-orange-500 
                           text-white font-bold rounded-full text-sm">
              ✨ 隐藏任务触发！✨
            </span>
          </motion.div>
        )}

        {/* 挑战类型标识 */}
        <div className="text-center mb-4">
          <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold
                          ${state.challengeType === 'truth' 
                            ? 'bg-pink-100 text-pink-700' 
                            : 'bg-orange-100 text-orange-700'}`}>
            {state.challengeType === 'truth' ? '💭 真心话' : '🎭 大冒险'}
          </span>
        </div>

        {/* 当前玩家 */}
        <div className="text-center mb-2">
          <span className="text-gray-600">挑战者：</span>
          <span className="font-bold text-indigo-600">{currentPlayer.name}</span>
        </div>

        {/* 难度 */}
        <div className="text-center mb-4">
          <span className="text-sm text-gray-500">难度：{difficultyStars}</span>
        </div>

        {/* 挑战内容 */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className={`p-6 rounded-2xl mb-6 relative
                     ${state.challengeType === 'truth'
                       ? 'bg-gradient-to-br from-pink-50 to-rose-100 border-2 border-pink-200'
                       : 'bg-gradient-to-br from-orange-50 to-amber-100 border-2 border-orange-200'}`}
        >
          {/* 爱心按钮 */}
          <motion.button
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              if (isLiked) {
                actions.unlikeQuestion(challenge.id, currentType);
              } else {
                actions.likeQuestion(challenge, currentType);
              }
            }}
            className="absolute top-3 right-3 text-2xl z-10"
          >
            <motion.span
              animate={isLiked ? { scale: [1, 1.3, 1] } : {}}
              transition={{ duration: 0.3 }}
            >
              {isLiked ? '❤️' : '🩶'}
            </motion.span>
          </motion.button>
          
          {/* AI题目标识 */}
          {challenge.isAI && (
            <div className="absolute top-3 left-3">
              <span className="px-2 py-1 bg-purple-500 text-white text-xs rounded-full">
                ✨ AI出题
              </span>
            </div>
          )}
          
          <p className="text-xl font-medium text-gray-800 leading-relaxed text-center pt-2">
            {challenge.content}
          </p>
          
          {/* 爱心进度 - 达满后只显示AI激活 */}
          <div className="mt-4 flex items-center justify-center gap-2 text-sm">
            {isAIEnabled ? (
              <span className="px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-xs font-medium">
                ✨ {currentType === 'truth' ? '真心话' : '大冒险'}AI出题已激活
              </span>
            ) : (
              <span className="text-gray-400">❤️ {likedCount}/{threshold}</span>
            )}
          </div>
        </motion.div>

        {/* 计时器 */}
        {!showVoting && (
          <div className="text-center mb-6">
            <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full
                           ${timeLeft <= 10 
                             ? 'bg-red-100 text-red-600' 
                             : 'bg-gray-100 text-gray-700'}`}>
              <span className="text-2xl font-bold">{formatTime(timeLeft || 0)}</span>
            </div>
            <p className="text-sm text-gray-500 mt-2">剩余时间</p>
          </div>
        )}

        {/* 投票区域 */}
        <AnimatePresence>
          {showVoting && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6"
            >
              <h3 className="text-center font-semibold text-gray-700 mb-4">
                👥 其他玩家评价
              </h3>
              <div className="grid grid-cols-3 gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleVote('pass')}
                  className={`p-4 rounded-xl text-center transition-all
                             ${Object.values(votes)[0] === 'pass'
                               ? 'bg-green-500 text-white'
                               : 'bg-green-100 text-green-700 hover:bg-green-200'}`}
                >
                  <div className="text-2xl mb-1">👍</div>
                  <div className="text-sm font-medium">通过</div>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleVote('funny')}
                  className={`p-4 rounded-xl text-center transition-all
                             ${Object.values(votes)[0] === 'funny'
                               ? 'bg-amber-500 text-white'
                               : 'bg-amber-100 text-amber-700 hover:bg-amber-200'}`}
                >
                  <div className="text-2xl mb-1">😂</div>
                  <div className="text-sm font-medium">有趣+1</div>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleVote('explain')}
                  className={`p-4 rounded-xl text-center transition-all
                             ${Object.values(votes)[0] === 'explain'
                               ? 'bg-gray-500 text-white'
                               : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  <div className="text-2xl mb-1">🤔</div>
                  <div className="text-sm font-medium">需解释</div>
                </motion.button>
              </div>

              {/* 确认按钮 */}
              {Object.keys(votes).length > 0 && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleConfirmResult}
                  className="w-full mt-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 
                             text-white font-semibold rounded-xl shadow-lg"
                >
                  确认结果 →
                </motion.button>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* 操作按钮 */}
        {!showVoting && (
          <div className="space-y-3">
            {/* 完成按钮 */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleComplete}
              className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 
                         text-white font-bold text-lg rounded-2xl shadow-lg"
            >
              ✅ 挑战完成
            </motion.button>

            {/* 大冒险失败按钮 */}
            {state.challengeType === 'dare' && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  actions.completeRound({ skipped: false, points: -4, funnyBonus: false });
                }}
                className="w-full py-3 bg-gradient-to-r from-red-500 to-rose-600 
                           text-white font-bold text-lg rounded-2xl shadow-lg"
              >
                ❌ 大冒险失败
              </motion.button>
            )}

            {/* 跳过和道具 */}
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSkip}
                disabled={currentPlayer.skipCards <= 0 || currentPlayer.score < 5}
                className={`flex-1 py-3 rounded-xl font-semibold transition-all
                           ${(currentPlayer.skipCards > 0 && currentPlayer.score >= 5)
                             ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                             : 'bg-gray-50 text-gray-300 cursor-not-allowed'}`}
              >
                🎫 跳过 ({currentPlayer.skipCards})
              </motion.button>
              
              {currentPlayer.props.length > 0 && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowPropMenu(!showPropMenu)}
                  className="flex-1 py-3 bg-purple-100 text-purple-700 
                             rounded-xl font-semibold hover:bg-purple-200"
                >
                  🎁 使用道具
                </motion.button>
              )}
            </div>

            {/* 道具菜单 */}
            <AnimatePresence>
              {showPropMenu && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-purple-50 rounded-xl p-4 space-y-2"
                >
                  {currentPlayer.props.map((propType, index) => {
                    const prop = PROP_TYPES[propType.toUpperCase()];
                    if (!prop) return null;
                    return (
                      <motion.button
                        key={index}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleUseProp(propType)}
                        className="w-full p-3 bg-white rounded-lg flex items-center gap-3
                                   hover:bg-purple-100 transition-colors"
                      >
                        <span className="text-2xl">{prop.icon}</span>
                        <div className="text-left">
                          <div className="font-semibold text-gray-700">{prop.name}</div>
                          <div className="text-xs text-gray-500">{prop.description}</div>
                        </div>
                      </motion.button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* 激活的道具效果 */}
        {state.activeProps.length > 0 && (
          <div className="mt-4 p-3 bg-amber-50 rounded-xl">
            <p className="text-sm text-amber-700">
              🎁 已激活道具：
              {state.activeProps.map(p => {
                const prop = PROP_TYPES[p.type.toUpperCase()];
                return prop ? ` ${prop.icon}${prop.name}` : '';
              })}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
