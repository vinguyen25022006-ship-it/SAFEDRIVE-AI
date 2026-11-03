
// ======================================
// 1. LẤY CÁC PHẦN TỬ TRÊN GIAO DIỆN
// ======================================

const startBtn = document.getElementById("start-btn");
const stopBtn = document.getElementById("stop-btn");

const eyeStatus = document.getElementById("eye-status");
const eyeConfidence = document.getElementById("eye-confidence");

const yawnStatus = document.getElementById("yawn-status");
const yawnConfidence = document.getElementById("yawn-confidence");

const alertBox = document.getElementById("alert-box");
const eventLog = document.getElementById("event-log");
const logCount = document.getElementById("log-count");

// Trạng thái hoạt động của hệ thống
let isMonitoring = false;
let totalEvents = 0;


// ======================================
// 2. HÀM GHI NHẬT KÝ SỰ KIỆN
// ======================================

function addEventLog(message) {
    // Xóa thông báo khi chưa có sự kiện
    if (totalEvents === 0) {
        eventLog.innerHTML = "";
    }

    totalEvents++;

    // Tạo dòng sự kiện mới
    const eventItem = document.createElement("p");

    eventItem.style.padding = "12px 0";
    eventItem.style.borderBottom = "1px solid #e9eef4";
    eventItem.style.fontSize = "13px";

    const currentTime = new Date().toLocaleTimeString("vi-VN");

    eventItem.textContent = `[${currentTime}] ${message}`;

    // Thêm sự kiện vào đầu danh sách
    eventLog.prepend(eventItem);

    // Cập nhật tổng số sự kiện
    logCount.textContent = `${totalEvents} sự kiện`;
}


// ======================================
// 3. HÀM CẬP NHẬT TRẠNG THÁI MẮT
// ======================================

function updateEyeStatus(isClosed, confidence) {
    if (isClosed) {
        eyeStatus.textContent = "Mắt đang nhắm";
    } else {
        eyeStatus.textContent = "Mắt đang mở";
    }

    eyeConfidence.textContent =
        `${(confidence * 100).toFixed(1)}%`;
}


// ======================================
// 4. HÀM CẬP NHẬT TRẠNG THÁI NGÁP
// ======================================

function updateYawnStatus(isYawning, confidence) {
    if (isYawning) {
        yawnStatus.textContent = "Đang ngáp";
    } else {
        yawnStatus.textContent = "Không ngáp";
    }

    yawnConfidence.textContent =
        `${(confidence * 100).toFixed(1)}%`;
}


// ======================================
// 5. HÀM HIỂN THỊ CẢNH BÁO
// ======================================

function showAlert(message, isWarning = false) {
    alertBox.innerHTML = `
        <span>${isWarning ? "⚠️" : "🛡️"}</span>
        <div>
            <h4>${isWarning ? "Cảnh báo tài xế" : "Trạng thái cảnh báo"}</h4>
            <p>${message}</p>
        </div>
    `;

    if (isWarning) {
        alertBox.style.background = "#fef2f2";
    } else {
        alertBox.style.background = "#ecfdf5";
    }
}


// ======================================
// 6. XỬ LÝ NÚT BẮT ĐẦU GIÁM SÁT
// ======================================

startBtn.addEventListener("click", function () {
    if (isMonitoring) return;

    isMonitoring = true;

    startBtn.disabled = true;
    stopBtn.disabled = false;

    eyeStatus.textContent = "Đang chờ dữ liệu AI";
    yawnStatus.textContent = "Đang chờ dữ liệu AI";

    showAlert("Đã yêu cầu bắt đầu giám sát. Đang chờ kết nối camera và AI.");

    addEventLog("Đã yêu cầu bắt đầu giám sát.");
});


// ======================================
// 7. XỬ LÝ NÚT DỪNG GIÁM SÁT
// ======================================

stopBtn.addEventListener("click", function () {
    if (!isMonitoring) return;

    isMonitoring = false;

    startBtn.disabled = false;
    stopBtn.disabled = true;

    eyeStatus.textContent = "Đang chờ nhận diện";
    yawnStatus.textContent = "Đang chờ nhận diện";

    eyeConfidence.textContent = "--";
    yawnConfidence.textContent = "--";

    showAlert("Đã dừng giám sát.");

    addEventLog("Đã dừng giám sát.");
});


// ======================================
// 8. CÁC HÀM CHỜ TÍCH HỢP AI VÀ CẢNH BÁO
// ======================================

// Cung cấp các hàm để Ngân và Diêu có thể sử dụng
window.SAFEDRIVE = {
    updateEyeStatus,
    updateYawnStatus,
    showAlert,
    addEventLog,

    // Kiểm tra trạng thái giám sát
    isMonitoring: function () {
        return isMonitoring;
    }
};
