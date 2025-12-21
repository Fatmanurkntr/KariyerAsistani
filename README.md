# CampusCareer
### Üniversite Öğrencileri İçin Entegre Kariyer ve Etkinlik Yönetim Sistemi

[cite_start]CampusCareer, üniversite öğrencilerinin ve yeni mezunların staj, iş ilanları ve teknik gelişim etkinliklerine (hackathon, bootcamp, workshop vb.) tek bir platform üzerinden erişebilmesini sağlayan React Native tabanlı bir mobil uygulamadır[cite: 24, 25, 76].

## Proje Amacı
[cite_start]Günümüzde öğrenciler, kariyer fırsatlarını takip ederken platform kirliliği ve odaklanma sorunu yaşamaktadır[cite: 22, 72]. [cite_start]CampusCareer, iş dünyası ile gelişim ekosistemini tek bir çatı altında birleştirerek kullanıcılara ilgi alanlarına göre özelleştirilmiş ve denetlenmiş bir kariyer akışı sunmayı amaçlar[cite: 73, 95].

## Kullanılan Teknolojiler (Tech Stack)
* [cite_start]**Frontend:** React Native ve TypeScript kullanılarak çapraz platform desteği sağlanmıştır[cite: 25, 77, 249].
* [cite_start]**Backend:** Sunucusuz mimari (Serverless) yaklaşımıyla Google Firebase (Cloud Firestore ve Authentication) kullanılmıştır[cite: 26, 78, 251].
* [cite_start]**Durum Yönetimi:** Uygulama genelinde oturum ve tema yönetimi için Context API tercih edilmiştir[cite: 182, 253].
* [cite_start]**API Entegrasyonları:** Dinamik veri akışı için RapidAPI (JSearch) ve SerpApi (Google Events) servisleri entegre edilmiştir[cite: 27, 49, 233].
* [cite_start]**Bildirim Sistemi:** Notifee ve Firebase Cloud Messaging altyapısı kullanılmıştır[cite: 230].

## Yazılım Mimarisi
[cite_start]Proje, mantıksal katmanların birbirinden ayrıldığı **MVVM (Model-View-ViewModel)** tasarım deseni üzerine kurgulanmıştır[cite: 177]:
* [cite_start]**Model:** Firestore ve dış API servisleri üzerinden veri yönetimini üstlenir[cite: 178].
* [cite_start]**View:** Kullanıcı odaklı ve minimalist arayüz bileşenlerini içerir[cite: 180].
* [cite_start]**ViewModel:** İş mantığının ve uygulama durumunun (AuthContext vb.) yönetildiği katmandır[cite: 182].



## Yazılım Kalitesi ve Test Süreçleri
* [cite_start]**Birim Testler:** Jest kütüphanesi kullanılarak çekirdek iş mantığı üzerinde 33 kritik fonksiyon başarıyla test edilmiştir[cite: 288, 291].
* [cite_start]**Statik Kod Analizi:** SonarQube entegrasyonu ile Güvenlik ve Bakım Yapılabilirlik kategorilerinde en yüksek not olan **A derecesi** alınmıştır[cite: 316, 319, 323].
* [cite_start]**Hata Yönetimi:** Geliştirme sürecinde tespit edilen kritik hatalar (id undefined, onaysız ilan gösterimi vb.) dökümante edilerek Sprint süreçlerinde çözümlenmiştir[cite: 306, 309].



## Kurulum
1. Proje deposunu yerel makinenize klonlayın.
2. `npm install` komutu ile gerekli bağımlılıkları yükleyin.
3. Firebase konfigürasyon dosyalarını (google-services.json) ilgili dizinlere yerleştirin.
4. `npx react-native run-android` veya `run-ios` komutu ile uygulamayı başlatın.

## Proje Ekibi
* [cite_start]**Sevde Gül Şahin:** Proje Yönetimi, API Orkestrasyonu, Admin Paneli[cite: 14].
* [cite_start]**Süeda Nur Sarıcan:** Firebase Entegrasyonu, Kimlik Doğrulama süreçleri, UI Geliştirme[cite: 15].
* [cite_start]**Fatımanur Kantar:** Veri Modelleme, Test süreçleri, Dokümantasyon[cite: 16].

---
[cite_start]*Bu çalışma BİL403 Yazılım Mühendisliği dersi dönem projesi kapsamında hazırlanmıştır[cite: 5].*
