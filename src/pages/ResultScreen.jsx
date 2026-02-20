import React from 'react';
import PixelCard from '../components/PixelCard';
import PixelButton from '../components/PixelButton';

const ResultScreen = ({ scoreData, onRestart }) => {
    const { score, pass } = scoreData || {};

    // Handling mock or error data
    const finalScore = score !== undefined ? score : 0;
    const passed = pass !== undefined ? pass : (finalScore >= 60);

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <PixelCard title="RESULT">
                <h1 style={{ color: passed ? 'var(--color-secondary)' : 'var(--color-primary)' }}>
                    {passed ? "MISSION COMPLETE!" : "GAME OVER"}
                </h1>

                <div style={{ fontSize: '4em', margin: '20px 0', textShadow: '4px 4px 0 #000' }}>
                    {finalScore}
                </div>

                <p>SCORE</p>

                {scoreData.correctCount !== undefined && (
                    <p style={{ fontSize: '0.8em', color: '#aaa' }}>
                        Correct: {scoreData.correctCount} / {scoreData.totalQuestions}
                    </p>
                )}

                {passed && (
                    <div style={{ marginTop: '20px', color: 'yellow' }}>
                        ★ NEW RECORD SAVED ★
                    </div>
                )}

                <div style={{ marginTop: '40px' }}>
                    <PixelButton onClick={onRestart} variant="accent">
                        TRY AGAIN (INSERT COIN)
                    </PixelButton>
                </div>
            </PixelCard>
        </div>
    );
};

export default ResultScreen;
