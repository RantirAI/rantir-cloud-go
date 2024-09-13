import { useCollection, useDataBlockRequest, useAPIClient } from '@nocobase/client';
import { infoSettings } from '../settings';
import { InfoProps } from '../components';
import { BlockName, BlockNameLowercase } from '../constants';

export function useExploreProps(): InfoProps {
  const collection = useCollection();
  const { data, loading } = useDataBlockRequest<any[]>();
  const fields = collection.getFields().filter((field) => !field.uiSchema.title.includes('{{'));
  const token = useAPIClient().auth.getToken();

  return {
    token,
    collectionName: collection.name,
    collectionFields: fields,
    data: data?.data,
    loading: loading,
  };
}

export function getExploreSchema({ dataSource = 'main', collection }) {
  return {
    type: 'void',
    'x-decorator': 'DataBlockProvider',
    'x-settings': infoSettings.name,
    'x-decorator-props': {
      dataSource,
      collection,
      action: 'list',
    },
    'x-component': 'CardItem',
    'x-toolbar': 'BlockSchemaToolbar',

    properties: {
      [BlockNameLowercase]: {
        type: 'void',
        'x-component': BlockName,
        'x-use-component-props': 'useExploreProps',
      },
    },
  };
}
