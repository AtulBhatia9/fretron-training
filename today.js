const rp = require("request-promise");

const token = "Bearer eyJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2ODUwMTAzMDUsInVzZXJJZCI6ImM2YjBkYTA5LTk1NTItNDgzZC1iZGFhLTdlZDdjMDIwODdhMCIsImVtYWlsIjoidmlrcmFtLmJhZGVzYXJhQGZyZXRyb24uY29tIiwibW9iaWxlTnVtYmVyIjoiOTQ5OTQyNDMwNCIsIm9yZ0lkIjoiNDk1Yjg3MjgtYzc2MS00ZmE3LTgzZmUtZGI3NWE3ZDYzMjIxIiwibmFtZSI6IlZpa3JhbSBCYWRlc2FyYSIsIm9yZ1R5cGUiOiJGTEVFVF9PV05FUiIsImlzR29kIjp0cnVlLCJwb3J0YWxUeXBlIjoiYmFzaWMifQ.YSOluR6kmZ1TBYXVIR7IE-ekabJLYXsdu0GJSWjl0P0"
let from = ""
let till = ""



async function sendShipmentDetailsEmail(token, from, till) {
    try {
        const shipments = await shipmentsGET(token, from, till);
        const html = generateShipmentDetailsHTML(shipments);
        const subject = "Shipment Details";
        const to = ["atul.bhatia@fretron.com"];
        const cc = [];

        const result = await sendMail(subject, to, cc, html);
        console.log(result);
    } catch (error) {
        console.log(`Error: ${error.message}`);
    }
}


function generateShipmentDetailsHTML(shipments) {

    console.log(JSON.stringify(shipments));


    var html = `<!DOCTYPE html>
            <html>

    <head>
        <title>Shipment Details</title>
        <style>
            table {
                border-collapse: collapse;
                width: 100%;
            }

            th,
            td {
                border: 1px solid black;
                padding: 8px;
                text-align: left;
            }

            th {
                background-color: #f2f2f2;
            }
        </style>
    </head>

    <body>
        <table>
            <thead>
                <tr>
                    <th>Shipment Number</th>
                    <th>Shipment Date</th>
                    <th>Vehicle Number</th>
                    <th>Total Loading Tat</th>
                    <th>Total Unloading Tat</th>
                    <th>Total Intransit Tat</th>
                </tr>
            </thead>
            <tbody>
            `

    for (let shipment of shipments) {

        let shNo = shipment.shipmentNumber
        // console.log("Shipment Number:", shNo);
        var shDate = new Date(shipment.shipmentDate).toLocaleDateString('en-GB')
        // console.log("Shipment Date", shDate);
        var vehNo = shipment.fleetInfo.vehicle.vehicleRegistrationNumber
        // console.log("Vehicle Number", vehNo);
        var totalLoadingTat = 0
        if (shipment.shipmentStages[0].arrivalTime) {
            var arrivaltime = shipment.shipmentStages[0].arrivalTime

            if (shipment.shipmentStages[0].departureTime) {

                var departuretime = shipment.shipmentStages[0].departureTime
                let diff = departuretime - arrivaltime
                let totalsec = Math.floor((diff / 1000))
                let sec = Math.floor(totalsec % 60)
                let min = Math.floor((totalsec % 3600) / 60)
                let hours = Math.floor(totalsec / 3600)
                totalLoadingTat = `${hours}hrs ${min}mins ${sec} s`

                // console.log("Total Loading Tat", totalLoadingTat);
            }
        }
        var totalUnloadingTat = 0;
        var n = shipment.shipmentStages.length
        if (shipment.shipmentStages[n - 1].arrivalTime) {
            var arrivaltime = shipment.shipmentStages[n - 1].arrivalTime

            if (shipment.shipmentStages[n - 1].departureTime) {
                var departuretime = shipment.shipmentStages[n - 1].departureTime
                let diff = departuretime - arrivaltime
                let sec = Math.floor((diff / 1000) % 60)
                let min = Math.floor((sec % 3600) / 60)
                let hours = Math.floor(sec / 3600)
                totalUnloadingTat = `${hours}hrs ${min}mins ${sec} s`
                // console.log("Total Unloading Tat", totalUnloadingTat);
            }
        }
        var totalIntransitTat = 0;
        var n = shipment.shipmentStages.length
        if (shipment.shipmentStages[n - 1].arrivalTime) {
            var arrivaltime = shipment.shipmentStages[n - 1].arrivalTime

            if (shipment.shipmentStages[0].departureTime) {
                var departuretime = shipment.shipmentStages[0].departureTime
                let diff = arrivaltime - departuretime
                let sec = Math.floor((diff / 1000) % 60)
                let min = Math.floor((sec % 3600) / 60)
                let hours = Math.floor(sec / 3600)
                totalIntransitTat = `${hours}hrs ${min}mins ${sec} s`
                // console.log("Total Intransit Tat", totalIntransitTat);
            }
        }
        html += `
          <tr>
            <td>${shNo}</td>
            <td>${shDate}</td>
            <td>${vehNo}</td>
            <td>${totalLoadingTat}</td>
            <td>${totalUnloadingTat}</td>
            <td>${totalIntransitTat}</td>
          </tr>
        `;
    }

    // console.log(html);

    html += `
            </tbody>
          </table>
        </body>
        </html>
      `;

    return html;
}



async function sendMail(subject, to, cc, html) {
    try {
        await rp({
            uri: "http://apis.fretron.com/notifications/emails/email",
            method: "POST",
            body: {
                cc: cc,
                to: to,
                subject: subject,
                html: html,
            },
            timeout: 2000,
            json: true,
        });
        return "Mail sent successfully!";
    } catch (error) {
        console.log(`Caught error in sending mail - ${error.message}`);
    }
    return null;
}

async function shipmentsGET(token, from, till) {
    try {
        if (!from) {
            from = new Date(2023, 4, 1).valueOf();
        }
        if (!till) {
            till = Date.now().valueOf();
        }
        const filters = {
            shipmentDate: {
                "from": from,
                "till": till,
                "isFromExpression": false,
                "isTillExpression": false
            },
            "__version": 2,
        };
        const allFields = ``
        url = `https://apis.fretron.com/shipment-view/shipments/v1?filters=${JSON.stringify(filters)}&allFields=["shipmentNumber","shipmentDate","shipmentStages","fleetInfo.vehicle"]`
        let res = await rp({
            uri: url,
            json: true,
            headers: {
                Authorization: token,
            },
        });
        return res
    } catch (error) {
        console.log(`Caught error in getting shipments - ${error.message}`);
    }
    return [];
}
sendShipmentDetailsEmail(token, from, till)