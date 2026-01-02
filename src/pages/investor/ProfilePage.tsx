import React from 'react';
import { Row, Col } from 'antd';
import BankDetailsCard from '../../components/bank/BankDetailsCard';
import '../../styles/dashboard.css';

/**
 * Example page showing how to use the BankDetailsCard component
 * This component automatically fetches bank details using the access_token
 * stored in localStorage after login
 */
const ProfilePage: React.FC = () => {
    return (
        <div className="dashboard-container">
            <Row gutter={[24, 24]}>
                <Col xs={24} lg={16}>
                    <BankDetailsCard />
                </Col>
            </Row>
        </div>
    );
};

export default ProfilePage;
