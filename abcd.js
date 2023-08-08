async function epodLinkTrigger(payload) {
  let url = `http://apis.fretron.com/sharing-utils/v1/share-cn`;
  try {
    let res = await rp({
      method: "POST",
      uri: url,
      body: payload,
      json: true,
      headers: {
        Authorization: TOKEN,
      },
    });
    if (res.status === 200) {
      return res.data;
    } else {
      console.log(`ePOD Link not triggered, error: ${res.error}`);
    }
  } catch (e) {
    console.log(`ePOD Link not triggered, caught error: ${e.message}`);
  }
  return null;
}

async function sendSms(mobileNumber, content) {
  let url = `http://apis.fretron.com/notifications/smsing/sms`;
  try {
    let res = await rp({
      method: "POST",
      uri: url,
      body: {
        to: mobileNumber,
        content: content,
      },
      json: true,
    });
    if (res.status === 200) {
      return res.data;
    } else {
      console.log(`SMS not sent, error: ${res.error}`);
    }
  } catch (e) {
    console.log(`SMS not sent, caught error: ${e.message}`);
  }
  return null;
}

async function main() {
  const consignments = $event.consignments;

  if (consignments && consignments.length > 0) {
    const consignee = consignments[0]?.consignee;

    if (consignee && consignee.contacts && consignee.contacts.length > 0) {
      const mobileNumbers = [];

      for (const contact of consignee.contacts) {
        if (contact.mobileNumbers && contact.mobileNumbers.length > 0) {
          mobileNumbers.push(...contact.mobileNumbers);
        }
      }

      if (mobileNumbers.length > 0) {
        console.log("Mobile Numbers:", mobileNumbers);

        const payload = {
          consignmentId: consignments[0].uuid,
          uiRestrictions: {
            cnInfo: {
              consignmentNo: true,
              vehicleInfo: true,
              materialInfo: true,
              consignor: true,
              consignee: true,
              origin: true,
              destination: true,
              customer: false,
              valuOfGoods: false,
              currentStatus: true,
              currentAddress: false,
            },
            epod: {
              upload: true,
              timing: true,
              feeding: true,
              otpToDriver: false,
              unloadingStart: true,
              unloadingEnd: true,
              reportingTime: true,
              vehicleReleaseTime: true,
              unloadingCharge: false,
              isMandateTiming: false,
              isMandateFeeding: true,
              markManually: true,
              otpToConsignee: false,
            },
            map: false,
            liveTracking: false,
            updateTracking: false,
            miscFields: false,
            customFields: [],
          },
        };

        const ePodLink = await epodLinkTrigger(payload);
        if (ePodLink) {
          const cnNumber = "CONSIGNMENT_NUMBER";
          const content = `Jubilant Agri and Consumer shared consignment ${cnNumber} with you. Click the link below to track ${ePodLink}`;

          for (const mobileNumber of mobileNumbers) {
            //   await sendSms(mobileNumber, content);
          }
        } else {
          console.log("Failed to trigger ePOD link.");
        }
      } else {
        console.log("No mobile numbers found.");
      }
    } else {
      console.log("No contacts found.");
    }
  } else {
    console.log("No consignments found.");
  }
}

main();