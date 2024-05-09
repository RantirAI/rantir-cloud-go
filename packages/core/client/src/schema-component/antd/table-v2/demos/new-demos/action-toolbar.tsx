/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */

import {
  ActionProps,
  TableBlockProvider,
  useBulkDestroyActionProps,
  useDataBlockRequest,
  useFilterActionProps,
  useRefreshActionProps,
  useTableBlockProps,
} from '@nocobase/client';
import { getAppComponent } from '@nocobase/test/web';

const App = getAppComponent({
  schema: {
    type: 'void',
    name: 'root',
    properties: {
      test: {
        type: 'void',
        'x-decorator': 'TableBlockProvider',
        'x-decorator-props': {
          collection: 'roles',
          action: 'list',
          params: {
            pageSize: 2,
          },
          showIndex: true,
          dragSort: false,
        },
        properties: {
          // 添加按钮
          actions: {
            type: 'void',
            'x-component': 'ActionBar',
            'x-component-props': {
              style: {
                marginBottom: 20,
              },
            },
            properties: {
              filter: {
                'x-component': 'Filter.Action',
                'x-use-component-props': 'useFilterActionProps',
                'x-component-props': {
                  icon: 'FilterOutlined',
                },
                'x-align': 'left',
              },
              refresh: {
                title: 'Refresh',
                'x-component': 'Action',
                'x-align': 'left',
                'x-use-component-props': 'useRefreshActionProps',
              },
              add: {
                type: 'void',
                'x-component': 'Action',
                title: 'Add New',
                'x-align': 'right',
                'x-component-props': {
                  type: 'primary',
                },
                properties: {
                  drawer: {
                    type: 'void',
                    'x-component': 'Action.Drawer',
                    title: 'Drawer Title',
                    properties: {
                      tip: {
                        type: 'void',
                        'x-component': 'Markdown.Void',
                        'x-editable': false,
                        'x-component-props': {
                          content: '请查看 [Action.Drawer](/components/action) 组件的文档',
                        },
                      },
                    },
                  },
                },
              },
              bucketDelete: {
                title: 'Delete',
                'x-action': 'destroy',
                'x-component': 'Action',
                'x-use-component-props': 'useBulkDestroyActionProps',
                'x-component-props': {
                  icon: 'DeleteOutlined',
                  confirm: {
                    title: "{{t('Delete record')}}",
                    content: "{{t('Are you sure you want to delete it?')}}",
                  },
                },
              },
            },
          },
          table: {
            type: 'array',
            'x-component': 'TableV2',
            'x-use-component-props': 'useTableBlockProps',
            'x-component-props': {
              rowKey: 'id',
              rowSelection: {
                type: 'checkbox',
              },
            },
            properties: {
              column1: {
                type: 'void',
                title: 'Username',
                'x-component': 'TableV2.Column',
                properties: {
                  name: {
                    type: 'string',
                    'x-component': 'CollectionField',
                    'x-pattern': 'readPretty',
                  },
                },
              },
              column2: {
                type: 'void',
                title: 'Nickname',
                'x-component': 'TableV2.Column',
                properties: {
                  title: {
                    type: 'string',
                    'x-component': 'CollectionField',
                    'x-pattern': 'readPretty',
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  appOptions: {
    components: {
      TableBlockProvider,
    },
    scopes: {
      useTableBlockProps,
      useBulkDestroyActionProps,
      useRefreshActionProps,
      useFilterActionProps,
    },
  },
  delayResponse: 500,
});

export default App;
