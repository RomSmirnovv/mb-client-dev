import { SnackbarProvider } from 'notistack';
import AppRouter from './components/AppRouter';
import { io } from "socket.io-client";
import config from "./config";


import { Breadcrumb, ConfigProvider, Layout, theme } from 'antd';
import ruRu from 'antd/lib/locale/ru_RU'

import { useContext, useEffect, useState } from 'react';
import Dashboard from './pages/Dashboard';
import HeaderComponent from './components/ui/HeaderComponent';
import AsideComponent from './components/ui/AsideComponent';
import FooterComponent from './components/ui/FooterComponent';
import { AuthContext } from './context/AuthContext';
import LocaleProvider from 'antd/es/locale';
const { Content, Footer } = Layout;




function App() {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <>
      <ConfigProvider locale={ruRu}>
        <SnackbarProvider />
        <Layout
          style={{
            minHeight: '100vh',
          }}
        >
          <HeaderComponent />
          <Layout>
            <AsideComponent />
            <Layout>
              <Content
                style={{
                  margin: '0 16px',
                }}
              >
                <div
                  style={{
                    padding: 24,
                    background: colorBgContainer,
                    borderRadius: borderRadiusLG,
                  }}
                >
                  <AppRouter />
                </div>
              </Content>
              <FooterComponent />
            </Layout>
          </Layout>
        </Layout>
      </ConfigProvider>
    </>
  )
}

export default App
