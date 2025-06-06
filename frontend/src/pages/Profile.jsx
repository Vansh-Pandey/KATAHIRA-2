import { useEffect, useState } from 'react';
import { useProfileStore } from '../store/useProfileStore';
import { useAuthStore } from '../store/useAuthStore';
import { toast } from 'react-toastify';
import Header from '../components/header';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { profile, fetchProfile, updateProfile, isFetchingProfile, isUpdatingProfile } = useProfileStore();
  const { authUser, logout } = useAuthStore();
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    role: '',
    bio: ''
  });

  // Fetch profile on mount
  useEffect(() => {
    if (authUser) {
      fetchProfile();
    } else {
      navigate('/login');
    }
  }, [authUser, fetchProfile, navigate]);

  // Update form data when profile loads
  useEffect(() => {
    if (profile) {
      setFormData({
        username: profile.username || '',
        email: profile.email || '',
        role: profile.role || 'student',
        bio: profile.bio || ''
      });
    }
  }, [profile]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(formData);
      setEditMode(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!authUser) {
    return null; // or loading spinner
  }

  return (
    <div className="flex flex-col min-h-screen w-full bg-stone-50 text-stone-800">
      <Header />
      
      <main className="flex-grow px-4 py-8 md:py-12 max-w-6xl mx-auto w-full">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-stone-800 mb-2">
              {profile?.username || 'Your Profile'}
            </h1>
            <p className="text-stone-600">
              {profile?.role === 'teacher' ? 'Japanese Instructor' : 'Japanese Learner'}
            </p>
          </div>
          
          <div className="flex gap-3 mt-4 md:mt-0">
            {!editMode ? (
              <button 
                onClick={() => setEditMode(true)}
                className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-full font-medium transition-all duration-300"
              >
                Edit Profile
              </button>
            ) : (
              <>
                <button 
                  onClick={() => setEditMode(false)}
                  className="bg-stone-200 hover:bg-stone-300 text-stone-800 px-6 py-2 rounded-full font-medium transition-all duration-300"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSubmit}
                  disabled={isUpdatingProfile}
                  className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-full font-medium transition-all duration-300 disabled:opacity-70"
                >
                  {isUpdatingProfile ? 'Saving...' : 'Save Changes'}
                </button>
              </>
            )}
            <button 
              onClick={handleLogout}
              className="border border-stone-300 hover:bg-stone-100 text-stone-800 px-6 py-2 rounded-full font-medium transition-all duration-300"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Profile Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-4">
              <div className="flex flex-col items-center mb-6">
                <div className="w-32 h-32 rounded-full bg-amber-100 flex items-center justify-center text-4xl font-bold text-amber-700 mb-4">
                  {profile?.username?.charAt(0).toUpperCase() || 'U'}
                </div>
                
                {editMode ? (
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="w-full text-center text-xl font-bold mb-2 px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                ) : (
                  <h2 className="text-xl font-bold text-center text-stone-800 mb-2">
                    {profile?.username}
                  </h2>
                )}
                
                <p className="text-stone-600 text-center mb-4">
                  {profile?.email}
                </p>
                
                {editMode ? (
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full text-center px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    disabled
                  >
                    <option value="student">Student</option>
                    <option value="teacher">Teacher</option>
                  </select>
                ) : (
                  <span className="inline-block bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium">
                    {profile?.role === 'teacher' ? 'Teacher' : 'Student'}
                  </span>
                )}
              </div>
              
              
              
              <div className="border-t border-stone-200 pt-4 mt-4">
                <h3 className="font-bold text-lg mb-3 text-stone-800">Account Details</h3>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-stone-500">Email</p>
                    <p className="text-stone-800">{profile?.email}</p>
                  </div>
                  
                  
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column - Courses and Activity */}
          <div className="lg:col-span-2 space-y-8">
            {/* Courses Section */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-stone-800">
                  {profile?.role === 'teacher' ? 'Your Courses' : 'Enrolled Courses'}
                </h2>
                <button 
                  onClick={() => navigate(profile?.role === 'teacher' ? '/courses/create' : '/courses')}
                  className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-all duration-300"
                >
                  {profile?.role === 'teacher' ? 'Create New Course' : 'Browse Courses'}
                </button>
              </div>
              
              {profile?.courses?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profile.courses.slice(0, 4).map((course, index) => (
                    <div 
                      key={index}
                      onClick={() => navigate(`/courses/${course._id}`)}
                      className="border border-stone-200 rounded-lg p-4 hover:bg-amber-50 cursor-pointer transition-colors duration-300"
                    >
                      <div className="h-40 bg-stone-100 rounded-md mb-3 flex items-center justify-center text-stone-400">
                        {course.imageUrl ? (
                          <img src={course.imageUrl} alt={course.title} className="h-full w-full object-cover rounded-md" />
                        ) : (
                          <span>Course Image</span>
                        )}
                      </div>
                      <h3 className="font-bold text-stone-800 mb-1">{course.title}</h3>
                      <p className="text-sm text-stone-600 line-clamp-2">{course.description}</p>
                      <div className="flex justify-between items-center mt-3">
                        <span className="text-xs text-stone-500">
                          {profile.role === 'teacher' ? `${course.students?.length || 0} students` : `${course.students?.length || 0} students`}
                        </span>
                        {profile.role !== 'teacher' && (
                          <div className="w-full bg-stone-200 rounded-full h-2">
                            <div 
                              className="bg-amber-600 h-2 rounded-full" 
                              style={{ width: `${course.students?.length || 0} students` }}
                            ></div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-stone-500 mb-4">
                    {profile?.role === 'teacher' 
                      ? "You haven't created any courses yet." 
                      : "You haven't enrolled in any courses yet."}
                  </p>
                  <button 
                    onClick={() => navigate(profile?.role === 'teacher' ? '/courses/create' : '/courses')}
                    className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-full font-medium transition-all duration-300"
                  >
                    {profile?.role === 'teacher' ? 'Create Your First Course' : 'Browse Available Courses'}
                  </button>
                </div>
              )}
              
              {profile?.courses?.length > 4 && (
                <div className="mt-4 text-center">
                  <button 
                    onClick={() => navigate('/courses')}
                    className="text-amber-600 hover:text-amber-700 font-medium"
                  >
                    View all {profile.courses.length} courses →
                  </button>
                </div>
              )}
            </div>
            
            {/* Activity Section */}
            
            
            {/* Stats Section */}
            {/* <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-stone-800 mb-6">Your Learning Stats</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-amber-50 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-amber-700 mb-1">
                    {profile?.stats?.daysStreak || 0}
                  </div>
                  <p className="text-sm text-stone-600">Day streak</p>
                </div>
                
                <div className="bg-amber-50 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-amber-700 mb-1">
                    {profile?.stats?.totalLessons || 0}
                  </div>
                  <p className="text-sm text-stone-600">Lessons completed</p>
                </div>
                
                <div className="bg-amber-50 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-amber-700 mb-1">
                    {profile?.stats?.vocabularyLearned || 0}
                  </div>
                  <p className="text-sm text-stone-600">Words learned</p>
                </div>
                
                <div className="bg-amber-50 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-amber-700 mb-1">
                    {profile?.stats?.kanjiLearned || 0}
                  </div>
                  <p className="text-sm text-stone-600">Kanji mastered</p>
                </div>
              </div>
              
              {profile?.role === 'student' && (
                <div className="mt-6">
                  <h3 className="font-medium text-stone-800 mb-2">Learning Progress</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Hiragana</span>
                        <span>{profile?.stats?.hiraganaProgress || 0}%</span>
                      </div>
                      <div className="w-full bg-stone-200 rounded-full h-2">
                        <div 
                          className="bg-amber-600 h-2 rounded-full" 
                          style={{ width: `${profile?.stats?.hiraganaProgress || 0}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Katakana</span>
                        <span>{profile?.stats?.katakanaProgress || 0}%</span>
                      </div>
                      <div className="w-full bg-stone-200 rounded-full h-2">
                        <div 
                          className="bg-amber-600 h-2 rounded-full" 
                          style={{ width: `${profile?.stats?.katakanaProgress || 0}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>JLPT N5 Kanji</span>
                        <span>{profile?.stats?.jlptN5Progress || 0}%</span>
                      </div>
                      <div className="w-full bg-stone-200 rounded-full h-2">
                        <div 
                          className="bg-amber-600 h-2 rounded-full" 
                          style={{ width: `${profile?.stats?.jlptN5Progress || 0}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div> */}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;