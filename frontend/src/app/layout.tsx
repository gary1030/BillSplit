import { Providers } from "./providers";
import { Metadata } from 'next'
 
export const metadata: Metadata = {
  title: 'BillSplit',
  description: 'Welcome to BillSplit. Split your bill wisely.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
