// Final comprehensive fix for all build errors
const fs = require('fs');
const path = require('path');

console.log('🔧 Final comprehensive fix for all build errors...');

// Fix upgrade page
const upgradePath = path.join(__dirname, 'src/app/upgrade/page.tsx');
let upgradeContent = fs.readFileSync(upgradePath, 'utf8');

// Remove unused error variable
upgradeContent = upgradeContent.replace(
  /const \[user, loading, error\] = useAuthState\(auth\);/,
  'const [user, loading] = useAuthState(auth);'
);

// Remove the eslint-disable comment that's not needed
upgradeContent = upgradeContent.replace(
  /\s*\{\/\* eslint-disable-next-line @next\/next\/no-img-element \*\/\}\s*/g,
  ''
);

fs.writeFileSync(upgradePath, upgradeContent);
console.log('✅ Fixed upgrade page');

// Fix success page - completely remove useSearchParams
const successPath = path.join(__dirname, 'src/app/success/page.tsx');
let successContent = fs.readFileSync(successPath, 'utf8');

// Remove useSearchParams from import
successContent = successContent.replace(
  /import \{ useRouter, useSearchParams \} from 'next\/navigation';/,
  "import { useRouter } from 'next/navigation';"
);

// Remove all useSearchParams usage
successContent = successContent.replace(
  /const searchParams = useSearchParams\(\);/g,
  ''
);

// Remove sessionId variable
successContent = successContent.replace(
  /const sessionId = searchParams\.get\('session_id'\);/g,
  ''
);

// Remove sessionId display in JSX
successContent = successContent.replace(
  /\s*\{sessionId && \(\s*<p className="text-gray-300 text-sm mt-2">\s*Session ID: \{sessionId\}\s*<\/p>\s*\)\}/g,
  ''
);

// Clean up any extra whitespace
successContent = successContent.replace(/\n\s*\n\s*\n/g, '\n\n');

fs.writeFileSync(successPath, successContent);
console.log('✅ Fixed success page - removed all useSearchParams usage');

console.log('🎉 Final fixes applied! Testing build...');

// Test the build
const { exec } = require('child_process');
exec('npm run build', (error, stdout, stderr) => {
  if (error) {
    console.log('❌ Build failed:', error.message);
    console.log('stdout:', stdout);
    console.log('stderr:', stderr);
  } else {
    console.log('✅ BUILD SUCCESSFUL!');
    console.log('🚀 Ready to deploy to Vercel!');
  }
});
