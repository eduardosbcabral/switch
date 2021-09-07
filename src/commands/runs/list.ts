import commands from "..";
import { getApplication, updateApplications } from "../../applications";
import { 
  getPipelineRuns 
} from "../../azure";
import SwitchError from "../../errors/switch_error";

export interface Run {
  id: number,
  name: string,
  url: string,
  state: string,
  result: string,
  creation_date: string
}

const run = async (pipeline: string, size: string): Promise<Array<Run>> => {

  if(!pipeline) {
    throw new SwitchError("Parameter 'pipeline' is required.")
  }

  const pipelines = await commands.pipelines()
  await updateApplications(pipelines)

  const pipelineId = getApplication(pipeline).id

  const response = await getPipelineRuns(pipelineId)

  const runs = response.value.slice(0, size)
  return runs.map((x: any) => {
    const buildId = x._links.web.href.split('buildId=')[1]
    const url = `https://${process.env.AZURE_DNS}/${process.env.AZURE_PROJECT}/_build/results?buildId=${buildId}`
    return { 
      id: x.id, 
      name: x.name, 
      url: url,
      state: x.state,
      result: x.result,
      creation_date: formatDate(x.createdDate)
    } as Run
  })
}

const formatDate = (date_str: string) => {
  const date = new Date(date_str);
  let formattedDate = (addZero(date.getDate()) + "/" + (addZero(date.getMonth()+1).toString()) + "/" + date.getFullYear());
  formattedDate += ` ${addZero(date.getHours())}:${addZero(date.getMinutes())}`
  return formattedDate
}

const addZero = (number: number): string => {
  if (number <= 9) 
      return "0" + number;
  else
      return number.toString(); 
}

export default {
  run
}