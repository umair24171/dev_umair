import Image from 'next/image';

/** Shared, font-independent vector identity used by the header and footer. */
export default function Logo({ width = 138, height = 35 }: { width?: number; height?: number }) {
  return <Image src="/logo.svg?v=2" alt="BuildZn" width={width} height={height} unoptimized style={{ display: 'block', width, height, minWidth: width, flexShrink: 0 }}/>;
}
