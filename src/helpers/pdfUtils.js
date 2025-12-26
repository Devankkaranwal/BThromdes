import { generatePDF } from 'react-native-html-to-pdf';
import { phuentsholinglogoBase64, gelephulogoBase64, samdruplogoBase64 } from './images';

const logos = {
    'Gelephu Thromde': gelephulogoBase64,
    'Phuentsholing Thromde': phuentsholinglogoBase64,
    'Samdrup Jongkhar Thromde': samdruplogoBase64,
};

export const pdfGenerate = async (receiptItems, paymentModes, theme, title) => {
    const logoBase64 = logos[title] || '';

    if (!receiptItems || !Array.isArray(receiptItems) || receiptItems.length === 0) {
        throw new Error('No receipt data available to generate PDF.');
    }

    if (!paymentModes || !Array.isArray(paymentModes) || paymentModes.length === 0) {
        throw new Error('No payment modes data available to generate PDF.');
    }

    const receiptInfo = receiptItems[0];
    const paymentModeInfo = paymentModes[0];
    console.log('receiptInfo:', receiptInfo)
    console.log('receiptInfo:', receiptInfo)

    const formatCurrency = (amount) => (typeof amount === 'number' ? amount.toFixed(2) : '0.00');

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'N/A';
        return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
    };

    const htmlContent = `
<html>
<head>
    <style>
        body { 
            font-family: 'Helvetica', Arial, sans-serif; 
            margin: 20px; 
            background-color: ${theme.background};
        }
        .header { 
            text-align: center; 
            font-size: 22px; 
            font-weight: bold; 
            background-color: ${theme.primary};
            padding: 15px;
            color: ${theme.text}
        }
        .line { 
            border-bottom: 2px solid ${theme.background}; 
            margin-bottom: 20px;
        }
        .table { 
            width: 100%; 
            border-collapse: collapse; 
            margin-bottom: 20px;
        }
        .table th, .table td { 
            border: 1px solid ${theme.background}; 
            padding: 12px; 
            text-align: left;
            color: ${theme.text}
        }
        .table th { 
            background-color: ${theme.primary};
            color: ${theme.text}; 
        }
        .table tr:nth-child(even) { 
            background-color:${theme.background}; 
        }
        .total-container { 
            display: flex; 
            justify-content: space-between; 
            margin-top: 20px; 
            font-weight: bold;
            color: ${theme.text}

        }
        .logo { 
            width: 80px; 
            height: auto; 
            float: left; 
            margin-left: 15px; 
        }
        .details div { 
            margin-bottom: 10px; 
        }
        .receipt-header { 
            font-size: 24px; 
            font-weight: bold; 
            margin: 10px 5px; 
            text-align: center;
            color: ${theme.text}
        }
        .header-content { 
            text-align: center; 
        }
        .logo-container { 
            float: left; 
        }
        .note-text {
            font-weight: 'bold';
            color: ${theme.text}

        }
        .note-container {
            margin: 20px 0px;
        }
        
    </style>
</head>
<body>
    <div class="header">
        <div class="logo-container">
            <img src="${logoBase64}" alt="Logo" class="logo" />
        </div>
        <div class="header-content">
            ${title}<br />
            Payment Receipt
        </div>
        <div style="clear: both;"></div>
    </div>
    <hr class="line">
    <div class="details">
        <div class="total-container">
            <div><strong>Payment Date:</strong> ${formatDate(paymentModeInfo.paymentModeDate)}</div>
            <div><strong>Receipt No:</strong> ${receiptInfo.receiptNo || 'N/A'}</div>
        </div>
        <div class="total-container">
            <div><strong>CID:</strong> ${receiptInfo.cid || 'N/A'}</div>
            <div><strong>Name:</strong> ${receiptInfo.name || 'N/A'}</div>
            <div><strong>TTIN:</strong> ${receiptInfo.ttin || 'N/A'}</div>
        </div>
    </div>
    <table class="table">
        <thead>
            <tr>
                <th>Tax Name</th>
                <th>Tax Year</th>
                <th>Plot No</th>
                <th>Thram No</th>
                <th>Penalty Days</th>
                <th>Penalty Amount</th>
                <th>Amount</th>
            </tr>
        </thead>
        <tbody>
            ${receiptItems.map(item => `
                <tr>
                    <td>${item.taxName || 'N/A'}</td>
                    <td>${item.taxYear || 'N/A'}</td>
                    <td>${item.plotNo || 'N/A'}</td>
                    <td>${item.thramNo || 'N/A'}</td>
                    <td>${item.penaltyDays || 0}</td>
                    <td>${formatCurrency(item.penaltyAmount || 0)}</td>
                    <td>${formatCurrency(item.amount || 0)}</td>
                </tr>
            `).join('')}
        </tbody>
    </table>
    <div class="total-container">
        <div class="total">Total Amount: ${formatCurrency(receiptItems.reduce((sum, item) => sum + (item.amount || 0), 0))}</div>
        <div><strong>Payment Mode:</strong> ${paymentModeInfo.paymentmode || 'N/A'}</div>
        <div><strong>Bank:</strong> ${paymentModeInfo.bank || 'N/A'}</div>
    </div>
</body>
</html>
`;

    const options = {
        html: htmlContent,
        fileName: 'ReceiptDetails',
        directory: 'Documents',
    };

    try {
        const pdf = await generatePDF(options);
        return pdf.filePath;
    } catch (error) {
        throw error;
    }
};
