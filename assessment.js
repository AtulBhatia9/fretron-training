const rp = require("request-promise");

const TOKEN =
  "Beaer eyJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2ODc3ODA1MDEsInVzZXJJZCI6ImViZTU3NTFhLWEwNWItNDZiNi05MWI0LTFjMTEyYTkwZjYzOCIsImVtYWlsIjoic3V5YXNoLmt1bWFyQGZyZXRyb24uY29tIiwibW9iaWxlTnVtYmVyIjoiOTU1NTEwNzcwMCIsIm9yZ0lkIjoiODIzOTQ3YTMtMDJjMC00ZTY1LThmNGUtMjFkYTM3MGVhNmNkIiwibmFtZSI6IlN1eWFzaCAiLCJvcmdUeXBlIjoiRkxFRVRfT1dORVIiLCJpc0dvZCI6dHJ1ZSwicG9ydGFsVHlwZSI6ImJhc2ljIn0.eVTqglkAMo4-WoXLU8gGHenoOlY6QJznYc4etROjJc0"

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

  const shipments = await shipmentsGET(from, till, TOKEN);
  console.log(`Total Shipments: ${shipments.length}`);

  const shipmentData = {};

  for (let sh of shipments) {
    const fleetInfo = sh.fleetInfo;
    var transporter =
      fleetInfo?.broker?.name ??
      fleetInfo?.fleetOwner?.name ??
      fleetInfo?.forwardingAgent?.name ??
      null;

    if (transporter) {
      transporter = transporter.trim();
    }

    const vehicleRegistrationNumber = fleetInfo?.vehicle?.vehicleRegistrationNumber;
    
    if (transporter && vehicleRegistrationNumber) {
      if (!shipmentData[transporter]) {
        shipmentData[transporter] = {};
      }

      if (!shipmentData[transporter][vehicleRegistrationNumber]) {
        shipmentData[transporter][vehicleRegistrationNumber] = 0;
      }

      shipmentData[transporter][vehicleRegistrationNumber]++;
    }
  }

  console.log("Shipment Data:",shipmentData);
}

main();
