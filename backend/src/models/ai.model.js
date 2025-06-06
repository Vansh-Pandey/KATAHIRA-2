import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['student', 'tutor'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  translation: String,
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const chatHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User' // assumes you have a User model
  },
  sessionTitle: {
    type: String,
    default: 'Japanese Session'
  },
  messages: [messageSchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const AiChat = mongoose.model('AiChat', chatHistorySchema);

export default AiChat;
