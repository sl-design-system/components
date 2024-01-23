export interface UserProfile {
  name: UserProfileName;
  picture?: UserProfilePicture;
}

export interface UserProfileName {
  first: string;
  last: string;
  prefix?: string;
}

export interface UserProfilePicture {
  thumbnail: string;
}

export interface AvatarImage {
  containerSize: number;
  size: number;
  radius: number;
  y: number;
  x: number;
  focusRingPosition: number;
}

export interface AvatarBadge {
  height: number;
  width: number;
  radius: number;
  badgeY: number;
  badgeX: number;
  badgeBaseX: number;
  textY?: number;
  textX?: number;
}

export interface AvatarIcon {
  size: number;
  y?: number;
  x?: number;
}

export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
export type AvatarFallbackType = 'initials' | 'image';
export type AvatarOrientation = 'horizontal' | 'vertical';
export type UserStatus = 'danger' | 'success' | 'warning' | 'accent' | 'neutral' | 'primary';
