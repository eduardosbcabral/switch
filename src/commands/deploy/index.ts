import { 
  runPipeline 
} from "../../azure";
import InvalidParameterError from "../../errors/invalid_parameter_error";

const run = async (pipelineId: string, branchName: string) => {

  if(!pipelineId) {
    throw new InvalidParameterError("Parameter 'pipelineId' is required.");
  }

  if(!branchName) {
    throw new InvalidParameterError("Parameter 'branchName' is required.");
  }

  await runPipeline(pipelineId, branchName)
}

export default {
  run
}