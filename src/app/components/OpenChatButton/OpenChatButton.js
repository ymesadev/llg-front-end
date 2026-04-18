"use client";

export default function OpenChatButton({ children, className, ...props }) {
  const handleClick = () => {
    window.dispatchEvent(new Event("openSmileyChat"));
  };

  return (
    <button type="button" onClick={handleClick} className={className} {...props}>
      {children}
    </button>
  );
}
