import deploy from "./deploy";
import listPipelines from "./pipelines/list";
import listRuns from "./runs/list";

const commands = {
  pipelines: listPipelines.run,
  runs: listRuns.run,
  deploy: deploy.run
};

export default commands;