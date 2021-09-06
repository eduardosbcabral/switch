import { getPipelines } from "../../azure";

export interface Pipeline {
  id: number,
  name: string,
  url: string
}

const run = async (): Promise<Array<Pipeline>> => {
  const response = await getPipelines();
  const pipelines = response.value;
  return pipelines.map((x: any) => {
    const definitionId = x._links.web.href.split('definitionId=')[1]
    const url = `https://${process.env.AZURE_DNS}/${process.env.AZURE_PROJECT}/_build?definitionId=${definitionId}`
    return { 
      id: x.id, 
      name: x.name, 
      url: url
    } as Pipeline
  });
}

export default {
  run
}