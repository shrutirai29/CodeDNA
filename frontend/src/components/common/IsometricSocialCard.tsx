import React from 'react';
import { useDeveloperStore } from '../../store/useDeveloperStore';

export interface SocialItem {
  id: string;
  name: string;
  url: string;
  svgPath: string;
  viewBox: string;
  brandClass?: string;
  color?: string;
}

interface IsometricSocialCardProps {
  orientation?: 'vertical' | 'horizontal';
  compact?: boolean;
  className?: string;
  customItems?: SocialItem[];
  showTitle?: boolean;
}

export const IsometricSocialCard: React.FC<IsometricSocialCardProps> = ({
  orientation = 'vertical',
  compact = false,
  className = '',
  customItems,
  showTitle = false,
}) => {
  const { profile } = useDeveloperStore();

  const defaultItems: SocialItem[] = [
    {
      id: 'github',
      name: 'GitHub',
      url: `https://github.com/${profile?.username || 'shrutirai29'}`,
      viewBox: '0 0 24 24',
      svgPath:
        'M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z',
      brandClass: 'iso-github',
    },
    {
      id: 'twitter',
      name: 'Twitter',
      url: `https://twitter.com/${profile?.username || 'shrutirai29'}`,
      viewBox: '0 0 512 512',
      svgPath:
        'M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z',
      brandClass: 'iso-twitter',
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      url: `https://www.linkedin.com/search/results/all/?keywords=${encodeURIComponent(profile?.name || 'shrutirai29')}`,
      viewBox: '0 0 24 24',
      svgPath:
        'M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76c.92 0 1.66-.74 1.66-1.66 0-.92-.74-1.66-1.66-1.66-.92 0-1.66.74-1.66 1.66 0 .92.74 1.66 1.66 1.66m1.39 9.74v-8.37H5.07v8.37h2.78z',
      brandClass: 'iso-linkedin',
    },
    {
      id: 'instagram',
      name: 'Instagram',
      url: `https://instagram.com/${profile?.username || 'shrutirai29'}`,
      viewBox: '0 0 448 512',
      svgPath:
        'M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z',
      brandClass: 'iso-instagram',
    },
    {
      id: 'facebook',
      name: 'Facebook',
      url: `https://facebook.com/${profile?.username || 'shrutirai29'}`,
      viewBox: '0 0 320 512',
      svgPath:
        'M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z',
      brandClass: 'iso-facebook',
    },
  ];

  const items = customItems || defaultItems;

  return (
    <div
      className={`card iso-card ${orientation === 'horizontal' ? 'horizontal' : ''} ${
        compact ? 'compact' : ''
      } ${className}`}
    >
      {showTitle && (
        <div className="pt-3 px-4 text-center font-mono text-[10px] uppercase tracking-wider font-semibold text-[#64748B] dark:text-[#94A3B8]">
          Developer Orbit
        </div>
      )}
      <ul>
        {items.map((item) => (
          <li
            key={item.id}
            className={`iso-pro ${item.brandClass || ''} ${compact ? 'iso-compact' : ''}`}
            title={`Open ${item.name}`}
          >
            <span />
            <span />
            <span />
            <a
              href={item.url}
              target="_blank"
              rel="noreferrer"
              aria-label={item.name}
            >
              <svg
                viewBox={item.viewBox}
                xmlns="http://www.w3.org/2000/svg"
                className="svg"
              >
                <path d={item.svgPath} />
              </svg>
            </a>
            <div className="text">{item.name}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};
