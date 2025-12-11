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

export default function Avatar({ 
    src, 
    alt = "", 
    size = 'md', 
    shape = 'circle', 
    className 
}: AvatarProps) {
  return (
    <img
      alt={alt}
      src={src}
      className={cn(
          "inline-block object-cover",
          sizeClasses[size],
          shape === 'circle' ? "rounded-full" : "rounded-md",
          className
      )}
    />
  )
}
