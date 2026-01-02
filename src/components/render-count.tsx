'use client';

import { useRendersCount } from 'react-use';

export function RenderCount() {
  const renders = useRendersCount();
  return (
    <pre className="text-destructive font-mono font-bold lining-nums">
      {JSON.stringify(renders, null, 2)}
    </pre>
  );
}
