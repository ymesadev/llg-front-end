"use client";

export default function OpenChatButton({ children, className, ...props }) {
  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    window.dispatchEvent(new Event("openSmileyChat"));
  };

  return (
    <button type="button" onClick={handleClick} className={className} {...props}>
      {children}
    </button>
  );
}
