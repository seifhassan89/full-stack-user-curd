import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
  name: string;
  imageUrl?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function UserAvatar({ name = "John Doe", imageUrl, className, size = "md" }: UserAvatarProps) {
  // Get the initials from the name
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);

  // Size classes
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  };

  return (
    <Avatar className={cn(sizeClasses[size], className)}>
      <AvatarImage src={imageUrl} alt={name} />
      <AvatarFallback className="bg-primary text-white text-sm font-medium">
        {initials}
      </AvatarFallback>
    </Avatar>
  );
}
