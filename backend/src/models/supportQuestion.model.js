
import mongoose from 'mongoose';
// In supportQuestion.model.js

const answerSchema = new mongoose.Schema({
  authorId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  content: { 
    type: String, 
    required: [true, 'Content is required'] 
  },
  likes: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }],
}, { 
  timestamps: true 
});

const supportQuestionSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: [true, 'Title is required'],
    trim: true,
    maxlength: 200
  },
  content: { 
    type: String, 
    required: [true, 'Content is required'],
    trim: true
  },
  author: { 
    type: String, 
    required: [true, 'Author is required'] 
  },
  tags: {
    type: [String],
    validate: {
      validator: function(tags) {
        return tags.length <= 5;
      },
      message: 'Cannot have more than 5 tags'
    }
  },
  votes: { 
    type: Number, 
    default: 0,
    min: 0
  },
  answers: [answerSchema],
}, { 
  timestamps: true 
});

// Add virtual for answer count
supportQuestionSchema.virtual('answerCount').get(function() {
  return this.answers.length;
});

const SupportQuestion = mongoose.model('SupportQuestion', supportQuestionSchema);
export default SupportQuestion;
