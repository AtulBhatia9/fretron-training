const rp = require('request-promise');
const token = "Bearer eyJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2MDU2OTA3NDcsInVzZXJJZCI6IjIyYjE0OTQ4LTQ0NDQtNGU5ZS04YWEyLThjMWQ2ZWM5ZTVkNCIsImVtYWlsIjoicmFodWwuYmFuc2FsQGZyZXRyb24uY29tIiwibW9iaWxlTnVtYmVyIjoiOTc4MTM2MjEyMCIsIm9yZ0lkIjoiNDk1Yjg3MjgtYzc2MS00ZmE3LTgzZmUtZGI3NWE3ZDYzMjIxIiwibmFtZSI6IlJhaHVsQmFuc2FsIiwib3JnVHlwZSI6IkZMRUVUX09XTkVSIiwiaXNHb2QiOnRydWUsInBvcnRhbFR5cGUiOiJiYXNpYyJ9.5JZ97_xidMFGkEwkDjZa95Emz2PU1D5lIjrFdf13y1w"
async function fetchShipments(token) {
    try {
        return await rp({
            uri: `http://apis.fretron.com/shipment-view/shipments/v1?filters={"__version":2,"_exists":["freightUnitLineItemId"]}&allFields=["freightUnitLineItemId", "uuid", "shipmentNumber"]&size=10`,
            json: true,
            headers: {
                Authorization: token,
            },
        });

    } catch (error) {
        console.log(`Catched error in getting shipments ${error.message}`);
    }
    return [];

}

async function fuGET(freightUnitLineItemId, token) {
    try {
        let url = `https://apis.fretron.com/automate/autoapi/run/99360a0c-dbb0-4b89-813e-10c6a27c4a8d?token=${token}&fuLineItemId=${freightUnitLineItemId}`

        let options = {
            uri: url,
            json: true,
        }

        return await rp(options)

    } catch (error) {
        console.log(`Catcher error - ${error.message}`)
    }

    return {
        data: null,
        error: "Some error!!!!",
        status: 500
    }
}

async function bulkSyncApi(payload, token) {
    const url = `https://apis.fretron.com/shipment/v1/shipment/bulk/sync`;
    try {
        const res = await rp({
            method: "POST",
            uri: url,
            body: payload,
            headers: {
                Authorization: token, // Include the Authorization header with the token
            },
            json: true,
        });

        console.log(`Bulk Sync api response status: ${res.status}`);

        if (res.status == 200) {
            return res.data;
        } else {
            console.log(`Bulk Sync api response error: ${res.error}`);
            throw new Error(res.error);
        }
    } catch (e) {
        console.log(`Caught Error in Bulk Sync api: ${e.message}`);
        throw e;
    }
}
main()
async function main() {
    try {
        const shipments = await fetchShipments(token)
        for (let items of shipments) {
            console.log(`Executing for shipment - ${items.shipmentNumber}`);
            const res = await fuGET(items.freightUnitLineItemId, token)
            const quantity = res.data[0].lineItems[0].salesOrderMappings[0].quantity
            const Quantity_To_Take =
                quantity?.volume?.netQuantity
                ?? quantity?.packageMeasurement?.netQuantity
                ?? quantity?.weight?.netQuantity
                ?? quantity?.containers?.netQuantity
                ?? quantity?.trucks?.netQuantity
                ?? 0

            console.log("Net Quantity :", Quantity_To_Take);
            const DocDate = new Date(res.data[0].documentDate).toLocaleDateString('en-GB')
            console.log("Document Date :", DocDate);
            const docnumber = res.data[0].documentNumber
            console.log("Document Number :", docnumber);
            const allowedloadtype = res.data[0].allowedLoadTypes[0].name
            console.log("Allowed Load Type :", allowedloadtype);

            const payload = {
                "shipmentId": items.uuid,

                "updates": [{

                    "keyToUpdate": "customfields",

                    "updatedValue": [{

                        "fieldKey": "Quantity",

                        "valueType": "string",

                        "fieldType": "text",

                        "value": Quantity_To_Take.toString(),

                    }, {

                        "fieldKey": "Document Number",

                        "valueType": "string",

                        "fieldType": "text",

                        "value": docnumber,

                    },
                    {

                        "fieldKey": "Document Date",

                        "valueType": "string",

                        "fieldType": "text",

                        "value": DocDate,

                    }, {

                        "fieldKey": "Allowed Load Type",

                        "valueType": "string",

                        "fieldType": "text",

                        "value": allowedloadtype,

                    }]

                }]

            }

            await bulkSyncApi(payload, token)
        }
    } catch (error) {
        console.log(`Some error ${error.message}`)

        return null
    }
}