// app/layout.js
import './globals.css';

export const metadata = {
  title: 'Louis Law Group ',
  description: 'Trusted legal services',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}