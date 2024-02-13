const ErrorException = require("../error/ErrorException");
const Notification = require("./notification");
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0

exports.sendPushNotification = async (req, res, next) => {
    var payload = {
        notification: {
            title: req.body.title,
            body: req.body.desc,
            click_action: req.body.url
        }
    };
    let data = await Notification.findAll({ attributes: ['token'], raw: true })
    data = data.map(e => e.token);
    const inc = 3, chunks = [];
    let position = 0, maxLengthOfData = data.length;
    while (maxLengthOfData > 0) {
        chunks.push(data.slice(position * inc, (position + 1) * inc))
        maxLengthOfData -= inc
        position++;
    }
    for (let i = 0; i < chunks.length; i++) {
        const registrationTokens = chunks[i];
        var notification_body = {
            notification: payload.notification,
            registration_ids: registrationTokens
        }
        let response = await fetch('https://fcm.googleapis.com/fcm/send', {
            method: 'POST',
            headers: {
                'Authorization': 'key=AAAAquXbxoQ:APA91bGymcqDShf4-tD7YCVgOphOwnuDAqUPJEL5738urEUT2MaJkVE0l9J4r3oiJY0KbaUeMaOrANOg7HI_ODzUYy-95mGzcz_W5pceMUKvaQRf7yBH83kGGsvqpi1MTeRgzP5xFxWh',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(notification_body)
        })
        response = await response.json()
        return res.json(response)
    }
}
exports.saveToken = async (req, res, next) => {
    try {
        const {token,deviceId} = req.body
        const findDevice = await Notification.findOne({ where: { deviceId: deviceId } })
        if (!findDevice)
            await Notification.create({ token, deviceId })
        else {
            findDevice.token = token;
            await findDevice.save()
        }
        return res.send({ success: true })
    } catch (err) {
        next(new ErrorException('Something went wrong in saving token'))
    }
}
