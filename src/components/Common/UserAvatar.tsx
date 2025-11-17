import React from 'react';

interface UserAvatarProps {
  fullName: string;
  avatar?: string | null | undefined;
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
 * Construye la URL completa del avatar
 * Si avatar es una ruta relativa, la concatena con VITE_API_BASE_URL
 * Si avatar es una URL absoluta (http/https), la retorna tal cual
 */
const getAvatarUrl = (avatar: string): string => {
  // Si ya es una URL absoluta (http:// o https://), retornarla tal cual
  if (avatar.startsWith('http://') || avatar.startsWith('https://')) {
    return avatar;
  }

  // Si es una ruta relativa, concatenar con la base URL
  const baseUrl = import.meta.env.VITE_API_BASE_URL || '';

  // Normalizar las barras diagonales
  const normalizedBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  const normalizedAvatar = avatar.startsWith('/') ? avatar : `/${avatar}`;

  return `${normalizedBase}${normalizedAvatar}`;
};

/**
 * Componente Avatar reutilizable
 * Muestra la imagen del usuario o sus iniciales si no tiene avatar
 */
const UserAvatar: React.FC<UserAvatarProps> = ({ fullName, avatar, size = 'md' }) => {
  const sizeClass = size === 'lg' ? 'avatar-lg' : size === 'md' ? 'avatar-md' : 'avatar-sm';

  if (avatar && avatar.trim() !== '') {
    const avatarUrl = getAvatarUrl(avatar);

    return (
      <img
        src={avatarUrl}
        alt={fullName}
        className={`${sizeClass} rounded-circle`}
        style={{ objectFit: 'cover', display: 'block' }}
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
