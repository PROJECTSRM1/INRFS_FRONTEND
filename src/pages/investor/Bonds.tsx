import React from 'react';
import { Row, Col, Empty } from 'antd';
import { useAppContext } from '../../context/AppContext';
import BondCard from '../../components/BondCard';
import '../../styles/Bonds.css';

const Bonds: React.FC = () => {
    const { investments, user } = useAppContext();

    return (
        <div className="bonds-page-container">
            {investments.length > 0 && (
                <div className="bonds-page-header">
                    <h2 className="bonds-title">My Investment Bonds</h2>
                    <div className="bonds-subtitle">Secure access to your verified digital investment certificates</div>
                </div>
            )}

            {investments.length > 0 ? (
                <Row gutter={[24, 24]}>
                    {investments.map(inv => (
                        <Col xs={24} sm={24} md={12} lg={8} xl={6} key={inv.id}>
                            <BondCard investment={inv} userName={user?.name || ''} />
                        </Col>
                    ))}
                </Row>
            ) : (
                <div className="empty-bonds-container">
                    <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description={
                            <div className="empty-bonds-content">
                                <h3 style={{ margin: '16px 0 8px', color: '#1e293b' }}>No Bonds Issued Yet</h3>
                                <p style={{ color: '#64748b' }}>Complete an investment plan to receive your certified digital bonds.</p>
                            </div>
                        }
                    />
                </div>
            )}
        </div>
    );
};

export default Bonds;
