# SAFEDRIVE AI – INTEGRATION GUIDE

## 1. Mục đích

Tài liệu này thống nhất cách phân chia công việc, quy ước dữ liệu và phương thức kết nối giữa các thành viên trong dự án SAFEDRIVE AI.

Mục tiêu là giúp các phần giao diện, nhận diện AI và cảnh báo có thể tích hợp với nhau mà không bị xung đột.

## 2. Phân chia công việc

| Thành viên | Nhiệm vụ | Nội dung bàn giao |
|---|---|---|
| Vy | Xây dựng giao diện, quản lý tích hợp, kiểm thử và triển khai website | index.html, style.css, script.js |
| Ngân | Lập trình webcam và tích hợp mô hình AI | Chức năng mở camera, nhận diện mắt và ngáp |
| Diêu | Lập trình chức năng cảnh báo | Điều kiện cảnh báo, âm thanh và nhật ký sự kiện |
| Thành viên huấn luyện mắt | Huấn luyện mô hình nhận diện mắt | Mô hình TensorFlow.js |
| Thành viên huấn luyện ngáp | Huấn luyện mô hình nhận diện ngáp | Mô hình TensorFlow.js |

## 3. Quy ước dữ liệu nhận diện

Ngân và Diêu thống nhất sử dụng cấu trúc dữ liệu sau:

```javascript
{
    eyeClosed: true,
    eyeConfidence: 0.95,
    yawn: false,
    yawnConfidence: 0.12,
    timestamp: Date.now()
}
```

Ý nghĩa:

- `eyeClosed`: Trạng thái mắt (true: nhắm, false: mở).
- `eyeConfidence`: Độ tin cậy nhận diện mắt.
- `yawn`: Trạng thái ngáp (true: đang ngáp, false: không ngáp).
- `yawnConfidence`: Độ tin cậy nhận diện ngáp.
- `timestamp`: Thời điểm ghi nhận kết quả.

Lưu ý:
- Giá trị confidence nằm trong khoảng từ 0 đến 1.
- Các thành viên phải sử dụng thống nhất tên thuộc tính và kiểu dữ liệu.
- Không tự ý thay đổi cấu trúc dữ liệu khi chưa thống nhất với các thành viên liên quan.

## 4. Quy ước kết nối với giao diện

Giao diện hiện tại cung cấp đối tượng:

`window.SAFEDRIVE`

Các hàm được cung cấp:

| Hàm | Chức năng |
|---|---|
| `isMonitoring()` | Kiểm tra hệ thống có đang giám sát hay không |
| `updateEyeStatus()` | Cập nhật trạng thái và độ tin cậy nhận diện mắt |
| `updateYawnStatus()` | Cập nhật trạng thái và độ tin cậy nhận diện ngáp |
| `updateDetection(data)` | Nhận dữ liệu và cập nhật đồng thời trạng thái mắt, ngáp |
| `updateCameraStatus()` | Cập nhật trạng thái camera |
| `handleCameraError(error)` | Xử lý lỗi camera |
| `showAlert(message, isWarning)` | Hiển thị thông báo cảnh báo |
| `addEventLog(message)` | Ghi nhận sự kiện vào nhật ký |
| `setMonitoringState(active)` | Cập nhật trạng thái giám sát |

### Phần việc của Ngân

- Phụ trách kết nối webcam và mô hình AI.
- Nhận diện trạng thái mắt và ngáp.
- Gửi kết quả nhận diện theo đúng cấu trúc dữ liệu đã thống nhất.
- Cập nhật giao diện thông qua các hàm trong `window.SAFEDRIVE`.
- Xử lý trường hợp không thể truy cập camera.

### Phần việc của Diêu

- Nhận kết quả nhận diện từ Ngân.
- Xử lý điều kiện cảnh báo:
  - Mắt nhắm liên tục khoảng 2 giây.
  - Có ít nhất 2 lần ngáp trong vòng 60 giây.
- Phân biệt các lần ngáp riêng biệt, không tính mỗi khung hình nhận diện là một lần ngáp.
- Phát âm thanh cảnh báo.
- Ghi nhận sự kiện thông qua `addEventLog()`.
- Hiển thị cảnh báo thông qua `showAlert()`.

## 5. Quy ước GitHub

Repository: SAFEDRIVE-AI

Các nhánh làm việc:

- `main`: Phiên bản chính thức của dự án.
- `branch-vy`: Giao diện và tích hợp của Vy.
- `branch-ngan`: Webcam và nhận diện AI của Ngân.
- `branch-dieu`: Chức năng cảnh báo của Diêu.

Quy định:

1. Mỗi thành viên làm việc trên nhánh được phân công.
2. Không tự ý chỉnh sửa trực tiếp nhánh `main`.
3. Commit code thường xuyên với nội dung mô tả rõ ràng.
4. Khi hoàn thành, tạo Pull Request để kiểm tra trước khi hợp nhất.
5. Không tự ý xóa hoặc thay đổi file của thành viên khác khi chưa trao đổi.

## 6. Quy định bàn giao

Khi bàn giao, mỗi thành viên cần:

- Đẩy đầy đủ code lên nhánh GitHub được phân công.
- Kiểm tra code có thể chạy độc lập theo phạm vi chức năng.
- Ghi rõ các thư viện cần sử dụng và cách cài đặt.
- Thông báo các file mới được thêm hoặc file hiện có đã chỉnh sửa.
- Hướng dẫn cách kết nối với các phần còn lại.

Đối với mô hình TensorFlow.js, cần bàn giao đầy đủ các file cần thiết, bao gồm `model.json`, file trọng số `.bin` và `metadata.json` nếu mô hình có sử dụng.

## 7. Kiểm thử sau tích hợp

Sau khi tích hợp, nhóm cần kiểm tra:

1. Webcam có thể khởi động và dừng bình thường.
2. Mô hình nhận diện được mắt mở và mắt nhắm.
3. Mô hình nhận diện được trạng thái ngáp.
4. Cảnh báo xuất hiện khi mắt nhắm liên tục khoảng 2 giây.
5. Cảnh báo xuất hiện khi có ít nhất 2 lần ngáp trong 60 giây.
6. Âm thanh cảnh báo hoạt động.
7. Nhật ký ghi nhận đúng sự kiện và thời gian.
8. Không xuất hiện cảnh báo trùng lặp liên tục.

## 8. Lưu ý

SAFEDRIVE AI là sản phẩm thử nghiệm phục vụ mục đích học tập và trình diễn. Hệ thống không thay thế các thiết bị giám sát an toàn chuyên dụng và không được xem là công cụ bảo đảm an toàn khi lái xe.