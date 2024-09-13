import { Plugin } from '@nocobase/server';
import { getNaturalLangugageAnswer, getNaturalLangugageQuestion, getGraphData } from './AILlama';

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
          const dbColumns = ctx.request.body.dbColumns;
          const qDataSource = ctx.request.body.nextQDataSource;
          const collectionName = ctx.request.body.collection;
          const currentCollection = db.getCollection(collectionName);

          const [answer, graphData, nextQuestion] = await Promise.all([
            getNaturalLangugageAnswer(question, info, dbColumns, currentCollection),
            getGraphData(question, info, dbColumns, currentCollection),
            getNaturalLangugageQuestion(dbColumns, qDataSource),
          ]);

          const graphPrediction = JSON.parse(graphData).graphType;

          ctx.body = { answer, nextQuestion, graphPrediction, graphData };
          next();
        },

        async info(ctx, next) {
          const info = ctx.request.body.info;
          const dbColumns = ctx.request.body.dbColumns;
          const numQuestions = ctx.request.body.numQuestions;

          const allQuestions = await getNaturalLangugageQuestion(dbColumns, info, numQuestions);
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
