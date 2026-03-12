const { spawn } = require('child_process');
const net = require('net');

async function findAvailablePort(startPort) {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    
    server.listen(startPort, () => {
      server.close(() => resolve(startPort));
    });
    
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        resolve(findAvailablePort(startPort + 1));
      } else {
        reject(err);
      }
    });
  });
}

async function startApp(appName, appPath, startPort) {
  const availablePort = await findAvailablePort(startPort);
  
  console.log(`\n🚀 Starting ${appName} on port ${availablePort}...`);
  
  const child = spawn('npm', ['run', 'dev'], {
    cwd: appPath,
    env: { ...process.env, PORT: availablePort },
    stdio: 'inherit',
    shell: true,
  });
  
  child.on('error', (error) => {
    console.error(`Error starting ${appName}:`, error);
  });
  
  return child;
}

async function main() {
  console.log('🍽️ Starting CaterHub Development Servers...\n');
  
  try {
    await Promise.all([
      startApp('Web App', './apps/web', 3000),
      startApp('POS App', './apps/pos', 3001),
    ]);
    
    console.log('\n✅ All servers started successfully!');
    console.log('📱 Web: http://localhost:3000');
    console.log('🧾 POS: http://localhost:3001\n');
  } catch (error) {
    console.error('Failed to start servers:', error);
    process.exit(1);
  }
}

main();