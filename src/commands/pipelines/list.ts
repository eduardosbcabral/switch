import { getPipelines } from "../../azure";
import { updateApplications } from '../../applications'

export interface Pipeline {
  id: number,
  name: string,
  usable_name: string,
  url: string
}

const run = async (): Promise<Array<Pipeline>> => {
  const response = await getPipelines()
  const pipelinesResponse = response.value
  const pipelines = pipelinesResponse.map((x: any) => {
    const definitionId = x._links.web.href.split('definitionId=')[1]
    const url = `https://${process.env.AZURE_DNS}/${process.env.AZURE_PROJECT}/_build?definitionId=${definitionId}`
    return { 
      id: x.id, 
      name: x.name,
      usable_name: toSnakeCase(x.name.replace(`${process.env.AZURE_ORGANIZATION}.`, '')),
      url: url
    } as Pipeline
  });

  await updateApplications(pipelines)

  return pipelines
}

const toSnakeCase = (str: string) =>
  str &&
  str
    .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)!
    .map(x => x.toLowerCase())
    .join('_')

export default {
  run
}