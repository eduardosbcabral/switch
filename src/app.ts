import "./utils/env";
import { App, LogLevel } from '@slack/bolt';
import { addDivider, addSection, addSectionError } from './markdown-builder';
import commands from './commands';
import messages from './messages';
import { getApplication } from "./applications";

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_BOT_APP_TOKEN,
  logLevel: LogLevel.DEBUG,
  socketMode: true,
})

app.command('/pipelines', async ({ body, ack, say }) => {
  
  const command = `/pipelines`
  const user = body.user_id;

  try {

    
    
    const pipelines = await commands.pipelines()

    await ack()
    await say({ 
      attachments: [
        {
          blocks: [
            addSection(messages.command(user, command)),
          ],
          color: '#007fff'
        },
        {
          blocks: [
            addSection(messages.pipelines.title),
            addDivider(),
            addSection(messages.pipelines.section(pipelines))
          ],
          color: '#55a362'
        }
      ] 
    })
  } catch (error) {
    await ack()
    await say({ 
      attachments: [
        {
          blocks: [
            addSection(messages.command(user, command)),
          ],
          color: '#007fff'
        },
        { 
          blocks: [addSectionError(error)], 
          color: '#D91E36'
        }
      ]
    })
  }
  
});

app.command('/runs', async ({ body, ack, say }) => {

  const parameters = body.text.split(' ')

  const id = parameters[0]
  const size = parameters[1] ?? 5

  const command = `/runs ${id} ${size}`
  const user = body.user_id;

  try {

    const runs = await commands.runs(id, size)
  
    await ack()
    await say({
      attachments: [
        {
          blocks: [addSection(messages.command(user, command))],
          color: '#007fff'
        },
        {
          blocks: [
            addSection(messages.runs.title(size, getApplication(id))),
            addDivider(),
            addSection(messages.runs.section(runs))
          ],
          color: '#55a362'
        }
      ] 
    })
  } catch (error) {
    await ack()
    await say({ 
      attachments: [
        {
          blocks: [addSection(messages.command(user, command))],
          color: '#007fff'
        },
        { 
          blocks: [addSectionError(error)], 
          color: '#D91E36'
        }
      ]
    })
  }
  
});

app.command('/deploy', async ({ body, ack, say }) => {

  const parameters = body.text.split(' ')

  const pipeline = parameters[0]
  const branchName = parameters[1]
  const preview: boolean = parameters[2] !== 'true'

  const command = `/deploy ${pipeline} ${branchName}`
  const user = body.user_id;

  try {
  
    await commands.deploy(pipeline, branchName, preview)
  
    await ack()
    await say({
      attachments: [
        {
          blocks: [addSection(messages.command(user, command))],
          color: '#007fff'
        },
        {
          blocks: [addSection(messages.deploy.title(branchName))],
          color: '#55a362'
        }
      ] 
    })
  } catch (error) {
    await ack()
    await say({ 
      attachments: [
        {
          blocks: [addSection(messages.command(user, command))],
          color: '#007fff',
        },
        { 
          blocks: [addSectionError(error)], 
          color: '#D91E36'
        }
      ]
    })
  }
  
});

(async () => {
  await app.start(Number(process.env.PORT) || 3000);

  console.log('⚡️ Bolt app is running!');
})();