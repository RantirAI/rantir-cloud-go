/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */

import { LoadingOutlined } from '@ant-design/icons';
import { connect, mapProps, mapReadPretty } from '@formily/react';
import { Input as AntdInput } from 'antd';
import { InputProps, TextAreaProps } from 'antd/es/input';
import React from 'react';
import { JSONTextAreaProps, Json } from './Json';
import { InputReadPrettyComposed, ReadPretty } from './ReadPretty';

export { ReadPretty as InputReadPretty } from './ReadPretty';

type ComposedInput = React.FC<InputProps> & {
  ReadPretty: InputReadPrettyComposed['Input'];
  TextArea: React.FC<TextAreaProps> & { ReadPretty: InputReadPrettyComposed['TextArea'] };
  URL: React.FC<InputProps> & { ReadPretty: InputReadPrettyComposed['URL'] };
  JSON: React.FC<JSONTextAreaProps> & { ReadPretty: InputReadPrettyComposed['JSON'] };
};

export const Input: ComposedInput = Object.assign(
  connect(
    AntdInput,
    mapProps((props, field) => {
      return {
        ...props,
        suffix: <span>{field?.['loading'] || field?.['validating'] ? <LoadingOutlined /> : props.suffix}</span>,
      };
    }),
    mapReadPretty(ReadPretty.Input),
  ),
  {
    TextArea: connect(
      AntdInput.TextArea,
      mapProps((props, field) => {
        return {
          autoSize: {
            maxRows: 10,
            minRows: 3,
          },
          ...props,
        };
      }),
      mapReadPretty(ReadPretty.TextArea),
    ),
    URL: connect(AntdInput, mapReadPretty(ReadPretty.URL)),
    JSON: connect(Json, mapReadPretty(ReadPretty.JSON)),
    ReadPretty: ReadPretty.Input,
    Preview: ReadPretty.Preview,
  } as unknown as ComposedInput,
);

Input.displayName = 'Input';

export default Input;
