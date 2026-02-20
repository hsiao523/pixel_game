import React, { useState } from 'react';
import PixelCard from '../components/PixelCard';
import PixelButton from '../components/PixelButton';
import PixelInput from '../components/PixelInput';
import { fetchQuestions } from '../services/api';

const StartScreen = ({ onStart }) => {
    const [id, setId] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleStart = async () => {
        if (!id.trim()) {
            setError('Please enter your ID');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const qCount = import.meta.env.VITE_QUESTION_COUNT || 10;
            const questions = await fetchQuestions(qCount);
            if (!questions || questions.length === 0) {
                throw new Error("No questions loaded");
            }
            onStart(id, questions);
        } catch (err) {
            setError(`Error: ${err.toString()}`);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
            <PixelCard title="WELCOME PLAYER" style={{ maxWidth: '500px', width: '100%' }}>
                <h2>PIXEL QUIZ</h2>
                <p style={{ lineHeight: '1.6', marginBottom: '20px' }}>
                    Enter your ID to challenge the quiz master!<br />
                    Answer correctly to pass.
                </p>

                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '10px', fontSize: '0.8em' }}>PLAYER ID</label>
                    <PixelInput
                        value={id}
                        onChange={(e) => setId(e.target.value)}
                        placeholder="JON_DOE"
                    />
                </div>

                {error && <p style={{ color: 'var(--color-primary)', fontSize: '0.8em' }}>{error}</p>}

                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <PixelButton onClick={handleStart} disabled={loading} variant="secondary" style={{ width: '100%' }}>
                        {loading ? 'LOADING...' : 'INSERT COIN (START)'}
                    </PixelButton>
                </div>
            </PixelCard>
        </div>
    );
};

export default StartScreen;
