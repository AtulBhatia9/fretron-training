
/**
   * Send E-POD Details to JSL for previous day (12AM Yesterday - 12AM Today)
   */

const TOKEN =
    "Bearer eyJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2NTA5NzMzMjgsInVzZXJJZCI6ImE0MmU1MzljLTg4ZjMtNDJjZi1hMWU3LWQxM2UwYjYwODMzZCIsImVtYWlsIjoic3lzdGVtX2ludGVncmF0aW9uQGZyZXRyb24uY29tIiwibW9iaWxlTnVtYmVyIjoiOTAwMDAwMDAwMCIsIm9yZ0lkIjoiZDI1NWEwMDAtZjI3MS00ODllLTk0MDgtYjlmYjdkNTkyYjQ0IiwibmFtZSI6IlN5c3RlbSBJbnRlZ3JhdGlvbiIsIm9yZ1R5cGUiOiJGTEVFVF9PV05FUiIsImlzR29kIjp0cnVlLCJwb3J0YWxUeXBlIjoiYmFzaWMifQ.3BhTCQz_nONFn_neEkunCRHB4D-4HM3R8Nx03xwyVOY";
const allowedConsigneeExtId = [
    "1090000212",
    "1090000251",
    "1090000252",
    "1090000178",
    "1090000253",
    "1090000113",
    "1090000118",
    "1030000208",
    "1090000116",
    "1030000168",
    "1030000020",
    "1030000010",
    "1030000073",
    "1030000328",
    "1030000158",
    "1030000320",
    "1030000299",
    "1030000162",
    "1030000016",
    "1030000248",
    "1030000080",
    "1030000014",
    "1030000015",
    "1030000077",
    "1030000012",
    "1030000168",
    "1030000320",
    "1030000016",
    "1030000248",
    "1030000080",
    "1030000014",
    "1030000015",
    "1030000077",
    "1090000178",
    "1090000231",
    "1090000112",
];

async function main() {
    try {
        let shipments = await getShipments(TOKEN);

        if (!shipments.length) {
            console.log(`Shipments not found!!!`);
            return;
        }

        await generateHtmlAndSendMail(shipments);
    } catch (error) {
        console.log(`Some error${error}`);
    }
}

async function getShipments(token) {
    try {
        const today = new Date(Date.now());
        const twentyFourHrDiff = 24 * 60 * 60 * 1000;
        const yesterday = new Date(Date.now() - twentyFourHrDiff);
        const from = new Date(
            yesterday.getFullYear(),
            yesterday.getMonth(),
            yesterday.getDate(),
            0,
            0,
            0,
            0
        ).valueOf();
        const till = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate(),
            0,
            0,
            0,
            0
        ).valueOf();

        const filter_v2 = {
            _or: {
                _shipmentTrackingStatus_: {
                    _or: {
                        _at_delivery_point_: {
                            shipmentTrackingStatus: ["At Delivery Point"],
                        },
                        _enroute_for_delivery_: {
                            shipmentTrackingStatus: ["Enroute For Delivery"],
                        },
                    },
                },
                completionTime: {
                    isTillExpression: false,
                    isFromExpression: false,
                    from: from,
                    till: till,
                },
            },
            __version: 2,
        };

        let url = `${FRT_PUB_BASE_URL}/shipment-view/shipments/v1?filters=${JSON.stringify(
            filter_v2
        )}&size=500&allFields=["consignments.uuid", "shipmentNumber", "customFields","uuid", "shipmentDate", "shipmentTrackingStatus", "shipmentStages", "shipmentStatus", "fleetInfo.vehicle.vehicleRegistrationNumber"]`;
        console.log(url);
        let options = {
            uri: url,
            json: true,
            method: "GET",
            headers: {
                Authorization: token,
            },
        };

        var res = await rp(options);

        console.log(`Total Shipments before filter- ${res.length}`);

        res = res.filter(
            ({ shipmentStages, shipmentTrackingStatus, shipmentStatus }) => {
                if (shipmentStatus === "Completed") {
                    return true;
                } else if (shipmentTrackingStatus === "At Delivery Point") {
                    let arrivalTime = shipmentStages.find(
                        ({ status }) => status === "AT"
                    ).arrivalTime;

                    if (arrivalTime > from && arrivalTime < till) {
                        return true;
                    }
                } else if (
                    shipmentTrackingStatus === "Enroute For Delivery" &&
                    shipmentStages.length > 2 &&
                    shipmentStages[0].status === "COMPLETED" &&
                    shipmentStages[1].status === "COMPLETED"
                ) {
                    let departureTime = _.last(
                        shipmentStages.filter(({ status }) => status === "COMPLETED")
                    ).departureTime;

                    if (departureTime > from && departureTime < till) {
                        return true;
                    }
                } else {
                    return false;
                }
            }
        );

        let finalArr = [];

        for (let items of res) {
            let cnsArr = [];
            if (items.consignments?.length) {
                for (let cns of items.consignments) {
                    let cnMaster = await getCnMaster(cns.uuid, TOKEN);

                    cnsArr.push(cnMaster);
                }
            }

            items.consignments = cnsArr;

            finalArr.push(items);
        }

        console.log(`Total shipments fetched - ${finalArr.length}`);
        return finalArr;
    } catch (error) {
        console.log(`Catched error in getting shipments - ${error.message}`);
    }
    return [];
}

async function getCnMaster(uuid, token) {
    try {
        let url = `${FRT_PUB_BASE_URL}/shipment/v1/consignment/${uuid}/shipments`;

        let options = {
            uri: url,
            method: "get",
            json: true,
            headers: {
                Authorization: token,
            },
        };

        let res = await rp(options);

        if (res.error) {
            console.log(`Incoming error in response- ${res.error}`);
        } else return res.data.consignment;
    } catch (error) {
        console.log(`Catched error in getting cn from master- ${error.message}`);
    }

    return null;
}

async function generateHtmlAndSendMail(shipments) {
    try {
        const html = mainHtml(shipments);

        if (!html) {
            console.log(`-----Some error generating html -----`);
            return;
        }
        const yesterday = Date.now() - 24 * 60 * 60 * 1000;
        const subject = `E-POD Submission Report - ${moment(yesterday).format(
            "DD MMMM"
        )}`;
        const to = ["parveen verma@jindalstainless.com", "nishant.girdhar@jindalstainless.com", "mandeep.yadav@jindalstainless.com", "manish2@jindalstainless.com"];
        const cc = ["suyash.kumar@fretron.com", "rahul.bansal@fretron.com", "akram.md@fretron.com"]

        let jsonArray = [];

        for (let {
            consignments,
            shipmentNumber,
            shipmentStages,
            customFields,
            fleetInfo: {
                vehicle: { vehicleRegistrationNumber },
            },
        } of shipments) {
            if (consignments?.length) {
                let foNumber =
                    customFields?.find(({ fieldKey }) => fieldKey === "FO Number")
                        ?.value ?? "";
                let vehicleNumber = vehicleRegistrationNumber;
                let source = "";
                if (shipmentStages[0].place.name.includes("HRD")) {
                    origin = "HRD";
                } else if (shipmentStages[0].place.name.includes("CRD")) {
                    origin = "CRD";
                }
                for (let cns of consignments) {
                    let consigneePlace = cns.consignee.places?.[0]?.name ?? "";
                    let consigneeExtId = String(cns.consignee?.externalId);
                    let podStatus =
                        cns.pod?.status === "SUBMITTED" ||
                        cns.pod?.feedingStatus === "CREATED";
                    let epodStatus = podStatus ? "SUBMITTED" : "NOT SUBMITTED";

                    if (allowedConsigneeExtId.includes(consigneeExtId)) {
                        jsonArray.push({
                            "Shipment Number": shipmentNumber,
                            "FO Number": foNumber,
                            "Consignment Number": cns.consignmentNo,
                            "Vehicle Number": vehicleNumber,
                            Source: source,
                            Destination: consigneePlace,
                            "Destination Code": consigneeExtId,
                            "EPOD Status": epodStatus,
                        });
                    }
                }
            }
        }

        const result = await sendMail(subject, to, cc, html, jsonArray);
        console.log(result);
    } catch (error) {
        console.log(
            `Error in generating html and sending mail: ${error.message}`
        );
    }
}

async function sendMail(subject, to, cc, html, jsonArray) {
    try {
        var url = `${FRT_PUB_BASE_URL}/shipment-view/shipments/json/email`;

        var options = {
            url: url,
            method: "post",
            json: true,
            body: {
                data: jsonArray,
                emailInfo: {
                    to: to,
                    cc: cc,
                    subject: subject,
                    html: html,
                },
            },
        };

        const res = await rp(options);

        console.log(`Sending mail status- ${res.status}`);

        return res;
    } catch (error) {
        console.log(`Caught error in sending mail - ${error.message}`);
    }
    return null;
}

function generateTable1(shipments) {
    try {
        let shipmentDates = new Date(
            shipments[0].shipmentDate
        ).toLocaleDateString(`en-gb`);

        let cnsDetails = [];

        shipments.forEach(
            (shipment) =>
                (cnsDetails = cnsDetails.concat(
                    shipment.consignments
                        ?.filter((_) =>
                            allowedConsigneeExtId.includes(_.consignee.externalId)
                        )
                        ?.map((e) => {
                            return {
                                consignment: e,
                                shipmentNumber: shipment.shipmentNumber,
                            };
                        }) ?? []
                ))
        );

        console.log(`Total Consignments- ${shipments.length}`);

        let epodToBeTriggered = 0;
        let epodSubmittedByUser = 0;
        let vehicleReported = cnsDetails.reduce((accumulator, current) => {
            const shipmentNumber = current.shipmentNumber;
            if (
                !accumulator.some((item) => item.shipmentNumber === shipmentNumber)
            ) {
                accumulator.push(current);
            }
            return accumulator;
        }, []).length;

        console.log(`Total Vehicles reported- ${vehicleReported}`);

        cnsDetails.forEach((cnsDetail) => {
            const cf = cnsDetail.consignment.customFields;
            let smsSentField = getFromCf(cf, "SMS Sent");
            let emailSentField = getFromCf(cf, "Email Sent");

            //for epodToBeTriggered case
            if (smsSentField === "Yes" || emailSentField === "Yes") {
                epodToBeTriggered++;
            }

            // for epodSubmittedByUser case
            if (cnsDetail.consignment.pod?.status === "SUBMITTED") {
                epodSubmittedByUser++;
            }
            ``;
        });
        console.log(`EPOD To Be Triggered :${epodToBeTriggered}`);

        console.log(`Epod Submitted By User: ${epodSubmittedByUser}`);

        var html1 = `
                    <table>
                      <tr>
                        <th>Date</th>
                        <th>Vehicles Reported</th>
                        <th>EPOD Links Triggered (Consignment Wise)</th>
                        <th>EPOD Submitted By User</th>
                      </tr>
                      <tbody>`;

        html1 += `
                       <tr>
                       <td>${shipmentDates}</td>
                       <td>${vehicleReported}</td>
                       <td>${epodToBeTriggered}</td>
                       <td>${epodSubmittedByUser}</td>
                       </tr>`;

        html1 += `
                </tbody>
              </table>`;

        return html1;
    } catch (error) {
        console.log(`Catched error in generateTable1 - ${error.message}`);
    }

    return "";
}

function generateTable2(shipments) {
    try {
        let shDate = new Date(shipments[0].shipmentDate);
        const options = {
            day: "numeric",
            month: "long",
        };
        const formattedDate = shDate.toLocaleDateString("en-US", options);

        let final = new Array();
        shipments.forEach((element) => {
            final = final.concat(
                element.consignments
                    ?.filter((_) =>
                        allowedConsigneeExtId.includes(_.consignee.externalId)
                    )
                    ?.map((e) => {
                        let obj = {};

                        obj["shipmentNumber"] = element.shipmentNumber;
                        let cfs = e.customFields;
                        let smsSent = getFromCf(cfs, "SMS Sent");
                        let emailSent = getFromCf(cfs, "Email Sent");
                        let epodToBeTriggered = smsSent === "Yes" || emailSent === "Yes";

                        let epodSubmitted = e.pod?.status === "SUBMITTED" ? 1 : 0;
                        obj["customerName"] = String(e.consignee.name).toUpperCase();
                        obj["placeName"] = e.consignee.places?.[0]?.name ?? "";
                        obj["externalId"] = e.consignee.externalId;
                        obj["epodToBeTriggered"] = epodToBeTriggered ? 1 : 0;
                        obj["epodSubmitted"] = epodSubmitted ? 1 : 0;

                        return obj;
                    }) ?? []
            );
        });

        console.log(`Total Cns - ${final.length}`);

        let groupedData = _.groupBy(final, "externalId");

        let html2 = `
    <div style="display: flex; justify-content:center;">
      <table>
        <tr>
          <th colspan="5" style="text-align: center; font-size: 20px;">
            Customer Wise Details ${formattedDate}
          </th>
        </tr>
        <tr>
          <th>Customer Name</th>
          <th>Vehicles Reported</th>
          <th>EPOD Links Triggered (Consignment Wise)</th>
          <th>EPOD Submitted By User</th>
        </tr>
        <tbody>`;

        for (let externalId in groupedData) {
            let arr = groupedData[externalId];

            // let customerName = String(arr[0].customerName).toUpperCase()
            let placeName = String(arr[0].placeName).toUpperCase();

            // let vehicleReported = arr.length;
            const vehicleReported = arr.reduce((accumulator, current) => {
                const shipmentNumber = current.shipmentNumber;
                if (
                    !accumulator.some((item) => item.shipmentNumber === shipmentNumber)
                ) {
                    accumulator.push(current);
                }
                return accumulator;
            }, []).length;

            let epodToBeTriggered = arr.reduce(
                (total, consignment) => total + consignment.epodToBeTriggered,
                0
            );
            let epodSubmitted = arr.reduce(
                (total, consignment) => total + consignment.epodSubmitted,
                0
            );

            html2 += `
        <tr>
          <td>${placeName}</td>
          <td>${vehicleReported}</td>
          <td>${epodToBeTriggered}</td>
          <td>${epodSubmitted}</td>
        </tr>`;
        }

        html2 += `
        </tbody>
      </table>
    </div>`;

        return html2;
    } catch (error) {
        console.log(`Caught error in generateTable2 - ${error.message}`);
    }
    return "";
}

function mainHtml(shipments) {
    let table1 = generateTable1(shipments);
    let table2 = generateTable2(shipments);

    if (!table1) return "";
    if (!table2) return "";

    let mainContent = `
  <html>

  <head>
      <title>Order Alert</title>
      <style>
          .table-container {
              display: flex;
              justify-content: center;
          }
  
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
  <p>Good morning team,</p>
  <br />
  <p>Please find attached the details of E-POD Submission for the respective date.</p>
      ${table1}
      <br />
      <br />
      <br />
      <br />
      <br />
      ${table2}
  
  </body>

  </html>`;

    return mainContent;
}

function getFromCf(cf, fieldKey) {
    return cf?.find((_) => _.fieldKey === fieldKey)?.value ?? "";
}

try {
    await main();
} catch (err) {
    console.log(`Some error executing API-Maker - ${err.message}`);
}