/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */

import { SchemaComponentOptions } from '@nocobase/client';
import React, { FC } from 'react';
import * as hooks from './hooks';
import { UploadActionInitializer } from './initializers';

export const FileManagerProvider: FC = (props) => {
  return (
    <SchemaComponentOptions scope={hooks} components={{ UploadActionInitializer }}>
      {props.children}
    </SchemaComponentOptions>
  );
};
