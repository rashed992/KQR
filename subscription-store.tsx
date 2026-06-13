import React, { useState, useMemo } from "react";
import { ShoppingCart, X, Plus, Minus, Trash2, CheckCircle2, Sparkles, Tv, Music, Gamepad2, Cloud, BookOpen, Dumbbell } from "lucide-react";

const PRODUCTS = [
  {
    id: "netflix",
    name: "نتفلكس",
    plan: "خطة عادية - شهر واحد",
    price: 2.75,
    color: "from-red-600 to-rose-700",
    icon: Tv,
    desc: "أفلام ومسلسلات بجودة HD، حساب خاص بالكامل.",
  },
  {
    id: "youtube",
    name: "يوتيوب بريميوم",
    plan: "حساب فردي - شهر واحد",
    price: 1.25,
    color: "from-orange-500 to-red-500",
    icon: Tv,
    desc: "بدون إعلانات + تشغيل في الخلفية + يوتيوب ميوزك.",
  },
  {
    id: "spotify",
    name: "سبوتيفاي",
    plan: "بريميوم فردي - شهر واحد",
    price: 1.0,
    color: "from-green-500 to-emerald-600",
    icon: Music,
    desc: "استماع بلا إعلانات وجودة صوت عالية.",
  },
  {
    id: "shahid",
    name: "شاهد VIP",
    plan: "اشتراك شهري",
    price: 1.75,
    color: "from-sky-500 to-blue-600",
    icon: Tv,
    desc: "محتوى عربي حصري ومسلسلات تركية ورياضة.",
  },
  {
    id: "disney",
    name: "ديزني+",
    plan: "اشتراك شهري",
    price: 1.5,
    color: "from-indigo-500 to-violet-600",
    icon: Sparkles,
    desc: "أفلام ديزني وماروِل وبيكسار وناشيونال جيوغرافيك.",
  },
  {
    id: "psplus",
    name: "بلايستيشن بلس",
    plan: "إكستra - شهر واحد",
    price: 2.5,
    color: "from-blue-700 to-indigo-800",
    icon: Gamepad2,
    desc: "مكتبة ألعاب ضخمة + لعب أونلاين.",
  },
  {
    id: "icloud",
    name: "آي كلاود+",
    plan: "200 جيجا - شهري",
    price: 0.75,
    color: "from-slate-500 to-slate-700",
    icon: Cloud,
    desc: "مساحة تخزين إضافية لجميع أجهزة آبل.",
  },
  {
    id: "kindle",
    name: "أمازون كيندل أنليميتد",
    plan: "اشتراك شهري",
    price: 1.25,
    color: "from-amber-500 to-orange-600",
    icon: BookOpen,
    desc: "آلاف الكتب والروايات والمجلات بلا حدود.",
  },
];

function price(n) {
  return n.toFixed(2);
}

export default function SubscriptionStore() {
  const [cart, setCart] = useState({});
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState("cart"); // cart | form | done
  const [form, setForm] = useState({ name: "", email: "", phone: "" });

  const cartItems = useMemo(() => {
    return Object.entries(cart)
      .map(([id, qty]) => ({ ...PRODUCTS.find((p) => p.id === id), qty }))
      .filter((i) => i.qty > 0);
  }, [cart]);

  const total = cartItems.reduce((sum, i) => sum + i.price * i.qty, 0);
  const itemCount = cartItems.reduce((sum, i) => sum + i.qty, 0);

  function addToCart(id) {
    setCart((c) => ({ ...c, [id]: (c[id] || 0) + 1 }));
  }
  function changeQty(id, delta) {
    setCart((c) => {
      const next = Math.max(0, (c[id] || 0) + delta);
      return { ...c, [id]: next };
    });
  }
  function removeItem(id) {
    setCart((c) => ({ ...c, [id]: 0 }));
  }

  function openCart() {
    setCartOpen(true);
    setCheckoutStep("cart");
  }

  async function submitOrder(e) {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3001/api/create-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cartItems.map((i) => ({ name: i.name, qty: i.qty, price: i.price })),
          total,
          customer: form,
        }),
      });
      const data = await res.json();
      if (data.paymentUrl) {
        window.location.href = data.paymentUrl; // تحويل المستخدم لصفحة الدفع
      } else {
        alert(data.error || "حدث خطأ، حاول مرة أخرى");
      }
    } catch (err) {
      alert("تعذر الاتصال بخادم الدفع. تأكد أن السيرفر يعمل.");
    }
  }

  function resetAll() {
    setCart({});
    setCheckoutStep("cart");
    setCartOpen(false);
    setForm({ name: "", email: "", phone: "" });
  }

  return (
    <div dir="rtl" className="min-h-screen bg-[#0B0E14] text-[#EDEFF4] font-sans" style={{ fontFamily: "'Tajawal', 'Segoe UI', sans-serif" }}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;900&display=swap" rel="stylesheet" />

      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-white/5 bg-[#0B0E14]/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-fuchsia-500 to-indigo-600 flex items-center justify-center font-black text-lg">⚡</div>
            <div>
              <div className="font-black text-lg leading-none">باقاتي</div>
              <div className="text-[11px] text-white/40 leading-none mt-1">اشتراكاتك الرقمية، بضغطة واحدة</div>
            </div>
          </div>
          <button
            onClick={openCart}
            className="relative flex items-center gap-2 bg-white/5 hover:bg-white/10 transition-colors rounded-full px-4 py-2 text-sm font-medium"
          >
            <ShoppingCart size={18} />
            السلة
            {itemCount > 0 && (
              <span className="absolute -top-1 -left-1 bg-fuchsia-500 text-white text-[11px] rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-5 pt-14 pb-10 text-center">
        <div className="inline-block text-xs font-bold text-fuchsia-300 bg-fuchsia-500/10 border border-fuchsia-500/20 rounded-full px-3 py-1 mb-4">
          تسليم فوري بعد الدفع
        </div>
        <h1 className="text-4xl md:text-5xl font-black leading-tight mb-3">
          كل اشتراكاتك المفضّلة <span className="text-fuchsia-400">في مكان واحد</span>
        </h1>
        <p className="text-white/50 max-w-xl mx-auto text-sm md:text-base">
          نتفلكس، يوتيوب، سبوتيفاي، شاهد وأكثر — اختر اشتراكك، أضفه للسلة، وادفع بأمان.
        </p>
      </section>

      {/* Products grid */}
      <main className="max-w-6xl mx-auto px-5 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {PRODUCTS.map((p) => {
            const Icon = p.icon;
            const inCart = cart[p.id] || 0;
            return (
              <div
                key={p.id}
                className="group relative overflow-hidden rounded-2xl border border-white/8 bg-[#12151D] hover:border-white/15 transition-colors"
              >
                <div className={`h-1.5 w-full bg-gradient-to-l ${p.color}`} />
                <div className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${p.color} flex items-center justify-center`}>
                      <Icon size={22} className="text-white" />
                    </div>
                    <div className="text-left">
                      <div className="text-xl font-black">{price(p.price)} <span className="text-xs text-white/40 font-medium">د.ك</span></div>
                      <div className="text-[11px] text-white/35">شهريًا</div>
                    </div>
                  </div>
                  <h3 className="font-bold text-lg mb-0.5">{p.name}</h3>
                  <div className="text-xs text-white/40 mb-2">{p.plan}</div>
                  <p className="text-sm text-white/55 mb-4 leading-relaxed">{p.desc}</p>

                  {inCart === 0 ? (
                    <button
                      onClick={() => addToCart(p.id)}
                      className="w-full rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 py-2.5 text-sm font-bold transition-colors"
                    >
                      أضف للسلة
                    </button>
                  ) : (
                    <div className="flex items-center justify-between rounded-xl bg-white/5 border border-white/10 px-3 py-1.5">
                      <button onClick={() => changeQty(p.id, -1)} className="p-1.5 hover:text-fuchsia-400">
                        <Minus size={16} />
                      </button>
                      <span className="font-bold text-sm">{inCart} في السلة</span>
                      <button onClick={() => changeQty(p.id, 1)} className="p-1.5 hover:text-fuchsia-400">
                        <Plus size={16} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Cart drawer */}
      {cartOpen && (
        <div className="fixed inset-0 z-40 flex justify-end">
          <div className="absolute inset-0 bg-black/60" onClick={() => setCartOpen(false)} />
          <div className="relative w-full max-w-md h-full bg-[#12151D] border-r border-white/10 flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-white/8">
              <h2 className="font-black text-lg">
                {checkoutStep === "form" ? "بيانات الدفع" : checkoutStep === "done" ? "تم الطلب" : "سلة الاشتراكات"}
              </h2>
              <button onClick={() => setCartOpen(false)} className="text-white/40 hover:text-white">
                <X size={22} />
              </button>
            </div>

            {checkoutStep === "cart" && (
              <>
                <div className="flex-1 overflow-y-auto p-5 space-y-3">
                  {cartItems.length === 0 ? (
                    <div className="text-center text-white/40 mt-16 text-sm">
                      السلة فاضية. اختر اشتراك من المتجر وأضفه هنا.
                    </div>
                  ) : (
                    cartItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <div key={item.id} className="flex items-center gap-3 bg-white/5 rounded-xl p-3 border border-white/8">
                          <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center shrink-0`}>
                            <Icon size={18} className="text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="font-bold text-sm">{item.name}</div>
                            <div className="text-xs text-white/40">{price(item.price)} د.ك × {item.qty}</div>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <button onClick={() => changeQty(item.id, -1)} className="p-1 hover:text-fuchsia-400">
                              <Minus size={14} />
                            </button>
                            <span className="text-sm font-bold w-4 text-center">{item.qty}</span>
                            <button onClick={() => changeQty(item.id, 1)} className="p-1 hover:text-fuchsia-400">
                              <Plus size={14} />
                            </button>
                          </div>
                          <button onClick={() => removeItem(item.id)} className="text-white/30 hover:text-red-400 p-1">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>
                <div className="p-5 border-t border-white/8 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/50">الإجمالي</span>
                    <span className="font-black text-xl">{price(total)} د.ك</span>
                  </div>
                  <button
                    disabled={cartItems.length === 0}
                    onClick={() => setCheckoutStep("form")}
                    className="w-full rounded-xl bg-fuchsia-500 hover:bg-fuchsia-400 disabled:bg-white/10 disabled:text-white/30 transition-colors py-3 font-bold"
                  >
                    إتمام الطلب
                  </button>
                </div>
              </>
            )}

            {checkoutStep === "form" && (
              <form onSubmit={submitOrder} className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
                <div>
                  <label className="text-xs text-white/50 block mb-1.5">الاسم الكامل</label>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-fuchsia-400"
                    placeholder="مثال: محمد العتيبي"
                  />
                </div>
                <div>
                  <label className="text-xs text-white/50 block mb-1.5">البريد الإلكتروني (لإرسال الحساب)</label>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-fuchsia-400"
                    placeholder="example@email.com"
                  />
                </div>
                <div>
                  <label className="text-xs text-white/50 block mb-1.5">رقم الجوال</label>
                  <input
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-fuchsia-400"
                    placeholder="05xxxxxxxx"
                  />
                </div>

                <div className="mt-auto pt-2 space-y-3">
                  <div className="flex items-center justify-between text-sm bg-white/5 rounded-xl px-4 py-3">
                    <span className="text-white/50">المطلوب دفعه</span>
                    <span className="font-black text-lg">{price(total)} د.ك</span>
                  </div>
                  <button type="submit" className="w-full rounded-xl bg-fuchsia-500 hover:bg-fuchsia-400 transition-colors py-3 font-bold">
                    تأكيد ودفع
                  </button>
                  <button type="button" onClick={() => setCheckoutStep("cart")} className="w-full text-center text-xs text-white/40 hover:text-white">
                    رجوع للسلة
                  </button>
                </div>
              </form>
            )}

            {checkoutStep === "done" && (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                <div className="w-16 h-16 rounded-full bg-emerald-500/15 flex items-center justify-center mb-4">
                  <CheckCircle2 size={32} className="text-emerald-400" />
                </div>
                <h3 className="font-black text-xl mb-2">تم استلام طلبك!</h3>
                <p className="text-sm text-white/50 mb-6">
                  سيتم إرسال تفاصيل الاشتراك إلى {form.email || "بريدك الإلكتروني"} خلال دقائق.
                </p>
                <button onClick={resetAll} className="rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 px-6 py-2.5 text-sm font-bold">
                  متابعة التصفح
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <footer className="border-t border-white/5 py-6 text-center text-xs text-white/30">
        هذا تصميم تجريبي لمتجر اشتراكات — يمكن ربطه ببوابة دفع حقيقية لاحقًا.
      </footer>
    </div>
  );
}
