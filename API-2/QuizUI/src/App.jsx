import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import SetupScreen from './components/SetupScreen';
import QuizScreen from './components/QuizScreen';
import ResultsScreen from './components/ResultScreen';
import { 
  setQuestionCount, 
  setUserSelection, 
  resetQuiz,
  fetchQuestions,
  submitQuiz 
} from './redux/quizSlice';
import './App.css';

const App = () => {
  const dispatch = useDispatch();
  const {
    view,
    questions,
    userSelections,
    questionCount,
    results,
    isLoading,
    error
  } = useSelector((state) => state.quiz);

  const handleStartClick = useCallback(() => {
    const count = parseInt(questionCount, 10);
    if (count > 0 && count <= 50) {
      dispatch(fetchQuestions(count));
    } else {
      // You might want to add error handling in Redux for this
      console.error("Please enter a valid number of questions between 1 and 50.");
    }
  }, [dispatch, questionCount]);

  const handleSelectOption = useCallback((questionId, selectedIndex) => {
    dispatch(setUserSelection({ questionId, selectedIndex }));
  }, [dispatch]);

  const handleSubmitQuiz = useCallback(() => {
    const submissionPayload = questions.map(q => ({
      id: q.id,
      selectedOptionIndex: userSelections[q.id] !== undefined ? userSelections[q.id] : -1,
    }));
    dispatch(submitQuiz(submissionPayload));
  }, [dispatch, questions, userSelections]);

  const handleRestartQuiz = useCallback(() => {
    dispatch(resetQuiz());
  }, [dispatch]);

  const handleSetQuestionCount = useCallback((count) => {
    dispatch(setQuestionCount(count));
  }, [dispatch]);

  let content;
  if (error) {
    content = (
      <div className="error-message">
        {error}
      </div>
    );
  } else if (view === 'setup') {
    content = (
      <SetupScreen 
        isLoading={isLoading}
        questionCount={questionCount}
        setQuestionCount={handleSetQuestionCount}
        handleStartClick={handleStartClick}
      />
    );
  } else if (view === 'quiz') {
    content = (
      <QuizScreen 
        questions={questions}
        userSelections={userSelections}
        handleSelectOption={handleSelectOption}
        handleSubmitQuiz={handleSubmitQuiz}
        isLoading={isLoading}
      />
    );
  } else if (view === 'results' && results) {
    content = (
      <ResultsScreen 
        results={results}
        restartQuiz={handleRestartQuiz}
      />
    );
  } else {
    content = <p className="loading-message">Loading App...</p>;
  }

  return (
    <div className="app-container">
      {content}
    </div>
  );
};

export default App;