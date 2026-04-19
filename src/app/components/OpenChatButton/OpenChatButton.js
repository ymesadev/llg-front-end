"use client";

export default function OpenChatButton({ children, className, ...props }) {
  const handleClick = (e) => {
    e.preventDefault();
    window.dispatchEvent(new Event("openSmileyChat"));
  };

  return (
    <a
      href="#chat"
      role="button"
      onClick={handleClick}
      onTouchEnd={(e) => { e.preventDefault(); window.dispatchEvent(new Event("openSmileyChat")); }}
      className={className}
      {...props}
    >
      {children}
    </a>
  );
}
