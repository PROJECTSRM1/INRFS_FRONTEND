import React, { useRef, useState } from 'react';
import { Modal, Button, message } from 'antd';
import { DownloadOutlined, CloseOutlined } from '@ant-design/icons';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { fintechService } from '../services/fintechService';
import '../styles/dashboard.css';

interface CertificateModalProps {
    visible: boolean;
    onClose: () => void;
    bond: any;
    userName?: string;
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
            const canvas = await html2canvas(certRef.current, {
                scale: 3,
                useCORS: true,
                backgroundColor: '#ffffff'
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            pdf.addImage(imgData, 'PNG', 0, 0, 210, 297);
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
            closeIcon={<CloseOutlined />}
        >
            <div className="cert-preview-container">
                <div className="cert-modal-header">
                    <h3 className="cert-modal-title">Certificate Preview</h3>
                    <Button
                        type="primary"
                        icon={<DownloadOutlined />}
                        loading={downloading}
                        onClick={handleDownloadPDF}
                        className="cert-download-btn"
                    >
                        Download PDF
                    </Button>
                </div>

                <div className="cert-preview-wrapper">
                    <div ref={certRef} className="certificate-layout">
                        {/* Logo Watermark */}
                        <div className="cert-logo-watermark">
                            {/* Background image set in CSS */}
                        </div>

                        <div className="cert-content-layer">
                            {/* Header */}
                            <div className="cert-header">
                                <h1 className="cert-title">Infrastructure Bond Certificate</h1>
                                <p className="cert-subtitle">InfraGrowth Secure Bond</p>
                            </div>

                            <p className="cert-body-text">
                                This certificate confirms the issuance of an <strong>Infrastructure Bond</strong> under the <strong>InfraGrowth Secure Bond Program</strong> by <strong>INFRS Capital Pvt. Ltd.</strong> The bond supports national infrastructure development while offering stable and predictable fixed returns.
                            </p>

                            <table className="cert-details-table">
                                <tbody>
                                    <tr>
                                        <td className="cert-label">Bond Name</td>
                                        <td className="cert-val">InfraGrowth Secure Bond</td>
                                    </tr>
                                    <tr>
                                        <td className="cert-label">Bond Category</td>
                                        <td className="cert-val">Infrastructure</td>
                                    </tr>
                                    <tr>
                                        <td className="cert-label">Issuer</td>
                                        <td className="cert-val">INFRS Capital Pvt. Ltd.</td>
                                    </tr>
                                    <tr>
                                        <td className="cert-label">Tenure</td>
                                        <td className="cert-val">{bond.tenure} Months</td>
                                    </tr>
                                    <tr>
                                        <td className="cert-label">Interest Type</td>
                                        <td className="cert-val">Fixed Return</td>
                                    </tr>
                                    <tr>
                                        <td className="cert-label">Expected Annual Return</td>
                                        <td className="cert-val">{bond.roi}%</td>
                                    </tr>
                                    <tr>
                                        <td className="cert-label">Risk Level</td>
                                        <td className="cert-val">Low to Moderate</td>
                                    </tr>
                                    <tr>
                                        <td className="cert-label">Minimum Investment</td>
                                        <td className="cert-val">{fintechService.formatCurrency(bond.amount)}</td>
                                    </tr>
                                    <tr>
                                        <td className="cert-label">Issue Date</td>
                                        <td className="cert-val">{bond.date}</td>
                                    </tr>
                                    <tr>
                                        <td className="cert-label">Maturity Date</td>
                                        <td className="cert-val">
                                            {bond.date ? new Date(new Date(bond.date).setMonth(new Date(bond.date).getMonth() + (bond.tenure || 12))).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }) : 'N/A'}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                            <p className="cert-system-note">
                                This document is system-generated and valid without a physical signature.
                            </p>

                            <div className="cert-footer">
                                <div className="cert-sig-block">
                                    <div className="cert-sig-name">Authorized Issuer</div>
                                    <div className="cert-sig-title">INFRS Capital Pvt. Ltd.</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default CertificateModal;
