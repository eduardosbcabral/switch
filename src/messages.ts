import { Application, applications } from "./applications";
import { Deploy } from "./commands/deploy";
import { Pipeline } from "./commands/pipelines/list";
import { Run } from "./commands/runs/list";
import SwitchError from "./errors/switch_error";

export interface Messages {
  principal: CommandMessage,
  pipelines: PipelinesMessage,
  runs: RunsMessage,
  deploy: DeployMessage,
  error: ErrorMessage,
}

interface CommandMessage {
  command: (command: string) => string,
  by: (user: string) => string
}

export interface PipelinesMessage {
  title: string,
  section: (pipelines: Pipeline[]) => string
}

export interface RunsMessage {
  title: (count: string, application: Application) => string,
  section: (runs: Run[], application: Application) => string
}

export interface DeployMessage {
  title: (application: Application, deploy: Deploy, stagingTag: string) => string,
  branch_not_found: (branchName: string) => string
}

export interface ErrorMessage {
  default: (error: any) => string,
}

const commandMessages: CommandMessage = {
  command: (command: string) => `*Triggered command:*\n ${command}`,
  by: (user: string) => `*By:*\n <@${user}>`
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
  section: (runs: Run[], application: Application) => {
    let runsSection = ''
    runs.forEach(x => runsSection+= `*<${x.url}|${x.name}>* - ${x.creation_date}\n`)

    if (runsSection.length > 2900) {
      const lastLine = runsSection.slice(0, 2900).lastIndexOf('\n') + 1
      runsSection = runsSection.slice(0, lastLine)
      runsSection += `... To show more runs click <${application.url}|here>`
    }

    return runsSection
  },
}

const deployMessages: DeployMessage = {
  title: (application: Application, deploy: Deploy, stagingTag: string) =>
    `Deploying <${deploy.deploy_url}|${application.name} ${deploy.build_name ? `(${deploy.build_name})` : ''}> using the branch <${deploy.repository}|${deploy.branch_name}> ${stagingTag ? `and tag ${stagingTag}`:''} `,
  branch_not_found: (branchName: string) => 
    `Branch with the name *\'${branchName}\'* not found. Check the repository for the correct one.`
}

const errorMessages: ErrorMessage = {
  default: (error: Error) => error instanceof SwitchError ? 
    error.message : 
    `An error has ocurred when using the command. Error: ${error.message}` 
}

export default {
  principal: commandMessages,
  pipelines: pipelinesMessages,
  runs: runsMessages,
  deploy: deployMessages,
  error: errorMessages
} as Messages