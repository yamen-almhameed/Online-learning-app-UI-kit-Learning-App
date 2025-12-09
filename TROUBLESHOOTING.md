# 🔧 حلول المشاكل الشائعة - Troubleshooting Guide

## 🔥 مشاكل Debugger و Timeout

### ✅ الحل 100% مضمون لمشاكل Debugger

#### 🔥 1 — عطّل Bridgeless Debugger

افتح Developer Menu:
- اضغط `Ctrl + M` (Android) أو `Cmd + D` (iOS)
- أو هز الجهاز

أوقف التالي:
- ❌ Enable Bridgeless Debugger
- ❌ Hermes Inspector
- ❌ C++ Debugger
- ❌ Use Native Debugger

ثم شغّل:
- ✔ Debug JS Remotely (Chrome)
- أو
- ✔ React DevTools

#### 🔥 2 — أعد تشغيل المترو

في التيرمنال:

```bash
# أوقف المترو
Ctrl + C

# أعد تشغيله مع مسح الـ Cache
npx react-native start --reset-cache
```

#### 🔥 3 — أعد ربط الاتصال بين الهاتف والمترو

```bash
adb reverse tcp:8081 tcp:8081
adb reverse tcp:8088 tcp:8088
```

#### 🔥 4 — أغلق كل تبويبات المتصفح قبل فتح Debugger

لأن Chrome يسبب Timeout إذا مفتوح فيه تبويبات كثيرة.

---

## 🌐 مشاكل الاتصال بالـ API

### مشكلة: Network Error أو Timeout

#### الحلول:

1. **تأكد من IP Address:**
   - Android Emulator: استخدم `10.0.2.2`
   - iOS Simulator: استخدم `localhost`
   - جهاز حقيقي: استخدم IP الكمبيوتر (مثل `192.168.137.1`)

2. **تأكد من أن الـ Server يعمل:**
   ```bash
   # تحقق من أن الـ Server يعمل على المنفذ الصحيح
   curl http://localhost:5000/api/health
   ```

3. **أعد تشغيل المترو:**
   ```bash
   npx react-native start --reset-cache
   ```

---

## 🔐 مشاكل Authentication

### مشكلة: Session Expired أو 401 Unauthorized

#### الحلول:

1. **امسح الـ Token:**
   - امسح بيانات التطبيق من إعدادات الجهاز
   - أو استخدم `AsyncStorage.clear()` في الكود

2. **تأكد من أن الـ Token صحيح:**
   - تحقق من `apiClient.ts` أن الـ Token يُرسل في Headers

---

## 📱 مشاكل Build

### مشكلة: Build Failed

#### الحلول:

1. **Android:**
   ```bash
   cd android
   ./gradlew clean
   cd ..
   npx react-native run-android
   ```

2. **iOS:**
   ```bash
   cd ios
   pod deintegrate
   pod install
   cd ..
   npx react-native run-ios
   ```

---

## 🎨 مشاكل Navigation

### مشكلة: Navigation لا يعمل

#### الحلول:

1. **تأكد من أن NavigationRef جاهز:**
   ```typescript
   if (navigationRef.isReady()) {
     navigationRef.navigate('ScreenName');
   }
   ```

2. **أعد تشغيل التطبيق:**
   ```bash
   npx react-native run-android
   # أو
   npx react-native run-ios
   ```

---

## 💾 مشاكل AsyncStorage

### مشكلة: البيانات لا تُحفظ

#### الحلول:

1. **تأكد من أن AsyncStorage مُثبت:**
   ```bash
   npm install @react-native-async-storage/async-storage
   ```

2. **أعد ربط Native Modules:**
   ```bash
   npx react-native unlink @react-native-async-storage/async-storage
   npx react-native link @react-native-async-storage/async-storage
   ```

---

## 🐛 مشاكل أخرى

### مشكلة: التطبيق بطيء

#### الحلول:

1. **أعد بناء التطبيق:**
   ```bash
   npx react-native run-android --variant=release
   ```

2. **استخدم Hermes Engine:**
   - تأكد من تفعيل Hermes في `android/app/build.gradle`

---

## 📞 الدعم

إذا استمرت المشكلة، تحقق من:
- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [React Native Community](https://github.com/react-native-community)

