import React, { useState } from 'react';
import { clanInitials } from '../game/clanDisplay';
import { assetUrlOrNull } from '../game/assetUrl';

type ClanAvatarProps = {
  nombre: string;
  logoUrl?: string | null;
  color?: string;
  size?: number;
};

export const ClanAvatar: React.FC<ClanAvatarProps> = ({
  nombre,
  logoUrl,
  color = '#888888',
  size = 40,
}) => {
  const [imgError, setImgError] = useState(false);
  const resolvedLogo = assetUrlOrNull(logoUrl);

  const showImage = resolvedLogo && !imgError;

  return (
    <div
      className="clan-avatar"
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: showImage ? 'transparent' : color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontWeight: 'bold',
        fontSize: size * 0.4,
        overflow: 'hidden',
        flexShrink: 0,
      }}
      title={nombre}
    >
      {showImage ? (
        <img
          src={resolvedLogo}
          alt={`Logo ${nombre}`}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={() => setImgError(true)}
        />
      ) : (
        <span>{clanInitials(nombre)}</span>
      )}
    </div>
  );
};
