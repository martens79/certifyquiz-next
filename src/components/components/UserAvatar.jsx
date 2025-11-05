import React from "react";
import { getFallbackAvatar } from "../utils/avatar";

export default function UserAvatar({ user, size = 64, className = "", rounded = "xl" }) {
  const avatarSrc = user?.avatarUrl || getFallbackAvatar(user);

  return (
    <img
      src={avatarSrc}
      alt="avatar"
      width={size}
      height={size}
      className={`object-cover bg-white rounded-${rounded} ${className}`}
      onError={(e) => {
        e.currentTarget.src = getFallbackAvatar(user);
      }}
    />
  );
}
