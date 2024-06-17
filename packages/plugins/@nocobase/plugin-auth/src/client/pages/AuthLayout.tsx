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
      <div style={{ maxWidth: '320px', margin: '0px auto', paddingTop: '20vh' }}>
        <div>
          <svg width="98" height="25" viewBox="0 0 98 25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M15.5526 5.29219V7.87142C15.5526 8.58187 14.9737 9.16361 14.2552 9.16361H6.48155C5.76827 9.16361 5.18421 9.74018 5.18421 10.4558V18.2604C5.18421 18.9708 4.60531 19.5526 3.88686 19.5526H1.29734C0.584066 19.5526 0 18.976 0 18.2604V10.4558C0 9.74533 0.578898 9.16361 1.29734 9.16361H3.88686C4.60014 9.16361 5.18421 8.58702 5.18421 7.87142V5.29219C5.18421 4.58175 5.7631 4 6.48155 4H14.2552C14.9685 4 15.5526 4.5766 15.5526 5.29219Z"
              fill="url(#paint0_linear_179_47110)"
            />
            <g filter="url(#filter0_d_179_47110)">
              <rect x="24" width="73.0227" height="21" rx="3.86575" fill="#FBFBFB" />
              <path
                d="M35.8297 9.09493C35.6796 8.09407 34.9039 7.48104 33.853 7.48104C32.4393 7.48104 31.5135 8.56948 31.5135 10.4711C31.5135 12.4228 32.4518 13.4612 33.8405 13.4612C34.8789 13.4612 35.642 12.8857 35.8297 11.9098L37.7313 11.9224C37.5187 13.5988 36.1175 15.1251 33.8155 15.1251C31.3884 15.1251 29.5994 13.4236 29.5994 10.4711C29.5994 7.51857 31.4259 5.81711 33.8155 5.81711C35.9048 5.81711 37.4811 7.01814 37.7313 9.09493H35.8297ZM38.9169 15V5.94222H40.7935V13.4487H44.6968V15H38.9169ZM53.7141 10.4711C53.7141 13.4236 51.875 15.1251 49.4854 15.1251C47.0709 15.1251 45.2443 13.4111 45.2443 10.4711C45.2443 7.51857 47.0709 5.81711 49.4854 5.81711C51.875 5.81711 53.7141 7.51857 53.7141 10.4711ZM51.7999 10.4711C51.7999 8.53194 50.8866 7.48104 49.4854 7.48104C48.0842 7.48104 47.1584 8.53194 47.1584 10.4711C47.1584 12.4103 48.0842 13.4612 49.4854 13.4612C50.8866 13.4612 51.7999 12.4103 51.7999 10.4711ZM60.5419 5.94222H62.4311V11.8223C62.4311 13.8115 60.9298 15.1251 58.6778 15.1251C56.4259 15.1251 54.9371 13.8115 54.9371 11.8223V5.94222H56.8137V11.6721C56.8137 12.7105 57.5519 13.4737 58.6778 13.4737C59.8163 13.4737 60.5419 12.7105 60.5419 11.6721V5.94222ZM67.0195 15H63.8293V5.94222H67.057C69.7844 5.94222 71.4483 7.64368 71.4483 10.4586C71.4483 13.2985 69.7844 15 67.0195 15ZM65.7059 13.3861H66.9444C68.6709 13.3861 69.5717 12.4853 69.5717 10.4586C69.5717 8.44437 68.6709 7.55611 66.9569 7.55611H65.7059V13.3861ZM79.3616 5.94222V15H77.4725V7.73126H77.4224L75.3457 9.03237V7.36844L77.5851 5.94222H79.3616ZM81.9483 15.1126C81.3603 15.1126 80.8849 14.6372 80.8974 14.0617C80.8849 13.4862 81.3603 13.0233 81.9483 13.0233C82.4988 13.0233 82.9867 13.4862 82.9867 14.0617C82.9867 14.6372 82.4988 15.1126 81.9483 15.1126ZM84.3349 15L84.3224 13.6363L87.5752 10.6463C88.4259 9.83306 88.8763 9.33263 88.8763 8.61952C88.8763 7.81883 88.2632 7.3184 87.4375 7.3184C86.5868 7.3184 86.0363 7.85636 86.0363 8.71961H84.2473C84.2348 6.94308 85.5484 5.81711 87.4626 5.81711C89.4017 5.81711 90.6903 6.91806 90.6903 8.49441C90.6903 9.52029 90.1899 10.371 88.3258 12.06L86.9496 13.3986V13.4487H90.8154V15H84.3349Z"
                fill="#2F2F2F"
              />
            </g>
            <defs>
              <filter
                id="filter0_d_179_47110"
                x="24"
                y="0"
                width="73.0227"
                height="25"
                filterUnits="userSpaceOnUse"
                colorInterpolationFilters="sRGB"
              >
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix
                  in="SourceAlpha"
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  result="hardAlpha"
                />
                <feOffset dy="4" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0" />
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_179_47110" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_179_47110" result="shape" />
              </filter>
              <linearGradient
                id="paint0_linear_179_47110"
                x1="13.1045"
                y1="5.00804"
                x2="3.74414"
                y2="18.4005"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0.158166" stopColor="#1A1A1A" />
                <stop offset="1" stopColor="#201E21" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div className="font-family-golos">
          <span style={{ color: '#00000073' }}>
            Ant Design is the most influential web <br />
            design specification in Xihu district
          </span>
        </div>
      </div>
      <div
        style={{
          maxWidth: 420,
          margin: '0 auto',
          paddingTop: '10vh',
          border: '1px #EEF2F3 solid',
          paddingLeft: '2em',
          paddingRight: '2em',
          paddingBottom: '1em',
          marginTop: '1em',
        }}
      >
        <AuthenticatorsContextProvider>
          <Outlet />
        </AuthenticatorsContextProvider>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1em' }}>
          <div style={{ display: 'flex' }}>
            <span className="font-family-golos" style={{ marginRight: '1em' }}>
              Enterprise Sign In
            </span>
            <svg width="26" height="27" viewBox="0 0 26 27" fill="none" xmlns="http://www.w3.org/2000/svg">
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
          </div>
          <div>
            <span className="font-family-golos">Sign Up</span>
          </div>
        </div>
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
  );
}
