import React from 'react';
import Button from './Button';

const QuizScreen = ({ questions, userSelections, handleSelectOption, handleSubmitQuiz, isLoading }) => {
    const totalQuestions = questions.length;
    const answeredCount = Object.values(userSelections).filter(val => val !== undefined).length;
    const allAnswered = answeredCount === totalQuestions;

    return (
        <div className="card card-large">
            <div className="quiz-header">
                <h2 className="quiz-title">Quiz in Progress</h2>
                <p className="quiz-progress">Progress: <span>{answeredCount} / {totalQuestions}</span> answered</p>
            </div>

            <div className="questions-container">
                {questions.map((q, index) => (
                    <div key={q.id} className="question-item">
                        <p className="question-text">{index + 1}. {q.question}</p>
                        <div className="options-container">
                            {q.options.map((option, optionIndex) => {
                                const isSelected = userSelections[q.id] === optionIndex;
                                return (
                                    <button
                                        key={optionIndex}
                                        onClick={() => handleSelectOption(q.id, optionIndex)}
                                        className={`option-btn ${isSelected ? 'option-selected' : ''}`}>
                                        {String.fromCharCode(65 + optionIndex)}. {option}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            <div className="quiz-footer">
                <Button
                    onClick={handleSubmitQuiz}
                    disabled={isLoading || !allAnswered}
                    className={`btn ${allAnswered && !isLoading ? 'btn-success' : 'btn-gray'}`}
                >
                    {isLoading ? 'Submitting...' : 'Submit Quiz & See Results'}
                </Button>
            </div>
        </div>
    );
};

export default QuizScreen;