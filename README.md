# HyperDart Job Search Component

An interactive, responsive job discovery component designed for the **HyperDart** search engine ecosystem 🚀. It automatically interprets user search intent, maps search terms into actionable multi-variable filters, and serves real-time job listings powered by the **SerpApi Google Jobs API** 💼.

---

## Features

* 🧠 **Natural Language Intent Mapping:** Parses input queries directly (e.g., *"remote software developer jobs in bangalore for freshers"*) and auto-populates all corresponding UI filters.
* 🎛️ **Comprehensive Filter Panel:** Top-mounted control bar covering **Role**, **Location**, **Job Type**, **Work Model**, **Experience**, **Joining Timeline**, and **Target Companies**—with flexible `"Any"` defaults.
* 🏢 **Rich Job Cards:** Displays essential metadata including company logos/fallback avatars, verified tags (Remote, Full-time, Salary), expandable job overviews, and 1-click apply links.
* ⚡ **Seamless HyperDart Lifecycle Integration:** Wrapped using `@hyperdart/frontend`'s `withHD` HOC with complete `componentLoaded()` lifecycle support.

---

## 🛠️ Tech Stack

* **Frontend:** React, Material UI (`@mui/material`), Emotion
* **Platform SDK:** `@hyperdart/frontend`
* **Data Source:** SerpApi (Google Jobs Engine 🔍)
* **Middleware:** Node.js, Express, CORS
