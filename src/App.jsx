import React, { useState } from 'react';
import StartScreen from './pages/StartScreen';
import GameScreen from './pages/GameScreen';
import ResultScreen from './pages/ResultScreen';
import './App.css';

function App() {
  const [gameState, setGameState] = useState('start'); // start, playing, result
  const [userId, setUserId] = useState('');
  const [questions, setQuestions] = useState([]);
  const [scoreData, setScoreData] = useState(null);

  const startGame = (id, fetchedQuestions) => {
    setUserId(id);
    setQuestions(fetchedQuestions);
    setGameState('playing');
  };

  const endGame = (result) => {
    setScoreData(result);
    setGameState('result');
  };

  const restartGame = () => {
    setGameState('start');
    setScoreData(null);
    setQuestions([]);
  };

  return (
    <div className="App">
      {gameState === 'start' && <StartScreen onStart={startGame} />}
      {gameState === 'playing' && (
        <GameScreen
          questions={questions}
          userId={userId}
          onEnd={endGame}
        />
      )}
      {gameState === 'result' && (
        <ResultScreen
          scoreData={scoreData}
          onRestart={restartGame}
        />
      )}
    </div>
  );
}

export default App;
