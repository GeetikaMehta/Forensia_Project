import { Star } from 'lucide-react';
import b12Video from "../assets/videos/b14.mp4";

const FeedbackPage = () => {
  const feedbacks = [
    {
      id: 1,
      name: "Geetika Mehta",
      feedback: "The emotion detection system is incredibly accurate! It helped us solve a complex case within days.",
      rating: 5,
      date: "2025-05-15"
    },
    {
      id: 2,
      name: "Jasneet Arora",
      feedback: "Great tool for investigations. The real-time analysis feature is particularly useful.",
      rating: 4,
      date: "2025-05-14"
    },
    {
      id: 3,
      name: "Kashvi Sharma",
      feedback: "The interface is intuitive and the results are very detailed. Excellent work!",
      rating: 5,
      date: "2025-05-13"
    },
    {
      id: 4,
      name: "Lalit Mehta",
      feedback: "Outstanding tool for behavioral analysis. The AI insights are spot-on!",
      rating: 5,
      date: "2025-05-12"
    },
    {
      id: 5,
      name: "Navjot Kaur",
      feedback: "Very impressed with the accuracy and speed of analysis. Highly recommended!",
      rating: 4,
      date: "2025-05-11"
    }
  ];

  return (
    <div className="relative min-h-screen bg-black text-white">
      {/* Background Video */}
      <div className="fixed inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute w-full h-full object-cover"
        >
          <source src={b12Video} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/70"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
            What Our Users Say
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto mb-6"></div>
          <p className="text-gray-300 text-lg">
            Discover what investigators and analysts think about Forensia
          </p>
        </div>

        {/* Feedback Cards Container */}
        <div className="overflow-x-auto pb-6">
          <div className="flex space-x-6 min-w-max">
            {feedbacks.map((feedback) => (
              <div
                key={feedback.id}
                className="w-96 bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-sm 
                         border border-gray-700/50 rounded-xl p-6 transform hover:scale-105 
                         transition-all duration-300 hover:border-purple-500/50"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 
                               flex items-center justify-center text-xl font-bold">
                    {feedback.name[0]}
                  </div>
                  <div className="ml-4">
                    <h3 className="font-semibold text-lg">{feedback.name}</h3>
                    <div className="flex items-center">
                      {[...Array(feedback.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-300 mb-4">{feedback.feedback}</p>
                <div className="text-sm text-gray-400">{feedback.date}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackPage; 