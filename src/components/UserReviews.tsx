import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { Star, Quote } from 'lucide-react';

interface Review {
  id: number;
  name: string;
  role: string;
  company: string;
  rating: number;
  text: string;
  avatar: string;
}

const reviews: Review[] = [
  {
    id: 1,
    name: "Sarah Chen",
    role: "Marketing Director",
    company: "TechFlow Inc",
    rating: 5,
    text: "This AI browser automation tool has revolutionized our workflow. What used to take hours of manual work now happens in minutes. The accuracy is incredible!",
    avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop"
  },
  {
    id: 2,
    name: "Marcus Rodriguez",
    role: "E-commerce Manager",
    company: "ShopSmart",
    rating: 5,
    text: "I've tried many automation tools, but none come close to this. The natural language processing is phenomenal - it understands exactly what I want to accomplish.",
    avatar: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop"
  },
  {
    id: 3,
    name: "Emily Watson",
    role: "Data Analyst",
    company: "InsightCorp",
    rating: 5,
    text: "The time savings are unreal. I can now focus on analyzing data instead of spending hours collecting it. This tool has made me 10x more productive.",
    avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop"
  },
  {
    id: 4,
    name: "David Kim",
    role: "Operations Lead",
    company: "AutoScale",
    rating: 5,
    text: "Incredible reliability and accuracy. We've automated our entire lead generation process and seen a 300% increase in qualified prospects.",
    avatar: "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop"
  },
  {
    id: 5,
    name: "Lisa Thompson",
    role: "Digital Strategist",
    company: "GrowthLab",
    rating: 5,
    text: "The AI understands context better than any tool I've used. It's like having a super-intelligent assistant that never makes mistakes.",
    avatar: "https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop"
  }
];

export const UserReviews: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const reviewRefs = useRef<(HTMLDivElement | null)[]>([]);
  const currentIndex = useRef(0);

  useEffect(() => {
    if (!containerRef.current || reviewRefs.current.length === 0) return;

    // Set initial positions - hide all except first
    reviewRefs.current.forEach((review, index) => {
      if (review) {
        gsap.set(review, {
          opacity: index === 0 ? 1 : 0,
          y: index === 0 ? 0 : 50,
          scale: index === 0 ? 1 : 0.9
        });
      }
    });

    // Create looping animation
    const createLoop = () => {
      const tl = gsap.timeline({
        repeat: -1,
        repeatDelay: 1
      });

      reviews.forEach((_, index) => {
        const nextIndex = (index + 1) % reviews.length;
        
        tl.to(reviewRefs.current[index], {
          opacity: 0,
          y: -30,
          scale: 0.9,
          duration: 0.8,
          ease: 'power2.inOut'
        }, index * 4 + 3)
        .to(reviewRefs.current[nextIndex], {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: 'power2.out'
        }, index * 4 + 3.2);
      });

      return tl;
    };

    const loopAnimation = createLoop();

    // Add entrance animation
    gsap.fromTo(containerRef.current, 
      { opacity: 0, y: 50 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      }
    );

    return () => {
      loopAnimation.kill();
    };
  }, []);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-5 h-5 ${
          index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <section ref={containerRef} className="px-6 py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Loved by Thousands of Users
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            See what our users are saying about their automation success stories
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-100/50 to-blue-100/50 rounded-3xl blur-3xl"></div>
          
          {/* Reviews container */}
          <div className="relative bg-white rounded-2xl shadow-2xl p-8 md:p-12 min-h-[400px] flex items-center">
            <Quote className="absolute top-8 left-8 w-12 h-12 text-purple-200" />
            <Quote className="absolute bottom-8 right-8 w-12 h-12 text-blue-200 rotate-180" />
            
            {reviews.map((review, index) => (
              <div
                key={review.id}
                ref={(el) => reviewRefs.current[index] = el}
                className="absolute inset-8 flex flex-col justify-center"
              >
                <div className="text-center">
                  <div className="flex justify-center mb-6">
                    {renderStars(review.rating)}
                  </div>
                  
                  <blockquote className="text-xl md:text-2xl text-gray-700 leading-relaxed mb-8 font-medium">
                    "{review.text}"
                  </blockquote>
                  
                  <div className="flex items-center justify-center space-x-4">
                    <img
                      src={review.avatar}
                      alt={review.name}
                      className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-lg"
                    />
                    <div className="text-left">
                      <div className="font-semibold text-gray-900 text-lg">
                        {review.name}
                      </div>
                      <div className="text-gray-600">
                        {review.role}
                      </div>
                      <div className="text-purple-600 font-medium">
                        {review.company}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Progress indicators */}
          <div className="flex justify-center mt-8 space-x-2">
            {reviews.map((_, index) => (
              <div
                key={index}
                className="w-2 h-2 rounded-full bg-gray-300 transition-colors duration-300"
                style={{
                  animationDelay: `${index * 4}s`,
                  animation: 'reviewProgress 20s infinite'
                }}
              />
            ))}
          </div>
        </div>

        {/* Stats section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 text-center">
          <div>
            <div className="text-3xl font-bold text-purple-600 mb-2">10,000+</div>
            <div className="text-gray-600">Happy Users</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-blue-600 mb-2">4.9/5</div>
            <div className="text-gray-600">Average Rating</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-green-600 mb-2">1M+</div>
            <div className="text-gray-600">Tasks Automated</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-orange-600 mb-2">99.9%</div>
            <div className="text-gray-600">Uptime</div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes reviewProgress {
          0%, 15% { background-color: #9333ea; }
          20%, 100% { background-color: #d1d5db; }
        }
      `}</style>
    </section>
  );
};