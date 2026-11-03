
// ======================================
// 1. LẤY CÁC PHẦN TỬ TRÊN GIAO DIỆN
// ======================================

const startBtn = document.getElementById("start-btn");
const stopBtn = document.getElementById("stop-btn");

const cameraStatus = document.getElementById("camera-status");

const eyeStatus = document.getElementById("eye-status");
const eyeConfidence = document.getElementById("eye-confidence");

const yawnStatus = document.getElementById("yawn-status");
const yawnConfidence = document.getElementById("yawn-confidence");

const alertBox = document.getElementById("alert-box");
const eventLog = document.getElementById("event-log");
const logCount = document.getElementById("log-count");


// ======================================
// 2. TRẠNG THÁI HỆ THỐNG
// ======================================

let isMonitoring = false;
let totalEvents = 0;

const MAX_LOGS = 50;


// ======================================
// 3. CẬP NHẬT TRẠNG THÁI CAMERA
// ======================================

function updateCameraStatus(status, message) {
    const statusConfig = {
        idle: { color: "#64748b", text: "● Camera chưa được khởi động" },
        connecting: { color: "#d97706", text: "● Đang kết nối camera..." },
        active: { color: "#0d9488", text: "● Camera đang hoạt động" },
        error: { color: "#dc2626", text: "● Camera gặp sự cố" }
    };

    const config = statusConfig[status];

    if (!config) return;

    cameraStatus.textContent = message || config.text;
    cameraStatus.style.color = config.color;
}


// ======================================
// 4. GHI NHẬT KÝ SỰ KIỆN
// ======================================

function addEventLog(message) {
    if (eventLog.querySelector(".empty-log")) {
        eventLog.innerHTML = "";
    }

    const eventItem = document.createElement("p");

    eventItem.style.padding = "12px 0";
    eventItem.style.borderBottom = "1px solid #e9eef4";
    eventItem.style.fontSize = "13px";

    const currentTime = new Date().toLocaleTimeString("vi-VN");

    eventItem.textContent = `[${currentTime}] ${message}`;

    eventLog.prepend(eventItem);

    totalEvents++;

    // Giới hạn số dòng nhật ký
    while (eventLog.children.length > MAX_LOGS) {
        eventLog.removeChild(eventLog.lastElementChild);
    }

    logCount.textContent = `${totalEvents} sự kiện`;
}


// ======================================
// 5. CẬP NHẬT TRẠNG THÁI MẮT
// ======================================

function updateEyeStatus(isClosed, confidence) {
    eyeStatus.textContent = isClosed
        ? "Mắt đang nhắm"
        : "Mắt đang mở";

    eyeConfidence.textContent =
        `${(confidence * 100).toFixed(1)}%`;
}


// ======================================
// 6. CẬP NHẬT TRẠNG THÁI NGÁP
// ======================================

function updateYawnStatus(isYawning, confidence) {
    yawnStatus.textContent = isYawning
        ? "Đang ngáp"
        : "Không ngáp";

    yawnConfidence.textContent =
        `${(confidence * 100).toFixed(1)}%`;
}


// ======================================
// 7. HIỂN THỊ CẢNH BÁO
// ======================================

function showAlert(message, isWarning = false) {
    alertBox.innerHTML = "";

    const icon = document.createElement("span");
    icon.textContent = isWarning ? "⚠️" : "🛡️";

    const content = document.createElement("div");

    const heading = document.createElement("h4");
    heading.textContent = isWarning
        ? "Cảnh báo tài xế"
        : "Trạng thái cảnh báo";

    const description = document.createElement("p");
    description.textContent = message;

    content.append(heading, description);
    alertBox.append(icon, content);

    alertBox.style.background = isWarning
        ? "#fef2f2"
        : "#ecfdf5";
}


// ======================================
// 8. ĐIỀU KHIỂN GIAO DIỆN GIÁM SÁT
// ======================================

function setMonitoringState(active) {
    isMonitoring = active;

    startBtn.disabled = active;
    stopBtn.disabled = !active;

    if (!active) {
        eyeStatus.textContent = "Đang chờ nhận diện";
        yawnStatus.textContent = "Đang chờ nhận diện";

        eyeConfidence.textContent = "--";
        yawnConfidence.textContent = "--";

        updateCameraStatus("idle");
    }
}


// ======================================
// 9. XỬ LÝ NÚT BẮT ĐẦU VÀ DỪNG
// ======================================

startBtn.addEventListener("click", function () {
    if (isMonitoring) return;

    setMonitoringState(true);

    updateCameraStatus("connecting");
    showAlert("Đang chờ kết nối camera và hệ thống AI.");

    addEventLog("Đã yêu cầu bắt đầu giám sát.");
});

stopBtn.addEventListener("click", function () {
    if (!isMonitoring) return;

    setMonitoringState(false);

    showAlert("Đã dừng giám sát.");
    addEventLog("Đã dừng giám sát.");
});


// ======================================
// 10. GIAO DIỆN KẾT NỐI DÀNH CHO NGÂN VÀ DIÊU
// ======================================

window.SAFEDRIVE = {

    // Trạng thái hệ thống
    isMonitoring: () => isMonitoring,

    // Dành cho Ngân: cập nhật kết quả AI
    updateEyeStatus,
    updateYawnStatus,

    // Dành cho Ngân: báo trạng thái camera
    updateCameraStatus,

    // Dành cho Diêu: xử lý cảnh báo và nhật ký
    showAlert,
    addEventLog,

    // Dùng để cập nhật trạng thái giám sát
    setMonitoringState
};
