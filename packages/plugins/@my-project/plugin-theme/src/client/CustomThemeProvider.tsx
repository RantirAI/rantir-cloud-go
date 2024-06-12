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
      <style>{`
        body {
          background-color: ${customStyles.backgroundColor} !important;
          color: ${customStyles.textColor} !important;
        }
        .ant-page-header {
          color: black !important;
        }
        .ant-page-header * {
          color: ${customStyles.textColor} !important;
        }

        .ant-page-header span {
          color: ${customStyles.textColor} !important;
        }

        .css-junazh {
          display: ${customStyles.hiddenElementDisplay} !important;
        }
        .ant-card {
          background-color: rgb(231, 231, 231) !important;
          border-color: ${customStyles.borderColor} !important;
        }
        .ant-typography {
          color: ${customStyles.textColor} !important;
        }
        a {
          color: ${customStyles.linkColor} !important;
        }
        .ant-layout-header {
          background-color: #000 !important;
        }
                  button[data-testid="schema-initializer-Menu-header"] {
          border-color: #FFAB2E !important;
          color: #FFAB2E !important;
          border-radius: 0rem !important;
          border-style: solid !important;
        }
      `}</style>
      <SchemaComponentOptions components={{}}>{children}</SchemaComponentOptions>
    </ConfigProvider>
  );
};

export default CustomThemeProvider;
