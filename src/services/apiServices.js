import axios from "axios";
import Config from "react-native-config";

const BASE_URL = Config.API_URL || "http://157.10.140.9:8099";

const apiService = axios.create({
    baseURL: BASE_URL,
    headers: { "Content-Type": "application/json" },
    timeout: 100000,
});

apiService.interceptors.request.use(
    (config) => {
        console.log("[REQUEST]", config.method?.toUpperCase(), `${config.baseURL}${config.url}`);
        return config;
    },
    (error) => Promise.reject(error)
);

apiService.interceptors.response.use(
    (response) => {
        console.log("[RESPONSE]", response.status, response.config.url);
        return response;
    },
    (error) => {
        if (error.response) {
            console.log("[ERROR RESPONSE]", error.response.status, error.config?.url);
        } else {
            console.log("[NETWORK ERROR]", error.message);
        }
        return Promise.reject(error);
    }
);

const handleError = (error) => {
    if (!error.response) return { error: "Please check your internet connection." };

    const { status, data } = error.response;
    const message =
        data?.message ||
        data?.info ||
        ({
            500: "Internal Server Error",
            404: "Server Down",
            401: "Unauthorized Access",
        }[status] || "Something went wrong.");

    return { error: message };
};

const getRequest = async (endpoint, params = {}, thomde, fullUrl = null) => {
    try {
        const config = { params: { ...params, thomde } };
        const url = fullUrl || endpoint;
        const response = await apiService.get(url, config);
        return response.data;
    } catch (error) {
        return handleError(error);
    }
};

const postRequest = async (endpoint, data = {}, thomde) => {
    try {
        const response = await apiService.post(endpoint, data, { params: { thomde } });
        return response.data;
    } catch (error) {
        return handleError(error);
    }
};

export const ApiLogin = async ({ userName, password, thomde }) => {
    try {
        const response = await axios.post(
            `${BASE_URL}/api/Auth/login`,
            { userName, password, thomde },
            { headers: { "Content-Type": "application/json" }, timeout: 10000 }
        );
        return response.data;
    } catch (error) {
        throw handleError(error);
    }
};


export const fetchGetWaterReadingByWaterConnectionID = (waterConnectionDetailsId, thomde) =>
    getRequest("/api/Water/getWaterReadingByWaterConnectionID", { waterConnectionDetailsId }, thomde);

export const fetchGetConsumerNoByMeterNo = (meterNo, thomde) =>
    getRequest("/api/Water/GetConsumerNoByMeterNo", { meterNo }, thomde)

export const fetchConsumerDetails = (consumerNo, thomde) =>
    getRequest("/api/Water/GetConsumerDetailByConsumerNo", { consumerNo }, thomde)

export const fetchGetWaterBillByWaterMeterReadingnId = (readingId, asOfDate, thomde) =>
    getRequest("/api/Water/GetWaterBillByWaterMeterReadingnId", { readingId, asOfDate }, thomde);

export const fetchSearchReceipt = (ids, thomde) =>
    getRequest("/api/Stall/getTaxPayerDetails", { ids }, thomde);

export const fetchGetRecepit = (taxPayerId, calendarYearId, thomde) =>
    getRequest("/api/Payment/GetRecepit", { taxPayerId, calendarYearId }, thomde);

export const fetchGetRecepitDetails = (receiptId, thomde) =>
    getRequest("/api/Payment/GetRecepitDetails", { receiptId }, thomde);

export const fetchGetPaymentMode = (receiptId, thomde) =>
    getRequest("/api/Payment/GetPaymentMode", { receiptId }, thomde);

// API for paymentgateway
export const fetchGetToken = (thomde) =>
    postRequest("/api/TTPay/GetToken", { thomde });

export const fetchFirstChecksum = (amount, thomde) =>
    getRequest("/api/TTPay/FirstChecksum", { amount }, thomde);

export const fetchRequestPg = (amount, orderNo, trnTime, bfsChecksum, thomde) =>
    postRequest("/api/TTPay/RequestPg", { amount, orderNo, trnTime, bfsChecksum, thomde });

export const fetchSecondChecksum = (accountNo, bankId, txnId, thomde) =>
    getRequest("/api/TTPay/SecondChecksum", { accountNo, bankId, txnId, thomde });

export const fetchRequestOtp = (bfsTxnId, remitterAccNo, remitterBankId, checksum, thomde) =>
    postRequest("/api/TTPay/RequestOtp", { bfsTxnId, remitterAccNo, remitterBankId, checksum, thomde });


export const fetchThirdChecksum = (txnId, remitterOtp, thomde) =>
    getRequest("/api/TTPay/ThirdChecksum", { txnId, remitterOtp, thomde });

export const fetchSubmitOtp = (bfsTxnId, remitterOtp, checksum, thomde) =>
    postRequest("/api/TTPay/SubmitOtp", { bfsTxnId, remitterOtp, checksum, thomde });

export const fetchGetWaterBill = (consumerNo, yearId, monthId, thomde) =>
    getRequest(
        "/api/Water/GetWaterBillByConsumerNo",
        { consumerNo, yearId, monthId }, // query params object
        thomde                         // separate thomde param
    );
export const saveWaterMeterReading = (waterConnectionDetailsId, connectionType, newReading, newReadingDate, readBy, userId, thomde, transactionName) =>
    postRequest(
        "/api/Water/SaveWaterMeterReading",
        {
            waterConnectionDetailsId,
            connectionType,
            newReading,
            newReadingDate,
            readBy,
            userId,
            thomde,
            transactionName
        }
    );

export { getRequest, postRequest };
export default apiService;
