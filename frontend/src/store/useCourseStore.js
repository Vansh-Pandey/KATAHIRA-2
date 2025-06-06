import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-toastify";

export const useCourseStore = create((set) => ({
  courses: [],
  currentCourse: null,
  isLoading: false,

  fetchAllCourses: async () => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get("/courses");
      set({ courses: res.data });
    } catch (err) {
      toast.error("Failed to fetch courses");
      console.error(err);
    } finally {
      set({ isLoading: false });
    }
  },

  fetchCourseById: async (id) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get(`/courses/${id}`);
      set({ currentCourse: res.data });
    } catch (err) {
      toast.error("Failed to load course");
      console.error(err);
    } finally {
      set({ isLoading: false });
    }
  },

  createCourse: async (courseData) => {
    try {
      const res = await axiosInstance.post("/courses", courseData);
      set((state) => ({ courses: [...state.courses, res.data] }));
      toast.success("Course created successfully!");
    } catch (err) {
      toast.error("Error creating course");
      console.error(err);
    }
  },

  enrollInCourse: async (courseId) => {
    try {
      await axiosInstance.post(`/courses/enroll/${courseId}`);
      toast.success("Enrolled successfully!");
      const res = await axiosInstance.get(`/courses/${courseId}`);
      set({ currentCourse: res.data });
    } catch (err) {
      toast.error("Failed to enroll");
      console.error(err);
    }
  },

  addQuiz: async (courseId, quizData) => {
    try {
      const res = await axiosInstance.post(`/courses/${courseId}/quizzes`, quizData);
      toast.success("Quiz added!");
      return res.data.quiz;
    } catch (err) {
      toast.error("Failed to add quiz");
      console.error(err);
    }
  },
  addQuizQuestion: async (courseId, quizId, questionData) => {
    const res = await axiosInstance.post(
      `/courses/${courseId}/quizzes/${quizId}/questions`,
      questionData
    );
    return res.data;
  },
  addQuestion: async (courseId, questionData) => {
    try {
      await axiosInstance.post(`/courses/${courseId}/forum`, questionData);
      toast.success("Question added!");
    } catch (err) {
      toast.error("Failed to add question");
      console.error(err);
    }
  },

  addNote: async (courseId, noteData) => {
    try {
      await axiosInstance.post(`/courses/${courseId}/notes`, noteData);
      toast.success("Note added!");
    } catch (err) {
      toast.error("Failed to add note");
      console.error(err);
    }
  },

  addPracticePaper: async (courseId, paperData) => {
    try {
      await axiosInstance.post(`/courses/${courseId}/practice-papers`, paperData);
      toast.success("Practice Paper added!");
    } catch (err) {
      toast.error("Failed to add practice paper");
      console.error(err);
    }
  },
  addForumAnswer: async (questionId, answerData) => {
    try {
      const res = await axiosInstance.post(`/courses/forum/${questionId}/answers`, answerData);

      toast.success("Answer posted!");

      // Update currentCourse's forum with new answer data
      set((state) => {
        if (!state.currentCourse) return state;

        const updatedForum = state.currentCourse.forum.map((q) =>
          q._id === res.data.question._id ? res.data.question : q
        );

        return {
          currentCourse: {
            ...state.currentCourse,
            forum: updatedForum,
          },
        };
      });
    } catch (err) {
      toast.error("Failed to post answer");
      console.error(err);
    }
  },

}));
