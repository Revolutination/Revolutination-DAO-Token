const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const repoPath = path.join(__dirname, 'revolutition-dao-token');

// Clone the repository
exec(`git clone https://github.com/mygithubaccount/revolutition-dao-token.git ${repoPath}`, (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
  console.error(`stderr: ${stderr}`);

  // Change directory to the cloned repository
  process.chdir(repoPath);

  // Install dependencies
  exec('npm install', (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);

    // Deploy using netlify-cli
    exec('netlify deploy', (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
      console.error(`stderr: ${stderr}`);
    });
  });
});
