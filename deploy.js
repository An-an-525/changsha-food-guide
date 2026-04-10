const { spawn } = require('child_process');

const surge = spawn('npx', ['surge', './dist', 'changsha-food-guide-525.surge.sh']);

surge.stdout.on('data', (data) => {
  const out = data.toString();
  console.log(out);
  if (out.includes('email:')) {
    surge.stdin.write('auto-deploy-525@example.com\n');
  }
  if (out.includes('password:')) {
    surge.stdin.write('auto-deploy-password-123\n');
  }
});

surge.stderr.on('data', (data) => {
  console.error(data.toString());
});

surge.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});
