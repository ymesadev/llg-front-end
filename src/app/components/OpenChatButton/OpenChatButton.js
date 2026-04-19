"use client";

export default function OpenChatButton({ children, className, ...props }) {
  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Primary: custom event
    window.dispatchEvent(new Event("openSmileyChat"));
    // Fallback: directly find and click the chatbox open
    setTimeout(() => {
      const chatbox = document.querySelector('[data-chatbox]');
      if (chatbox && !chatbox.classList.contains('fadeIn')) {
        window.dispatchEvent(new Event("openSmileyChat"));
      }
    }, 100);
  };

  return (
    <button type="button" onClick={handleClick} className={className} {...props}>
      {children}
    </button>
  );
}
