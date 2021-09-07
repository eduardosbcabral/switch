import commands from "..";
import { getApplication, updateApplications } from "../../applications";
import { 
  runPipeline 
} from "../../azure";
import SwitchError from "../../errors/switch_error";

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

  await runPipeline(application, branchName, preview)
}

export default {
  run
}