import React from 'react';

interface UserAvatarProps {
  fullName: string;
  avatar?: string | undefined;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Genera las iniciales del nombre completo
 */
const getInitials = (fullName: string): string => {
  const names = fullName.trim().split(' ');
  if (names.length >= 2) {
    return `${names[0].charAt(0)}${names[names.length - 1].charAt(0)}`.toUpperCase();
  }
  return fullName.charAt(0).toUpperCase();
};

/**
 * Componente Avatar reutilizable
 * Muestra la imagen del usuario o sus iniciales si no tiene avatar
 */
const UserAvatar: React.FC<UserAvatarProps> = ({ fullName, avatar, size = 'md' }) => {
  const sizeClass = size === 'lg' ? 'avatar-lg' : size === 'md' ? 'avatar-md' : 'avatar-sm';

  if (avatar) {
    return (
      <img
        src={avatar}
        alt={fullName}
        className={`${sizeClass} rounded-circle`}
      />
    );
  }

  return (
    <div className={`${sizeClass} bg-primary rounded-circle d-flex align-items-center justify-content-center`}>
      <span className="text-white font-size-16 fw-bold">
        {getInitials(fullName)}
      </span>
    </div>
  );
};

export default UserAvatar;
