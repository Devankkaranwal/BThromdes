import { fetchGetToken, fetchFirstChecksum, fetchRequestPg } from "./apiServices";
// import { saveTransactionDetail } from "./apiService"; // Uncomment when backend is ready

export const handlePayment = async ({
    thromde,
    consumerDetails,
    navigation,
    setLoading,
    onError,
}) => {
    setLoading(true);
    const amount = consumerDetails.totalBill.toFixed(2);

    try {
        const token = await fetchGetToken(thromde);
        if (!token || token.error) {
            throw new Error("Failed to fetch token. Please select a valid thromde.");
        }

        const checksumData = await fetchFirstChecksum(amount, thromde);
        if (!checksumData || !checksumData.orderNo) {
            throw new Error("Failed to generate payment checksum.");
        }

        const { orderNo, trnTime, bfsChecksum } = checksumData;
        const paymentResponse = await fetchRequestPg(amount, orderNo, trnTime, bfsChecksum, thromde);
        if (!paymentResponse) {
            throw new Error("No response from payment gateway.");
        }
        if (paymentResponse.bfs_responseCode === "00") {
            const postData = {
                orderNo,
                trnTime,
                bfs_bfsTxnId: paymentResponse.bfs_bfsTxnId,
                thromde,
            };
            console.log('postData:', postData)

            // Optional: save transaction (if backend supports it)
            // await saveTransactionDetail(postData, token);

            navigation.navigate("BankSelection", {
                postData,
                consumerDetails,
            });
        } else {
            throw new Error(paymentResponse.bfs_responseMessage || "Payment failed. Please try again.");
        }
    } catch (error) {
        if (onError) {
            onError(error);
        } else {
            alert(error.message || "Payment failed. Please try again.");
        }
    } finally {
        setLoading(false);
    }
};
