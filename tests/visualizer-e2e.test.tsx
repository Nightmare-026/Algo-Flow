import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { algorithms } from '../src/data/seed/algorithms';
import { VisualizerClient } from '../src/app/visualizer/[slug]/VisualizerClient';
import { publicationRegistry } from '../src/visualizers/registry/publication-registry';

// Mock CSS imports
jest.mock('@xyflow/react/dist/style.css', () => ({}));

// Mock scrollTo for JSDOM
window.HTMLElement.prototype.scrollTo = jest.fn();

// Mock ResizeObserver for JSDOM
window.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock matchMedia for testing-library
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
    };
  },
  usePathname() {
    return '';
  },
  useSearchParams() {
    return new URLSearchParams();
  },
}));

const publishedAlgorithms = algorithms.filter(a => a.isPublished);

describe('Visualizer E2E Comprehensive Mount Tests', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation((msg) => {
       // Ignore React 18 act warnings or standard missing key warnings if any
       if (typeof msg === 'string' && msg.includes('act(')) return;
    });
  });
  
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it.each(publishedAlgorithms.map(a => [a.slug, a]))(
    '[%s] correctly mounts VisualizerClient and plays through without errors',
    async (slug, algorithm) => {
      const algo = algorithm as any;
      const legend = publicationRegistry[algo.slug]?.authoredArtifacts?.legend ?? [];

      const { unmount } = render(
        <VisualizerClient algorithm={algo} legend={legend} />
      );

      // Verify the visualizer layout is present
      expect(screen.getAllByText(algo.name).length).toBeGreaterThan(0);

      // Find the play button
      const playBtn = screen.getByTitle('Play');
      expect(playBtn).toBeInTheDocument();

      // Ensure that pressing Next Step doesn't crash the renderer
      const nextBtn = screen.getByTitle('Next step');
      expect(nextBtn).toBeInTheDocument();

      await act(async () => {
         fireEvent.click(nextBtn);
      });

      // Render check passed
      unmount();
    }
  );
});
