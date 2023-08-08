const rp = require("request-promise");
const TOKEN =
    "Beaer eyJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2ODY4MDYwMzksInVzZXJJZCI6Ijc1Mjc3NTYyLWQ4YWQtNGM3YS05ZWYyLWVkYWIxMDA4MmQ5MSIsImVtYWlsIjoiYXR1bC5iaGF0aWFAZnJldHJvbi5jb20iLCJtb2JpbGVOdW1iZXIiOiI5ODA1MTMxNDE3Iiwib3JnSWQiOiJlMTMxODBlNy1mODQ5LTQ1NjgtYWQ3ZS0xYTIzN2ExYThmYjMiLCJuYW1lIjoiQXR1bCBCaGF0aWEiLCJvcmdUeXBlIjoiRkxFRVRfT1dORVIiLCJpc0dvZCI6ZmFsc2UsInBvcnRhbFR5cGUiOiJiYXNpYyJ9.Xw66_w0CfopDv9kQKGQ0-G8fLWfxqo_j8mCCMFCZc5E"


const origin = "Kota"
const destination = "Ahmedabad"

const name = "MOBINA DAWOOD"
const forwardingAgentName = "test"

async function main() {
    try {
        let shIds = []
        let uuid = "983c2f3e-6e7a-4cbd-be14-85d98027f14b"
        let originPlace = await getPlaceByName(origin)
        // console.log(originPlace);

        let destinationPlace = await getPlaceByName(destination)
        // console.log(destinationPlace);
        let branch = await getBranchByMaster(uuid);

        let fleetOwner = await getVendorByName(name)
        // console.log(`Fleet Owner : ${fleetOwner}`);
        let forwardingAgent = await getVendorByName(forwardingAgentName)
        // console.log(`Forwading Agent : ${forwardingAgent}`);

        for (let i = 0; i < 2; i++) {
            var vehicleNumber = `HP12D100${i + 1}`;
            let shipmentStages = []
            let originStage = {
                "hub": null,
                "stageName": null,
                "consignmentPickUps": null,
                "tripPoint": {
                    "purpose": "Pickup"
                },
                "place": originPlace,
            }
            let destinationStage = {
                "hub": null,
                "stageName": null,
                "consignmentPickUps": null,
                "tripPoint": {
                    "purpose": "Delivery"
                },
                "place": destinationPlace,
            }

            shipmentStages.push(originStage)
            shipmentStages.push(destinationStage)
            // console.log(shipmentStages)

            const shipmentPayload = {
                "shipment": {
                    "shipmentNumber": null,
                    "shipmentDate": Date.now(),
                    "shipmentStages": shipmentStages,
                    "fleetInfo": {
                        "device": null,
                        "lbsNumber": null,
                        "trackingMode": "MANUAL",
                        "vehicle": {
                            "vtsDeviceId": null,
                            "kmDriven": null,
                            "attachedDocs": [],
                            "customFields": [],
                            "floorType": null,
                            "source": "FRETRON",
                            "isTrackingEnabled": false,
                            "updates": null,
                            "branch": null,
                            "uuid": null,
                            "orgId": null,
                            "vehicleLoadType": null,
                            "associatedWith": null,
                            "isDeleted": null,
                            "customerId": null,
                            "vehicleModel": null,
                            "mileageEmpty": null,
                            "mileageLoaded": null,
                            "vehicleType": null,
                            "groups": [],
                            "externalId": null,
                            "updateTime": null,
                            "sharedWith": [],
                            "vehicleMake": null,
                            "vehicleRegistrationNumber": vehicleNumber,
                            "chassisNumber": null,
                            "driverId": null,
                            "createTime": null,
                            "loadCapacity": null,
                            "truckLength": null,
                            "category": null,
                            "groupsExtended": null
                        },
                        "driver": {
                            "dlExpiryTime": 1727841600000,
                            "isEmployee": true,
                            "pfNumber": null,
                            "dlNumber": "HR-83200400038",
                            "mobileNumber": "8951840307",
                            "customFields": [{
                                "indexedValue": ["text_wdsx"],
                                "fieldKey": "text",
                                "valueType": "string",
                                "fieldType": "text",
                                "value": "wdsx",
                                "definitionId": null
                            }, {
                                "indexedValue": ["email_axax@sd.com"],
                                "fieldKey": "email",
                                "valueType": "string",
                                "fieldType": "email",
                                "value": "axax@sd.com",
                                "definitionId": null
                            }, {
                                "indexedValue": ["8. Bank Account no._32545328897"],
                                "fieldKey": "8. Bank Account no.",
                                "valueType": "string",
                                "fieldType": "text",
                                "value": "32545328897",
                                "definitionId": null
                            }, {
                                "indexedValue": ["Guaranter Name_SHOYEB"],
                                "fieldKey": "Guaranter Name",
                                "valueType": "string",
                                "fieldType": "text",
                                "value": "SHOYEB",
                                "definitionId": null
                            }, {
                                "indexedValue": ["IFSC Code_SBIN0002354"],
                                "fieldKey": "IFSC Code",
                                "valueType": "string",
                                "fieldType": "text",
                                "value": "SBIN0002354",
                                "definitionId": null
                            }, {
                                "indexedValue": ["a. Driver Code_DC01536"],
                                "fieldKey": "a. Driver Code",
                                "valueType": "string",
                                "fieldType": "textarea",
                                "value": "DC01536",
                                "definitionId": null
                            }, {
                                "indexedValue": ["b. Driver Father Name_MAJJU"],
                                "fieldKey": "b. Driver Father Name",
                                "valueType": "string",
                                "fieldType": "text",
                                "value": "MAJJU",
                                "definitionId": null
                            }, {
                                "indexedValue": ["d. Date of Birth_134452800000"],
                                "fieldKey": "d. Date of Birth",
                                "valueType": "string",
                                "fieldType": "date",
                                "value": "134452800000",
                                "definitionId": null
                            }, {
                                "indexedValue": ["e. Date of Joining_1571976000000"],
                                "fieldKey": "e. Date of Joining",
                                "valueType": "string",
                                "fieldType": "date",
                                "value": "1571976000000",
                                "definitionId": null
                            }, {
                                "indexedValue": ["f. Aadhar Card Number_3778 4674 0696"],
                                "fieldKey": "f. Aadhar Card Number",
                                "valueType": "string",
                                "fieldType": "text",
                                "value": "3778 4674 0696",
                                "definitionId": null
                            }, {
                                "indexedValue": ["g. Bank Name_STATE BANK OF INDIA"],
                                "fieldKey": "g. Bank Name",
                                "valueType": "string",
                                "fieldType": "text",
                                "value": "STATE BANK OF INDIA",
                                "definitionId": null
                            }, {
                                "indexedValue": ["h. Bank Branch_HATHIN, FARIDABAD"],
                                "fieldKey": "h. Bank Branch",
                                "valueType": "string",
                                "fieldType": "text",
                                "value": "HATHIN, FARIDABAD",
                                "definitionId": null
                            }],
                            "externalId": null,
                            "uuid": "fde29766-43b5-4acb-bf95-287eb0040c17",
                            "branch": null,
                            "orgId": "495b8728-c761-4fa7-83fe-db75a7d63221",
                            "vehicleRegistrationNumber": "new vehicle",
                            "name": "AZAD",
                            "vehicleId": "2b78530f-6918-4a47-b8fd-556d9c8c6120",
                            "associatedUserId": "15410336-c282-4c6e-9754-13b646112ff5",
                            "status": "Active"
                        },
                        "fleetOwner": fleetOwner,
                        "fleetType": "Owned",
                        "forwardingAgent": forwardingAgent
                    },
                    "edd": null,
                    "shipmentStatus": "Planned",
                    "transportationMode": "ByRoad",
                    "shipmentType": "DirectLeg",
                    "customFields": [],
                    "uuid": null,
                    "branch": branch,
                    "originalEdd": null,
                    "routeId": null
                },
                "consignments": []
            }
            // console.log(JSON.stringify(payload));
            const shipment = await createShipment(shipmentPayload, TOKEN)
            if (shipment) {
                shIds.push(shipment.uuid)
                await ensureOrCreateShipmentCost(shipment)
            }
        }
        // let shIds = ["7375b5da-f762-4453-9cf9-590b4418efbf","6039cfae-5137-4293-854e-2f718516a718",]
        const fuelChargeSetting = {
            "amount": null,
            "rateValueRuleId": null,
            "isCalculated": true,
            "baseValueRuleId": null,
            "rateUnit": "perKM",
            "amountValueRuleId": null,
            "vendorFeedingType": "User",
            "chargeApplicableFor": null,
            "chargeBillingType": [],
            "baseValueFeedingType": "User",
            "distributionBasis": "Weight",
            "amountFeedingType": "User",
            "rate": 108,
            "chargeId": "6e63d9a5-22c9-45fc-accd-baae889ceab2",
            "vendor": null,
            "applicability": "Shipment",
            "chargeName": "Fuel Charge",
            "rateFeedingType": "Fixed",
            "base": null,
            "vendorRuleId": null
        }
        for (let i = 0; i < shIds.length; i++) {
            let shId = shIds[i]
            let shCosts = await getShipmentCost(shId)
            const shCost = shCosts.find(obj => obj.charge?.name === "Fuel Charge");
            const base = shCost.charge.base ?? 0;
            const rate = shCost.charge.rate ?? 0;
            const result = base * rate;
            console.log(`Result of base * rate : ${result}`);
            if (shCost) {
                const filteredAmount = shCost.amount ?? 0;
                console.log(`Filtered Amount is : ${filteredAmount}`);
                if (filteredAmount !== result) {
                    await saveShipmentCost(shCost, fuelChargeSetting, shId);
                } else {
                    console.log("Amounts are equal. No update required.");
                }
            } else {
                console.log("Fuel Charge not found.");
            }
        }
    } catch (error) {
        console.log(`Error in creating shipments: ${error.message}`);
    }
                         
}

// todo() method to get place by name
async function getPlaceByName(name) {
    const url = `https://apis.fretron.com/shipment-view/places/page/places?search=${name}`;

    try {
        const res = await rp({
            method: "GET",
            uri: url,
            headers: {
                Authorization: TOKEN,
            },
            json: true,
        });
        // console.log(`getPlaceByName ${res}`);

        const foundPlace = res.find(place => place.name === name);
        if (foundPlace) {
            return foundPlace;
        } else {
            console.log(`No place found with name '${name}'`);
            return null;
        }
    } catch (error) {
        console.log(`Error retrieving place '${name}': ${error.message}`);
        return null;
    }

}
async function getVendorByName(name) {
    const url = `https://apis.fretron.com/shipment-view/bpartners/partners?search=${name}`;
    try {
        const res = await rp({
            method: "GET",
            uri: url,
            headers: {
                Authorization: TOKEN,
            },
            json: true,
        });
        //  console.log(res);
        if (res.length > 0) {
            const vendor = res[0];
            return vendor;
        } else {
            console.log(`Error retrieving vendor for name '${name}': ${res.error}`);
            return null;
        }
    } catch (error) {
        console.log(`Error retrieving vendor for name '${name}': ${error.message}`);
        return null;
    }
}
async function getBranchByMaster(uuid) {
    const url = `https://apis.fretron.com/offices/v1/branch-byUuid/${uuid}`;
    try {
        const res = await rp({
            method: "GET",
            uri: url,
            headers: {
                Authorization: TOKEN,
            },
            json: true,
        });

        if (res.status === 200) {
            const branch = res.data;
            return branch;
        } else {
            console.log(`Error retrieving branch for uuid '${uuid}': ${res.error}`);
            return null;
        }
    } catch (error) {
        console.log(`Error retrieving branch for uuid '${uuid}': ${error.message}`);
        return null;
    }
}
async function createShipment(shipmentPayload, TOKEN) {
    const url = `https://apis.fretron.com/shipment/v1/shipment/with/consignments`;
    try {
        const res = await rp({
            method: "POST",
            uri: url,
            body: shipmentPayload,
            headers: {
                Authorization: TOKEN,
            },
            json: true,
        });

        console.log(`Shipment created with UUID: ${res.data.uuid}`);

        if (res.status == 200) {
            return res.data;
        } else {
            console.log(`Create Shipment api response error: ${res.error}`);
        }
    } catch (e) {
        console.log(`Caught Error in Create Shipment api: ${e.message}`);
        throw e;
    }
}

async function ensureOrCreateShipmentCost(shipment) {
    let shId = shipment.uuid
    console.log(shId)
    try {
        const shipmentId = shId;
        const fuelChargeSetting = {
            "amount": null,
            "rateValueRuleId": null,
            "isCalculated": true,
            "baseValueRuleId": null,
            "rateUnit": "perKM",
            "amountValueRuleId": null,
            "vendorFeedingType": "User",
            "chargeApplicableFor": null,
            "chargeBillingType": [],
            "baseValueFeedingType": "User",
            "distributionBasis": "Weight",
            "amountFeedingType": "User",
            "rate": 108,
            "chargeId": "6e63d9a5-22c9-45fc-accd-baae889ceab2",
            "vendor": null,
            "applicability": "Shipment",
            "chargeName": "Fuel Charge",
            "rateFeedingType": "Fixed",
            "base": null,
            "vendorRuleId": null
        }
        const fuelCharge = {
            "amount": null,
            "amountByVendor": null,
            "rate": 108,
            "billingType": [
                "VendorBill",
                "Invoice",
                "DebitNote",
                "CreditNote"
            ],
            "chartsOfAccount": {
                "internal": false,
                "documents": [],
                "accountGroup": "Income",
                "name": "Sales",
                "active": true,
                "systemAccount": true,
                "accountPath": [
                    "Income",
                    "Income",
                    "sales"
                ],
                "type": "Income",
                "uuid": "sales",
                "orgId": "fretron_system_god"
            },
            "name": "Fuel Charge",
            "rateUnit": "perKM",
            "uuid": "6e63d9a5-22c9-45fc-accd-baae889ceab2",
            "base": 50,
            "applicableFor": null
        }
        let shCost = await autoFillShCost(fuelChargeSetting, shipmentId)
        shCost.vendor = shipment?.fleetInfo?.broker ?? shipment?.fleetInfo?.fleetOwner ?? shipment?.fleetInfo?.forwardingAgent
        shCost.amount = 50 * 108
        shCost.charge = fuelCharge
        await saveShipmentCost(shCost, fuelChargeSetting, shipmentId)
        return

    } catch (error) {
        console.log(`Error in creating shipment cost: ${error.message}`);
    }
}

async function autoFillShCost(chargeSetting, shipmentId) {
    const url = `https://apis.fretron.com/shipment-cost/v1/auto-fill/cost-detail?shipmentId=${shipmentId}`;
    try {
        const res = await rp({
            method: "POST",
            uri: url,
            body: chargeSetting,
            headers: {
                Authorization: TOKEN,
            },
            json: true,
        });
        console.log(`Add Charge to Shipment api response status: ${res.status}`);
        if (res.status == 200) {
            console.log(`Charge added to shipment with ID: ${shipmentId}`);
            return res.data
        } else {
            console.log(`Charge to Shipment API response error: ${res.error}`);
        }
    } catch (e) {
        console.log(`Caught Error in Add Charge to Shipment api : ${e.message}`);
        throw e;
    }
}

async function saveShipmentCost(shipmentCost, chargePayload, shipmentId) {
    let url = `https://apis.fretron.com/shipment-cost/v1/cost?shipmentId=${shipmentId}`
    try {
        let res = await rp({
            method: "POST",
            uri: url,
            body: {
                "shipmentCost": shipmentCost,
                "chargeSetting": chargePayload,
            },
            headers: {
                Authorization: TOKEN
            },
            json: true
        });
        console.log(`Save shipment cost api res status : ${res.status}`)
        if (res.status == 200) {
            return res.data
        } else {
            console.log(`Save shipment cost api res error : ${res.error}`)
        }
    } catch (e) {
        console.log(`Catched error in saving shipment cost : ${e.message}`)
    }
    return []
}

async function getShipmentCost(shipmentId) {
    let url = `https://apis.fretron.com/shipment-cost/v1/costs?shipmentId=${shipmentId}`;
    try {
        let res = await rp({
            method: "GET",
            uri: url,
            headers: {
                Authorization: TOKEN
            },
            json: true,
        });
        console.log(`Get shipment cost api res status : ${res.status}`)
        if (res.status == 200) {
            // console.log("SH COSTS : " + JSON.stringify(res.data))
            return res.data;
        } else {
            console.log(`Get Shipment Cost api res error : ${res.error}`);
        }
    } catch (e) {
        console.log(`Catched error in getting shipment cost : ${e.message}`);
    }
    return [];
}
main()