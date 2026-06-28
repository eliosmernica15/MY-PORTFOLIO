import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Home } from 'lucide-react';
import AdvancedButton from '../components/ui/AdvancedButton';
import SectionHeader from '../components/ui/SectionHeader';

const NotFound: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden z-[1]"
    >
      <div className="text-center relative z-10 max-w-xl">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="status-live mx-auto mb-8 w-fit"
        >
          <span className="status-live-dot" aria-hidden />
          Error 404
        </motion.p>
        <motion.h1
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="text-[8rem] md:text-[11rem] font-black leading-none text-gradient-accent select-none"
          style={{ lineHeight: 0.85 }}
        >
          404
        </motion.h1>
        <SectionHeader
          align="center"
          eyebrow="Page not found"
          title="This route doesn't exist."
          subtitle="The page you're looking for may have moved or never existed. Let's get you back to the portfolio."
          className="!mb-10"
        />
        <div className="flex flex-wrap items-center justify-center gap-4">
          <AdvancedButton variant="primary" size="lg" to="/" icon={<Home size={18} />}>
            Back to Home
          </AdvancedButton>
          <AdvancedButton variant="secondary" size="lg" onClick={() => window.history.back()} icon={<ArrowLeft size={18} />}>
            Go Back
          </AdvancedButton>
        </div>
      </div>
    </motion.div>
  );
};

export default NotFound;
