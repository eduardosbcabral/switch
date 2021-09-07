import { Block } from '@slack/bolt';
import messages from './messages';

const addSection = (textMessage: string): Block => ({
  type: 'section',
  text: {
    type: 'mrkdwn',
    text: textMessage
  }
}) as Block

const addSectionError = (error: any): Block => ({
  type: 'section',
  text: {
    type: 'mrkdwn',
    text: messages.error.default(error)
  }
}) as Block

const addDivider = (): Block => ({
  type: 'divider'
}) as Block

const addSectionWithFields = (...textMessages: string[]): Block => ({
  type: 'section',
  fields: textMessages.map(x => ({
    type: 'mrkdwn',
    text: x
  }))
}) as Block

export {
  addSection,
  addSectionError,
  addDivider,
  addSectionWithFields
}