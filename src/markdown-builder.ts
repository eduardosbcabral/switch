import { Block } from '@slack/bolt';

const addSection = (textMessage: string): Block => ({
  type: 'section',
  text: {
    type: 'mrkdwn',
    text: textMessage
  }
}) as Block

export {
  addSection
}