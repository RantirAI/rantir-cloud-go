/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */

import { css, cx } from '@emotion/css';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useToken } from '../style';
import { usePlugin } from '../application';
import { parseHTML } from '@nocobase/utils/client';
import { useCurrentAppInfo } from '../appInfo/CurrentAppInfoProvider';

export const PoweredBy = () => {
  const { i18n } = useTranslation();
  const { token } = useToken();
  const customBrandPlugin: any = usePlugin('@nocobase/plugin-custom-brand');
  const data = useCurrentAppInfo();
  const urls = {
    'en-US': 'https://www.nocobase.com',
    'zh-CN': 'https://cn.nocobase.com',
  };
  const style = css`
    text-align: center;
    color: ${token.colorTextDescription};
    a {
      color: ${token.colorTextDescription};
      &:hover {
        color: ${token.colorText};
      }
    }
  `;
  const appVersion = `<span class="nb-app-version">v${data?.data?.version}</span>`;

  return (
    <div className="font-family-golos">
      <div style={{ textAlign: 'center', color: '#00000073' }}>
        <span>
          Rantir Cloud
          <svg
            style={{ position: 'relative', top: '0.5em', marginLeft: '0.5em', marginRight: '1em' }}
            width="20"
            height="27"
            viewBox="0 0 26 27"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect x="0.5" y="0.600098" width="25" height="25" rx="3.5" fill="#303030" />
            <rect x="0.5" y="0.600098" width="25" height="25" rx="3.5" stroke="#EEF2F3" />
            <path
              d="M20 7.16319V9.48495C20 10.1245 19.4789 10.6481 18.8322 10.6481H11.8345C11.1924 10.6481 10.6667 11.1671 10.6667 11.8113V18.8368C10.6667 19.4763 10.1456 20 9.49884 20H7.16783C6.52576 20 6 19.481 6 18.8368V11.8113C6 11.1718 6.52111 10.6481 7.16783 10.6481H9.49884C10.1409 10.6481 10.6667 10.1291 10.6667 9.48495V7.16319C10.6667 6.52367 11.1878 6 11.8345 6H18.8322C19.4742 6 20 6.51904 20 7.16319Z"
              fill="url(#paint0_linear_179_47595)"
            />
            <defs>
              <linearGradient
                id="paint0_linear_179_47595"
                x1="17.7963"
                y1="6.90741"
                x2="9.37037"
                y2="18.963"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0.158166" stopColor="#EFF0F6" />
                <stop offset="1" stopColor="#EAEBEF" />
              </linearGradient>
            </defs>
          </svg>
          Copyright ©2024 Rantir, Inc. All rights reserved. Join us in the AI, No-Code Revolution
        </span>
      </div>
    </div>
  );
};
