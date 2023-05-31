const rp = require('request-promise');

async function fetchShipments() {
    const apiUrl = 'https://example.com/shipments';
    const authToken = 'Beaer eyJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2MjYxNjY0NDEsInVzZXJJZCI6ImViZTU3NTFhLWEwNWItNDZiNi05MWI0LTFjMTEyYTkwZjYzOCIsImVtYWlsIjoic3V5YXNoLmt1bWFyQGZyZXRyb24uY29tIiwibW9iaWxlTnVtYmVyIjoiOTU1NTEwNzcwMCIsIm9yZ0lkIjoiNDk1Yjg3MjgtYzc2MS00ZmE3LTgzZmUtZGI3NWE3ZDYzMjIxIiwibmFtZSI6IlN1eWFzaCAiLCJvcmdUeXBlIjoiRkxFRVRfT1dORVIiLCJpc0dvZCI6ZmFsc2UsInBvcnRhbFR5cGUiOiJiYXNpYyJ9.R6P2W7LrKpdOfyMdsVn-3h_sJ5SB16EHUsl3ztkUBt4';

    try {
        const options = {
            uri: apiUrl,
            headers: {
                Authorization: authToken
            },
            json: true
        };

        const shipments = await rp.get(options);

        const shipmentArray = [];

        shipments.forEach(shipment => {
            const freightUnitLineItemId = shipment.freightUnitLineItemId;
            const shipmentDate = shipment.shipmentDate;
            const freightCost = shipment.freightCost;
            const isEarly = shipment.isEarly;

            const shipmentObject = {
                freightUnitLineItemId,
                shipmentDate,
                freightCost,
                isEarly
            };

            shipmentArray.push(shipmentObject);
        });

        console.log(shipmentArray);

    } catch (error) {
        console.error(error);
    }
}

fetchShipments();
