# CampusCareer
### Üniversite Öğrencileri İçin Entegre Kariyer ve Etkinlik Yönetim Sistemi

CampusCareer, üniversite öğrencilerinin ve yeni mezunların staj, iş ilanları ve teknik gelişim etkinliklerine (hackathon, bootcamp, workshop vb.) tek bir platform üzerinden erişebilmesini sağlayan React Native tabanlı bir mobil uygulamadır.

## Proje Amacı
Günümüzde öğrenciler, kariyer fırsatlarını takip ederken platform kirliliği ve odaklanma sorunu yaşamaktadır. CampusCareer, iş dünyası ile gelişim ekosistemini tek bir çatı altında birleştirerek kullanıcılara ilgi alanlarına göre özelleştirilmiş ve denetlenmiş bir kariyer akışı sunmayı amaçlar.

## Kullanılan Teknolojiler (Tech Stack)
* Frontend: React Native ve TypeScript kullanılarak çapraz platform desteği sağlanmıştır.
* Backend: Sunucusuz mimari (Serverless) yaklaşımıyla Google Firebase (Cloud Firestore ve Authentication) kullanılmıştır.
* Durum Yönetimi: Uygulama genelinde oturum ve tema yönetimi için Context API tercih edilmiştir.
* API Entegrasyonları: Dinamik veri akışı için RapidAPI (JSearch) ve SerpApi (Google Events) servisleri entegre edilmiştir.
* Bildirim Sistemi: Notifee ve Firebase Cloud Messaging altyapısı kullanılmıştır.

## Yazılım Mimarisi
Proje, mantıksal katmanların birbirinden ayrıldığı MVVM (Model-View-ViewModel) tasarım deseni ve Bileşen Tabanlı Mimari üzerine kurgulanmıştır:
* Model: Firestore ve dış API servisleri üzerinden veri yönetimini üstlenir.
* View: Kullanıcı odaklı ve minimalist arayüz bileşenlerini içerir.
* ViewModel: İş mantığının ve uygulama durumunun (AuthContext vb.) yönetildiği katmandır.



## Temel Özellikler
* Rol Tabanlı Erişim Kontrolü (RBAC): Öğrenci, Firma ve Admin rolleri için ayrıştırılmış yetki ve arayüzler sunulur.
* Admin Onay Mekanizması: Sisteme girilen ilanların yönetici denetiminden geçmeden yayına alınmaması sayesinde yüksek içerik kalitesi sağlanır.
* Semantik Arama: Kullanıcının Türkçe aramalarını global API parametrelerine dönüştüren akıllı sorgu mantığı geliştirilmiştir.
* Akıllı Takip: Başvurulan ve favoriye alınan ilanlar için gerçek zamanlı senkronizasyon desteği mevcuttur.

## Yazılım Kalitesi ve Test Süreçleri
* Birim Testler: Jest kütüphanesi kullanılarak çekirdek iş mantığı üzerinde 33 kritik fonksiyon başarıyla test edilmiştir.
* Statik Kod Analizi: SonarQube entegrasyonu ile Güvenlik ve Bakım Yapılabilirlik kategorilerinde en yüksek not olan A derecesi alınmıştır.
* Kod Kalitesi: Modüler yapı sayesinde kod tekrarı oranı %0.3 seviyesinde tutulmuştur.
* Hata Yönetimi: Geliştirme sürecinde tespit edilen teknik hatalar (id undefined, onaysız ilan gösterimi vb.) dökümante edilmiş ve sprint süreçlerinde çözümlenmiştir.



## Kurulum
1. Proje deposunu yerel makinenize klonlayın.
2. npm install komutu ile gerekli bağımlılıkları yükleyin.
3. Firebase konfigürasyon dosyalarını (google-services.json) ilgili dizinlere yerleştirin.
4. npx react-native run-android veya run-ios komutu ile uygulamayı başlatın.

## Proje Ekibi
* Sevde Gül Şahin: Proje Yönetimi, API Orkestrasyonu, Admin Paneli.
* Süeda Nur Sarıcan: Firebase Entegrasyonu, Kimlik Doğrulama süreçleri, UI Geliştirme.
* Fatımanur Kantar: Veri Modelleme, Test süreçleri, Dokümantasyon.

---
Bu çalışma BİL403 Yazılım Mühendisliği dersi dönem projesi kapsamında hazırlanmıştır.
