import axios from 'axios';

const organization = process.env.AZURE_ORGANIZATION;
const project = process.env.AZURE_PROJECT;
const token = process.env.AZURE_TOKEN;

const baseUrl = `https://dev.azure.com/${organization}`

const api = axios.create({
	baseURL: baseUrl
});

const tokenBase64 = Buffer.from(`${token}:`, 'utf8').toString('base64')

const headers = {
  'Authorization': `Basic ${tokenBase64}`
}

const getPipelines = async () => {
  const options = {
    headers
  }
  const response = await api.get(`/${project}/_apis/pipelines?api-version=6.0-preview.1`, options)
  return response.data;
}

const getPipelineRuns = async (pipelineId: string) => {
  const options = {
    headers
  }
  const url = `/${project}/_apis/pipelines/${pipelineId}/runs?api-version=6.0-preview.1`;
  const response = await api.get(url, options)
  return response.data;
}

const runPipeline = async (pipelineId: string, branchName: string) => {
  const options = {
    headers
  }
  const body = {
    resources: {
      repositories: {
        self: {
          refName: `refs/heads/${branchName}`
        }
      }
    }
  }
  const url = `/${project}/_apis/pipelines/${pipelineId}/runs?api-version=6.0-preview.1`;
  await api.post(url, body, options)
}

export {
  getPipelines,
  getPipelineRuns,
  runPipeline
};