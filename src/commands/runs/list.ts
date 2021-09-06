import { 
  getPipelineRuns 
} from "../../azure";
import InvalidParameterError from "../../errors/invalid_parameter_error";

export interface Run {
  id: number,
  name: string,
  url: string,
  state: string,
  result: string,
  creation_date: string
}

const run = async (pipelineId: string, size: string): Promise<Array<Run>> => {

  if(!pipelineId) {
    throw new InvalidParameterError("Parameter 'pipelineId' is required.");
  }

  const response = await getPipelineRuns(pipelineId);

  const pipelines = response.value.slice(0, size);
  return pipelines.map((x: any) => {
    const buildId = x._links.web.href.split('buildId=')[1]
    const url = `https://${process.env.AZURE_DNS}/${process.env.AZURE_PROJECT}/_build/results?buildId=${buildId}`
    return { 
      id: x.id, 
      name: x.name, 
      url: url,
      state: x.state,
      result: x.result,
      creation_date: new Date(x.createdDate).toUTCString()
    } as Run
  });
}

export default {
  run
}