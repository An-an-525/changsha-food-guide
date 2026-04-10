const { spawn } = require('child_process');

const surge = spawn('npx', ['surge', './dist', 'changsha-food-guide-525.surge.sh']);

let emailSent = false;
let passwordSent = false;

surge.stdout.on('data', (data) => {
  const out = data.toString();
  console.log(out);
  if (out.toLowerCase().includes('email') && !emailSent) {
    surge.stdin.write('auto-deploy-525@example.com\n');
    emailSent = true;
  }
  if (out.toLowerCase().includes('password') && !passwordSent) {
    surge.stdin.write('auto-deploy-password-123\n');
    passwordSent = true;
  }
});

surge.stderr.on('data', (data) => {
  console.error(data.toString());
});

surge.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});
