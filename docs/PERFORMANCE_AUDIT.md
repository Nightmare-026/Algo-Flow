# Performance Audit Baseline

> Status: partial. Production route timing is a single uncached/cached network sample, not a percentile or Core Web Vitals measurement.

## Sampled production response times

| Route | Status | Total time |
|---|---:|---:|
| `/` | 200 | 6.94 s |
| `/visualizers` | 200 | 0.86 s |
| `/visualizers/array` | 200 | 2.18 s |
| `/visualizer/bubble-sort` | 200 | 1.77 s |
| `/quizzes/alg_arr_bubble_sort` | 200 | 4.02 s |
| `/dashboard` | 302 | 1.26 s |

The home response was a Vercel cache hit with a 52,754-byte HTML payload. No console warnings/errors or horizontal document overflow were observed at 1440x900 and 390x844.

## Unavailable metrics

- Local Lighthouse download timed out after 124 seconds.
- Google's PageSpeed API returned daily quota exhausted.
- The current build fails in `prebuild`, so current bundle output and route chunk sizes cannot be trusted.
- LCP, INP, CLS, p75 field data, long tasks, and memory behavior remain unverified.

## Known performance risks

Synchronous full step generation on the main thread, large client visualizer components, Shiki/Three/D3/React Flow weight, application-wide mount hiding in `ThemeProvider`, no documented bundle budget, and no performance regression checks.

