import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { quizAPI } from '../utils/api';

// Async thunks
export const fetchQuestions = createAsyncThunk(
  'quiz/fetchQuestions',
  async (count, { rejectWithValue }) => {
    try {
      return await quizAPI.getQuestions(count);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const submitQuiz = createAsyncThunk(
  'quiz/submitQuiz',
  async (submissionPayload, { rejectWithValue }) => {
    try {
      return await quizAPI.submitQuiz(submissionPayload);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  view: 'setup', // 'setup', 'quiz', 'results'
  questions: [],
  userSelections: {},
  questionCount: 5,
  results: null,
  isLoading: false,
  error: null,
};

const quizSlice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {
    setQuestionCount: (state, action) => {
      state.questionCount = action.payload;
    },
    setUserSelection: (state, action) => {
      const { questionId, selectedIndex } = action.payload;
      state.userSelections[questionId] = selectedIndex;
    },
    resetQuiz: (state) => {
      state.view = 'setup';
      state.questions = [];
      state.userSelections = {};
      state.results = null;
      state.error = null;
      state.questionCount = 10;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Questions
      .addCase(fetchQuestions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.questions = [];
        state.userSelections = {};
        state.results = null;
      })
      .addCase(fetchQuestions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.questions = action.payload;
        state.view = 'quiz';
      })
      .addCase(fetchQuestions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Submit Quiz
      .addCase(submitQuiz.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(submitQuiz.fulfilled, (state, action) => {
        state.isLoading = false;
        state.results = action.payload;
        state.view = 'results';
      })
      .addCase(submitQuiz.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { 
  setQuestionCount, 
  setUserSelection, 
  resetQuiz, 
  clearError 
} = quizSlice.actions;

export default quizSlice.reducer;