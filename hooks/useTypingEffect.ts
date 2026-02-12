import { useState, useEffect } from 'react';

export const useTypingEffect = (
  phrases: string[],
  typingSpeed: number = 70,
  deletingSpeed: number = 35,
  pauseTime: number = 2200
): string => {
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const phrase = phrases[currentPhraseIndex];
    let timeout: ReturnType<typeof setTimeout>;

    if (!isDeleting && currentText === phrase) {
      timeout = setTimeout(() => setIsDeleting(true), pauseTime);
    } else if (isDeleting && currentText === '') {
      setIsDeleting(false);
      setCurrentPhraseIndex(prev => (prev + 1) % phrases.length);
    } else {
      timeout = setTimeout(() => {
        setCurrentText(prev => {
          if (isDeleting) {
            return prev.slice(0, -1);
          }
          return phrase.slice(0, prev.length + 1);
        });
      }, isDeleting ? deletingSpeed : typingSpeed);
    }

    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, currentPhraseIndex, phrases, typingSpeed, deletingSpeed, pauseTime]);

  return currentText;
};
