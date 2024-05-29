import { Plugin } from '@nocobase/client';
import axios from 'axios';

export default class GptChatPlugin extends Plugin {
  async load() {
    this.app.blockManager.addBlock({
      type: 'gpt-chat',
      title: 'GPT Chat',
      render: (props) => <GptChatBlock {...props} />,
    });
  }
}
