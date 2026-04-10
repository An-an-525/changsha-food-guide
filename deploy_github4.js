import { execSync } from 'child_process';

const deviceCode = "1841795837337d97918a3a064943cd03b57d24dc";
const clientId = "178c6fc778ccc68e1d6a";

async function run() {
  const res = execSync(`curl -s -X POST -H "Accept: application/json" https://github.com/login/oauth/access_token -d "client_id=${clientId}&device_code=${deviceCode}&grant_type=urn:ietf:params:oauth:grant-type:device_code"`).toString();
  const json = JSON.parse(res);
  const token = json.access_token;
  
  if (!token) {
    console.error('Failed to get token for fix deployment');
    process.exit(1);
  }
  
  const userRes = execSync(`curl -s -H "Authorization: token ${token}" https://api.github.com/user`).toString();
  const username = JSON.parse(userRes).login;
  
  execSync('git add . && git commit -m "fix: change BrowserRouter to HashRouter for GitHub Pages" || true');
  
  try {
    execSync('npm run build');
    execSync('npx gh-pages -d dist -r https://' + username + ':' + token + '@github.com/' + username + '/changsha-food-guide.git');
    console.log('Fix Deployment Complete!');
  } catch (e) {
    console.error('Fix Deploy failed');
  }
}

run();
