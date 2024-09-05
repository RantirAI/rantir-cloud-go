import { Plugin } from '@nocobase/server';
import { getNaturalLangugageAnswer, getNaturalLangugageQuestion, getGraphData } from './AI';

export class PluginBlockDataServer extends Plugin {
  async afterAdd() {}

  async beforeLoad() {}

  async load() {
    const db = this.app.db;

    this.app.resourceManager.define({
      name: 'ai',
      actions: {
        async ask(ctx, next) {
          const question = ctx.request.body.question;
          const info = ctx.request.body.info;
          const topics = ctx.request.body.topics;
          const qDataSource = ctx.request.body.nextQDataSource;
          const collectionName = ctx.request.body.collection;
          const currentCollection = db.getCollection(collectionName);

          const answer = await getNaturalLangugageAnswer(question, info, topics, currentCollection);
          const graphData = await getGraphData(question, info, topics, currentCollection);
          const graphPrediction = JSON.parse(graphData).graphType;
          const nextQuestion = await getNaturalLangugageQuestion(topics, qDataSource);
          ctx.body = { answer, nextQuestion, graphPrediction, graphData };
          next();
        },

        async info(ctx, next) {
          const info = ctx.request.body.info;
          const topics = ctx.request.body.topics;
          const numQuestions = ctx.request.body.numQuestions;

          const allQuestions = await getNaturalLangugageQuestion(topics, info, numQuestions);
          ctx.body = { allQuestions };
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

export default PluginBlockDataServer;
