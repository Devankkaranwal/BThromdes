export const bankItems = [
    { label: 'Bank of Bhutan', value: '1010', image: require('../assets/images/bob.webp') },
    { label: 'Bhutan National Bank', value: '1020', image: require('../assets/images/bnb.webp') },
    { label: 'Druk Pnb', value: '1030', image: require('../assets/images/drukpnb.webp') },
    { label: 'Bhutan Development Bank', value: '1040', image: require('../assets/images/bdbl.webp') },
    { label: 'Tashi Bank', value: '1050', image: require('../assets/images/tashibank.webp') },
    { label: 'Digital Kidu Bank', value: '1060', image: require('../assets/images/dk.webp') },
];


export function GarbageAndAmenatiesFeesCalculation(data) {
    if (!Array.isArray(data) || data.length === 0) {
        return { totalAmount: 0 };
    }
    const totals = data.reduce((acc, item) => {
        const taxAmount = (item.landTaxAmount || 0) +
            (item.garbageTax || 0) +
            (item.streetLightTax || 0);
        acc.totalAmount += taxAmount;
        return acc;
    }, { totalAmount: 0 });
    return {
        totalAmount: totals.totalAmount.toFixed(2),
    };
}

const currentYear = new Date().getFullYear();
const previousYear = currentYear - 1;

export const yearItems = [
    { label: `${currentYear}`, value: currentYear },
    { label: `${previousYear}`, value: previousYear },
];


export function convertToFullYear(twoDigitYear) {
    const currentYear = new Date().getFullYear();
    const currentCentury = Math.floor(currentYear / 100) * 100;
    // Parse the year to make sure it's an integer
    const year = parseInt(twoDigitYear, 10);

    if (isNaN(year) || year < 0 || year > 99) {
        return 'Invalid year';
    }
    const fullYear = currentCentury + year;
    // Adjust if the result is in the future
    if (fullYear > currentYear) {
        return fullYear - 100;
    }
    return fullYear;
}

export function accountValidate(paymentForm) {
    const { bob, bnb, dpnb, bdbl, tbank, dkb } = paymentForm;
    const errors = {
        bob: '',
        bnb: '',
        dpnb: '',
        bdbl: '',
        tbank: '',
        dkb: '',
    };

    let isValid = true;

    const validateBankNumber = (docNo, expectedLength) =>
        new RegExp(`^\\d{${expectedLength}}$`).test(docNo);

    if (bob.value) {
        if (!validateBankNumber(bob.value, 9)) {
            errors.bob = 'Please Enter 9 digits account number.';
            isValid = false;
        }
    }

    if (bnb.value) {
        if (!validateBankNumber(bnb.value, 9)) {
            errors.bnb = 'Please Enter 9 digits account number.';
            isValid = false;
        }
    }

    if (dpnb.value) {
        if (!validateBankNumber(dpnb.value, 12)) {
            errors.dpnb = 'Please Enter 13 digits account number.';
            isValid = false;
        }
    }

    if (bdbl.value) {
        if (!validateBankNumber(bdbl.value, 13)) {
            errors.bdbl = 'Please Enter 13 digits account number.';
            isValid = false;
        }
    }

    if (tbank.value) {
        if (!validateBankNumber(tbank.value, 9)) {
            errors.tbank = 'Please Enter 9 digits account number.';
            isValid = false;
        }
    }

    if (dkb.value) {
        if (!validateBankNumber(dkb.value, 12)) {
            errors.dkb = 'Please Enter 12 digits account number.';
            isValid = false;
        }
    }
    return {
        isValid,
        errors,
    };
}

export const thromdesList = [
    {
        name: 'Gelephu Thromde',
        icon: require('../assets/images/gelephu.webp'),
        thromde: 'GT',
    },
    {
        name: 'Phuentsholing Thromde',
        icon: require('../assets/images/phuentsholing.webp'),
        thromde: 'PT',
    },
    {
        name: 'Samdrup Jongkhar Thromde',
        icon: require('../assets/images/samdrupjonkhar.webp'),
        thromde: 'SJT',
    },
];





