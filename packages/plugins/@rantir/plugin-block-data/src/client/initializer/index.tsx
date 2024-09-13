import React from 'react';
import { SchemaInitializerItemType, useSchemaInitializer } from '@nocobase/client';
import { CodeOutlined } from '@ant-design/icons';

import { getExploreSchema } from '../schema';
import { BlockName, BlockNameLowercase } from '../constants';

export const exploreInitializerItem: SchemaInitializerItemType = {
  name: BlockNameLowercase,
  Component: 'DataBlockInitializer',
  useComponentProps() {
    const { insert } = useSchemaInitializer();
    return {
      title: BlockName,
      icon: <CodeOutlined />,
      componentType: BlockName,
      onCreateBlockSchema({ item }) {
        insert(getExploreSchema({ dataSource: item.dataSource, collection: item.name }));
      },
    };
  },
};
