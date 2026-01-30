import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGame, GAME_PHASES } from '../../context/GameContext';
import { getTruthQuestion } from '../../data/truthQuestions';
import { getDareQuestion, getHiddenTask } from '../../data/dareQuestions';
import { generateQuestion, analyzePreference } from '../../services/aiService';

export default function ChallengeSelect() {
  const { state, actions, getCurrentPlayer } = useGame();
  const [countdown, setCountdown] = useState(10);
  const [selected, setSelected] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const currentPlayer = getCurrentPlayer();

  // 倒计时
  useEffect(() => {
    if (countdown <= 0) {
      // 时间到，随机选择
      const randomType = Math.random() > 0.5 ? 'truth' : 'dare';
      handleSelect(randomType);
      return;
    }

    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown]);

  // 检查是否触发隐藏任务 (5%概率)
  const checkHiddenTask = () => {
    if (Math.random() < 0.05) {
      actions.triggerHiddenTask();
      return true;
    }
    return false;
  };

  // 尝试使用AI生成题目
  const tryGenerateAIQuestion = async (type) => {
    const typeQuestions = state.likedQuestions[type] || [];
    const threshold = type === 'truth' ? 20 : 10;
    
    // 如果还没有分析用户喜好，先分析
    if (!state.userPreference[type] && typeQuestions.length >= threshold) {
      const preference = await analyzePreference(typeQuestions);
      if (preference) {
        actions.setUserPreference(type, preference);
      }
    }
    
    // 生成AI题目
    const aiQuestion = await generateQuestion(state.userPreference[type], type);
    return aiQuestion;
  };

  const handleSelect = async (type) => {
    if (selected) return;
    
    setSelected(type);
    actions.setChallengeType(type);

    // 检查隐藏任务
    const isHidden = checkHiddenTask();
    
    // 延迟后获取题目并进入下一阶段
    setTimeout(async () => {
      let question;
      
      if (isHidden) {
        question = {
          ...getHiddenTask(),
          isHidden: true,
          difficulty: 3,
        };
      } else {
        // 如果对应类型的AI出题已激活，50%概率使用AI生成
        const shouldUseAI = state.aiQuestionsEnabled[type] && Math.random() < 0.5;
        
        if (shouldUseAI) {
          setIsGenerating(true);
          const aiQuestion = await tryGenerateAIQuestion(type);
          setIsGenerating(false);
          
          if (aiQuestion) {
            question = aiQuestion;
          }
        }
        
        // 如果没有AI题目，使用原题库
        if (!question) {
          if (type === 'truth') {
            question = getTruthQuestion({
              difficulty: state.config.difficulty,
              theme: state.config.theme,
              usedIds: state.usedQuestions.truth,
            });
          } else {
            question = getDareQuestion({
              difficulty: state.config.difficulty,
              usedIds: state.usedQuestions.dare,
            });
          }
        }
      }
      
      actions.setChallenge(question);
    }, 800);
  };

  if (!currentPlayer) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="min-h-screen flex items-center justify-center p-4"
    >
      <div className="game-card p-6 md:p-8 max-w-md w-full">
        {/* 当前玩家 */}
        <div className="text-center mb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.6 }}
            className="inline-block px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 
                       text-white rounded-full mb-4"
          >
            🎯 轮到 {currentPlayer.name}
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-800">选择挑战类型</h2>
        </div>

        {/* 倒计时 */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 
                          bg-gray-100 rounded-full">
            <motion.span
              key={countdown}
              initial={{ scale: 1.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`text-3xl font-bold ${countdown <= 3 ? 'text-red-500' : 'text-gray-700'}`}
            >
              {countdown}
            </motion.span>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            {countdown > 0 ? '秒后自动随机选择' : '随机选择中...'}
          </p>
        </div>

        {/* 选择按钮 */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* 真心话 */}
          <motion.button
            whileHover={{ scale: selected ? 1 : 1.05 }}
            whileTap={{ scale: selected ? 1 : 0.95 }}
            onClick={() => handleSelect('truth')}
            disabled={selected !== null}
            className={`relative p-6 rounded-2xl text-center transition-all overflow-hidden
                       ${selected === 'truth' 
                         ? 'bg-gradient-to-br from-pink-500 to-rose-600 text-white shadow-lg scale-105' 
                         : selected 
                           ? 'bg-gray-100 text-gray-400 opacity-50'
                           : 'bg-gradient-to-br from-pink-100 to-rose-100 text-pink-700 hover:from-pink-200 hover:to-rose-200'}`}
          >
            {selected === 'truth' && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-2 right-2 text-2xl"
              >
                ✓
              </motion.div>
            )}
            <div className="text-5xl mb-3">💭</div>
            <div className="text-xl font-bold">真心话</div>
            <div className="text-sm opacity-80 mt-1">回答一个问题</div>
          </motion.button>

          {/* 大冒险 */}
          <motion.button
            whileHover={{ scale: selected ? 1 : 1.05 }}
            whileTap={{ scale: selected ? 1 : 0.95 }}
            onClick={() => handleSelect('dare')}
            disabled={selected !== null}
            className={`relative p-6 rounded-2xl text-center transition-all overflow-hidden
                       ${selected === 'dare' 
                         ? 'bg-gradient-to-br from-orange-500 to-amber-600 text-white shadow-lg scale-105' 
                         : selected 
                           ? 'bg-gray-100 text-gray-400 opacity-50'
                           : 'bg-gradient-to-br from-orange-100 to-amber-100 text-orange-700 hover:from-orange-200 hover:to-amber-200'}`}
          >
            {selected === 'dare' && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-2 right-2 text-2xl"
              >
                ✓
              </motion.div>
            )}
            <div className="text-5xl mb-3">🎭</div>
            <div className="text-xl font-bold">大冒险</div>
            <div className="text-sm opacity-80 mt-1">完成一个任务</div>
          </motion.button>
        </div>

        {/* 玩家信息 */}
        <div className="p-4 bg-gray-50 rounded-xl">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">
              🎫 跳过卡：{currentPlayer.skipCards}张
            </span>
            <span className="text-gray-600">
              ⭐ 当前积分：{currentPlayer.score}分
            </span>
          </div>
          {currentPlayer.props.length > 0 && (
            <div className="mt-2 text-sm text-gray-600">
              🎁 道具：{currentPlayer.props.map(p => 
                p === 'reverse' ? '🔄' : p === 'protect' ? '🛡️' : p === 'trouble' ? '😈' : '🍀'
              ).join(' ')}
            </div>
          )}
        </div>

        {/* 提示 */}
        <p className="text-center text-gray-400 text-xs mt-4">
          选择后将获得对应类型的挑战
        </p>
      </div>
    </motion.div>
  );
}
