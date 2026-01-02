import { Minimize2 } from 'lucide-react';
import React from 'react';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';

type ZoomImageProps = React.ComponentProps<typeof Zoom>;

export function ZoomImage(props: ZoomImageProps) {
  return <Zoom IconUnzoom={Minimize2} classDialog="relative" {...props} />;
}
