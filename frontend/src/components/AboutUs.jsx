import { Shield, Target, Zap, Users, Globe, TrendingUp } from 'lucide-react'

function AboutUs() {
  return (
    <div className="min-h-screen py-12 lg:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center mb-6">
            <div className="w-20 h-20 bg-gray-900 border border-gray-800 rounded-2xl flex items-center justify-center">
              <Shield className="w-12 h-12 text-yellow-500" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-50 mb-4">
            <span className="text-white">Pamrae</span>
            <span className="text-gray-400"> AI</span>
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            AI-Powered Smart Contract Security Scanner
          </p>
        </div>

        <div className="card p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-50 mb-6">About Us</h2>
          
          <div className="space-y-4 text-gray-400">
            <p className="text-base leading-relaxed">
              <span className="text-gray-50 font-medium">Pamrae AI</span> is a leading platform dedicated to 
              democratizing smart contract security and protecting the Web3 ecosystem. We provide comprehensive 
              security analysis tools powered by cutting-edge AI technology.
            </p>
            
            <p className="text-base leading-relaxed">
              Our mission is to make advanced security analysis accessible to everyone—from individual investors 
              to enterprise teams—using state-of-the-art AI technology to detect vulnerabilities, identify rug-pull 
              patterns, and provide actionable security insights in plain English.
            </p>
          </div>
        </div>

        <div className="card p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-50 mb-6 flex items-center gap-3">
            <Target className="w-6 h-6 text-yellow-500" />
            Our Goals & Motivations
          </h2>
          
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gray-900 border border-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Shield className="w-5 h-5 text-gray-400" />
                </div>
                <div>
                  <h4 className="text-gray-50 font-semibold mb-1 text-sm">Protect Users</h4>
                  <p className="text-gray-400 text-sm">
                    Prevent billions in losses from smart contract exploits and rug-pulls by providing 
                    accessible security analysis tools.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gray-900 border border-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Zap className="w-5 h-5 text-gray-400" />
                </div>
                <div>
                  <h4 className="text-gray-50 font-semibold mb-1 text-sm">Democratize Security</h4>
                  <p className="text-gray-400 text-sm">
                    Make professional-grade security analysis available to everyone, not just large 
                    organizations with big budgets.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gray-900 border border-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Globe className="w-5 h-5 text-gray-400" />
                </div>
                <div>
                  <h4 className="text-gray-50 font-semibold mb-1 text-sm">Build Trust in Web3</h4>
                  <p className="text-gray-400 text-sm">
                    Create a safer DeFi ecosystem where users can confidently interact with smart 
                    contracts without fear of losing their funds.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gray-900 border border-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-5 h-5 text-gray-400" />
                </div>
                <div>
                  <h4 className="text-gray-50 font-semibold mb-1 text-sm">Innovate Continuously</h4>
                  <p className="text-gray-400 text-sm">
                    Leverage AI and machine learning to stay ahead of emerging threats and provide 
                    the most comprehensive security analysis.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gray-900 border border-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Users className="w-5 h-5 text-gray-400" />
                </div>
                <div>
                  <h4 className="text-gray-50 font-semibold mb-1 text-sm">Empower Developers</h4>
                  <p className="text-gray-400 text-sm">
                    Help developers build secure contracts from day one with real-time feedback and 
                    comprehensive vulnerability detection.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gray-900 border border-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Target className="w-5 h-5 text-gray-400" />
                </div>
                <div>
                  <h4 className="text-gray-50 font-semibold mb-1 text-sm">Educate & Inform</h4>
                  <p className="text-gray-400 text-sm">
                    Translate complex security findings into simple, actionable insights that anyone 
                    can understand and act upon.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-50 mb-6 flex items-center gap-3">
            <Zap className="w-6 h-6 text-yellow-500" />
            Endless Possibilities
          </h2>
          
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
              <div className="w-10 h-10 bg-gray-900 border border-gray-800 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-5 h-5 text-gray-400" />
              </div>
              <h3 className="text-base font-semibold text-gray-50 mb-3">For Investors</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>• Verify contract safety before investing</li>
                <li>• Get instant risk assessments</li>
                <li>• Track favorite contracts</li>
                <li>• Receive alerts on changes</li>
                <li>• Access historical security data</li>
              </ul>
            </div>
            
            <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
              <div className="w-10 h-10 bg-gray-900 border border-gray-800 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-5 h-5 text-gray-400" />
              </div>
              <h3 className="text-base font-semibold text-gray-50 mb-3">For Developers</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>• Scan contracts during development</li>
                <li>• Integrate into CI/CD pipelines</li>
                <li>• Get real-time security feedback</li>
                <li>• Use custom security rules</li>
                <li>• Access VS Code extension</li>
                <li>• Generate audit-ready reports</li>
              </ul>
            </div>
            
            <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
              <div className="w-10 h-10 bg-gray-900 border border-gray-800 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-5 h-5 text-gray-400" />
              </div>
              <h3 className="text-base font-semibold text-gray-50 mb-3">For Teams</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>• Collaborate on security reviews</li>
                <li>• Share scans with team members</li>
                <li>• Track team scan history</li>
                <li>• Set up webhook notifications</li>
                <li>• Manage team permissions</li>
                <li>• Enterprise-grade features</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-6 grid sm:grid-cols-2 gap-6">
            <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
              <h3 className="text-base font-semibold text-gray-50 mb-3">For Security Auditors</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>• Preliminary analysis tool</li>
                <li>• Batch scan multiple contracts</li>
                <li>• Compare contract versions</li>
                <li>• Generate professional PDF reports</li>
                <li>• ML-powered risk predictions</li>
              </ul>
            </div>
            
            <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
              <h3 className="text-base font-semibold text-gray-50 mb-3">For DeFi Protocols</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>• Continuous security monitoring</li>
                <li>• Real-time vulnerability alerts</li>
                <li>• Historical trend analysis</li>
                <li>• API integration for automation</li>
                <li>• Custom rule enforcement</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="card p-8">
          <h2 className="text-2xl font-bold text-gray-50 mb-6">What Makes Pamrae AI Special</h2>
          
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="text-xl">✨</span>
                <div>
                  <h4 className="text-gray-50 font-semibold mb-1 text-sm">AI-Powered Analysis</h4>
                  <p className="text-gray-400 text-sm">
                    Advanced machine learning models trained on thousands of contracts to predict risks 
                    and detect patterns humans might miss.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <span className="text-xl">🚀</span>
                <div>
                  <h4 className="text-gray-50 font-semibold mb-1 text-sm">Lightning Fast</h4>
                  <p className="text-gray-400 text-sm">
                    Get comprehensive security analysis in seconds, not days. No waiting for expensive audits.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <span className="text-xl">🌐</span>
                <div>
                  <h4 className="text-gray-50 font-semibold mb-1 text-sm">Multi-Chain Support</h4>
                  <p className="text-gray-400 text-sm">
                    Analyze contracts on Ethereum, Base, Polygon, Solana, and more. One tool for all chains.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="text-xl">📊</span>
                <div>
                  <h4 className="text-gray-50 font-semibold mb-1 text-sm">Comprehensive Reports</h4>
                  <p className="text-gray-400 text-sm">
                    Professional PDF reports with detailed findings, recommendations, and risk scores.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <span className="text-xl">🔗</span>
                <div>
                  <h4 className="text-gray-50 font-semibold mb-1 text-sm">Seamless Integration</h4>
                  <p className="text-gray-400 text-sm">
                    Browser extensions, VS Code plugins, CI/CD integration, and comprehensive API.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <span className="text-xl">💬</span>
                <div>
                  <h4 className="text-gray-50 font-semibold mb-1 text-sm">Plain English Explanations</h4>
                  <p className="text-gray-400 text-sm">
                    Complex security findings explained in simple terms anyone can understand.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <div className="card p-8 inline-block">
            <h2 className="text-xl font-bold text-gray-50 mb-4">Ready to Secure Your Contracts?</h2>
            <p className="text-gray-400 mb-6 max-w-xl mx-auto text-sm">
              Join thousands of users protecting their investments with Pamrae AI
            </p>
            <a 
              href="#scan" 
              className="btn-primary inline-block"
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
