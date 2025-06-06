import { useState, useRef } from 'react';
import Header from '../components/header';
import emailjs from '@emailjs/browser';
import { toast, Toaster } from 'react-hot-toast';
import { useNavigate } from "react-router-dom";

const Contact = () => {
  const form = useRef();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sendEmail = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    emailjs.sendForm(
      "service_n0jrzso",
      "template_ur7kx0o",
      form.current,
      "nHgdzW3ASna3qJ37V"
    )
    .then((result) => {
      toast.success('Message sent successfully!');
      form.current.reset();
    }, (error) => {
      toast.error('Failed to send message. Please try again.');
    })
    .finally(() => {
      setIsSubmitting(false);
    });
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-stone-50 text-stone-800">
      {/* Header - fixed at top */}
      <Header />

      {/* Toast notifications */}
      <Toaster position="top-center" />

      {/* Hero section */}
      <section className="w-full flex flex-col items-center justify-center py-12 md:py-20 px-4 bg-gradient-to-b from-stone-50 to-amber-50">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-in">
            Get In Touch
            <br />
            <span className="text-amber-700 text-3xl md:text-4xl">Let's Build Something Together</span>
          </h1>

          <p className="text-lg md:text-xl mb-8 text-stone-600 animate-fade-in animate-delay-1">
            Have a project in mind or want to collaborate? Fill out the form below and I'll get back to you as soon as possible.
          </p>
        </div>
      </section>

      {/* Contact form section */}
      <section className="w-full py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="animate-fade-in">
              <h2 className="text-3xl font-bold mb-6 text-stone-800">
                Contact Information
              </h2>
              <div className="space-y-6 text-stone-600">
                <div className="flex items-start">
                  <div className="text-amber-600 mr-4 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-stone-800">Email</h3>
                    <a href="mailto:vp0158530@gmail.com" className="hover:text-amber-600 transition-colors">vp0158530@gmail.com</a>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="text-amber-600 mr-4 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-stone-800">Location</h3>
                    <p>IIT Mandi, Himachal Pradesh, India</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="text-amber-600 mr-4 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-stone-800">Social</h3>
                    <div className="flex space-x-4 mt-1">
                      <a href="https://github.com/Vansh-Pandey" target="_blank" rel="noopener noreferrer" className="hover:text-amber-600 transition-colors">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                        </svg>
                      </a>
                      <a href="https://www.linkedin.com/in/vansh-pandey-55149831b?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" target="_blank" rel="noopener noreferrer" className="hover:text-amber-600 transition-colors">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="animate-fade-in animate-delay-1">
              <form ref={form} onSubmit={sendEmail} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-stone-700 mb-1">Your Name</label>
                  <input
                    type="text"
                    name="user_name"
                    id="name"
                    required
                    className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-stone-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    name="user_email"
                    id="email"
                    required
                    className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-stone-700 mb-1">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    id="subject"
                    required
                    className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                    placeholder="What's this about?"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-stone-700 mb-1">Message</label>
                  <textarea
                    name="message"
                    id="message"
                    rows="5"
                    required
                    className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                    placeholder="Your message here..."
                  ></textarea>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full px-6 py-3 rounded-lg font-medium text-white transition-all duration-300 ${isSubmitting ? 'bg-amber-400 cursor-not-allowed' : 'bg-amber-600 hover:bg-amber-700 hover:shadow-lg hover:-translate-y-1'}`}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </span>
                    ) : (
                      'Send Message'
                    )}
                  </button>
                </div>
              </form>
            </div>
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
                <a href="mailto:vp0158530@gmail.com" className="hover:text-amber-400 transition-colors">Email</a>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4 text-white">Navigation</h3>
              <ul className="space-y-2">
                <li><button onClick={() => navigate("/")} className="hover:text-amber-400 transition-colors">Home</button></li>
                <li><button onClick={() => navigate("/about")} className="hover:text-amber-400 transition-colors">About</button></li>
                <li><button onClick={() => navigate("/contact")} className="hover:text-amber-400 transition-colors">Contact</button></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4 text-white">Projects</h3>
              <ul className="space-y-2">
                <li><button className="hover:text-amber-400 transition-colors">KataHira</button></li>
                <li><button className="hover:text-amber-400 transition-colors">RC Boat</button></li>
                <li><button className="hover:text-amber-400 transition-colors">Story Generator</button></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4 text-white">Contact</h3>
              <ul className="space-y-2">
                <li><a href="mailto:vp0158530@gmail.com" className="hover:text-amber-400 transition-colors">vp0158530@gmail.com</a></li>
                <li><button className="hover:text-amber-400 transition-colors">IIT Mandi, Himachal Pradesh</button></li>
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

export default Contact;