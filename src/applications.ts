import commands from "./commands"
import { Pipeline } from "./commands/pipelines/list"
import SwitchError from "./errors/switch_error";

export interface Application {
  id: string,
  name: string,
  url: string
}

let applications: Application[] = []

const updateApplications = async (pipelines?: Pipeline[]) => {

  let pipelinesResponse: Pipeline[];

  if (pipelines != null && pipelines?.length > 0) {
    pipelinesResponse = pipelines;
  } else {
    pipelinesResponse = await commands.pipelines()
  }
  
  applications = pipelinesResponse.map(({ id, usable_name, url }) => {
    return {
      id: id.toString(),
      name: usable_name,
      url: url
    } as Application
  })
}

const getApplication = (application: string): Application => {
  const app = applications.find(x => x.id === application || x.name == application)

  if(!app)
    throw new SwitchError('Pipeline not found.')

  return app;
}

export {
  updateApplications,
  getApplication,
  applications
}