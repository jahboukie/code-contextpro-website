// Sandbox script to fix TypeScript and ESLint errors
const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing TypeScript and ESLint errors...');

// Fix 1: Remove unused 'error' variable from upgrade page
const upgradePath = path.join(__dirname, 'src/app/upgrade/page.tsx');
let upgradeContent = fs.readFileSync(upgradePath, 'utf8');

// Replace the useAuthState line to remove unused error variable
upgradeContent = upgradeContent.replace(
  /const \[user, loading, error\] = useAuthState\(auth\);/,
  'const [user, loading] = useAuthState(auth);'
);

// Add eslint-disable comment for img element
upgradeContent = upgradeContent.replace(
  /<img src={user\.photoURL \|\| ''} alt="Profile" className="w-8 h-8 rounded-full" \/>/,
  '{/* eslint-disable-next-line @next/next/no-img-element */}\n                <img src={user.photoURL || \'\'} alt="Profile" className="w-8 h-8 rounded-full" />'
);

fs.writeFileSync(upgradePath, upgradeContent);
console.log('✅ Fixed upgrade page');

// Fix 2: Add Suspense boundary to success page
const successPath = path.join(__dirname, 'src/app/success/page.tsx');
let successContent = fs.readFileSync(successPath, 'utf8');

// Add Suspense import
if (!successContent.includes('Suspense')) {
  successContent = successContent.replace(
    "import { useAuthState } from 'react-firebase-hooks/auth';",
    "import { useAuthState } from 'react-firebase-hooks/auth';\nimport { Suspense } from 'react';"
  );
}

// Wrap the component content in Suspense
successContent = successContent.replace(
  /export default function SuccessPage\(\) \{/,
  `function SuccessPageContent() {`
);

successContent = successContent.replace(
  /\}$/,
  `}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center"><div className="text-white">Loading...</div></div>}>
      <SuccessPageContent />
    </Suspense>
  );
}`
);

fs.writeFileSync(successPath, successContent);
console.log('✅ Fixed success page with Suspense boundary');

console.log('🎉 All fixes applied! Ready to test build...');
