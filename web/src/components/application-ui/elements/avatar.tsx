import Image from "next/image";
import { cn } from "@/lib/utils";

interface AvatarProps {
  src: string;
  alt?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  shape?: 'circle' | 'rounded';
  className?: string;
}

const sizeClasses = {
  xs: "size-6",
  sm: "size-8",
  md: "size-10",
  lg: "size-12",
  xl: "size-14",
  '2xl': "size-16",
};

const sizePixels = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 48,
  xl: 56,
  '2xl': 64,
};

export default function Avatar({
  src,
  alt = "",
  size = 'md',
  shape = 'circle',
  className
}: AvatarProps) {
  const pixelSize = sizePixels[size];
  return (
    <Image
      alt={alt}
      src={src}
      width={pixelSize}
      height={pixelSize}
      className={cn(
        "inline-block object-cover",
        sizeClasses[size],
        shape === 'circle' ? "rounded-full" : "rounded-md",
        className
      )}
      sizes={`${pixelSize}px`}
    />
  )
}
