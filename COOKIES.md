# Algo Flow — Cookie Policy & Local Storage Transparency

**Effective Date**: September 5, 2026  
**Version**: 2026-09-05  
**Maintainer**: Nightmare / Algo Flow Team  
**Contact**: [ganeshsharma7114@gmail.com](mailto:ganeshsharma7114@gmail.com)  
**Web Version**: [https://algo-flow.vercel.app/cookies](https://algo-flow.vercel.app/cookies)  

---

## 1. Zero-Ad-Tracker Policy

Algo Flow enforces a strict **Zero-Ad-Tracker** commitment:
- **No Third-Party Advertising Trackers**: We do not deploy commercial ad networks, behavioral profiling tags, or cross-site tracking beacons (such as Google Ads, Meta Pixel, or commercial analytics trackers).
- **No Commercial Data Brokerage**: We never sell or license your browsing telemetry, device identifiers, or visualizer interaction habits.
- **Minimalist Technical Footprint**: We utilize only strictly essential authentication cookies and client-side browser local storage to save your UI preferences.

---

## 2. Essential Authentication Cookies

Authentication cookies are required for identity verification and secure session routing. These cookies are generated exclusively by **Supabase Auth** when you log into your Algo Flow account:

| Cookie Name | Provider / Source | Purpose & Classification | Expiration | Security Flags |
| :--- | :--- | :--- | :--- | :--- |
| `sb-<project-ref>-auth-token` | Supabase Auth | Encrypted JWT session token for authenticated user sessions | Session / 14 Days | `HttpOnly`, `SameSite=Lax`, `Secure` |
| `sb-<project-ref>-refresh-token` | Supabase Auth | Cryptographic refresh token to extend authenticated session securely | 30 Days | `HttpOnly`, `SameSite=Lax`, `Secure` |

*Note: Exploring visualizers, reading source code, and running sandbox simulations in guest mode does not create any authentication cookies.*

---

## 3. Browser Local Storage (Client-Side Preferences)

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

## 4. Managing and Clearing Storage

You maintain complete sovereignty over your browser storage at all times:
- **Browser Settings**: You can clear all cookies and local storage items at any time through your web browser settings (Chrome, Firefox, Safari, Edge, or Brave).
- **Guest Mode**: You can explore all 137 algorithm visualizers and code execution modules without logging in.
- **Account Deletion**: Deleting your account from the Student Dashboard purges all remote database records immediately.

---

## 5. Contact & Regulatory Inquiries

For questions or inquiries regarding our Cookie Policy or data storage practices:  
**Email**: [ganeshsharma7114@gmail.com](mailto:ganeshsharma7114@gmail.com)  
**Related Documents**: [Terms of Service](TERMS.md) • [Privacy Policy](PRIVACY.md) • [Software License](LICENSE) • [Security Policy](SECURITY.md)
