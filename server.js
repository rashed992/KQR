// server.js
// خادم بسيط لربط متجر الاشتراكات ببوابة MyFatoorah (تدعم K-Net وفيزا/ماستر وApple Pay في الكويت)
//
// كيف تشغّله:
// 1) npm init -y && npm install express cors node-fetch dotenv
// 2) أنشئ ملف .env وضع فيه:
//      MYFATOORAH_API_KEY=ضع_مفتاح_التجربة_هنا
//      MYFATOORAH_BASE_URL=https://apitest.myfatoorah.com   (تجربة) أو https://api.myfatoorah.com (حقيقي)
// 3) node server.js

import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import "dotenv/config";

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = process.env.MYFATOORAH_API_KEY;
const BASE_URL = process.env.MYFATOORAH_BASE_URL || "https://apitest.myfatoorah.com";

// 1) إنشاء رابط دفع
app.post("/api/create-payment", async (req, res) => {
  try {
    const { items, total, customer } = req.body;

    const response = await fetch(`${BASE_URL}/v2/SendPayment`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        CustomerName: customer.name,
        CustomerEmail: customer.email,
        CustomerMobile: customer.phone,
        InvoiceValue: total,
        CurrencyIso: "KWD",
        CallBackUrl: `${req.protocol}://${req.get("host")}/api/payment-success`,
        ErrorUrl: `${req.protocol}://${req.get("host")}/api/payment-error`,
        Language: "ar",
        InvoiceItems: items.map((i) => ({
          ItemName: i.name,
          Quantity: i.qty,
          UnitPrice: i.price,
        })),
      }),
    });

    const data = await response.json();

    if (!data.IsSuccess) {
      return res.status(400).json({ error: data.Message || "فشل إنشاء عملية الدفع" });
    }

    // رابط الدفع الذي نحوّل المستخدم إليه
    res.json({ paymentUrl: data.Data.PaymentURL, invoiceId: data.Data.InvoiceId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "خطأ في الخادم" });
  }
});

// 2) صفحة الرجوع بعد الدفع الناجح — تتحقق من حالة الفاتورة
app.get("/api/payment-success", async (req, res) => {
  try {
    const { paymentId } = req.query;

    const response = await fetch(`${BASE_URL}/v2/GetPaymentStatus`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ Key: paymentId, KeyType: "PaymentId" }),
    });

    const data = await response.json();
    const status = data?.Data?.InvoiceTransactions?.[0]?.TransactionStatus;

    if (status === "SUCCESS" || data?.Data?.InvoiceStatus === "Paid") {
      // ✅ هنا تحدّث طلب العميل في قاعدة بياناتك إلى "مدفوع"
      // وترسل له بيانات الاشتراك على بريده
      return res.redirect("/?payment=success");
    }
    return res.redirect("/?payment=failed");
  } catch (err) {
    console.error(err);
    res.redirect("/?payment=failed");
  }
});

// 3) صفحة الرجوع بعد فشل/إلغاء الدفع
app.get("/api/payment-error", (req, res) => {
  res.redirect("/?payment=failed");
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`السيرفر شغال على المنفذ ${PORT}`));
