const rp = require("request-promise");

const TOKEN =
  "Bearer eyJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2ODc3NjE1OTQsInVzZXJJZCI6ImViZTU3NTFhLWEwNWItNDZiNi05MWI0LTFjMTEyYTkwZjYzOCIsImVtYWlsIjoic3V5YXNoLmt1bWFyQGZyZXRyb24uY29tIiwibW9iaWxlTnVtYmVyIjoiOTU1NTEwNzcwMCIsIm9yZ0lkIjoiNDk1Yjg3MjgtYzc2MS00ZmE3LTgzZmUtZGI3NWE3ZDYzMjIxIiwibmFtZSI6IlN1eWFzaCAiLCJvcmdUeXBlIjoiRkxFRVRfT1dORVIiLCJpc0dvZCI6dHJ1ZSwicG9ydGFsVHlwZSI6ImJhc2ljIn0.dfSvv5OrSg-Ese1RcuXHoG5RJHHI7Sz5wRQvaizI5pU";

async function shipmentsGET(from, till, TOKEN) {
  const url = `https://apis.fretron.com/shipment-view/shipments/v1?filters=${JSON.stringify(
    {
      shipmentDate: {
        isTillExpression: false,
        isFromExpression: false,
        from: from,
        till: till,
      },
      __version: 2,
    }
  )}&size=300&allFields=${JSON.stringify(["fleetInfo", "shipmentNumber"])}`;
  try {
    const options = {
      uri: url,
      method: "GET",
      json: true,
      headers: {
        Authorization: TOKEN,
      },
    };

    return await rp(options);
  } catch (error) {
    console.log(`Caught error in getting shipments - ${error.message}`);
  }
  return [];
}

async function main() {
  var till = Date.now();
  var from = till - 30 * 24 * 60 * 60 * 1000;

  //   const totalCount = await getTotalShipmentCount(from, till, TOKEN);
  //   console.log("Total number of shipments:", totalCount);

  const shipments = await shipmentsGET(from, till, TOKEN);
  console.log(`Total Shipments: ${shipments.length}`);

  const shipmentData = {};
  for (let shs of shipments) {
    const fleetInfo = shs.fleetInfo;
    var transporter =
      fleetInfo?.broker?.name ??
      fleetInfo?.fleetOwner?.name ??
      fleetInfo?.forwardingAgent?.name ??
      null;

    if (transporter) {
      transporter = transporter.trim();
    }

    let key = `${transporter}_${fleetInfo.vehicle.vehicleRegistrationNumber}`
    shipmentData[key] = shipmentData[key] ? shipmentData[key] + 1 : 1 

    
    
}
console.log(shipmentData);
}

main();
