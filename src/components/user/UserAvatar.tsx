
interface UserAvatarProps {
  src: string;
  alt: string;
}

export function UserAvatar({ src, alt }: UserAvatarProps) {
  return (
    <img
      src={src}
      alt={alt}
      className="w-16 h-16 rounded-full"
    />
  );
}