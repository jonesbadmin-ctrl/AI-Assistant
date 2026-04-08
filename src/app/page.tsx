import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="NexBot AI"
            width={40}
            height={40}
            className="w-10 h-10"
          />
          <span className="text-white font-bold text-xl">NexBot AI</span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="#features" className="text-gray-300 hover:text-white transition">
            Features
          </Link>
          <Link href="#about" className="text-gray-300 hover:text-white transition">
            About
          </Link>
          <Link
            href="/login"
            className="text-gray-300 hover:text-white transition"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-full font-medium hover:opacity-90 transition"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-8 py-20 max-w-7xl mx-auto">
        <div className="text-center">
          <div className="flex justify-center mb-8">
            <Image
              src="/logo.png"
              alt="NexBot AI"
              width={120}
              height={120}
              className="w-28 h-28 sm:w-32 sm:h-32"
              priority
            />
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6">
            Build Your Own{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              AI Agents
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
            Create, customize, and deploy intelligent AI assistants tailored to your needs. 
            Powered by OpenAI and Groq for blazing-fast responses.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/register"
              className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-full font-semibold text-lg hover:opacity-90 transition"
            >
              Start Building Free
            </Link>
            <Link
              href="/login"
              className="px-8 py-3 border border-gray-600 text-white rounded-full font-semibold text-lg hover:bg-gray-800 transition"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-8 py-20 bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-white text-center mb-4">
            What You Can Build
          </h2>
          <p className="text-gray-400 text-center mb-16 max-w-2xl mx-auto">
            Powerful features to create AI assistants that fit your needs
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8 hover:border-cyan-500/50 transition">
              <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Custom Chatbots</h3>
              <p className="text-gray-400">
                Design AI assistants with custom prompts, personalities, and behaviors tailored to your use case.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8 hover:border-purple-500/50 transition">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Multi-Provider Support</h3>
              <p className="text-gray-400">
                Switch between OpenAI and Groq models. Use your own API keys or our system defaults.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8 hover:border-cyan-500/50 transition">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Conversation History</h3>
              <p className="text-gray-400">
                All conversations are saved and searchable. Pick up where you left off anytime.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8 hover:border-purple-500/50 transition">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-red-600 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Secure & Private</h3>
              <p className="text-gray-400">
                Your data stays yours. User authentication keeps your agents and conversations private.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8 hover:border-cyan-500/50 transition">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-cyan-600 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Easy Configuration</h3>
              <p className="text-gray-400">
                No coding needed. Point and click to create and configure your AI agents.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8 hover:border-purple-500/50 transition">
              <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Modern Dashboard</h3>
              <p className="text-gray-400">
                Beautiful, responsive interface that works on desktop and mobile devices.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Supported Models */}
      <section className="px-8 py-16">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-8">Supported AI Models</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <span className="px-4 py-2 bg-gray-800 text-gray-300 rounded-full border border-gray-700">
              GPT-4o
            </span>
            <span className="px-4 py-2 bg-gray-800 text-gray-300 rounded-full border border-gray-700">
              GPT-4o Mini
            </span>
            <span className="px-4 py-2 bg-gray-800 text-gray-300 rounded-full border border-gray-700">
              GPT-4 Turbo
            </span>
            <span className="px-4 py-2 bg-gray-800 text-gray-300 rounded-full border border-gray-700">
              GPT-3.5 Turbo
            </span>
            <span className="px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-white rounded-full border border-cyan-500/30">
              Llama 3.3 70B
            </span>
            <span className="px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-white rounded-full border border-cyan-500/30">
              Llama 3.1 8B
            </span>
            <span className="px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-white rounded-full border border-cyan-500/30">
              Mixtral 8x7B
            </span>
            <span className="px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-white rounded-full border border-cyan-500/30">
              Gemma 2 9B
            </span>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="px-8 py-20 bg-gray-900/50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">About NexBot AI</h2>
          <p className="text-gray-400 text-lg leading-relaxed mb-8">
            NexBot AI is an open-source platform for building and deploying custom AI assistants. 
            Whether you're a developer looking to create AI-powered applications or a business 
            needing custom chatbots, NexBot provides the tools you need.
          </p>
          <p className="text-gray-400 text-lg leading-relaxed">
            Built with modern technologies including Next.js, Prisma, and powered by 
            industry-leading LLM providers. Deploy locally or scale to the cloud.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-8 py-20">
        <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-cyan-900/30 to-purple-900/30 rounded-3xl p-12 border border-gray-700">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Build Your AI?</h2>
          <p className="text-gray-400 text-lg mb-8">
            Start creating custom AI assistants today. Free to get started.
          </p>
          <Link
            href="/register"
            className="inline-block px-8 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-full font-semibold text-lg hover:opacity-90 transition"
          >
            Get Started Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-8 py-8 border-t border-gray-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="NexBot AI"
              width={24}
              height={24}
              className="w-6 h-6"
            />
            <span className="text-gray-500">© 2026 NexBot AI. All rights reserved.</span>
          </div>
          <div className="flex gap-6">
            <Link href="#" className="text-gray-500 hover:text-white transition">
              Privacy
            </Link>
            <Link href="#" className="text-gray-500 hover:text-white transition">
              Terms
            </Link>
            <Link href="#" className="text-gray-500 hover:text-white transition">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}