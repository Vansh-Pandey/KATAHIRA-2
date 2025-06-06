import Course from "../models/course.model.js";
import User from "../models/user.model.js";
import Note from "../models/note.model.js";
import ForumQuestion from "../models/forumQuestion.model.js";
import PracticePaper from "../models/practicePaper.model.js";
import Quiz from "../models/quiz.model.js";
import ForumAnswer from "../models/forumAnswer.model.js";
// Create a new course
export const createCourse = async (req, res) => {
  try {
    const { title, description, level, category, coverImage } = req.body;
    const instructor = req.user._id;

    const course = await Course.create({
      title,
      description,
      level,
      category,
      instructor,
      coverImage,
    });

    await User.findByIdAndUpdate(instructor, {
      $push: { createdCourses: course._id },
    });

    res.status(201).json(course);
  } catch (err) {
    res.status(500).json({ message: "Failed to create course", error: err.message });
  }
};

// Get all courses
export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate("instructor", "username email");
    res.status(200).json(courses);
  } catch (err) {
    res.status(500).json({ message: "Error fetching courses", error: err.message });
  }
};

// Get single course by ID
// Get single course by ID (Fully Populated)
export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate("instructor", "username email")
      .populate("students", "username email")
      .populate("quizzes")
      .populate({
  path: "forum",
  populate: [
    {
      path: "author",
      select: "username role",
    },
    {
      path: "answers",
      populate: {
        path: "author",
        model: "User",
        select: "username role"
      }
    }
  ]
})

      .populate({
        path: "practicePapers",
        populate: {
          path: "uploadedBy",
          select: "username role"
        }
      })
      .populate({
        path: "notes",
        populate: {
          path: "author",
          select: "username role"
        }
      });

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json(course);
  } catch (err) {
    res.status(500).json({ message: "Error fetching course", error: err.message });
  }
};



// Enroll a user into a course
export const enrollInCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const userId = req.user._id;

    await Course.findByIdAndUpdate(courseId, { $addToSet: { students: userId } });
    await User.findByIdAndUpdate(userId, { $addToSet: { enrolledCourses: courseId } });

    res.status(200).json({ message: "Enrolled successfully" });
  } catch (err) {
    res.status(500).json({ message: "Enrollment failed", error: err.message });
  }
};

export const addQuizToCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await Course.findById(id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    // 1. Create and save the quiz separately
    const newQuiz = new Quiz({
      ...req.body,
      course: id, // optional: if quiz schema includes course reference
      createdBy: req.user._id,
    });

    await newQuiz.save();

    // 2. Push quiz _id to the course
    course.quizzes.push(newQuiz._id);
    await course.save();

    res.status(200).json({ message: "Quiz added and linked", quiz: newQuiz });

  } catch (err) {
    res.status(500).json({ message: "Failed to add quiz", error: err.message });
  }
};


// Add a question to a specific quiz in a course
export const addForumQuestionToCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user._id; // Assuming auth middleware sets this

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const newQuestion = new ForumQuestion({
      question: req.body.question,
      author: userId,
      course: courseId,
    });

    await newQuestion.save();

    course.forum.push(newQuestion._id);
    await course.save();

    res.status(200).json({ message: "Forum question added", question: newQuestion });
  } catch (err) {
    res.status(500).json({ message: "Failed to add forum question", error: err.message });
  }
};

// Add a note to a course
export const addNoteToCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const userId = req.user._id; // assuming you're using a middleware to attach `req.user`

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const newNote = new Note({
      content: req.body.content,
      course: courseId,
      author: userId,
    });

    await newNote.save();
    course.notes.push(newNote._id);
    await course.save();
    // Optionally: push note._id into course.notes if you want
    // course.notes.push(newNote._id);
    // await course.save();

    res.status(200).json({ message: "Note added successfully", note: newNote });
  } catch (err) {
    res.status(500).json({ message: "Failed to add note", error: err.message });
  }
};

// Add a practice paper to a course
export const addPracticePaperToCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, description, file } = req.body;
    const userId = req.user._id;

    if (!title || !file) {
      return res.status(400).json({ message: "Title and file URL are required" });
    }

    // 1. Ensure course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // 2. Create the practice paper
    const newPaper = new PracticePaper({
      title,
      description,
      fileUrl: file,
      course: courseId,
      uploadedBy: userId,
    });

    await newPaper.save();

    // 3. Link paper to course
    course.practicePapers.push(newPaper._id);
    await course.save();

    res.status(201).json({ message: "Practice paper uploaded and linked", paper: newPaper });

  } catch (err) {
    res.status(500).json({ message: "Failed to upload paper", error: err.message });
  }
};


// Add a forum question to a course

// Add an answer to a specific forum question in a course
export const addAnswerToForumQuestion = async (req, res) => {
  try {
    const { content } = req.body;
    const { questionId } = req.params;

    const answer = new ForumAnswer({
      content,
      question: questionId,
      author: req.user._id, // make sure you’re using auth middleware
    });

    await answer.save();

    // push answer into the ForumQuestion's answers array
    const question = await ForumQuestion.findByIdAndUpdate(
      questionId,
      { $push: { answers: answer._id } },
      { new: true }
    )
      .populate("author", "username")
      .populate({
        path: "answers",
        populate: {
          path: "author",
          select: "username role",
        },
      });

    res.status(201).json({ message: "Answer added", question });
  } catch (error) {
    console.error("Error posting answer", error);
    res.status(500).json({ message: "Failed to post answer" });
  }
};
export const addQuestionToQuiz = async (req, res) => {
  try {
    const { courseId, quizId } = req.params;
    const { question, options, answer, explanation } = req.body;

    // Check if course and quiz exist
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    // Build new question object
    const newQuestion = {
      questionText: question,
      options,
      correctAnswer: answer,
      explanation,
    };

    // Push to the questions array
    quiz.questions.push(newQuestion);
    await quiz.save();

    res.status(200).json({ message: "Question added successfully", quiz });
  } catch (error) {
    res.status(500).json({ message: "Failed to add question", error: error.message });
  }
};
