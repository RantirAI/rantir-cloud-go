import { Plugin } from '@nocobase/client';
import { AiExplore } from './components';
import { useInfoProps } from './schema';
import { infoSettings } from './settings';
import { infoInitializerItem } from './initializer';

export class PluginBlockDataClient extends Plugin {
  async afterAdd() {
    // await this.app.pm.add()
  }

  async beforeLoad() {}

  // You can get and modify the app instance here
  async load() {
    this.app.addComponents({ AiExplore });
    this.app.addScopes({ useInfoProps });
    this.app.schemaSettingsManager.add(infoSettings);
    this.app.schemaInitializerManager.addItem(
      'page:addBlock',
      `dataBlocks.${infoInitializerItem.name}`,
      infoInitializerItem,
    );
  }
}

export default PluginBlockDataClient;
