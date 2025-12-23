import React from 'react';
import { ConfigProvider, theme } from 'antd';
import { AppProvider, useAppContext } from '../context/AppContext';
import AppRoutes from './routes';
import '../styles/global.css';

const AppContent: React.FC = () => {
    const { darkMode } = useAppContext();

    return (
        <ConfigProvider
            theme={{
                algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
                token: {
                    colorPrimary: '#3b82f6',
                    borderRadius: 8,
                    fontFamily: '"Inter", -apple-system, system-ui, sans-serif',
                },
                components: {
                    Card: {
                        borderRadiusLG: 12,
                    },
                    Table: {
                        borderRadiusLG: 12,
                    }
                }
            }}
        >
            <div className={darkMode ? 'dark-theme' : 'light-theme'}>
                <AppRoutes />
            </div>
        </ConfigProvider>
    );
};

const App: React.FC = () => {
    return (
        <AppProvider>
            <AppContent />
        </AppProvider>
    );
};

export default App;
