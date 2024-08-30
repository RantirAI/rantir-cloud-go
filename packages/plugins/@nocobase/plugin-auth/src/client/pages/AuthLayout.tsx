/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */

import { css } from '@emotion/css';
import React, { FC } from 'react';
import { Outlet } from 'react-router-dom';
import { useSystemSettings, PoweredBy, useRequest, useAPIClient } from '@nocobase/client';
import { AuthenticatorsContext } from '../authenticator';
import { Spin, Tabs } from 'antd';

export const AuthenticatorsContextProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
  const api = useAPIClient();
  const {
    data: authenticators = [],
    error,
    loading,
  } = useRequest(() =>
    api
      .resource('authenticators')
      .publicList()
      .then((res) => {
        return res?.data?.data || [];
      }),
  );

  if (loading) {
    return <Spin />;
  }

  if (error) {
    throw error;
  }

  return <AuthenticatorsContext.Provider value={authenticators as any}>{children}</AuthenticatorsContext.Provider>;
};

export function AuthLayout() {
  const { data } = useSystemSettings();

  return (
    <div>
      <div style={{ width: '30%', margin: '0px auto', marginTop: '20vh', backgroundColor: '#0A3471', borderRadius: '10px' }}>
        <div className="header-login" style={{textAlign: 'center'}}>
          <div style={{paddingTop: '0.5em'}}>
            <img
              style={{ height: '30px' }}
              src={`https://turner.rantir.app/storage/uploads/${data?.data?.logo?.filename}`}
            />
          </div>
          <div className="font-family-golos">
            <span style={{ color: 'white' }}>{data?.data?.title}</span>
          </div>
        </div>
      <div
        id="login-form"
        style={{
          maxWidth: 420,
          margin: '0 auto',
          paddingTop: '2em',
          paddingLeft: '1em',
          paddingRight: '1em',
          paddingBottom: '1em',
          marginTop: '0',
        }}
      >
        <AuthenticatorsContextProvider>
          <Outlet />
        </AuthenticatorsContextProvider>
        <div
          className={css`
            position: absolute;
            bottom: 24px;
            width: 100%;
            left: 0;
            text-align: center;
          `}
        >
          <PoweredBy />
        </div>
      </div>
    </div>
  </div>
  );
}
