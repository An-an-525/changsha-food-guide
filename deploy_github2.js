import { execSync } from 'child_process';

const deviceCode = "24d90aecb4dcbfa65254aefb94b3b527ea89d8f9";
const clientId = "178c6fc778ccc68e1d6a";

async function run() {
  // Get token
  console.log('Verifying token...');
  const res = execSync(`curl -s -X POST -H "Accept: application/json" https://github.com/login/oauth/access_token -d "client_id=${clientId}&device_code=${deviceCode}&grant_type=urn:ietf:params:oauth:grant-type:device_code"`).toString();
  const json = JSON.parse(res);
  
  if (!json.access_token) {
    console.error('Failed to get token:', json);
    process.exit(1);
  }
  
  const token = json.access_token;
  console.log('Token acquired!');
  
  // Get username
  const userRes = execSync(`curl -s -H "Authorization: token ${token}" https://api.github.com/user`).toString();
  const username = JSON.parse(userRes).login;
  console.log('Username:', username);
  
  // Create repo
  console.log('Creating repo...');
  execSync(`curl -s -X POST -H "Authorization: token ${token}" https://api.github.com/user/repos -d '{"name":"changsha-food-guide", "private":false}'`);
  
  // Push code
  console.log('Configuring git and pushing code...');
  execSync('git config --global user.email "auto@example.com"');
  execSync('git config --global user.name "AutoDeploy"');
  
  try {
      execSync(`git remote remove origin`);
  } catch(e) {}
  
  execSync(`git remote add origin https://${username}:${token}@github.com/${username}/changsha-food-guide.git`);
  execSync('git push -u origin main || git push -u origin master');
  
  console.log('Code pushed successfully.');
  
  // Deploy using gh-pages
  console.log('Deploying to GitHub Pages...');
  try {
    execSync('npm install -g gh-pages');
    execSync('npx gh-pages -d dist -r https://' + username + ':' + token + '@github.com/' + username + '/changsha-food-guide.git');
    console.log(`Deployed! URL will be ready at: https://${username}.github.io/changsha-food-guide/`);
  } catch (e) {
    console.error('GH Pages deploy failed', e);
  }
}

run();
