// src/stores/useSupportStore.jsx
import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';
import { toast } from 'react-toastify';

export const useSupportStore = create((set, get) => ({
  questions: [],
  loading: false,
  error: null,

  // Fetch all questions
  fetchQuestions: async () => {
    try {
      set({ loading: true });
      const { data } = await axiosInstance.get('/support');
      set({
        questions: data.map(q => ({
          ...q,
          answers: q.answers.map(a => ({
            ...a,
            likedByUser: a.likes?.includes(get().authUser?._id) || false,
            likesCount: a.likes?.length || 0
          }))
        })),
        loading: false
      });
    } catch (error) {
      toast.error("Failed to fetch questions", { autoClose: 1000 });
      set({ error: error.message, loading: false });
    }
  },

  // Submit new question
  submitQuestion: async ({ title, content, tags, author }) => {
    try {
      set({ loading: true });



      const { data } = await axiosInstance.post('/support', {
        title,
        content,
        tags,
        author,
      });
      set((state) => ({
        questions: [data, ...state.questions],
        loading: false,
      }));

      toast.success("Question posted successfully!", { autoClose: 1000 });
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to post question", { autoClose: 1000 });
      console.log(error)
      set({ loading: false });
    }
  },

  // Add answer to a question
  submitAnswer: async (questionId, { content, author }) => {
    try {


      const { data } = await axiosInstance.post(`/support/${questionId}/answer`, {
        content,
        authorId: author._id
      });

      set((state) => ({
        questions: state.questions.map(q =>
          q._id === questionId
            ? {
              ...q,
              answers: [
                ...q.answers,
                {
                  ...data,
                  authorId: author,
                  likes: [],
                  likedByUser: false,
                  likesCount: 0
                }
              ]
            }
            : q
        )
      }));

      toast.success("Answer submitted!", { autoClose: 1000 });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit answer", { autoClose: 1000 });
    }
  },

  // Toggle like on an answer
  toggleAnswerLike: async (questionId, answerId) => {
    try {
      const { authUser } = get();
      const { data } = await axiosInstance.post(`/support/${questionId}/answer/${answerId}/like`, {
        userId: authUser._id
      });

      set((state) => ({
        questions: state.questions.map(q => {
          if (q._id === questionId) {
            const updatedAnswers = q.answers.map(a =>
              a._id === answerId ? { ...a, likesCount: data.likes, likedByUser: !a.likedByUser } : a
            );
            return { ...q, answers: updatedAnswers };
          }
          return q;
        })
      }));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to toggle like", { autoClose: 1000 });
    }
  }
}));
