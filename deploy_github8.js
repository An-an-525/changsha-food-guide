import { execSync } from 'child_process';

const deviceCode = "e65f7241f63147da5319d7998983c677ab496799";
const clientId = "178c6fc778ccc68e1d6a";

async function poll() {
  while (true) {
    const res = execSync(`curl -s -X POST -H "Accept: application/json" https://github.com/login/oauth/access_token -d "client_id=${clientId}&device_code=${deviceCode}&grant_type=urn:ietf:params:oauth:grant-type:device_code"`).toString();
    const json = JSON.parse(res);
    if (json.access_token) {
      return json.access_token;
    }
    if (json.error !== 'authorization_pending') {
      process.exit(1);
    }
    await new Promise(r => setTimeout(r, 5000));
  }
}

async function run() {
  const token = await poll();
  
  const userRes = execSync(`curl -s -H "Authorization: token ${token}" https://api.github.com/user`).toString();
  const username = JSON.parse(userRes).login;
  
  execSync('git add . && git commit -m "feat: add yuntang and footer interactions" || true');
  
  try { execSync(`git remote remove origin`); } catch(e) {}
  execSync(`git remote add origin https://${username}:${token}@github.com/${username}/changsha-food-guide.git`);
  execSync('git push -u origin main || git push -u origin master');
  
  try {
    execSync('npm run build');
    execSync('npx gh-pages -d dist -r https://' + username + ':' + token + '@github.com/' + username + '/changsha-food-guide.git');
    console.log('Final Deployment Complete!');
  } catch (e) {
    console.error('Deploy failed');
  }
}

run();
