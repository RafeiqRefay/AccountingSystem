# Accounting & Inventory Management System

نظام محاسبة وإدارة مخزون (فواتير، مبيعات، مصاريف، منتجات، تصنيفات).

## مكونات المشروع

```
AccountingSystem/
├── Backend/StoreManagementBackend/      # الباك إند (ASP.NET Core Web API)
├── DataBase/DataBase.sql                # سكربت قاعدة البيانات (SQL Server)
└── Frontend/East-Gallery/East-Gallery/East-Gallery/
    ├── src/                             # الفرونت إند (React + Vite)
    ├── electron/                        # تغليف التطبيق كبرنامج ويندوز (Electron)
    └── backend/                         # نسخة منشورة (Published) من الباك إند
```

## التقنيات المستخدمة

- **Backend:** ASP.NET Core (.NET 8) + SQL Server
- **Frontend:** React + Vite + Axios
- **Desktop:** Electron
- **Database:** SQL Server / SQL Server LocalDB

---

## المتطلبات (Prerequisites)

نزّل ونصّب البرامج التالية قبل البدء:

| البرنامج | الاستخدام | الرابط |
|---|---|---|
| Git | تنزيل المشروع | https://git-scm.com/downloads |
| .NET 8 SDK | تشغيل الباك إند | https://dotnet.microsoft.com/download/dotnet/8.0 |
| Node.js (LTS) | تشغيل الفرونت إند | https://nodejs.org |
| SQL Server أو SQL Server LocalDB | قاعدة البيانات | https://www.microsoft.com/sql-server/sql-server-downloads |

---

## 1) تنزيل المشروع

```bash
git clone https://github.com/RafeiqRefay/AccountingSystem.git
cd Accounting_Inventory_Management_System
```

أو من GitHub: **Code ← Download ZIP** ثم فك الضغط.

---

## 2) إعداد قاعدة البيانات

1. افتح **SQL Server Management Studio (SSMS)** وسجّل الدخول على السيرفر عندك.
2. افتح ملف `DataBase/DataBase.sql` ونفّذه (Execute) لإنشاء قاعدة البيانات والجداول.
3. إذا كنت تستخدم **LocalDB**، فالباك إند ممكن ينشئ القاعدة تلقائياً عبر `DataBase/DatabaseInitializer.cs` عند أول تشغيل (راجع الملف للتأكد).

### ضبط سلسلة الاتصال (Connection String)

افتح الملف:

```
Backend/StoreManagementBackend/appsettings.json
```

وعدّل سلسلة الاتصال لتناسب جهازك، مثال:

```json
"ConnectionStrings": {
  "DefaultConnection": "Server=(localdb)\\MSSQLLocalDB;Database=YourDatabaseName;Trusted_Connection=True;TrustServerCertificate=True;"
}
```

> ملاحظة: اسم المفتاح واسم قاعدة البيانات الفعليين موجودان في `appsettings.json` وفي الملف `ConnectionString.cs`. استخدم نفس الأسماء الموجودة هناك.

---

## 3) تشغيل الباك إند (Backend)

```bash
cd Backend/StoreManagementBackend
dotnet restore
dotnet run
```

أو افتح `StoreManagementBackend.sln` بـ **Visual Studio** واضغط **F5**.

بعد التشغيل، سيظهر في الطرفية العنوان الذي يعمل عليه الـ API (مثل `https://localhost:xxxx` أو `http://localhost:xxxx`). يمكنك استعراض الـ API عبر **Swagger** على:

```
<عنوان الـ API>/swagger
```

---

## 4) تشغيل الفرونت إند (Frontend)

```bash
cd Frontend/East-Gallery/East-Gallery/East-Gallery
npm install
npm run dev
```

ثم افتح الرابط الذي يظهر في الطرفية (غالباً `http://localhost:5173`).

### ربط الفرونت بالباك إند

افتح الملف:

```
src/api/axios.js
```

وتأكد أن `baseURL` يطابق عنوان الباك إند الذي يعمل عندك (من الخطوة 3).

---

## 5) تشغيل التطبيق كبرنامج ويندوز (Electron) - اختياري

من فولدر الفرونت إند نفسه، راجع قسم `scripts` في ملف `package.json` لمعرفة أوامر التشغيل والبناء، مثلاً:

```bash
npm run electron        # تشغيل التطبيق بنافذة Electron (اسم الأمر حسب package.json)
npm run build           # بناء الفرونت إند
```

وعند بناء ملف التثبيت (installer) سيظهر الناتج في فولدر `dist-installer` (غير مرفوع على GitHub لأنه ناتج بناء).

> البرنامج المنشور داخل `backend/` يحتاج **.NET 8 Runtime** منصّباً على الجهاز.
> ملف `SqlLocalDB.msi` الموجود في المشروع يُستخدم لتنصيب LocalDB إذا لم يكن موجوداً.

---

## الملفات غير المرفوعة (موجودة في .gitignore)

هذه الملفات تُولَّد تلقائياً ولا حاجة لرفعها:

| الملف / الفولدر | كيف يعود |
|---|---|
| `node_modules/` | `npm install` |
| `bin/` و `obj/` | `dotnet build` أو تشغيل المشروع |
| `.vs/` و `*.user` | ملفات إعدادات شخصية لـ Visual Studio |
| `dist-installer/` | ناتج بناء Electron (`npm run build` ثم أمر الـ installer) |

---

## حل المشاكل الشائعة

- **خطأ في الاتصال بقاعدة البيانات:** تأكد من تشغيل SQL Server/LocalDB ومن صحة Connection String.
- **الفرونت لا يجلب البيانات:** تأكد أن الباك إند يعمل وأن `baseURL` في `src/api/axios.js` صحيح.
- **خطأ CORS:** تأكد أن عنوان الفرونت (مثل `http://localhost:5173`) مسموح به في إعدادات CORS في `Program.cs`.
- **`npm install` يفشل:** تأكد من إصدار Node.js (يفضل LTS) وحاول حذف `node_modules` و `package-lock.json` ثم إعادة التثبيت.

---

## المطور

**Rafeiq Refay**
