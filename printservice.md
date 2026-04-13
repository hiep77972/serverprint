# Tài liệu API cho POS Printer Service

Client sẽ không gửi lệnh in (live) đến máy in, thay vào đó client cần gửi API đến 1 server Socket (live), server Socket sẽ phải nhận tín hiệu liên tục, nếu có lệnh in từ client, server sẽ gửi lệnh in xuống app trung gian C#. App C# sẽ nhận lệnh in và in tem.

## URL Cơ sở (Base URL)
URL cơ sở cho tất cả các yêu cầu API là: `https://serverprint-cp38.onrender.com/print`

## Cấu trúc Phản hồi Chung

Vì chạy liên tục nên sẽ không gửi output
```
{
}
```
---

## 1. Cách thức gửi API

 ### 1.1 Call API
 Gửi lệnh in xuống server Socket.
 
 - **Endpoint:** `POST https://serverprint-cp38.onrender.com/print`
 - **Headers:**
   - `Content-Type: application/json`
 - **Body:**
 ```json
 {
   "productName": "Rau muống",
   "quantity": "1",
   "price": "3000đ",
   "qr": "https://hpap.vn/"
 }
 ```
 - **Phản hồi:** 
 ```json
 {
 }
 ```

 #### Hướng dẫn FE
 Đoạn code mẫu sử dụng javascript để call API gửi lệnh in xuống web socket.
 
 **Ví dụ sử dụng JavaScript:**

 ```javascript
 const data = {
        productName: document.getElementById("productName").value,
        quantity: document.getElementById("quantity").value,
        price: document.getElementById("price").value,
        qr: document.getElementById("qr").value
    };

    document.getElementById("status").innerText = "Đang gửi lệnh in...";

    fetch("https://serverprint-cp38.onrender.com/print", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
    .then(res => res.text())
    .then(res => {
        document.getElementById("status").innerText = "✅ In thành công!";
    })
    .catch(err => {
        document.getElementById("status").innerText = "❌ Không kết nối được máy in!";
        console.error(err);
    });
 ```

 ---
