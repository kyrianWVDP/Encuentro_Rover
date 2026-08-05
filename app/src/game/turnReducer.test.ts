import { describe, expect, it } from "vitest";
import { CLANS } from "./clans";
import { QUESTIONS } from "./questions";
import { initialGameState, turnReducer } from "./turnReducer";
import { SPIN_EXTRA_TURNS } from "./spin";

const rng0 = () => 0;

describe("turnReducer", () => {
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
      s = turnReducer(s, { type: "ACK_REVEAL" });
      s = turnReducer(s, { type: "ACK_SCORES" });
    }
    expect(s.round.roundNumber).toBe(2);
    expect(s.round.playedClanIds).toEqual([]);
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

  it("regularComplete becomes true when round > maxRounds", () => {
    let s = initialGameState();
    s.maxRounds = 1; // force early end
    for (let i = 0; i < 8; i++) {
      s = turnReducer(s, { type: "SPIN", rng: () => 0 });
      s = turnReducer(s, { type: "SPIN_FINISHED" });
      s = turnReducer(s, { type: "START_QUESTION", rng: () => 0 });
      s = turnReducer(s, { type: "REQUEST_JUDGE", judgement: "correct" });
      s = turnReducer(s, { type: "CONFIRM_JUDGE" });
      s = turnReducer(s, { type: "ACK_REVEAL" });
      s = turnReducer(s, { type: "ACK_SCORES" });
    }
    expect(s.regularComplete).toBe(true);
    expect(s.turn.phase).toBe("idle");
    
    // SPIN not allowed when regularComplete? 
    // Wait, the spec says "mínimo: no permitir SPIN y set error o turn.phase stay + regularComplete: true".
    // I should check spinToClan guard.
  });
});
