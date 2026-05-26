import { runSimulation, RUN_SIMULATION_SCHEMA } from './tools/run-simulation.js';
import { generateReport, GENERATE_REPORT_SCHEMA } from './tools/generate-report.js';

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
// `signal` is reserved for future cancellation support (not wired yet).
// `run` returns the structured tool result that gets fed back to the model
// in the next round.

const REGISTRY = {
  run_simulation: {
    name: 'run_simulation',
    description:
      'Run a synthetic preflight experiment against the demo UpGrade backend. ' +
      'Creates a temporary experiment, simulates the requested cohort of synthetic ' +
      'participants (no real users), retrieves enrollment + metric results, and cleans ' +
      'up after itself. Returns structured result data plus warnings; the assistant ' +
      "should then format these into a markdown summary for the user and emphasize that " +
      'the numbers are preflight/synthetic, not predictive of real outcomes. ' +
      'Use this tool when the user has approved an experiment design and wants to see ' +
      'how assignment, enrollment, and metric logging would behave in UpGrade.',
    input_schema: RUN_SIMULATION_SCHEMA,
    run: runSimulation,
  },
  generate_report: {
    name: 'generate_report',
    description:
      'Compose the final markdown experiment-plan report and open it in the side panel ' +
      'on the right. The server composes the report by combining your dynamic prose ' +
      '(app description, hypothesis, etc.) with deterministic templates for the setup / ' +
      'experiment-creation / client-integration / notes sections. You do NOT need to write ' +
      "the full report — pass the structured pieces and the templates fill in the rest. " +
      'After the tool returns, reply with one short sentence acknowledging the panel is ' +
      "ready (don't repeat the report content in chat). Call this tool only after the user " +
      'has approved the sections to include.',
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
