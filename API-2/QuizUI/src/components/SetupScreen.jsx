import React from 'react';
import Button from './Button';

const SetupScreen = ({ isLoading, questionCount, setQuestionCount, handleStartClick }) => (
    <div className="card card-large setup-container">
        <h1 className="setup-title">MERN Interview Quiz</h1>
        <p className="setup-subtitle">Select the number of questions to start your randomized session.</p>

        <div className="form-group">
            <label htmlFor="count" className="form-label">Number of Questions</label>
            <input
                id="count"
                type="number"
                value={questionCount}
                onChange={(e) => setQuestionCount(e.target.value)}
                min="1"
                max="50"
                className="form-input"
                placeholder="e.g., 10"
                disabled={isLoading}
            />
        </div>

        <Button
            onClick={handleStartClick}
            disabled={isLoading}
            className="btn-full btn-primary"
        >
            {isLoading ? 'Loading...' : 'Start Quiz Session'}
        </Button>
    </div>
);

export default SetupScreen;