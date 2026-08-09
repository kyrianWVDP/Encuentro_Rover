import { describe, expect, it, beforeEach } from "vitest";
import { CLANS } from "./clans";
import { QUESTIONS } from "./questions";
import { initialGameState, turnReducer } from "./turnReducer";
import { SPIN_EXTRA_TURNS } from "./spin";
import { defaultEventConfig, saveEventConfig } from "./eventConfig";

const rng0 = () => 0;

describe("turnReducer", () => {
  beforeEach(() => {
    const store = new Map<string, string>();
    globalThis.localStorage = {
      getItem: (key: string) => store.get(key) || null,
      setItem: (key: string, value: string) => store.set(key, value),
      removeItem: (key: string) => store.delete(key),
      clear: () => store.clear(),
      key: (n: number) => Array.from(store.keys())[n] ?? null,
      length: 0,
    } as Storage;
    saveEventConfig(defaultEventConfig());
  });

  it("SPIN selects a pending clan without marking played", () => {
    const s1 = turnReducer(initialGameState(), { type: "SPIN", rng: rng0 });
    expect(s1.turn.phase).toBe("spinning");
    expect(s1.turn.selectedClanId).toBe(CLANS[0].id);
    expect(s1.round.playedClanIds).toEqual([]);
  });

  it("RESPIN does not consume clan or question", () => {
    let s = turnReducer(initialGameState(), { type: "SPIN", rng: rng0 });
    s = turnReducer(s, { type: "SPIN_FINISHED" });
    const before = structuredClone(s.round);
    s = turnReducer(s, { type: "RESPIN", rng: () => 0.9 });
    expect(s.round).toEqual(before);
    expect(s.turn.phase).toBe("spinning");
  });

  it("START_QUESTION uses a question and starts timer", () => {
    let s = turnReducer(initialGameState(), { type: "SPIN", rng: rng0 });
    s = turnReducer(s, { type: "SPIN_FINISHED" });
    const nowMs = 1000;
    s = turnReducer(s, { type: "START_QUESTION", rng: rng0, nowMs });
    
    expect(s.turn.phase).toBe("questionRunning");
    expect(s.round.usedQuestionIds).toContain(QUESTIONS[0].id);
    // Clan is NOT played yet
    expect(s.round.playedClanIds).not.toContain(CLANS[0].id);
    expect(s.timer?.running).toBe(true);
    expect(s.timer?.endsAt).toBe(nowMs + 60_000);
  });

  it("REQUEST_JUDGE alone does not change scores", () => {
    let s = turnReducer(initialGameState(), { type: "SPIN", rng: rng0 });
    s = turnReducer(s, { type: "SPIN_FINISHED" });
    s = turnReducer(s, { type: "START_QUESTION", rng: rng0 });
    
    const beforeScores = { ...s.scores };
    s = turnReducer(s, { type: "REQUEST_JUDGE", judgement: "correct" });
    
    expect(s.turn.phase).toBe("awaitingJudgement");
    expect(s.scores).toEqual(beforeScores);
    expect(s.pendingJudgement).toBe("correct");
    // Timer is stopped
    expect(s.timer?.running).toBe(false);
  });

  it("CONFIRM_JUDGE correct adds 10, marks played, reveals answer", () => {
    let s = turnReducer(initialGameState(), { type: "SPIN", rng: rng0 });
    s = turnReducer(s, { type: "SPIN_FINISHED" });
    s = turnReducer(s, { type: "START_QUESTION", rng: rng0 });
    s = turnReducer(s, { type: "REQUEST_JUDGE", judgement: "correct" });
    
    const clanId = s.turn.selectedClanId!;
    s = turnReducer(s, { type: "CONFIRM_JUDGE" });
    
    expect(s.turn.phase).toBe("revealAnswer");
    expect(s.scores[clanId]).toBe(10);
    expect(s.lastJudgement).toBe("correct");
    expect(s.pendingJudgement).toBeNull();
    expect(s.round.playedClanIds).toContain(clanId);
  });

  it("START_QUESTION -> STOP_TIMER -> REQUEST_JUDGE -> CONFIRM_JUDGE works", () => {
    let s = turnReducer(initialGameState(), { type: "SPIN", rng: rng0 });
    s = turnReducer(s, { type: "SPIN_FINISHED" });
    s = turnReducer(s, { type: "START_QUESTION", rng: rng0 });
    
    s = turnReducer(s, { type: "STOP_TIMER" });
    expect(s.turn.phase).toBe("awaitingJudgement");
    expect(s.timer?.running).toBe(false);

    s = turnReducer(s, { type: "REQUEST_JUDGE", judgement: "correct" });
    expect(s.turn.phase).toBe("awaitingJudgement");
    expect(s.pendingJudgement).toBe("correct");

    const clanId = s.turn.selectedClanId!;
    s = turnReducer(s, { type: "CONFIRM_JUDGE" });
    
    expect(s.turn.phase).toBe("revealAnswer");
    expect(s.scores[clanId]).toBe(10);
  });

  it("CONFIRM_JUDGE incorrect leaves score unchanged (+0)", () => {
    let s = turnReducer(initialGameState(), { type: "SPIN", rng: rng0 });
    s = turnReducer(s, { type: "SPIN_FINISHED" });
    s = turnReducer(s, { type: "START_QUESTION", rng: rng0 });
    s = turnReducer(s, { type: "REQUEST_JUDGE", judgement: "incorrect" });
    
    const clanId = s.turn.selectedClanId!;
    const beforeScore = s.scores[clanId];
    s = turnReducer(s, { type: "CONFIRM_JUDGE" });
    
    expect(s.turn.phase).toBe("revealAnswer");
    expect(s.scores[clanId]).toBe(beforeScore);
    expect(s.lastJudgement).toBe("incorrect");
    expect(s.pendingJudgement).toBeNull();
  });

  it("RESTART_TIMER sets endsAt ~60s ahead", () => {
    let s = turnReducer(initialGameState(), { type: "SPIN", rng: rng0 });
    s = turnReducer(s, { type: "SPIN_FINISHED" });
    s = turnReducer(s, { type: "START_QUESTION", rng: rng0, nowMs: 0 });
    
    s = turnReducer(s, { type: "RESTART_TIMER", nowMs: 5000 });
    expect(s.timer?.running).toBe(true);
    expect(s.timer?.endsAt).toBe(5000 + 60_000);
  });

  it("ABORT_TURN_RESPIN restores question to unused", () => {
    let s = turnReducer(initialGameState(), { type: "SPIN", rng: rng0 });
    s = turnReducer(s, { type: "SPIN_FINISHED" });
    s = turnReducer(s, { type: "START_QUESTION", rng: rng0 });
    
    const qId = s.turn.selectedQuestionId;
    expect(s.round.usedQuestionIds).toContain(qId);
    
    s = turnReducer(s, { type: "ABORT_TURN_RESPIN", rng: () => 0.5 });
    
    expect(s.round.usedQuestionIds).not.toContain(qId);
    expect(s.turn.phase).toBe("spinning");
    expect(s.timer).toBeNull();
    expect(s.turn.selectedQuestionId).toBeNull();
  });

  it("advances round after 8 complete cycles", () => {
    let s = initialGameState();
    for (let i = 0; i < 8; i++) {
      s = turnReducer(s, { type: "SPIN", rng: () => 0 });
      s = turnReducer(s, { type: "SPIN_FINISHED" });
      s = turnReducer(s, { type: "START_QUESTION", rng: () => 0 });
      s = turnReducer(s, { type: "REQUEST_JUDGE", judgement: "incorrect" });
      s = turnReducer(s, { type: "CONFIRM_JUDGE" });
      const isLastOfRound = i === 7;
      expect(s.roundScoresPending).toBe(isLastOfRound);
      s = turnReducer(s, { type: "ACK_REVEAL" });
      if (isLastOfRound) {
        expect(s.turn.phase).toBe("showScores");
        s = turnReducer(s, { type: "ACK_SCORES" });
      } else {
        expect(s.turn.phase).toBe("idle");
      }
    }
    expect(s.round.roundNumber).toBe(2);
    expect(s.round.playedClanIds).toEqual([]);
  });

  it("skips score table mid-round and shows it only when the round completes", () => {
    saveEventConfig({ ...defaultEventConfig(), clans: CLANS.slice(0, 2) as any });
    let s = initialGameState(CLANS.slice(0, 2).map((c) => c.id));

    s = turnReducer(s, { type: "SPIN", rng: () => 0 });
    s = turnReducer(s, { type: "SPIN_FINISHED" });
    s = turnReducer(s, { type: "START_QUESTION", rng: () => 0 });
    s = turnReducer(s, { type: "REQUEST_JUDGE", judgement: "correct" });
    s = turnReducer(s, { type: "CONFIRM_JUDGE" });
    expect(s.roundScoresPending).toBe(false);
    s = turnReducer(s, { type: "ACK_REVEAL" });
    expect(s.turn.phase).toBe("idle");

    s = turnReducer(s, { type: "SPIN", rng: () => 0.99 });
    s = turnReducer(s, { type: "SPIN_FINISHED" });
    s = turnReducer(s, { type: "START_QUESTION", rng: () => 0 });
    s = turnReducer(s, { type: "REQUEST_JUDGE", judgement: "incorrect" });
    s = turnReducer(s, { type: "CONFIRM_JUDGE" });
    expect(s.roundScoresPending).toBe(true);
    s = turnReducer(s, { type: "ACK_REVEAL" });
    expect(s.turn.phase).toBe("showScores");
    s = turnReducer(s, { type: "ACK_SCORES" });
    expect(s.turn.phase).toBe("idle");
    expect(s.roundScoresPending).toBe(false);
  });

  it("successive spins produce a rotation delta >= SPIN_EXTRA_TURNS * 360 - small tolerance", () => {
    let s = initialGameState();
    s = turnReducer(s, { type: "SPIN", rng: () => 0 });
    const rot1 = s.rotationDeg;
    
    s = turnReducer(s, { type: "SPIN_FINISHED" });
    s = turnReducer(s, { type: "START_QUESTION", rng: () => 0 });
    s = turnReducer(s, { type: "REQUEST_JUDGE", judgement: "correct" });
    s = turnReducer(s, { type: "CONFIRM_JUDGE" });
    s = turnReducer(s, { type: "ACK_REVEAL" });
    s = turnReducer(s, { type: "ACK_SCORES" });

    s = turnReducer(s, { type: "SPIN", rng: () => 0.5 });
    const rot2 = s.rotationDeg;
    
    expect(rot2 - rot1).toBeGreaterThanOrEqual(SPIN_EXTRA_TURNS * 360 - 720);
  });

  it("initialGameState uses maxRounds and timerSec from event config", () => {
    saveEventConfig({ ...defaultEventConfig(), maxRounds: 2, timerSec: 45 });
    const s = initialGameState();
    expect(s.maxRounds).toBe(2);
    expect(s.timerSec).toBe(45);
  });

  it("ends after maxRounds and opens finale (podium or tiebreak)", () => {
    saveEventConfig({ ...defaultEventConfig(), clans: CLANS.slice(0, 2) as any, maxRounds: 2 });
    let s = initialGameState(CLANS.slice(0, 2).map((c) => c.id));
    expect(s.maxRounds).toBe(2);

    // Two full rounds (2 clans × 2 rounds)
    for (let r = 0; r < 2; r++) {
      for (let i = 0; i < 2; i++) {
        s = turnReducer(s, { type: "SPIN", rng: () => (i === 0 ? 0 : 0.99) });
        s = turnReducer(s, { type: "SPIN_FINISHED" });
        s = turnReducer(s, { type: "START_QUESTION", rng: () => 0 });
        s = turnReducer(s, {
          type: "REQUEST_JUDGE",
          judgement: i === 0 ? "correct" : "incorrect",
        });
        s = turnReducer(s, { type: "CONFIRM_JUDGE" });
        s = turnReducer(s, { type: "ACK_REVEAL" });
        if (s.turn.phase === "showScores") {
          expect(s.round.roundNumber).toBe(r + 1); // still on finished round until ACK
          s = turnReducer(s, { type: "ACK_SCORES" });
        }
      }
    }

    expect(s.regularComplete).toBe(true);
    expect(s.mode).toBe("final");
    expect(s.turn.phase).toBe("final");
    expect(s.round.roundNumber).toBe(3); // advanced past maxRounds
  });

  it("regularComplete becomes true when round > maxRounds", () => {
    saveEventConfig({ ...defaultEventConfig(), clans: CLANS.slice(0, 2) as any });
    let s = initialGameState(CLANS.slice(0, 2).map((c) => c.id));
    s.maxRounds = 1;
    // Distinct scores so finale goes to podium, not tiebreak
    for (let i = 0; i < 2; i++) {
      s = turnReducer(s, { type: "SPIN", rng: () => (i === 0 ? 0 : 0.99) });
      s = turnReducer(s, { type: "SPIN_FINISHED" });
      s = turnReducer(s, { type: "START_QUESTION", rng: () => 0 });
      s = turnReducer(s, {
        type: "REQUEST_JUDGE",
        judgement: i === 0 ? "correct" : "incorrect",
      });
      s = turnReducer(s, { type: "CONFIRM_JUDGE" });
      s = turnReducer(s, { type: "ACK_REVEAL" });
      if (s.turn.phase === "showScores") {
        s = turnReducer(s, { type: "ACK_SCORES" });
      }
    }
    expect(s.regularComplete).toBe(true);
    expect(s.mode).toBe("final");
    expect(s.turn.phase).toBe("final");

    // SPIN not allowed when final
    s = turnReducer(s, { type: "SPIN", rng: () => 0 });
    expect(s.error).toBe("Juego terminado.");
  });

  it("BEGIN_FINALE without ties goes to final", () => {
    saveEventConfig({ ...defaultEventConfig(), clans: CLANS.slice(0, 3) as any });
    let s = initialGameState(CLANS.slice(0, 3).map(c => c.id));
    s.regularComplete = true;
    s.scores = {
      [CLANS[0].id]: 30,
      [CLANS[1].id]: 20,
      [CLANS[2].id]: 10,
    };
    s = turnReducer(s, { type: "BEGIN_FINALE" });
    expect(s.mode).toBe("final");
    expect(s.turn.phase).toBe("final");
    expect(s.tiebreakClanIds).toBeNull();
  });

  it("BEGIN_FINALE with ties goes to tiebreak and filters active clans", () => {
    saveEventConfig({ ...defaultEventConfig(), clans: CLANS.slice(0, 3) as any });
    let s = initialGameState(CLANS.slice(0, 3).map(c => c.id));
    s.regularComplete = true;
    s.scores = {
      [CLANS[0].id]: 30,
      [CLANS[1].id]: 30,
      [CLANS[2].id]: 10,
    };
    s = turnReducer(s, { type: "BEGIN_FINALE" });
    expect(s.mode).toBe("tiebreak");
    expect(s.tiebreakClanIds).toEqual([CLANS[0].id, CLANS[1].id]);

    // Spin in tiebreak should only select from the tied clans
    s = turnReducer(s, { type: "SPIN", rng: rng0 });
    expect(s.turn.selectedClanId).toBe(CLANS[0].id);
    expect(s.error).toBeNull();

    // Let's resolve the tie
    s = turnReducer(s, { type: "SPIN_FINISHED" });
    s = turnReducer(s, { type: "START_QUESTION", rng: rng0 });
    s = turnReducer(s, { type: "REQUEST_JUDGE", judgement: "correct" });
    s = turnReducer(s, { type: "CONFIRM_JUDGE" });
    
    // Still tiebreak mode, since not all clans in tiebreak group played yet
    expect(s.mode).toBe("tiebreak");
    
    // Check that usedQuestionIds grows properly in tiebreak
    expect(s.round.usedQuestionIds.length).toBe(1);

    // Second clan plays
    s = turnReducer(s, { type: "ACK_REVEAL" });
    s = turnReducer(s, { type: "ACK_SCORES" });
    s = turnReducer(s, { type: "SPIN", rng: () => 0.99 }); // will pick clan 1
    expect(s.turn.selectedClanId).toBe(CLANS[1].id);

    s = turnReducer(s, { type: "SPIN_FINISHED" });
    s = turnReducer(s, { type: "START_QUESTION", rng: rng0 });
    expect(s.round.usedQuestionIds.length).toBe(2);
    
    s = turnReducer(s, { type: "REQUEST_JUDGE", judgement: "incorrect" });
    s = turnReducer(s, { type: "CONFIRM_JUDGE" });

    // Tie is now broken (clan 0 has 40, clan 1 has 30), so mode should be final since no other ties exist
    expect(s.mode).toBe("final");
    expect(s.tiebreakClanIds).toBeNull();
    
    // Acknowledge reveal and scores, should end up in 'final' phase
    s = turnReducer(s, { type: "ACK_REVEAL" });
    s = turnReducer(s, { type: "ACK_SCORES" });
    
    expect(s.turn.phase).toBe("final");
  });
});
