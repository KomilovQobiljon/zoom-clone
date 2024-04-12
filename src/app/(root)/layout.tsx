import StreamVideoProvider from '@/providers/StreamClientProvider';
import { Metadata } from 'next';

type RootLayoutProps = {
  children: React.ReactNode
};

export const metadata: Metadata = {
  title: "Yoom",
  description: "Video calling app",
  icons: {
    icon: "/icons/logo.svg"
  }
};

const RootLayout = ({children}: RootLayoutProps) => {
  return (
    <main>
      <StreamVideoProvider>
        {children}
      </StreamVideoProvider>
    </main>
  )
}

export default RootLayout;