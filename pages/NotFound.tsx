import React from 'react';
import { ArrowLeft, Home } from 'lucide-react';
import AdvancedButton from '../components/ui/AdvancedButton';
import SectionHeader from '../components/ui/SectionHeader';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden z-[1]">
      <div className="text-center relative z-10 max-w-xl animate-fade-up">
        <p className="status-live mx-auto mb-8 w-fit">
          <span className="status-live-dot" aria-hidden />
          Error 404
        </p>
        <h1
          className="text-[8rem] md:text-[11rem] font-black leading-none text-gradient-accent select-none"
          style={{ lineHeight: 0.85 }}
        >
          404
        </h1>
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
    </div>
  );
};

export default NotFound;
