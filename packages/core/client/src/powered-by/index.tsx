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
    <div className="font-family-golos" style={{ marginTop: '2em' }}>
      <div style={{ display: 'flex', justifyContent: 'center', color: '#00000073' }}>
        <div>Rantir Cloud</div>
        <div style={{ marginRight: '5em', marginLeft: '10em', color: '#00000073' }}>
          <svg width="15" height="14" viewBox="0 0 15 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M7.49375 0.191407C3.62969 0.189844 0.5 3.31797 0.5 7.17891C0.5 10.232 2.45781 12.8273 5.18438 13.7805C5.55156 13.8727 5.49531 13.6117 5.49531 13.4336V12.2227C3.375 12.4711 3.28906 11.068 3.14688 10.8336C2.85938 10.343 2.17969 10.218 2.38281 9.98359C2.86563 9.73516 3.35781 10.0461 3.92813 10.8883C4.34063 11.4992 5.14531 11.3961 5.55313 11.2945C5.64219 10.9273 5.83281 10.5992 6.09531 10.3445C3.89844 9.95078 2.98281 8.61016 2.98281 7.01641C2.98281 6.24297 3.2375 5.53203 3.7375 4.95859C3.41875 4.01328 3.76719 3.20391 3.81406 3.08359C4.72188 3.00234 5.66563 3.73359 5.73906 3.79141C6.25469 3.65234 6.84375 3.57891 7.50313 3.57891C8.16563 3.57891 8.75625 3.65547 9.27656 3.79609C9.45313 3.66172 10.3281 3.03359 11.1719 3.11016C11.2172 3.23047 11.5578 4.0211 11.2578 4.95391C11.7641 5.52891 12.0219 6.2461 12.0219 7.0211C12.0219 8.61797 11.1 9.96016 8.89688 10.3477C9.08558 10.5332 9.23541 10.7546 9.33763 10.9987C9.43984 11.2428 9.49238 11.5049 9.49219 11.7695V13.5273C9.50469 13.668 9.49219 13.807 9.72656 13.807C12.4938 12.8742 14.4859 10.2602 14.4859 7.18047C14.4859 3.31797 11.3547 0.191407 7.49375 0.191407Z"
              fill="black"
              fillOpacity="0.45"
            />
          </svg>
        </div>
        <div style={{ color: '#00000073' }}>Made With Love From Rantir</div>
      </div>
      <div style={{ textAlign: 'center', marginTop: '1em', color: '#00000073' }}>
        <span>Copyright ©2024 Rantir, Inc. All rights reserved. Join us in the AI, No-Code Revolution</span>
      </div>
    </div>
  );
};
