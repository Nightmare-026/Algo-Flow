export {
  SITE_NAME,
  SITE_DISPLAY_NAME,
  SITE_TAGLINE,
  SITE_DESCRIPTION,
  SITE_TITLE_TEMPLATE,
} from "./constants/site";

const FALLBACK_SITE_URL = "https://algo-flow-night-sigma.vercel.app";

export function getSiteUrl() {
  const configured = process.env.NEXT_PUBLIC_SITE_URL;
  try {
    const url = new URL(configured || FALLBACK_SITE_URL);
    return url.origin;
  } catch {
    return FALLBACK_SITE_URL;
  }
}
