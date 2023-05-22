import { Press_Start_2P, Source_Code_Pro } from "next/font/google";
import localFont from "next/font/local";

/**
 *
 *
 * GOOGLE FONTS
 *
 * Automatically self-host any Google Font. Fonts are included in the deployment and served from the same domain as your deployment. No requests are sent to Google by the browser.
 *
 * Get started by importing the font you would like to use from next/font/google as a function. We recommend using variable fonts for the best performance and flexibility.
 *
 * https://nextjs.org/docs/app/building-your-application/optimizing/fonts#google-fonts
 *
 *
 */

const pressStart2P = Press_Start_2P({ subsets: ["latin"], weight: "400" });
const sourceCodePro = Source_Code_Pro({ subsets: ["latin"], weight: "400" });
const instrumentSans = localFont({
  src: "./InstrumentSans-VariableFont_wdth,wght.ttf",
});

export { pressStart2P, sourceCodePro, instrumentSans };
