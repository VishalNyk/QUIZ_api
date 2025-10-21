import React from 'react';
import Button from './Button';

const ResultsScreen = ({ results, restartQuiz }) => (
    <div className="card card-xlarge">
        <h2 className="results-title">Quiz Complete!</h2>

        <div className="score-display" style={{margin: '1rem 0'}}>
            <div className={`score-circle ${results.scorePercentage >= 70 ? 'excellent' : results.scorePercentage >= 50 ? 'good' : 'poor'}`}>
                {results.scorePercentage}%
            </div>
            <div className="score-info">
                <p className="score-text">Score: {results.correctAnswers} / {results.totalQuestions}</p>
                <p className="score-subtext muted">Review the details below to improve.</p>
            </div>
        </div>

        <Button
            onClick={restartQuiz}
            className="btn-full"
        >
            Start New Quiz
        </Button>

        <div className="results-list" style={{marginTop: '1rem'}}>
            {results.detailedResults.map((result, index) => {
                const isCorrect = result.isCorrect;
                const rowClass = isCorrect ? 'result-correct' : 'result-incorrect';

                return (
                    <div key={result.id} className={`result-item ${rowClass}`}>
                        <p className="result-question">{index + 1}. {result.question}</p>

                        <div className="result-options">
                            {result.options.map((option, optionIndex) => {
                                const isUserAnswer = optionIndex === result.userAnswerIndex;
                                const isCorrectAnswer = optionIndex === result.correctAnswerIndex;
                                const optClass = isCorrectAnswer ? 'option-correct' : isUserAnswer && !isCorrect ? 'option-incorrect' : 'option-normal';
                                return (
                                    <div key={optionIndex} className={`option-item ${optClass}`}>
                                        {String.fromCharCode(65 + optionIndex)}. {option}
                                        {isCorrectAnswer && <span className="option-tag"> (Correct)</span>}
                                        {isUserAnswer && !isCorrectAnswer && <span className="option-tag"> (Your Choice)</span>}
                                    </div>
                                );
                            })}
                        </div>

                        <div className="explanation">
                            <div className="explanation-title">Explanation:</div>
                            <div className="explanation-text">{result.explanation}</div>
                        </div>
                    </div>
                );
            })}
        </div>
    </div>
);

export default ResultsScreen;