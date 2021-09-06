import { Pipeline } from "./commands/pipelines/list";
import { Run } from "./commands/runs/list";

export interface Messages {
  pipelines: PipelinesMessage,
  runs: RunsMessage,
  deploy: DeployMessage
}

export interface PipelinesMessage {
  default: string,
  section: (pipelines: Pipeline[]) => string
}

export interface RunsMessage {
  default: (size: string) => string,
  section: (runs: Run[]) => string
}

export interface DeployMessage {
  default: (branchName: string) => string
}

export default {
  pipelines: {
    default: `Here is a list of all pipelines for <https://${process.env.AZURE_DNS}/${process.env.AZURE_PROJECT}/_build|*${process.env.AZURE_ORGANIZATION}/${process.env.AZURE_PROJECT}*>\n`,
    section: (pipelines: Pipeline[]) => {
      let pipelinesSection = ''
      pipelines.forEach(x => pipelinesSection += `>id: ${x.id} - *<${x.url}|${x.name}>*\n`)
      return pipelinesSection
    }
  },
  runs: {
    default: (count: string, application: string) => `Here are the latest ${count} runs for ${application}\n`,
    section: (runs: Run[]) => {
      let runsSection = ''
      runs.forEach(x => runsSection+= `>*<${x.url}|${x.name}>* - ${x.creation_date}\n`)

      if (runsSection.length > 2900) {
        const lastLine = runsSection.slice(0, 2900).lastIndexOf('\n') + 1
        runsSection = runsSection.slice(0, lastLine)
        runsSection += '>...'
      }

      return runsSection
    }
  },
  deploy: {
    default: (branchName: string) => `Deploying application using the branch: ${branchName}`
  }
} as Messages