import { getPipeline } from "./azure";
import commands from "./commands"
import { Pipeline } from "./commands/pipelines/list"
import SwitchError from "./errors/switch_error";

export interface Application {
  id: string,
  name: string,
  url: string
}

let applications: Application[] = []

const updateApplications = async (pipelines: Pipeline[]) => {

  if (applications != null && applications.length > 0) return;

  applications = await Promise.all(pipelines.map(async ({ id, usable_name, url }) => {
    return {
      id: id.toString(),
      name: usable_name,
      url: url
    } as Application
  }))
}

const getApplication = (application: string): Application => {
  const app = applications.find(x => x.id === application || x.name == application)

  if(!app)
    throw new SwitchError('Pipeline not found.')

  return app;
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