import fs from 'fs';
import path from 'path';

const authFile = path.join(process.cwd(), 'auth.json');

async function globalTeardown(): Promise<void> {
  // Clean up auth file
  if (fs.existsSync(authFile)) {
    console.log('Cleaning up auth.json...');
    fs.unlinkSync(authFile);
  }
}

export default globalTeardown;
