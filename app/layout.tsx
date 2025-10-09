import type { Metadata } from "next";
import "./globals.css";
import "@mantine/core/styles.css";
import { createTheme, MantineProvider, ColorSchemeScript, mantineHtmlProps } from "@mantine/core";

export const metadata: Metadata = {
  title: "NextCTF",
  description: "A Capture The Flag (CTF) platform for cybersecurity enthusiasts.",
};

const theme = createTheme({
  primaryColor: "cyan",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
      </head>
      <body className={`antialiased`}>
        <MantineProvider
          theme={theme}
        >
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}
