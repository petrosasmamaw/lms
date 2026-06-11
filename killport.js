#!/usr/bin/env node

import { execSync } from 'child_process';
import { platform } from 'os';

const PORTS = [5173, 5174, 5175, 3000, 5000,5001];
const isWin = platform() === 'win32';

function run(command, options = {}) {
  return execSync(command, {
    encoding: 'utf8',
    stdio: ['pipe', 'pipe', 'pipe'],
    ...options,
  });
}

function getPidsOnPort(port) {
  const pids = new Set();

  try {
    if (isWin) {
      const output = run('netstat -ano -p tcp');
      for (const line of output.split('\n')) {
        const trimmed = line.trim();
        if (!trimmed.startsWith('TCP')) continue;

        const parts = trimmed.split(/\s+/);
        const localAddress = parts[1];
        const state = parts[3];
        const pid = parts[4];

        if (
          localAddress?.endsWith(`:${port}`) &&
          state === 'LISTENING' &&
          pid &&
          pid !== '0'
        ) {
          pids.add(pid);
        }
      }
      return [...pids];
    }

    const output = run(`lsof -ti tcp:${port} -sTCP:LISTEN`);
    return output
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);
  } catch {
    return [];
  }
}

function killPid(pid) {
  try {
    if (isWin) {
      run(`taskkill /PID ${pid} /F`, { stdio: 'pipe' });
    } else {
      run(`kill -9 ${pid}`, { stdio: 'pipe' });
    }
    return true;
  } catch {
    return false;
  }
}

function isPortFree(port) {
  return getPidsOnPort(port).length === 0;
}

function killPort(port) {
  const pids = getPidsOnPort(port);

  if (pids.length === 0) {
    console.log(`  Port ${port}: already free (no process listening)`);
    return { port, killed: [], alreadyFree: true };
  }

  const killed = [];
  for (const pid of pids) {
    const ok = killPid(pid);
    if (ok) {
      killed.push(pid);
      console.log(`  Port ${port}: killed process PID ${pid}`);
    } else {
      console.log(`  Port ${port}: failed to kill PID ${pid}`);
    }
  }

  return { port, killed, alreadyFree: false };
}

console.log('Killing processes on ports:', PORTS.join(', '));
console.log(`Platform: ${isWin ? 'Windows' : platform()}\n`);

const results = PORTS.map(killPort);

console.log('\nVerifying ports are free...\n');

let allFree = true;
for (const port of PORTS) {
  const free = isPortFree(port);
  if (free) {
    console.log(`  ✓ localhost:${port} — free`);
  } else {
    allFree = false;
    const remaining = getPidsOnPort(port);
    console.log(`  ✗ localhost:${port} — still in use (PID: ${remaining.join(', ')})`);
  }
}

const totalKilled = results.reduce((sum, r) => sum + r.killed.length, 0);
const alreadyFree = results.filter((r) => r.alreadyFree).length;

console.log('\n--- Summary ---');
console.log(`Ports checked: ${PORTS.length}`);
console.log(`Processes killed: ${totalKilled}`);
console.log(`Ports already free: ${alreadyFree}`);

if (allFree) {
  console.log('\nAll target ports are free.');
  process.exit(0);
} else {
  console.log('\nSome ports are still in use. Try running again as administrator.');
  process.exit(1);
}
