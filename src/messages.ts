import { Application, applications } from "./applications";
import { Pipeline } from "./commands/pipelines/list";
import { Run } from "./commands/runs/list";
import SwitchError from "./errors/switch_error";

export interface Messages {
  command: (user: string, command: string) => string,
  pipelines: PipelinesMessage,
  runs: RunsMessage,
  deploy: DeployMessage,
  error: ErrorMessage,
}

export interface PipelinesMessage {
  title: string,
  section: (pipelines: Pipeline[]) => string
}

export interface RunsMessage {
  title: (count: string, application: Application) => string,
  section: (runs: Run[]) => string
}

export interface DeployMessage {
  title: (branchName: string) => string
}

export interface ErrorMessage {
  default: (error: any) => string,
}

const pipelinesMessages: PipelinesMessage = {
  title: `Here is a list of all pipelines for <https://${process.env.AZURE_DNS}/${process.env.AZURE_PROJECT}/_build|*${process.env.AZURE_ORGANIZATION}/${process.env.AZURE_PROJECT}*>\n`,
  section: (pipelines: Pipeline[]) => {
    let pipelinesSection = ''
    pipelines.forEach(x => pipelinesSection += `id: *${x.id}* | *<${x.url}|${x.usable_name}>*\n`)
    return pipelinesSection
  }
}

const runsMessages: RunsMessage = {
  title: (count: string, application: Application) => `Here are the latest ${count} runs for <${application.url}|${application.name}>\n`,
  section: (runs: Run[]) => {
    let runsSection = ''
    runs.forEach(x => runsSection+= `*<${x.url}|${x.name}>* - ${x.creation_date}\n`)

    if (runsSection.length > 2900) {
      const lastLine = runsSection.slice(0, 2900).lastIndexOf('\n') + 1
      runsSection = runsSection.slice(0, lastLine)
      runsSection += '>...'
    }

    return runsSection
  },
}

const deployMessages: DeployMessage = {
  title: (branchName: string) => {  
    return `Deploying application using the branch: ${branchName}`
  }
}

const errorMessages: ErrorMessage = {
  default: (error: Error) => error instanceof SwitchError ? 
    error.message : 
    `An error has ocurred when using the command. Error: ${error.message}` 
}

export default {
  command: (user: string, command: string) => `*Triggered command:* ${command}\n*By:* <@${user}>\n`,
  pipelines: pipelinesMessages,
  runs: runsMessages,
  deploy: deployMessages,
  error: errorMessages
} as Messages