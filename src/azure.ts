import axios, { AxiosError } from 'axios';
import { Application } from './applications';
import SwitchError from './errors/switch_error';
import messages from './messages';

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

const runPipeline = async (pipeline: Application, branchName: string, preview: boolean) => {
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
    },
    previewRun: preview
  }
  const url = `/${project}/_apis/pipelines/${pipeline.id}/runs?api-version=6.0-preview.1`;

  try {
    await api.post(url, body, options)
  } catch (error) {
    const data = (error as AxiosError).response?.data;
    if (data.eventId === 3000) {
      throw new SwitchError(messages.deploy.branch_not_found(branchName, pipeline))
    }
  }
}

const getPipeline = async (pipelineId: string) => {
  const options = {
    headers
  }
  const url = `/${project}/_apis/pipelines/${pipelineId}?api-version=6.0-preview.1`;
  const response = await api.get(url, options)
  return response.data;
}

export {
  getPipelines,
  getPipeline,
  getPipelineRuns,
  runPipeline
};