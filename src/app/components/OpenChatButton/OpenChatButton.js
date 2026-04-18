"use client";

export default function OpenChatButton({ className, style, children }) {
  return (
    <button
      onClick={() => {
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('openSmileyChat'));
        }
      }}
      className={className}
      style={{ cursor: "pointer", border: "none", ...style }}
    >
      {children}
    </button>
  );
}
