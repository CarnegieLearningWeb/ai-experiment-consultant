import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { displayNameForMetric } from './upgrade.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const TEMPLATE_DIR = join(__dirname, 'report-templates');

function loadTemplate(name) {
  return readFileSync(join(TEMPLATE_DIR, `${name}.md`), 'utf8');
}

const TEMPLATES = {
  setupGuide: loadTemplate('setup-guide'),
  experimentCreationGuide: loadTemplate('experiment-creation-guide'),
  clientIntegrationGuide: loadTemplate('client-integration-guide'),
  notesAndLimitations: loadTemplate('notes-and-limitations'),
};

// ============================================================================
// Substitution helpers — these render structured experiment fields into the
// chunks of markdown that the .md templates expect.
// ============================================================================

function substitute(template, ctx) {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    if (Object.hasOwn(ctx, key)) return ctx[key];
    return `{{${key}}}`;
  });
}

function renderDecisionPoint(dp) {
  return `- **Site:** \`${dp.site}\`\n- **Target:** \`${dp.target}\``;
}

function renderConditionsBlock(conditions) {
  const rows = conditions.map((c) => `| \`${c.code}\` | ${c.weight}% |`).join('\n');
  return `| Condition code | Weight |\n|---|---|\n${rows}`;
}

function renderMetricsBlock(metrics) {
  const lines = metrics.map((m) => {
    const display = displayNameForMetric(m);
    if (m.datatype === 'categorical') {
      const vals = (m.allowedValues || []).map((v) => `\`${v}\``).join(', ');
      return `- **${display}** — categorical, allowed values: ${vals}`;
    }
    return `- **${display}** — continuous`;
  });
  return lines.join('\n');
}

function renderConditionsBranchCode(conditions) {
  const blocks = conditions.map((c, i) => {
    const prefix = i === 0 ? 'if' : 'else if';
    return `${prefix} (assignment?.condition === '${c.code}') {\n  // TODO: render variant for '${c.code}'\n}`;
  });
  return blocks.join(' ');
}

function renderMetricsLogBlock(metrics) {
  if (!metrics.length) return '//   (no metrics defined)';
  return metrics
    .map((m) => {
      if (m.datatype === 'categorical') {
        const example = m.allowedValues?.[0] ?? 'VALUE';
        return `//   - metric '${m.key}' (categorical): upgrade.logMetric({ metric: '${m.key}', value: '${example}' });`;
      }
      return `//   - metric '${m.key}' (continuous): upgrade.logMetric({ metric: '${m.key}', value: <number> });`;
    })
    .join('\n');
}

// ============================================================================
// Section composers.
// ============================================================================

function composeExperimentDesign(experiment) {
  const conditionsTable = renderConditionsBlock(experiment.conditions);
  const metricsList = renderMetricsBlock(experiment.metrics);
  return [
    `**Name:** ${experiment.name}`,
    ``,
    `**Description:** ${experiment.description}`,
    ``,
    `**App context:** \`${experiment.appContext}\``,
    ``,
    `**Decision point:**`,
    renderDecisionPoint(experiment.decisionPoint),
    ``,
    `**Conditions:**`,
    ``,
    conditionsTable,
    ``,
    `**Metrics:**`,
    ``,
    metricsList,
    ``,
    `**Participants:** Include All  ·  **Assignment:** Individual, between-subject`,
  ].join('\n');
}

function composeSimulationSummary(sim) {
  if (!sim) return null;
  const enrollmentRows = Object.entries(sim.enrollment || {})
    .map(([cond, n]) => `| \`${cond}\` | ${n} |`)
    .join('\n');

  const queryBlocks = (sim.queries || []).map((q) => {
    const rows = Object.entries(q.byCondition || {})
      .map(([cond, v]) => `| \`${cond}\` | ${v ?? '—'} |`)
      .join('\n');
    return `**${q.display ?? q.metric}**\n\n| Condition | Statistic value |\n|---|---|\n${rows}`;
  });

  const parts = [
    `> Synthetic / preflight only — these numbers demonstrate UpGrade's data flow and do not predict real learning outcomes.`,
    ``,
    `**Cohort size:** ${sim.cohortSize}`,
    ``,
    `**Enrollment**`,
    ``,
    `| Condition | Participants |\n|---|---|\n${enrollmentRows}`,
  ];

  if (queryBlocks.length) {
    parts.push('', '**Metric results**', '', queryBlocks.join('\n\n'));
  }
  if (sim.interpretation) {
    parts.push('', sim.interpretation);
  }
  if (sim.warnings?.length) {
    parts.push(
      '',
      '**Warnings**',
      '',
      sim.warnings.map((w) => `- ${w}`).join('\n'),
    );
  }
  return parts.join('\n');
}

function composeImplementationTodos(items) {
  if (!items?.length) return null;
  return items.map((t) => `- ${t}`).join('\n');
}

function composeNextSteps(items) {
  if (!items?.length) return null;
  return items.map((t) => `- ${t}`).join('\n');
}

function composeSetupGuide(experiment) {
  return substitute(TEMPLATES.setupGuide, {
    app_context: experiment.appContext,
  });
}

function composeExperimentCreationGuide(experiment) {
  return substitute(TEMPLATES.experimentCreationGuide, {
    name: experiment.name,
    description: experiment.description,
    app_context: experiment.appContext,
    decision_point_block: renderDecisionPoint(experiment.decisionPoint),
    conditions_block: renderConditionsBlock(experiment.conditions),
    metrics_block: renderMetricsBlock(experiment.metrics),
  });
}

function composeClientIntegrationGuide(experiment) {
  return substitute(TEMPLATES.clientIntegrationGuide, {
    app_context: experiment.appContext,
    site: experiment.decisionPoint.site,
    target: experiment.decisionPoint.target,
    conditions_branch_code: renderConditionsBranchCode(experiment.conditions),
    metrics_log_block: renderMetricsLogBlock(experiment.metrics),
  });
}

// ============================================================================
// Top-level composer.
// ============================================================================

const SECTION_NUMBER = (n) => `${n}. `;

export function composeReport(input) {
  const {
    title,
    summary,
    appDescription,
    pageDescription,
    experimentIdea,
    hypothesis,
    experiment,
    simulationResult,
    simulationInterpretation,
    implementationTodos,
    notes,
    nextSteps,
    include = {},
  } = input;

  // Each entry: { num: 'auto-assigned', heading: string, body: string|null }
  // Sections with null body are skipped entirely.
  const sections = [];

  const push = (heading, body) => {
    if (body == null || body === '' ) return;
    sections.push({ heading, body });
  };

  push('Summary', summary);
  push('Learning App Description', appDescription);
  push('Page / Problem Description', pageDescription);
  push('Experiment Idea', experimentIdea);
  push('Hypothesis', hypothesis);
  push('Proposed UpGrade Experiment Design', composeExperimentDesign(experiment));

  if (include.simulationResult !== false && simulationResult) {
    const sim = { ...simulationResult };
    if (simulationInterpretation) sim.interpretation = simulationInterpretation;
    push('Simulation Result Summary', composeSimulationSummary(sim));
  }

  push('Implementation TODO List', composeImplementationTodos(implementationTodos));

  if (include.setupGuide !== false) {
    push('UpGrade Setup Guide', composeSetupGuide(experiment));
  }
  if (include.experimentCreationGuide !== false) {
    push('UpGrade Experiment Creation Guide', composeExperimentCreationGuide(experiment));
  }
  if (include.clientIntegrationGuide !== false) {
    push('Client Integration Guide', composeClientIntegrationGuide(experiment));
  }

  if (include.notesAndLimitations !== false) {
    const baseNotes = TEMPLATES.notesAndLimitations;
    const combined = notes ? `${baseNotes}\n\n${notes}` : baseNotes;
    push('Notes, Assumptions, and Limitations', combined);
  }

  push('Next Steps', composeNextSteps(nextSteps));

  // Render.
  const out = [`# ${title}`, ''];
  sections.forEach(({ heading, body }, i) => {
    out.push(`## ${SECTION_NUMBER(i + 1)}${heading}`, '', body, '');
  });
  return out.join('\n').trim() + '\n';
}
