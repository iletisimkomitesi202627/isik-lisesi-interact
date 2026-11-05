# FMV Işık Lisesi Interact Kulübü

Kurulum gerektirmeyen Türkçe kulüp sitesi. Ana sayfa `index.html`, yönetim sayfası `yonetim.html`.

## Takvim düzenleme

GitHub'da `etkinlikler.json` dosyasını açıp kalem simgesine basın. Bir kaydı kopyalayın, tarihini ve başlığını değiştirin. Tarih biçimi YYYY-AA-GG. Tek günlük etkinlikte bitiş ve başlangıç aynıdır. Saat veya yer bilgisi varsa açıklamaya ekleyin. Listeye kayıt eklerken kayıtlar arasına virgül koyun. Commit changes ile kaydedin. Haftalık liste ve aylık takvim aynı dosyayı kullanır. Hafta pazartesi başlar ve gün İstanbul saatine göre belirlenir.

## Yayın

GitHub Pages için Settings → Pages → Deploy from a branch → main → / (root) → Save. Yerel inceleme için proje klasöründe `python -m http.server 8000` çalıştırıp localhost:8000 adresini açın.
