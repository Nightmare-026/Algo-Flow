# Algo Flow — Cookie Policy & Local Storage Transparency

**Effective Date**: September 23, 2026  
**Version**: 2026-09-23  
**Maintainer**: Nightmare / Algo Flow Team  
**Contact**: [ganeshsharma7114@gmail.com](mailto:ganeshsharma7114@gmail.com)  
**Web Version**: [https://algo-flow.vercel.app/cookies](https://algo-flow.vercel.app/cookies)  

---

## 1. Privacy-First Analytics Policy

Algo Flow enforces a strict **Zero-Ad-Tracker** commitment:
- **No Third-Party Advertising Trackers**: We do not deploy commercial ad networks, behavioral profiling tags, or cross-site tracking beacons (such as Google Ads, Meta Pixel, or retargeting cookies).
- **No Commercial Data Brokerage**: We never sell or license your browsing telemetry, device identifiers, or visualizer interaction habits.
- **Privacy-Focused Analytics**: We use Google Analytics 4 (GA4) solely to understand aggregate traffic patterns, page performance, and feature adoption. GA4 data is never used for advertising, remarketing, or behavioral profiling. We also use Vercel Web Analytics, which operates entirely cookie-less.
- **Minimalist Technical Footprint**: Beyond the analytics and authentication cookies listed below, we utilize only client-side browser local storage to save your UI preferences.

---

## 2. Essential Authentication Cookies

Authentication cookies are required for identity verification and secure session routing. These cookies are generated exclusively by **Supabase Auth** when you log into your Algo Flow account:

| Cookie Name | Provider / Source | Purpose & Classification | Expiration | Security Flags |
| :--- | :--- | :--- | :--- | :--- |
| `sb-<project-ref>-auth-token` | Supabase Auth | Encrypted JWT session token for authenticated user sessions | Session / 14 Days | `HttpOnly`, `SameSite=Lax`, `Secure` |
| `sb-<project-ref>-refresh-token` | Supabase Auth | Cryptographic refresh token to extend authenticated session securely | 30 Days | `HttpOnly`, `SameSite=Lax`, `Secure` |

*Note: Exploring visualizers, reading source code, and running sandbox simulations in guest mode does not create any authentication cookies.*

---

## 3. Analytics Cookies (Google Analytics 4)

We use Google Analytics 4 (GA4) to collect pseudonymous, aggregate insights about how learners use Algo Flow — such as which algorithms are most visited, page load performance, and navigation patterns. This data helps us prioritize educational content and improve platform reliability.

| Cookie Name | Provider / Source | Purpose & Classification | Expiration | Security Flags |
| :--- | :--- | :--- | :--- | :--- |
| `_ga` | Google Analytics 4 | Distinguishes unique visitors using a randomly generated pseudonymous client identifier | 2 Years | `SameSite=Lax`, `Secure` |
| `_ga_<container-id>` | Google Analytics 4 | Persists session state (e.g., page view count within a session) | 2 Years | `SameSite=Lax`, `Secure` |

**What GA4 does NOT do on Algo Flow:**
- Does not enable advertising features, remarketing, or user-level profiling.
- Does not link analytics data to your Algo Flow account identity.
- Does not share data with third-party advertisers.

*Privacy-First Web Telemetry:* In addition to GA4, Algo Flow uses Vercel Web Analytics for Core Web Vitals monitoring. Vercel Web Analytics operates completely **cookie-less** — it does not use cookies, does not persist identifiers across sessions, and does not store personal data.

---

## 4. Browser Local Storage (Client-Side Preferences)

We use HTML5 Browser `localStorage` to save your UI preferences locally on your physical device without transmitting unnecessary tracking payloads to remote servers:

| Storage Key | Purpose | Stored Data | Transmission to Server |
| :--- | :--- | :--- | :--- |
| `algo-flow-theme` | Remembers your workstation appearance preference | `"light"`, `"dark"`, `"dark-neon"`, `"light-edu"`, or `"system"` | No (Client-side only) |
| `algo-flow-lang` | Remembers preferred programming language for code implementations | `"javascript"`, `"python"`, `"cpp"`, or `"java"` | No (Client-side only) |
| `algo_flow_sound_muted` | Remembers audio sound effects mute toggle for mental math exercises | Boolean string (`"true"` or `"false"`) | No (Client-side only) |
| `visualizer-tour-[slug]` | Records whether interactive walkthrough was completed for a specific algorithm | Boolean string (`"true"`) | No (Client-side only) |
| `algo_flow_mental_math_stats_v1` | Caches local calculation drill statistics, speed metrics, and mastery history | JSON object of local stats and history | No (Client-side only) |
| `algoflow_completed_chapters` | Tracks locally completed DSA curriculum chapters for offline and guest study progress | JSON array of chapter slug identifiers | No (Client-side only) |

---

## 5. Managing and Clearing Storage

You maintain complete sovereignty over your browser storage at all times:
- **Browser Settings**: You can clear all cookies and local storage items at any time through your web browser settings (Chrome, Firefox, Safari, Edge, or Brave).
- **Guest Mode**: You can explore all 138 algorithm visualizers and code execution modules without logging in.
- **Account Deletion**: Deleting your account from the Student Dashboard purges all remote database records immediately.

---

## 6. Contact & Regulatory Inquiries

For questions or inquiries regarding our Cookie Policy or data storage practices:  
**Email**: [ganeshsharma7114@gmail.com](mailto:ganeshsharma7114@gmail.com)  
**Related Documents**: [Terms of Service](TERMS.md) • [Privacy Policy](PRIVACY.md) • [Software License](LICENSE) • [Security Policy](SECURITY.md)
