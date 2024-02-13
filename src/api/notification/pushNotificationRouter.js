const pushNotificationController = require('./push-notifications.controller')
const express = require('express')
const router = express.Router();

router.post("/send-notification", pushNotificationController.sendPushNotification)


router.put("/save-token", pushNotificationController.saveToken)
module.exports = router