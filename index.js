const rp = require("request-promise");

async function fetchShipments() {
    const token = "Beaer eyJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2MjYxNjY0NDEsInVzZXJJZCI6ImViZTU3NTFhLWEwNWItNDZiNi05MWI0LTFjMTEyYTkwZjYzOCIsImVtYWlsIjoic3V5YXNoLmt1bWFyQGZyZXRyb24uY29tIiwibW9iaWxlTnVtYmVyIjoiOTU1NTEwNzcwMCIsIm9yZ0lkIjoiNDk1Yjg3MjgtYzc2MS00ZmE3LTgzZmUtZGI3NWE3ZDYzMjIxIiwibmFtZSI6IlN1eWFzaCAiLCJvcmdUeXBlIjoiRkxFRVRfT1dORVIiLCJpc0dvZCI6ZmFsc2UsInBvcnRhbFR5cGUiOiJiYXNpYyJ9.R6P2W7LrKpdOfyMdsVn-3h_sJ5SB16EHUsl3ztkUBt4"
    try {
        const options = {
            uri: "https://apis.fretron.com/shipment/v1/shipment/41032e3c-56ac-4f42-9cf5-729e8d3053ca?skipCn=true",
            method: "GET",
            headers: {
                Authorization: token,
            },
            json: true,
        };
        const res = await rp(options);
        const shipmentData = [];
        const shipments = res.data
        const freightUnitLineItemId = shipments.freightUnitLineItemId;
        const shipmentDate = shipments.shipmentDate;
        const freightCostObj = shipments.customFields.find(item => item.fieldKey == 'FreightCost');
        const freightCost = Number(freightCostObj.value)
        const isDelay = shipments.isDelay;
        const shipmentObject = {
            freightUnitLineItemId: freightUnitLineItemId,
            shipmentDate: new Date(shipmentDate).toLocaleDateString('en-GB'),
            freightCost: freightCost,
            isDelay: isDelay
        };

        shipmentData.push(shipmentObject);
        console.log(shipmentData);
    } catch (error) {
        console.log(`Some error ${error.message}`)

        return null
    }
}
fetchShipments();