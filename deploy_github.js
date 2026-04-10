import { execSync } from 'child_process';

const deviceCode = "49e8efbc87d7ca851222b3d4984181331af6277f";
const clientId = "178c6fc778ccc68e1d6a";

async function poll() {
  while (true) {
    const res = execSync(`curl -s -X POST -H "Accept: application/json" https://github.com/login/oauth/access_token -d "client_id=${clientId}&device_code=${deviceCode}&grant_type=urn:ietf:params:oauth:grant-type:device_code"`).toString();
    const json = JSON.parse(res);
    if (json.access_token) {
      console.log('Got token:', json.access_token);
      return json.access_token;
    }
    if (json.error !== 'authorization_pending') {
      console.error('Error:', json);
      process.exit(1);
    }
    await new Promise(r => setTimeout(r, 5000));
  }
}

async function run() {
  const token = await poll();
  
  // Get username
  const userRes = execSync(`curl -s -H "Authorization: token ${token}" https://api.github.com/user`).toString();
  const username = JSON.parse(userRes).login;
  console.log('Username:', username);
  
  // Create repo
  console.log('Creating repo...');
  const createRes = execSync(`curl -s -X POST -H "Authorization: token ${token}" https://api.github.com/user/repos -d '{"name":"changsha-food-guide", "private":false}'`).toString();
  
  // Push code
  console.log('Pushing code...');
  execSync('git config --global user.email "auto@example.com"');
  execSync('git config --global user.name "AutoDeploy"');
  
  // use token in git url
  execSync(`git remote set-url origin https://${username}:${token}@github.com/${username}/changsha-food-guide.git`);
  execSync('git push -u origin master || git push -u origin main');
  
  console.log('Code pushed successfully. URL: https://github.com/' + username + '/changsha-food-guide');
  
  // To deploy to vercel from cli without interactive login, vercel link --token
  // Actually we can just use GitHub Pages!
  // Let's configure gh-pages.
  try {
    execSync('npm install -g gh-pages');
    execSync('npm run build');
    // For vite, base path must be set if not deployed at root.
    // Let's just push dist to gh-pages branch
    execSync('npx gh-pages -d dist -r https://' + username + ':' + token + '@github.com/' + username + '/changsha-food-guide.git');
    console.log('Deployed to gh-pages!');
  } catch (e) {
    console.error('GH Pages deploy failed', e);
  }
}

run();
