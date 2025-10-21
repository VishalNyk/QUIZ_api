import { API_BASE_URL } from "../config/apiConfig";

export const resilientFetch = async (url, options = {}, retries = 3) => {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        } catch (error) {
            if (i < retries - 1) {
                const delay = Math.pow(2, i) * 1000;
                await new Promise(resolve => setTimeout(resolve, delay));
            } else {
                throw new Error(`Failed to fetch data from ${url} after ${retries} attempts. Error: ${error.message}`);
            }
        }
    }
};

export const quizAPI = {
  getQuestions: (count) => resilientFetch(`${API_BASE_URL}/quiz-session?count=${count}`),
  submitQuiz: (answers) => resilientFetch(`${API_BASE_URL}/quiz-submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(answers),
  }),
};