import { Plugin } from '@nocobase/client';
import { AiExplore } from './components';
import { useExploreProps } from './schema';
import { infoSettings } from './settings';
import { exploreInitializerItem } from './initializer';

export class PluginBlockDataClient extends Plugin {
  async afterAdd() {
    // await this.app.pm.add()
  }

  async beforeLoad() {}

  // You can get and modify the app instance here
  async load() {
    this.app.addComponents({ AiExplore });
    this.app.addScopes({ useExploreProps });
    this.app.schemaSettingsManager.add(infoSettings);
    this.app.schemaInitializerManager.addItem(
      'page:addBlock',
      `dataBlocks.${exploreInitializerItem.name}`,
      exploreInitializerItem,
    );
  }
}

export default PluginBlockDataClient;
