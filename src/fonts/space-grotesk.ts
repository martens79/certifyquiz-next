import localFont from "next/font/local";

// Keep the same display family across the four business pages without a
// build-time dependency on Google Fonts CSS or its generated asset URLs.
export const spaceGrotesk = localFont({
  src: "./SpaceGrotesk-Variable.ttf",
  weight: "300 700",
  style: "normal",
  display: "swap",
  variable: "--font-display",
});
