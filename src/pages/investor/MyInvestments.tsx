import React from 'react';
import { Typography, Row, Col, Table, Empty } from 'antd';
import { useAppContext } from '../../context/AppContext';
import { fintechService } from '../../services/fintechService';
import BondCard from '../../components/BondCard';
import '../../styles/theme.css';

const { Title, Text } = Typography;

const MyInvestments: React.FC = () => {
    const { investments, user } = useAppContext();

    const columns = [
        { title: 'Date', dataIndex: 'date', key: 'date' },
        { title: 'ID', dataIndex: 'id', key: 'id' },
        { title: 'Plan', dataIndex: 'planName', key: 'planName' },
        { title: 'Amount', dataIndex: 'amount', key: 'amount', render: (val: number) => fintechService.formatCurrency(val) },
        { title: 'Maturity', dataIndex: 'maturityAmount', key: 'maturityAmount', render: (val: number) => <Text type="success" strong>{fintechService.formatCurrency(val)}</Text> },
    ];

    return (
        <div className="portfolio-refined">
            <Title level={2} className="section-header-title">Your Portfolio</Title>

            <section className="portfolio-section">
                <Title level={4} className="section-header-title">Active Certificates (Bonds)</Title>
                {investments.length > 0 ? (
                    <Row gutter={[24, 24]}>
                        {investments.map(inv => (
                            <Col xs={24} sm={12} lg={8} key={inv.id}>
                                <BondCard investment={inv} userName={user?.name || ''} />
                            </Col>
                        ))}
                    </Row>
                ) : (
                    <div className="empty-bonds-container">
                        <Empty description="You don't have any active certificates yet." />
                    </div>
                )}
            </section>

            <section className="history-section">
                <Title level={4} className="section-header-title">Investment History</Title>
                <div className="section-card">
                    <Table
                        columns={columns}
                        dataSource={investments.map((inv, idx) => ({ ...inv, key: idx }))}
                        pagination={{ pageSize: 5 }}
                        className="refined-table"
                        locale={{ emptyText: 'No history found.' }}
                    />
                </div>
            </section>
        </div>
    );
};

export default MyInvestments;
