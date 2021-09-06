import "./utils/env";
import { App, LogLevel } from '@slack/bolt';
import { addSection } from './markdown-builder';
import commands from './commands';
import messages from './messages';

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_BOT_APP_TOKEN,
  //signingSecret: process.env.SLACK_SIGNING_SECRET,
  logLevel: LogLevel.DEBUG,
  socketMode: true,
})

app.command('/pipelines', async ({ ack, say }) => {

  try {
    
    const pipelines = await commands.pipelines()
  
    const blocks = [
      addSection(messages.pipelines.default),
      addSection(messages.pipelines.section(pipelines)),
    ]
    await ack()
    await say({ blocks })
  } catch (error) {
    await ack()
    await say({ blocks: [
      addSection(`An error has ocurred when using the command. Error: ${(error as Error).message}`)
    ]})
  }
  
});

app.command('/runs', async ({ body, ack, say }) => {

  try {
    const parameters = body.text.split(' ')

    const id = parameters[0]
    const size = parameters[1] ?? 5
  
    const runs = await commands.runs(id, size)
  
    const blocks = [
      addSection(messages.runs.default(size)),
      addSection(messages.runs.section(runs)),
    ]

    await ack()
    await say({ blocks })
  } catch (error) {
    await ack()
    await say({ blocks: [
      addSection(`An error has ocurred when using the command. Error: ${(error as Error).message}`)
    ]})
  }
  
});

app.command('/deploy', async ({ body, ack, say }) => {

  try {
    const parameters = body.text.split(' ')

    const id = parameters[0]
    const branchName = parameters[1]
  
    await commands.deploy(id, branchName)
  
    const blocks = [
      addSection(messages.deploy.default(branchName)),
    ]

    await ack()
    await say({ blocks })
  } catch (error) {
    await ack()
    await say({ blocks: [
      addSection(`An error has ocurred when using the command. Error: ${(error as Error).message}`)
    ]})
  }
  
});

(async () => {
  await app.start(Number(process.env.PORT) || 3000);

  console.log('⚡️ Bolt app is running!');
})();