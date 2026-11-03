
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
// 3.1. XỬ LÝ KHI CAMERA GẶP LỖI
// ======================================

function handleCameraError(error) {
    // Đưa hệ thống về trạng thái chưa giám sát
    setMonitoringState(false);

    // Xác định thông báo theo loại lỗi
    let message = "Không thể kết nối camera. Vui lòng thử lại.";

    if (error && error.name === "NotAllowedError") {
        message = "Vui lòng cấp quyền truy cập camera cho website.";
    } 
    else if (error && error.name === "NotFoundError") {
        message = "Không tìm thấy thiết bị camera.";
    } 
    else if (error && error.name === "NotReadableError") {
        message = "Camera đang được sử dụng bởi ứng dụng khác.";
    }

    // Cập nhật giao diện
    updateCameraStatus("error", message);
    showAlert(message, true);

    // Ghi nhận lỗi vào nhật ký
    addEventLog("Lỗi camera: " + message);
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
    updateCameraStatus("idle");

    showAlert("Đã dừng giám sát.");
    addEventLog("Đã dừng giám sát.");
});

// Nhận dữ liệu nhận diện từ mô hình AI
function updateDetection(data) {
    if (!data) return;

    updateEyeStatus(data.eyeClosed, data.eyeConfidence);
    updateYawnStatus(data.yawn, data.yawnConfidence);
}
// ======================================
// 10. GIAO DIỆN KẾT NỐI DÀNH CHO NGÂN VÀ DIÊU
// ======================================

window.SAFEDRIVE = {

    // Trạng thái hệ thống
    isMonitoring: () => isMonitoring,

    // Dành cho Ngân: cập nhật kết quả AI
    updateEyeStatus,
    updateYawnStatus,
    updateDetection,

    // Dành cho Ngân: báo trạng thái camera
    updateCameraStatus,
    handleCameraError,

    // Dành cho Diêu: xử lý cảnh báo và nhật ký
    showAlert,
    addEventLog,

    // Dùng để cập nhật trạng thái giám sát
    setMonitoringState
};
