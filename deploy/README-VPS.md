# Деплой на VPS

Схема: на VPS крутится Caddy в Docker. Caddy **сам выпускает и продлевает**
сертификаты Let's Encrypt — ничего вручную делать не нужно.

## Один раз: подготовка

1. **Доступ по ключу.** Попроси друга добавить публичный ключ на VPS
   (файл `~/.ssh/villain_vps.pub` на твоём маке) в `~/.ssh/authorized_keys`
   нужного пользователя. Проверка: `ssh -i ~/.ssh/villain_vps user@IP_VPS`

2. **Docker на VPS** (если ещё нет): `curl -fsSL https://get.docker.com | sh`

3. **Порты 80 и 443** должны быть открыты (ufw/firewalld/панель хостера)
   и не заняты другим веб-сервером (nginx/apache — остановить или подружить).

4. **DNS.** В панели reg.ru замени четыре A-записи `@` (185.199.x.153, GitHub)
   на одну A-запись `@ → IP_VPS`. CNAME `www → fedyuha.github.io` замени на
   `A www → IP_VPS` (или CNAME на сам домен). Пока DNS не переехал,
   Let's Encrypt сертификат не выпустится — Caddy будет ретраить сам.

5. В GitHub: Settings → Pages → Custom domain → Remove (чтобы GitHub
   не держал домен у себя).

## Деплой (каждый раз одна команда)

```bash
./deploy/deploy.sh user@IP_VPS
```

Скрипт: собирает сайт → заливает dist и конфиги по SSH → поднимает Caddy.
При первом запуске Caddy получит сертификат LE за ~30 секунд (когда DNS
уже указывает на VPS). Дальше продление автоматическое.

## Проверка

```bash
curl -I https://neovillain.space        # 200, выдан Let's Encrypt
docker logs villain-caddy --tail 50     # на VPS, если что-то не так
```
