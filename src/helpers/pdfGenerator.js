import RNHTMLtoPDF from 'react-native-html-to-pdf';
import { Platform } from 'react-native';
import RNFS from 'react-native-fs';
import { phuentsholinglogoBase64 } from './images'; // Ensure you have this base64 logo
import { formatTransactionTime } from './validation';

/**
 * Generates the HTML content for the receipt.
 * @param {string[]} labels - Array of labels for the receipt.
 * @param {string[]} customerData - Corresponding data for the labels.
 * @param {string} date - Formatted transaction date.
 * @param {string} time - Formatted transaction time.
 * @returns {string} - HTML content as a string.
 */
const generateHtmlContent = (labels, customerData, date, time) => `
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; margin: 20px; padding: 0; color: #333; }
            .header { 
                text-align: center; 
                font-size: 22px; 
                font-weight: bold; 
                color: white;
                background-color: #25cb99; 
                padding: 15px;
            }
            .line { 
                border-bottom: 2px solid #333; 
                margin-bottom: 20px;
            }
            .logo { 
                width: 80px; 
                height: auto; 
                float: left; 
                margin-left: 15px; 
            }
            .receipt-header { 
                font-size: 24px; 
                font-weight: bold; 
                margin: 10px 0; 
            }
            .header-content { 
                text-align: center; 
            }
            .logo-container { 
                float: left; 
            }
            .clear { 
                clear: both; 
            }
            .info-table { 
                width: 100%; 
                border-collapse: collapse; 
                margin-top: 20px; 
            }
            .info-table td { 
                padding: 12px; 
                border: 1px solid #ddd; 
            }
            .info-table .label { 
                font-weight: bold; 
            }
            .date-time { 
                display: flex; 
                justify-content: space-between; 
                margin-top: 10px; 
                padding: 0 20px; 
            }
        </style>
    </head>
    <body>
        <div class="header">
            <div class="logo-container">
                <img src="${phuentsholinglogoBase64}" alt="Logo" class="logo" />
            </div>
            <div class="header-content">
                Thimphu Thromde<br />
                Payment Receipt
            </div>
            <div class="clear"></div>
        </div>
        <hr class="line">
        <div class="date-time">
            <p>Date: ${date}</p>
            <p>Time: ${time}</p>
        </div>
        <table class="info-table">
            <tbody>
                ${labels.map((label, index) => `
                    <tr>
                        <td class="label">${label}</td>
                        <td>${customerData[index]}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    </body>
    </html>
`;

/**
 * Generates a PDF receipt and saves it to the appropriate directory.
 * @param {string[]} labels - Array of labels for the receipt.
 * @param {string[]} customerData - Corresponding data for the labels.
 * @returns {Promise<string>} - File path of the generated PDF.
 */
export const generateReceiptPdf = async (labels, customerData) => {
    const datetime = customerData[3];
    const { date, time } = formatTransactionTime(datetime);

    const html = generateHtmlContent(labels, customerData, date, time);

    try {
        const directory =
            Platform.OS === 'android'
                ? RNFS.DownloadDirectoryPath
                : RNFS.DocumentDirectoryPath;

        const options = {
            html,
            fileName: 'PaymentReceipt',
            directory,
        };

        const file = await RNHTMLtoPDF.convert(options);
        return file.filePath;
    } catch (error) {
        throw error;
    }
};
