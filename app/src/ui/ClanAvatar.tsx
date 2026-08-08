import React, { useState } from "react";
import { clanInitials } from "../game/clanDisplay";
import { assetUrlOrNull } from "../game/assetUrl";
import "./ClanAvatar.css";

type ClanAvatarProps = {
  nombre: string;
  logoUrl?: string | null;
  color?: string;
  /** Pixel size, or omit when using className fill (parent sizes the circle). */
  size?: number;
  /** How the logo sits in the circle. Logos should use contain so they are not cropped. */
  fit?: "contain" | "cover";
  className?: string;
};

export const ClanAvatar: React.FC<ClanAvatarProps> = ({
  nombre,
  logoUrl,
  color = "#888888",
  size,
  fit = "contain",
  className = "",
}) => {
  const [imgError, setImgError] = useState(false);
  const resolvedLogo = assetUrlOrNull(logoUrl);
  const showImage = Boolean(resolvedLogo && !imgError);

  return (
    <div
      className={`clan-avatar clan-avatar--${fit}${showImage ? " clan-avatar--image" : ""}${className ? ` ${className}` : ""}`}
      style={{
        ...(size != null ? { width: size, height: size, fontSize: size * 0.4 } : {}),
        backgroundColor: showImage ? undefined : color,
      }}
      title={nombre}
    >
      {showImage ? (
        <img
          src={resolvedLogo!}
          alt={`Logo ${nombre}`}
          className="clan-avatar__img"
          onError={() => setImgError(true)}
        />
      ) : (
        <span className="clan-avatar__initials">{clanInitials(nombre)}</span>
      )}
    </div>
  );
};
