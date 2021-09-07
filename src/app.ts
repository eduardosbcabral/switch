import "./utils/env";
import { App, LogLevel } from '@slack/bolt';
import { addDivider, addSection, addSectionWithFields } from './markdown-builder';
import commands from './commands';
import messages from './messages';
import { getApplication, updateApplications } from "./applications";
import reloadPipelines from "./commands/reload-pipelines";

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
    await updateApplications(pipelines)

    await ack()
    await say({ 
      text: messages.pipelines.title,
      attachments: [
        {
          blocks: [
            addSection(messages.pipelines.section(pipelines))
          ],
          color: '#55a362'
        },
        {
          blocks: [
            addSectionWithFields(
              messages.principal.command(command),
              messages.principal.by(user)
            ),
            addDivider()
          ],
          color: '#007fff'
        }
      ] 
    })
  } catch (error) {
    await ack()
    await say({ 
      text: messages.error.default(error),
      attachments: [
        {
          blocks: [
            addSectionWithFields(
              messages.principal.command(command),
              messages.principal.by(user)
            ),
            addDivider()
          ],
          color: '#D91E36'
        }
      ]
    })
  }
  
});

app.command('/runs', async ({ body, ack, say }) => {

  const parameters = body.text.split(' ')

  const pipeline = parameters[0]
  const size = parameters[1] ?? 5

  const command = `/runs ${pipeline} ${size}`
  const user = body.user_id;

  try {

    const runs = await commands.runs(pipeline, size)

    const application = getApplication(pipeline);

    await ack()
    await say({
      text: messages.runs.title(size, application),
      attachments: [
        {
          blocks: [
            addSection(messages.runs.section(runs, application)),
          ],
          color: '#55a362'
        },
        {
          blocks: [
            addSectionWithFields(
              messages.principal.command(command),
              messages.principal.by(user)
            ),
            addDivider()
          ],
          color: '#007fff'
        }
      ] 
    })
  } catch (error) {
    await ack()
    await say({ 
      text: messages.error.default(error),
      attachments: [
        {
          blocks: [
            addSectionWithFields(
              messages.principal.command(command),
              messages.principal.by(user)
            ),
            addDivider()
          ],
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
  
    const deploy = await commands.deploy(pipeline, branchName, preview)
  
    const application = getApplication(pipeline)

    await ack()
    await say({
      text: messages.deploy.title(application, deploy),
      attachments: [
        {
          blocks: [
            addSectionWithFields(
              messages.principal.command(command),
              messages.principal.by(user)
            ),
            addDivider()
          ],
          color: '#007fff'
        }
      ] 
    })
  } catch (error) {
    await ack()
    await say({ 
      text: messages.error.default(error),
      attachments: [
        {
          blocks: [
            addSectionWithFields(
              messages.principal.command(command),
              messages.principal.by(user)
            ),
            addDivider()
          ],
          color: '#D91E36'
        }
      ]
    })
  }
  
});

app.command('/reload-pipelines', async ({ body, ack, say }) => {
  
  const command = `/reload-pipelines`
  const user = body.user_id;

  try {

    await reloadPipelines.run();

    await ack()
    await say({ 
      text: 'The pipelines were reloaded successfully!',
      attachments: [
        {
          blocks: [
            addSectionWithFields(
              messages.principal.command(command),
              messages.principal.by(user)
            ),
            addDivider()
          ],
          color: '#007fff'
        }
      ] 
    })
  } catch (error) {
    await ack()
    await say({ 
      text: messages.error.default(error),
      attachments: [
        {
          blocks: [
            addSectionWithFields(
              messages.principal.command(command),
              messages.principal.by(user)
            ),
            addDivider()
          ],
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