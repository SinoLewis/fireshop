# FIRESHOP

## 1. Svelte Web Components

| NO. | WC.               | JS & Stores & Utils                          | HTML    | CSS                                |
| --- | ----------------- | -------------------------------------------- | ------- | ---------------------------------- |
| 1.  | checkout-cart     | (c) Default image onLoad                     | - icons | - padding                          |
|     |                   | - Add favourite fuctionality                 |         | - Bordered Card cart w/ Title      |
|     |                   |                                              |         | - Formatted                        |
| 2.  | checkout-delivery | (c) Route to /order afta handleSubmit        |         | - Responsive Elements Placing      |
|     |                   | (c) Post delivery Input clearing             |         | - Button color afta & b4 submit    |
|     |                   | (c) submit not valid if empty inputs         |         |                                    |
|     |                   | - My custom Geolocation & delivery           |         |                                    |
|     |                   | - isAddress valid check                      |         |                                    |
|     |                   | - updateProductQuantity afta submit          |         |                                    |
|     |                   | - Phone input w/ Area Codes                  |         |                                    |
|     |                   | - Discord to revolt & matrix                 |         |                                    |
|     |                   |                                              |         |                                    |
| 3.  | checkout-order    | - Delivery Package testin                    |         | (c) Bordered receipt cart w/ Title |
|     |                   |                                              |         | - Confirm Popup styling            |
|     |                   |                                              |         |                                    |
| 4.  | supa-signout      | (c) Reactive data after signout              |         | - Default Button styling           |
|     |                   | (c) Toast after signout validation           |         |                                    |
|     |                   |                                              |         |                                    |
| 5.  | supa-signin       | (c) Toast after signin validation            |         | - Default Button styling           |
|     |                   | (c) User email avatar image                  |         |                                    |
|     |                   | - Publish google signin API                  |         |                                    |
|     |                   |                                              |         |                                    |
| 6.  | meili-search      | - Production search server or API            |         |                                    |
|     |                   | - conf & security                            |         |                                    |
|     |                   |                                              |         |                                    |
| 7.  | app               | - Reactivity issues: avatar, isFormValid     |         |                                    |
|     |                   | - AI model images                            |         |                                    |
|     |                   | - Glovo, Jumia, Sendy business delivery init |         |                                    |
|     |                   |                                              |         |                                    |

## 2. Beta Features

- REST to tRPC
- Edge Programming: use callUserAPI from app/util/firebase.ts 4 serveless functions
- How postcss & tailwindcss work
- typescript framework config (fireship tuts) & remove any types
- To async get local user auth if secure using JWT
- Localstorage stores or Cached API request using PWA or Redis 4 supa & maps APIS
- Set supa db policies & Foreign Keys setup
- Local supa db
- supa auth extra = [captcha, mfa, apple signin]

## 3. Hugo Markdown

1. User policy & Privacy & ToS pages
1. Hugo config review
1. footer.html: Need valid help email eg. help@fireshop.shop
1. footer.html: create helpful links eg github, discord, twitter, whatsapp-business

## 4. SERVER:

1. Static file mngt

> If db changes; Hugo needs new Product(s) content & new remote Product.id[]
> Genrating glovo products

2. Image App & svelte wc compos

> meilisearch image url
> Image generator as like firship (nextjs vercel app): home.html: image gifs, home logo & pic

## 5. Full PWA

1.  Set debug false in prod

2.  Install banner (USER)
    4.1 Fulfil PWA requirements: chrome & firefox & top browsers.
    4.2 New Icons in manifest not loading
    4.3 Run Site in docker or adnroid emulator
3.  Offline mode
    5.1 Caching: Versioning, Dynamic caching
    5.2 Offline mode API calls

4.  Update
    6.1 Push & sound notifications
    5.2 Background synchronization: For Rest API
    6.3 Web periodic background sync
    6.4 Background Fetch
5.  Os Integration
6.  Detection: how your users interact with your app
7.  Window Mngt
8.  Enhancments: splash screens, app shortcuts, and how sessions work.
9.  PWA Audit for site
10. Experimental Features

## 6. DevSecOps CI/CD

1. Synk vulnerabilty scan
2. Testin: Ts checks, Svelte app test
3. Docker images & container mngt: push image to registry

## 7. Deployment (Local = Ngrok & Cloud = GCP)

1. Docker Compose
2. SSL certs & ip addr to domain name in client & server app

3. sys to harderend & secure linux kernel (OS Cloud Server or Docker)
4. ads rev

## 8. Perfomance & Optimizaion

1. memory & disk space stats
2. Async scripts & Partydown.js & WebWorkers
3. Purge unused css & adding Browser support
4. Purge unused js

## 9. Business

1. Business Plan docs
2. Balance sheets & Balance Investments (Economics Explained)
3. Load products on Sendy fulfilment
4. Setting Products on market websites = jumia & Glovo
