# 🎌 Kata Hira 2.0

A comprehensive Japanese language learning platform featuring AI-powered tutoring, interactive courses, character practice with stroke order animations, and community support forums. Built with the MERN stack and enhanced with RAG (Retrieval Augmented Generation) for intelligent learning assistance.

**Live Demo:** [KATAHIRA-2](https://katahira2.onrender.com/)

---

## 📋 Table of Contents

- [Features](#-features) 
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [Running the Application](#-running-the-application)
- [Knowledge Base Setup](#-knowledge-base-setup)
- [API Endpoints](#-api-endpoints)
- [Screenshots](#-screenshots)
- [Future Scope](#-future-scope)
- [Contributing](#-contributing) 

---

## ✨ Features

### 🤖 AI-Powered Learning

- **AI Tutor** - Intelligent tutoring system powered by Google Gemini
- **RAG Integration** - Context-aware responses using knowledge base retrieval
- **Personalized Learning** - Adaptive learning paths based on user progress
- **Interactive Q&A** - Real-time answers to Japanese language queries

### 📚 Comprehensive Course System

- **Structured Courses** - JLPT N5 to N1 level courses
- **Progress Tracking** - Monitor your learning journey
- **Quiz System** - Interactive quizzes with instant feedback
- **Practice Papers** - Mock tests and practice exercises
- **Notes System** - Create and manage personal study notes

### ✍️ Character Learning (Kana & Kanji)

- **Learn Kana** - Hiragana and Katakana character introduction
- **Learn Kanji** - Comprehensive Kanji learning system
- **Stroke Order Animations** - 92 animated GIFs for proper character writing
- **Practice Mode** - Interactive practice for both Kana and Kanji
- **Visual Learning** - Animated stroke orders for accurate writing

### 🎮 Interactive Features

- **Games** - Gamified learning experiences
- **Practice Tests** - Timed practice sessions
- **Flashcard System** - Spaced repetition learning
- **Character Recognition** - Test your knowledge

### 💬 Community & Support

- **Forum System** - Ask and answer questions
- **Support Tickets** - Get help from instructors
- **User Profiles** - Track progress and achievements
- **Leaderboards** - Compete with other learners

### 🔐 User Management

- **Authentication** - Secure JWT-based auth system
- **Profile Management** - Customizable user profiles
- **Progress Analytics** - Detailed learning statistics
- **Cloudinary Integration** - Profile picture uploads

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI library
- **Vite** - Lightning-fast build tool
- **Zustand** - Lightweight state management
- **Axios** - Promise-based HTTP client
- **CSS3** - Custom styling and animations
- **React Router** - Client-side routing

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - Elegant MongoDB ODM

### AI & ML
- **Google Gemini API** - Advanced AI language model
- **RAG (Retrieval Augmented Generation)** - Context-aware AI responses
- **Vector Database** - Knowledge base indexing and retrieval

### Cloud Services
- **Cloudinary** - Image and media management
- **MongoDB Atlas** - Cloud database hosting
- **Render** - Application deployment

### Security
- **JWT** - JSON Web Tokens for authentication
- **bcrypt** - Password hashing
- **CORS** - Cross-origin resource sharing
- **Helmet** - Security headers

---

## 📁 Project Structure

```
katahira-2/
│
├── backend/
│   ├── src/
│   │   ├── controllers/           # Request handlers
│   │   │   ├── ai.controller.js        # AI tutoring logic
│   │   │   ├── auth.controller.js      # Authentication
│   │   │   ├── course.controller.js    # Course management
│   │   │   ├── profile.controller.js   # User profiles
│   │   │   └── support.controller.js   # Support system
│   │   │
│   │   ├── lib/                   # Core libraries
│   │   │   ├── cloudinary.js          # Image upload config
│   │   │   ├── db.js                  # Database connection
│   │   │   ├── gemini.js              # Google Gemini AI setup
│   │   │   ├── rag.js                 # RAG implementation
│   │   │   └── utils.js               # Helper functions
│   │   │
│   │   ├── middleware/            # Express middleware
│   │   │   └── auth.middleware.js     # JWT verification
│   │   │
│   │   ├── models/                # Database schemas
│   │   │   ├── ai.model.js            # AI conversation history
│   │   │   ├── course.model.js        # Course data
│   │   │   ├── forumAnswer.model.js   # Forum answers
│   │   │   ├── forumQuestion.model.js # Forum questions
│   │   │   ├── note.model.js          # User notes
│   │   │   ├── practicePaper.model.js # Practice tests
│   │   │   ├── quiz.model.js          # Quiz data
│   │   │   ├── supportQuestion.model.js # Support tickets
│   │   │   └── user.model.js          # User accounts
│   │   │
│   │   ├── routes/                # API endpoints
│   │   │   ├── ai.route.js
│   │   │   ├── auth.route.js
│   │   │   ├── course.route.js
│   │   │   ├── profile.route.js
│   │   │   └── support.route.js
│   │   │
│   │   ├── scripts/               # Utility scripts
│   │   │   ├── data/
│   │   │   │   └── try-n5.txt        # Knowledge base data
│   │   │   └── index-knowledge.js     # Knowledge indexing script
│   │   │
│   │   └── index.js               # Entry point
│   │
│   ├── package.json
│   └── package-lock.json
│
├── frontend/
│   ├── public/
│   │   ├── strokeOrder/           # 92 character stroke animations
│   │   │   ├── あ.gif to ん.gif     # Hiragana (46)
│   │   │   └── ア.gif to ン.gif     # Katakana (46)
│   │   ├── image.png
│   │   ├── logo.svg
│   │   └── vite.svg
│   │
│   ├── src/
│   │   ├── assets/
│   │   │   └── react.svg
│   │   │
│   │   ├── components/            # Reusable components
│   │   │   ├── footer.jsx
│   │   │   ├── Header.jsx
│   │   │   └── Navbar.jsx
│   │   │
│   │   ├── lib/
│   │   │   └── axios.js           # API configuration
│   │   │
│   │   ├── pages/                 # Application pages
│   │   │   ├── About.jsx          # About page
│   │   │   ├── AiTutor.jsx        # AI tutoring interface
│   │   │   ├── Contact.jsx        # Contact form
│   │   │   ├── Courses.jsx        # Course catalog
│   │   │   ├── Games.jsx          # Learning games
│   │   │   ├── Home.jsx           # Dashboard
│   │   │   ├── LandingPage.jsx    # Public landing
│   │   │   ├── LearnKana.jsx      # Kana learning
│   │   │   ├── LearnKanji.jsx     # Kanji learning
│   │   │   ├── Login.jsx          # Authentication
│   │   │   ├── PracticeKana.jsx   # Kana practice
│   │   │   ├── PracticeKanji.jsx  # Kanji practice
│   │   │   ├── Profile.jsx        # User profile
│   │   │   └── Support.jsx        # Support system
│   │   │
│   │   ├── store/                 # Zustand stores
│   │   │   ├── useAiStore.js      # AI state management
│   │   │   ├── useAuthStore.js    # Auth state
│   │   │   ├── useCourseStore.js  # Course state
│   │   │   ├── useProfileStore.js # Profile state
│   │   │   └── useSupportStore.js # Support state
│   │   │
│   │   ├── App.jsx                # Root component
│   │   ├── index.css              # Global styles
│   │   └── main.jsx               # Entry point
│   │
│   ├── .gitignore
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   └── vite.config.js
│
├── .gitignore
├── package-lock.json
├── package.json
└── README.md
```

---

## 📦 Prerequisites

Before you begin, ensure you have the following:

### Required Software
- **Node.js** (v16 or higher)
- **npm** or **yarn** (latest version)
- **MongoDB** (v5.0 or higher, local or Atlas)
- **Git**

### Required Accounts
- **MongoDB Atlas** account (for cloud database)
- **Cloudinary** account (for image storage)
- **Google AI Studio** account (for Gemini API key)

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Vansh-Pandey/KATAHIRA-2.git
cd KATAHIRA-2
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

### 4. Install Root Dependencies (Optional)

```bash
cd ..
npm install
```

---

## 🔐 Environment Variables

### Backend Environment (.env)

Create a `.env` file in the `backend` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/katahira2
# Or MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/katahira2?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your_super_secure_jwt_secret_key_here_minimum_32_characters
JWT_EXPIRES_IN=7d

# Google Gemini AI Configuration
GEMINI_API_KEY=your_google_gemini_api_key_here

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Client Configuration
CLIENT_URL=http://localhost:5173
FRONTEND_URL=http://localhost:5173

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:5000

# RAG Configuration (Optional)
VECTOR_DB_PATH=./data/vector_db
KNOWLEDGE_BASE_PATH=./src/scripts/data/try-n5.txt
```

### Frontend Environment (.env)

Create a `.env` file in the `frontend` directory:

```env
# API Configuration
VITE_API_URL=http://localhost:5000
VITE_API_BASE_URL=http://localhost:5000/api

# Environment
VITE_NODE_ENV=development
```

### Getting API Keys

#### Google Gemini API Key
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated key to `GEMINI_API_KEY`

#### Cloudinary Credentials
1. Sign up at [Cloudinary](https://cloudinary.com/)
2. Go to Dashboard
3. Copy Cloud Name, API Key, and API Secret
4. Add to respective environment variables

#### MongoDB Atlas URI
1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Click "Connect" → "Connect your application"
4. Copy connection string and replace `<password>` with your database password

---

## 🏃 Running the Application

### Development Mode

#### Option 1: Run Backend and Frontend Separately

**Terminal 1 - Start Backend Server:**
```bash
cd backend
npm run dev
# or
npm start
```

**Terminal 2 - Start Frontend Development Server:**
```bash
cd frontend
npm run dev
```

#### Option 2: Run Concurrently (if configured in root package.json)

```bash
npm run dev
```

### Access the Application

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000
- **API Documentation:** http://localhost:5000/api

### Production Build

#### Build Frontend for Production

```bash
cd frontend
npm run build
```

This creates an optimized production build in the `dist` folder.

#### Start Backend in Production Mode

```bash
cd backend
NODE_ENV=production npm start
```

#### Serve Frontend Build

You can serve the frontend build using:
```bash
cd frontend
npm run preview
```

Or deploy the `dist` folder to any static hosting service.

---

## 📚 Knowledge Base Setup

The AI tutor uses RAG (Retrieval Augmented Generation) to provide context-aware responses based on a knowledge base.

### Indexing the Knowledge Base

1. **Prepare your knowledge base data:**
   - Add Japanese language learning content to `backend/src/scripts/data/try-n5.txt`
   - Format: Plain text with clear sections and topics

2. **Run the indexing script:**
```bash
cd backend
node src/scripts/index-knowledge.js
```

3. **Verify indexing:**
   - Check console output for success messages
   - Ensure vector database is created in configured path

### Knowledge Base Format Example

```text
# JLPT N5 Vocabulary

## Greetings
- おはよう (ohayou) - Good morning
- こんにちは (konnichiwa) - Hello
- ありがとう (arigatou) - Thank you

## Basic Grammar
Particle は (wa): Topic marker
Example: 私は学生です (watashi wa gakusei desu) - I am a student
```

---

## 🔌 API Endpoints

### Authentication Routes

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/signup` | Register new user | ❌ |
| POST | `/api/auth/login` | Login user | ❌ |
| POST | `/api/auth/logout` | Logout user | ✅ |
| GET | `/api/auth/check` | Verify auth token | ✅ |
| GET | `/api/auth/me` | Get current user | ✅ |

### Profile Routes

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/profile/:id` | Get user profile | ✅ |
| PUT | `/api/profile/update` | Update profile | ✅ |
| POST | `/api/profile/upload` | Upload profile picture | ✅ |
| GET | `/api/profile/stats` | Get user statistics | ✅ |

### Course Routes

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/courses` | Get all courses | ✅ |
| GET | `/api/courses/:id` | Get course by ID | ✅ |
| POST | `/api/courses` | Create new course | ✅ |
| PUT | `/api/courses/:id` | Update course | ✅ |
| DELETE | `/api/courses/:id` | Delete course | ✅ |
| GET | `/api/courses/:id/progress` | Get course progress | ✅ |
| POST | `/api/courses/:id/enroll` | Enroll in course | ✅ |

### AI Tutor Routes

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/ai/chat` | Send message to AI tutor | ✅ |
| GET | `/api/ai/history` | Get chat history | ✅ |
| DELETE | `/api/ai/history` | Clear chat history | ✅ |
| POST | `/api/ai/feedback` | Submit AI response feedback | ✅ |

### Support Routes

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/support/question` | Create support ticket | ✅ |
| GET | `/api/support/questions` | Get all support tickets | ✅ |
| GET | `/api/support/question/:id` | Get specific ticket | ✅ |
| PUT | `/api/support/question/:id` | Update ticket | ✅ |
| POST | `/api/support/answer/:id` | Answer ticket | ✅ |

### Quiz & Practice Routes

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/quiz/:courseId` | Get quiz for course | ✅ |
| POST | `/api/quiz/submit` | Submit quiz answers | ✅ |
| GET | `/api/practice/:level` | Get practice paper | ✅ |
| POST | `/api/practice/submit` | Submit practice answers | ✅ |

### Forum Routes

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/forum/questions` | Get all forum questions | ✅ |
| POST | `/api/forum/question` | Create forum question | ✅ |
| POST | `/api/forum/answer/:id` | Answer forum question | ✅ |
| PUT | `/api/forum/answer/:id` | Update answer | ✅ |
| DELETE | `/api/forum/question/:id` | Delete question | ✅ |

---

## 📸 Screenshots

<p align="center">
  <img src="https://github.com/user-attachments/assets/7d1773db-289c-4698-93b4-5755a3b6e440" width="400"/>
  <img src="https://github.com/user-attachments/assets/3f563abd-a1f8-4df6-a9c5-3d983287ebb8" width="400"/>
  <img src="https://github.com/user-attachments/assets/7dfa56a8-b12b-455e-927c-d2bb578b22ca" width="400"/>
  <img src="https://github.com/user-attachments/assets/ca878f83-27cf-4679-8649-3946e8bff7dd" width="400"/>
  <br/>
  <img src="https://github.com/user-attachments/assets/599c16c2-55f7-4c98-8740-6003233d2913" width="400"/>
  <img src="https://github.com/user-attachments/assets/9e256bf6-fad8-4f26-886f-0b9692274455" width="400"/>
  <img src="https://github.com/user-attachments/assets/72e8e297-389b-4e33-8e7b-9873bfcad8af" width="400"/>
</p>

---

## 🔮 Future Scope

### 🎯 Enhanced AI Features

#### 1. **Advanced AI Capabilities**
- Voice conversation with AI tutor (speech-to-text and text-to-speech)
- AI-powered pronunciation feedback
- Handwriting recognition for character practice
- Context-aware grammar correction
- Personalized study plan generation
- AI-generated practice exercises
- Sentiment analysis for learning motivation

#### 2. **Improved RAG System**
- Multi-modal RAG (text, images, audio)
- Dynamic knowledge base updates
- User-contributed content integration
- Context window optimization
- Semantic search improvements
- Cross-lingual RAG support

### 📚 Learning Features

#### 3. **Expanded Course Content**
- Full JLPT N5-N1 curriculum
- Business Japanese courses
- Conversational Japanese modules
- Cultural context lessons
- Kanji etymology and mnemonics
- Reading comprehension materials
- Listening practice with native audio
- Speaking practice modules

#### 4. **Advanced Character Learning**
- Animated stroke order for all Kanji (2000+)
- Radical breakdown and analysis
- Similar character comparison tool
- Handwriting practice with feedback
- Character etymology lessons
- Compound word builder
- Character animation speed control
- Left-handed stroke order option

#### 5. **Enhanced Practice System**
- Spaced repetition algorithm (SRS)
- Adaptive difficulty adjustment
- Timed drills and speed tests
- Mock JLPT examinations
- Writing practice grading
- Peer review system
- Practice analytics dashboard
- Custom flashcard creation

### 🎮 Gamification & Engagement

#### 6. **Interactive Games**
- Character matching games
- Speed typing challenges
- Memory card games (神経衰弱)
- Sentence builder puzzles
- Vocabulary battles (multiplayer)
- Story-driven learning adventures
- Daily challenges with rewards
- Seasonal events and tournaments

#### 7. **Achievement System**
- Comprehensive badge system
- Learning streaks tracking
- XP and leveling system
- Skill trees for different aspects
- Milestone celebrations
- Rare achievement collectibles
- Profile showcases
- Title/rank system

### 👥 Social & Community

#### 8. **Enhanced Social Features**
- Study groups and clubs
- Language exchange partnerships
- Live study sessions
- Video chat for practice
- Mentor-student matching
- Community challenges
- User-generated content sharing
- Social learning feed

#### 9. **Forum Enhancements**
- Rich text editor with Japanese input
- Code snippet support for grammar explanations
- File attachments (audio, images)
- Voting and reputation system
- Best answer selection
- Topic tags and categories
- Advanced search and filters
- Notification system

### 📱 Platform Expansion

#### 10. **Mobile Applications**
- React Native iOS app
- React Native Android app
- Offline learning mode
- Push notifications
- Camera-based Kanji recognition
- Widget support for quick practice
- Apple Watch / Wear OS integration
- Tablet-optimized layouts

#### 11. **Progressive Web App (PWA)**
- Offline-first architecture
- Install to home screen
- Background sync
- Push notifications
- App-like experience
- Reduced data usage

### 🔧 Technical Improvements

#### 12. **Performance Optimization**
- Redis caching layer
- CDN integration for static assets
- Database query optimization
- Lazy loading and code splitting
- Service worker implementation
- Image optimization and WebP support
- GraphQL API implementation
- Server-side rendering (SSR)

#### 13. **Advanced Features**
- WebRTC for real-time communication
- WebSocket for live features
- Video streaming for lessons
- PDF generation for study materials
- Calendar integration
- Email digest system
- SMS notifications
- Webhook support for integrations

#### 14. **Analytics & Insights**
- Learning analytics dashboard
- Progress heat maps
- Time spent analysis
- Weakness identification
- Personalized recommendations
- A/B testing framework
- User behavior tracking
- Performance metrics

### 🌍 Accessibility & Localization

#### 15. **Internationalization**
- Multi-language interface (i18n)
- English, Japanese, Chinese, Korean UI
- Right-to-left (RTL) language support
- Regional content adaptation
- Currency and date localization

#### 16. **Accessibility (WCAG 2.1)**
- Screen reader optimization
- Keyboard navigation
- High contrast mode
- Font size adjustability
- Color blind friendly design
- Focus indicators
- ARIA labels and roles
- Alternative text for all images

### 💼 Business Features

#### 17. **Monetization**
- Premium subscription tiers
- One-time course purchases
- In-app purchases for power-ups
- Ad-supported free tier
- Corporate/school licensing
- Affiliate program
- Donation system
- Merchandise store

#### 18. **Admin & Management**
- Comprehensive admin dashboard
- User management system
- Content moderation tools
- Analytics and reporting
- Course creation wizard
- Bulk operations
- Automated backups
- System health monitoring

### 🔒 Security & Privacy

#### 19. **Enhanced Security**
- Two-factor authentication (2FA)
- OAuth integration (Google, Apple, LINE)
- Rate limiting and DDoS protection
- Data encryption at rest
- GDPR compliance tools
- Privacy-focused analytics
- Secure password recovery
- Session management

### 🎨 UI/UX Improvements

#### 20. **Design Enhancements**
- Dark mode / theme switcher
- Customizable color schemes
- Animated transitions
- Micro-interactions
- Loading states and skeletons
- Empty states with illustrations
- Onboarding tutorial
- Guided tours for new features
- Responsive design improvements
- Gesture controls for mobile

---

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### How to Contribute

1. **Fork the repository**
   ```bash
   git clone https://github.com/Vansh-Pandey/KATAHIRA-2.git
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/AmazingFeature
   ```

3. **Make your changes**
   - Write clean, documented code
   - Follow existing code style
   - Add tests if applicable

4. **Commit your changes**
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```

5. **Push to the branch**
   ```bash
   git push origin feature/AmazingFeature
   ```

6. **Open a Pull Request**
   - Describe your changes in detail
   - Reference any related issues
   - Wait for review

### Contribution Guidelines

- **Code Style**: Follow ESLint configuration
- **Commits**: Use conventional commit messages
- **Testing**: Add tests for new features
- **Documentation**: Update README and docs
- **Issues**: Check existing issues before creating new ones
- **Be Respectful**: Follow our Code of Conduct

### Areas for Contribution

- 🐛 Bug fixes
- ✨ New features
- 📝 Documentation improvements
- 🎨 UI/UX enhancements
- 🌍 Translations
- ♿ Accessibility improvements
- 🧪 Test coverage
- 🔧 Performance optimization

---

## 🧪 Testing

### Run Tests

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test

# E2E tests
npm run test:e2e
```

### Test Coverage

```bash
npm run test:coverage
```

---

## 📦 Deployment

### Deploy to Render

1. **Connect your GitHub repository**
2. **Configure environment variables** in Render dashboard
3. **Set build command:**
   ```bash
   cd backend && npm install
   cd ../frontend && npm install && npm run build
   ```
4. **Set start command:**
   ```bash
   cd backend && npm start
   ```

### Deploy to Vercel (Frontend)

```bash
cd frontend
vercel deploy --prod
```

### Deploy to Railway (Backend)

```bash
cd backend
railway up
```

---
 

## 👥 Authors & Contributors

- **Vansh Pandey** - *Creator & Lead Developer* - [github](https://github.com/Vansh-Pandey)

### Special Thanks
- Google Gemini AI team for the powerful AI model
- Cloudinary for media management solutions
- MongoDB team for excellent database tools
- The open-source community

---

## 🙏 Acknowledgments

- **Hiragana & Katakana stroke order GIFs** - Educational resources
- **JLPT test preparation materials** - Study content
- **Japanese language community** - Feedback and support
- **Beta testers** - Early feedback and bug reports
- **Contributors** - All community contributors

---

## 📞 Support & Contact

### Get Help
- 📧 Email: vp0158530@gmail.com   

---

## 🌟 Show Your Support

Give a ⭐️ if this project helped you learn Japanese!

---

## 🗺️ Roadmap

### Q1 2025
- [ ] Voice conversation with AI tutor
- [ ] Mobile app beta release
- [ ] Enhanced stroke order system
- [ ] JLPT N4 course completion

### Q2 2025
- [ ] Multiplayer games launch
- [ ] Study group features
- [ ] Advanced analytics dashboard
- [ ] JLPT N3 course completion

### Q3 2025
- [ ] Handwriting recognition
- [ ] Live video sessions
- [ ] Premium tier launch
- [ ] JLPT N2 course completion

### Q4 2025
- [ ] VR learning experience (experimental)
- [ ] Corporate licensing program
- [ ] Advanced AI features
- [ ] JLPT N1 course completion

---
 

*頑張ってください！(Ganbatte kudasai! - Do your best!)*
