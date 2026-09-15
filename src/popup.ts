const ALARM_NAME = "loopReminderAlarm"

interface StorageData { 
    hours?: number;
    minutes?: number;
    message?: string;
    isRunning?: boolean;
}

const hoursInput = document.getElementById("hours") as HTMLInputElement
const minutesInput = document.getElementById("minutes") as HTMLInputElement
const messageInput = document.getElementById("message") as HTMLInputElement
const startBtn = document.getElementById("start-btn") as HTMLInputElement
const stopBtn = document.getElementById("stop-btn") as HTMLInputElement
const statusText = document.getElementById("status") as HTMLInputElement

document.addEventListener("DOMContentLoaded", async () => { 
    const data: StorageData = await chrome.storage.local.get([
        'hours',
        'minutes',
        'message',
        'isRunning'
    ])

    if (data.hours !== undefined) hoursInput.value = data.hours.toString()
    if (data.minutes !== undefined) minutesInput.value = data.minutes.toString()
    if (data.message !== undefined) messageInput.value = data.message

    updateStatusUI(data.isRunning || false)
})

function updateStatusUI(isRunning: boolean): void { 
    if (isRunning) {
        statusText.textContent = "Active: Reminder running..."
        statusText.style.color = 'green'
    }
    else { 
        statusText.textContent = "Stopped.",
        statusText.style.color = "#666"
    }
}

startBtn.addEventListener("click", async () => { 
    const hours = parseInt(hoursInput.value, 10) || 0
    const minutes = parseInt(minutesInput.value, 10) || 0
    const message = messageInput.value.trim()

    if (!message) { 
        alert("Please enter a reminder message!")
        return;
    }

    const totalMinutes = hours * 60 + minutes

    if (totalMinutes < 1) { 
        alert("Please set an interval of at least 1 minute.")
        return;
    }

    await chrome.storage.local.set({
        hours,
        minutes,
        message,
        isRunning: true,
    })

    await chrome.alarms.create(ALARM_NAME, {
        delayInMinutes: totalMinutes,
        periodInMinutes: totalMinutes
    })

    updateStatusUI(true)
})

stopBtn.addEventListener('click', async () => { 
    await chrome.alarms.clear(ALARM_NAME)

    await chrome.storage.local.set({ isRunning: false })

    updateStatusUI(false)
})