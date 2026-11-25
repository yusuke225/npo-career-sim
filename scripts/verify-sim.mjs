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
      path.resolve('src/data/chronicles.ts'),
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
  const chronicles = await import(pathToFileURL(path.join(tmpDir, 'data/chronicles.mjs')).href);

  // Ensure localStorage calls are safely no-oped in Node
  globalThis.window = undefined;

  // 1. Validate organization weights and context tokens
  const totalWeight = orgData.ORG_TYPE_LIST.reduce((sum, o) => sum + o.weight, 0);
  assert.equal(totalWeight, 100, `Expected ORG_TYPE_LIST weights to sum to 100, got ${totalWeight}`);

  for (const org of orgData.ORG_TYPE_LIST) {
    assert.ok(orgData.ORG_CONTEXT_TOKENS[org.id], `Missing ORG_CONTEXT_TOKENS for ${org.id}`);
    assert.ok(org.allowedRoles.length > 0, `No allowedRoles for ${org.id}`);
    assert.ok(
      !/[（）()]/.test(org.legalForm) && !/[（）()]/.test(org.sizeLabel),
      `Avoid nested parentheses in ${org.id} legalForm/sizeLabel`
    );
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

  // Ensure newly hired player never receives tenure-gated, mismatched-housing/rel/region routine lines
  const newHireState = sim.buildStateFromConfig(
    {
      orgType: 'industrial_union',
      role: 'union_organizer',
      region: 'non_six_rural',
      background: 'independent',
      employmentType: 'regular',
      startAge: 38,
      pace: 'standard',
    },
    false,
    () => 0.5
  );
  newHireState.lifeStatus.relationship = 'single';
  newHireState.lifeStatus.housing = 'with_parents';

  const forbiddenForNewHire = ['五年來', '十年', '紀念日', '捷運站外的小套房', '人團會務規範'];
  for (let i = 0; i < 400; i++) {
    const line = chronicles.pickRoutineLine(newHireState);
    const fullText = `${line.title} ${line.text}`;
    for (const bad of forbiddenForNewHire) {
      assert.ok(
        !fullText.includes(bad),
        `Newly hired state must not receive routine line containing "${bad}", got: ${line.title}`
      );
    }
  }

  // Ensure veteran events require actual tenure (and succession requires orgYears)
  for (const id of [
    'life30_best_friend_leaves_npo',
    'life40_old_mentor_illness',
    'life50_succession_handover',
    'life40_found_welfare_assoc',
    'life40_found_advocacy_ngo',
    'life40_found_academic_society',
    'life40_found_new_union',
  ]) {
    const ev = sim.ALL_EVENTS.find((e) => e.id === id);
    assert.ok(ev, `Missing veteran event ${id}`);
    assert.ok(
      (ev.conditions?.minTenure ?? 0) >= 3,
      `Veteran event ${id} must require minTenure >= 3, got ${ev.conditions?.minTenure}`
    );
  }
  const successionEv = sim.ALL_EVENTS.find((e) => e.id === 'life50_succession_handover');
  assert.ok(
    (successionEv?.conditions?.minOrgYears ?? 0) >= 4,
    `life50_succession_handover must require minOrgYears >= 4`
  );

  // Ensure events acting as a subordinate reporting to a higher boss do not fire at top executive level (roleLevel === 3)
  for (const ev of sim.ALL_EVENTS) {
    const c = ev.conditions || {};
    if (c.maxRoleLevel !== undefined && c.maxRoleLevel <= 2) continue;
    const text = JSON.stringify({ title: ev.title, narrative: ev.narrative, choices: ev.choices });
    for (const bad of ['敲開{bossTitle}辦公室', '執行長約談你', '秘書長召集']) {
      assert.ok(
        !text.includes(bad),
        `Event ${ev.id} eligible at roleLevel=3 must not contain subordinate wording "${bad}"`
      );
    }
  }

  // Validate v0.23 structural coverage & routine linter
  const rookieEvs = sim.ALL_EVENTS.filter((e) => (e.conditions?.maxTenure ?? 99) <= 2);
  assert.ok(rookieEvs.length >= 4, `Expected >= 4 rookie events, got ${rookieEvs.length}`);

  const chainEvs = sim.ALL_EVENTS.filter((e) => Boolean(e.conditions?.requiredFlag));
  assert.ok(chainEvs.length >= 6, `Expected >= 6 story-chain follow-up events, got ${chainEvs.length}`);

  const housingModEvs = sim.ALL_EVENTS.filter((e) =>
    e.choices.some((ch) => Boolean(ch.effect?.housing))
  );
  assert.ok(housingModEvs.length >= 5, `Expected >= 5 events modifying housing, got ${housingModEvs.length}`);

  const filialModEvs = sim.ALL_EVENTS.filter((e) =>
    e.choices.some((ch) => typeof ch.effect?.monthlyFilialDelta === 'number')
  );
  assert.ok(filialModEvs.length >= 2, `Expected >= 2 events modifying monthlyFilialDelta, got ${filialModEvs.length}`);

  for (const org of orgData.ORG_TYPE_LIST) {
    const exclusive = sim.ALL_EVENTS.filter(
      (e) => e.conditions?.orgTypes?.length === 1 && e.conditions.orgTypes[0] === org.id
    );
    assert.ok(exclusive.length >= 6, `Expected >= 6 exclusive events for ${org.id}, got ${exclusive.length}`);
  }

  const fieldworkRoutine = chronicles.ALL_ROUTINE_LINES.filter((r) => r.focuses?.includes('fieldwork'));
  assert.ok(fieldworkRoutine.length >= 4, `Expected >= 4 fieldwork routine lines, got ${fieldworkRoutine.length}`);
  const rookieRoutine = chronicles.ALL_ROUTINE_LINES.filter((r) => (r.maxOrgYears ?? 99) <= 1);
  assert.ok(rookieRoutine.length >= 4, `Expected >= 4 rookie routine lines, got ${rookieRoutine.length}`);
  for (const r of chronicles.ALL_ROUTINE_LINES) {
    assert.ok(!/\{[a-zA-Z0-9_]+\}/.test(`${r.title} ${r.text}`), `Routine line "${r.title}" contains uninterpolated token`);
    if (r.orgTypes?.includes('industrial_union')) {
      assert.ok(!`${r.title} ${r.text}`.includes('廠區出入口'), `Enterprise union routine line must not mention 廠區出入口`);
    }
  }

  // Validate role title override, management allowance, and car loan ledger calculations
  const mgrState = sim.buildStateFromConfig(
    {
      orgType: 'advocacy_ngo',
      role: 'fundraiser_pr',
      region: 'taipei_metro',
      background: 'independent',
      employmentType: 'regular',
      startAge: 30,
      pace: 'compact',
    },
    false,
    () => 0.5
  );
  mgrState.roleLevel = 3;
  mgrState.customRoleTitle = '專任秘書長';
  assert.equal(sim.getRoleDisplayTitle(mgrState), '專任秘書長');
  const mgrInc = sim.calculateMonthlyIncome(mgrState);
  assert.ok(mgrInc.managementAllowance >= 7000, `Expected managementAllowance >= 7000 at level 3, got ${mgrInc.managementAllowance}`);
  mgrState.lifeStatus.carLoanRemaining = 240000;
  mgrState.lifeStatus.monthlyCarLoan = 7200;
  const afterCarQuarter = sim.advanceQuarter(mgrState, () => 0.99);
  assert.equal(afterCarQuarter.lastExpenseBreakdown.carLoan, 7200);
  assert.equal(afterCarQuarter.lifeStatus.carLoanRemaining, 240000 - 7200 * 3);

  // Validate org transition automatically records target org name in milestones
  const jumpEvent = sim.ALL_EVENTS.find((e) => e.id === 'common_cross_sector_offer');
  assert.ok(jumpEvent, 'Missing common_cross_sector_offer');
  mgrState.pendingEvent = jumpEvent;
  const afterJump = sim.resolveEventChoice(mgrState, 0, () => 0.5);
  assert.ok(
    afterJump.milestones.some((m) => m.includes(afterJump.org.name)),
    `Org transition milestone must contain new org name "${afterJump.org.name}"`
  );

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
  const endReasons = {};
  const statSums = { energy: 0, purpose: 0, capital: 0, life: 0, impactScore: 0 };
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
    assert.ok(
      state.totalQuartersElapsed >= 8,
      `Simulation ${i} ended too early (${state.totalQuartersElapsed} quarters, reason=${state.endReason})`
    );
    const reason = state.endReason || 'unknown';
    endReasons[reason] = (endReasons[reason] || 0) + 1;
    statSums.energy += state.stats.energy;
    statSums.purpose += state.stats.purpose;
    statSums.capital += state.stats.capital;
    statSums.life += state.stats.life;
    statSums.impactScore += state.stats.impactScore;
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

  const avgStats = Object.fromEntries(
    Object.entries(statSums).map(([k, v]) => [k, Math.round((v / 120) * 10) / 10])
  );
  console.log(
    `[verify-sim] OK: ${orgData.ORG_TYPE_LIST.length} org types (weight=${totalWeight}), ${sim.ALL_EVENTS.length} events, ${chronicles.ALL_ROUTINE_LINES.length} routine lines, 120 simulated careers passed.`
  );
  console.log(`[verify-sim] Endings (120 runs): ${JSON.stringify(endReasons)} | Avg stats: ${JSON.stringify(avgStats)}`);
} finally {
  fs.rmSync(tmpDir, { recursive: true, force: true });
}
