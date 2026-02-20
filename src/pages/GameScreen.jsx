import React, { useState, useEffect } from 'react';
import PixelCard from '../components/PixelCard';
import PixelButton from '../components/PixelButton';
import { submitScore } from '../services/api';

const TIMER_SECONDS = 15; // 15 seconds per question

const GameScreen = ({ questions, userId, onEnd }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const currentQuestion = questions[currentIndex];
    const progress = ((currentIndex + 1) / questions.length) * 100;

    useEffect(() => {
        // Reset timer on new question
        setTimeLeft(TIMER_SECONDS);
    }, [currentIndex]);

    useEffect(() => {
        if (timeLeft <= 0) {
            handleAnswerTimeOut();
            return;
        }
        const timer = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [timeLeft, currentIndex]);

    const handleAnswerTimeOut = () => {
        // Time's up! Record as wrong/empty and move on
        handleSelectAnswer(null); // null means timeout/no answer
    };

    const handleSelectAnswer = (option) => {
        // Record Answer
        const newAnswers = { ...answers, [currentQuestion.id]: option };
        setAnswers(newAnswers);

        // Next Question or End
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            finishGame(newAnswers);
        }
    };

    const finishGame = async (finalAnswers) => {
        setIsSubmitting(true);
        try {
            const result = await submitScore(userId, finalAnswers);
            onEnd(result); // result should contain { score, pass, etc. }
        } catch (err) {
            console.error(err);
            onEnd({ error: 'Submission Failed', score: 0 });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSubmitting) {
        return (
            <div style={{ textAlign: 'center', marginTop: '100px' }}>
                <h2>CALCULATING SCORE...</h2>
                <div className="loader">PLEASE WAIT</div>
            </div>
        );
    }

    // DiceBear Avatar
    const avatarUrl = `https://api.dicebear.com/9.x/pixel-art/svg?seed=${currentQuestion.id}`;

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            {/* Header Info */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span>PLAYER: {userId}</span>
                <span>TIME: {timeLeft}s</span>
            </div>

            {/* Progress Bar */}
            <div style={{ border: '2px solid #fff', height: '20px', marginBottom: '20px', position: 'relative' }}>
                <div style={{
                    width: `${progress}%`,
                    backgroundColor: 'var(--color-secondary)',
                    height: '100%',
                    transition: 'width 0.3s'
                }}></div>
            </div>

            {/* Boss & Question */}
            <PixelCard style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                <img
                    src={avatarUrl}
                    alt="Boss"
                    style={{ width: '100px', height: '100px', border: '4px solid #fff', backgroundColor: '#000' }}
                />
                <div style={{ textAlign: 'center' }}>
                    <h3>STAGE {currentIndex + 1}</h3>
                    <p style={{ fontSize: '1.2em', lineHeight: '1.4' }}>{currentQuestion.text}</p>
                </div>
            </PixelCard>

            {/* Options */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                {currentQuestion.options.map((opt, idx) => (
                    <PixelButton
                        key={idx}
                        onClick={() => handleSelectAnswer(opt)}
                        variant="primary"
                        style={{ fontSize: '0.9em' }}
                    >
                        {opt}
                    </PixelButton>
                ))}
            </div>
        </div>
    );
};

export default GameScreen;
