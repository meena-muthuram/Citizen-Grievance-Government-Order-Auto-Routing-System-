import React from 'react';
import stateEmblemImg from '../assets/images/indian_state_emblem_1788972806058.jpg';

interface EmblemProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
  theme?: 'dark' | 'light';
  hideHindi?: boolean;
  highlightGovOfIndia?: boolean;
  useImage?: boolean;
}

export const EmblemOfIndia: React.FC<EmblemProps> = ({
  size = 'md',
  showText = true,
  className = '',
  theme = 'light',
  hideHindi = false,
  highlightGovOfIndia = false,
  useImage = true,
}) => {
  const sizeMap = {
    sm: { icon: 'w-8 h-10', imgSize: 'w-8 h-10', text: 'text-xs', motto: 'text-[9px]' },
    md: { icon: 'w-12 h-14', imgSize: 'w-12 h-14', text: 'text-sm', motto: 'text-[10px]' },
    lg: { icon: 'w-16 h-20', imgSize: 'w-16 h-20', text: 'text-base', motto: 'text-xs' },
    xl: { icon: 'w-24 h-28', imgSize: 'w-24 h-28', text: 'text-xl', motto: 'text-sm' },
  };

  const isDark = theme === 'dark';

  return (
    <div className={`flex flex-col items-center text-center ${className}`}>
      {/* State Emblem of India: Visible, clear, authentic representation */}
      <div className={`relative ${sizeMap[size].imgSize} flex items-center justify-center`}>
        {useImage ? (
          <img
            src={stateEmblemImg}
            alt="State Emblem of India - Lion Capital of Ashoka"
            className="w-full h-full object-contain drop-shadow-md rounded-md"
            referrerPolicy="no-referrer"
          />
        ) : (
          <svg
            viewBox="0 0 100 130"
            fill="currentColor"
            className="w-full h-full text-amber-600 drop-shadow-sm"
            aria-label="State Emblem of India"
          >
            {/* Central Lion Head */}
            <path d="M50 12 C44 12 40 16 38 22 C34 22 30 25 30 30 C30 36 34 40 37 43 C37 48 40 52 44 54 L44 58 C41 60 38 64 38 68 C38 72 42 76 50 76 C58 76 62 72 62 68 C62 64 59 60 56 58 L56 54 C60 52 63 48 63 43 C66 40 70 36 70 30 C70 25 66 22 62 22 C60 16 56 12 50 12 Z" />
            <path d="M36 24 C30 24 25 28 24 34 C20 35 18 39 18 43 C18 49 22 53 25 55 C26 60 29 64 33 66 C35 62 37 57 37 52 C33 50 31 46 31 42 C31 38 34 35 37 34 C37 30 37 27 36 24 Z" />
            <path d="M64 24 C70 24 75 28 76 34 C80 35 82 39 82 43 C82 49 78 53 75 55 C74 60 71 64 67 66 C65 62 63 57 63 52 C67 50 69 46 69 42 C69 38 66 35 63 34 C63 30 63 27 64 24 Z" />
            <circle cx="45" cy="32" r="1.8" fill="#fff" />
            <circle cx="55" cy="32" r="1.8" fill="#fff" />
            <path d="M48 38 L52 38 L50 42 Z" fill="#fff" />
            <rect x="20" y="78" width="60" height="12" rx="2" fill="#B45309" />
            <circle cx="50" cy="84" r="5" fill="#1E3A8A" stroke="#fff" strokeWidth="0.8" />
            <circle cx="50" cy="84" r="1.5" fill="#fff" />
            <line x1="50" y1="79" x2="50" y2="89" stroke="#fff" strokeWidth="0.5" />
            <line x1="45" y1="84" x2="55" y2="84" stroke="#fff" strokeWidth="0.5" />
            <path d="M26 82 Q29 80 32 83 Q34 85 36 84 Q34 87 31 87 Q28 87 26 82 Z" fill="#fff" opacity="0.9" />
            <path d="M64 84 Q66 81 70 82 Q73 83 74 86 Q72 87 68 87 Q65 87 64 84 Z" fill="#fff" opacity="0.9" />
            <path d="M25 91 C30 98 40 102 50 102 C60 102 70 98 75 91 L73 95 C68 104 59 108 50 108 C41 108 32 104 27 95 Z" fill="#D97706" />
            <rect x="18" y="109" width="64" height="4" rx="1" fill="#78350F" />
          </svg>
        )}
      </div>

      {showText && (
        <div className="mt-2 flex flex-col items-center">
          {!hideHindi && (
            <>
              {/* National Motto in Devanagari */}
              <span className={`font-serif tracking-widest font-semibold text-amber-800 dark:text-amber-400 ${sizeMap[size].motto}`}>
                सत्यमेव जयते
              </span>
              {/* Bold Letters Top-Centre */}
              <h2 className={`font-extrabold tracking-wider uppercase ${isDark ? 'text-white' : 'text-stone-900'} ${sizeMap[size].text}`}>
                भारत सरकार
              </h2>
            </>
          )}

          {highlightGovOfIndia ? (
            <div className="mt-2 px-5 py-1.5 rounded-lg bg-gradient-to-r from-amber-100 via-amber-200/80 to-amber-100 border-2 border-amber-600/40 shadow-xs">
              <span className="text-lg sm:text-xl md:text-2xl font-black tracking-widest text-stone-900 uppercase inline-block drop-shadow-xs">
                GOVERNMENT OF INDIA
              </span>
            </div>
          ) : (
            <span className={`font-bold tracking-wider uppercase ${isDark ? 'text-stone-300' : 'text-stone-600'} text-[10px]`}>
              GOVERNMENT OF INDIA
            </span>
          )}
        </div>
      )}
    </div>
  );
};
