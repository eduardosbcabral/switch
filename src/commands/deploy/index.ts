import commands from "..";
import { getApplication, updateApplications } from "../../applications";
import { 
  runPipeline 
} from "../../azure";
import SwitchError from "../../errors/switch_error";

export interface Deploy {
  build_name: string,
  repository: string,
  deploy_url: string,
  branch_name: string
}

const run = async (pipeline: string, branchName: string, stagingTag: string) => {

  if(!pipeline) {
    throw new SwitchError("Parameter 'pipeline' is required.")
  }

  if(!branchName) {
    throw new SwitchError("Parameter 'branch_name' is required.")
  }

  const pipelines = await commands.pipelines()
  await updateApplications(pipelines)

  const application = getApplication(pipeline)

  const deploy = await runPipeline(application, branchName, stagingTag)
  const buildId = deploy._links.web.href.split('buildId=')[1]
  const deploy_url = `https://${process.env.AZURE_DNS}/${process.env.AZURE_PROJECT}/_build/results?buildId=${buildId}`

  const repository = getRepository(deploy.resources)

  const spplited = repository.split('/tree/');

  const branch_name = spplited[1] ?? repository;

  return {
    build_name: deploy.name,
    repository: repository,
    deploy_url: deploy_url,
    branch_name: branch_name
  } as Deploy
}

const getRepository = (resources: any) => {
  if (!resources) return 'preview deploy'
  
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