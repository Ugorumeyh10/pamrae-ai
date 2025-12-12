import { Shield, Target, Zap, Users, Globe, TrendingUp } from 'lucide-react'

function AboutUs() {
  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center mb-8">
            <div className="w-24 h-24 bg-white/10 border border-white/20 rounded-2xl flex items-center justify-center glow-effect pulse-glow relative overflow-hidden">
              <div className="absolute inset-0 shimmer"></div>
              <svg 
                width="60" 
                height="60" 
                viewBox="0 0 100 100" 
                className="relative z-10"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{stopColor:"#FFD700", stopOpacity:1}} />
                    <stop offset="50%" style={{stopColor:"#FFA500", stopOpacity:1}} />
                    <stop offset="100%" style={{stopColor:"#FFD700", stopOpacity:1}} />
                  </linearGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
                <ellipse cx="50" cy="50" rx="35" ry="20" fill="url(#goldGradient)" stroke="#FFD700" strokeWidth="2" filter="url(#glow)"/>
                <circle cx="50" cy="50" r="12" fill="#1a1a1a"/>
                <ellipse cx="45" cy="45" rx="4" ry="6" fill="#ffffff" opacity="0.8"/>
              </svg>
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-4">
            <span 
              className="text-5xl font-bold"
              style={{
                background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FFD700 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: 'drop-shadow(0 0 20px rgba(255, 215, 0, 0.5))'
              }}
            >
              P
            </span>
            <span className="text-white">amrae</span>
            <span className="text-gray-300"> AI</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            AI-Powered Smart Contract Security Scanner
          </p>
        </div>

        {/* About Section */}
        <div className="glass-effect rounded-2xl p-8 mb-12 border-glow">
          <h2 className="text-3xl font-bold text-white mb-6 text-glow">About Us</h2>
          
          <div className="space-y-6 text-gray-300">
            <p className="text-lg leading-relaxed">
              <span className="text-white font-semibold">Pamrae AI</span> was founded in <span className="text-white font-semibold">December 2025</span> by 
              <span className="text-white font-semibold"> Ugorume Henry</span> and <span className="text-white font-semibold">Pamela Odunna</span> with a 
              vision to democratize smart contract security and protect the Web3 ecosystem.
            </p>
            
            <p className="text-lg leading-relaxed">
              Our mission is to make advanced security analysis accessible to everyone—from individual investors 
              to enterprise teams—using cutting-edge AI technology to detect vulnerabilities, identify rug-pull 
              patterns, and provide actionable security insights in plain English.
            </p>
          </div>
        </div>

        {/* Founders Section */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="glass-effect rounded-2xl p-6 border-glow card-hover">
            <div className="w-16 h-16 bg-white/10 border border-white/20 rounded-full flex items-center justify-center mb-4 glow-effect">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Ugorume Henry</h3>
            <p className="text-gray-300">Co-Founder & CTO</p>
            <p className="text-gray-400 mt-3 text-sm">
              Leading the technical vision and development of Pamrae AI's security scanning platform.
            </p>
          </div>
          
          <div className="glass-effect rounded-2xl p-6 border-glow card-hover">
            <div className="w-16 h-16 bg-white/10 border border-white/20 rounded-full flex items-center justify-center mb-4 glow-effect">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Pamela Odunna</h3>
            <p className="text-gray-300">Co-Founder & CEO</p>
            <p className="text-gray-400 mt-3 text-sm">
              Driving the mission to make Web3 security accessible and protecting users from scams.
            </p>
          </div>
        </div>

        {/* Goals & Motivations */}
        <div className="glass-effect rounded-2xl p-8 mb-12 border-glow">
          <h2 className="text-3xl font-bold text-white mb-6 text-glow flex items-center gap-3">
            <Target className="w-8 h-8" style={{color: '#FFD700'}} />
            Our Goals & Motivations
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-white/10 border border-white/20 rounded-lg flex items-center justify-center flex-shrink-0 glow-effect">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-2">Protect Users</h4>
                  <p className="text-gray-300 text-sm">
                    Prevent billions in losses from smart contract exploits and rug-pulls by providing 
                    accessible security analysis tools.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-white/10 border border-white/20 rounded-lg flex items-center justify-center flex-shrink-0 glow-effect">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-2">Democratize Security</h4>
                  <p className="text-gray-300 text-sm">
                    Make professional-grade security analysis available to everyone, not just large 
                    organizations with big budgets.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-white/10 border border-white/20 rounded-lg flex items-center justify-center flex-shrink-0 glow-effect">
                  <Globe className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-2">Build Trust in Web3</h4>
                  <p className="text-gray-300 text-sm">
                    Create a safer DeFi ecosystem where users can confidently interact with smart 
                    contracts without fear of losing their funds.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-white/10 border border-white/20 rounded-lg flex items-center justify-center flex-shrink-0 glow-effect">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-2">Innovate Continuously</h4>
                  <p className="text-gray-300 text-sm">
                    Leverage AI and machine learning to stay ahead of emerging threats and provide 
                    the most comprehensive security analysis.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-white/10 border border-white/20 rounded-lg flex items-center justify-center flex-shrink-0 glow-effect">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-2">Empower Developers</h4>
                  <p className="text-gray-300 text-sm">
                    Help developers build secure contracts from day one with real-time feedback and 
                    comprehensive vulnerability detection.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-white/10 border border-white/20 rounded-lg flex items-center justify-center flex-shrink-0 glow-effect">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-2">Educate & Inform</h4>
                  <p className="text-gray-300 text-sm">
                    Translate complex security findings into simple, actionable insights that anyone 
                    can understand and act upon.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Possibilities Section */}
        <div className="glass-effect rounded-2xl p-8 border-glow">
          <h2 className="text-3xl font-bold text-white mb-6 text-glow flex items-center gap-3">
            <Zap className="w-8 h-8" style={{color: '#FFD700'}} />
            Endless Possibilities
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white/5 rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all card-hover">
              <div className="w-12 h-12 bg-white/10 border border-white/20 rounded-lg flex items-center justify-center mb-4 glow-effect">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">For Investors</h3>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>• Verify contract safety before investing</li>
                <li>• Get instant risk assessments</li>
                <li>• Track favorite contracts</li>
                <li>• Receive alerts on changes</li>
                <li>• Access historical security data</li>
              </ul>
            </div>
            
            <div className="bg-white/5 rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all card-hover">
              <div className="w-12 h-12 bg-white/10 border border-white/20 rounded-lg flex items-center justify-center mb-4 glow-effect">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">For Developers</h3>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>• Scan contracts during development</li>
                <li>• Integrate into CI/CD pipelines</li>
                <li>• Get real-time security feedback</li>
                <li>• Use custom security rules</li>
                <li>• Access VS Code extension</li>
                <li>• Generate audit-ready reports</li>
              </ul>
            </div>
            
            <div className="bg-white/5 rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all card-hover">
              <div className="w-12 h-12 bg-white/10 border border-white/20 rounded-lg flex items-center justify-center mb-4 glow-effect">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">For Teams</h3>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>• Collaborate on security reviews</li>
                <li>• Share scans with team members</li>
                <li>• Track team scan history</li>
                <li>• Set up webhook notifications</li>
                <li>• Manage team permissions</li>
                <li>• Enterprise-grade features</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 grid md:grid-cols-2 gap-6">
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-3">For Security Auditors</h3>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>• Preliminary analysis tool</li>
                <li>• Batch scan multiple contracts</li>
                <li>• Compare contract versions</li>
                <li>• Generate professional PDF reports</li>
                <li>• ML-powered risk predictions</li>
              </ul>
            </div>
            
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-3">For DeFi Protocols</h3>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>• Continuous security monitoring</li>
                <li>• Real-time vulnerability alerts</li>
                <li>• Historical trend analysis</li>
                <li>• API integration for automation</li>
                <li>• Custom rule enforcement</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Features Showcase */}
        <div className="mt-12 glass-effect rounded-2xl p-8 border-glow">
          <h2 className="text-3xl font-bold text-white mb-6 text-glow">What Makes Pamrae AI Special</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl" style={{color: '#FFD700'}}>✨</span>
                <div>
                  <h4 className="text-white font-semibold mb-1">AI-Powered Analysis</h4>
                  <p className="text-gray-300 text-sm">
                    Advanced machine learning models trained on thousands of contracts to predict risks 
                    and detect patterns humans might miss.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <span className="text-2xl" style={{color: '#FFD700'}}>🚀</span>
                <div>
                  <h4 className="text-white font-semibold mb-1">Lightning Fast</h4>
                  <p className="text-gray-300 text-sm">
                    Get comprehensive security analysis in seconds, not days. No waiting for expensive audits.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <span className="text-2xl" style={{color: '#FFD700'}}>🌐</span>
                <div>
                  <h4 className="text-white font-semibold mb-1">Multi-Chain Support</h4>
                  <p className="text-gray-300 text-sm">
                    Analyze contracts on Ethereum, Base, Polygon, Solana, and more. One tool for all chains.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl" style={{color: '#FFD700'}}>📊</span>
                <div>
                  <h4 className="text-white font-semibold mb-1">Comprehensive Reports</h4>
                  <p className="text-gray-300 text-sm">
                    Professional PDF reports with detailed findings, recommendations, and risk scores.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <span className="text-2xl" style={{color: '#FFD700'}}>🔗</span>
                <div>
                  <h4 className="text-white font-semibold mb-1">Seamless Integration</h4>
                  <p className="text-gray-300 text-sm">
                    Browser extensions, VS Code plugins, CI/CD integration, and comprehensive API.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <span className="text-2xl" style={{color: '#FFD700'}}>💬</span>
                <div>
                  <h4 className="text-white font-semibold mb-1">Plain English Explanations</h4>
                  <p className="text-gray-300 text-sm">
                    Complex security findings explained in simple terms anyone can understand.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <div className="glass-effect rounded-2xl p-8 border-glow inline-block">
            <h2 className="text-2xl font-bold text-white mb-4">Ready to Secure Your Contracts?</h2>
            <p className="text-gray-300 mb-6 max-w-xl mx-auto">
              Join thousands of users protecting their investments with Pamrae AI
            </p>
            <a 
              href="#scan" 
              className="bg-white text-black px-8 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-all duration-300 inline-block hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]"
            >
              Start Scanning Now
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutUs

