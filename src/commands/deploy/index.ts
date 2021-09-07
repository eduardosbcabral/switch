import commands from "..";
import { getApplication, updateApplications } from "../../applications";
import { 
  runPipeline 
} from "../../azure";
import SwitchError from "../../errors/switch_error";

export interface Deploy {
  build_name: string,
  repository: string,
  deploy_url: string
}

const run = async (pipeline: string, branchName: string, preview: boolean) => {

  if(!pipeline) {
    throw new SwitchError("Parameter 'pipeline' is required.");
  }

  if(!branchName) {
    throw new SwitchError("Parameter 'branch_name' is required.");
  }

  const pipelines = await commands.pipelines()
  await updateApplications(pipelines)

  const application = getApplication(pipeline)

  const deploy = await runPipeline(application, branchName, preview)
  const buildId = deploy._links.web.href.split('buildId=')[1]
  const deploy_url = `https://${process.env.AZURE_DNS}/${process.env.AZURE_PROJECT}/_build/results?buildId=${buildId}`

  return {
    build_name: deploy.name,
    repository: getRepository(deploy.resources),
    deploy_url: deploy_url
  } as Deploy
}

const getRepository = (resources: any) => {
  const { repositories } = resources
  const { self } = repositories
  const { refName, repository } = self
  const { fullName, type } = repository

  if(type === 'gitHub')
    return `https://github.com/${fullName}/tree/${refName.replace('refs/heads/', '')}`

  return fullName
}

export default {
  run
}