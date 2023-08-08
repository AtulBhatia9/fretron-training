const rp = require("request-promise");
const _ = require('lodash');
const TOKEN = "Bearer eyJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2ODY2NTM3NDksInVzZXJJZCI6ImViZTU3NTFhLWEwNWItNDZiNi05MWI0LTFjMTEyYTkwZjYzOCIsImVtYWlsIjoic3V5YXNoLmt1bWFyQGZyZXRyb24uY29tIiwibW9iaWxlTnVtYmVyIjoiOTU1NTEwNzcwMCIsIm9yZ0lkIjoiNDk1Yjg3MjgtYzc2MS00ZmE3LTgzZmUtZGI3NWE3ZDYzMjIxIiwibmFtZSI6IlN1eWFzaCAiLCJvcmdUeXBlIjoiRkxFRVRfT1dORVIiLCJpc0dvZCI6dHJ1ZSwicG9ydGFsVHlwZSI6ImJhc2ljIn0.Qr4spiBBy5tYh0Y-u-ENQT-OtLFPDiIZv_VuR8ICOUE";

async function main() {
    try {
        const shipments = await getShipment(TOKEN);

        const groupedShipments = _.groupBy(shipments, (shipment) => {
            const { fleetInfo } = shipment;
            const fleetOwnerName = fleetInfo?.fleetOwner?.name ?? "Fleet Owner is null or Undefined";
            return fleetOwnerName;
        });

        console.log(groupedShipments);
    } catch (error) {
        console.log(`Caught error in main - ${error.message}`);
    }
}


async function getShipment(TOKEN) {
    try {
        const options = {
            uri: `https://apis.fretron.com/shipment-view/shipments/v1?filters=%7B%22shipmentDate%22%3A%7B%22isTillExpression%22%3Afalse%2C%22isFromExpression%22%3Afalse%2C%22from%22%3A1680346620000%2C%22till%22%3A1686653851000%7D%2C%22__version%22%3A2%7D`,
            method: "GET",
            headers: {
                Authorization: TOKEN,
            },
            json: true,
        };

        const res = await rp(options);
        console.log(`Total shipments fetched - ${res.length}`);
        return res;
    } catch (error) {
        console.log(`Caught error in getting shipments - ${error.message}`);
        return [];
    }
}

main();
