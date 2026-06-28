import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { getInitials, type UserProfile } from "@/lib/user-profile";

export function UserAvatar({
  profile,
  className,
  fallbackClassName,
}: {
  profile: UserProfile;
  className?: string;
  fallbackClassName?: string;
}) {
  return (
    <Avatar className={cn("ring-2 ring-primary/20", className)}>
      {profile.avatarDataUrl && (
        <AvatarImage src={profile.avatarDataUrl} alt={profile.fullName} />
      )}
      <AvatarFallback
        className={cn(
          "bg-primary text-primary-foreground font-semibold",
          fallbackClassName,
        )}
      >
        {getInitials(profile.fullName)}
      </AvatarFallback>
    </Avatar>
  );
}
