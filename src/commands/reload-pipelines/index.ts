import commands from "..";
import { reloadApplications } from "../../applications";

export interface Run {
  id: number,
  name: string,
  url: string,
  state: string,
  result: string,
  creation_date: string
}

const run = async () => {
  await reloadApplications()
}



export default {
  run
}