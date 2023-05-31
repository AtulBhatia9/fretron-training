const rp = require("request-promise");

const token =
    "Bearer eyJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2ODA4NjcxNTgsInVzZXJJZCI6ImJvdHVzZXItLTZjNDZiNjZmLTY1NWEtNDM2NC05YWRlLWJiZGFlNzE2ODZhYSIsIm1vYmlsZU51bWJlciI6ImJvdHVzZXItLTZjNDZiNjZmLTY1NWEtNDM2NC05YWRlLWJiZGFlNzE2ODZhYSIsIm9yZ0lkIjoiODIzOTQ3YTMtMDJjMC00ZTY1LThmNGUtMjFkYTM3MGVhNmNkIiwibmFtZSI6InNoIiwib3JnVHlwZSI6IkZMRUVUX09XTkVSIiwiaXNHb2QiOmZhbHNlLCJwb3J0YWxUeXBlIjoiYmFzaWMifQ.Zz-8ZnwtdVKayyW7ZpX7POxdgWLnhKnXcNxPadF3yJw";

async function main() {
    var till = Date.now();
    var from = till - 10 * 24 * 60 * 60 * 1000;
    const shipments = await shipmentsGET(from, till, token); //Array of object
    var output = [];

    console.log(`Total Shipments ${shipments.length}`);

    /**
     * Write your code below
     * ----What you have to do----
     * 1. Tell the count of unique shipment tracking status.
     * Example-
     * {
     * "Enroute for Delivery": 50,
     * "At Delivery":100,
     * "Completed":150
     * }
     * 2. Tell the unique transporters on the shipment
     * Example-
     * {
     * "RV LOG":10,
     * "CJDARCL":150,
     * "JTC":240
     * }
     */

    const statusCount = {};

    for (let shs of shipments) {
        var status = shs.shipmentTrackingStatus;

        if (status == null) status = "Completed"
        if (statusCount[status]) {
            statusCount[status]++;
        } else {
            statusCount[status] = 1;
        }
    }
    console.log(statusCount);
    const uniqueTransporter = {}
    for (let shs of shipments) {
        // const fleetInfo = shs.fleetInfo
        // var transporter = fleetInfo?.broker?.name ??
        //     fleetInfo?.fleetOwner?.name ??
        //     fleetInfo?.forwardingAgent?.name ?? null

        var transporter = shs.fleetInfo.broker ? shs.fleetInfo.broker
            : shs.fleetInfo.fleetOwner ? shs.fleetInfo.fleetOwner
                : shs.fleetInfo.forwardingAgent ? shs.fleetInfo.forwardingAgent
                    : null;

        transporter = transporter?.name ?? ""
        if (uniqueTransporter[transporter]) {
            uniqueTransporter[transporter]++;
        } else {
            uniqueTransporter[transporter] = 1;
        }
    }
    // Object.keys(uniqueTransporter).length
    console.log(uniqueTransporter)
    return output
}


/**
*
* @param {Number} from From Time Range of shipment
* @param {Number} till Till Time Range of shipment
* @param {String} token Authorization Token
* @returns {Array[object]}
*/

async function shipmentsGET(from, till, token) {
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
    )}&size=300&allFields=["fleetInfo","shipmentNumber","shipmentTrackingStatus"]`;

    const options = {
        uri: url,
        method: "GET",
        json: true,
        headers: {
            Authorization: token,
        },

    };

    return await rp(options);
}

main()
    .then((e) => console.log(e))
    .catch((err) => console.log(`Some error ${err.message}`));