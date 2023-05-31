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
        console.log(`Catched error in sending mail - ${error.message}`);
    }
    return null;
}
async function shipmentsGET(token, from, till) {
    try {
        if (!from) {
            from = new Date(2023, 4, 1).valueOf();
        }
        if (!till) {
            till = Date.now();
        }
        const filters = {
            shipmentDate: {
                from: from,
                till: till,
            },
            __version: 2,
        };
        return await rp({
            uri: `https://apis.fretron.com/shipment-view/shipment/v1?filters=${filters}&size=500&allFields=["shipmentNumber","shipmentDate","shipmentStages","fleetInfo"]`,
            json: true,
            headers: {
                Authorization: token,
            },
        });
    } catch (error) {
        console.log(`Catched error in getting shipments- ${error.message}`);
    }
    return [];
}
