import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { Sparkles, ArrowRight, Zap } from 'lucide-react';

interface HeroPromptInterfaceProps {
  onSubmit?: (prompt: string) => void;
}

export const HeroPromptInterface: React.FC<HeroPromptInterfaceProps> = ({ onSubmit }) => {
  const [prompt, setPrompt] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const borderRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const sparkleRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!containerRef.current || !borderRef.current || !glowRef.current) return;

    // Create timeline for lighting effects
    const tl = gsap.timeline({ repeat: -1 });

    // Animated border glow effect
    tl.to(borderRef.current, {
      boxShadow: '0 0 30px rgba(147, 51, 234, 0.6), 0 0 60px rgba(147, 51, 234, 0.3)',
      duration: 2,
      ease: 'power2.inOut'
    })
    .to(borderRef.current, {
      boxShadow: '0 0 20px rgba(59, 130, 246, 0.4), 0 0 40px rgba(59, 130, 246, 0.2)',
      duration: 2,
      ease: 'power2.inOut'
    })
    .to(borderRef.current, {
      boxShadow: '0 0 25px rgba(147, 51, 234, 0.5), 0 0 50px rgba(147, 51, 234, 0.25)',
      duration: 2,
      ease: 'power2.inOut'
    });

    // Pulsing glow background
    gsap.to(glowRef.current, {
      opacity: 0.3,
      scale: 1.05,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: 'power2.inOut'
    });

    // Sparkle animations
    sparkleRefs.current.forEach((sparkle, index) => {
      if (sparkle) {
        gsap.set(sparkle, {
          opacity: 0,
          scale: 0,
          rotation: Math.random() * 360
        });

        gsap.to(sparkle, {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          delay: index * 0.3,
          repeat: -1,
          repeatDelay: 4,
          yoyo: true,
          ease: 'back.out(1.7)'
        });

        gsap.to(sparkle, {
          rotation: '+=360',
          duration: 8,
          repeat: -1,
          ease: 'none'
        });
      }
    });

    return () => {
      tl.kill();
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && onSubmit) {
      onSubmit(prompt.trim());
      // Add submission animation
      gsap.to(containerRef.current, {
        scale: 0.98,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: 'power2.inOut'
      });
    }
  };

  const handleFocus = () => {
    gsap.to(borderRef.current, {
      boxShadow: '0 0 40px rgba(147, 51, 234, 0.8), 0 0 80px rgba(147, 51, 234, 0.4)',
      duration: 0.3,
      ease: 'power2.out'
    });
  };

  const handleBlur = () => {
    gsap.to(borderRef.current, {
      boxShadow: '0 0 25px rgba(147, 51, 234, 0.5), 0 0 50px rgba(147, 51, 234, 0.25)',
      duration: 0.3,
      ease: 'power2.out'
    });
  };

  return (
    <div ref={containerRef} className="relative max-w-4xl mx-auto">
      {/* Background glow */}
      <div
        ref={glowRef}
        className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-2xl blur-xl"
      />
      
      {/* Sparkle effects */}
      <div
        ref={(el) => sparkleRefs.current[0] = el}
        className="absolute -top-4 -left-4 w-8 h-8 text-yellow-400"
      >
        <Sparkles className="w-full h-full" />
      </div>
      <div
        ref={(el) => sparkleRefs.current[1] = el}
        className="absolute -top-2 right-8 w-6 h-6 text-purple-400"
      >
        <Zap className="w-full h-full" />
      </div>
      <div
        ref={(el) => sparkleRefs.current[2] = el}
        className="absolute -bottom-4 -right-4 w-8 h-8 text-blue-400"
      >
        <Sparkles className="w-full h-full" />
      </div>
      <div
        ref={(el) => sparkleRefs.current[3] = el}
        className="absolute bottom-2 left-12 w-5 h-5 text-pink-400"
      >
        <Zap className="w-full h-full" />
      </div>

      {/* Main interface */}
      <div
        ref={borderRef}
        className="relative bg-white/95 backdrop-blur-sm rounded-2xl p-8 border border-purple-200"
        style={{
          boxShadow: '0 0 25px rgba(147, 51, 234, 0.5), 0 0 50px rgba(147, 51, 234, 0.25)'
        }}
      >
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            What would you like to automate?
          </h3>
          <p className="text-gray-600">
            Describe any web task in natural language and watch AI make it happen
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onFocus={handleFocus}
              onBlur={handleBlur}
              placeholder="e.g., 'Search for wireless headphones under $100 on Amazon and compare the top 5 results' or 'Find and save contact information for tech startups in San Francisco'"
              rows={4}
              className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 focus:outline-none resize-none transition-all duration-200 placeholder-gray-400"
            />
            <div className="absolute bottom-4 right-4 text-gray-400">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>AI Agent Ready</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-yellow-500" />
                <span>GPT-OSS 20B</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={!prompt.trim()}
              className="flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 shadow-lg font-semibold"
            >
              <span>Automate This</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </form>

        <div className="mt-6 flex flex-wrap gap-2 justify-center">
          {[
            'Extract product data',
            'Social media automation',
            'Form filling',
            'Data scraping',
            'Price monitoring'
          ].map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => setPrompt(suggestion)}
              className="px-4 py-2 text-sm bg-gray-100 hover:bg-purple-100 text-gray-700 hover:text-purple-700 rounded-full transition-colors duration-200"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};