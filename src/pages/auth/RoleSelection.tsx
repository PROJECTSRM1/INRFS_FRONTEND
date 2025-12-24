import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const RoleSelection: React.FC = () => {
    const navigate = useNavigate();

    // Automatically redirect to investor dashboard
    useEffect(() => {
        navigate('/dashboard');
    }, [navigate]);

    return null;
};

export default RoleSelection;
