import React, { useRef, useState } from 'react';
import { Modal, Button, Typography, message } from 'antd';
import { DownloadOutlined, CloseOutlined } from '@ant-design/icons';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { fintechService } from '../services/fintechService';
import '../styles/Bonds.css';

const { Title } = Typography;

interface CertificateModalProps {
    visible: boolean;
    onClose: () => void;
    bond: any;
    userName?: string; // Added userName optional prop
}

const CertificateModal: React.FC<CertificateModalProps> = ({ visible, onClose, bond }) => {
    const certRef = useRef<HTMLDivElement>(null);
    const [downloading, setDownloading] = useState(false);

    if (!bond) return null;

    const handleDownloadPDF = async () => {
        if (!certRef.current) return;
        setDownloading(true);
        const hideLoading = message.loading('Generating Certificate...', 0);

        try {
            // High quality canvas
            const canvas = await html2canvas(certRef.current, {
                scale: 3, // Higher scale for better clarity
                useCORS: true,
                backgroundColor: '#ffffff'
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');

            // Better approach: Fit to A4
            pdf.addImage(imgData, 'PNG', 0, 0, 210, 297); // A4 dimensions

            pdf.save(`${bond.planName.replace(/\s+/g, '_')}_Certificate.pdf`);
            message.success('Certificate downloaded successfully');
        } catch (error) {
            console.error('PDF Generation Error:', error);
            message.error('Failed to generate certificate');
        } finally {
            hideLoading();
            setDownloading(false);
        }
    };

    return (
        <Modal
            open={visible}
            onCancel={onClose}
            footer={null}
            width={900}
            className="cert-modal"
            centered
            closeIcon={<CloseOutlined style={{ color: 'white' }} />}
            style={{ top: 20 }}
            bodyStyle={{ padding: 0 }}
        >
            <div className="cert-preview-container">
                {/* Visual Header for Modal Only */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', alignItems: 'center' }}>
                    <Title level={4} style={{ margin: 0 }}>Certificate Preview</Title>
                    <Button
                        type="primary"
                        icon={<DownloadOutlined />}
                        loading={downloading}
                        onClick={handleDownloadPDF}
                    >
                        Download PDF
                    </Button>
                </div>

                <div style={{ border: '1px solid #e2e8f0', overflow: 'auto', maxHeight: '70vh', background: '#e2e8f0', padding: '20px', borderRadius: '4px' }}>
                    {/* The Certificate DOM Structure */}
                    <div ref={certRef} className="certificate-layout">
                        {/* Watermark Background */}
                        <div className="cert-bg-watermark">
                            INFRS
                        </div>

                        <div className="cert-content-layer">
                            {/* Header */}
                            <div className="cert-header">
                                <div className="cert-title-main">Infrastructure Bond Certificate</div>
                                <div className="cert-subtitle-main">InfraGrowth Secure Bond</div>
                            </div>

                            <p className="cert-body-text">
                                This certificate confirms the issuance of an <strong>Infrastructure Bond</strong> under the <strong>InfraGrowth Secure Bond Program</strong> by <strong>INFRS Capital Pvt. Ltd.</strong>. The bond supports national infrastructure development while offering stable and predictable fixed returns.
                            </p>

                            <table className="cert-ref-table">
                                <tbody>
                                    <tr>
                                        <td className="cert-ref-label">Bond Name</td>
                                        <td className="cert-ref-value">InfraGrowth Secure Bond</td>
                                    </tr>
                                    <tr>
                                        <td className="cert-ref-label">Bond Category</td>
                                        <td className="cert-ref-value">Infrastructure</td>
                                    </tr>
                                    <tr>
                                        <td className="cert-ref-label">Issuer</td>
                                        <td className="cert-ref-value">INFRS Capital Pvt. Ltd.</td>
                                    </tr>
                                    <tr>
                                        <td className="cert-ref-label">Tenure</td>
                                        <td className="cert-ref-value">{bond.tenure} Years</td>
                                    </tr>
                                    <tr>
                                        <td className="cert-ref-label">Interest Type</td>
                                        <td className="cert-ref-value">Fixed Return</td>
                                    </tr>
                                    <tr>
                                        <td className="cert-ref-label">Expected Annual Return</td>
                                        <td className="cert-ref-value">{bond.roi}%</td>
                                    </tr>
                                    <tr>
                                        <td className="cert-ref-label">Risk Level</td>
                                        <td className="cert-ref-value">Low to Moderate</td>
                                    </tr>
                                    <tr>
                                        <td className="cert-ref-label">Minimum Investment</td>
                                        <td className="cert-ref-value">{fintechService.formatCurrency(bond.amount)}</td>
                                    </tr>
                                    <tr>
                                        <td className="cert-ref-label">Issue Date</td>
                                        <td className="cert-ref-value">{bond.date}</td>
                                    </tr>
                                    <tr>
                                        <td className="cert-ref-label">Maturity Date</td>
                                        <td className="cert-ref-value">
                                            {bond.date ? new Date(new Date(bond.date).setMonth(new Date(bond.date).getMonth() + (bond.tenure || 12))).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }) : 'N/A'}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                            <p style={{ fontSize: '12px', color: '#64748b', marginTop: '20px' }}>
                                This document is system-generated and valid without a physical signature.
                            </p>

                            <div className="cert-footer-simple">
                                <div className="issuer-block">Authorized Issuer</div>
                                <div className="issuer-sub">INFRS Capital Pvt. Ltd.</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
};
export default CertificateModal;
