/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */

import React from 'react';
import { ConfigProvider } from 'antd';
import { SchemaComponentOptions } from '@nocobase/client';
import './customstyles.css';
import './modifyicon.js';

const customStyles = {
  backgroundColor: '#FFFF00', // Dark blue background
  primaryColor: '#2E74FF', // Blue for primary elements
  textColor: 'black', // White text
  linkColor: '#2E74FF', // Blue for links
  borderColor: '#EDEFF1', // Light gray borders
  cardBackgroundColor: '#112240', // Slightly lighter dark blue for cards
  hiddenElementDisplay: 'none', // Hide specific elements
  headerBackgroundColor: '#FFFFFF',
};

const CustomThemeProvider: React.FC = ({ children }) => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: customStyles.primaryColor,
          colorLink: customStyles.linkColor,
          colorTextBase: customStyles.textColor,
        },
      }}
    >
      <SchemaComponentOptions components={{}}>{children}</SchemaComponentOptions>
    </ConfigProvider>
  );
};

export default CustomThemeProvider;
