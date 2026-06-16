/*
 * MiniMathApp — minimal interactivity for the demo screen.
 *
 * This is ordinary answer-checking for a practice app (every practice app
 * validates an answer). It is NOT an experimental variant and there is no
 * hint/scaffolding feature here — proposing an intervention is exactly what
 * the AI Experiment Consultant does live during the demo.
 *
 * The correct area is 8 m x 5 m = 40 m². A wrong first try shows a gentle
 * "try again" so the presenter can screenshot the first-try pain point.
 */
(function () {
  "use strict";

  var CORRECT_ANSWER = 40; // 8 m x 5 m

  var form = document.getElementById("answer-form");
  var input = document.getElementById("answer-input");
  var feedback = document.getElementById("answer-feedback");
  var attemptsEl = document.getElementById("attempts");
  var skipBtn = document.getElementById("skip-btn");

  var attempts = 1;

  function setFeedback(message, state) {
    feedback.textContent = message;
    feedback.className = "answer__feedback " + (state ? "is-" + state : "");
  }

  function onSubmit(event) {
    event.preventDefault();

    var raw = input.value.trim();
    if (raw === "") {
      setFeedback("Type a number to check your answer.", "neutral");
      input.focus();
      return;
    }

    var value = Number(raw);
    if (Number.isNaN(value)) {
      setFeedback("Please enter a number.", "neutral");
      return;
    }

    if (value === CORRECT_ANSWER) {
      setFeedback("Correct — nice work! The garden's area is 40 m².", "correct");
      return;
    }

    // Wrong answer: count the attempt, encourage another try. No hint by design.
    attempts += 1;
    attemptsEl.textContent = "Attempt " + attempts;
    setFeedback("Not quite — give it another try.", "incorrect");
    input.select();
  }

  function onSkip() {
    setFeedback("Skipped for now — you can come back to this one later.", "neutral");
  }

  if (form) form.addEventListener("submit", onSubmit);
  if (skipBtn) skipBtn.addEventListener("click", onSkip);
})();
