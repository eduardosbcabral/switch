import { getPipeline } from "./azure";
import commands from "./commands"
import { Pipeline } from "./commands/pipelines/list"
import SwitchError from "./errors/switch_error";

export interface Application {
  id: string,
  name: string,
  url: string,
  repository: string
}

let applications: Application[] = []

const updateApplications = async (pipelines: Pipeline[]) => {

  if (applications != null && applications.length > 0) return;

  console.log('[APPLICATIONS]: UPDATED ======================================')

  applications = await Promise.all(pipelines.map(async ({ id, usable_name, url }) => {
    return {
      id: id.toString(),
      name: usable_name,
      url: url,
      repository: await getRepository(id.toString())
    } as Application
  }))
}

const getApplication = (application: string): Application => {
  const app = applications.find(x => x.id === application || x.name == application)

  if(!app)
    throw new SwitchError('Pipeline not found.')

  return app;
}

const getRepository = async (applicationId: string) => {
  const { configuration } = await getPipeline(applicationId);
  const { repository } = configuration
  const { fullName, type } = repository
  if(type === 'gitHub')
    return `https://github.com/${fullName}`

  return fullName
}

const reloadApplications = async () => {
  applications = [];
  const pipelines = await commands.pipelines()
  await updateApplications(pipelines);
}

export {
  updateApplications,
  getApplication,
  applications,
  reloadApplications
}