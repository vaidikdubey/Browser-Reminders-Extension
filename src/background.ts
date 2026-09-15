const ALARM_NAME = "loopReminderAlarm"

interface StorageData { 
    message?: string;
}

const DUMMY_ICON = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

chrome.alarms.onAlarm.addListener(async (alarm) => { 
    if (alarm.name !== ALARM_NAME) return;

    const data: StorageData = await chrome.storage.local.get('message')
    const reminderMessage = data.message || "Time is up!"

    chrome.notifications.create(`reminder-${Date.now()}`, {
        type: "basic",
        iconUrl: DUMMY_ICON,
        title: "Reminder!",
        message: reminderMessage,
        buttons: [{ title: "Done" }],
        requireInteraction: true
    })
})

chrome.notifications.onButtonClicked.addListener((notificationId, buttonIndex) => { 
    if(buttonIndex === 0) chrome.notifications.clear(notificationId)
})
