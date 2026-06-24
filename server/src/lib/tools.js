import { runSimulation, RUN_SIMULATION_SCHEMA } from './tools/run-simulation.js';
import { generateReport, GENERATE_REPORT_SCHEMA } from './tools/generate-report.js';
import { searchPapersTool, SEARCH_PAPERS_SCHEMA } from './tools/search-papers.js';

// A tool definition:
//   {
//     name: string,
//     description: string,
//     input_schema: <JSON Schema>,            // exposed to Anthropic
//     run: async ({ input, emit, signal }) => any  // server-side execution
//   }
//
// `emit(event)` lets the tool stream progress events to the client during
// execution; the chat route wraps it to add tool_use_id + tool name.
// `signal` is an AbortSignal that fires when the client disconnects (user hit
// Stop). Long-running tools should check `signal.aborted` to stop early — but
// must still finish their own cleanup, which should NOT be tied to the signal.
// `run` returns the structured tool result that gets fed back to the model
// in the next round.

const REGISTRY = {
  search_papers: {
    name: 'search_papers',
    description:
      'PELE 2026 MiniMathApp demo Step 4 only. Call once with the exact input in ' +
      'the system prompt after the user accepts research grounding. The server ' +
      'returns a frozen result containing `selectedPapers`, `suggestedRefinement`, ' +
      'and `confirmationQuestion`. Present those fields exactly as instructed; ' +
      'do not rescore candidates or invent claims.',
    input_schema: SEARCH_PAPERS_SCHEMA,
    run: searchPapersTool,
  },
  run_simulation: {
    name: 'run_simulation',
    description:
      'PELE 2026 MiniMathApp demo Step 7 only. Call once after the separate ' +
      'simulation offer and the user\'s following yes. Use the exact experiment, ' +
      'cohort size, and syntheticSpecs from the system prompt. Summarize the ' +
      'completed structured result without guessing or changing values.',
    input_schema: RUN_SIMULATION_SCHEMA,
    run: runSimulation,
  },
  generate_report: {
    name: 'generate_report',
    description:
      'PELE 2026 MiniMathApp demo Step 8 only. Call once after the report offer ' +
      'and the user\'s following yes. Use the exact report fields, experiment, saved ' +
      'research papers, and simulation result from the system prompt and conversation. ' +
      'Afterward send only the fixed acknowledgement from the system prompt.',
    input_schema: GENERATE_REPORT_SCHEMA,
    run: generateReport,
  },
};

export function getToolDefinitionsForAnthropic() {
  return Object.values(REGISTRY).map((t) => ({
    name: t.name,
    description: t.description,
    input_schema: t.input_schema,
  }));
}

export function getTool(name) {
  return REGISTRY[name] || null;
}
