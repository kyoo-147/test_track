## 1. Prompt chính cho AI

```text
Bạn là trợ lý lập trình chuyên nghiệp, hiểu rõ stack sau:
- Frontend: ReactJS + Ant Design, React Router, Axios.
- Backend: Node.js + Express + Mongoose (MongoDB).
- Biểu đồ: Recharts hoặc react-chartjs-2.
- Xử lý ngày giờ: moment.js hoặc date-fns.

Hãy giữ nguyên **cấu trúc thư mục** và **tên file** hiện tại, đồng thời thực thi chính xác các yêu cầu sau từ feedback khách hàng:

I. CompanyManagement.js
  1. Đổi nhãn “Tạm dừng” → “Chưa kích hoạt” và thêm cột “Trạng thái” (Active/Chưa kích hoạt).
  2. Dropdown “Gói thuê bao” hiển thị: 50G, 100G, 250G, 300G. Chỉ khi chọn gói thuê bao mới bật dropdown “Top‑up”.
  3. Dropdown “Gói dịch vụ” hiển thị: Gói 1, Gói 2, Gói 3.
  4. Nút “+” tự sinh thêm dòng nhập liệu tương ứng.
  5. Khi công ty có >1 tàu, hiển thị: dòng đầu show tên công ty + tàu 1; các dòng sau chỉ show tàu thứ n.

II. ShipManagement.js
  1. Modal “Add Ship”: tự load “Tên công ty”, “Gói thuê bao”, “Gói dịch vụ” từ API `/api/companies`.
  2. Dropdown “Tên tàu”: danh sách tàu; bổ sung MMSI, IP, Loại tàu, Ngày lắp đặt, Thiết bị, Starlink status, router login, Ghi chú.
  3. Bảng chỉ show cột chính, các cột chi tiết expand khi click.

III. UsersScreen.js
  1. Dropdown “Chức danh”: Capt, CO, 2O…TV15.
  2. Tự động tạo `username` = `<packageKey>-<role>`; password random 6 số.
  3. Dropdown “Tàu” load từ `/api/ships`.
  4. Field “Dung lượng giới hạn” từ PackagesManagement; “Dung lượng đã dùng”; “Ngày tạo”/“Ngày cập nhật”; “Người tạo”; bỏ “serial thiết bị”.
  5. Nút “In”: chọn cột hoặc in toàn bộ, xuất PDF.

IV. MenuBar (App.js)
  Thứ tự: Dashboard → Quản lý Công ty → Quản lý Tàu → Quản lý Người dùng → Quản lý Gói → Cài Đặt.

V. PackagesManagement.js
  - Fields: Name, Radius, Limit Type (Time/Data/Both), Bandwidth (dropdown), Validity, Unit (1h,1d,1w,1m), Price, Shared Users (1–10), Vessel.

VI. Settings (SpeedManagement.js)
  1. Bảng tạo users hệ thống: username, password, role (Admin, Tech, Sales).
  2. Phân quyền:
     - Admin: full quyền.
     - Tech: quản lý Users & Packages, chỉ thấy data công ty mình.
     - Sales: chỉ xem Dashboard.
  3. API trả data theo `companyId` của Tech.

**Yêu cầu**: Sinh đầy đủ **code React** + AntD, **code backend** + Express, **Mongoose schema** cần sửa, **API endpoints**, **permission checks**, **responsive UI**.
```

## 2. Prompt training cho Copilot

```text
Bạn là GitHub Copilot, hãy ôn lại và ghi nhớ TOÀN BỘ bối cảnh dự án:

- **Thư mục & file**: giữ nguyên cấu trúc `myapp-backend` & `myapp-frontend`.
- **Công nghệ**: ReactJS + AntD, Express + Mongoose, Axios, Recharts/chart.js, moment.js/date-fns.
- **Luồng dữ liệu**:
  1. Frontend gọi `/api/companies`, `/api/ships`, `/api/packages`, `/api/dashboard/summary`.
  2. Backend controllers trả JSON với các field chính xác: `totalCompanies`, `subscriptionPackages`, `totalSubscriptionRevenue`, `activeSubscriptions`, `servicePackages`, `totalServiceRevenue`, `activeServicePackages`, `retailUsers`, `chartData`.
- **Model**:
  - Company: `name`, `subscriptions: [{ package, status, services: [...] }]`.
  - Ship: `companyId`, `mmsi`, `ip`, `type`, `installDate`, `router`, `starlink`, ...
  - User: `packageKey`, `role`, `shipId`, `username`, `password`, `quotaLimit`, `usedQuota`, `createdAt`, `updatedAt`, `creator`.
- **UI patterns**: AntD Table/Form/Modal/Dropdown/Button/Card, stacked Bar Chart.
- **Logic**:
  - Enable gói Top‑up chỉ khi đã chọn gói thuê bao.
  - Expand row để show detail.
  - Role-based access: Tech chỉ data company, Sales chỉ view Dashboard.

Duy trì và áp dụng bối cảnh này cho mọi code bạn generate.
```




Bạn là một AI hỗ trợ phát triển frontend React với Ant Design và backend Node.js/Express/Mongoose. Dưới đây là yêu cầu chỉnh sửa tổng hợp từ khách hàng, hãy đọc kỹ từng mục và sinh ra **đầy đủ** các thay đổi cần thiết, bao gồm:

I. CompanyManagement.js
  1. Đổi “Trạng thái tạm dừng” thành “Chưa kích hoạt”.
  2. Thêm cột “Trạng thái kích hoạt” (Active / Chưa kích hoạt).
  3. Cho phần chọn gói thuê bao (Dropdown) hiển thị: 50G, 100G, 250G, 300G.
     - Nếu khách chọn bất kỳ gói thuê bao nào, thì mới mở thêm dropdown “Top‑up” (các gói bổ sung).
  4. Cho phần chọn gói dịch vụ hiển thị: Gói 1, Gói 2, Gói 3.
  5. Khi click “+” ở thuê bao hoặc dịch vụ, tự động thêm một dòng nhập liệu tương ứng, giữ logic cố định gói và giá.
  6. Khi thêm tàu thứ hai cho cùng công ty, hiển thị rõ ràng:  
     - Dòng đầu show tên công ty + tàu 1  
     - Dòng sau chỉ show tàu 2 (không lặp tên công ty) nhưng vẫn nhận diện được là cùng công ty.

II. ShipManagement.js
  1. Khi thêm tàu, các field: “Tên công ty”, “Gói thuê bao”, “Gói dịch vụ” phải tự động load từ CompanyManagement (API hoặc context).
  2. Dropdown “Tên tàu” load danh sách tàu đã tạo; các field bổ sung: MMSI, IP, Loại tàu (4 loại), Ngày lắp đặt, Thiết bị, Trạng thái Starlink, username/password router, Ghi chú.
  3. Bảng hiển thị chỉ show các cột chính (Tên công ty, Gói thuê bao, Trạng thái, Gói dịch vụ) — các cột chi tiết khác ẩn, chỉ bung ra khi click expand row.

III. UsersScreen.js
  1. Dropdown “Chức danh” gồm: Capt, CO, 2O…TV15.
  2. Tự động tạo `username` = `<gói>-<chức danh>`; password 6 ký tự số auto‑gen.
  3. Dropdown “Tàu” load từ ShipManagement.
  4. Thêm field “Dung lượng giới hạn” lấy từ PackagesManagement; “Dung lượng đã dùng” lấy từ router; “Ngày tạo”/“Ngày cập nhật”; “Người tạo” (input text); bỏ “serial thiết bị”.
  5. Nút “In” ở góc phải: cho chọn in theo cột hoặc in toàn bộ và xuất PDF.

IV. Navbar/MenuBar (App.js)
  - Thứ tự menu: Dashboard → Quản lý Công ty → Quản lý Tàu → Quản lý Người dùng → Quản lý Gói → Cài Đặt.

V. PackagesManagement.js
  1. Các trường: Name, Radius, Limit Type (Time, Data, Both), Bandwidth, Validity, Unit (1h, 1d, 1w, 1m), Price, Shared Users (1–10), Vessel.
  2. Mỗi field dropdown hoặc input phù hợp.

VI. SpeedManagement.js → Settings
  1. Bảng tạo users hệ thống: username/password, Role (Admin, Tech, Sales).
  2. Phân quyền:
     - **Admin**: full quyền.
     - **Tech**: chỉ quản lý Users & Packages, thấy data công ty mình.
     - **Sales**: chỉ xem Dashboard.
  3. Với Tech, chỉ hiển thị dữ liệu (tàu, users) của công ty tương ứng.

**Hướng dẫn AI thực thi:**
- Sinh đầy đủ code React/AntD cho từng trang .js, bao gồm component, state, API call.
- Sinh đầy đủ code backend (Express route, controller, Mongoose) để hỗ trợ các dropdown, permission, liên kết dữ liệu.
- Đảm bảo UI/UX rõ ràng, responsive, dễ dùng.
- Mọi thay đổi phải tương thích với cây thư mục hiện có.
- Ghi chú rõ chỗ nào cần thêm API, DB query.



Ok đây chính là bản feedback sau khi khách hàng đã xem demo ban đầu và gửi lại cho tôi.

* Và tôi đã soạn lại thành văn bản và suy nghĩ theo cách của tôi.
* Giờ tôi muốn bạn đầu tiên hãy tối ưu Prompts, sao cho nó thật chính xác và để AI hiểu và hoạt động, lập trình thật tốt và thật chính xác nhất và dựa theo bản Feedback chỉnh sửa mà khách hàng đã cung cấp.
* Và sau khi đã hoàn thành các bước đó, cũng hãy làm cho tôi một bộ câu hỏi để phản hồi lại khách hàng về các sự khó hiểu và các điều mà trong bảng Feedback này bạn chưa rõ và chưa có đủ dữ liệu, yêu cầu để triển khai chi tiết và chính xác.

\---> Đây chính là file Feedback yêu cầu chỉnh sửa:
Feedback: Bảng yêu cầu chỉnh sửa và ghép nối các cơ sở dữ liệu, tinh chỉnh CSS.

I. Đầu tiên, ở phần CompanyManagement.js

* Thêm trạng thái kích hoạt cho dữ liệu, đổi trạng thái tạm dừng thành chưa kích hoạt
* Khi click vào chọn gói thuê bao sẽ sổ xuống dữ liệu sau để khách hàng chọn: 50G, 100G, 250G, 300G và bổ sung thêm khách hàng có thể chọn các gói Top-up, lưu ý chỉ khi khách hàng chọn gói thuê bao thì khách hàng mới có quyền chọn gói Top-up
* Tại phần Gói dịch vụ cũng khi click vào sẽ sổ xuống dữ liệu sau cho người dùng chọn: Gói 1, Gói 2, Gói 3
* Chỉnh sửa dấu cộng cho gói thuê bao và gói dịch vụ, khi ấn dấu cộng tự động tạo các trường dữ liệu tương ứng, fix thuê bao, dịch vụ cố định
* Và một phần nữa là khi chọn thêm tàu lần thứ 2 cho cùng 1 công ty, thì khi hiển thị sẽ hiển thị tàu thứ 2 ở dòng thứ 2, tuy nhiên sắp xếp nó trực quan và dễ hình dung, có thể là nhỏ hơn hoặc không hiển thị tên công ty đó, làm mọi cách để người dùng có thể nhìn vào và biết công ty đó có 2 tàu và tàu thứ 2 đó là của công ty đó, chứ không phải là cách sắp xếp có dấu , và thể hiện trên hết 1 hàng như thế.

II. Đầu tiên ở phần ShipManagement.js

* Phần thêm tàu khi click và hiển thị nhập thông tin thêm tàu: Các trường tên công ty, gói thuê bao, gói dịch vụ đã nhập ở trên rồi không thể hiện lại trong bảng này mà liên kết lại với bảng CompanyManagement.js đã được tạo trước đó, tức là có thể hình dung rằng đầu tiên ta vào và tạo các dữ liệu cho bảng CompanyManagement.js, thì khi ta vào và điền thông tin cho bảng ShipManagement.js thì các phần dữ liệu như Tên công ty, Gói thuê bao, Gói dịch vụ sẽ được tự động cập nhập theo dữ liệu truy xuất được từ bảng CompanyMangement.js đã được nhập trước đó, người dùng click vào tên công ty thì sẽ sổ xuống các công ty đã được tạo và truy xuất được từ bảng CompanyManagement.js, sau khi đã chọn công ty tương ứng thì các gói dịch vụ và gói thuê bao cũng sẽ được tự động truy xuất dữ liệu từ bảng ComapanyManagement.js và hiển thị tương ứng, vì nếu để người dùng tự nhập thì trên bảng này các thông số sẽ không nhất quán.
* Trong trường này chỉ có phần Tên Tàu khi click vào sẽ sổ xuống (lấy danh sách tàu đã có ở trên, điền thêm các trường sau: Mã hiệu (sửa thành MMSI), Địa chỉ IP, Loại tàu (Tàu hàng rời, Tàu cont, Tàu chở dầu, Tàu chở cont), Ngày lắp đặt, Loại thiết bị (router), Trạng thái Starlink (online, offline), username, pass router (option), Ghi chú...
* Ở bảng bên lớn ngoài để hiển thị các dữ liệu thì chỉ thể hiện các trường chính ở trên, ngoài ra các trường còn lại như công ty, gói thuê bao, trạng thái, gói dịch vụ, trạng thái có thể ẩn đi chỉ khi nào click vào mới hiển thị lên.

III. Tiếp tục đến bảng người dùng UsersScreen.js

* Phần chức danh cho sổ xuống (chọn các loại sau: Capt, CO, 2O, 3O, CE, 2E, 3E, TV1, TV2, T3,..., TV15), thêm trường username sẽ là kết hợp của tên gói (tên gói được tạo trong phần quản lý gói PackagesManagement.js) với tên chức danh ví dụ: cg1-Capt, cg3-CO, cg3-2O, Thêm trường tàu (sổ xuống các tàu có trong list, phần password cho chức năng tự động tạo chuỗi 6 số ẩn tự động trong trường)
* Tên đăng nhập sẽ tự động là tên gói + tên chức danh sau khi người dùng đã chọn 2 trường gói và chức danh, thêm trường dung lượng giới hạn (lấy từ trong quản lý gói PackagesManagement.js), dung lượng đã dùng sẽ được lấy từ router, ngày tạo hoặc ngày cập nhật, Người tạo(gõ tên người tạo), bỏ phần serial thiết bị. Ở trên góc phải sẽ có nút in, có thể chọn các dữ liệu nào sẽ được in hoặc là chọn in tất cả, sẽ in ra danh sách ở dưới để gửi cho đội tàu.

IV. Phần thanh MenuBar:

* Mục quản lý gói cho lên trên, mục cài đặt tốc độ cho xuống dưới sau đó đổi tên thành cài đặt (trong đây sẽ chứa toàn bộ phần cài đặt của hệ thống), tức là nó sẽ được sắp xếp theo thứ tự từ trên xuống dưới như sau: Dashboard -> Quản Lý Công Ty -> Quản Lý Tàu -> Quản Lý Người Dùng -> Quản Lý Gói -> Cài Đặt

V. Phần PackagesManagement:

* Tên gói sẽ triển khai lại theo mẫu này, các trường chi tiết sau đây:
* Name, ls Radius, Limit Type: Time Limit - Data Limit - Both Limit, Bandwidth, Packege Validity, Unit, Package Price, Shared Users, Vessel.
* Trong phần Bandwidth (lưu lượng) sẽ được chọn sổ xuống để chọn các loại giới hạn, phần giá để options, phần unit khi chọn sẽ sổ xuống: 1hour, day, 1w, 1 tháng), Shared Users khi chọn cũng sẽ sổ xuống (từ 1 - 10)

VI. Phần cuối cùng là phần Settting -> Tương ứng với SpeedManagement.js cũ

* Phần Setting là 1 bảng có thể tạo 3 kiểu user để quản trị trang web này gồm tạo username, password, quyền có 3 loại quyền như sau: Admin, Tech, Sales.
* Admin thì có thể quản trị toàn bộ mọi thứ của trang web và dữ liệu.
* Tech chỉ có thể quản trị trang người dùng, quản lý gói.
* Sales chỉ có thể xem thông tin về trang dashboard.
* Và một Chú ý cực kỳ quan trọng: Tại trang được login với quyền Tech sẽ chỉ được xem username của công ty tương ứng với công ty của Tech đó (ví dụ Tech của công ty A chỉ xem được các tàu và user của công ty A và có quyền chỉnh sửa user của công ty A) không xem được xem các dữ liệu của công ty khác.

![logo](https://github.com/user-attachments/assets/4205945c-729a-4abd-9353-f42142e609ab)
![bb7072af2a01985fc110](https://github.com/user-attachments/assets/72b48cb9-b006-43aa-8562-9cef6cb60b03)
![map-pattern](https://github.com/user-attachments/assets/4991fea1-cbdc-4a98-aa42-b4134d5aab06)
