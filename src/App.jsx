import { AnimatePresence } from 'framer-motion';
import { GameProvider, useGame, GAME_PHASES } from './context/GameContext';
import WelcomePage from './components/GameSetup/WelcomePage';
import PlayerSetup from './components/GameSetup/PlayerSetup';
import GameConfig from './components/GameSetup/GameConfig';
import PlayerConfirm from './components/GameSetup/PlayerConfirm';
import PlayerWheel from './components/GamePlay/PlayerWheel';
import ChallengeSelect from './components/GamePlay/ChallengeSelect';
import ChallengeDisplay from './components/GamePlay/ChallengeDisplay';
import GameSummary from './components/Results/GameSummary';
import './index.css';

function GameRouter() {
  const { state } = useGame();

  const renderPhase = () => {
    switch (state.phase) {
      case GAME_PHASES.WELCOME:
        return <WelcomePage key="welcome" />;
      case GAME_PHASES.PLAYER_SETUP:
        return <PlayerSetup key="player-setup" />;
      case GAME_PHASES.GAME_CONFIG:
        return <GameConfig key="game-config" />;
      case GAME_PHASES.PLAYER_CONFIRM:
        return <PlayerConfirm key="player-confirm" />;
      case GAME_PHASES.SPINNING:
        return <PlayerWheel key="spinning" />;
      case GAME_PHASES.CHALLENGE_SELECT:
        return <ChallengeSelect key="challenge-select" />;
      case GAME_PHASES.CHALLENGE_DISPLAY:
      case GAME_PHASES.VOTING:
        return <ChallengeDisplay key="challenge-display" />;
      case GAME_PHASES.GAME_SUMMARY:
        return <GameSummary key="game-summary" />;
      default:
        return <WelcomePage key="welcome-default" />;
    }
  };

  return (
    <AnimatePresence mode="wait">
      {renderPhase()}
    </AnimatePresence>
  );
}

function App() {
  return (
    <GameProvider>
      <div className="min-h-screen">
        <GameRouter />
      </div>
    </GameProvider>
  );
}

export default App;
