import { spawn } from 'node:child_process';

const C = { api: '\x1b[36m', web: '\x1b[32m', reset: '\x1b[0m' };

const children = [
  { name: 'api', args: ['--prefix', 'backend', 'run', 'dev'] },
  { name: 'web', args: ['--prefix', 'frontend', 'run', 'dev'] },
].map(({ name, args }) => {
  const child = spawn('npm', args, { stdio: ['inherit', 'pipe', 'pipe'] });
  const tag = `${C[name]}[${name}]${C.reset} `;
  const pipeLine = (line) => process.stdout.write(`${tag}${line}\n`);
  const onData = (buf) => String(buf).trimEnd().split('\n').forEach(pipeLine);
  child.stdout.on('data', onData);
  child.stderr.on('data', onData);
  child.on('exit', (code) => {
    console.error(`${tag}exited with code ${code}`);
    shutdown();
  });
  return child;
});

let stopping = false;
function shutdown() {
  if (stopping) return;
  stopping = true;
  for (const child of children) {
    if (!child.killed) child.kill();
  }
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);