import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bot, 
  Zap, 
  Shield, 
  Clock, 
  ArrowRight, 
  CheckCircle, 
  Globe, 
  Cpu,
  Play,
  Star
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const handleTryNow = () => {
    navigate('/app');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <header className="relative z-10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-purple-600 rounded-xl">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Agentic Browser</h1>
              <p className="text-sm text-gray-500">Powered by GPT-OSS 20B</p>
            </div>
          </div>
          
          <button
            onClick={handleTryNow}
            className="flex items-center space-x-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            <span className="font-medium">Try Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-purple-100 rounded-full text-purple-700 text-sm font-medium mb-8">
              <Zap className="w-4 h-4" />
              <span>AI-Powered Browser Automation</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Automate Any Website with
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600"> AI Intelligence</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-3xl mx-auto">
              Transform complex web tasks into simple natural language commands. Our AI agent powered by GPT-OSS 20B understands, reasons, and executes browser automation with human-like intelligence.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <button
                onClick={handleTryNow}
                className="flex items-center space-x-3 px-8 py-4 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all duration-200 transform hover:scale-105 shadow-xl text-lg font-semibold"
              >
                <Play className="w-5 h-5" />
                <span>Start Automating</span>
              </button>
              
              <div className="flex items-center space-x-2 text-gray-600">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full border-2 border-white"></div>
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full border-2 border-white"></div>
                  <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full border-2 border-white"></div>
                </div>
                <span className="text-sm">Trusted by 10,000+ users</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-purple-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-blue-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose Agentic Browser?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience the future of web automation with cutting-edge AI technology
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Cpu className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">AI-Powered Intelligence</h3>
              <p className="text-gray-600 leading-relaxed">
                Leverages GPT-OSS 20B for advanced reasoning and decision-making, understanding context like a human would.
              </p>
            </div>
            
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Universal Compatibility</h3>
              <p className="text-gray-600 leading-relaxed">
                Works with any website - from e-commerce platforms to social networks, no custom integrations needed.
              </p>
            </div>
            
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-green-50 to-green-100 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Secure & Reliable</h3>
              <p className="text-gray-600 leading-relaxed">
                Enterprise-grade security with reliable execution, comprehensive logging, and error handling.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="px-6 py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Transform Your Workflow
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Stop spending hours on repetitive web tasks. Let AI handle the complexity while you focus on what matters most.
              </p>
              
              <div className="space-y-4">
                {[
                  'Save 10+ hours per week on manual tasks',
                  'Reduce human errors by 95%',
                  'Scale operations without hiring',
                  'Work 24/7 without breaks'
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700 text-lg">{benefit}</span>
                  </div>
                ))}
              </div>
              
              <button
                onClick={handleTryNow}
                className="mt-8 flex items-center space-x-2 px-8 py-4 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg text-lg font-semibold"
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
            
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                    <Bot className="w-5 h-5 text-purple-600" />
                    <span className="text-gray-700">Search for "wireless headphones" on Amazon</span>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                    <Clock className="w-5 h-5 text-blue-600" />
                    <span className="text-gray-700">Filter by price range $50-$150</span>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-gray-700">Extract top 10 products with ratings</span>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm font-medium text-gray-700">Task completed in 2.3 seconds</span>
                  </div>
                  <div className="text-xs text-gray-500">10 products extracted • 3 screenshots captured</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Automate Your Web Tasks?
          </h2>
          <p className="text-xl text-purple-100 mb-10">
            Join thousands of users who have already transformed their workflow with AI-powered automation.
          </p>
          
          <button
            onClick={handleTryNow}
            className="inline-flex items-center space-x-3 px-10 py-5 bg-white text-purple-600 rounded-xl hover:bg-gray-50 transition-all duration-200 transform hover:scale-105 shadow-xl text-xl font-bold"
          >
            <Play className="w-6 h-6" />
            <span>Start Your Free Trial</span>
          </button>
          
          <p className="text-purple-200 text-sm mt-4">
            No credit card required • Setup in under 2 minutes
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white px-6 py-12">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 bg-purple-600 rounded-xl">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Agentic Browser</h3>
              <p className="text-sm text-gray-400">Powered by GPT-OSS 20B</p>
            </div>
          </div>
          
          <p className="text-gray-400 mb-6">
            Intelligent browser automation for the modern web
          </p>
          
          <div className="border-t border-gray-800 pt-6">
            <p className="text-gray-500 text-sm">
              © 2025 Agentic Browser. Built with cutting-edge AI technology.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};