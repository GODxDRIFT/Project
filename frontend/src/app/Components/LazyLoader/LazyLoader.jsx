// components/LazyLoader.jsx
import { useInView } from 'react-intersection-observer';
import { useState, useEffect } from 'react';

const LazyLoader = ({ children, items = [], loadMoreCount = 10 }) => {
  const [visibleCount, setVisibleCount] = useState(loadMoreCount);
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView) setVisibleCount((prev) => prev + loadMoreCount);
  }, [inView]);

  return (
    <>
      {items.slice(0, visibleCount).map((item, index) => children(item, index))}
      <div ref={ref} style={{ height: 1 }} />
    </>
  );
};

export default LazyLoader;
