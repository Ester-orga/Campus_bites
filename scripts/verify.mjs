/** Offline, credential-free checks; never edits the workspace.
 *  --starter    the empty starter: contract tests fail as expected
 *  --reference  the facilitator's reference feature passes every test
 *  --current    whatever is in the workspace now
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const arg=process.argv[2]||'--current';
if(!['--current','--starter','--reference'].includes(arg)){console.error('Usage: node scripts/verify.mjs [--current|--starter|--reference]');process.exit(2)}
const FILES={'site/feature.js':'feature.js','api/feature.mjs':'feature.mjs','tests/feature.acceptance.test.mjs':'feature.acceptance.test.mjs'};
const temp=fs.mkdtempSync(path.join(os.tmpdir(),'campusbites-tests-'));
try{
 for(const dir of ['site','api','tests'])fs.mkdirSync(path.join(temp,dir),{recursive:true});
 for(const shared of ['site/catalog.js','site/feature-runtime.js','tests/helpers.mjs','tests/feature.contract.test.mjs','tests/student-discount.independent.test.mjs'])fs.copyFileSync(path.join(ROOT,shared),path.join(temp,shared));
 for(const [target,name] of Object.entries(FILES)){
  const source=arg==='--current'?path.join(ROOT,target):path.join(ROOT,'facilitator',arg.slice(2),name);
  fs.copyFileSync(source,path.join(temp,target));
 }
 fs.writeFileSync(path.join(temp,'package.json'),'{"type":"module"}');
 const tests=['tests/feature.contract.test.mjs','tests/feature.acceptance.test.mjs'];
 if(arg!=='--current')tests.push('tests/student-discount.independent.test.mjs');
 const p=spawnSync(process.execPath,['--test','--test-reporter=tap',...tests],{cwd:temp,encoding:'utf8',timeout:30000});
 const output=p.stdout+'\n'+p.stderr;
 const num=(name)=>Number(output.match(new RegExp(`^# ${name} (\\d+)`,'m'))?.[1]??-1);
 const pass=num('pass'),fail=num('fail');
 console.log(`${arg}: ${pass} passed, ${fail} failed`);
 if(arg==='--current')process.stdout.write(output.split('\n').filter(l=>/^(not )?ok /.test(l)).join('\n')+'\n');
 if(arg==='--starter' && !(pass===2 && fail>=11))throw Error('Expected the empty starter: 2 PASS, at least 11 FAIL including independent checks');
 if(arg==='--reference' && !(fail===0 && pass>=18 && p.status===0))throw Error('Reference feature did not pass every test');
 if(arg==='--current' && p.status!==0)process.exitCode=1;
 if(arg!=='--current')console.log('Offline fixture verified. No workspace files changed.');
}finally{fs.rmSync(temp,{recursive:true,force:true})}
