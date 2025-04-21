# Ứng dụng Quản lý Danh bạ

Ứng dụng quản lý danh bạ hiện đại được xây dựng bằng React Native, Expo và TypeScript.

## Tính năng

- 📱 Giao diện hiện đại và thân thiện
- 🌓 Hỗ trợ chế độ tối
- 📋 Danh sách liên hệ với tìm kiếm và sắp xếp
- 👤 Xem chi tiết liên hệ
- ➕ Thêm liên hệ mới
- ✏️ Chỉnh sửa liên hệ
- 🗑️ Xóa liên hệ
- 📞 Gọi điện và nhắn tin nhanh
- 📤 Chia sẻ liên hệ
- 💾 Lưu trữ cục bộ với AsyncStorage
- 🎨 Tùy chỉnh ảnh đại diện

## Bắt đầu

### Yêu cầu

- Node.js (phiên bản 14 trở lên)
- npm hoặc yarn
- Expo CLI

### Cài đặt

1. Clone repository:
```bash
git clone <đường-dẫn-repository>
cd ContactApp
```

2. Cài đặt các thư viện cần thiết:
```bash
npm install
# hoặc
yarn install
```

3. Khởi động máy chủ phát triển:
```bash
npm start
# hoặc
yarn start
```

4. Chạy trên thiết bị hoặc máy ảo:
- Nhấn `a` để chạy trên Android
- Nhấn `i` để chạy trên iOS
- Nhấn `w` để chạy trên web

## Cấu trúc dự án

```
ContactApp/
├── src/
│   ├── context/         # Các context provider
│   ├── navigation/      # Cấu hình điều hướng
│   ├── screens/         # Các màn hình
│   └── types/           # Các kiểu TypeScript
├── App.tsx              # Component gốc
└── package.json         # Các thư viện phụ thuộc
```

## Các thư viện sử dụng

- @react-navigation/native
- @react-navigation/stack
- @react-native-async-storage/async-storage
- expo-image-picker
- expo-linking
- expo-sharing
- react-native-paper
- react-native-safe-area-context
- react-native-screens

## Đóng góp

1. Fork repository
2. Tạo nhánh tính năng (`git checkout -b feature/tính-năng-mới`)
3. Commit các thay đổi (`git commit -m 'Thêm tính năng mới'`)
4. Đẩy lên nhánh (`git push origin feature/tính-năng-mới`)
5. Tạo Pull Request

## Giấy phép

Dự án này được cấp phép theo MIT License - xem file LICENSE để biết thêm chi tiết. 