import { useState } from 'react';
import Header from '../components/header';
import { useAuthStore } from '../store/useAuthStore.js';
import { useNavigate } from "react-router-dom";
import Login from "./Login";

const About = () => {
  const { authUser } = useAuthStore();
  const navigate = useNavigate();
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const openPanel = () => {
    if (authUser) {
      navigate("/home");
    } else {
      setIsPanelOpen(true);
    }
  };

  const closePanel = () => {
    setIsPanelOpen(false);
  };

  // Skills data
  const skills = [
    { name: "Full-Stack Development", level: 90, icon: "💻" },
    { name: "Machine Learning", level: 30, icon: "🤖" },
    { name: "Robotics", level: 55, icon: "🦾" },
    { name: "UI/UX Design", level: 85, icon: "🎨" },
    { name: "Japanese Language", level: 30, icon: "🇯🇵" },
    { name: "Project Management", level: 80, icon: "📊" },
  ];

  // Projects data
  const projects = [
    {
      title: "KataHira - Japanese Learning Platform",
      description: "Interactive platform for mastering Japanese kana and kanji with stroke order recognition and quizzes.",
      technologies: ["React", "Node.js", "GenAI", "MongoDB", "TailWind CSS", "Express"],
      year: "2024"
    },
    {
      title: "RC Boat for Techfest Competition",
      description: "Designed and built a remote-controlled boat with autonomous navigation capabilities for IIT Techfest.",
      technologies: ["ESP 8266", "TeamWork", "CAD"],
      year: "2024"
    },
    {
      title: "AI-Powered Story Generator",
      description: "Web application that generates customized Stories based on user's prompt. Participated in KukuFM Hackathon. Our team secured 4th position in that hackathon",
      technologies: ["React", "FastApi", "NLP", "MongoDb", "GenAi", "Machine Learning", "Python"],
      year: "2025"
    },
    {
      title: "Time Capsule",
      description: "A Time Capsule is a digital platform designed to preserve and share memories, ideas,and messages.",
      technologies: ["Express", "Node", "MongoDb", "React"],
      year: "2024"
    },
    {
      title: "Image Classifier",
      description: "A machine learning model that is used to de-duplicate a set of images and also classifies each type of image on the type of house. Secured 3rd position in Nirman's Hackathon",
      technologies: ["Machine Learning", "Pyhton"],
      year: "2024"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen w-full bg-stone-50 text-stone-800">
      {/* Header - fixed at top */}
      <Header />

      {/* Hero section */}
      <section className="w-full flex flex-col items-center justify-center py-12 md:py-24 px-4 bg-gradient-to-b from-stone-50 to-amber-50">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
            Vansh Pandey
            <br />
            <span className="text-amber-700 text-3xl md:text-4xl">Student • Developer • Innovator</span>
          </h1>

          <p className="text-lg md:text-xl mb-8 text-stone-600 animate-fade-in animate-delay-1">
            Passionate about technology, language learning, and creating solutions that bridge education with innovation.
          </p>

          <div className="flex flex-wrap gap-4 justify-center mb-12 animate-fade-in animate-delay-2">
            <button onClick={() => navigate("/contact")} className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-full font-medium flex items-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              Contact Me <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">→</span>
            </button>
          </div>

        </div>
      </section>

      {/* About section */}
      <section className="w-full py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-stone-800">
                About Me
              </h2>
              <div className="space-y-4 text-stone-600 text-lg">
                <p>
                  I'm a passionate and curious student currently pursuing my studies at IIT Mandi. I thrive at the intersection of technology, creativity, and innovation.
                </p>
                <p>
                  Whether I'm building a remote-controlled boat for a techfest, developing full-stack web applications, or exploring the complexities of machine learning, I love turning ideas into impactful projects.
                </p>
                <p>
                  I'm particularly interested in robotics, AI, and Japanese language learning, and I enjoy combining these interests in unique ways—like designing interactive quiz apps or stroke-order recognition tools.
                </p>
                <p>
                  With a strong foundation in coding, design, and problem-solving, I aim to keep learning, building, and pushing boundaries.
                </p>
              </div>
            </div>
            <div className="flex justify-center animate-fade-in animate-delay-1">
              <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-amber-500 shadow-lg">
                <img
                  src="/image.png"
                  alt="Vansh Pandey"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills section */}
      <section className="w-full py-16 bg-stone-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-stone-800">
            My Skills & Expertise
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {skills.map((skill, index) => (
              <div
                key={index}
                className="p-6 rounded-xl transition-all duration-300 hover-scale bg-white shadow-md hover:shadow-lg border border-stone-100 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-4xl mb-4 text-amber-600">{skill.icon}</div>
                <h3 className="text-xl font-bold mb-4 text-stone-800">{skill.name}</h3>
                <div className="w-full bg-stone-200 rounded-full h-2.5">
                  <div
                    className="bg-amber-600 h-2.5 rounded-full"
                    style={{ width: `${skill.level}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Education section */}
      <section className="w-full py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-stone-800">
            Education & Background
          </h2>

          <div className="max-w-3xl mx-auto">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-4 md:left-1/2 h-full w-0.5 bg-amber-500 transform -translate-x-1/2"></div>

              {/* Timeline items */}
              <div className="space-y-8">
                {/* IIT Mandi */}
                <div className="relative flex items-center justify-between md:justify-start animate-fade-in">
                  <div className="md:w-1/2 md:pr-8 md:text-right">
                    <div className="md:mr-8">
                      <h3 className="text-xl font-bold text-stone-800">Indian Institute of Technology, Mandi</h3>
                      <p className="text-amber-700 font-medium">Bachelor of Technology</p>
                      <p className="text-stone-600">2024 - 2028</p>
                      <p className="text-stone-600 mt-2">Mathematics and Computing</p>
                    </div>
                  </div>
                  <div className="hidden md:block w-8 h-8 rounded-full bg-amber-600 border-4 border-amber-100 mx-4"></div>
                  <div className="md:w-1/2 md:pl-8"></div>
                </div>

                {/* High School */}
                <div className="relative flex items-center justify-between md:justify-start animate-fade-in animate-delay-1">
                  <div className="md:w-1/2 md:pr-8"></div>
                  <div className="hidden md:block w-8 h-8 rounded-full bg-amber-600 border-4 border-amber-100 mx-4"></div>
                  <div className="md:w-1/2 md:pl-8">
                    <div className="md:ml-8">
                      <h3 className="text-xl font-bold text-stone-800">Modern Public School</h3>
                      <p className="text-amber-700 font-medium">Higher Secondary Education</p>
                      {/* <p className="text-stone-600">2014 - 2024</p> */}
                      <p className="text-stone-600 mt-2">Science stream with Computer Science and Mathematics</p>
                    </div>
                  </div>
                </div>

                {/* Japanese Learning */}
                <div className="relative flex items-center justify-between md:justify-start animate-fade-in animate-delay-2">
                  <div className="md:w-1/2 md:pr-8 md:text-right">
                    <div className="md:mr-8">
                      <h3 className="text-xl font-bold text-stone-800">Japanese Language Proficiency</h3>

                      <p className="text-stone-600">Currently Studying</p>
                      <p className="text-stone-600 mt-2">Passionate about Japanese language and culture, working towards JLPT N4 certification</p>
                    </div>
                  </div>
                  <div className="hidden md:block w-8 h-8 rounded-full bg-amber-600 border-4 border-amber-100 mx-4"></div>
                  <div className="md:w-1/2 md:pl-8"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects section */}
      <section className="w-full py-16 bg-stone-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-stone-800">
            Notable Projects
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map((project, index) => (
              <div
                key={index}
                className="p-6 rounded-xl transition-all duration-300 hover-scale bg-white shadow-md hover:shadow-lg border border-stone-100 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-stone-800">{project.title}</h3>
                  <span className="text-sm bg-amber-100 text-amber-800 px-2 py-1 rounded">{project.year}</span>
                </div>
                <p className="text-stone-600 mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, idx) => (
                    <span key={idx} className="text-xs bg-stone-200 text-stone-700 px-2 py-1 rounded">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interests section */}
      <section className="w-full py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-stone-800">
            Beyond Coding
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-xl transition-all duration-300 hover-scale bg-stone-50 shadow-md hover:shadow-lg border border-stone-100 animate-fade-in">
              <div className="text-4xl mb-4 text-amber-600">🇯🇵</div>
              <h3 className="text-xl font-bold mb-2 text-stone-800">Japanese Language</h3>
              <p className="text-stone-600">Passionate about Japanese language and culture. Currently developing tools to make learning Japanese more accessible.</p>
            </div>
            <div className="p-6 rounded-xl transition-all duration-300 hover-scale bg-stone-50 shadow-md hover:shadow-lg border border-stone-100 animate-fade-in animate-delay-1">
              <div className="text-4xl mb-4 text-amber-600">🎸</div>
              <h3 className="text-xl font-bold mb-2 text-stone-800">Drawing</h3>
              <p className="text-stone-600">Passionate about sketching and visual art. I enjoy bringing ideas to life on paper, from abstract concepts to detailed portraits.</p>

            </div>
            <div className="p-6 rounded-xl transition-all duration-300 hover-scale bg-stone-50 shadow-md hover:shadow-lg border border-stone-100 animate-fade-in animate-delay-2">
              <div className="text-4xl mb-4 text-amber-600">📚</div>
              <h3 className="text-xl font-bold mb-2 text-stone-800">Reading</h3>
              <p className="text-stone-600">Love reading about technology, science fiction, and Japanese literature. Always looking for book recommendations!</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="w-full py-16 bg-gradient-to-br from-amber-600 to-amber-700">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-fade-in">
            Want to Connect or Collaborate?
          </h2>
          <p className="text-lg mb-8 animate-fade-in animate-delay-1">
            I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision.
          </p>
          <div className="flex flex-wrap gap-4 justify-center animate-fade-in animate-delay-2">
            <button
              onClick={()=>navigate("/contact")}
              className="bg-white hover:bg-stone-100 text-amber-700 px-8 py-3 rounded-full font-medium text-lg transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            >
              Get In Touch
            </button>
            <a
              href="https://github.com/Vansh-Pandey"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-white hover:border-stone-200 px-8 py-3 rounded-full font-medium text-lg transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            >
              View GitHub
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-12 bg-stone-800 text-stone-300">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="text-2xl font-bold mb-4 text-amber-500">Vansh Pandey</div>
              <p className="mb-4">Building innovative solutions at the intersection of technology and education.</p>
              <div className="flex space-x-4">
                <a href="https://github.com/Vansh-Pandey" className="hover:text-amber-400 transition-colors">GitHub</a>
                <a href="https://www.linkedin.com/in/vansh-pandey-55149831b?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" className="hover:text-amber-400 transition-colors">LinkedIn</a>
           
                <a href="vp0158530@gmail.com" className="hover:text-amber-400 transition-colors">Email</a>
              </div>
            </div>

            

            <div>
              <h3 className="font-bold text-lg mb-4 text-white">Projects</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-amber-400 transition-colors">KataHira</a></li>
                <li><a href="#" className="hover:text-amber-400 transition-colors">RC Boat</a></li>
                <li><a href="#" className="hover:text-amber-400 transition-colors">Story Generator</a></li>
                <li><a href="#" className="hover:text-amber-400 transition-colors">Image Classifier</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4 text-white">Contact</h3>
              <ul className="space-y-2">
                <li><a href="mailto:vp0158530@gmil.com" className="hover:text-amber-400 transition-colors">vp0158530@gmail.com</a></li>
                <li><a href="#" className="hover:text-amber-400 transition-colors">IIT Mandi, Himachal Pradesh</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-stone-700 text-center">
            <p>© {new Date().getFullYear()} Vansh Pandey. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default About;