/**
 * NyayaSetu — ScrollToTop
 * Automatically scrolls to page top on every route change.
 * Without this, React Router preserves the previous page's scroll position
 * when navigating, causing pages to appear to open mid-page.
 */

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Use instant scroll (no smooth scroll) for navigation — smooth scroll is
    // fine for in-page anchors but causes a jarring delay on page transitions.
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
};

export default ScrollToTop;
