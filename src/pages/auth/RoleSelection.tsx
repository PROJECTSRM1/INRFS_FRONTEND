import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const RoleSelection: React.FC = () => {
    const navigate = useNavigate();

    // Automatically redirect to investor login since vendor is removed
    useEffect(() => {
        navigate('/auth/login');
    }, [navigate]);

    return null;
};

export default RoleSelection;
