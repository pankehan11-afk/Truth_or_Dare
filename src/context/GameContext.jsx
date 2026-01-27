import { createContext, useContext, useReducer, useEffect } from 'react';

// 游戏阶段枚举
export const GAME_PHASES = {
  WELCOME: 'welcome',           // 欢迎页面
  PLAYER_SETUP: 'player_setup', // 玩家设置
  GAME_CONFIG: 'game_config',   // 游戏配置
  PLAYER_CONFIRM: 'player_confirm', // 参与者确认
  SPINNING: 'spinning',         // 转盘选人
  PROP_DRAW: 'prop_draw',       // 道具抽取
  CHALLENGE_SELECT: 'challenge_select', // 选择真心话/大冒险
  CHALLENGE_DISPLAY: 'challenge_display', // 显示挑战内容
  VOTING: 'voting',             // 投票确认
  GAME_SUMMARY: 'game_summary', // 游戏总结
};

// 道具类型
export const PROP_TYPES = {
  REVERSE: { id: 'reverse', name: '反转卡', description: '指定他人回答这个问题', icon: '🔄' },
  PROTECT: { id: 'protect', name: '保护卡', description: '跳过一轮挑战', icon: '🛡️' },
  TROUBLE: { id: 'trouble', name: '捣乱卡', description: '指定他人完成额外任务', icon: '😈' },
  LUCKY: { id: 'lucky', name: '幸运卡', description: '跳过一轮真心话', icon: '🍀' },
};

// 初始状态
const initialState = {
  phase: GAME_PHASES.WELCOME,
  players: [], // { id, name, score, skipCards, props, completedChallenges, skippedChallenges }
  config: {
    duration: 30,        // 游戏时长（分钟）
    difficulty: 'standard', // 轻松easy/标准standard/挑战hard
    theme: 'mixed',      // 情感emotion/搞笑funny/校园school/职场work/混合mixed
    punishment: 'light', // 轻度light/中度medium/无none
  },
  currentRound: 0,
  currentPlayerIndex: -1,
  currentChallenge: null, // { type: 'truth'|'dare', question, difficulty }
  challengeType: null, // 'truth' | 'dare'
  votes: {}, // { playerId: vote }
  gameStartTime: null,
  roundHistory: [], // 记录每轮的精彩瞬间
  usedQuestions: { truth: [], dare: [] }, // 记录已用过的题目ID
  activeProps: [], // 当前轮次激活的道具
  hiddenTaskTriggered: false, // 隐藏任务是否触发
};

// Action类型
const ACTION_TYPES = {
  SET_PHASE: 'SET_PHASE',
  ADD_PLAYER: 'ADD_PLAYER',
  REMOVE_PLAYER: 'REMOVE_PLAYER',
  UPDATE_PLAYER: 'UPDATE_PLAYER',
  SET_CONFIG: 'SET_CONFIG',
  START_GAME: 'START_GAME',
  SET_CURRENT_PLAYER: 'SET_CURRENT_PLAYER',
  SET_CHALLENGE_TYPE: 'SET_CHALLENGE_TYPE',
  SET_CHALLENGE: 'SET_CHALLENGE',
  SUBMIT_VOTE: 'SUBMIT_VOTE',
  COMPLETE_ROUND: 'COMPLETE_ROUND',
  USE_SKIP_CARD: 'USE_SKIP_CARD',
  USE_PROP: 'USE_PROP',
  ADD_PROP: 'ADD_PROP',
  RESET_GAME: 'RESET_GAME',
  TRIGGER_HIDDEN_TASK: 'TRIGGER_HIDDEN_TASK',
  CLEAR_PLAYERS: 'CLEAR_PLAYERS',
};

// Reducer
function gameReducer(state, action) {
  switch (action.type) {
    case ACTION_TYPES.SET_PHASE:
      return { ...state, phase: action.payload };
    
    case ACTION_TYPES.ADD_PLAYER:
      return {
        ...state,
        players: [...state.players, {
          id: Date.now().toString(),
          name: action.payload,
          score: 0,
          skipCards: 3,
          props: [],
          completedChallenges: 0,
          skippedChallenges: 0,
          funnyVotes: 0,
        }],
      };
    
    case ACTION_TYPES.REMOVE_PLAYER:
      return {
        ...state,
        players: state.players.filter(p => p.id !== action.payload),
      };
    
    case ACTION_TYPES.UPDATE_PLAYER:
      return {
        ...state,
        players: state.players.map(p =>
          p.id === action.payload.id ? { ...p, ...action.payload.updates } : p
        ),
      };
    
    case ACTION_TYPES.SET_CONFIG:
      return {
        ...state,
        config: { ...state.config, ...action.payload },
      };
    
    case ACTION_TYPES.START_GAME:
      return {
        ...state,
        phase: GAME_PHASES.SPINNING,
        gameStartTime: Date.now(),
        currentRound: 1,
      };
    
    case ACTION_TYPES.SET_CURRENT_PLAYER:
      return {
        ...state,
        currentPlayerIndex: action.payload,
        phase: GAME_PHASES.CHALLENGE_SELECT,
        activeProps: [],
      };
    
    case ACTION_TYPES.SET_CHALLENGE_TYPE:
      return {
        ...state,
        challengeType: action.payload,
      };
    
    case ACTION_TYPES.SET_CHALLENGE:
      return {
        ...state,
        currentChallenge: action.payload,
        phase: GAME_PHASES.CHALLENGE_DISPLAY,
        usedQuestions: {
          ...state.usedQuestions,
          [state.challengeType]: [...state.usedQuestions[state.challengeType], action.payload.id],
        },
      };
    
    case ACTION_TYPES.SUBMIT_VOTE:
      return {
        ...state,
        votes: { ...state.votes, [action.payload.playerId]: action.payload.vote },
      };
    
    case ACTION_TYPES.COMPLETE_ROUND: {
      const { skipped, points, funnyBonus } = action.payload;
      const currentPlayer = state.players[state.currentPlayerIndex];
      const doubleActive = state.activeProps.some(p => p.type === 'double');
      const finalPoints = doubleActive ? points * 2 : points;
      
      // 计算加分前后的分数
      const oldScore = currentPlayer.score;
      const newScore = oldScore + finalPoints;
      
      // 检查是否跨越了10分的倍数（每次达到10分的倍数都可以抽取道具）
      const oldMilestone = Math.floor(oldScore / 10);
      const newMilestone = Math.floor(newScore / 10);
      const shouldDrawProp = newMilestone > oldMilestone && newScore >= 10;
      
      return {
        ...state,
        players: state.players.map(p =>
          p.id === currentPlayer.id
            ? {
                ...p,
                score: newScore,
                completedChallenges: skipped ? p.completedChallenges : p.completedChallenges + 1,
                skippedChallenges: skipped ? p.skippedChallenges + 1 : p.skippedChallenges,
                funnyVotes: p.funnyVotes + (funnyBonus ? 1 : 0),
              }
            : p
        ),
        roundHistory: [...state.roundHistory, {
          round: state.currentRound,
          player: currentPlayer.name,
          type: state.challengeType,
          challenge: state.currentChallenge,
          skipped,
          points: finalPoints,
        }],
        currentRound: state.currentRound + 1,
        currentChallenge: null,
        challengeType: null,
        votes: {},
        phase: shouldDrawProp ? GAME_PHASES.PROP_DRAW : GAME_PHASES.SPINNING,
        hiddenTaskTriggered: false,
      };
    }
    
    case ACTION_TYPES.USE_SKIP_CARD: {
      const player = state.players[state.currentPlayerIndex];
      return {
        ...state,
        players: state.players.map(p =>
          p.id === player.id ? { ...p, skipCards: p.skipCards - 1 } : p
        ),
      };
    }
    
    case ACTION_TYPES.USE_PROP:
      return {
        ...state,
        activeProps: [...state.activeProps, action.payload],
        players: state.players.map(p =>
          p.id === action.payload.playerId
            ? { ...p, props: p.props.filter(prop => prop !== action.payload.type) }
            : p
        ),
      };
    
    case ACTION_TYPES.ADD_PROP: {
      // payload 可以是 { playerId, propType } 或者只是 playerId
      const { playerId, propType } = typeof action.payload === 'object' 
        ? action.payload 
        : { playerId: action.payload, propType: null };
      
      let selectedProp = propType;
      if (!selectedProp) {
        const propTypes = Object.keys(PROP_TYPES);
        selectedProp = propTypes[Math.floor(Math.random() * propTypes.length)].toLowerCase();
      }
      
      return {
        ...state,
        players: state.players.map(p =>
          p.id === playerId 
            ? { 
                ...p, 
                props: [...p.props, selectedProp],
                score: p.score - 10  // 抽取道具后扣除10分
              } 
            : p
        ),
      };
    }
    
    case ACTION_TYPES.TRIGGER_HIDDEN_TASK:
      return {
        ...state,
        hiddenTaskTriggered: true,
      };
    
    case ACTION_TYPES.RESET_GAME:
      return {
        ...initialState,
        players: state.players.map(p => ({
          ...p,
          score: 0,
          skipCards: 3,
          props: [],
          completedChallenges: 0,
          skippedChallenges: 0,
          funnyVotes: 0,
        })),
      };
    
    case ACTION_TYPES.CLEAR_PLAYERS:
      return {
        ...state,
        players: [],
      };
    
    case ACTION_TYPES.CLEAR_PLAYERS:
      return {
        ...state,
        players: [],
      };
    
    default:
      return state;
  }
}

// Context
const GameContext = createContext(null);

// Provider组件
export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  // Actions
  const actions = {
    setPhase: (phase) => dispatch({ type: ACTION_TYPES.SET_PHASE, payload: phase }),
    addPlayer: (name) => dispatch({ type: ACTION_TYPES.ADD_PLAYER, payload: name }),
    removePlayer: (id) => dispatch({ type: ACTION_TYPES.REMOVE_PLAYER, payload: id }),
    updatePlayer: (id, updates) => dispatch({ type: ACTION_TYPES.UPDATE_PLAYER, payload: { id, updates } }),
    setConfig: (config) => dispatch({ type: ACTION_TYPES.SET_CONFIG, payload: config }),
    startGame: () => dispatch({ type: ACTION_TYPES.START_GAME }),
    setCurrentPlayer: (index) => dispatch({ type: ACTION_TYPES.SET_CURRENT_PLAYER, payload: index }),
    setChallengeType: (type) => dispatch({ type: ACTION_TYPES.SET_CHALLENGE_TYPE, payload: type }),
    setChallenge: (challenge) => dispatch({ type: ACTION_TYPES.SET_CHALLENGE, payload: challenge }),
    submitVote: (playerId, vote) => dispatch({ type: ACTION_TYPES.SUBMIT_VOTE, payload: { playerId, vote } }),
    completeRound: (result) => dispatch({ type: ACTION_TYPES.COMPLETE_ROUND, payload: result }),
    useSkipCard: () => dispatch({ type: ACTION_TYPES.USE_SKIP_CARD }),
    useProp: (playerId, type) => dispatch({ type: ACTION_TYPES.USE_PROP, payload: { playerId, type } }),
    addProp: (playerId, propType = null) => dispatch({ type: ACTION_TYPES.ADD_PROP, payload: propType ? { playerId, propType } : playerId }),
    resetGame: () => dispatch({ type: ACTION_TYPES.RESET_GAME }),
    triggerHiddenTask: () => dispatch({ type: ACTION_TYPES.TRIGGER_HIDDEN_TASK }),
    endGame: () => dispatch({ type: ACTION_TYPES.SET_PHASE, payload: GAME_PHASES.GAME_SUMMARY }),
    clearPlayers: () => dispatch({ type: ACTION_TYPES.CLEAR_PLAYERS }),
  };

  // 获取当前玩家
  const getCurrentPlayer = () => {
    if (state.currentPlayerIndex >= 0 && state.currentPlayerIndex < state.players.length) {
      return state.players[state.currentPlayerIndex];
    }
    return null;
  };

  // 获取排行榜
  const getLeaderboard = () => {
    return [...state.players].sort((a, b) => b.score - a.score);
  };

  // 检查游戏是否应该结束
  const checkGameEnd = () => {
    if (!state.gameStartTime) return false;
    const elapsed = (Date.now() - state.gameStartTime) / 1000 / 60;
    return elapsed >= state.config.duration;
  };

  return (
    <GameContext.Provider value={{ 
      state, 
      actions, 
      getCurrentPlayer, 
      getLeaderboard,
      checkGameEnd,
    }}>
      {children}
    </GameContext.Provider>
  );
}

// 自定义Hook
export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
