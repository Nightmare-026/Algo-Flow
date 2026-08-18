import fs from 'fs';
import path from 'path';
import { algorithms } from '../src/data/seed/algorithms';
import { dataStructures } from '../src/data/seed/data-structures';

const outDir = path.join(process.cwd(), 'docs', 'ui-redesign');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const publishedAlgorithms = algorithms.filter(a => a.isPublished);
const publishedStructures = dataStructures.filter(s => s.isPublished);

interface RouteEntry {
  num: number;
  route: string;
  family: string;
  auth: string;
  dynamic: string;
  currentUi: string;
  redesigned: string;
  verified: string;
}

const routes: RouteEntry[] = [];
let count = 1;

// 1. Static / Marketing
routes.push({
  num: count++,
  route: '/',
  family: 'Marketing / Home',
  auth: 'Public',
  dynamic: 'No',
  currentUi: 'Legacy 3-theme, basic neumorphic cards, green-tinted hero',
  redesigned: 'Planned (Studio Workstation Hero + Live Bubble Sort Sandbox)',
  verified: 'Pending'
});

routes.push({
  num: count++,
  route: '/privacy',
  family: 'Legal & Info',
  auth: 'Public',
  dynamic: 'No',
  currentUi: 'Basic document card layout',
  redesigned: 'Planned (Tactile Editorial Document Shell)',
  verified: 'Pending'
});

routes.push({
  num: count++,
  route: '/terms',
  family: 'Legal & Info',
  auth: 'Public',
  dynamic: 'No',
  currentUi: 'Basic document card layout',
  redesigned: 'Planned (Tactile Editorial Document Shell)',
  verified: 'Pending'
});

// 2. Authentication
const authRoutes = [
  { path: '/login', name: 'Login' },
  { path: '/signup', name: 'Sign Up' },
  { path: '/forgot-password', name: 'Forgot Password' },
  { path: '/reset-password', name: 'Reset Password' },
  { path: '/verify-email', name: 'Verify Email' },
];

authRoutes.forEach(r => {
  routes.push({
    num: count++,
    route: r.path,
    family: 'Authentication',
    auth: 'Guest / Public',
    dynamic: 'No',
    currentUi: `Split screen ${r.name} with floating inputs`,
    redesigned: `Planned (Tactile Neumorphic Split Shell with High-Legibility Fields)`,
    verified: 'Pending'
  });
});

// 3. Visualizer Catalog
routes.push({
  num: count++,
  route: '/visualizers',
  family: 'Visualizer Catalog',
  auth: 'Public',
  dynamic: 'No',
  currentUi: 'Search bar + structure cards in 3-column grid',
  redesigned: 'Planned (Instant Search + Category Filter Tabs + Tactile Cards)',
  verified: 'Pending'
});

// 4. Data Structure Category Explorers
publishedStructures.forEach(structure => {
  routes.push({
    num: count++,
    route: `/visualizers/${structure.slug}`,
    family: 'Category Explorer',
    auth: 'Public',
    dynamic: `Yes (${structure.name})`,
    currentUi: `Legacy ${structure.name} list with basic select dropdowns`,
    redesigned: `Planned (Tactile Breadcrumb + Operation Pills + Difficulty Filter + Stat Badges)`,
    verified: 'Pending'
  });
});

// 5. Visualizer Workstations (133 algorithms)
publishedAlgorithms.forEach(alg => {
  routes.push({
    num: count++,
    route: `/visualizer/${alg.slug}`,
    family: 'Visualizer Workstation',
    auth: 'Public',
    dynamic: `Yes (${alg.name})`,
    currentUi: 'Multi-panel layout with legacy green accents',
    redesigned: 'Planned (IDE-Class Multi-Panel Workstation with Code/Pseudo Sync & Dock)',
    verified: 'Pending'
  });
});

// 6. Quizzes (133 algorithm quizzes)
publishedAlgorithms.forEach(alg => {
  routes.push({
    num: count++,
    route: `/quizzes/${alg.id}`,
    family: 'Assessment Engine',
    auth: 'Public / Auth',
    dynamic: `Yes (${alg.name} Quiz)`,
    currentUi: 'Quiz client with options and text explanation',
    redesigned: 'Planned (Tactile Question Progression + Option Hover Depth + Scorecard Summary)',
    verified: 'Pending'
  });
});

// 7. Dashboard
routes.push({
  num: count++,
  route: '/dashboard',
  family: 'User Dashboard',
  auth: 'Required',
  dynamic: 'SSR',
  currentUi: 'Bento grid with streaks, XP and recent activity',
  redesigned: 'Planned (Tactile Bento Grid + Daily Challenge Hero + Mastery Progress)',
  verified: 'Pending'
});

// 8. 404 / Error
routes.push({
  num: count++,
  route: '/not-found (404)',
  family: 'System & Error',
  auth: 'Public',
  dynamic: 'System',
  currentUi: 'Basic 404 container',
  redesigned: 'Planned (Tactile Error Card with Search and Quick Links)',
  verified: 'Pending'
});

// Write Markdown
let md = '# Algo Flow — Authoritative Route & Page Inventory\n\n';
md += `Total Documented & Inspected Routes: **${routes.length}**\n\n`;
md += '### Route Family Summary\n';
md += '- **Marketing & Static Pages**: 3 routes (`/`, `/privacy`, `/terms`)\n';
md += '- **Authentication Suite**: 5 routes (`/login`, `/signup`, `/forgot-password`, `/reset-password`, `/verify-email`)\n';
md += '- **Visualizer Catalog**: 1 route (`/visualizers`)\n';
md += `- **Data Structure Categories**: ${publishedStructures.length} routes (` + publishedStructures.map(s => `\`/visualizers/${s.slug}\``).join(', ') + ')\n';
md += `- **Visualizer Workstations**: ${publishedAlgorithms.length} routes (` + publishedAlgorithms.slice(0, 5).map(a => `\`/visualizer/${a.slug}\``).join(', ') + `, ...and ${publishedAlgorithms.length - 5} more)\n`;
md += `- **Assessment / Quizzes**: ${publishedAlgorithms.length} routes (` + publishedAlgorithms.slice(0, 5).map(a => `\`/quizzes/${a.id}\``).join(', ') + `, ...and ${publishedAlgorithms.length - 5} more)\n`;
md += '- **User Dashboard**: 1 route (`/dashboard`)\n';
md += '- **System / Error Pages**: 1 route (`/not-found`)\n\n';
md += '---\n\n';
md += '### Complete Route Inventory Table\n\n';
md += '| # | Route | Page Family | Auth | Dynamic | Current UI | Redesigned | Verified |\n';
md += '|---|---|---|---|---|---|---|---|\n';

routes.forEach(r => {
  md += `| ${r.num} | \`${r.route}\` | ${r.family} | ${r.auth} | ${r.dynamic} | ${r.currentUi} | ${r.redesigned} | ${r.verified} |\n`;
});

fs.writeFileSync(path.join(outDir, 'ROUTE-INVENTORY.md'), md);
console.log(`Generated ROUTE-INVENTORY.md with ${routes.length} routes.`);
