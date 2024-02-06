const axios = require('axios');
const Payment = require('./payment');
const Orders = require('./orders');


const VNESH_DEFAULT_DATA = {
    "requestId": "1c4668c1-6f9a-4dca-857d-bb38584ceb42",
    "environment": {
        "merchant": {

            "id": "300000000000053"
        },
        "poi": {
            "id": "30000053",
            "language": "en-US"
        },
        "card": null,
        "cardRecipient": null,
        "recipientAccount": null,
        "customer": {
            "name": "John Doe",
            "language": "en-US",
            "email": "john.doe@email.com",
            "homePhone": {
                "cc": "993",
                "subscriber": "22555666"
            },
            "mobilePhone": {
                "cc": "993",
                "subscriber": "99777888"
            },
            "workPhone": null
        },
        "customerDevice": {
            "browser": {
                "acceptHeader": "*/*",
                "ipAddress": "10.33.27.3",
                "javaEnabled": true,
                "javascriptEnabled": false,
                "language": "en-US",
                "screenColorDepth": 32,
                "screenHeight": 1200,
                "screenWidth": 1900,
                "timeZone": 120,
                "userAgentString": "Mozilla/5.0 (Windows NT 6.1; WOW64; rv:40.0) Gecko/20100101 Firefox/40.3"
            },
            "mobileApp": null
        },
        "billingAddress": {
            "sameAsShipping": true,
            "line1": "Annex 4",
            "line2": "1st floor",
            "line3": null,
            "postCode": "2020",
            "city": "01",
            "countrySubdivision": "01",
            "country": "795"
        },
        "shippingAddress": {
            "sameAsShipping": false,
            "line1": "Annex 4",
            "line2": "1st floor",
            "line3": null,
            "postCode": "2020",
            "city": "01",
            "countrySubdivision": "01",
            "country": "795"
        },
        "transport": {
            "merchantFinalResponseUrl": "https://localhost/Order/FinalResponse/45a6c6ee-a865-438f-b98d-6a37e25f7e15",
            "challengeResponseUrl": "https://localhost/Order/NotificationUrl/45a6c6ee-a865-438f-b98d-6a37e25f7e15",
            "challengeWindowSize": 3,
            "challengeResponseData": null,
            "threeDSMethodNotificationUrl": "https://localhost/Order/ThreeDSecureNotificationUrl/45a6c6ee-a865-438f-b98d-6a37e25f7e15",
            "methodCompletion": false,
            "consent": false,
            "endpointHostAddress": "/orders/45a6c6ee-a865-438f-b98d-6a37e25f7e15"
        },
        "sponsoredMerchant": null,
        "sponsoredMerchantPOI": null
    },
    "transaction": {
        "invoiceNumber": "1c4668c1-6f9a-4dca-857d-bb38584ceb42",
        "type": "CRDP",
        "additionalService": null,
        "transactionText": null,
        "totalAmount": 1.00,
        "currency": "934",
        "currencyConversion": null,
        "detailedAmount": null,
        "airlineItems": null,
        "merchantOrderId": "45a6c6ee-a865-438f-b98d-6a37e25f7e15",
        "autoComplete": false,
        "antiMoneyLaundering": {
            "senderName": null,
            "senderDateOfBirth": null,
            "senderPlaceOfBirth": null,
            "nationalIdentifier": null,
            "nationalIdentifierCountry": null,
            "nationalIdentifierExpiry": null,
            "passportNumber": null,
            "passportIssuingCountry": null,
            "passportExpiry": null
        },
        "instalment": null,
        "merchantCategoryCode": null,
        "transactionRiskAnalysis": false,
        "secureCorporatePayment": false,
        "requestDigitalTransactionInsights": false,
        "merchantRiskAssesment": null
    },
    "response": null,
}



const BankStatuses = {
    NEW: 0,
    SUCCESS: 1,
    FAILED: 2,
    CANCELLED: 3,
    REFUNDED: 4,
}

const VneshBankStatuses = {
    SUCCESS: 'GEN-00000',
    ERR_SYSTEM: 'GEN-00001',
    ERR_NOTAUTH: 'GEN-00002',
    UNKNOWN: 'OPG-00001',
    CANCEL: 'OPG-00006',
    NOPAYMENT: 'OPG-00100',

}


const getTokenTFEB = async () => {
    const data = {
        client_id: "347.300000000000053.30000053",
        client_secret: "jx4&_K&g62FdB2!pxK@uJAqGv#VRkm#h",
        scope: 'TSYS.Prime.WebApplications.OrderProcessing',
        grant_type: 'client_credentials'
    }
    const host = "https://3dst.tfeb.gov.tm/identityserver/connect/token"
    try {
        const response = await axios.post(host, new URLSearchParams(data), {
            headers: {
                'Content-Type': "application/x-www-form-urlencoded"
            }
        })
        const { access_token } = response.data
        if (!access_token) {
            throw { success: false, message: "Täzeden synanyşmagyňyzy hayyş edýäris" }
        }
        return { success: true, token: access_token }

    } catch (err) {
        console.log(err)
        throw { success: false, message: "Täzeden synanyşmagyňyzy hayyş edýäris" }
    }
}


const registerUrlTFEB = 'https://ecomt.tfeb.gov.tm/OrderProcessing_TURK/v1/orders'

const registerTFEB = async (transactionId, amount) => {
    try {
        const { token } = await getTokenTFEB()
        console.log('load response to token')

        // const token = 'eyJhbGciOiJSUzI1NiIsImtpZCI6IkNFMTFEMDIzOUYxREY5RUUwRkFCOEUxMUZFNzk3NTUwNURCNkY5ODZSUzI1NiIsIng1dCI6InpoSFFJNThkLWU0UHE0NFJfbmwxVUYyMi1ZWSIsInR5cCI6ImF0K2p3dCJ9.eyJpc3MiOiJodHRwczovLzNkc3QudGZlYi5nb3YudG0vaWRlbnRpdHlzZXJ2ZXIvIiwibmJmIjoxNzA1NTc2MjA5LCJpYXQiOjE3MDU1NzYyMDksImV4cCI6MTcwNTY2MjYwOSwiYXVkIjoiVFNZUy5QcmltZS5XZWJBcHBsaWNhdGlvbnMuT3JkZXJQcm9jZXNzaW5nIiwic2NvcGUiOlsiVFNZUy5QcmltZS5XZWJBcHBsaWNhdGlvbnMuT3JkZXJQcm9jZXNzaW5nIl0sImNsaWVudF9pZCI6IjM0Ny4zMDAwMDAwMDAwMDAwNTMuMzAwMDAwNTMiLCJpbnN0aXR1dGlvbiI6IjM0N3xUVVJLIiwianRpIjoiQjA3MTRBREMyNkM4MDczN0Q2NkNFREMwMkFENEY2NTEifQ.Y0VSMPYDjbYpQEzLxPYvb2WNI9N1QfbkF9JdVIrIvdIWyuA0B6dlxRYQg1sXAXF-Bh23lFBIek8VfaAu0rNOQMIluJVxSXTGpqttzsyi6E_Sonk-R8fiIgMd133Ij7LnWPTXy008x6mAaywJh6nww974i1Sr03DakE2uq77HBhzbI-ZpkLIm7Q5T14fKiWkHaZceE7UxnFebqS4a-tBVYtNqyXvrVQMps14ailt-r6Hvs-VUJd4GBXk78FOCDUrg2VyKkI88AzLbptzFjqccm791Pz5z0cTDG64OyzU4LSYCiAHZrBx4GORjHL6imV6BoL5u2E78npWCCxbyhTfZsA'
        let data_bank = VNESH_DEFAULT_DATA
        const requestId = new Date().getTime().toString()
        data_bank.requestId = requestId;
        data_bank.transaction.invoiceNumber = requestId
        data_bank.transaction.totalAmount = amount
        data_bank.transaction.merchantOrderId = transactionId
        data_bank.environment.transport.merchantFinalResponseUrl = "https://hazynadoner.com.tm/api/v1/order/payment/callback-handler-tfeb"
        data_bank.environment.transport.challengeResponseUrl = "https://hazynadoner.com.tm/api/v1/order/payment/callback-handler-tfeb"
        console.log('load response to checkout')
        const secResponse = await axios(
            {
                url: registerUrlTFEB,
                method: 'POST',
                data: JSON.stringify(data_bank),
                headers: {
                    'Content-Type': "application/json",
                    'Accept': "application/hal+json",
                    'User-Agent': 'TSYS.Prime.WebApplications.OrderProcessing.Web/1.0.5',
                    'Authorization': `Bearer ${token}`
                },
            }
        )
        console.log(secResponse.data, secResponse.data.response.operationResult, '-response')
        if (secResponse.data.response.operationResult == VneshBankStatuses.NOPAYMENT) {
            return {
                orderId: secResponse.data.response.orderId,
                success: true,
                url: secResponse.data._links.redirectToCheckout.href,
                finalUrl: "https://hazynadoner.com.tm/api/v1/order/payment/callback-handler-tfeb/" + secResponse.data.response.orderId,
                checkOrder: "https://hazynadoner.com.tm/api/v1/order/payment/check-status-tfeb?orderId=" + secResponse.data.response.orderId
            }
        }
        return { success: false, orderId: null, formUrl: null, finalUrl: null, checkOrder: null }
    } catch (err) {
        console.log(err)
        throw { success: false, message: 'Tazeden synanyşmagyňyzy haýyş edýäris' }
    }
}

const checkOrderTFEB = async (transactionId) => {
    const order = await Orders.findOne({
        attributes: ["paymentMethod", "bank"],
        include: [
            {
                model: Payment,
                where: {
                    transactionId
                }
            }
        ]
    })
    if (order.isPaidBank == true)
        return { success: true, isPaidBank: order.isPaidBank, message: 'Siziň sargytyňyz üstünlikli tölendi' }

    const url = `https://ecomt.tfeb.gov.tm/OrderProcessing_TURK/v1/Orders/${transactionId}`
    console.log("Loadingtoken")
    try {
        const { token } = await getTokenTFEB()
        // const token = `eyJhbGciOiJSUzI1NiIsImtpZCI6IkNFMTFEMDIzOUYxREY5RUUwRkFCOEUxMUZFNzk3NTUwNURCNkY5ODZSUzI1NiIsIng1dCI6InpoSFFJNThkLWU0UHE0NFJfbmwxVUYyMi1ZWSIsInR5cCI6ImF0K2p3dCJ9.eyJpc3MiOiJodHRwczovLzNkc3QudGZlYi5nb3YudG0vaWRlbnRpdHlzZXJ2ZXIvIiwibmJmIjoxNzA1NjI1OTA0LCJpYXQiOjE3MDU2MjU5MDQsImV4cCI6MTcwNTcxMjMwNCwiYXVkIjoiVFNZUy5QcmltZS5XZWJBcHBsaWNhdGlvbnMuT3JkZXJQcm9jZXNzaW5nIiwic2NvcGUiOlsiVFNZUy5QcmltZS5XZWJBcHBsaWNhdGlvbnMuT3JkZXJQcm9jZXNzaW5nIl0sImNsaWVudF9pZCI6IjM0Ny4zMDAwMDAwMDAwMDAwNTMuMzAwMDAwNTMiLCJpbnN0aXR1dGlvbiI6IjM0N3xUVVJLIiwianRpIjoiMzdEQUQwMTRBODVFQzAwQTcwMTU5OTFGMkY0Nzg0RkMifQ.hIybIHSmbYQif56qqLyFh9-wO68LlYDfnwD7uHN0nk88EDseCErI9SmVQXiVpKmO5hx7CXPP9VzU7s7vmK0cOh17E2QPlLsvaoeySOQnngt9YU-A2AF6t63xt0ddnIN4Ux3azwHBdXK-UwHDz6N1XcZR0vs4ZdF57M5Lkzun8N3n3IGGp2CWv5Wbw9BUvcZfWYFZvGVonZp63La1mkE1sW9FWEPn53etsS81AFSm7nY09vdy9pUgt7zLQGlb7tWagbtE2XSJYyiXwQC9XxGzCkmgw_sXZhP1lCji2I9-0KZDO3SQj78xzlHadNA3b_q2_GEjpDTxJJ6V3zydCj14Bg`
        console.log(token, '00')
        const fourthResponse = await axios(
            {
                url: url,
                headers: {
                    'Content-Type': "application/json",
                    'Accept': "application/hal+json",
                    'User-Agent': 'TSYS.Prime.WebApplications.OrderProcessing.Web/1.0.5',
                    'Authorization': `Bearer ${token}`
                },
                method: 'GET'
            }
        )
        console.log(fourthResponse)
        console.log(fourthResponse.data.response, fourthResponse.data._links, fourthResponse.data._links.redirectToCheckout)

        if (fourthResponse.data.response.operationResult == VneshBankStatuses.SUCCESS) {
            return { success: true, message: 'Siziň sargytyňyz üstünlikli tölendi' }
        }
        return { success: false, message: 'Tazeden synanyşmagyňyzy haýyş edýäris' }

    } catch (err) {
        console.log(err)
        throw { success: false, message: 'Tazeden synanyşmagyňyzy haýyş edýäris' }
    }
}

const refundOrderTFEB = async (url, transactionId, amount) => {

    console.log("Loadingtoken")
    const { token } = await getTokenTFEB()

    let data_bank = VNESH_DEFAULT_DATA
    data_bank.requestId = requestId;
    data_bank.transaction.invoiceNumber = requestId
    data_bank.transaction.totalAmount = amount
    data_bank.transaction.type = 'RFND'
    data_bank.transaction.merchantOrderId = transactionId
    data_bank.environment.transport.merchantFinalResponseUrl = "https://hazynadoner.com.tm/api/v1/order/payment/callback-handler-tfeb"
    data_bank.environment.transport.challengeResponseUrl = "https://hazynadoner.com.tm/api/v1/order/payment/callback-handler-tfeb"
    const thirdResponse = await axios(
        {
            url: url + "/refund",
            data: JSON.stringify(data_bank),
            headers: {
                'Content-Type': "application/json",
                'Accept': "application/hal+json",
                'User-Agent': 'TSYS.Prime.WebApplications.OrderProcessing.Web/1.0.5',
                'Authorization': `Bearer ${token}`
            },
            method: 'POST'
        }
    )

}


module.exports = {
    checkOrderTFEB,
    getTokenTFEB,
    registerTFEB,
    refundOrderTFEB,
}