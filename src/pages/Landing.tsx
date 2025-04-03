import { motion } from 'framer-motion';

interface LandingProps {
  onStartAssessment: () => void;
}

export function Landing({ onStartAssessment }: LandingProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-secondary-50">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-5xl font-bold text-secondary-900 mb-6">
            Your Personal AI Coach
          </h1>
          <p className="text-xl text-secondary-600 mb-8 max-w-2xl mx-auto">
            Get personalized support, guidance, and tools to improve your mental well-being and achieve your goals.
          </p>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onStartAssessment}
            className="btn-primary text-lg px-8 py-4"
          >
            Start Free Assessment
          </motion.button>

          <div className="mt-12 p-6 bg-white rounded-2xl shadow-lg">
            <h2 className="text-2xl font-bold text-secondary-900 mb-4">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <div className="text-4xl mb-4">📝</div>
                <h3 className="font-semibold text-secondary-900 mb-2">Quick Assessment</h3>
                <p className="text-secondary-600">Answer a few questions to help us understand your needs</p>
              </div>
              <div>
                <div className="text-4xl mb-4">🤖</div>
                <h3 className="font-semibold text-secondary-900 mb-2">AI-Powered Support</h3>
                <p className="text-secondary-600">Get personalized guidance from your AI coach</p>
              </div>
              <div>
                <div className="text-4xl mb-4">📈</div>
                <h3 className="font-semibold text-secondary-900 mb-2">Track Progress</h3>
                <p className="text-secondary-600">Monitor your mood and goals over time</p>
              </div>
            </div>
          </div>

          <div className="mt-12 text-sm text-secondary-500">
            <p>Note: This AI coach is designed to support your well-being journey but is not a replacement for professional mental health care.</p>
            <p className="mt-2">If you're experiencing a crisis, please contact emergency services or a mental health professional.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 