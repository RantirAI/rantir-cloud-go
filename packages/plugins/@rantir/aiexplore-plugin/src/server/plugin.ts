/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */

import { Plugin } from '@nocobase/server';
import { getNaturalLangugageAnswer, getNaturalLangugageQuestion } from './AI';

export class AiExploreServer extends Plugin {
  async afterAdd() {}

  async beforeLoad() {}

  async load() {
    this.app.resourceManager.define({
      name: 'ai',
      actions: {
        async ask(ctx, next) {
          console.log('ask', ctx.request.body);
          const question = ctx.request.body.question;
          const userDBdata = ctx.request.body.info;
          const qDataSource = ctx.request.body.nextQDataSource;
          const answer = await getNaturalLangugageAnswer(question, userDBdata.data);
          const nextQuestion = await getNaturalLangugageQuestion(question, qDataSource);
          ctx.body = { answer, nextQuestion };
          next();
        },
      },
    });
  }

  async install() {}

  async afterEnable() {}

  async afterDisable() {}

  async remove() {}
}

export default AiExploreServer;
