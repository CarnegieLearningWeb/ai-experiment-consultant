import { v4 as uuidv4 } from 'uuid';
import { composeReport } from '../report.js';
import { log } from '../log.js';

// JSON Schema exposed to Anthropic. Reuses the structured `experiment` shape
// from run_simulation (so the AI can pass the same object) plus the dynamic
// AI-written prose sections.
export const GENERATE_REPORT_SCHEMA = {
  type: 'object',
  properties: {
    title: { type: 'string', description: 'Short title for the report, e.g. "Hint Button Experiment Plan".' },
    summary: {
      type: 'string',
      description:
        'One short paragraph that someone reading this report cold can use to understand what is being proposed.',
    },
    appDescription: { type: 'string', description: 'A paragraph describing the user\'s learning app.' },
    pageDescription: {
      type: 'string',
      description: "A paragraph describing the page / problem / interaction where the experiment will run.",
    },
    experimentIdea: {
      type: 'string',
      description: 'The core idea behind the proposed change. What is being added/changed/removed?',
    },
    hypothesis: {
      type: 'string',
      description: 'The testable hypothesis. Should be concrete, with a predicted direction.',
    },
    experiment: {
      type: 'object',
      description: 'The approved experiment design (same shape used by run_simulation).',
      properties: {
        name: { type: 'string' },
        description: { type: 'string' },
        appContext: {
          type: 'string',
          description:
            "Use the app context name the user has been speaking in chat (e.g. 'ExampleMathApp'), NOT the server-side simulation override.",
        },
        decisionPoint: {
          type: 'object',
          properties: { site: { type: 'string' }, target: { type: 'string' } },
          required: ['site', 'target'],
        },
        conditions: {
          type: 'array',
          minItems: 2,
          maxItems: 3,
          items: {
            type: 'object',
            properties: {
              code: { type: 'string' },
              weight: { type: 'number' },
            },
            required: ['code', 'weight'],
          },
        },
        metrics: {
          type: 'array',
          minItems: 1,
          maxItems: 3,
          items: {
            type: 'object',
            properties: {
              key: { type: 'string' },
              datatype: { type: 'string', enum: ['categorical', 'continuous'] },
              allowedValues: { type: 'array', items: { type: 'string' }, maxItems: 3 },
              query: {
                type: 'object',
                properties: {
                  operationType: { type: 'string' },
                  compareFn: { type: 'string' },
                  compareValue: { type: 'string' },
                },
                required: ['operationType'],
              },
            },
            required: ['key', 'datatype', 'query'],
          },
        },
      },
      required: ['name', 'description', 'appContext', 'decisionPoint', 'conditions', 'metrics'],
    },
    simulationResult: {
      type: 'object',
      description:
        'Optional. If run_simulation produced a result earlier in this conversation, pass the same structured result back so the report can include it.',
      properties: {
        cohortSize: { type: 'integer' },
        enrollment: { type: 'object', additionalProperties: { type: 'integer' } },
        queries: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              metric: { type: 'string' },
              display: { type: 'string' },
              byCondition: { type: 'object', additionalProperties: { type: 'number' } },
            },
          },
        },
        warnings: { type: 'array', items: { type: 'string' } },
      },
    },
    simulationInterpretation: {
      type: 'string',
      description:
        'Optional. A short paragraph interpreting the simulation result (which condition looked better, what to read into it). Only used if simulationResult is also provided.',
    },
    implementationTodos: {
      type: 'array',
      items: { type: 'string' },
      description: 'Concrete TODO items for the developer who will implement the experiment.',
    },
    notes: {
      type: 'string',
      description:
        'Optional. Extra notes / assumptions / limitations specific to this experiment. Appended to the fixed-template disclaimer.',
    },
    nextSteps: {
      type: 'array',
      items: { type: 'string' },
      description: 'Short list of recommended next actions for the user.',
    },
    include: {
      type: 'object',
      description:
        "Optional section toggles. Defaults are all true. Set a section to false if the user explicitly asked to exclude it. Recognized keys: simulationResult, setupGuide, experimentCreationGuide, clientIntegrationGuide, notesAndLimitations.",
      additionalProperties: { type: 'boolean' },
    },
  },
  required: ['title', 'summary', 'appDescription', 'pageDescription', 'experimentIdea', 'hypothesis', 'experiment'],
};

export async function generateReport({ input, emit }) {
  const title = input.title || 'Experiment Plan';
  log.tool('compose report', {
    title,
    sections: Object.keys(input).filter((k) => input[k] != null).length,
    hasSimulation: !!input.simulationResult,
  });

  const markdown = composeReport(input);
  const artifactId = `rpt_${uuidv4().slice(0, 8)}`;

  // Emit the artifact alongside the standard tool_progress channel — the chat
  // route forwards anything we emit. The client recognizes type: "artifact"
  // and opens the side panel.
  emit({
    type: 'artifact',
    artifactId,
    kind: 'markdown',
    title,
    content: markdown,
  });

  return {
    artifactId,
    title,
    bytes: markdown.length,
  };
}
