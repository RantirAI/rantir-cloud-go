/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */

import { Plugin } from '@nocobase/client';
import React from 'react';
import AIExplore from './explore';
import { getWebflowSites, getWebflowPages } from './data/DataFunctions';

export class AiExploreClient extends Plugin {
  async afterAdd() {
    // await this.app.pm.add()
  }

  async beforeLoad() {}

  // You can get and modify the app instance here
  async load() {
    // console.log(this.app);
    // this.app.addComponents({})
    // this.app.addScopes({})
    // this.app.addProvider()
    // this.app.addProviders()
    // this.app.router.add()
    try {
      const token = this.app.apiClient.auth.getToken();
      const sitesData = await getWebflowSites(token);
      const pagesData = await getWebflowPages(token);

      this.router.add('explore', {
        path: 'explore',
        Component: () => (
          <AIExplore
            sitesData={{ sitesData: sitesData.data }}
            pagesData={{ pagesData: pagesData.data }}
            token={token}
          />
        ),
      });
    } catch (e) {
      console.log(e);
    }
  }
}

export default AiExploreClient;
