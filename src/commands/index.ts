import deploy from "./deploy";
import listPipelines from "./pipelines/list";
import reloadPipelines from "./reload-pipelines";
import listRuns from "./runs/list";

const commands = {
  pipelines: listPipelines.run,
  runs: listRuns.run,
  deploy: deploy.run,
  reloadApplications: reloadPipelines.run
};

export default commands;