import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';

const require = createRequire(import.meta.url);
const esbuild = require('esbuild');

const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'npo-career-sim-test-'));

try {
  await esbuild.build({
    entryPoints: [
      path.resolve('src/engine/simulation.ts'),
      path.resolve('src/data/organizations.ts'),
    ],
    outdir: tmpDir,
    bundle: true,
    format: 'esm',
    platform: 'node',
    outExtension: { '.js': '.mjs' },
    logLevel: 'silent',
  });

  const sim = await import(pathToFileURL(path.join(tmpDir, 'engine/simulation.mjs')).href);
  const orgData = await import(pathToFileURL(path.join(tmpDir, 'data/organizations.mjs')).href);

  // Ensure localStorage calls are safely no-oped in Node
  globalThis.window = undefined;

  // 1. Validate organization weights and context tokens
  const totalWeight = orgData.ORG_TYPE_LIST.reduce((sum, o) => sum + o.weight, 0);
  assert.equal(totalWeight, 100, `Expected ORG_TYPE_LIST weights to sum to 100, got ${totalWeight}`);

  for (const org of orgData.ORG_TYPE_LIST) {
    assert.ok(orgData.ORG_CONTEXT_TOKENS[org.id], `Missing ORG_CONTEXT_TOKENS for ${org.id}`);
    assert.ok(org.allowedRoles.length > 0, `No allowedRoles for ${org.id}`);
  }

  // 2. Validate event catalog integrity
  const eventIds = new Set();
  const setFlags = new Set();
  const requiredFlags = new Set();
  const forbiddenFlags = new Set();

  for (const ev of sim.ALL_EVENTS) {
    assert.ok(!eventIds.has(ev.id), `Duplicate event ID: ${ev.id}`);
    eventIds.add(ev.id);
    assert.ok(Array.isArray(ev.choices) && ev.choices.length >= 2, `Event ${ev.id} should have >= 2 choices`);

    const choiceIds = new Set();
    for (const ch of ev.choices) {
      assert.ok(!choiceIds.has(ch.id), `Duplicate choice ID ${ch.id} in event ${ev.id}`);
      choiceIds.add(ch.id);
      if (ch.effect?.setFlag) setFlags.add(ch.effect.setFlag);
    }

    if (ev.conditions?.requiredFlag) requiredFlags.add(ev.conditions.requiredFlag);
    if (ev.conditions?.forbiddenFlag) forbiddenFlags.add(ev.conditions.forbiddenFlag);
    if (ev.conditions?.orgTypes) {
      assert.equal(
        ev.conditions.excludeOutsideNPO,
        true,
        `Event ${ev.id} specifies orgTypes without excludeOutsideNPO: true`
      );
    }
  }

  for (const flag of requiredFlags) {
    assert.ok(setFlags.has(flag), `requiredFlag "${flag}" is never set by any event choice`);
  }
  for (const flag of forbiddenFlags) {
    assert.ok(setFlags.has(flag), `forbiddenFlag "${flag}" is never set by any event choice`);
  }

  // Ensure donation-crowdout and welfare-kickback events cannot trigger for unions
  const crowdout = sim.ALL_EVENTS.find((e) => e.id === 'era_earthquake_crowdout');
  assert.ok(crowdout?.conditions?.orgTypes, 'era_earthquake_crowdout must restrict orgTypes');
  assert.ok(
    !crowdout.conditions.orgTypes.includes('industrial_union') &&
      !crowdout.conditions.orgTypes.includes('occupational_union'),
    'era_earthquake_crowdout must not trigger for unions'
  );
  const illegalTerm = sim.ALL_EVENTS.find((e) => e.id === 'labor_illegal_termination');
  assert.ok(
    illegalTerm?.conditions?.orgTypes &&
      !illegalTerm.conditions.orgTypes.includes('industrial_union') &&
      !illegalTerm.conditions.orgTypes.includes('occupational_union'),
    'labor_illegal_termination must not trigger for unions'
  );

  // Ensure enterprise/industrial union vs occupational union role & event separation
  assert.ok(
    !orgData.ORG_TYPES.industrial_union.allowedRoles.includes('union_admin'),
    'industrial_union allowedRoles must exclude union_admin'
  );
  assert.ok(
    !orgData.ORG_TYPES.occupational_union.allowedRoles.includes('union_organizer'),
    'occupational_union allowedRoles must exclude union_organizer'
  );

  const isEligibleOrgType = (ev, orgType) => {
    const c = ev.conditions;
    if (c?.onlyOutsideNPO) return false;
    if (c?.orgTypes && !c.orgTypes.includes(orgType)) return false;
    if (c?.excludeOrgTypes && c.excludeOrgTypes.includes(orgType)) return false;
    return true;
  };
  for (const ev of sim.ALL_EVENTS) {
    const bodyText = JSON.stringify({
      title: ev.title,
      narrative: ev.narrative,
      choices: ev.choices,
    });
    if (isEligibleOrgType(ev, 'industrial_union')) {
      for (const forbidden of ['職業工會會員', '勞工生活補貼', '分艙分流']) {
        assert.ok(
          !bodyText.includes(forbidden),
          `Event ${ev.id} eligible for industrial_union must not contain "${forbidden}"`
        );
      }
    }
    if (isEligibleOrgType(ev, 'occupational_union')) {
      for (const forbidden of ['團體協約', '罷工投票']) {
        assert.ok(
          !bodyText.includes(forbidden),
          `Event ${ev.id} eligible for occupational_union must not contain "${forbidden}"`
        );
      }
    }
  }

  // 3. Validate employment-type pension & expense rules
  for (const empType of ['regular', 'multi_employment', 'contractor']) {
    const startState = sim.buildStateFromConfig(
      {
        orgType: 'grassroots',
        role: 'project_exec',
        region: 'taipei_metro',
        background: 'independent',
        employmentType: empType,
        startAge: 25,
        pace: 'compact',
      },
      false,
      () => 0.5
    );
    const afterOneQuarter = sim.advanceQuarter(startState, () => 0.99);
    if (empType === 'regular') {
      assert.ok(afterOneQuarter.laborPensionTotal > 0, 'Regular employment should accrue 6% labor pension');
    } else {
      assert.equal(
        afterOneQuarter.laborPensionTotal,
        0,
        `${empType} should not accrue employer 6% labor pension`
      );
    }
  }

  // 4. Simulate 120 careers across both paces
  const uninterpolated = [];
  for (let i = 0; i < 120; i++) {
    const pace = i < 60 ? 'standard' : 'compact';
    let state = sim.generateRandomStart(pace);
    let steps = 0;
    while (!state.isEnded && steps < 200) {
      if (state.pendingEvent) {
        if (/\{[a-zA-Z0-9_]+\}/.test(JSON.stringify(state.pendingEvent))) {
          uninterpolated.push(state.pendingEvent.id);
        }
        const idx = sim.pickAutoChoiceIndex(state.pendingEvent, state);
        state = sim.resolveEventChoice(state, idx);
      } else {
        state = sim.advanceQuarter(state);
      }
      steps++;
    }
    assert.ok(state.isEnded, `Simulation ${i} failed to end within 200 steps`);
    assert.ok(state.archiveRecord, `Simulation ${i} missing archiveRecord`);
    for (const val of [
      state.monthlySalary,
      state.savings,
      state.laborPensionTotal,
      state.stats.energy,
      state.stats.purpose,
      state.stats.capital,
      state.stats.life,
      state.stats.impactScore,
    ]) {
      assert.ok(Number.isFinite(val), `Non-finite numeric state in simulation ${i}`);
    }
    for (const peer of state.peers) {
      assert.ok(Number.isFinite(peer.salaryEstimate), `Non-finite peer salary in simulation ${i}`);
      if (peer.currentStatus === 'studying') {
        assert.ok(peer.salaryEstimate >= 22000, `Peer ${peer.id} salary below studying floor: ${peer.salaryEstimate}`);
      } else {
        assert.ok(peer.salaryEstimate >= 28590, `Peer ${peer.id} salary below active/pre-exit floor: ${peer.salaryEstimate}`);
      }
      if (peer.currentStatus === 'pivoted') {
        assert.ok(peer.salaryEstimate >= 40000, `Pivoted peer salary too low: ${peer.salaryEstimate}`);
      }
      if (peer.currentStatus === 'promoted') {
        assert.ok(peer.salaryEstimate >= 41000, `Promoted peer salary too low: ${peer.salaryEstimate}`);
      }
    }
  }

  assert.deepEqual(uninterpolated, [], `Found uninterpolated tokens in events: ${uninterpolated.join(', ')}`);

  console.log(
    `[verify-sim] OK: ${orgData.ORG_TYPE_LIST.length} org types (weight=${totalWeight}), ${sim.ALL_EVENTS.length} events, 120 simulated careers passed.`
  );
} finally {
  fs.rmSync(tmpDir, { recursive: true, force: true });
}
